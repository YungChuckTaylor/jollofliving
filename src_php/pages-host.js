/* ============================================================
   JOLLOF LIVING — pages-host.js
   host landing · onboarding wizard · host dashboard · payments
   ============================================================ */

/* ---------------- HOST LANDING ---------------- */
function pHost(){
  // The call to action depends on who is looking: an owner goes straight to
  // their workspace, a signed-in customer is offered the upgrade, and a
  // visitor is invited to create an owner account.
  const cta = IS_OWNER
    ? `<a class="btn btn-gold" href="${URL('/host/onboarding')}">Add a listing</a><a class="btn btn-ghost" href="${URL('/host/dashboard')}">Open my dashboard</a>`
    : USER
      ? `<button class="btn btn-gold" id="hostUpgrade">Start hosting</button><a class="btn btn-ghost" href="${URL('/host/onboarding')}">See the listing wizard</a>`
      : `<a class="btn btn-gold" href="${URL('/auth?mode=register&type=owner')}">Create an owner account</a><a class="btn btn-ghost" href="${URL('/auth')}">Sign in</a>`;
  const upgradeNote = (!IS_OWNER && USER)
    ? `<div class="ai-callout" style="margin-bottom:24px">${I.spark}<span><b>You're signed in as a guest.</b> Turn on hosting to publish listings and open your owner dashboard — you keep your trips, wishlists and points.</span></div>`
    : "";
  return `${pageHead([["Home",URL("/")],["Host"]],"Host with <em class='serif-i'>Jollof Living</em>","We handle photography, pricing intelligence, guest screening and payouts — you keep 88% and the compliments.",cta)}
  <div class="page-body"><div class="wrap">
    ${upgradeNote}
    <div class="grid-4">
      ${[["88%","Host payout","plus automatic weekly transfers"],["24h","Average time to first booking","for optimised listings"],["−12%","Occupancy lift","from AI pricing and photography"],["120+","Cities & features","one platform, everything included"]].map(s=>`
      <div class="stat-kpi"><div class="lbl">${s[2]}</div><div class="val gold-text">${s[0]}</div><div style="font-size:14px">${s[1]}</div></div>`).join("")}
    </div>

    <div class="host-shell" style="margin-top:56px">
      <div>
        <span class="eyebrow">Everything, handled</span>
        <h2 style="font-size:clamp(1.9rem,4vw,2.8rem);margin:13px 0 10px">From empty apartment to <em class="serif-i">five-star listing</em></h2>
        <ul class="host-checks">
          <li>${I.checkCircle}<span><b>Professional photography</b> — a Jollof-approved photographer captures your property (or AI enhances your own photos).</span></li>
          <li>${I.checkCircle}<span><b>AI listing optimisation</b> — titles, descriptions and photo order tested automatically for conversion.</span></li>
          <li>${I.checkCircle}<span><b>Revenue management</b> — seasonal pricing, weekend premiums, holiday surcharges and min-stay rules.</span></li>
          <li>${I.checkCircle}<span><b>Full safety net</b> — damage protection, verified guests, KYC on both sides, dispute centre.</span></li>
        </ul>
        <div class="btnrow"><a class="btn btn-gold" href="${URL('/host/onboarding')}">List my residence</a><a class="btn btn-ghost" href="${URL('/payments')}">See how payouts work</a></div>
      </div>
      <div class="calc-card">
        <h3>Earnings <em class="serif-i">estimator</em></h3>
        <div class="small" style="margin-bottom:18px">Based on listed residences in Lagos &amp; Abuja</div>
        <div class="slider-row"><div class="lab"><span>Nightly rate</span><b id="hRateVal">₦150,000</b></div>
          <input type="range" id="hRate" min="50" max="500" value="150" step="5"></div>
        <div class="slider-row"><div class="lab"><span>Occupancy</span><b id="hOccVal">65%</b></div>
          <input type="range" id="hOcc" min="30" max="95" value="65" step="1"></div>
        <div class="calc-out">
          <div class="row"><span>Average nightly</span><span id="hAvg">₦150,000</span></div>
          <div class="row"><span>Gross monthly</span><span id="hGross">₦2,925,000 / mo</span></div>
          <div class="row"><span>Host payout (88%)</span><span id="hNet">₦2,574,000 / mo</span></div>
          <div class="row total"><span>Est. annual income</span><b id="hYear">₦30,888,000</b></div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-top:64px;gap:20px">
      <div class="panel"><h3 style="font-size:19px">Verified host badges</h3>
        <p class="muted" style="font-size:14px">Complete KYC, maintain 4.8★+ and a 95% response rate to earn <b>Superhost</b>. Pass an in-person or video inspection for the <b>Jollof Verified</b> property badge — the strongest trust signal in Nigerian luxury travel.</p>
        <div class="btnrow" style="margin-top:14px"><span class="badge ok">${I.gold} Jollof Verified</span><span class="badge">Superhost</span><button class="btn btn-ghost btn-sm" onclick="toast('Your property inspection is being scheduled ✨','camera')">Book property inspection</button></div>
      </div>
      <div class="panel"><h3 style="font-size:19px">Multi-property &amp; team</h3>
        <p class="muted" style="font-size:14px">Manage every listing from one dashboard. Invite co-hosts and property managers with role-based permissions — admin, calendar, messaging, finance.</p>
        <div class="btnrow" style="margin-top:14px">${IS_OWNER?`<button class="btn btn-ghost btn-sm" data-goto="/host/dashboard?tab=team">${I.users} Invite co-host</button>`:""}${IS_OWNER?`<button class="btn btn-ghost btn-sm" data-goto="/host/dashboard?tab=listings">My listings</button>`:""}</div>
      </div>
    </div>
  </div></div>`;
}

function bindHost(){
  /* Earnings estimator — the sliders exist on this page too, and without
     this binding they move but nothing recalculates. */
  const rate=$("#hRate"), occ=$("#hOcc");
  if(rate && occ){
    const rcalc=()=>{
      const r=+rate.value, o=+occ.value;
      const m=r*1000*30*o/100;
      $("#hRateVal").textContent="\u20A6"+(r*1000).toLocaleString();
      $("#hOccVal").textContent=o+"%";
      [rate,occ].forEach(el=>el.style.setProperty("--fill",((el.value-el.min)/(el.max-el.min)*100)+"%"));
      const set=(id,v)=>{ const el=$(id); if(el) el.textContent=v; };
      set("#hAvg","\u20A6"+Math.round(r*1000).toLocaleString()+" / night");
      set("#hGross","\u20A6"+Math.round(m).toLocaleString()+" / mo");
      set("#hNet","\u20A6"+Math.round(m*0.88).toLocaleString()+" / mo");
      set("#hYear","\u20A6"+Math.round(m*12*0.88).toLocaleString());
    };
    [rate,occ].forEach(el=>el.addEventListener("input",rcalc));
    rcalc();
  }

  /* Turn an existing customer account into an owner account. */
  const up=$("#hostUpgrade");
  if(up) up.addEventListener("click",async ()=>{
    up.disabled=true; const label=up.textContent; up.textContent="Setting things up…";
    const r=await api("host-action.php",{action:"upgrade"});
    if(!r.ok){ up.disabled=false; up.textContent=label; toast(r.message||"Could not enable hosting","x"); return; }
    toast(r.message||"Hosting enabled ✨","spark");
    setTimeout(()=>{ location.href=(r.data&&r.data.redirect)||URL("/host/dashboard"); },600);
  });
}

/* wizard constants */
const WIZ_STEPS=["Basics","Details & amenities","Photos","Pricing","Policies & rules","Review & submit"];
const WIZ={ step:0, data:{} };

function pHostOnboarding(){
  return `${pageHead([["Home",URL("/")],["Host",URL("/host")],["Listing wizard"]],"Create your <em class='serif-i'>listing</em>","Guided step-by-step — you can save and return anytime. Progress is never lost.")}
  <div class="page-body"><div class="wrap wizard-shell">
    <div class="wizard-steps" id="wizSteps">${WIZ_STEPS.map((s,i)=>`<div class="ws ${i===0?"done":""}"><span class="lbl">${i+1}. ${s}</span></div>`).join("")}</div>
    <div id="wizStage"></div>
  </div></div>`;
}
function wizRender(){
  $("#wizStage").innerHTML=[
    wizBasics,wizDetails,wizPhotos,wizPricing,wizPolicy,wizReview
  ][WIZ.step]();
  $$("#wizSteps .ws").forEach((w,i)=>w.classList.toggle("done",i<=WIZ.step));
  bindWdrop();
  window.scrollTo({top:0,behavior:"smooth"});
}
function wizVal(fn,d){ return fn(d); }
function wizBasics(){
  const d=WIZ.data;
  return `<div class="wizard-step">
    <h2>Tell us about the property</h2>
    <div class="sub">This becomes the public face of your listing — take your time, the AI will polish it later.</div>
    <div class="frm-grid">
      <div class="frm-row"><label>Listing title *</label><input class="inp" id="wTitle" value="${esc(d.title||"")}" placeholder="e.g. The Emerald Court — garden apartment in Ikoyi"></div>
      <div class="frm-row"><label>Property type</label><select class="sel" id="wType"><option>Penthouse</option><option>Villa</option><option>Suite</option><option>Loft</option><option>Furnished Townhouse</option><option>Heritage Stay</option></select></div>
      <div class="frm-row"><label>City</label><select class="sel" id="wCity"><option>Lagos</option><option>Abuja</option></select></div>
      <div class="frm-row"><label>Neighbourhood</label><input class="inp" id="wArea" value="${esc(d.area||"")}" placeholder="e.g. Ikoyi, Maitama, Lekki Phase 1"></div>
      <div class="frm-row"><label>Guests</label><input class="inp" type="number" id="wGuests" value="${d.guests||4}" min="1" max="16"></div>
      <div class="frm-row"><label>Bedrooms / Bathrooms</label><div style="display:flex;gap:8px"><input class="inp" type="number" id="wBeds" value="${d.beds||2}" min="1"><input class="inp" type="number" id="wBaths" value="${d.baths||2}" min="1"></div></div>
    </div>
    <div class="frm-row"><label>Description</label><textarea class="txa" id="wDesc" placeholder="What makes this place unforgettable?">${esc(d.desc||"")}</textarea></div>
    <div class="ai-callout">${I.spark}<span><b>AI description generator</b> will rewrite this in your chosen tone at the review step.</span></div>
    <div class="wizard-foot"><a class="btn btn-ghost" href="${URL('/host')}">← Cancel</a><button class="btn btn-gold" id="wizNext">Save &amp; continue</button></div>
  </div>`;
}
function wizDetails(){
  const d=WIZ.data;
  return `<div class="wizard-step">
    <h2>Details, amenities &amp; highlights</h2>
    <div class="sub">Amenities drive search results — tick everything that applies.</div>
    <div class="grid-3" id="wAmen">
      ${["Fast Wi-Fi","Gym","Pool","Kitchen","Air conditioning","Smart home","Security","Backup power","Parking","Breakfast","Washing machine","Workspace"].map(a=>`<label class="chk"><input type="checkbox" data-amen="${a}"> ${a}</label>`).join("")}
    </div>
    <div class="frm-grid" style="margin-top:18px">
      <div class="frm-row"><label>Premium amenity tags</label>
        <select class="sel" id="wPremium"><option>None</option><option>Infinity pool</option><option>Private cinema</option><option>Rooftop terrace</option><option>Wine cellar</option><option>Gym</option><option>Smart home</option></select></div>
      <div class="frm-row"><label>Event hosting</label><select class="sel" id="wEvent"><option>Not available</option><option>Intimate events only</option><option>Small receptions</option></select></div>
    </div>
    <div class="panel" style="margin-top:18px">
      <h3 style="font-size:17px">House rules &amp; safety checklist</h3>
      <div class="grid-3" style="margin-top:10px">
        ${["Smoke detectors","Fire extinguisher","First-aid kit","Carbon monoxide alarm","Emergency contact card","Quiet hours 10pm"].map(a=>`<label class="chk"><input type="checkbox" checked> ${a}</label>`).join("")}
      </div>
    </div>
    <div class="wizard-foot"><button class="btn btn-ghost" onclick="wizBack()">← Back</button><button class="btn btn-gold" id="wizNext">Save &amp; continue</button></div>
  </div>`;
}
function wizPhotos(){
  const ph=WIZ.data.photos||[];
  return `<div class="wizard-step">
    <h2>Photos &amp; virtual tour</h2>
    <div class="sub">Listings with professional photography convert 2.6× better. Upload your own photos here, or book a Jollof-approved photographer.</div>
    <div style="border:2px dashed var(--line);border-radius:16px;padding:30px 22px;text-align:center;background:var(--card-2)" id="wDrop">
      <div class="why-ico" style="margin:0 auto 14px">${I.camera}</div>
      <b style="font-family:var(--fs-serif);font-size:20px">${ph.length?`${ph.length} photo${ph.length>1?"s":""} uploaded — keep going`:"Drag &amp; drop up to 30 photos"}</b>
      <div class="small" style="margin:6px 0 14px">JPG or PNG, up to 10MB each. AI will auto-enhance, detect duplicates and order them for maximum impact.</div>
      <div class="btnrow" style="justify-content:center">
        <label class="btn btn-gold btn-sm" style="cursor:pointer" for="wFiles">${I.plus} Choose photos from device
          <input type="file" id="wFiles" accept="image/jpeg,image/png,image/webp,image/*" multiple style="display:none">
        </label>
        <button class="btn btn-ghost btn-sm" onclick="wizAddPhoto()">${I.plus} Use sample photos</button>
        <button class="btn btn-ghost btn-sm" onclick="toast('A Jollof-approved photographer will contact you','camera')">Book photographer</button>
      </div>
      <div class="small" style="margin-top:10px;color:var(--ink-faint)">or tap here to browse: <button class="link-arrow" style="font-size:12px" onclick="document.getElementById('wFiles').click()">open file picker</button></div>
    </div>
    <div class="grid-4" id="wImgRow" style="margin-top:16px">
      ${ph.length? wizThumbs(ph) : wizSampleThumbs()}
    </div>
    <div class="grid-2" style="margin-top:16px">
      <div class="panel"><b style="font-family:var(--fs-serif);font-size:16px">360° virtual tour</b><p class="small" style="margin-top:4px">Add a virtual walkthrough or drone footage of the exterior for premium listings.</p>
      <button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="toast('Virtual tour scheduled — we\'ll send the capture kit','eye')">Schedule 360° capture</button></div>
      <div class="panel"><b style="font-family:var(--fs-serif);font-size:16px">AI photo analysis</b><p class="small" style="margin-top:4px">Auto-tagging, low-quality detection and optimal ordering — done automatically on upload.</p></div>
    </div>
    <div class="wizard-foot"><button class="btn btn-ghost" onclick="wizBack()">← Back</button><button class="btn btn-gold" id="wizNext">Save &amp; continue</button></div>
  </div>`;
}
function wizThumbs(ph){
  return ph.map((p,i)=>`<div class="panel" style="padding:8px;position:relative">
      <img src="${p.url}" style="border-radius:10px;aspect-ratio:4/3;object-fit:cover;width:100%" alt="${esc(p.name)}">
      <button class="icon-btn" style="position:absolute;top:14px;right:14px;width:28px;height:28px;background:rgba(10,12,9,.68);color:#f2ead2;border:none" onclick="wizRmPhoto(${i})" aria-label="Remove photo" title="Remove">${I.x}</button>
      <div class="small" style="margin-top:6px">${esc(p.name.length>20?p.name.slice(0,20)+"…":p.name)} <span style="color:var(--ok)">✓ ready</span></div>
    </div>`).join("");
}
function wizSampleThumbs(){
  return ["p1","p12","p8","p4"].map(k=>`<div class="panel" style="padding:8px;position:relative"><img src="${img(k)}" style="border-radius:10px;aspect-ratio:4/3;object-fit:cover;width:100%" alt="">
    <div class="small" style="margin-top:6px">${k==="p1"?"Living room":k==="p12"?"Garden":"Bathroom"} <span style="color:var(--ok)">✓ enhanced</span></div></div>`).join("");
}
function wizAddPhotos(input){
  if(!input||!input.files||!input.files.length) return;
  if(!WIZ.data.photos) WIZ.data.photos=[];
  let n=0;
  for(const f of input.files){
    if(WIZ.data.photos.length>=30){ toast("Up to 30 photos — remove some first","x"); break; }
    if(!/^image\//.test(f.type)){ toast(`${f.name} isn't an image — skipped`,"x"); continue; }
    if(f.size>10*1024*1024){ toast(`${f.name} is over 10MB — skipped`,"x"); continue; }
    WIZ.data.photos.push({name:f.name, size:f.size, url:window.URL.createObjectURL(f)});
    n++;
  }
  if(n){ toast(`${n} photo${n>1?"s":""} uploaded — AI enhancement queued ✨`,"camera"); wizRenderPhotos(); }
  input.value="";
}
function wizRmPhoto(i){
  if(!WIZ.data.photos) return;
  const [p]=WIZ.data.photos.splice(i,1);
  if(p&&p.url.startsWith("blob:")) window.URL.revokeObjectURL(p.url);
  toast("Photo removed","x"); wizRenderPhotos();
}
function wizRenderPhotos(){
  const row=$("#wImgRow"), drop=$("#wDrop");
  if(row) row.innerHTML=WIZ.data.photos.length?wizThumbs(WIZ.data.photos):wizSampleThumbs();
  if(drop){ const b=drop.querySelector("b"); if(b) b.textContent=WIZ.data.photos.length?`${WIZ.data.photos.length} photo${WIZ.data.photos.length>1?"s":""} uploaded — keep going`:"Drag &amp; drop up to 30 photos"; }
}
function bindWdrop(){
  const dz=$("#wDrop"), fi=$("#wFiles");
  if(!dz||!fi) return;
  fi.addEventListener("change",()=>wizAddPhotos(fi));
  ["dragover","dragenter"].forEach(ev=>dz.addEventListener(ev,e=>{ e.preventDefault(); dz.style.borderColor="var(--accent)"; dz.style.background="var(--gold-soft)"; }));
  ["dragleave","drop"].forEach(ev=>dz.addEventListener(ev,e=>{ e.preventDefault(); dz.style.borderColor=""; dz.style.background=""; }));
  dz.addEventListener("drop",e=>{ const f=e.dataTransfer&&e.dataTransfer.files; if(f&&f.length) wizAddPhotos({files:f}); });
}
function wizPricing(){
  return `<div class="wizard-step">
    <h2>Pricing &amp; revenue management</h2>
    <div class="sub">You set the base; our AI suggests premium adjustments — the final call is always yours.</div>
    <div class="grid-2">
      <div class="stack">
        <div class="panel"><div class="frm-row"><label>Base nightly rate (₦)</label><input class="inp" type="number" id="wRate" value="${WIZ.data.rate||150000}" step="5000"></div>
        <div class="frm-row"><label>Minimum nights</label><select class="sel" id="wMin"><option>1</option><option>2</option><option>3</option><option>7 (weekly)</option><option>30 (monthly)</option></select></div>
        <div class="frm-row"><label>Weekly discount</label><select class="sel" id="wDisc"><option value="0.10">−10%</option><option value="0.12" selected>−12% (recommended)</option><option value="0.15">−15%</option></select></div>
        <div class="frm-row"><label>Monthly discount</label><select class="sel" id="wDiscM"><option value="0.2">−20%</option><option value="0.25" selected>−25% (recommended)</option><option value="0.3">−30%</option></select></div>
      </div>
      <div class="stack">
        <div class="panel"><h3 style="font-size:16px">Seasonal pricing</h3>
          <div class="krow"><span class="k">Weekend premium (Fri–Sun)</span><span class="v">+15%</span></div>
          <div class="krow"><span class="k">Detty December (Dec 15 – Jan 5)</span><span class="v">+25%</span></div>
          <div class="krow"><span class="k">Easter &amp; Eid weekends</span><span class="v">+18%</span></div>
          <div class="krow"><span class="k">Lean season (Feb – Apr)</span><span class="v">−10%</span></div>
          <button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="toast('Custom per-date pricing opened — click any date in your calendar','calendar')">Edit per-date pricing</button>
        </div>
        <div class="ai-callout">${I.spark}<span><b>AI smart pricing:</b> for your area and this size, ₦148,000–₦165,000/night is forecast to maximise occupancy × revenue.</span></div>
      </div>
    </div>
    <div class="wizard-foot"><button class="btn btn-ghost" onclick="wizBack()">← Back</button><button class="btn btn-gold" id="wizNext">Save &amp; continue</button></div>
  </div>`;
}
function wizPolicy(){
  return `<div class="wizard-step">
    <h2>Policies &amp; terms</h2>
    <div class="sub">Transparent policies build trust — and trust converts.</div>
    <div class="grid-2">
      <div class="panel"><div class="frm-row"><label>Cancellation policy</label>
        <select class="sel" id="wPol"><option value="flexible">Flexible — full refund to 48h</option><option value="moderate" selected>Moderate — full refund to 5 days</option><option value="strict">Strict — 50% to 14 days</option></select></div>
        <label class="chk" style="margin-top:6px"><input type="checkbox" checked> Instant Book enabled (trusted guests)</label><br>
        <label class="chk" style="margin-top:8px"><input type="checkbox" checked> Accept split payments on 30+ nights</label><br>
        <label class="chk" style="margin-top:8px"><input type="checkbox" checked> Offer welcome packages &amp; housekeeping add-ons</label>
      </div>
      <div class="panel">
        <h3 style="font-size:16px">Payouts &amp; compliance</h3>
        <div class="krow"><span class="k">Commission</span><span class="v">12% · you keep 88%</span></div>
        <div class="krow"><span class="k">Payout schedule</span><span class="v">Weekly, automatic</span></div>
        <div class="krow"><span class="k">Withholding tax (WHT)</span><span class="v">Auto-computed &amp; filed</span></div>
        <div class="krow"><span class="k">Damage protection</span><span class="v">Included up to ₦2m</span></div>
        <div class="krow"><span class="k">Escrow release</span><span class="v">After guest check-in</span></div>
      </div>
    </div>
    <div class="wizard-foot"><button class="btn btn-ghost" onclick="wizBack()">← Back</button><button class="btn btn-gold" id="wizNext">Save &amp; continue</button></div>
  </div>`;
}
function wizReview(){
  const d=WIZ.data;
  return `<div class="wizard-step">
    <h2>Review &amp; submit</h2>
    <div class="sub">Our team verifies every new listing, then it goes live. Estimated time to first booking: <b>24–48 hours</b>.</div>
    <div class="panel" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      ${(d.photos&&d.photos[0])?`<img src="${d.photos[0].url}" style="width:150px;height:110px;object-fit:cover;border-radius:12px" alt="">`:`<img src="${img('p1')}" style="width:150px;height:110px;object-fit:cover;border-radius:12px" alt="">`}
      <div style="flex:1;min-width:220px"><b style="font-family:var(--fs-serif);font-size:21px">${esc(d.title||"The Emerald Court")}</b>
      <div class="small" style="margin-top:4px">${esc(d.area||"Ikoyi")} · ${d.guests||4} guests · ${d.beds||2} bd · rate ${fmt(d.rate||150000)}/night · ${(d.photos||[]).length||4} photo${(d.photos||[]).length===1?"":"s"}</div>
      <div class="btnrow" style="margin-top:8px"><span class="pill-status info">${I.clock} Awaiting verification</span><span class="pill-status gold">KYC complete</span></div></div>
      <button class="btn btn-ghost btn-sm" onclick="toast('AI descriptor in Luxury tone generated ✨','spark')">${I.spark} AI description · Luxury tone</button>
    </div>
    <div class="ai-callout" style="margin-top:16px">${I.spark}<span><b>AI listing check:</b> your title is missing “ocean view” — adding it could increase views by <b>+30%</b>. We'll apply it automatically.</span></div>
    <div class="frm-row"><label>Anything else we should know?</label><textarea class="txa" placeholder="Special quirks, staff on site, access notes…"></textarea></div>
    <div class="wizard-foot"><button class="btn btn-ghost" onclick="wizBack()">← Back</button><button class="btn btn-gold btn-lg" id="wizSubmit">Submit listing →</button></div>
  </div>`;
}
function wizBack(){ WIZ.step=Math.max(0,WIZ.step-1); wizRender(); }
function wizGather(){
  /* only capture fields present on the current step; never overwrite with "undefined" */
  const txt=(id,k)=>{ const el=$(id); if(el&&el.value) WIZ.data[k]=el.value; };
  const num=(id,k)=>{ const el=$(id); if(el&&el.value!=="") WIZ.data[k]=+el.value; };
  txt("#wTitle","title"); txt("#wArea","area"); txt("#wDesc","desc");
  num("#wGuests","guests"); num("#wBeds","beds"); num("#wBaths","baths"); num("#wRate","rate");
  const am=$$("[data-amen]:checked"); if(am.length) WIZ.data.amens=am.map(x=>x.dataset.amen);
}
function wizAdvance(){
  if(WIZ.step===0){
    const t=$("#wTitle"); if(!t||!t.value.trim()){ toast("Give your listing a title","x"); return; }
  }
  wizGather(); WIZ.step++; wizRender();
}
function bindHostOnboarding(){
  WIZ.step=0;
  WIZ.data.photos=WIZ.data.photos||[];
  wizRender();
  document.addEventListener("click",function wizClick(e){
    const nx=e.target.closest("#wizNext"); if(nx){ wizAdvance(); return; }
    const sub=e.target.closest("#wizSubmit"); if(sub){ wizSubmit(); return; }
  });
}
async function wizSubmit(){
  if(!requireAuth("list your residence")) return;
  wizGather();
  const d=WIZ.data;
  const btn=$("#wizSubmit"); if(btn){ btn.disabled=true; btn.textContent="Submitting…"; }
  const r=await api("listing-create.php",{
    title:d.title, area:d.area, city:d.city||"Lagos", description:d.desc,
    guests:d.guests, beds:d.beds, baths:d.baths, price:d.rate,
    type:d.type||"Apartment", policy:d.policy||"moderate",
    amenities:d.amens||[], photos:(d.photos||[]).map(p=>p.name),
  });
  if(!r.ok){ if(btn){ btn.disabled=false; btn.textContent="Submit for verification"; } toast(r.message||"Could not submit that listing","x"); return; }
  toast(r.message||"Listing submitted — our team will verify within 24h ✨","check");
  setTimeout(()=>nav("/host/dashboard?tab=listings&new=1"),700);
}
function wizAddPhoto(){
  if(!WIZ.data.photos) WIZ.data.photos=[];
  const samples=[["p1","sample-living.jpg"],["p12","sample-garden.jpg"],["p8","sample-bath.jpg"],["p4","sample-bedroom.jpg"]];
  let n=0;
  for(const [k,name] of samples){
    if(WIZ.data.photos.length>=30) break;
    if(WIZ.data.photos.some(p=>p.name===name)) continue;
    WIZ.data.photos.push({name, size:0, url:`${img(k)}`});
    n++;
  }
  if(n){ toast(`${n} sample photo${n>1?"s":""} added — AI enhancement applied ✨`,"camera"); wizRenderPhotos(); }
  else toast("Sample photos already added","check");
}

/* ---------------- HOST DASHBOARD ---------------- */
/* ============================================================
   OWNER (HOST) DASHBOARD
   Every panel below reads HOST, which the server builds from the
   owner's own rows (Repo::hostState). Nothing here is invented:
   when an owner has no data yet the panels say so rather than
   showing someone else's numbers.
   ============================================================ */

/* Small helpers so empty accounts render gracefully. */
function hdStat(){ return HOST.stats||{}; }
function hdEmpty(emoji,title,body,cta){
  return `<div class="panel hd-empty">
    <span class="hd-emoji">${emoji}</span>
    <h3 style="font-size:19px">${esc(title)}</h3>
    <p class="small" style="max-width:420px;margin:6px auto 0">${esc(body)}</p>
    ${cta||""}
  </div>`;
}
const hdAddCta = `<div class="btnrow" style="justify-content:center;margin-top:14px">
  <button class="btn btn-gold btn-sm" data-goto="/host/onboarding">Add a listing</button></div>`;
/* Charts divide by (length-1), so guard against 0 and 1 point. */
function hdSafeSeries(rows){
  const r=(rows||[]).filter(x=>x&&typeof x.v==="number");
  if(!r.length) return null;
  return r.length===1 ? [r[0],{...r[0]}] : r;
}

function pHostDashboard(q){
  const tab=(q&&q.tab)||"overview";
  const nav=[["overview","Overview","grid"],["calendar","Calendar & pricing","calendar"],["listings","Listings","building"],["analytics","Analytics","eye"],["revenue","Revenue management","spark"],["ai","AI tools","bot"],["team","Team & co-hosts","users"],["templates","Message templates","send"],["channels","Channel manager","globe"],["payouts","Payouts","wallet"]];
  const st=hdStat();
  const badges=[
    `<span class="badge">${st.listings||0} listing${(st.listings||0)===1?"":"s"}</span>`,
    st.rating?`<span class="badge ok">${I.gold} ${st.rating} rating</span>`:"",
    `<span class="badge">Take rate ${Math.round((st.takeRate||0.12)*100)}%</span>`,
    `<a class="btn btn-ghost btn-sm" href="${JL.base}logout.php">Log out</a>`,
  ].join("");
  return `${pageHead([["Home",URL("/")],["Host",URL("/host")],["Dashboard"]],"Owner <em class='serif-i'>dashboard</em>","Your listings, bookings, earnings and payouts — all in one place.",badges)}
  <div class="page-body"><div class="wrap">
    <div class="admin-shell">
      <nav class="admin-nav">
        <div class="sec">Owner tools</div>
        ${nav.map(([k,l,i])=>`<a href="${URL("/host/dashboard")}?tab=${k}" class="${tab===k?"active":""}">${I[i]} ${l}</a>`).join("")}
        <div class="sec" style="margin-top:14px">Account</div>
        <a href="${URL("/account")}">${I.users} My account</a>
        <a href="${JL.base}logout.php">${I.lock} Log out</a>
      </nav>
      <div id="hdContent">${(()=>{ const m=[["overview",hdOverview],["calendar",hdCalendar],["listings",hdListings],["analytics",hdAnalytics],["revenue",hdRevenue],["ai",hdAI],["team",hdTeam],["templates",hdTemplates],["channels",hdChannels],["payouts",hdPayouts]].find(([k])=>k===tab)||["overview",hdOverview]; return m[1](); })()}</div>
    </div>
  </div></div>`;
}

function hdOverview(){
  const st=hdStat();
  if(!HOST.listings.length) return hdEmpty("🏠","No listings yet","Once you publish your first residence, your occupancy, earnings and bookings appear here.",hdAddCta);

  const series=hdSafeSeries(HOST.earnings);
  const upcoming=(HOST.bookings||[]).filter(b=>["pending","confirmed"].includes(b.status)).slice(0,5);
  const sources=(HOST.sources||[]).filter(s=>s.v>0);
  const palette=["var(--accent)","var(--green)","var(--gold-soft)","var(--line)"];
  const srcTotal=sources.reduce((a,s)=>a+s.v,0);

  return `
  <div class="grid-4">
    ${[["Occupancy",(st.occupancy||0)+"%","last 90 days"],
       ["ADR (avg daily rate)",st.adr?K(st.adr):"—","per night sold"],
       ["RevPAR",st.revpar?K(st.revpar):"—","revenue per available night"],
       ["Booking lead time",(st.leadTime||0)+" days","average"]].map(k=>`
    <div class="stat-kpi"><div class="lbl">${k[0]}</div><div class="val">${k[1]}</div><div class="small">${k[2]}</div></div>`).join("")}
  </div>
  <div class="grid-4" style="margin-top:14px">
    ${[["Gross earnings",st.gross?fmt(st.gross):"—","all time"],
       ["Your net",st.net?fmt(st.net):"—",`after ${Math.round((st.takeRate||0.12)*100)}% platform fee`],
       ["Held in escrow",st.escrowHeld?fmt(st.escrowHeld):"—","released after check-in"],
       ["Bookings",String(st.bookings||0),`${st.upcoming||0} upcoming`]].map(k=>`
    <div class="stat-kpi"><div class="lbl">${k[0]}</div><div class="val" style="font-size:22px">${k[1]}</div><div class="small">${k[2]}</div></div>`).join("")}
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="chart-box"><h4>Earnings — last 12 months</h4>
      ${series?lineChart(series,{fmt:v=>"₦"+v+"k",labels:series.map(s=>s.l)}):`<p class="small">No earnings recorded yet.</p>`}</div>
    <div class="chart-box"><h4>Booking sources</h4>
      ${srcTotal?`${donutChart(sources.map((s,i)=>({v:s.v,c:palette[i%palette.length]})),[String(srcTotal),"bookings"])}
      <div class="legend" style="justify-content:center">${sources.map((s,i)=>`<span><i style="background:${palette[i%palette.length]}"></i>${esc(s.l)}</span>`).join("")}</div>`
      :`<p class="small">No bookings yet — sources appear once guests start booking.</p>`}
    </div>
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="panel"><h3 style="font-size:18px">Upcoming bookings</h3>
      ${upcoming.length?upcoming.map(b=>`
      <div class="krow"><span class="k"><b style="font-family:var(--fs-serif);font-size:16px">${esc(b.checkin)} → ${esc(b.checkout)}</b><br><span class="small">${esc(b.property)} · ${esc(b.guest||"Guest")}</span></span>
      <span class="v">${fmt(b.total)}<div class="sub">${b.nights} night${b.nights===1?"":"s"} · ${esc(b.status)}</div></span></div>`).join("")
      :`<p class="small">Nothing on the calendar yet.</p>`}
    </div>
    <div class="panel"><h3 style="font-size:18px">Quick actions</h3>
      <div class="btnrow" style="margin-top:6px;flex-wrap:wrap">
        <button class="btn btn-gold btn-sm" data-goto="/host/onboarding">${I.plus} Add a listing</button>
        <a class="btn btn-ghost btn-sm" href="${URL("/host/dashboard")}?tab=calendar">${I.calendar} Edit calendar</a>
        <a class="btn btn-ghost btn-sm" href="${URL("/host/dashboard")}?tab=payouts">${I.wallet} Payouts</a>
        <a class="btn btn-ghost btn-sm" href="${JL.apiBase}host-report.php?r=earnings">${I.download} Earnings CSV</a>
      </div>
      ${st.listingsPending?`<div class="ai-callout" style="margin-top:14px">${I.clock}<span>${st.listingsPending} listing${st.listingsPending===1?" is":"s are"} still in verification.</span></div>`:""}
    </div>
  </div>`;
}

/* ------------------------------------------------ calendar & pricing */
function hdCalendar(){
  if(!HOST.listings.length) return hdEmpty("📅","No calendar yet","Add a listing and you can set nightly prices and block dates here.",hdAddCta);
  const cal=HOST.calendar||{days:[]};
  const prop=cal.property;
  const opts=HOST.listings.map(l=>`<option value="${l.id}"${prop&&prop.id===l.id?" selected":""}>${esc(l.name)}</option>`).join("");
  return `
  <div class="panel">
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:16px">
      <h3 style="font-size:19px" id="hdCalTitle">${esc(cal.monthLabel||"")}</h3>
      <select class="sel" id="hdCalProp" style="max-width:260px">${opts}</select>
      <div class="btnrow" style="margin-left:auto">
        <button class="btn btn-ghost btn-sm" id="hdCalPrev">← Prev</button>
        <button class="btn btn-ghost btn-sm" id="hdCalNext">Next →</button>
        <button class="btn btn-ghost btn-sm" id="hdBulk">${I.spark} Bulk edit</button>
      </div>
    </div>
    <p class="small" style="margin-bottom:10px">Click a date to set its price or block it. Booked nights cannot be changed.</p>
    <div class="cal-grid" style="grid-template-columns:repeat(7,1fr);gap:6px" id="hdCal">${hdCalCells(cal)}</div>
    <div class="legend" style="margin-top:12px">
      <span><i style="background:var(--gold-soft)"></i>Weekend</span>
      <span><i style="background:var(--card-2)"></i>Booked</span>
      <span><i style="background:var(--line)"></i>Blocked</span>
    </div>
  </div>`;
}
function hdCalCells(cal){
  const dows=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>`<div class="dow">${d}</div>`).join("");
  const pad=Array.from({length:Math.max(0,cal.firstDow||0)}).map(()=>"<span></span>").join("");
  const cells=(cal.days||[]).map(d=>{
    const cls=["hd-cal-day"];
    if(d.weekend) cls.push("is-weekend");
    if(d.booked) cls.push("is-booked");
    if(d.blocked) cls.push("is-blocked");
    return `<div class="${cls.join(" ")}" data-day="${d.iso}" data-price="${d.price}" data-blocked="${d.blocked?1:0}" data-booked="${d.booked?1:0}" title="${d.booked?"Booked":"Edit price"}">
      <div class="d">${d.day}</div>
      <div class="p">${K(d.price)}</div>
      ${d.booked?`<div class="s" style="color:var(--ok)">booked</div>`:d.blocked?`<div class="s" style="color:var(--muted)">blocked</div>`:""}
    </div>`;
  }).join("");
  return dows+pad+cells;
}

/* -------------------------------------------------------- listings */
function hdListings(){
  if(!HOST.listings.length) return hdEmpty("🏠","No listings yet","Publish your first residence to start receiving bookings.",hdAddCta);
  return `
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>Listing</th><th>Nightly</th><th>Occupancy</th><th>Rating</th><th>Earned</th><th>Status</th><th></th></tr></thead>
    <tbody>
      ${HOST.listings.map(l=>{
        const level=l.status==="live"?"ok":(l.status==="paused"?"info":"warn");
        const label=l.status==="live"?"Live":(l.status==="paused"?"Paused":(l.status==="pending"?"In verification":cap(l.status)));
        return `<tr>
        <td><b class="strong">${esc(l.name)}</b><div class="sub">${esc(l.area||"—")}${l.city?" · "+esc(l.city):""}</div></td>
        <td>${fmt(l.price)}</td>
        <td>${l.status==="live"?l.occupancy+"%":"—"}</td>
        <td>${l.reviews?l.rating+" ("+l.reviews+")":"—"}</td>
        <td>${l.revenue?fmt(l.revenue):"—"}</td>
        <td><span class="pill-status ${level}">${label}</span></td>
        <td><div class="btnrow">
          ${l.status==="live"?`<button class="btn btn-ghost btn-sm" data-goto="/stay/${esc(l.slug)}">View</button>`:""}
          <button class="btn btn-ghost btn-sm" data-hd-price="${l.id}" data-price="${l.price}" data-name="${esc(l.name)}">${I.edit} Price</button>
          ${l.status==="live"?`<button class="btn btn-ghost btn-sm" data-hd-status="${l.id}" data-to="paused">Pause</button>`:""}
          ${l.status==="paused"?`<button class="btn btn-green btn-sm" data-hd-status="${l.id}" data-to="live">Go live</button>`:""}
        </div></td>
      </tr>`;}).join("")}
    </tbody></table></div>
  <div class="btnrow" style="margin-top:14px"><button class="btn btn-gold btn-sm" data-goto="/host/onboarding">${I.plus} Add another listing</button></div>`;
}

/* -------------------------------------------------------- analytics */
function hdAnalytics(){
  const st=hdStat();
  if(!HOST.listings.length) return hdEmpty("📊","Nothing to analyse yet","Analytics appear once your first listing is live.",hdAddCta);
  const series=hdSafeSeries(HOST.earnings);
  const byListing=HOST.listings.filter(l=>l.revenue>0).map(l=>({l:l.name.length>16?l.name.slice(0,15)+"…":l.name,v:Math.round(l.revenue/1000)}));
  return `
  <div class="grid-3">
    ${[["Bookings (all time)",String(st.bookings||0),`${st.bookings30||0} in the last 30 days`],
       ["Nights sold",String(st.nightsSold||0),"confirmed and completed"],
       ["Occupancy",(st.occupancy||0)+"%","rolling 90 days"],
       ["Guest rating",st.rating?String(st.rating):"—",`${st.reviews||0} review${(st.reviews||0)===1?"":"s"}`],
       ["Gross revenue",st.gross?fmt(st.gross):"—","before platform fee"],
       ["Awaiting approval",String(st.pending||0),"booking requests"]].map(k=>`
    <div class="stat-kpi"><div class="lbl">${k[0]}</div><div class="val" style="font-size:22px">${k[1]}</div><div class="small">${k[2]}</div></div>`).join("")}
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="chart-box"><h4>Earnings trend</h4>
      ${series?lineChart(series,{fmt:v=>"₦"+v+"k",labels:series.map(s=>s.l)}):`<p class="small">No earnings recorded yet.</p>`}</div>
    <div class="chart-box"><h4>Revenue by listing</h4>
      ${byListing.length?barChart(byListing):`<p class="small">No revenue recorded yet.</p>`}</div>
  </div>
  <div class="panel" style="margin-top:18px"><h3 style="font-size:18px">Export &amp; reports</h3>
    <div class="btnrow"><a class="btn btn-ghost btn-sm" href="${JL.apiBase}host-report.php?r=earnings">${I.download} Earnings CSV</a>
    <a class="btn btn-ghost btn-sm" href="${JL.apiBase}host-report.php?r=payouts">${I.download} Payout statement</a></div>
  </div>`;
}

/* ------------------------------------------------ revenue management */
function hdRevenue(){
  const st=hdStat();
  const rules=HOST.rules||[];
  return `
  <div class="grid-2">
    <div class="panel">
      <h3 style="font-size:18px">Pricing rules</h3>
      ${rules.length?rules.map(r=>`
      <div class="krow"><span class="k">${esc(r.name)}<div class="sub">${esc(cap(r.kind))}${r.starts?` · ${esc(r.starts)}${r.ends?" → "+esc(r.ends):""}`:""}</div></span>
        <span class="v">${r.adjust>0?"+":""}${r.adjust}%
          <div class="btnrow" style="margin-top:6px">
            <button class="btn btn-ghost btn-sm" data-rule-toggle="${r.id}">${r.active?"Pause":"Enable"}</button>
            <button class="btn btn-ghost btn-sm" data-rule-del="${r.id}">Remove</button>
          </div>
        </span></div>`).join("")
      :`<p class="small">No pricing rules yet. Add one to raise prices in peak season or discount quiet weeks.</p>`}
      <button class="btn btn-green btn-sm" style="margin-top:10px" id="hdAddRule">${I.plus} Add rule</button>
    </div>
    <div class="stack">
      <div class="panel"><h3 style="font-size:18px">What-if revenue model</h3>
        <p class="small" style="margin-bottom:8px">Based on your real occupancy (${st.occupancy||0}%) and average rate (${st.adr?fmt(st.adr):"—"}).</p>
        <div class="slider-row"><div class="lab"><span>Price index</span><b id="rwB">100%</b></div>
          <input type="range" id="rwPrice" min="80" max="125" value="100" oninput="$('#rwB').textContent=this.value+'%';rwCalc()"></div>
        <div class="calc-out">
          <div class="row"><span>Projected annual gross</span><span id="rwOut">—</span></div>
          <div class="row"><span>Projected occupancy</span><span id="rwOcc">${st.occupancy||0}%</span></div>
          <div class="row"><span>Your net after fees</span><span id="rwNet">—</span></div>
        </div>
      </div>
      ${st.occupancy>85?`<div class="ai-callout">${I.spark}<span>Occupancy is above 85% — there is room to raise your nightly rate.</span></div>`
        :st.occupancy&&st.occupancy<40?`<div class="ai-callout">${I.spark}<span>Occupancy is under 40% — a small price reduction or wider availability usually helps.</span></div>`:""}
    </div>
  </div>`;
}

function bindHostDashboard(){
  const st=hdStat();

  /* what-if model, driven by the owner's real numbers */
  window.rwCalc=()=>{
    const el=$("#rwPrice"); if(!el) return;
    const pr=+el.value/100;
    // Higher prices soften occupancy; a simple elasticity is honest enough
    // for a planning tool and is clearly labelled as a projection.
    const occ=Math.max(0,Math.min(100,Math.round((st.occupancy||0)*(1-(pr-1)*0.8))));
    const annual=(st.adr||0)*pr*(st.listings||0)*365*(occ/100);
    const out=$("#rwOut"), oc=$("#rwOcc"), net=$("#rwNet");
    if(out) out.textContent=annual?fmt(Math.round(annual)):"—";
    if(oc) oc.textContent=occ+"%";
    if(net) net.textContent=annual?fmt(Math.round(annual*(1-(st.takeRate||0.12)))):"—";
  };
  if($("#rwPrice")) window.rwCalc();

  /* ---------------- calendar ---------------- */
  const calState={month:(HOST.calendar&&HOST.calendar.month)||new Date().toISOString().slice(0,7),
                  property:(HOST.calendar&&HOST.calendar.property&&HOST.calendar.property.id)||0};

  async function calLoad(){
    const r=await api("host-action.php",{action:"calendar",property:calState.property,month:calState.month});
    if(!r.ok){ toast(r.message||"Could not load that month","x"); return; }
    HOST.calendar=r.data.calendar;
    calState.month=HOST.calendar.month;
    const grid=$("#hdCal"), title=$("#hdCalTitle");
    if(grid) grid.innerHTML=hdCalCells(HOST.calendar);
    if(title) title.textContent=HOST.calendar.monthLabel;
  }
  const shift=(n)=>{ const d=new Date(calState.month+"-01T00:00:00"); d.setMonth(d.getMonth()+n);
    calState.month=d.toISOString().slice(0,7); calLoad(); };
  if($("#hdCalPrev")) $("#hdCalPrev").addEventListener("click",()=>shift(-1));
  if($("#hdCalNext")) $("#hdCalNext").addEventListener("click",()=>shift(1));
  if($("#hdCalProp")) $("#hdCalProp").addEventListener("change",(e)=>{ calState.property=+e.target.value; calLoad(); });

  const cal=$("#hdCal");
  if(cal) cal.addEventListener("click",(e)=>{
    const cell=e.target.closest(".hd-cal-day"); if(!cell) return;
    if(cell.dataset.booked==="1"){ toast("That night is booked — cancel the booking first","clock"); return; }
    const iso=cell.dataset.day, price=+cell.dataset.price, blocked=cell.dataset.blocked==="1";
    openModal(`<h2 style="margin-bottom:4px">${iso}</h2>
      <p class="small" style="margin-bottom:14px">Set the nightly rate for this date, or block it.</p>
      <div class="frm-row"><label>Nightly rate (₦)</label><input class="inp" type="number" id="hdDayPrice" value="${price}" step="5000" min="0"></div>
      <label class="chk" style="margin-bottom:12px"><input type="checkbox" id="hdDayBlock"${blocked?" checked":""}> Block this date</label>
      <div class="btnrow"><button class="btn btn-gold" id="hdDaySave">Save</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
    const save=$("#hdDaySave");
    if(save) save.addEventListener("click",async ()=>{
      save.disabled=true;
      const r=await api("host-action.php",{action:"set-day",property:calState.property,day:iso,
        price:+($("#hdDayPrice").value||0),blocked:$("#hdDayBlock").checked});
      save.disabled=false;
      if(!r.ok){ toast(r.message||"Could not save","x"); return; }
      HOST.calendar=r.data.calendar;
      const grid=$("#hdCal"); if(grid) grid.innerHTML=hdCalCells(HOST.calendar);
      closeModal(); toast(r.message||"Saved","check");
    });
  });

  if($("#hdBulk")) $("#hdBulk").addEventListener("click",()=>{
    const first=calState.month+"-01";
    openModal(`<h2 style="margin-bottom:4px">Bulk price edit</h2>
      <p class="small" style="margin-bottom:14px">Apply one nightly rate across a date range.</p>
      <div class="frm-row"><label>From</label><input class="inp" type="date" id="hdBkFrom" value="${first}"></div>
      <div class="frm-row"><label>To</label><input class="inp" type="date" id="hdBkTo" value="${first}"></div>
      <div class="frm-row"><label>Nightly rate (₦)</label><input class="inp" type="number" id="hdBkPrice" step="5000" min="1000" placeholder="150000"></div>
      <div class="btnrow"><button class="btn btn-gold" id="hdBkSave">Apply</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
    const save=$("#hdBkSave");
    if(save) save.addEventListener("click",async ()=>{
      save.disabled=true;
      const r=await api("host-action.php",{action:"bulk-price",property:calState.property,
        from:$("#hdBkFrom").value,to:$("#hdBkTo").value,price:+($("#hdBkPrice").value||0)});
      save.disabled=false;
      if(!r.ok){ toast(r.message||"Could not apply","x"); return; }
      HOST.calendar=r.data.calendar;
      const grid=$("#hdCal"); if(grid) grid.innerHTML=hdCalCells(HOST.calendar);
      closeModal(); toast(r.message||"Updated","check");
    });
  });

  /* ---------------- delegated actions across the tabs ---------------- */
  const content=$("#hdContent");
  if(content) content.addEventListener("click",async (e)=>{
    const reload=()=>location.reload();

    const st2=e.target.closest("[data-hd-status]");
    if(st2){ const r=await api("host-action.php",{action:"listing-status",property:+st2.dataset.hdStatus,status:st2.dataset.to});
      toast(r.message||(r.ok?"Updated":"Could not update"),r.ok?"check":"x"); if(r.ok) reload(); return; }

    const pr=e.target.closest("[data-hd-price]");
    if(pr){
      const id=+pr.dataset.hdPrice;
      openModal(`<h2 style="margin-bottom:4px">${esc(pr.dataset.name||"Nightly rate")}</h2>
        <div class="frm-row"><label>Nightly rate (₦)</label><input class="inp" type="number" id="hdLp" value="${pr.dataset.price}" step="5000" min="1000"></div>
        <div class="btnrow"><button class="btn btn-gold" id="hdLpSave">Save</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
      const b=$("#hdLpSave");
      if(b) b.addEventListener("click",async ()=>{ b.disabled=true;
        const r=await api("host-action.php",{action:"listing-price",property:id,price:+($("#hdLp").value||0)});
        b.disabled=false; toast(r.message||(r.ok?"Saved":"Could not save"),r.ok?"check":"x");
        if(r.ok){ closeModal(); reload(); } });
      return;
    }

    const rt=e.target.closest("[data-rule-toggle]");
    if(rt){ const r=await api("host-action.php",{action:"rule-toggle",id:+rt.dataset.ruleToggle});
      toast(r.message||(r.ok?"Updated":"Could not update"),r.ok?"check":"x"); if(r.ok) reload(); return; }

    const rd=e.target.closest("[data-rule-del]");
    if(rd){ const r=await api("host-action.php",{action:"rule-delete",id:+rd.dataset.ruleDel});
      toast(r.message||(r.ok?"Removed":"Could not remove"),r.ok?"check":"x"); if(r.ok) reload(); return; }

    const tv=e.target.closest("[data-team-revoke]");
    if(tv){ const r=await api("host-action.php",{action:"team-revoke",id:+tv.dataset.teamRevoke});
      toast(r.message||(r.ok?"Revoked":"Could not revoke"),r.ok?"check":"x"); if(r.ok) reload(); return; }

    const td=e.target.closest("[data-tpl-del]");
    if(td){ const r=await api("host-action.php",{action:"template-delete",id:+td.dataset.tplDel});
      toast(r.message||(r.ok?"Removed":"Could not remove"),r.ok?"check":"x"); if(r.ok) reload(); return; }

    const te=e.target.closest("[data-tpl-edit]");
    if(te){ hdTemplateModal(+te.dataset.tplEdit); return; }

    const ch=e.target.closest("[data-channel]");
    if(ch){ const r=await api("host-action.php",{action:"channel-toggle",id:+ch.dataset.channel});
      toast(r.message||(r.ok?"Updated":"Could not update"),r.ok?"check":"x"); if(r.ok) reload(); return; }

    const ai=e.target.closest("[data-insight]");
    if(ai){ toast("Suggestion noted — we'll keep an eye on it","spark"); return; }
  });

  if($("#hdAddRule")) $("#hdAddRule").addEventListener("click",()=>{
    openModal(`<h2 style="margin-bottom:4px">New pricing rule</h2>
      <div class="frm-row"><label>Name</label><input class="inp" id="hdRName" placeholder="Detty December"></div>
      <div class="frm-row"><label>Adjustment (%)</label><input class="inp" type="number" id="hdRPct" value="15" step="1" min="-90" max="300"></div>
      <div class="frm-row"><label>Type</label><select class="sel" id="hdRKind">
        <option value="seasonal">Seasonal</option><option value="weekend">Weekend</option>
        <option value="lastminute">Last minute</option><option value="length">Length of stay</option><option value="custom">Custom</option>
      </select></div>
      <div class="frm-row"><label>Starts <span class="small">(optional)</span></label><input class="inp" type="date" id="hdRFrom"></div>
      <div class="frm-row"><label>Ends <span class="small">(optional)</span></label><input class="inp" type="date" id="hdRTo"></div>
      <div class="btnrow"><button class="btn btn-gold" id="hdRSave">Add rule</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
    const b=$("#hdRSave");
    if(b) b.addEventListener("click",async ()=>{ b.disabled=true;
      const r=await api("host-action.php",{action:"rule-add",name:$("#hdRName").value,
        adjust:+($("#hdRPct").value||0),kind:$("#hdRKind").value,starts:$("#hdRFrom").value,ends:$("#hdRTo").value});
      b.disabled=false; toast(r.message||(r.ok?"Added":"Could not add"),r.ok?"check":"x");
      if(r.ok){ closeModal(); location.reload(); } });
  });

  if($("#hdInvite")) $("#hdInvite").addEventListener("click",()=>{
    openModal(`<h2 style="margin-bottom:4px">Invite a co-host</h2>
      <div class="frm-row"><label>Name</label><input class="inp" id="hdTName" placeholder="Kemi Adeyemi"></div>
      <div class="frm-row"><label>Email</label><input class="inp" type="email" id="hdTEmail" placeholder="kemi@example.com"></div>
      <div class="frm-row"><label>Role</label><select class="sel" id="hdTRole">
        <option value="cohost">Co-host</option><option value="manager">Property manager</option><option value="assistant">Assistant</option>
      </select></div>
      <div class="frm-row"><label>Permissions</label><select class="sel" id="hdTPerm">
        <option value="calendar,messages">Calendar &amp; messages</option>
        <option value="calendar,messages,bookings">Calendar, messages &amp; bookings</option>
        <option value="messages">Messages only</option>
      </select></div>
      <div class="btnrow"><button class="btn btn-gold" id="hdTSave">Send invitation</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
    const b=$("#hdTSave");
    if(b) b.addEventListener("click",async ()=>{ b.disabled=true;
      const r=await api("host-action.php",{action:"team-invite",name:$("#hdTName").value,email:$("#hdTEmail").value,
        role:$("#hdTRole").value,permissions:$("#hdTPerm").value});
      b.disabled=false; toast(r.message||(r.ok?"Invited":"Could not invite"),r.ok?"check":"x");
      if(r.ok){ closeModal(); location.reload(); } });
  });

  if($("#hdNewTpl")) $("#hdNewTpl").addEventListener("click",()=>hdTemplateModal(0));

  if($("#hdPayoutEdit")) $("#hdPayoutEdit").addEventListener("click",()=>{
    const s=HOST.payoutSettings||{};
    openModal(`<h2 style="margin-bottom:4px">Payout settings</h2>
      <div class="frm-row"><label>Schedule</label><select class="sel" id="hdPSch">
        ${["daily","weekly","monthly"].map(x=>`<option value="${x}"${s.schedule===x?" selected":""}>${cap(x)}</option>`).join("")}
      </select></div>
      <div class="frm-row"><label>Bank</label><input class="inp" id="hdPBank" value="${esc(s.bank||"")}" placeholder="Zenith Bank"></div>
      <div class="frm-row"><label>Account name</label><input class="inp" id="hdPName" value="${esc(s.accountName||"")}" placeholder="Adebayo Ogunlesi"></div>
      <div class="frm-row"><label>Account number</label><input class="inp" id="hdPAcct" placeholder="0123456789"></div>
      <div class="btnrow"><button class="btn btn-gold" id="hdPSave">Save</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
    const b=$("#hdPSave");
    if(b) b.addEventListener("click",async ()=>{ b.disabled=true;
      const r=await api("host-action.php",{action:"payout-settings",schedule:$("#hdPSch").value,
        bank:$("#hdPBank").value,account_name:$("#hdPName").value,account:$("#hdPAcct").value});
      b.disabled=false; toast(r.message||(r.ok?"Saved":"Could not save"),r.ok?"check":"x");
      if(r.ok){ closeModal(); location.reload(); } });
  });
}

function hdTemplateModal(id){
  const t=(HOST.templates||[]).find(x=>x.id===id)||{id:0,title:"",body:"",trigger:"manual"};
  openModal(`<h2 style="margin-bottom:4px">${t.id?"Edit template":"New template"}</h2>
    <div class="frm-row"><label>Title</label><input class="inp" id="hdTplTitle" value="${esc(t.title)}" placeholder="Check-in instructions"></div>
    <div class="frm-row"><label>Message</label><textarea class="txa" id="hdTplBody" rows="4" placeholder="Hi {name}, ...">${esc(t.body)}</textarea></div>
    <div class="frm-row"><label>Send automatically</label><select class="sel" id="hdTplTrig">
      ${[["manual","Manually"],["confirmed","When a booking is confirmed"],["checkin","On check-in day"],["checkout","On check-out day"]]
        .map(([v,l])=>`<option value="${v}"${t.trigger===v?" selected":""}>${l}</option>`).join("")}
    </select></div>
    <p class="small" style="margin-bottom:12px">Placeholders: {name}, {property}, {dates}, {code}</p>
    <div class="btnrow"><button class="btn btn-gold" id="hdTplSave">Save</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
  const b=$("#hdTplSave");
  if(b) b.addEventListener("click",async ()=>{ b.disabled=true;
    const r=await api("host-action.php",{action:"template-save",id:t.id,title:$("#hdTplTitle").value,
      body:$("#hdTplBody").value,trigger:$("#hdTplTrig").value});
    b.disabled=false; toast(r.message||(r.ok?"Saved":"Could not save"),r.ok?"check":"x");
    if(r.ok){ closeModal(); location.reload(); } });
}

/* -------------------------------------------------------- AI tools */
function hdAI(){
  const ins=HOST.insights||[];
  const st=hdStat();
  return `
  <div class="panel"><h3 style="font-size:18px">${I.spark} Suggestions for your listings</h3>
    <p class="small" style="margin-bottom:10px">Generated from your own occupancy, pricing and review data.</p>
    ${ins.length?ins.map(i=>`
    <div class="krow"><span class="k"><b>${esc(i.title)}</b><div class="sub">${esc(i.detail)}</div></span>
      <span class="v"><span class="pill-status ${i.level}">${i.level==="ok"?"opportunity":i.level==="warn"?"needs attention":"info"}</span>
      ${i.id?`<div class="btnrow" style="margin-top:6px"><button class="btn btn-ghost btn-sm" data-insight="${i.id}">Note</button></div>`:""}</span></div>`).join("")
    :`<p class="small">No suggestions right now — everything looks healthy.</p>`}
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="panel"><h3 style="font-size:18px">Listing health</h3>
      ${HOST.listings.length?HOST.listings.map(l=>{
        const issues=[];
        if(l.status!=="live") issues.push("not live yet");
        if(!l.reviews) issues.push("no reviews");
        if(l.status==="live"&&l.occupancy<40) issues.push("low occupancy");
        return `<div class="krow"><span class="k">${esc(l.name)}</span>
          <span class="v"><span class="pill-status ${issues.length?"warn":"ok"}">${issues.length?issues.join(" · "):"healthy"}</span></span></div>`;
      }).join(""):`<p class="small">Add a listing to see its health here.</p>`}
    </div>
    <div class="panel"><h3 style="font-size:18px">Where you stand</h3>
      <div class="krow"><span class="k">Your average rate</span><span class="v">${st.adr?fmt(st.adr):"—"}</span></div>
      <div class="krow"><span class="k">Your occupancy</span><span class="v">${st.occupancy||0}%</span></div>
      <div class="krow"><span class="k">Your rating</span><span class="v">${st.rating||"—"}</span></div>
      <div class="krow"><span class="k">Nights sold</span><span class="v">${st.nightsSold||0}</span></div>
      <p class="small" style="margin-top:10px">Benchmarks against similar homes appear once we have enough comparable data in your area.</p>
    </div>
  </div>`;
}

/* ------------------------------------------------------------ team */
function hdTeam(){
  const team=HOST.team||[];
  return `<div class="panel"><h3 style="font-size:18px">Co-hosts &amp; team</h3>
    <div class="tbl-wrap" style="margin-top:10px"><table class="tbl">
      <thead><tr><th>Member</th><th>Role</th><th>Permissions</th><th>Status</th><th></th></tr></thead>
      <tbody>
        <tr><td class="strong">${esc(USER?USER.name:"You")} (owner)</td><td>Owner</td><td class="sub">All access</td><td><span class="pill-status ok">active</span></td><td></td></tr>
        ${team.map(t=>`<tr>
          <td class="strong">${esc(t.name)}<div class="sub">${esc(t.email)}</div></td>
          <td>${esc(cap(t.role))}</td>
          <td class="sub">${esc(t.permissions.split(",").join(", "))}</td>
          <td><span class="pill-status ${t.status==="active"?"ok":"info"}">${esc(t.status)}</span></td>
          <td><div class="btnrow"><button class="btn btn-ghost btn-sm" data-team-revoke="${t.id}">Revoke</button></div></td>
        </tr>`).join("")}
      </tbody></table></div>
    ${team.length?"":`<p class="small" style="margin-top:10px">No co-hosts yet. Invite someone to help manage your calendar and guests.</p>`}
    <div class="btnrow" style="margin-top:14px"><button class="btn btn-gold btn-sm" id="hdInvite">${I.plus} Invite co-host</button></div>
  </div>`;
}

/* ------------------------------------------------------- templates */
function hdTemplates(){
  const tp=HOST.templates||[];
  const trig={manual:"Sent manually",confirmed:"On booking confirmed",checkin:"On check-in day",checkout:"On check-out day"};
  return `<div class="panel"><h3 style="font-size:18px">Message templates</h3>
    <div class="small" style="margin-bottom:12px">Reusable replies for your guests.</div>
    ${tp.length?tp.map(t=>`<div class="panel" style="margin-bottom:10px;background:var(--card-2)">
      <div class="krow" style="border:none;padding:8px 0"><span class="k"><b>${esc(t.title)}</b></span>
        <span class="v">${I[t.icon]||I.send} ${esc(trig[t.trigger]||t.trigger)}</span></div>
      <p class="small">${esc(t.body)}</p>
      <div class="btnrow"><button class="btn btn-ghost btn-sm" data-tpl-edit="${t.id}">${I.edit} Edit</button>
      <button class="btn btn-ghost btn-sm" data-tpl-del="${t.id}">Remove</button></div>
    </div>`).join(""):`<p class="small">No templates yet.</p>`}
    <button class="btn btn-green btn-sm" id="hdNewTpl">${I.plus} New template</button>
  </div>`;
}

/* -------------------------------------------------------- channels */
function hdChannels(){
  const ch=HOST.channels||[];
  return `<div class="grid-2">
    <div class="panel"><h3 style="font-size:18px">Channel manager</h3>
      ${ch.length?ch.map(c=>`
      <div class="krow"><span class="k">${esc(c.channel)}<div class="sub">${c.lastSync?"last sync "+esc(c.lastSync):esc(c.note||"not connected")}</div></span>
        <span class="v"><span class="pill-status ${c.status==="connected"?"ok":"info"}">${esc(c.status)}</span>
        ${c.channel==="Direct"?"":`<div class="btnrow" style="margin-top:6px"><button class="btn btn-ghost btn-sm" data-channel="${c.id}">${c.status==="connected"?"Disconnect":"Connect"}</button></div>`}</span></div>`).join("")
      :`<p class="small">No channels configured.</p>`}
      <div class="small" style="margin-top:8px">Connecting a channel keeps your availability in sync so the same night can never be sold twice.</div>
    </div>
    <div class="panel"><h3 style="font-size:18px">Direct bookings</h3>
      <div class="krow"><span class="k">Your listings on Jollof Living</span><span class="v">${(hdStat().listingsLive)||0} live</span></div>
      <div class="krow"><span class="k">Commission</span><span class="v">${Math.round((hdStat().takeRate||0.12)*100)}%</span></div>
      <div class="krow"><span class="k">Bookings received</span><span class="v">${hdStat().bookings||0}</span></div>
      <p class="small" style="margin-top:10px">Direct bookings through Jollof Living always carry your lowest commission.</p>
    </div>
  </div>`;
}

/* --------------------------------------------------------- payouts */
function hdPayouts(){
  const st=hdStat();
  const ps=HOST.payoutSettings||{};
  const po=HOST.payouts||[];
  return `<div class="grid-3">
    ${[["Available balance",st.available>0?fmt(st.available):fmt(0),"released from escrow"],
       ["Held in escrow",st.escrowHeld?fmt(st.escrowHeld):fmt(0),"releases after check-in"],
       ["Net earned",st.net?fmt(st.net):fmt(0),"after platform fee"]].map(k=>`
    <div class="stat-kpi"><div class="lbl">${k[0]}</div><div class="val" style="font-size:22px">${k[1]}</div><div class="small">${k[2]}</div></div>`).join("")}
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="panel"><h3 style="font-size:18px">Payout settings</h3>
      <div class="krow"><span class="k">Schedule</span><span class="v">${esc(cap(ps.schedule||"weekly"))}</span></div>
      <div class="krow"><span class="k">Bank</span><span class="v">${ps.bank?esc(ps.bank)+(ps.accountLast?" ····"+esc(ps.accountLast):""):"Not set"}</span></div>
      <div class="krow"><span class="k">Account name</span><span class="v">${ps.accountName?esc(ps.accountName):"Not set"}</span></div>
      <div class="krow"><span class="k">Escrow release</span><span class="v">After guest check-in</span></div>
      <button class="btn btn-ghost btn-sm" style="margin-top:10px" id="hdPayoutEdit">${I.edit} Update</button>
      ${ps.bank?"":`<div class="ai-callout" style="margin-top:12px">${I.wallet}<span>Add your bank details so we can pay you.</span></div>`}
    </div>
    <div class="panel"><h3 style="font-size:18px">Recent payouts</h3>
      ${po.length?`<div class="tbl-wrap"><table class="tbl"><tbody>
        ${po.map(p=>`<tr><td class="strong">${esc(p.ref)}</td><td class="sub">${esc(p.date)}${p.bank?" · "+esc(p.bank):""}</td>
        <td>${fmt(p.amount)}</td><td><span class="pill-status ${p.status==="paid"?"ok":"info"}">${esc(p.status)}</span></td></tr>`).join("")}
      </tbody></table></div>`:`<p class="small">No payouts yet. Your first payout is sent once a guest checks in and escrow releases.</p>`}
      <div class="btnrow" style="margin-top:12px"><a class="btn btn-ghost btn-sm" href="${JL.apiBase}host-report.php?r=payouts">${I.download} Statement</a></div>
    </div>
  </div>`;
}

/* ---------------- PAYMENTS GLOBAL PAGE ---------------- */
function pPayments(q){
  const tab=(q&&q.tab)||"invoices";
  return `${pageHead([["Home",URL("/")],["Payments"]],"<em class='serif-i'>Payments</em>","Multi-currency, escrow-protected, and invoiced to the naira — for guests, hosts and finance teams.")}
  <div class="page-body"><div class="wrap">
    <div class="tabs" style="margin-bottom:24px" id="payTabs">
      ${[["invoices","My invoices & receipts"],["earnings","Host earnings & payouts"],["tax","Tax & compliance"],["methods","Payment methods"]].map(([k,l])=>`<button class="tab ${tab===k?"active":""}" data-pt="${k}">${l}</button>`).join("")}
    </div>
    ${[["invoices",()=>payInvoices()],["earnings",()=>payEarnings()],["tax",()=>payTax()],["methods",()=>payMethods()]].find(([k])=>k===tab)[1]()}
  </div></div>`;
}
function payInvoices(){
  return `<div class="panel"><h3 style="font-size:18px">Transactions</h3>
    <div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>Invoice</th><th>Description</th><th>Amount</th><th>Status</th><th></th></tr></thead>
    <tbody>
      ${S.bookings.slice(0,4).map((b,i)=>`<tr><td class="strong">JL-2026-${9000+i}</td><td>${esc(b.name)} · ${b.in} → ${b.out}</td><td>${fmt(b.total)}</td>
      <td><span class="pill-status ${b.status==="confirmed"?"ok":"info"}">${b.status==="confirmed"?"Paid · escrow":"Pending"}</span></td>
      <td><button class="btn btn-ghost btn-sm" onclick="openInvoice('${b.ref}')">${I.doc} PDF</button></td></tr>`).join("")}
      <tr><td class="strong">JL-2026-8311</td><td>Lagos Lagoon Cruise · 2 guests</td><td>₦170,000</td><td><span class="pill-status ok">Paid</span></td><td><button class="btn btn-ghost btn-sm" onclick="toast('Receipt downloaded','download')">${I.doc} PDF</button></td></tr>
      <tr><td class="strong">JL-2026-8304</td><td>Gift card purchase · ₦100,000</td><td>₦100,000</td><td><span class="pill-status ok">Paid</span></td><td><button class="btn btn-ghost btn-sm" onclick="toast('Receipt downloaded','download')">${I.doc} PDF</button></td></tr>
    </tbody></table></div>
    <div class="small" style="margin-top:10px">Corporate billing supported — add a PO number to any invoice in your account settings.</div>
  </div>`;
}
function payEarnings(){
  return `<div class="grid-3">
    ${[["Next payout","₦2,574,000","Friday · auto"],["Received YTD","₦38.4m","12% commission applied"],["Escrow now held","₦4,100,000","releases on check-in"]].map(k=>`
    <div class="stat-kpi"><div class="lbl">${k[1]}</div><div class="val" style="font-size:24px">${k[0]}</div><div class="small">${k[2]}</div></div>`).join("")}
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="chart-box"><h4>Host payouts — monthly</h4>${lineChart([1.8,2.2,2.6,2.9,3.3,3.9,4.2,3.9,4.4,4.7,5.1,5.6].map((v,i)=>({v,l:["F","M","A","M","J","J","A","S","O","N","D","J"][i]})),{fmt:v=>"₦"+v+"m"})}</div>
    <div class="panel"><h3 style="font-size:18px">Security deposit handling</h3>
      <div class="krow"><span class="k">Deposit (per stay)</span><span class="v">20% · pre-authorised</span></div>
      <div class="krow"><span class="k">Damage claims (YTD)</span><span class="v">2 · ₦240,000 recovered</span></div>
      <div class="krow"><span class="k">Protection cover</span><span class="v">Up to ₦2m per stay</span></div>
      <div class="btnrow" style="margin-top:10px"><button class="btn btn-ghost btn-sm" onclick="toast('Payout schedule updated — weekly Mondays','wallet')">Edit schedule</button>
      <a class="btn btn-ghost btn-sm" href="${JL.apiBase}host-report.php?r=earnings">${I.download} Export CSV</a></div>
    </div>
  </div>`;
}
function payTax(){
  return `<div class="grid-2">
    <div class="panel"><h3 style="font-size:18px">Tax &amp; compliance (auto)</h3>
      <div class="krow"><span class="k">VAT on guest bookings</span><span class="v">7.5% · remitted monthly</span></div>
      <div class="krow"><span class="k">WHT on host payouts</span><span class="v">5% · e-filed via FIRS</span></div>
      <div class="krow"><span class="k">Jurisdiction logic</span><span class="v">By property location</span></div>
      <div class="krow"><span class="k">NDPR / GDPR</span><span class="v">Compliant · DPO appointed</span></div>
      <div class="krow"><span class="k">PCI DSS</span><span class="v">Compliant · tokenised cards</span></div>
    </div>
    <div class="panel"><h3 style="font-size:18px">Corporate billing</h3>
      <div class="krow"><span class="k">Company invoices</span><span class="v">Monthly consolidated</span></div>
      <div class="krow"><span class="k">PO numbers</span><span class="v">Accepted &amp; displayed</span></div>
      <div class="krow"><span class="k">Travel policy enforcement</span><span class="v">By department · automatic</span></div>
      <button class="btn btn-green btn-sm" style="margin-top:10px" data-goto="/business">Set up business billing</button>
    </div>
  </div>`;
}
function payMethods(){
  return `<div class="grid-2">
    <div class="panel"><h3 style="font-size:18px">Saved payment methods</h3>
      <div class="krow"><span class="k">Visa •••• 4242</span><span class="v"><span class="pill-status ok">default</span></span></div>
      <div class="krow"><span class="k">Zenith bank •••• 0123</span><span class="v">host payouts</span></div>
      <div class="krow"><span class="k">USSD •• 737 code</span><span class="v">linked</span></div>
      <div class="btnrow" style="margin-top:10px"><button class="btn btn-ghost btn-sm" onclick="toast('Card add flow opened (test: 4242 4242 4242 4242)','wallet')">${I.plus} Add card</button></div>
    </div>
    <div class="stack">
      <div class="panel"><h3 style="font-size:18px">Accepted at checkout</h3>
        <div class="tbl-wrap"><table class="tbl"><tbody>
          ${PAY_METHODS.map(p=>`<tr><td>${I[p.ico]} ${p.name}</td><td class="sub">${p.note}</td><td><span class="pill-status ok">live</span></td></tr>`).join("")}
          <tr><td>${I.bolt} Cryptocurrency (BTC / USDT)</td><td class="sub">Optional for international guests</td><td><span class="pill-status warn">beta soon</span></td></tr>
        </tbody></table></div>
      </div>
      <div class="panel"><h3 style="font-size:18px">Promo codes &amp; gift cards</h3>
        <div class="krow"><span class="k">Gift card balance</span><span class="v">₦40,000</span></div>
        <div class="krow"><span class="k">Referral credit</span><span class="v">₦10,000</span></div>
        <div class="btnrow" style="margin-top:8px"><button class="btn btn-ghost btn-sm" data-goto="/giftcards">Buy gift card</button><button class="btn btn-ghost btn-sm" data-goto="/referral">Refer &amp; earn</button></div>
      </div>
    </div>
  </div>`;
}
function bindPayments(){
  $$("#payTabs .tab").forEach(t=>t.addEventListener("click",()=>nav("/payments?tab="+t.dataset.pt)));
}
