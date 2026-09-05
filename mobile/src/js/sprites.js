/* ============================================================
   JOLLOF LIVING — sprite engine
   ------------------------------------------------------------
   Frame-by-frame animation from a single horizontal sprite
   sheet, driven by requestAnimationFrame and steps() CSS.

   Why sprite sheets rather than GIF or video: one HTTP-free
   bundled PNG, exact control over frame rate, no decode stall
   on a mid-range phone, and it pauses cleanly when off-screen
   so it costs nothing when the user is not looking at it.
   ============================================================ */
"use strict";

/** Every animation in the app, with its sheet geometry. */
export const SHEETS = {
  /* Onboarding — one per intro page. */
  skyline:  { src: "sprites/skyline.png",  frames: 24, w: 360, h: 360, fps: 14, loop: true },
  keys:     { src: "sprites/keys.png",     frames: 20, w: 360, h: 360, fps: 16, loop: true },
  concierge:{ src: "sprites/concierge.png",frames: 22, w: 360, h: 360, fps: 14, loop: true },
  compass:  { src: "sprites/compass.png",  frames: 24, w: 360, h: 360, fps: 15, loop: true },

  /* In-app states. */
  heart:    { src: "sprites/heart.png",    frames: 18, w: 240, h: 240, fps: 18, loop: false },
  success:  { src: "sprites/success.png",  frames: 22, w: 260, h: 260, fps: 20, loop: false },
  empty:    { src: "sprites/empty.png",    frames: 20, w: 240, h: 240, fps: 12, loop: true },
  loading:  { src: "sprites/loading.png",  frames: 16, w: 160, h: 160, fps: 20, loop: true },
  offline:  { src: "sprites/offline.png",  frames: 18, w: 240, h: 240, fps: 12, loop: true },
};

/**
 * A running sprite. Created through mountSprite; you rarely touch this
 * directly, but play/pause/destroy are there when a screen needs them.
 */
class Sprite {
  constructor(el, sheet, opts = {}) {
    this.el = el;
    this.sheet = sheet;
    this.frame = 0;
    this.raf = null;
    this.last = 0;
    this.loop = opts.loop ?? sheet.loop;
    this.fps = opts.fps || sheet.fps;
    this.onEnd = opts.onEnd;
    this.visible = true;

    el.classList.add("sprite");
    el.style.setProperty("--sprite-w", sheet.w + "px");
    el.style.setProperty("--sprite-h", sheet.h + "px");
    el.style.width = sheet.w + "px";
    el.style.height = sheet.h + "px";
    el.style.backgroundImage = `url("${sheet.src}")`;
    el.style.backgroundSize = `${sheet.w * sheet.frames}px ${sheet.h}px`;
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = "0 0";

    // Stop animating whatever scrolls out of view — battery matters more
    // than a frame nobody can see.
    if ("IntersectionObserver" in window) {
      this.io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          this.visible = e.isIntersecting;
          if (this.visible && !this.raf) this.play();
          if (!this.visible) this.pause();
        }
      }, { threshold: 0.05 });
      this.io.observe(el);
    }
  }

  step(ts) {
    if (!this.last) this.last = ts;
    const per = 1000 / this.fps;
    if (ts - this.last >= per) {
      this.last = ts;
      this.frame++;
      if (this.frame >= this.sheet.frames) {
        if (this.loop) {
          this.frame = 0;
        } else {
          this.frame = this.sheet.frames - 1;
          this.paint();
          this.raf = null;
          if (this.onEnd) this.onEnd();
          return;
        }
      }
      this.paint();
    }
    this.raf = requestAnimationFrame((t) => this.step(t));
  }

  paint() {
    this.el.style.backgroundPosition = `-${this.frame * this.sheet.w}px 0`;
  }

  play() {
    if (this.raf) return this;
    this.last = 0;
    this.raf = requestAnimationFrame((t) => this.step(t));
    return this;
  }

  pause() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    return this;
  }

  restart() {
    this.frame = 0;
    this.paint();
    return this.play();
  }

  destroy() {
    this.pause();
    if (this.io) this.io.disconnect();
  }
}

const living = new Set();

/**
 * Attach a sprite to an element.
 *   mountSprite(el, "heart", { onEnd: () => ... })
 */
export function mountSprite(el, name, opts = {}) {
  const sheet = SHEETS[name];
  if (!el || !sheet) return null;
  const s = new Sprite(el, sheet, opts);
  living.add(s);
  s.play();
  return s;
}

/** Wire up every <div data-sprite="name"> inside a container. */
export function mountAll(root = document) {
  const made = [];
  root.querySelectorAll("[data-sprite]").forEach((el) => {
    if (el.__sprite) return;
    const s = mountSprite(el, el.dataset.sprite, {
      loop: el.dataset.spriteLoop === "false" ? false : undefined,
      fps: el.dataset.spriteFps ? Number(el.dataset.spriteFps) : undefined,
    });
    if (s) { el.__sprite = s; made.push(s); }
  });
  return made;
}

/** Tear down sprites under a container that is about to be replaced. */
export function unmountAll(root = document) {
  root.querySelectorAll("[data-sprite]").forEach((el) => {
    if (el.__sprite) {
      el.__sprite.destroy();
      living.delete(el.__sprite);
      el.__sprite = null;
    }
  });
}

/** Markup helper so screens stay readable. */
export function spriteTag(name, extraClass = "", attrs = "") {
  return `<div class="sprite-holder ${extraClass}"><div data-sprite="${name}" ${attrs}></div></div>`;
}
