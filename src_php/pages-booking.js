/* ============================================================
   JOLLOF LIVING — pages-booking.js
   booking flow · confirmation · trips · wishlist · compare
   ============================================================ */

const BOOK_STATE = {
  id:null, in:todayStr(7), out:todayStr(10), guests:2, policy:"moderate",
  addons:[], promo:null, gift:null, method:"card", split:false, req:false,
};

function pBooking(id, q) {
  const p=PROPERTIES.find(x=>x.id===id); if(!p) return p404();
  BOOK_STATE.id=id; BOOK_STATE.req=!!(q&&q.req); BOOK_STATE.addons=[]; BOOK_STATE.promo=null; BOOK_STATE.gift=null; BOOK_STATE.method="card"; BOOK_STATE.split=false;
  return `
  <div class="page-top"></div>
  <div class="page-head"><div class="wrap">
    <div class="crumbs"><a href="${URL('/')}">Home</a> / <a href="${URL(`/stay/${id}`)}">${esc(p.name)}</a> / ${BOOK_STATE.req?"Request to Book":"Checkout"}</div>
    <h1>${BOOK_STATE.req?"Request to <em class='serif-i'>book</em>":"Complete your <em class='serif-i'>reservation</em>"}</h1>
    <p>${esc(p.name)} · ${esc(p.area)}, ${esc(p.city)} · ${I.star} ${p.rating.toFixed(2)} (${p.reviews})</p>
  </div></div>
  <div class="page-body"><div class="wrap" style="max-width:1060px">
    <div class="wizard-steps">${["Dates & guests","Add-ons & policy","Payment","Review & confirm"].map((s,i)=>`<div class="ws ${i===0?"done":i<=0?"done":""}" id="ws${i}"><span class="lbl">${i+1}. ${s}</span></div>`).join("")}</div>
    <div id="bkStage"></div>
  </div></div>`;
}
function bkStep(n){ $("#bkStage").innerHTML = [bkDates, bkAddons, bkPayment, bkReview][n](); window.scrollTo({top:0,behavior:"smooth"}); }
function bkCalc(){
  const p=PROPERTIES.find(x=>x.id===BOOK_STATE.id);
  const n=nightsBetween(BOOK_STATE.in,BOOK_STATE.out)||3;
  const addons=BOOK_STATE.addons.map(k=>({k}));
  return priceMath(p,n,{addons,promo:BOOK_STATE.promo,gift:BOOK_STATE.gift});
}
function bkDates(){
  const p=PROPERTIES.find(x=>x.id===BOOK_STATE.id);
  const n=nightsBetween(BOOK_STATE.in,BOOK_STATE.out)||3;
  return `
  <div class="wizard-step">
    <h2>When are you staying?</h2>
    <div class="sub">Flexible? We'll show you the cheapest nearby dates after selection.</div>
    <div class="grid-2" style="grid-template-columns:1.1fr .9fr">
      <div style="display:flex;justify-content:center">${calWidget({in:BOOK_STATE.in,out:BOOK_STATE.out},tourRanges(p.id))}</div>
      <div class="stack">
        <div class="panel">
          <div class="frm-row"><label>Check-in</label><input type="date" class="inp" id="bkIn" value="${BOOK_STATE.in}" min="${todayStr()}"></div>
          <div class="frm-row"><label>Check-out</label><input type="date" class="inp" id="bkOut" value="${BOOK_STATE.out}" min="${todayStr()}"></div>
          <div class="frm-row"><label>Guests (max ${p.guests})</label>
            <div class="stepper"><button id="bkGd">${I.minus}</button><b id="bkG">${BOOK_STATE.guests}</b><button id="bkGu">${I.plus}</button></div></div>
          <label class="chk" style="margin-top:6px"><input type="checkbox" id="bkFlex"> I'm flexible — show cheapest dates</label>
        </div>
        <div class="panel"><h3 style="font-size:18px">Duration benefits</h3>
          <div class="krow"><span class="k">Nightly rate</span><span class="v" data-price="${p.price}">${fmt(p.price)}</span></div>
          <div class="krow"><span class="k">Weekly (7+)</span><span class="v">−12%</span></div>
          <div class="krow"><span class="k">Monthly (30+)</span><span class="v">−25% + split pay + lease</span></div>
          <div class="krow"><span class="k">${n} nights × ${fmt(p.price)}</span><span class="v"><b style="font-family:var(--fs-serif);font-size:19px" data-price="${bkCalc().subtotal}">${fmt(bkCalc().subtotal)}</b></span></div>
        </div>
      </div>
    </div>
    <div class="wizard-foot">
      <a class="btn btn-ghost" href="${URL(`/stay/${BOOK_STATE.id}`)}">← Back to listing</a>
      <button class="btn btn-gold" id="bkNext1">Continue → Add-ons &amp; policy</button>
    </div>
  </div>`;
}
function bkAddons(){
  return `
  <div class="wizard-step">
    <h2>Make it yours</h2>
    <div class="sub">Optional add-ons, cancellation policy, and the agreement that fits your stay.</div>
    <div class="grid-2" style="grid-template-columns:1.05fr .95fr">
      <div class="grid-2" style="grid-template-columns:1fr 1fr;gap:10px" id="bkAddons">
        ${Object.entries(ADDONS).map(([k,a])=>`
          <label class="panel" style="cursor:pointer;padding:16px;display:flex;flex-direction:column;gap:7px;${BOOK_STATE.addons.includes(k)?"border-color:var(--accent);background:linear-gradient(150deg,var(--card),var(--gold-soft))":""}">
            <div style="display:flex;align-items:center;gap:10px"><span class="why-ico" style="width:36px;height:36px;border-radius:10px;margin:0">${I[a.ico]||I.spark}</span>
            <input type="checkbox" data-addon="${k}" ${BOOK_STATE.addons.includes(k)?"checked":""} style="accent-color:var(--accent);width:16px;height:16px;margin-left:auto"></div>
            <b style="font-family:var(--fs-serif);font-size:17px;font-weight:600">${a.name}</b>
            <div class="small">${a.note}</div>
            <div style="color:var(--accent);font-weight:500;font-size:13.5px">${a.price>=1?"+ "+fmt(a.price):"+"+Math.round(a.price*100)+"% of subtotal"}</div>
          </label>`).join("")}
      </div>
      <div class="stack">
        <div class="panel">
          <h3 style="font-size:18px">Cancellation policy</h3>
          <select class="sel" id="bkPol" style="margin-top:8px">
            <option value="flexible" ${BOOK_STATE.policy==="flexible"?"selected":""}>Flexible — full refund to 48h before</option>
            <option value="moderate" ${BOOK_STATE.policy==="moderate"?"selected":""}>Moderate — full refund to 5 days · 50% after</option>
            <option value="strict" ${BOOK_STATE.policy==="strict"?"selected":""}>Strict — 50% refund to 14 days</option>
          </select>
          <div class="small" style="margin-top:10px">${I.shield} Refunds are processed to your original payment method within 3–5 days. Policies are always shown before you pay.</div>
        </div>
        <div class="panel" id="bkSplitNote">
          <h3 style="font-size:18px">Extended stay agreement</h3>
          <p class="muted" style="font-size:13.5px">For 30+ nights we generate a digital lease-style agreement. ${I.check} Signed securely, stored in your encrypted vault.</p>
        </div>
        <div class="panel">
          <h3 style="font-size:18px">Split payments</h3>
          <label class="chk" style="margin-top:6px"><input type="checkbox" id="bkSplit" ${BOOK_STATE.split?"checked":""}> Pay 50% now, 50% at check-in (30+ nights)</label>
          <div class="small" style="margin-top:6px">Eases the financial burden of long-term luxury living.</div>
        </div>
      </div>
    </div>
    <div class="wizard-foot">
      <button class="btn btn-ghost" onclick="bkStep(0)">← Dates &amp; guests</button>
      <button class="btn btn-gold" id="bkNext2">Continue → Payment</button>
    </div>
  </div>`;
}
function bkPayment(){
  const m=bkCalc();
  return `
  <div class="wizard-step">
    <h2>Payment</h2>
    <div class="sub">Multi-currency · escrow-protected · PCI-DSS secure. You won't be charged until you confirm.</div>
    <div class="grid-2" style="grid-template-columns:1fr 1fr">
      <div>
        <div class="grid-2" style="grid-template-columns:1fr 1fr;gap:9px">
          ${PAY_METHODS.map(pm=>`<button class="panel pay-method" data-pm="${pm.id}" style="text-align:left;cursor:pointer;padding:14px;display:flex;gap:10px;align-items:center;${BOOK_STATE.method===pm.id?"border-color:var(--accent);background:linear-gradient(150deg,var(--card),var(--gold-soft))":""}">
            <span class="why-ico" style="width:34px;height:34px;border-radius:9px;margin:0">${I[pm.ico]}</span>
            <span><b style="font-size:13.5px;font-weight:500;display:block">${pm.name}</b><span class="small" style="font-size:11px">${pm.note}</span></span>
          </button>`).join("")}
        </div>
        <div class="ai-callout" style="margin-top:14px">${I.bolt}<span><b>Crypto (BTC / USDT)</b> moves to beta next quarter — join the waitlist from your account.</span></div>
        <div class="panel" style="margin-top:14px">
          <h3 style="font-size:17px">Promo code &amp; gift cards</h3>
          <div style="display:flex;gap:8px;margin-top:10px">
            <input class="inp" id="bkPromo" placeholder="e.g. JOLLOF10" value="${BOOK_STATE.promo||""}">
            <button class="btn btn-green btn-sm" id="bkPromoGo">Apply</button>
          </div>
          <div class="small" style="margin-top:8px">Try <b>JOLLOF10</b> (10% off) or <b>WELCOME5</b> (5% off first stay). Gift cards apply automatically.</div>
          <button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="openGiftCard()">+ Add gift card</button>
        </div>
      </div>
      <div class="stack">
        <div class="panel">
          <h3 style="font-size:18px">Price breakdown</h3>
          <div class="breakdown">
            <div class="brow"><span>${fmt(m.nightly)} × ${nightsBetween(BOOK_STATE.in,BOOK_STATE.out)||3} nights ${m.monthly?"(−25% monthly)":m.weekly?"(−12% weekly)":""}</span><span>${fmt(m.subtotal)}</span></div>
            ${BOOK_STATE.addons.map(k=>`<div class="brow"><span>${ADDONS[k].name}</span><span>${ADDONS[k].price>=1?fmt(ADDONS[k].price):fmt(Math.abs(Math.round(m.subtotal*ADDONS[k].price)))}</span></div>`).join("")}
            ${BOOK_STATE.promo?`<div class="brow"><span style="color:var(--ok)">${PROMOS[BOOK_STATE.promo].label}</span><span class="free">applied</span></div>`:""}
            ${BOOK_STATE.gift?`<div class="brow"><span style="color:var(--ok)">Gift card ${BOOK_STATE.gift}</span><span class="free">applied</span></div>`:""}
            <div class="brow"><span>Cleaning fee</span><span>${fmt(RATES.cleaning)}</span></div>
            <div class="brow"><span>Service fee (8%)</span><span>${fmt(m.svc)}</span></div>
            <div class="brow"><span>VAT (7.5%)</span><span>${fmt(m.vat)}</span></div>
            <div class="brow total"><span>Total ${BOOK_STATE.split?"(50% now)":""}</span><b>${fmt(BOOK_STATE.split?Math.round(m.total/2):m.total)}</b></div>
          </div>
        </div>
        <div class="escrow-note">${I.shield}<span><b>Escrow:</b> ${fmt(m.total)} is held by Jollof Living and released to the host only after you confirm check-in.</span></div>
      </div>
    </div>
    <div class="wizard-foot">
      <button class="btn btn-ghost" onclick="bkStep(1)">← Add-ons &amp; policy</button>
      <button class="btn btn-gold" id="bkNext3">Continue → Review</button>
    </div>
  </div>`;
}
function bkReview(){
  const p=PROPERTIES.find(x=>x.id===BOOK_STATE.id);
  const m=bkCalc();
  const ref="JL-2026-"+String(Math.floor(1000+Math.random()*9000));
  return `
  <div class="wizard-step">
    <h2>Review &amp; confirm</h2>
    <div class="sub">One last look before ${BOOK_STATE.req?"we send your request":"your reservation is locked in"}.</div>
    <div class="grid-2" style="grid-template-columns:1.1fr .9fr">
      <div class="stack">
        <div class="panel" style="display:flex;gap:14px;align-items:center">
          <img src="${img(p.img)}" style="width:120px;height:88px;object-fit:cover;border-radius:12px" alt="">
          <div><b style="font-family:var(--fs-serif);font-size:20px">${esc(p.name)}</b>
          <div class="small">${esc(p.area)}, ${esc(p.city)} · ${p.beds} bd · ${p.baths} ba · ${BOOK_STATE.guests} guests</div>
          <div class="small">${BOOK_STATE.in} → ${BOOK_STATE.out} · ${nightsBetween(BOOK_STATE.in,BOOK_STATE.out)||3} nights</div></div>
        </div>
        <div class="panel">
          <h3 style="font-size:17px">What's included</h3>
          <div class="krow"><span class="k">Cancellation</span><span class="v">${BOOK_STATE.policy[0].toUpperCase()+BOOK_STATE.policy.slice(1)} · full terms shown before paying</span></div>
          <div class="krow"><span class="k">Payment</span><span class="v">${PAY_METHODS.find(x=>x.id===BOOK_STATE.method).name}</span></div>
          <div class="krow"><span class="k">Add-ons</span><span class="v">${BOOK_STATE.addons.length?BOOK_STATE.addons.map(k=>ADDONS[k].name).join(", "):"None"}</span></div>
          <div class="krow"><span class="k">Split payment</span><span class="v">${BOOK_STATE.split?"50% now · 50% at check-in":"—"}</span></div>
          ${BOOK_STATE.req?'<div class="krow"><span class="k">Host confirmation</span><span class="v">Within 24 hours</span></div>':""}
          <div class="krow"><span class="k">Check-in</span><span class="v">Keyless code · from 3:00 PM</span></div>
        </div>
        <label class="chk" style="margin-top:4px"><input type="checkbox" id="bkTerms"> I agree to the house rules, cancellation policy, and extended-stay terms (if 30+ nights)</label>
        <label class="chk" style="margin-top:8px"><input type="checkbox" checked> Send me booking updates via email, SMS &amp; WhatsApp</label>
        <label class="chk" style="margin-top:8px"><input type="checkbox" checked> Add to my calendar &amp; wallet pass</label>
      </div>
      <div class="stack">
        <div class="panel">
          <h3 style="font-size:18px">Total</h3>
          <div class="breakdown">
            <div class="brow"><span>Stay &amp; fees</span><span>${fmt(m.subtotal+m.svc+m.vat+RATES.cleaning)}</span></div>
            <div class="brow"><span>Add-ons</span><span>${fmt(m.addons)}</span></div>
            ${BOOK_STATE.promo?`<div class="brow"><span style="color:var(--ok)">${PROMOS[BOOK_STATE.promo].label}</span><span class="free">−${fmt(PROMOS[BOOK_STATE.promo].off?Math.round(m.total*PROMOS[BOOK_STATE.promo].off):PROMOS[BOOK_STATE.promo].flat)}</span></div>`:""}
            <div class="brow"><span>Security deposit (held)</span><span>${fmt(m.deposit)}</span></div>
            <div class="brow total"><span>${BOOK_STATE.split?"Due now (50%)":"Total due"}</span><b>${fmt(BOOK_STATE.split?Math.round(m.total/2):m.total)}</b></div>
          </div>
          <div class="store-note">${I.shield}<span>Held in escrow · released after check-in confirmation. Invoice <b>${ref}</b> will be emailed instantly.</span></div>
        </div>
        <div class="ai-callout">${I.spark}<span><b>AI says:</b> booking Tue–Thu for these dates saves ~${fmt(Math.round(m.total*0.12))} — want the flexible option instead?</span></div>
        <div class="store-note">${I.check}<span>PDF invoice, receipt and digital pass are generated automatically.</span></div>
      </div>
    </div>
    <div class="wizard-foot">
      <button class="btn btn-ghost" onclick="bkStep(2)">← Payment</button>
      <button class="btn btn-gold btn-lg" id="bkConfirm">${BOOK_STATE.req?"Send request":"Confirm & pay "+fmt(BOOK_STATE.split?Math.round(m.total/2):m.total)}</button>
    </div>
  </div>`;
}
function bindBooking(id,q){
  const p=PROPERTIES.find(x=>x.id===id);
  bkStep(0);
  const bkBound=function(e){
    /* common wizard handlers */
    const next1=e.target.closest("#bkNext1"); if(next1){ BOOK_STATE.policy=$("#bkPol")?.value||BOOK_STATE.policy; bkStep(1); return; }
    const next2=e.target.closest("#bkNext2"); if(next2){ const pol=$("#bkPol"); if(pol) BOOK_STATE.policy=pol.value;
      $$("[data-addon]").forEach(c=>{ const k=c.dataset.addon; const has=c.checked; if(has&&!BOOK_STATE.addons.includes(k)) BOOK_STATE.addons.push(k); if(!has) BOOK_STATE.addons=BOOK_STATE.addons.filter(x=>x!==k); });
      const sp=$("#bkSplit"); if(sp) BOOK_STATE.split=sp.checked;
      bkStep(2); return; }
    const next3=e.target.closest("#bkNext3"); if(next3){ bkStep(3); return; }
    const conf=e.target.closest("#bkConfirm"); if(conf){
      const terms=$("#bkTerms"); if(terms&&!terms.checked){ toast("Please accept the terms to continue","shield"); return; }
      confirmBooking(PROPERTIES.find(x=>x.id===BOOK_STATE.id)||p); return; }
    const promogo=e.target.closest("#bkPromoGo"); if(promogo){
      const code=($("#bkPromo").value||"").trim().toUpperCase();
      if(PROMOS[code]){ BOOK_STATE.promo=code; toast(`Promo applied — ${PROMOS[code].label}`,"gift"); bkStep(2); }
      else toast("That code isn't valid (try JOLLOF10)","x"); return; }
    const pmbtn=e.target.closest("[data-pm]"); if(pmbtn){ BOOK_STATE.method=pmbtn.dataset.pm;
      $$(".pay-method").forEach(x=>x.style.borderColor=""); pmbtn.style.borderColor="var(--accent)";
      toast(`Payment method: ${PAY_METHODS.find(x=>x.id===BOOK_STATE.method).name}`,"wallet"); return; }
    const gd=e.target.closest("#bkGd"); if(gd){ BOOK_STATE.guests=Math.max(1,BOOK_STATE.guests-1); $("#bkG").textContent=BOOK_STATE.guests; return; }
    const gu=e.target.closest("#bkGu"); if(gu){ BOOK_STATE.guests=Math.min((PROPERTIES.find(x=>x.id===BOOK_STATE.id)||PROPERTIES[0]).guests,BOOK_STATE.guests+1); $("#bkG").textContent=BOOK_STATE.guests; return; }
  };
  if(!window.__bkBound){ window.__bkBound=1; document.addEventListener("click",bkBound); }
  /* calendar + date inputs on step 0 are bound lazily by cal widget handler when step renders */
  const calTimer=setInterval(()=>{ if($("#calBox")&&$("#bkIn")){ clearInterval(calTimer);
    const sel={in:BOOK_STATE.in,out:BOOK_STATE.out};
    bindCal(sel,tourRanges(p),(s)=>{ BOOK_STATE.in=s.in; BOOK_STATE.out=s.out; const i=$("#bkIn"),o=$("#bkOut"); if(i)i.value=s.in; if(o)o.value=s.out; });
    $("#bkIn").addEventListener("change",e=>{BOOK_STATE.in=e.target.value; refreshCal()});
    $("#bkOut").addEventListener("change",e=>{BOOK_STATE.out=e.target.value; refreshCal()});
  }},80);
}
function refreshCal(){}
async function confirmBooking(p){
  const btn=$("#bkConfirm");
  if(btn){ btn.disabled=true; btn.dataset.label=btn.textContent; btn.textContent="Securing your reservation…"; }
  const payload={
    property:p.id,
    checkin:BOOK_STATE.in, checkout:BOOK_STATE.out,
    guests:BOOK_STATE.guests, policy:BOOK_STATE.policy,
    method:BOOK_STATE.method, addons:BOOK_STATE.addons,
    promo:BOOK_STATE.promo||"", gift:BOOK_STATE.gift||0,
    split:!!BOOK_STATE.split, request:!!BOOK_STATE.req,
    name:$("#bkName")?.value||"", email:$("#bkEmail")?.value||"", phone:$("#bkPhone")?.value||"",
  };
  const r=await api("booking-create.php",payload);
  if(!r.ok){
    if(btn){ btn.disabled=false; btn.textContent=btn.dataset.label||"Confirm & pay"; }
    toast(r.message||"We could not complete that reservation.","x");
    if(r.requiresAuth) setTimeout(()=>nav("/auth?next="+encodeURIComponent(location.pathname+location.search)),1000);
    return;
  }
  nav("/confirm/"+encodeURIComponent(r.data.ref));
}
function pConfirm(ref){
  /* confirm.php looks the reference up in MySQL and hands it over in JL.booking */
  const b=(JL.booking)||S.bookings.find(x=>x.ref===decodeURIComponent(ref));
  if(!b) return p404();
  const p=PROPERTIES.find(x=>x.id===b.prop)||{};
  const earned=b.pointsEarned||0;  return `
  <div class="page-top"></div>
  <div style="padding:calc(var(--header-h) + 30px) 0 70px"><div class="wrap" style="max-width:780px">
    <div style="text-align:center;margin-bottom:28px">
      <div style="width:84px;height:84px;border-radius:50%;background:var(--green-soft);color:var(--ok);display:grid;place-items:center;margin:0 auto 18px">${I.checkCircle.replace("<svg","<svg style='width:40px;height:40px'")}</div>
      <span class="eyebrow center">${b.req?"Request sent":"Reservation confirmed"}</span>
      <h1 style="font-size:clamp(1.9rem,4vw,2.8rem);margin:12px 0 8px">${b.req?"The host will confirm within 24 hours":"See you in "+esc(b.city)+", soon."}</h1>
      <p class="muted">Reference <b style="color:var(--accent)">${b.ref}</b> · A confirmation has been sent by email, SMS &amp; WhatsApp.</p>
    </div>
    <div class="panel" style="padding:26px">
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding-bottom:18px;border-bottom:1px solid var(--line-soft)">
        <img src="${img(b.img)}" style="width:130px;height:92px;object-fit:cover;border-radius:12px" alt="">
        <div style="flex:1;min-width:200px"><div class="small">${b.city} · ${esc(b.area)}</div>
          <b style="font-family:var(--fs-serif);font-size:22px">${esc(b.name)}</b>
          <div class="small">${b.in} → ${b.out} · ${b.nights} nights · ${b.guests} guests</div></div>
        <div class="pill-status ok">${b.status==="confirmed"?"Confirmed":"Awaiting host"}</div>
      </div>
      <div class="breakdown" style="border:none;padding-top:14px">
        <div class="brow"><span>Total (${b.split?"split 50/50":PAY_METHODS.find(x=>x.id===b.method).name})</span><span><b style="font-family:var(--fs-serif);font-size:22px">${fmt(b.total)}</b></span></div>
        <div class="brow"><span>Paid in escrow</span><span>${fmt(b.split?Math.round(b.total/2):b.total)}</span></div>
        <div class="brow"><span>Security deposit held</span><span>${fmt(Math.round(b.total*RATES.deposit))}</span></div>
        <div class="brow" style="color:var(--ok)"><span>Jollof Points earned</span><span>+${earned.toLocaleString()} pts</span></div>
      </div>
    </div>
    <div class="grid-2" style="margin-top:18px">
      <div class="panel" style="text-align:center;padding:20px">
        <div class="small">Digital check-in</div>
        <div style="font-family:var(--fs-serif);font-size:34px;font-weight:600;letter-spacing:.14em;margin:6px 0">4471#</div>
        <div class="small">Unlocks ${todayStr(7)} from 3:00 PM · smart lock syncs automatically</div>
      </div>
      <div class="panel" style="text-align:center;padding:20px">
        <div class="small">Digital lease agreement</div>
        <div style="font-size:15px;margin:10px 0;color:var(--ink-soft)">${b.nights>=30?"Generated for your 30+ night stay":"Short-stay terms apply"}</div>
        <button class="btn btn-ghost btn-sm" onclick="toast('Agreement PDF stored in your vault','doc')">${I.doc} View document</button>
      </div>
    </div>
    <div class="btnrow" style="justify-content:center;margin-top:24px">
      <a class="btn btn-green" data-goto="/trips">${I.calendar} View my trips</a>
      <a class="btn btn-ghost" onclick="gcalStay('${b.prop}')">${I.calendar} Add to calendar</a>
      <button class="btn btn-ghost" onclick="openInvoice('${b.ref}')">${I.doc} Invoice PDF</button>
    </div>
    <p class="small" style="text-align:center;margin-top:18px">${I.shield} Funds are held by Jollof Living and released to the host after you confirm check-in.</p>
  </div></div>`;
}
function openInvoice(ref){
  const b=S.bookings.find(x=>x.ref===ref)||S.bookings[0];
  if(!b){ toast("No reservation to invoice","x"); return; }
  const p=PROPERTIES.find(x=>x.id===b.prop)||{};
  const me=USER||{};
  /* the printable invoice is rendered by the server from the stored
     line items, so the figures always match what was actually charged */
  const url=`${JL.apiBase}invoice.php?ref=${encodeURIComponent(b.ref)}`;
  openModal(`
    <div class="mhead" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
      <div><span class="eyebrow">Invoice ${esc(b.ref)}</span><h2 style="margin-top:8px">Jollof Living</h2></div>
      <div style="text-align:right"><div class="small">Luxury Living, African Soul</div><div class="small">${esc((JL.data&&JL.data.siteName)||"jollofliving.com")}</div></div>
    </div>
    <div class="separator" style="height:1px;background:var(--line);margin:14px 0 20px"></div>
    <div class="grid-2" style="gap:20px;margin-bottom:20px">
      <div><div class="small">Billed to</div><div class="muted" style="font-size:14.5px">${esc(me.name||"Guest")}<br>${esc(me.email||"")}<br>${esc(b.city||"Lagos")}, Nigeria</div></div>
      <div><div class="small">Stay</div><div class="muted" style="font-size:14.5px">${esc(b.name)}<br>${esc(b.area)}, ${esc(b.city)}<br>${b.in} → ${b.out}</div></div>
    </div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>
      <tr><td>${fmt(p.price||0)} × ${b.nights} night${b.nights===1?"":"s"}</td><td>${b.nights}</td><td>${fmt(p.price||0)}</td><td style="text-align:right">${fmt((p.price||0)*b.nights)}</td></tr>
      ${(b.addons||[]).filter(a=>ADDONS[a]).map(a=>`<tr><td>${esc(ADDONS[a].name)}</td><td>1</td><td>${ADDONS[a].price>=1?fmt(ADDONS[a].price):"3%"}</td><td style="text-align:right">${ADDONS[a].price>=1?fmt(ADDONS[a].price):"—"}</td></tr>`).join("")}
      <tr><td>Cleaning fee</td><td>1</td><td>${fmt(RATES.cleaning)}</td><td style="text-align:right">${fmt(RATES.cleaning)}</td></tr>
      <tr><td>Service fee &amp; VAT</td><td>1</td><td>—</td><td style="text-align:right">included</td></tr>
      <tr><td colspan="3"><b>Total ${b.split?"(split: 50% now)":"paid"} · ${esc((PAY_METHODS.find(x=>x.id===b.method)||{}).name||b.method||"")}</b></td>
          <td style="text-align:right"><b style="font-family:var(--fs-serif);font-size:19px">${fmt(b.total)}</b></td></tr>
    </tbody></table></div>
    <div class="small" style="margin-top:14px">VAT computed at ${Math.round(RATES.vat*100)}% · WHT applies to host payouts · Payment held in escrow until check-in. Thank you for staying with Jollof Living.</div>
    <div class="btnrow" style="margin-top:18px">
      <a class="btn btn-gold" href="${url}" target="_blank" rel="noopener">${I.download} Open printable invoice</a>
      <button class="btn btn-ghost" onclick="emailInvoice('${esc(b.ref)}')">${I.send} Email it to me</button></div>
  `);
}
async function emailInvoice(ref){
  const r=await api("invoice.php",{ref,action:"email"});
  toast(r.ok?(r.message||"Invoice sent to your inbox"):(r.message||"Could not send that invoice"), r.ok?"send":"x");
}

function openGiftCard(){
  openModal(`<h2 style="margin-bottom:4px">Apply a gift card</h2>
    <p class="small" style="margin-bottom:16px">Gift cards apply instantly to any reservation.</p>
    <div class="frm-row"><label>Gift card code</label><input class="inp" placeholder="JL-GIFT-XXXX" id="gcInp"></div>
    <div class="btnrow"><button class="btn btn-gold" onclick="applyGift()">Apply card</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
}
function applyGift(){ const v=$("#gcInp").value;
  if(v.trim().length>=8){ BOOK_STATE.gift=60000; closeModal(); toast("Gift card applied — ₦60,000 off","gift"); if($("#bkStage")) bkStep(2); }
  else toast("Enter a valid gift card code","x");
}

/* ---------------- TRIPS ---------------- */
function pTrips(q){
  const tab=(q&&q.tab)||"upcoming";
  const now=todayStr();
  const upcoming=S.bookings.filter(b=>["pending","confirmed"].includes(b.status)&&b.out>=now);
  const active=S.bookings.filter(b=>b.status==="active");
  const past=S.bookings.filter(b=>b.status==="completed"||(b.status!=="cancelled"&&b.out<now));
  const pending=S.bookings.filter(b=>b.status==="pending");
  const cancelled=S.bookings.filter(b=>b.status==="cancelled");
  const all={upcoming,active,past,pending,cancelled};
  const list=all[tab]||[];
  return `${pageHead([["Home",URL("/")],["My trips"]],"<em class='serif-i'>My</em> trips","Every reservation, request and stay — in one organised place.",
    `<button class="btn btn-gold" data-goto="/stays">Book a new stay</button>`)}
  <div class="page-body"><div class="wrap">
    <div class="tabs" style="margin-bottom:24px" id="tripTabs">
      ${[["upcoming","Upcoming"],["pending","Awaiting host"],["active","Active"],["past","Past"],["cancelled","Cancelled"]].map(([k,l])=>`<button class="tab ${tab===k?"active":""}" data-tt="${k}">${l}</button>`).join("")}
    </div>
    ${list.length? `<div class="stack">${list.map(b=>tripCard(b)).join("")}</div>`
    : `<div class="empty-state">${I.calendar}<b>Nothing ${tab} yet</b>Your reservations will appear here — from instant bookings to host-approved requests.<br><br><a class="btn btn-gold" href="${URL('/stays')}">Browse residences</a></div>`}
    ${S.waitlist.length?`<div class="panel" style="margin-top:26px"><h3 style="font-size:18px">${I.clock} Waitlists</h3>
      ${S.waitlist.map(w=>{const id=typeof w==="string"?w:w.id; const p=PROPERTIES.find(x=>x.id===id)||{}; const win=(typeof w==="object"&&w.window)||p.soldOut||"any dates"; return `<div class="krow"><span class="k">${esc(p.name||id)} · ${esc(win)}</span><span class="v"><span class="pill-status gold">Watching for openings</span></span></div>`;}).join("")}
    </div>`:""}
  </div></div>`;
}
function tripCard(b){
  const p=PROPERTIES.find(x=>x.id===b.prop);
  const st={confirmed:["ok","Confirmed"],pending:["warn","Awaiting host"],active:["info","In progress"],completed:["ok","Completed"],cancelled:["bad","Cancelled"]}[b.status]||["info",b.status];
  return `<div class="panel" style="padding:0;overflow:hidden">
    <div style="display:flex;flex-wrap:wrap;gap:18px;padding:18px;align-items:center">
      <img src="${img(b.img)}" style="width:150px;height:104px;object-fit:cover;border-radius:12px" alt="">
      <div style="flex:1;min-width:220px">
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="pill-status ${st[0]}">${st[1]}</span><span class="small">${b.ref}</span></div>
        <b style="font-family:var(--fs-serif);font-size:21px;display:block;margin:6px 0 2px">${esc(b.name)}</b>
        <div class="small">${b.in} → ${b.out} · ${b.nights} nights · ${b.guests} guests · ${PAY_METHODS.find(x=>x.id===b.method)?.name||"card"}</div>
        <div class="small" style="color:var(--accent);margin-top:4px">${fmt(b.total)} total ${b.split?"· split 50/50":""} · +${b.pointsEarned||0} pts</div>
      </div>
      <div class="btnrow" style="flex-wrap:wrap">
        ${b.status==="confirmed"?`<button class="btn btn-green btn-sm" onclick="tripCheckin('${b.ref}')">${I.key} Check-in</button>`:""}
        ${b.status==="active"?`<button class="btn btn-green btn-sm" onclick="tripCheckout('${b.ref}')">${I.check} Confirm check-out</button>`:""}
        ${b.status==="completed"?`<button class="btn btn-gold btn-sm" onclick="openReview('${b.ref}')">${I.star} Write review</button>`:""}
        ${b.status==="confirmed"?`<button class="btn btn-ghost btn-sm" onclick="openModify('${b.ref}')">${I.edit} Modify</button>`:""}
        ${b.status==="confirmed"||b.status==="pending"?`<button class="btn btn-ghost btn-sm" onclick="openCancel('${b.ref}')">${I.trash} Cancel</button>`:""}
        <button class="btn btn-ghost btn-sm" onclick="openInvoice('${b.ref}')">${I.doc} Invoice</button>
        <button class="btn btn-ghost btn-sm" data-goto="/messages?to=team-onyx">${I.chat} Message</button>
      </div>
    </div>
    ${b.status==="confirmed"&&nightsBetween(todayStr(),b.in)<=3?`<div style="background:var(--green-soft);padding:11px 18px;font-size:13px;display:flex;gap:10px;align-items:center">${I.key}<span><b>Keyless code ready: 4471#</b> · unlocks ${b.in} from 3:00 PM · smart-lock synced (August / Yale / Nuki)</span></div>`:""}
  </div>`;
}
function bindTrips(){
  $$("#tripTabs .tab").forEach(t=>t.addEventListener("click",()=>nav("/trips?tab="+t.dataset.tt)));
}
async function tripAction(ref,action,successIcon){
  const r=await api("booking-action.php",{ref,action});
  if(!r.ok){ toast(r.message||"That action is not available.","x"); return null; }
  await syncState(false);
  return r;
}
async function tripCheckin(ref){
  const b=S.bookings.find(x=>x.ref===ref);
  const r=await tripAction(ref,"checkin"); if(!r) return;
  render(); renderBadges();
  openModal(`<div style="text-align:center;padding:12px 0"><div class="why-ico" style="margin:0 auto 16px;width:60px;height:60px;border-radius:18px">${I.key}</div>
    <h2>You're checked in 🎉</h2><p class="muted" style="margin:8px 0 2px">Welcome to ${esc(b?b.name:"your residence")}. The host has been notified and the escrow payment is now released.</p>
    <div class="small" style="margin-bottom:16px">If anything isn't right, report it from your stay dashboard within 24h.</div>
    <div class="btnrow" style="justify-content:center"><button class="btn btn-green" onclick="closeModal()">Enjoy your stay</button><button class="btn btn-ghost" data-goto="/messages">Message host</button></div></div>`);
}
async function tripCheckout(ref){
  const r=await tripAction(ref,"checkout"); if(!r) return;
  render(); renderBadges();
  toast("Check-out confirmed — thank you! Please leave a review ✨","star");
}
function openModify(ref){ const b=S.bookings.find(x=>x.ref===ref); if(!b) return;
  openModal(`<h2 style="margin-bottom:4px">Modify reservation</h2><p class="small" style="margin-bottom:16px">Change dates, guest count, or add add-ons. ${b.ref}</p>
    <div class="frm-grid"><div class="frm-row"><label>New check-in</label><input class="inp" type="date" id="mIn" value="${b.in}"></div>
    <div class="frm-row"><label>New check-out</label><input class="inp" type="date" id="mOut" value="${b.out}"></div></div>
    <div class="frm-row"><label>Guests</label><input class="inp" type="number" id="mG" value="${b.guests}" min="1" max="8"></div>
    <div class="panel" style="background:var(--gold-soft)"><div class="small">Any rate difference is applied instantly; the host is notified of the change. Extended stays re-qualify for weekly/monthly discounts automatically.</div></div>
    <div class="btnrow" style="margin-top:16px"><button class="btn btn-gold" onclick="submitModify('${b.ref}')">Request modification</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
}
async function submitModify(ref){
  const r=await api("booking-action.php",{ref,action:"modify",checkin:$("#mIn").value,checkout:$("#mOut").value,guests:+$("#mG").value});
  closeModal();
  if(!r.ok){ toast(r.message||"Could not send that request","x"); return; }
  await syncState();
  toast(r.message||`Modification requested for ${ref} — host will confirm shortly`,"calendar");
}
function openCancel(ref){ const b=S.bookings.find(x=>x.ref===ref); if(!b) return;
  const refunds={flexible:1,moderate:0.5,strict:0.5};
  const rf=refunds[b.policy]||0.5;
  openModal(`<h2 style="margin-bottom:4px">Cancel this reservation?</h2><p class="muted" style="font-size:14.5px;margin-bottom:14px">${b.ref} · ${esc(b.name)}</p>
    <div class="panel" style="margin-bottom:14px">
      <div class="krow"><span class="k">Cancellation policy</span><span class="v">${b.policy[0].toUpperCase()+b.policy.slice(1)}</span></div>
      <div class="krow"><span class="k">Total paid</span><span class="v">${fmt(b.total)}</span></div>
      <div class="krow"><span class="k">Estimated refund</span><span class="v" style="color:var(--ok)">${fmt(Math.round(b.total*rf))}</span></div>
      <div class="krow"><span class="k">Refund method</span><span class="v">Original payment · 3–5 days</span></div>
    </div>
    <div class="btnrow"><button class="btn btn-ghost" onclick="closeModal()">Keep booking</button><button class="btn btn-ghost" style="border-color:var(--bad);color:var(--bad)" onclick="doCancel('${b.ref}')">Cancel reservation</button></div>`);
}
async function doCancel(ref){
  const r=await tripAction(ref,"cancel");
  closeModal();
  if(!r) return;
  render(); toast(r.message||"Cancellation confirmed — refund on its way","clock");
}
function openReview(ref){ const b=S.bookings.find(x=>x.ref===ref); if(!b) return;
  window.__rv={};
  openModal(`<h2 style="margin-bottom:4px">Rate your stay</h2><p class="small" style="margin-bottom:14px">${esc(b.name)} · ${b.in} → ${b.out}</p>
    ${["cleanliness","accuracy","communication","location","checkin","value"].map(k=>`
      <div class="krow"><span class="k" style="text-transform:capitalize">${k}</span><span class="v" id="rv-${k}"><button onclick="rvSet('${k}',1)">★</button><button onclick="rvSet('${k}',2)">★</button><button onclick="rvSet('${k}',3)">★</button><button onclick="rvSet('${k}',4)">★</button><button onclick="rvSet('${k}',5)">★</button></span></div>`).join("")}
    <div class="frm-row" style="margin-top:12px"><label>Your review</label><textarea class="txa" id="rvTxt" placeholder="What should future guests know?"></textarea></div>
    <div class="btnrow"><button class="btn btn-gold" onclick="submitReview('${b.ref}')">Publish review</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
  window.rvSet=(k,v)=>{ window.__rv[k]=v; const el=$("#rv-"+k); el.innerHTML=""; for(let i=1;i<=5;i++){ const bt=document.createElement("button"); bt.textContent="★"; bt.style.color=i<=v?"var(--accent)":"var(--line)"; bt.onclick=()=>window.rvSet(k,i); el.appendChild(bt);} };
}
async function submitReview(ref){
  const body=($("#rvTxt")?.value||"").trim();
  if(body.length<10){ toast("Tell future guests a little more (10+ characters)","x"); return; }
  const r=await api("review-create.php",{ref,body,scores:window.__rv||{}});
  closeModal();
  if(!r.ok){ toast(r.message||"Could not publish that review","x"); return; }
  await syncState();
  toast(r.message||"Thank you! Your review has been submitted ✨","star");
}

function pWishlist(){
  const lists=Object.keys(S.wishlists);
  const active=S.activeWishlist||"default";
  const items=S.wishlists[active]||[];
  return `${pageHead([["Home",URL("/")],["Wishlist"]],"<em class='serif-i'>My</em> wishlist","Save residences to named lists, get push alerts on price drops, and share plans with your travel crew.",
    `<button class="btn btn-gold" id="wlNew">${I.plus} New list</button>`)}
  <div class="page-body"><div class="wrap">
    <div style="display:grid;grid-template-columns:250px 1fr;gap:24px" class="wl-shell">
      <div class="panel" style="height:fit-content">
        <div class="small" style="margin-bottom:8px">LISTS</div>
        ${lists.map(l=>`<div class="krow" style="cursor:pointer;${l===active?"color:var(--accent);border-color:var(--accent)":""}" data-wl="${l}"><span class="k">${esc(l==="default"?"Default":l)}</span><span class="v">${S.wishlists[l].length}</span></div>`).join("")}
        <div class="krow" style="cursor:pointer" data-wl="+add"><span class="k" style="color:var(--accent)">+ Add list</span></div>
      </div>
      <div>
        <div class="panel" style="margin-bottom:16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap">
          <div style="flex:1;min-width:200px"><b style="font-family:var(--fs-serif);font-size:20px">${esc(active==="default"?"Default list":active)}</b>
          <div class="small">${items.length} ${items.length===1?"residence":"residences"} · price-drop alerts on</div></div>
          <button class="btn btn-ghost btn-sm" onclick="copyText(location.origin+URL('/wishlist')+'?list='+encodeURIComponent(S.activeWishlist),'Wishlist link copied — ready to share')">${I.share} Share list</button>
        </div>
        ${items.length?`<div class="stays-grid">${items.map(id=>{const p=PROPERTIES.find(x=>x.id===id); return p?stayCard(p):"";}).join("")}</div>`
        :`<div class="empty-state">${I.heartFill}<b>Nothing saved here yet</b>Tap the ♥ on any residence to add it to ${active==="default"?"your wishlist":"this list"}.<br><br><a class="btn btn-gold" href="${URL('/stays')}">Browse residences</a></div>`}
      </div>
    </div>
    <style>@media(max-width:860px){.wl-shell{grid-template-columns:1fr!important}}</style>
  </div></div>`;
}
function bindWishlist(){
  $$("[data-wl]").forEach(r=>r.addEventListener("click",()=>{
    if(r.dataset.wl==="+add"){
      wlCreate();
      return;
    }
    S.activeWishlist=r.dataset.wl;
    api("wishlist.php",{action:"active",list:S.activeWishlist}).then(()=>render());
  }));
  const wlNew=$("#wlNew");
  if(wlNew) wlNew.addEventListener("click",wlCreate);
}
async function wlCreate(){
  if(!requireAuth("create a list")) return;
  const name=prompt("Name your list (e.g. “December Trip”, “Work Travel”):");
  if(!name||!name.trim()) return;
  const r=await api("wishlist.php",{action:"create",name:name.trim()});
  if(!r.ok){ toast(r.message||"Could not create that list","x"); return; }
  await syncState(false);
  S.activeWishlist=r.slug||name.trim();
  render(); toast("List created ✨","gift");
}
async function toggleWish(id,btn){
  if(!requireAuth("save residences")) return;
  const list=S.wishlists[S.activeWishlist]||(S.wishlists[S.activeWishlist]=[]);
  const had=list.indexOf(id)>-1;
  /* optimistic paint, then persist */
  if(had) list.splice(list.indexOf(id),1); else list.push(id);
  if(btn){ btn.classList.toggle("active",!had); btn.innerHTML=had?I.heart:I.heartFill; }
  renderBadges();
  const r=await api("wishlist.php",{action:"toggle",property:id,list:S.activeWishlist});
  if(!r.ok){ /* roll back */
    if(had) list.push(id); else list.splice(list.indexOf(id),1);
    if(btn){ btn.classList.toggle("active",had); btn.innerHTML=had?I.heartFill:I.heart; }
    renderBadges(); toast(r.message||"Could not update your wishlist","x"); return;
  }
  toast(r.saved?"Saved to your wishlist — alerts on":"Removed from wishlist","heart");
  const grid=$("#staysGrid"); if(grid&&typeof filteredStays==="function") grid.innerHTML=filteredStays().map(stayCard).join("");
}

/* ---------------- COMPARE ---------------- */
function pCompare(){
  const items=S.compare.map(id=>PROPERTIES.find(x=>x.id===id)).filter(Boolean);
  const rows=[["Price / night",p=>`<span class="cpr" style="font-family:var(--fs-serif);font-size:22px;font-weight:600;color:var(--accent)">${fmt(p.price)}</span>`],
    ["Rating",p=>`${I.star} <b>${p.rating.toFixed(2)}</b> · ${p.reviews} reviews`],
    ["Size",p=>`${p.beds} bd · ${p.baths} ba · ${p.guests} guests`],
    ["Location",p=>`${esc(p.area)}, ${esc(p.city)}`],
    ["Booking",p=>p.instant?`<span class="pill-status ok">Instant Book</span>`:`<span class="pill-status warn">Request to book</span>`],
    ["Cancellation",p=>`<span class="pill-status info">${p.policy[0].toUpperCase()+p.policy.slice(1)}</span>`],
    ["Verified",p=>p.badge.includes("Verified")?`<span class="pill-status ok">${I.gold} Verified</span>`:`<span class="pill-status gold">${esc(p.badge)}</span>`],
    ["Long-stay",p=>`<span class="pill-status ok">−25% monthly</span>`],
    ["Highlights",p=>`<span class="small">${esc(p.amens.slice(0,3).join(" · "))}</span>`]];
  return `${pageHead([["Home",URL("/")],["Compare"]],"Compare <em class='serif-i'>residences</em>","Side by side across price, rating, size and policies — up to three homes at once.",
    `<a class="btn btn-gold" href="${URL('/stays')}">Add more residences</a>`)}
  <div class="page-body"><div class="wrap">
    ${items.length? `
    <div class="tbl-wrap"><table class="tbl" style="min-width:700px">
      <thead><tr><th style="width:150px"></th>${items.map(p=>`<th><div style="border-radius:14px;overflow:hidden;aspect-ratio:4/3;margin-bottom:10px"><img src="${img(p.img)}" style="width:100%;height:100%;object-fit:cover" alt=""></div>
        <div style="font-family:var(--fs-serif);font-size:19px;cursor:pointer" data-goto="/stay/${p.id}">${esc(p.name)}</div>
        <button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="toggleCompare('${p.id}')">Remove</button></th>`).join("")}</tr></thead>
      <tbody>${rows.map(([l,f])=>`<tr><th>${l}</th>${items.map(p=>`<td>${f(p)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>
    <div class="ai-callout" style="margin-top:20px">${I.spark}<span><b>AI verdict:</b> ${items.length>1?`${items[0].id!==items[1].id?`<b>${items[0].name}</b> scores highest on rating, while <b>${items[1].name}</b> offers ${Math.round((1-items[1].price/items[0].price)*100)}% more value per night.`:"these are the same residence"}`:""}</span></div>`
    : `<div class="empty-state">${I.scale}<b>Nothing to compare yet</b>Pick up to three residences using the “Compare” button on any card.<br><br><a class="btn btn-gold" href="${URL('/stays')}">Browse residences</a></div>`}
  </div></div>`;
}
async function toggleCompare(id){
  if(!requireAuth("compare residences")) return;
  const r=await api("compare.php",{action:"toggle",property:id});
  if(!r.ok){ toast(r.message||"Could not update compare","scale"); return; }
  S.compare=r.compare||S.compare;
  toast(r.message||"Compare updated","scale");
  render(); renderBadges();
}
