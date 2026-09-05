/* ============================================================
   JOLLOF LIVING — router
   A tiny stack-based router. Android's back button pops it,
   which is what people expect; leaving the stack empty exits.
   ============================================================ */
"use strict";

let renderFn = null;
const stack = [{ name: "home", params: {} }];

export const current = () => stack[stack.length - 1];
export const depth = () => stack.length;

export function attach(fn) { renderFn = fn; }

/** Tabs replace the root; everything else pushes. */
const ROOTS = new Set(["home", "explore", "wishlist", "trips", "account", "owner"]);

export function go(name, params = {}) {
  if (ROOTS.has(name)) {
    stack.length = 0;
    stack.push({ name, params });
  } else {
    stack.push({ name, params });
  }
  renderFn?.();
}

export function back() {
  if (stack.length > 1) {
    stack.pop();
    renderFn?.();
    return true;
  }
  return false;
}

export function reset(name = "home") {
  stack.length = 0;
  stack.push({ name, params: {} });
  renderFn?.();
}
