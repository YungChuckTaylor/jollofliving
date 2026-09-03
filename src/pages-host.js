/* ============================================================
   JOLLOF LIVING — pages-host.js
   host landing · onboarding wizard · host dashboard · payments
   ============================================================ */

/* ---------------- HOST LANDING ---------------- */
function pHost(){
  return `${pageHead([["Home","#/"],["Host"]],"Host with <em class='serif-i'>Jollof Living</em>","We handle photography, pricing intelligence, guest screening and payouts — you keep 88% and the compliments.",
    `<a class="btn btn-gold" href="#/host/onboarding">Start the listing wizard</a><a class="btn btn-ghost" href="#/host/dashboard">Open host dashboard</a>`)}
  <div class="page-body"><div class="wrap">
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
        <div class="btnrow"><a class="btn btn-gold" href="#/host/onboarding">List my residence</a><a class="btn btn-ghost" href="#/payments">See how payouts work</a></div>
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
        <div class="btnrow" style="margin-top:14px"><button class="btn btn-ghost btn-sm" onclick="toast('Co-host invitation sent','users')">${I.users} Invite co-host</button><button class="btn btn-ghost btn-sm" data-goto="/host/dashboard?tab=listings">My listings</button></div>
      </div>
    </div>
  </div></div>`;
}

/* wizard constants */
const WIZ_STEPS=["Basics","Details & amenities","Photos","Pricing","Policies & rules","Review & submit"];
const WIZ={ step:0, data:{} };

function pHostOnboarding(){
  return `${pageHead([["Home","#/"],["Host","#/host"],["Listing wizard"]],"Create your <em class='serif-i'>listing</em>","Guided step-by-step — you can save and return anytime. Progress is never lost.")}
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
    <div class="wizard-foot"><a class="btn btn-ghost" href="#/host">← Cancel</a><button class="btn btn-gold" id="wizNext">Save &amp; continue</button></div>
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
  return ["p1","p12","p8","p4"].map(k=>`<div class="panel" style="padding:8px;position:relative"><img src="data:image/jpeg;base64,${ASSETS[k]}" style="border-radius:10px;aspect-ratio:4/3;object-fit:cover;width:100%" alt="">
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
      ${(d.photos&&d.photos[0])?`<img src="${d.photos[0].url}" style="width:150px;height:110px;object-fit:cover;border-radius:12px" alt="">`:`<img src="data:image/jpeg;base64,${ASSETS.p1}" style="width:150px;height:110px;object-fit:cover;border-radius:12px" alt="">`}
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
    const sub=e.target.closest("#wizSubmit"); if(sub){
      const d=WIZ.data;
      S.hostListings.unshift({title:d.title||"The Emerald Court", area:d.area||"Ikoyi", rate:d.rate||150000,
        photos:(d.photos||[]).length, status:"verification", added:new Date().toISOString().slice(0,10) });
      dump();
      nav("/host/dashboard?tab=listings&new=1");
      toast("Listing submitted — our team will verify within 24h ✨","check");
      return;
    }
  });
}
function wizAddPhoto(){
  if(!WIZ.data.photos) WIZ.data.photos=[];
  const samples=[["p1","sample-living.jpg"],["p12","sample-garden.jpg"],["p8","sample-bath.jpg"],["p4","sample-bedroom.jpg"]];
  let n=0;
  for(const [k,name] of samples){
    if(WIZ.data.photos.length>=30) break;
    if(WIZ.data.photos.some(p=>p.name===name)) continue;
    WIZ.data.photos.push({name, size:0, url:`data:image/jpeg;base64,${ASSETS[k]}`});
    n++;
  }
  if(n){ toast(`${n} sample photo${n>1?"s":""} added — AI enhancement applied ✨`,"camera"); wizRenderPhotos(); }
  else toast("Sample photos already added","check");
}

/* ---------------- HOST DASHBOARD ---------------- */
function pHostDashboard(q){
  const tab=(q&&q.tab)||"overview";
  const nav=[["overview","Overview","grid"],["calendar","Calendar & pricing","calendar"],["listings","Listings","building"],["analytics","Analytics","eye"],["revenue","Revenue management","spark"],["ai","AI tools","bot"],["team","Team & co-hosts","users"],["templates","Message templates","send"],["channels","Channel manager","globe"],["payouts","Payouts","wallet"]];
  return `${pageHead([["Home","#/"],["Host","#/host"],["Dashboard"]],"Host <em class='serif-i'>dashboard</em>","Earnings, occupancy, bookings and every tool of the Jollof Living host suite.",
    `<span class="badge ok">${I.gold} Superhost</span><span class="badge">KYC verified</span>`)}
  <div class="page-body"><div class="wrap">
    <div class="admin-shell">
      <nav class="admin-nav">
        <div class="sec">Host tools</div>
        ${nav.map(([k,l,i])=>`<a href="#/host/dashboard?tab=${k}" class="${tab===k?"active":""}">${I[i]} ${l}</a>`).join("")}
      </nav>
      <div id="hdContent">${(()=>{ const m=[["overview",hdOverview],["calendar",hdCalendar],["listings",hdListings],["analytics",hdAnalytics],["revenue",hdRevenue],["ai",hdAI],["team",hdTeam],["templates",hdTemplates],["channels",hdChannels],["payouts",hdPayouts]].find(([k])=>k===tab)||["overview",hdOverview]; return m[1](); })()}</div>
    </div>
  </div></div>`;
}
function hdOverview(){
  const weekends=[[180,220,260,290,330,380,420,400,440,470,510,560].map((v,i)=>({v,l:["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan"][i]}))];
  return `
  <div class="grid-4">
    ${[["Occupancy","78%","+6 pts vs last month","up"],["ADR (avg daily rate)","₦219k","+3% seasonally","up"],["RevPAR","₦171k","+9%","up"],["Booking lead time","11 days","−2 days faster","up"]].map(k=>`
    <div class="stat-kpi"><div class="lbl">${k[0]}</div><div class="val">${k[1]}</div><div class="delta ${k[3]}" >${k[2]}</div></div>`).join("")}
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="chart-box"><h4>Earnings — last 12 months</h4>
      ${lineChart([180,220,260,290,330,380,420,400,440,470,510,560].map((v,i)=>({v,l:["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan"][i]})),{fmt:v=>"₦"+v+"k"})}</div>
    <div class="chart-box"><h4>Booking sources</h4>
      ${donutChart([{v:46,c:"var(--accent)"},{v:27,c:"var(--green)"},{v:17,c:"var(--gold-soft)"},{v:10,c:"var(--line)"}],["78%","direct"])}
      <div class="legend" style="justify-content:center"><span><i style="background:var(--accent)"></i>Jollof app & web</span><span><i style="background:var(--green)"></i>Channel partners</span><span><i style="background:var(--gold-soft)"></i>Referrals</span><span><i style="background:var(--line)"></i>Corporate</span></div>
    </div>
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="panel"><h3 style="font-size:18px">Upcoming bookings</h3>
      ${[["Sep 6 – Sep 10","4 nights · ₦740,000","The Island Retreat"],["Sep 14 – Oct 12","28 nights · ₦4.1m · split pay","Villa Azur"],["Oct 2 – Oct 5","3 nights · ₦495,000","The Onyx Penthouse"]].map(b=>`
      <div class="krow"><span class="k"><b style="font-family:var(--fs-serif);font-size:16px">${b[0]}</b><br><span class="small">${b[2]}</span></span><span class="v">${b[1]}</span></div>`).join("")}
    </div>
    <div class="panel"><h3 style="font-size:18px">Quick actions</h3>
      <div class="btnrow" style="margin-top:6px">
        <button class="btn btn-green btn-sm" onclick="nav('/host/dashboard?tab=calendar')">${I.calendar} Block dates</button>
        <button class="btn btn-green btn-sm" onclick="nav('/host/dashboard?tab=revenue')">${I.spark} Adjust pricing</button>
        <button class="btn btn-green btn-sm" onclick="toast('Automated guest check-in instructions sent','send')">${I.send} Message templates</button>
        <button class="btn btn-green btn-sm" onclick="toast('Invite sent — co-host will appear in Team','users')">${I.users} Invite co-host</button>
      </div>
      <div class="ai-callout" style="margin-top:14px">${I.spark}<span><b>AI forecast:</b> raising weekend rates by 15% through December is projected to add <b>₦1.8m</b> in revenue.</span></div>
    </div>
  </div>`;
}
function hdCalendar(){
  const m=new Date();
  const days=new Date(m.getFullYear(),m.getMonth()+1,0).getDate();
  const prices=[...Array(days)].map((_,i)=> 150000 + (i%7>=5?22000:0) + (i>20?18000:0));
  return `
  <div class="panel">
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:16px">
      <h3 style="font-size:19px">${m.toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</h3>
      <span class="small">· click a date to edit its price</span>
      <div class="btnrow" style="margin-left:auto">
        <button class="btn btn-ghost btn-sm" onclick="toast('Date range blocked — message template offered','calendar')">${I.calendar} Block dates</button>
        <button class="btn btn-ghost btn-sm" onclick="toast('Price rule applied to all selected dates','spark')">${I.spark} Bulk edit</button>
      </div>
    </div>
    <div class="cal-grid" style="grid-template-columns:repeat(7,1fr);gap:6px" id="hdCal">
      ${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>`<div class="dow">${d}</div>`).join("")}
      ${Array.from({length:(new Date(m.getFullYear(),m.getMonth(),1).getDay()+6)%7}).map(()=>"<span></span>").join("")}
      ${prices.map((p,i)=>`<div class="hdc pdate" style="border:1px solid var(--line-soft);border-radius:10px;padding:8px 4px;text-align:center;cursor:pointer;${i%7>=5?"border-color:var(--accent);background:var(--gold-soft)":""}" data-d="${i+1}" title="Edit price">
        <div style="font-size:13px">${i+1}</div>
        <div style="font-size:10px;color:var(--accent);white-space:nowrap">${K(p)}</div>
        ${i>20?`<div style="font-size:9px;color:var(--ok)">booked</div>`:""}
      </div>`).join("")}
    </div>
    <div class="small" style="margin-top:10px">Gold = weekend premium (+15%) · green = booked · click any date to open the price editor with AI suggestions.</div>
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="panel"><h3 style="font-size:17px">Availability rules</h3>
      <div class="krow"><span class="k">Minimum stay</span><span class="v">2 nights · 7 on weekends</span></div>
      <div class="krow"><span class="k">Maximum stay</span><span class="v">60 nights</span></div>
      <div class="krow"><span class="k">Check-in window</span><span class="v">3:00 PM – 10:00 PM</span></div>
      <div class="krow"><span class="k">Auto-block gap</span><span class="v">1 night between bookings</span></div>
    </div>
    <div class="panel"><h3 style="font-size:17px">Per-date pricing</h3>
      <div class="krow"><span class="k">Base rate</span><span class="v">₦150,000</span></div>
      <div class="krow"><span class="k">Weekend premium</span><span class="v" style="color:var(--accent)">+15%</span></div>
      <div class="krow"><span class="k">Dec 20 – Jan 5 demand premium</span><span class="v" style="color:var(--accent)">+25%</span></div>
      <div class="krow"><span class="k">Last-minute discount (48h)</span><span class="v">−15% auto</span></div>
    </div>
  </div>`;
}
function hdListings(){
  const mine=[
    ["The Island Retreat","Banana Island","₦240,000","92%","4.94","Live","ok","island-retreat"],
    ["The Onyx Penthouse","Lekki Phase 1","₦185,000","81%","4.97","Live","ok","onyx"],
    ["The Lagoon Villa","Victoria Island","₦175,000","76%","4.96","Live","ok","lagoon-villa"],
  ];
  const pending=S.hostListings.map(l=>[l.title,(l.area||"—")+(l.photos?` · ${l.photos} photo${l.photos>1?"s":""}`:""),fmt(l.rate),"—","—","In verification","warn",""]);
  return `
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>Listing</th><th>Nightly</th><th>Occupancy</th><th>Rating</th><th>Status</th><th></th></tr></thead>
    <tbody>
      ${[...mine,...pending].map(r=>`<tr>
        <td><b class="strong">${esc(r[0])}</b><div class="sub">${esc(r[1])}</div></td>
        <td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td>
        <td><span class="pill-status ${r[6]}">${r[5]}</span></td>
        <td><div class="btnrow">${r[7]?`<button class="btn btn-ghost btn-sm" data-goto="/stay/${r[7]}">View</button>`:""}
        <button class="btn btn-ghost btn-sm" onclick="toast('Listing editor opened','edit')">${I.edit} Edit</button>
        <button class="btn btn-ghost btn-sm" onclick="toast('Listing paused — calendar preserved','clock')">Pause</button></div></td>
      </tr>`).join("")}
    </tbody>
  </table></div>
  <div class="ai-callout" style="margin-top:16px">${I.spark}<span><b>AI listing optimizer:</b> three listings are missing “lagoon view” in their titles — adding it is projected to lift views by <b>+30%</b>. <button class="btn btn-gold btn-sm" style="margin-left:8px" onclick="toast('Optimisation applied to all listings ✨','spark')">Apply to all</button></span></div>`;
}
function hdAnalytics(){
  const views=[120,300,420,380,520,640,580,760,830,910];
  return `
  <div class="grid-3">
    ${[["Profile views","8.4k","last 30 days"],["Conversion (view→book)","4.8%","vs 3.9% category avg"],["Search position","Top 3","for 'Lagos villa'"],["Competitors benchmark","12% below avg price","similar homes"],["Guest review score","4.95","132 reviews"],["New enquiries","31","this week"]].map(k=>`
    <div class="stat-kpi"><div class="lbl">${k[1]}</div><div class="val" style="font-size:24px">${k[0]}</div><div class="small">${k[2]}</div></div>`).join("")}
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="chart-box"><h4>Views &amp; enquiries (90 days)</h4>${lineChart(views.map((v,i)=>({v,l:["Jul","Jul","Aug","Aug","Aug","Aug","Sep","Sep","Sep","Sep"][i]})),{fmt:v=>v+" views"})}</div>
    <div class="chart-box"><h4>Competitor benchmark</h4>
      ${barChart([{l:"Yours",v:171,c:"var(--accent)"},{l:"Similar homes",v:185},{l:"Area average",v:205},{l:"Top 10%",v:260}])}
      <p class="small" style="margin-top:8px">${I.spark} AI: “You're priced ~12% below comparable verified homes — a +8% raise is sustainable.”</p>
    </div>
  </div>
  <div class="panel" style="margin-top:18px"><h3 style="font-size:18px">Export &amp; reports</h3>
    <div class="btnrow"><button class="btn btn-ghost btn-sm" onclick="toast('Earnings report downloaded (CSV)','download')">${I.download} Earnings CSV</button>
    <button class="btn btn-ghost btn-sm" onclick="toast('Performance report downloaded (PDF)','download')">${I.download} Performance PDF</button>
    <button class="btn btn-ghost btn-sm" onclick="toast('Statement emailed to your accountant','send')">${I.send} Send to accountant</button></div>
  </div>`;
}
function hdRevenue(){
  return `
  <div class="grid-2">
    <div class="panel">
      <h3 style="font-size:18px">Seasonal pricing rules</h3>
      <div class="krow"><span class="k">Weekend premium (Fri–Sun)</span><span class="v">+15% ${sparkline([12,15,15,15,18,15,15])}</span></div>
      <div class="krow"><span class="k">Detty December (Dec 15–Jan 5)</span><span class="v">+25% ${sparkline([8,10,14,18,25,25,22])}</span></div>
      <div class="krow"><span class="k">Holiday Eids &amp; Easter</span><span class="v">+18%</span></div>
      <div class="krow"><span class="k">Lean season (Feb–Apr)</span><span class="v">−10%</span></div>
      <div class="krow"><span class="k">Last-minute (within 48h)</span><span class="v">−15% auto</span></div>
      <button class="btn btn-green btn-sm" style="margin-top:10px" onclick="toast('New seasonal rule created — Dec 20 +25%','spark')">${I.plus} Add rule</button>
    </div>
    <div class="stack">
      <div class="panel"><h3 style="font-size:18px">What-if revenue model <span class="badge" style="vertical-align:2px">AI</span></h3>
        <p class="small" style="margin-bottom:8px">Move the sliders — projected revenue recalculates instantly.</p>
        <div class="slider-row"><div class="lab"><span>Min. stay (nights)</span><b id="rwA">2</b></div><input type="range" id="rwMin" min="1" max="7" value="2" oninput="$('#rwA').textContent=this.value;rwCalc()"></div>
        <div class="slider-row"><div class="lab"><span>Price index</span><b id="rwB">100%</b></div><input type="range" id="rwPrice" min="80" max="125" value="100" oninput="$('#rwB').textContent=this.value+'%';rwCalc()"></div>
        <div class="calc-out"><div class="row"><span>Projected annual revenue</span><span id="rwOut">₦41.2m</span></div>
        <div class="row"><span>Projected occupancy</span><span id="rwOcc">78%</span></div></div>
      </div>
      <div class="ai-callout">${I.spark}<span><b>AI demand forecast:</b> occupancy is projected to exceed <b>92%</b> between Dec 20 – Jan 5. Current prices are 8% below market.</span></div>
    </div>
  </div>`;
}
function bindHostDashboard(){
  window.rwCalc=()=>{
    const min=+$("#rwMin").value, pr=+$("#rwPrice").value/100;
    const occ=Math.min(96,Math.round(78-(min-2)*2+ (pr-1)*40));
    const rev=41.2*pr*(occ/78);
    $("#rwOut").textContent="₦"+(rev).toFixed(1)+"m";
    $("#rwOcc").textContent=occ+"%";
  };
  $$("#hdCal .pdate").forEach(c=>c.addEventListener("click",()=>{
    openModal(`<h2 style="margin-bottom:4px">Price for Sep ${c.dataset.d}</h2>
      <p class="small" style="margin-bottom:14px">AI suggests <b style="color:var(--accent)">₦165,000</b> for this date (weekend demand +4%).</p>
      <div class="frm-row"><label>Nightly rate (₦)</label><input class="inp" type="number" value="150000" step="5000"></div>
      <label class="chk" style="margin-bottom:12px"><input type="checkbox" checked> Apply AI suggestion</label>
      <div class="btnrow"><button class="btn btn-gold" onclick="closeModal();toast('Date price updated — calendar synced to channels','spark')">Save price</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
  }));
}
function hdAI(){
  return `
  <div class="grid-2">
    <div class="panel"><h3 style="font-size:18px">${I.spark} AI listing optimizer</h3>
      <div class="krow"><span class="k">Title keyword: “lagoon view”</span><span class="v" style="color:var(--ok)">add → +30% views</span></div>
      <div class="krow"><span class="k">Photo order (24 photos)</span><span class="v">3 re-ordered</span></div>
      <div class="krow"><span class="k">Description tone</span><span class="v">Luxury · English + French</span></div>
      <div class="krow"><span class="k">A/B test running</span><span class="v">Titles “v2” vs “v1” · day 5 of 14</span></div>
      <button class="btn btn-green btn-sm" style="margin-top:10px" onclick="toast('AI optimiser applied to live listing ✨','spark')">Apply all suggestions</button>
    </div>
    <div class="panel"><h3 style="font-size:18px">${I.camera} AI photo enhancement</h3>
      <div class="krow"><span class="k">Images analysed</span><span class="v">24/24</span></div>
      <div class="krow"><span class="k">Auto-enhanced</span><span class="v" style="color:var(--ok)">17</span></div>
      <div class="krow"><span class="k">Low-quality flagged</span><span class="v" style="color:var(--bad)">2 (reshoot suggested)</span></div>
      <div class="krow"><span class="k">Auto-tagged rooms</span><span class="v">24 tags</span></div>
      <button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="toast('Photographer booked — Thursday 10am','camera')">Book photographer</button>
    </div>
    <div class="panel"><h3 style="font-size:18px">${I.clock} AI maintenance predictor</h3>
      ${[["AC compressor · Unit 2","service in 6 weeks","warn"],["Water heater · Annex","healthy · next check Jan","ok"],["Smart lock battery","replace before Dec season","warn"]].map(m=>`
      <div class="krow"><span class="k">${m[0]}</span><span class="v"><span class="pill-status ${m[2]}">${m[1]}</span></span></div>`).join("")}
      <div class="small" style="margin-top:8px">Repairs auto-scheduled during vacancy gaps to protect occupancy.</div>
    </div>
    <div class="panel"><h3 style="font-size:18px">${I.shield} AI guest screening</h3>
      <div class="krow"><span class="k">Requests screened (30 days)</span><span class="v">31</span></div>
      <div class="krow"><span class="k">Approved instantly</span><span class="v">28</span></div>
      <div class="krow"><span class="k">Flagged for review</span><span class="v" style="color:var(--bad)">3</span></div>
      <div class="krow"><span class="k">Fraud blocked</span><span class="v" style="color:var(--bad)">1 (stolen card)</span></div>
    </div>
    <div class="panel"><h3 style="font-size:18px">${I.bot} AI automated messaging</h3>
      <div class="small" style="margin-bottom:8px">Context-aware auto-responders, active 24/7:</div>
      <div class="krow"><span class="k">Booking confirmations</span><span class="v" style="color:var(--ok)">Auto</span></div>
      <div class="krow"><span class="k">Check-in instructions</span><span class="v" style="color:var(--ok)">Auto + smart code</span></div>
      <div class="krow"><span class="k">Check-out reminders</span><span class="v" style="color:var(--ok)">Auto</span></div>
      <div class="krow"><span class="k">Upsell suggestions</span><span class="v">Chef, transfer, housekeeping</span></div>
    </div>
    <div class="panel"><h3 style="font-size:18px">${I.scale} AI competitive analysis</h3>
      <div class="krow"><span class="k">Your rate</span><span class="v">₦150,000</span></div>
      <div class="krow"><span class="k">Comparable average</span><span class="v">₦170,000</span></div>
      <div class="krow"><span class="k">AI verdict</span><span class="v" style="color:var(--accent)">+8% sustainable</span></div>
    </div>
  </div>`;
}
function hdTeam(){
  return `<div class="panel"><h3 style="font-size:18px">Co-hosts &amp; team</h3>
    <div class="tbl-wrap" style="margin-top:10px"><table class="tbl">
      <thead><tr><th>Member</th><th>Role</th><th>Permissions</th><th></th></tr></thead>
      <tbody>
        ${[["You (owner)","Owner","All access","—"],["Kemi A.","Co-host · Kemi","Calendar, messages, bookings","manager"],["Yusuf D.","Property manager","Calendar, housekeeping, finance","manager"],["Chidi N.","Assistant","Messages only","viewer"]].map(r=>`
        <tr><td class="strong">${r[0]}</td><td>${r[1]}</td><td class="sub">${r[2]}</td>
        <td><div class="btnrow">${r[3]==="manager"?`<button class="btn btn-ghost btn-sm" onclick="toast('Role updated','users')">${I.edit} Edit role</button>`:""}
        ${r[3]==="manager"||r[3]==="viewer"?`<button class="btn btn-ghost btn-sm" onclick="toast('Access revoked','lock')">Revoke</button>`:""}</div></td></tr>`).join("")}
      </tbody></table></div>
    <div class="btnrow" style="margin-top:14px"><button class="btn btn-gold btn-sm" onclick="toast('Invitation sent with role-based permissions ✨','users')">${I.plus} Invite co-host</button></div>
    <div class="small" style="margin-top:10px">Role-based access: admin, moderator, finance, marketing, support — every action is logged in the audit trail.</div>
  </div>`;
}
function hdTemplates(){
  const tp=[["Booking confirmation","Hi {name}! Your reservation at {property} is confirmed 🎉 · {dates} · check-in code {code}","send"],
    ["Check-in instructions","The smart lock opens with {code}. Wi-Fi: Jollof-5G / {password}. Car park B, spot 12.","key"],
    ["Check-out reminder","Check-out is at 11am tomorrow. Message us for a late check-out (2pm) or housekeeping!","clock"],
    ["5-star ask","We'd love a review — it takes a minute and means the world. → {link}","star"]];
  return `<div class="panel"><h3 style="font-size:18px">Automated message templates</h3>
    <div class="small" style="margin-bottom:12px">Sent automatically based on booking status — edits apply instantly.</div>
    ${tp.map(t=>`<div class="panel" style="margin-bottom:10px;background:var(--card-2)">
      <div class="krow" style="border:none;padding:8px 0"><span class="k"><b>${t[0]}</b></span><span class="v">${I[t[2]]||I.send} active</span></div>
      <p class="small">${t[1]}</p>
      <button class="btn btn-ghost btn-sm" onclick="toast('Template editor opened','edit')">${I.edit} Edit</button>
    </div>`).join("")}
    <button class="btn btn-green btn-sm" onclick="toast('New template created from draft','plus')">${I.plus} New template</button>
  </div>`;
}
function hdChannels(){
  return `<div class="grid-2">
    <div class="panel"><h3 style="font-size:18px">Channel manager — availability sync</h3>
      ${[["Airbnb","Connected","ok","last sync 4 min ago"],["Booking.com","Connected","ok","last sync 6 min ago"],["VRBO / Expedia","Connected","ok","last sync 12 min ago"],["Direct (jollofliving.com)","Live","ok","always"]].map(c=>`
      <div class="krow"><span class="k">${c[0]}</span><span class="v"><span class="pill-status ${c[2]}">${c[1]}</span><div class="sub">${c[3]}</div></span></div>`).join("")}
      <div class="small" style="margin-top:8px">Two-way sync — a booking on any channel instantly blocks your calendar everywhere. No double-bookings, ever.</div>
    </div>
    <div class="stack">
      <div class="panel"><h3 style="font-size:18px">Smart integrations</h3>
        <div class="krow"><span class="k">Smart locks (August · Yale · Nuki)</span><span class="v" style="color:var(--ok)">connected</span></div>
        <div class="krow"><span class="k">Smart home (lights, AC, thermostat)</span><span class="v" style="color:var(--ok)">connected</span></div>
        <div class="krow"><span class="k">Accounting (QuickBooks, Xero)</span><span class="v" style="color:var(--ok)">connected</span></div>
        <div class="krow"><span class="k">CRM (HubSpot)</span><span class="v"><button class="btn btn-ghost btn-sm" onclick="toast('CRM connection started','globe')">Connect</button></span></div>
        <div class="krow"><span class="k">Analytics (GA4, Mixpanel)</span><span class="v" style="color:var(--ok)">connected</span></div>
      </div>
      <div class="panel"><h3 style="font-size:18px">Automated access codes</h3>
        <p class="small">Codes generate per booking, expire at checkout, and rotate for every stay. Audited and timestamped.</p>
        <div class="krow"><span class="k">Next booking</span><span class="v">4471# · Sep 6</span></div>
      </div>
    </div>
  </div>`;
}
function hdPayouts(){
  return `<div class="grid-3">
    ${[["Available balance","₦2,574,000","next payout Fri"],["Last payout","₦3,890,000","Aug 30 · Zenith 0123"],["Total earned (YTD)","₦38.4m","all listings"]].map(k=>`
    <div class="stat-kpi"><div class="lbl">${k[1]}</div><div class="val" style="font-size:24px">${k[0]}</div><div class="small">${k[2]}</div></div>`).join("")}
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="panel"><h3 style="font-size:18px">Payout settings</h3>
      <div class="krow"><span class="k">Schedule</span><span class="v">Weekly · Mondays</span></div>
      <div class="krow"><span class="k">Method</span><span class="v">Bank transfer · Zenith 0123-4567</span></div>
      <div class="krow"><span class="k">WHT (withholding tax)</span><span class="v">Auto-computed &amp; remitted</span></div>
      <div class="krow"><span class="k">Escrow release</span><span class="v">After guest check-in</span></div>
      <button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="toast('Payout settings — update confirmed','wallet')">${I.edit} Update</button>
    </div>
    <div class="panel"><h3 style="font-size:18px">Recent payouts &amp; escrow</h3>
      <div class="tbl-wrap"><table class="tbl"><tbody>
        ${[["PO-88731","Aug 30 · 4 bookings","₦3,890,000","Paid","ok"],["PO-88730","Aug 23 · 3 bookings","₦2,740,000","Paid","ok"],["ESC-4412","Villa Azur · Sep 14–Oct 12","₦4,100,000","Held in escrow","info"]].map(r=>`
        <tr><td class="strong">${r[0]}</td><td class="sub">${r[1]}</td><td>${r[2]}</td><td><span class="pill-status ${r[4]}">${r[3]}</span></td>
        <td><button class="btn btn-ghost btn-sm" onclick="toast('Statement downloaded','download')">${I.download}</button></td></tr>`).join("")}
      </tbody></table></div>
    </div>
  </div>`;
}

/* ---------------- PAYMENTS GLOBAL PAGE ---------------- */
function pPayments(q){
  const tab=(q&&q.tab)||"invoices";
  return `${pageHead([["Home","#/"],["Payments"]],"<em class='serif-i'>Payments</em>","Multi-currency, escrow-protected, and invoiced to the naira — for guests, hosts and finance teams.")}
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
      <button class="btn btn-ghost btn-sm" onclick="toast('Earnings CSV downloaded','download')">${I.download} Export CSV</button></div>
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
