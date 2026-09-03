/* ============================================================
   JOLLOF LIVING — pages-misc.js
   membership · blog · help · business · admin · about · app · future · 404
   ============================================================ */

/* ---------------- MEMBERSHIP ---------------- */
function pMembership(){
  const tier=TIERS.find(t=>t.key===S.tier)||TIERS[2];
  const next=TIERS[Math.min(TIERS.indexOf(tier)+1,TIERS.length-1)];
  return `${pageHead([["Home","#/"],["Jollof Club"]],"<em class='serif-i'>Jollof Club</em>","Earn Jollof Points on every stay and climb from Bronze to Platinum — with perks that travel as well as you do.",
    `<span class="badge">${tier.letter} ${tier.name} · ${S.points.toLocaleString()} pts</span>`)}
  <div class="page-body"><div class="wrap">
    <div class="tiers stagger" style="margin-bottom:26px">${tierCards().join("")}</div>

    <div class="panel" style="margin-bottom:22px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:10px">
        <h3 style="font-size:20px">Your progress to ${next.name}</h3><div class="small">${S.points.toLocaleString()} / ${next.req} points</div></div>
      <div style="height:8px;border-radius:8px;background:var(--line);margin:12px 0 6px;overflow:hidden">
        <div style="width:${Math.min(100,Math.round(S.points/parseInt(next.req)*100))}%;height:100%;background:var(--gold-grad);border-radius:8px;transition:width 1s var(--ease)"></div></div>
      <div class="small">${parseInt(next.req)-S.points} points to go — a 3-night stay at your current multiplier earns ~${Math.min(parseInt(next.req)-S.points, Math.round(3*145000/1000*12))}. </div>
    </div>

    <div class="grid-2">
      <div class="panel"><h3 style="font-size:20px">Points ledger</h3>
        <div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><tbody>
          ${POINTS_LEDGER.map(r=>`<tr><td class="sub">${r[0]}</td><td>${r[1]}</td><td class="strong" style="color:${r[2].startsWith("+")?"var(--ok)":"var(--bad)"}">${r[2]}</td></tr>`).join("")}
        </tbody></table></div>
      </div>
      <div class="stack">
        <div class="panel" style="background:linear-gradient(150deg,var(--card),var(--gold-soft))">
          <h3 style="font-size:20px">Refer &amp; earn — give ₦10,000, get ₦10,000</h3>
          <p class="muted" style="font-size:14px">Share your code. When a friend completes their first stay, you each earn ₦10,000 in credits — plus points.</p>
          <div style="display:flex;gap:8px;margin:14px 0">
            <div class="inp" style="display:flex;align-items:center;justify-content:center;letter-spacing:.24em;font-weight:500;color:var(--accent)">ADEBAYO10</div>
            <button class="btn btn-gold" onclick="toast('Referral code copied','share')">${I.share} Copy</button>
          </div>
          <div class="btnrow"><button class="btn btn-green btn-sm" onclick="toast('Shared to WhatsApp — links track automatically','send')">${I.send} WhatsApp</button>
          <button class="btn btn-ghost btn-sm" data-goto="/referral">Referral centre</button></div>
        </div>
        <div class="panel"><h3 style="font-size:20px">Rewards you can redeem now</h3>
          ${[["Free airport transfer","6,000 pts","redeem"],["Late check-out (2pm)","4,000 pts","redeem"],["Complimentary room upgrade","20,000 pts","redeem"],["Private chef evening","30,000 pts","redeem"],["₦50,000 travel credit","45,000 pts","redeem"]].map(r=>`
          <div class="krow"><span class="k">${r[0]}</span><span class="v"><span class="small" style="color:var(--accent)">${r[1]}</span>
          <button class="btn btn-gold btn-sm" onclick="toast('Redeemed: ${r[0].toUpperCase().replace(/'/g,"")} ✨','gift')">Redeem</button></span></div>`).join("")}
        </div>
        <div class="panel"><h3 style="font-size:20px">Gift cards</h3>
          <p class="muted" style="font-size:14px">Send the gift of a beautiful stay: edible, elegant, never expires.</p>
          <div class="btnrow" style="margin-top:8px"><button class="btn btn-ghost btn-sm" data-goto="/giftcards">Buy a gift card</button></div>
        </div>
      </div>
    </div>
  </div></div>`;
}

/* ---------------- GIFT CARDS ---------------- */
function pGiftCards(){
  return `${pageHead([["Home","#/"],["Gift cards"]],"Jollof Living <em class='serif-i'>gift cards</em>","Digital, delivered by email or WhatsApp, redeemable against any stay — and they never expire.")}
  <div class="page-body"><div class="wrap" style="max-width:860px">
    <div class="grid-3">
      ${[["₦100,000","Weekend escape","100"],["₦250,000","The full experience","250"],["₦500,000","Detty December","500"]].map(g=>`
      <div class="panel" style="text-align:center;background:linear-gradient(160deg,var(--card),var(--gold-soft));border-color:var(--line)">
        <div class="medal" style="background:var(--gold-grad);color:#231a05;border-radius:50%;width:52px;height:52px;display:grid;place-items:center;margin:0 auto 14px;font-family:var(--fs-serif);font-size:20px;font-weight:600">${g[2]}</div>
        <h3 style="font-size:26px">${g[0]}</h3><p class="small" style="margin:4px 0 16px">${g[1]}</p>
        <button class="btn btn-gold btn-sm" onclick="toast('Gift card purchased — sent to your recipient ✨','gift')">Buy this card</button>
      </div>`).join("")}
    </div>
    <div class="panel" style="margin-top:20px"><h3 style="font-size:18px">How it works</h3>
      <div class="grid-3" style="margin-top:10px">
        ${[["1","Pick an amount","Any amount, any duration."],["2","Send instantly","Email or WhatsApp, beautifully wrapped."],["3","They book","Redeemed at checkout — balance never expires."]].map(s=>`<div><div class="eyebrow">${s[0]}</div><b style="font-family:var(--fs-serif);font-size:18px">${s[1]}</b><p class="small">${s[2]}</p></div>`).join("")}
      </div>
    </div>
  </div></div>`;
}

/* ---------------- REFERRAL ---------------- */
function pReferral(){
  return `${pageHead([["Home","#/"],["Referral"]],"Give ₦10,000, <em class='serif-i'>get ₦10,000</em>","The most generous referral in Nigerian travel — share your code, and we credit both of you.")}
  <div class="page-body"><div class="wrap" style="max-width:860px">
    <div class="grid-2">
      <div class="panel" style="background:linear-gradient(150deg,var(--card),var(--gold-soft))">
        <h3 style="font-size:22px">Your code</h3>
        <div style="font-family:var(--fs-serif);font-size:clamp(2rem,6vw,3.4rem);font-weight:600;letter-spacing:.18em;color:var(--accent);margin:12px 0">ADEBAYO10</div>
        <div class="btnrow"><button class="btn btn-gold" onclick="toast('Code copied — paste it anywhere','share')">${I.share} Copy link</button>
        <button class="btn btn-green" onclick="toast('Shared to WhatsApp ✨','send')">${I.send} Share on WhatsApp</button>
        <button class="btn btn-ghost" onclick="toast('Shared to Instagram stories','camera')">${I.camera} Instagram</button></div>
        <div class="krow" style="margin-top:14px"><span class="k">Friends joined</span><span class="v">14</span></div>
        <div class="krow"><span class="k">Credits earned</span><span class="v" style="color:var(--ok)">₦140,000</span></div>
      </div>
      <div class="panel"><h3 style="font-size:22px">Affiliate programme</h3>
        <p class="muted" style="font-size:14px">Travel bloggers, creators and influencers earn <b>8% commission</b> on every booking they refer — with a dashboard, real-time tracking and monthly payouts.</p>
        <a class="btn btn-ghost btn-sm" style="margin-top:12px" href="#/help">How the affiliate programme works</a>
      </div>
    </div>
  </div></div>`;
}

/* ---------------- BLOG ---------------- */
function pBlog(){
  return `${pageHead([["Home","#/"],["Journal"]],"The <em class='serif-i'>Journal</em>","Travel guides, culture pieces and the stories behind our residences — fresh from the Jollof Living editorial desk.","<button class='btn btn-ghost btn-sm' onclick='toast(\"Subscribed to The Journal ✨\",\"check\")'>Subscribe</button>")}
  <div class="page-body"><div class="wrap">
    <div class="grid-3 stagger">${BLOG.map(postCard).join("")}</div>
  </div></div>`;
}
function pBlogPost(slug){
  const b=BLOG.find(x=>x.slug===slug)||BLOG[0];
  return `<div class="page-head"><div class="wrap">
    <div class="crumbs"><a href="#/">Home</a> / <a href="#/blog">Journal</a> / ${b.cat}</div>
    <h1>${esc(b.title)}</h1>
    <p>${b.date} · ${b.read} read · by the Jollof Living editorial team</p>
  </div></div>
  <div class="page-body"><div class="wrap" style="max-width:780px">
    <div class="article">
      <div class="cover" style="background-image:url('data:image/jpeg;base64,${ASSETS[b.img]}')"></div>
      ${b.body.map((p,i)=>i===0?`<p style="font-size:19px;color:var(--ink);font-family:var(--fs-serif);font-size:22px;font-style:italic">${esc(p)}</p>`:`<p>${esc(p)}</p>`).join("")}
      <div class="panel" style="margin-top:30px;background:linear-gradient(150deg,var(--card),var(--gold-soft))">
        <div class="grid-2" style="align-items:center;gap:20px">
          <div><b style="font-family:var(--fs-serif);font-size:21px">Enjoyed this?</b><p class="small">Get the Journal in your inbox — guides, culture and early access.</p></div>
          <div class="btnrow"><button class="btn btn-gold btn-sm" onclick="toast('Subscribed ✨','check')">Subscribe</button><a class="btn btn-ghost btn-sm" href="#/stays">Browse stays</a></div>
        </div>
      </div>
    </div>
  </div></div>`;
}

/* ---------------- HELP ---------------- */
function pHelp(q){
  const search=(q&&q.q)?decodeURIComponent(q.q).toLowerCase():"";
  const filter=(q&&q.cat)||"all";
  const shown=FAQS.filter(f=>{ const match=!search||(f[0]+f[1]).toLowerCase().includes(search); const catMatch=filter==="all"||f[0].toLowerCase().includes({booking:"booking",payments:"payment",hosting:"host",trust:"escrow".slice(0,0)||"trust",account:"account",app:"app"}[filter]||""); return match&&catMatch; });
  return `${pageHead([["Home","#/"],["Help centre"]],"How can we <em class='serif-i'>help</em>?","Search answers, get dispute support, or reach a human — 24/7. Median first response: under 3 minutes.")}
  <div class="page-body"><div class="wrap" style="max-width:900px">
    <div style="display:flex;gap:10px;max-width:560px;margin:0 auto 26px">
      <div style="position:relative;flex:1">
        <input class="inp" id="helpSearch" placeholder="Search help articles…" style="padding:14px 18px 14px 44px" value="${search?esc(search):""}">
        <span style="position:absolute;left:16px;top:14px;color:var(--ink-faint)">${I.search}</span>
      </div>
      <button class="btn btn-gold" id="helpGo">Search</button>
    </div>
    <div class="tabs" style="justify-content:center;margin-bottom:24px" id="helpCats">
      <button class="tab ${filter==="all"?"active":""}" data-hc="all">All</button>
      ${HELP_CATEGORIES.map(c=>`<button class="tab ${filter===c.id?"active":""}" data-hc="${c.id}">${c.name}</button>`).join("")}
    </div>
    <div class="faq-list reveal" id="faqList">${shown.map(f=>faqItem(f[0],f[1])).join("")||`<div class="empty-state">${I.search}<b>No results</b>Try “escrow”, “cancel” or “referral”.</div>`}</div>
    <div class="grid-3" style="margin-top:30px">
      ${[["chat","24/7 live chat","Chat with the team or Jollof AI","#/concierge"],["phone","Call us","+234 700 JOLLOF (24/7)","#/concierge"],["send","Email support","care@jollofliving.com","#/concierge"]].map(c=>`
      <div class="panel" style="text-align:center"><div class="why-ico" style="margin:0 auto 12px">${I[c[0]]}</div>
      <b style="font-family:var(--fs-serif);font-size:19px">${c[1]}</b><p class="small">${c[2]}</p><a class="link-arrow" style="font-size:11.5px" href="${c[3]}">Open ${I.arrow}</a></div>`).join("")}
    </div>
    <div class="grid-2" style="margin-top:24px">
      <div class="panel"><h3 style="font-size:20px">${I.scale} Dispute resolution</h3>
        <p class="muted" style="font-size:14px;margin-bottom:8px">Structured, fair and fast — most disputes resolve within 48 hours.</p>
        ${[["1","Raise a dispute","From any booking, one tap."],["2","Both sides share evidence","Photos, messages, receipts."],["3","Fair outcome","Refunds, rebooking or mediation."]].map(s=>`<div class="krow"><span class="k"><b class="gold-text">${s[0]}</b> ${s[1]}</span><span class="v small">${s[2]}</span></div>`).join("")}
        <button class="btn btn-green btn-sm" style="margin-top:10px" onclick="toast('Dispute #D-4412 drafted — a mediator replies within hours','scale')">File a dispute</button>
      </div>
      <div class="panel"><h3 style="font-size:20px">${I.chatBell} Emergency assistance</h3>
        <p class="muted" style="font-size:14px;margin-bottom:10px">One-tap access, wherever you are in Nigeria.</p>
        <div class="grid-2">${[["Police","112"],["Fire","112"],["Ambulance","112"]].map(e=>`<button class="btn btn-ghost btn-sm" onclick="toast('Dialling ${e[1]}…','phone')">${e[0]} · ${e[1]}</button>`).join("")}
        <button class="btn btn-gold btn-sm" onclick="toast('Jollof Living emergency line connecting…','chatBell')">Jollof emergency line</button></div>
        <div class="small" style="margin-top:10px">Every residence includes a safety card: detectors, extinguishers, first-aid kit and local emergency contacts.</div>
      </div>
    </div>
  </div></div>`;
}
function faqItem(q,a){
  return `<div class="faq-item"><button class="faq-q" onclick="faqToggle(this)">${esc(q)}<span class="pm">${I.plus}</span></button><div class="faq-a"><div>${esc(a)}</div></div></div>`;
}
function faqToggle(btn){ const item=btn.parentElement, a=$(".faq-a",item), open=item.classList.toggle("open"); a.style.maxHeight=open?a.scrollHeight+"px":0; }
function bindHelp(){
  $("#helpGo").addEventListener("click",()=>{ const v=$("#helpSearch").value.trim();
    nav("/help?q="+encodeURIComponent(v)); });
  $("#helpSearch").addEventListener("keydown",e=>{ if(e.key==="Enter") $("#helpGo").click(); });
  $$("#helpCats .tab").forEach(t=>t.addEventListener("click",()=>nav("/help?cat="+t.dataset.hc)));
}

/* ---------------- BUSINESS ---------------- */
function pBusiness(){
  return `${pageHead([["Home","#/"],["Business"]],"<em class='serif-i'>Jollof Living</em> for Business","Corporate stays with centralized billing, travel policy enforcement, and a dedicated account manager.")}
  <div class="page-body"><div class="wrap">
    <div class="grid-4">
      ${[["38","Companies onboarded"],["1,900+","Executive nights booked"],["12 min","Avg. support response"],["100%","Policy compliance"]].map(s=>`
      <div class="stat-kpi"><div class="lbl">${s[0]}</div><div class="val gold-text">${s[1]}</div></div>`).join("")}
    </div>
    <div class="grid-2" style="margin-top:20px">
      <div class="stack">
        ${[["Centralized billing","One monthly invoice for every stay — credit terms available."],["PO & cost-centre support","Attach purchase orders, departments and projects to each booking."],["Travel policy enforcement","Per-tier nightly caps, approved properties and automatic approvals."],["Team travel dashboard","Live spend, upcoming trips and traveller check-ins for admins."]].map(f=>`
        <div class="panel" style="display:flex;gap:14px"><div class="why-ico" style="margin:0;width:44px;height:44px;border-radius:12px">${I.checkCircle}</div>
        <div><b style="font-family:var(--fs-serif);font-size:19px">${f[0]}</b><p class="muted" style="font-size:14px">${f[1]}</p></div></div>`).join("")}
      </div>
      <div class="panel" style="height:fit-content">
        <h3 style="font-size:22px">Request a demo</h3>
        <p class="muted" style="font-size:14px;margin-bottom:14px">Our corporate team will tailor a programme to your travel calendar.</p>
        <div class="frm-row"><label>Work email</label><input class="inp" placeholder="you@company.com"></div>
        <div class="frm-row"><label>Company</label><input class="inp" placeholder="Company Ltd"></div>
        <div class="frm-row"><label>Est. bookings / month</label><select class="sel"><option>1–5</option><option>6–20</option><option>21–100</option><option>100+</option></select></div>
        <button class="btn btn-gold btn-block" onclick="toast('Request received — our team will reach out within one business day ✨','check')">Request demo</button>
        <div class="small" style="text-align:center;margin-top:10px">${I.shield} NDPR-compliant · invoices in NGN, USD, GBP, EUR</div>
      </div>
    </div>
  </div></div>`;
}

/* ---------------- BACK OFFICE SIGN IN ---------------- */
function admIn(){ try{ return sessionStorage.getItem("jl_admin")==="1"; }catch(e){ return true; } }
function admSignOut(){
  try{ sessionStorage.removeItem("jl_admin"); }catch(e){}
  toast("Signed out — recorded in the audit log","lock"); nav("/admin-login");
}
function admSSO(){ toast("Redirecting to Okta SSO… (demo)","shield"); }
function pAdminLogin(){
  return `<div style="padding:calc(var(--header-h) + 40px) 20px 80px">
    <div class="auth-shell">
      <div class="auth-card">
        <div class="adl-badge">${I.lock}</div>
        <span class="eyebrow">Restricted area</span>
        <h1 style="margin-top:10px">Back office <em class="serif-i">sign in</em></h1>
        <p class="small">Operations console for the Jollof Living platform team. Access is role-based and every sign-in is written to the audit log.</p>
        <form id="adForm" novalidate>
          <div class="frm-row"><label>Work email</label><input class="inp" id="adEmail" type="email" placeholder="ops@jollofliving.com" autocomplete="username"></div>
          <div class="frm-row"><label>Password</label>
            <div class="pw-wrap"><input class="inp" id="adPass" type="password" placeholder="••••••••" autocomplete="current-password">
            <button type="button" id="adEye" aria-label="Show or hide password">${I.eye}</button></div>
          </div>
          <div class="frm-row"><label>6-digit authenticator code</label><input class="inp" id="adOtp" inputmode="numeric" placeholder="••• •••"></div>
          <button class="btn btn-gold btn-block" id="adSubmit" type="submit" style="margin-top:6px">${I.lock} Sign in to back office</button>
          <div class="btnrow" style="gap:10px;margin-top:10px">
            <button class="btn btn-ghost" type="button" onclick="admSSO()">Okta SSO</button>
            <button class="btn btn-ghost" type="button" onclick="toast('Password reset link sent to your work email','send')">Forgot password</button>
          </div>
        </form>
        ${admIn()
          ? `<div class="ai-callout" style="margin-top:16px">${I.check}<span><b>Already signed in.</b> <a href="#/admin" style="color:var(--accent)">Continue to the console →</a></span></div>`
          : `<div class="ai-callout" style="margin-top:16px">${I.key}<span><b>Demo:</b> any work email plus a 6+ character password unlocks the console.</span></div>`}
        <p class="small" style="text-align:center;margin-top:12px">${I.shield} NDPR/GDPR · 2FA enforced · sessions expire after 12 hours</p>
        <div style="text-align:center;margin-top:10px"><a class="link-arrow" href="#/">← Back to jollofliving.com</a></div>
      </div>
    </div>
  </div>`;
}
function bindAdminLogin(){
  const f=$("#adForm"); if(!f) return;
  const eye=$("#adEye");
  if(eye) eye.addEventListener("click",()=>{ const p=$("#adPass"); if(p) p.type=(p.type==="password"?"text":"password"); });
  f.addEventListener("submit",(e)=>{
    e.preventDefault();
    const em=$("#adEmail").value.trim(), pw=$("#adPass").value;
    if(!em){ toast("Enter your work email","x"); return; }
    if(pw.length<6){ toast("Password must be at least 6 characters","x"); return; }
    try{ sessionStorage.setItem("jl_admin","1"); sessionStorage.setItem("jl_admin_email",em); }catch(err){}
    toast("Welcome back — console unlocked ✨","check");
    nav("/admin");
  });
}

/* ---------------- ADMIN ---------------- */
function pAdmin(q){
  if(!admIn()) return pAdminLogin();   // gate: back office requires sign-in
  const tab=(q&&q.tab)||"dashboard";
  const nav=[["dashboard","Dashboard","grid"],["moderation","Listings moderation","eye"],["users","User management","users"],["promotions","Promotions & campaigns","gift"],["fraud","Fraud detection","shield"],["cms","Content (CMS)","doc"],["reports","Reports & analytics","scale"],["roles","Roles & permissions","lock"],["audit","Audit log","book"]];
  return `${pageHead([["Home","#/"],["Platform admin"]],"<em class='serif-i'>Back office</em>","Operate the platform — bookings, revenue, users, trust and growth in one place.","<span class='badge'>GMV this month <b>₦412m</b></span><span class='badge ok'>Take rate 12%</span><button class='btn btn-ghost btn-sm' onclick='admSignOut()'>Sign out</button>")}
  <div class="page-body"><div class="wrap">
    <div class="admin-shell">
      <nav class="admin-nav"><div class="sec">Admin</div>
        ${nav.map(([k,l,i])=>`<a href="#/admin?tab=${k}" class="${tab===k?"active":""}">${I[i]} ${l}</a>`).join("")}
      </nav>
      <div>${(()=>{ const m=[["dashboard",admDashboard],["moderation",admModeration],["users",admUsers],["promotions",admPromotions],["fraud",admFraud],["cms",adCMS],["reports",admReports],["roles",admRoles],["audit",admAudit]].find(([k])=>k===tab)||["dashboard",admDashboard]; return m[1](); })()}</div>
    </div>
  </div></div>`;
}
function admDashboard(){
  return `<div class="grid-4">
    ${[["GMV (30d)","₦412m","+18%","up"],["Active listings","1,284","+42 this month","up"],["Active users","48.2k","DAU 9.4k","up"],["Conversion funnel","3.7%","view → book","up"],["Support SLA","96%","under 5 min","up"],["NPS","72","+4 pts","up"]].map(k=>`
    <div class="stat-kpi"><div class="lbl">${k[0]}</div><div class="val" style="font-size:23px">${k[1]}</div><div class="delta ${k[3]}">${k[2]}</div></div>`).join("")}
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="chart-box"><h4>Bookings & revenue — 12 months</h4>${lineChart([18,22,26,29,34,39,44,42,48,52,58,64].map((v,i)=>({v,l:["F","M","A","M","J","J","A","S","O","N","D","J"][i]})),{fmt:v=>"₦"+v+"m"})}</div>
    <div class="chart-box"><h4>Revenue by region</h4>
      ${barChart([{l:"Lagos",v:310,c:"var(--accent)"},{l:"Abuja",v:72,c:"var(--green)"},{l:"PH",v:18},{l:"Other",v:12}])}
      <p class="small" style="margin-top:6px">AI expansion note: <b>Port Harcourt</b> demand grew 41% QoQ — candidates for new supply.</p></div>
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="chart-box"><h4>Conversion funnel</h4>
      ${barChart([{l:"Visits",v:100,c:"var(--accent)"},{l:"Search",v:82,c:"var(--accent)"},{l:"View",v:54,c:"var(--gold-soft)"},{l:"Book",v:3.7,c:"var(--green)"}])}
      <div class="legend"><span><i style="background:var(--accent)"></i>Top of funnel</span><span><i style="background:var(--green)"></i>Conversion</span></div></div>
    <div class="panel"><h3 style="font-size:18px">Live operations</h3>
      <div class="krow"><span class="k">Open disputes</span><span class="v">3 (1 urgent)</span></div>
      <div class="krow"><span class="k">Tickets in queue</span><span class="v">21 · 96% under SLA</span></div>
      <div class="krow"><span class="k">Listings awaiting moderation</span><span class="v">${ADMIN_STATE.moderation.length}</span></div>
      <div class="krow"><span class="k">Payouts today</span><span class="v">₦18.2m · 1,904 hosts</span></div>
      <div class="krow"><span class="k">Escrow held</span><span class="v">₦93m</span></div>
    </div>
  </div>`;
}
function admModeration(){
  return `<div class="panel"><h3 style="font-size:18px">Moderation queue</h3>
    <div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>Item</th><th>Type</th><th>Status</th><th></th></tr></thead><tbody>
    ${ADMIN_STATE.moderation.map(m=>`<tr><td class="strong">${m[0]}</td><td class="sub">${m[1]} · ${m[2]}</td>
      <td><span class="pill-status ${m[3]==="ok"?"ok":"warn"}">${m[3]}</span></td>
      <td><div class="btnrow"><button class="btn btn-gold btn-sm" onclick="toast('Approved — listing is live ✨','check')">Approve</button>
      <button class="btn btn-ghost btn-sm" onclick="toast('Sent back with notes','x')">Reject</button></div></td></tr>`).join("")}
    </tbody></table></div>
    <div class="small" style="margin-top:10px">AI pre-screens every listing, photo and review for prohibited content, stolen images and policy breaches before a human sees it.</div>
  </div>`;
}
function admUsers(){
  return `<div class="panel"><h3 style="font-size:18px">User management</h3>
    <div style="display:flex;gap:8px;margin:12px 0"><input class="inp" placeholder="Search users…" style="max-width:280px"><button class="btn btn-ghost btn-sm">Filter</button></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>User</th><th>Role</th><th>Tier</th><th>Joined</th><th>Status</th><th></th></tr></thead><tbody>
    ${ADMIN_STATE.users.map(u=>`<tr><td class="strong">${u[0]}</td><td class="sub">${u[1]}</td><td>${u[2]}</td><td>${u[3]}</td>
      <td><span class="pill-status ${u[5]==="Verified"?"ok":u[5].startsWith("Flagged")||u[5].startsWith("Suspended")?"warn":"info"}">${u[5]}</span></td>
      <td><div class="btnrow"><button class="btn btn-ghost btn-sm" onclick="toast('User record opened','eye')">View</button>
      ${u[6]==="warn"?'<button class="btn btn-ghost btn-sm" onclick="toast(\'User verified\',\'check\')">Verify</button>':""}
      ${u[6]==="bad"?'<button class="btn btn-ghost btn-sm" style="border-color:var(--bad);color:var(--bad)" onclick="toast(\'User suspended with audit record\',\'lock\')">Suspend</button>':""}</div></td></tr>`).join("")}
    </tbody></table></div>
  </div>`;
}
function admPromotions(){
  return `<div class="panel"><h3 style="font-size:18px">Promo &amp; campaign manager</h3>
    <div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>Campaign</th><th>Window</th><th>Status</th><th>Revenue</th><th></th></tr></thead><tbody>
    ${ADMIN_STATE.campaigns.map(c=>`<tr><td class="strong">${c[0]}</td><td class="sub">${c[1]}</td>
      <td><span class="pill-status ${c[4]==="ok"?"ok":c[4]==="info"?"info":"warn"}">${c[3]}</span></td><td>${c[2]}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="toast('Campaign editor opened','edit')">${I.edit} Edit</button></td></tr>`).join("")}
    </tbody></table></div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:14px">
      <button class="btn btn-gold btn-sm" onclick="toast('New campaign draft created','gift')">${I.plus} New campaign</button>
      <button class="btn btn-ghost btn-sm" onclick="toast('Referral programme settings opened','gift')">Referral programme</button>
      <button class="btn btn-ghost btn-sm" onclick="toast('Banner manager opened','camera')">Promo banners</button>
    </div>
  </div>`;
}
function admFraud(){
  return `<div class="panel"><h3 style="font-size:18px">AI fraud detection — live flags</h3>
    <div style="display:flex;gap:12px;margin:12px 0;flex-wrap:wrap">
      <span class="badge warn">3 high risk</span><span class="badge">2 medium</span><span class="badge ok">system healthy</span>
      <span class="small">Models: payment · listing · messaging · payout</span></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Case</th><th>Subject</th><th>Signal</th><th>Risk</th><th></th></tr></thead><tbody>
    ${ADMIN_STATE.fraud.map(f=>`<tr><td class="strong">${f[0]}</td><td class="sub">${f[1]}</td><td>${f[2]}</td>
      <td><span class="pill-status ${+f[3]>=80?"bad":+f[3]>=60?"warn":"info"}">${f[3]}%</span></td>
      <td><button class="btn btn-ghost btn-sm" onclick="toast('Case opened in risk console','shield')">Review</button></td></tr>`).join("")}
    </tbody></table></div>
    <div class="ai-callout" style="margin-top:12px">${I.spark}<span><b>AI note:</b> anomaly detection blocked <b>₦8.4m</b> of fraudulent bookings this month. New synthetic-image model deployed Monday.</span></div>
  </div>`;
}
function adCMS(){
  return `<div class="panel"><h3 style="font-size:18px">Content management</h3>
    <div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>Page</th><th>Status</th><th>Last edit</th><th>Editor</th><th></th></tr></thead><tbody>
    ${ADMIN_STATE.cms.map(c=>`<tr><td class="strong">${c[0]}</td><td><span class="pill-status ${c[1]==="Live"?"ok":"warn"}">${c[1]}</span></td><td class="sub">${c[2]}</td><td class="sub">${c[3]}</td>
    <td><button class="btn btn-ghost btn-sm" onclick="toast('Editor opened','edit')">${I.edit}</button></td></tr>`).join("")}
    </tbody></table></div>
    <div class="btnrow" style="margin-top:12px"><button class="btn btn-gold btn-sm" onclick="toast('New page draft created','doc')">${I.plus} New page</button>
    <button class="btn btn-ghost btn-sm" onclick="toast('SEO settings — meta & schema updated','search')">SEO defaults</button></div>
  </div>`;
}
function admReports(){
  return `<div class="panel"><h3 style="font-size:18px">Reporting &amp; analytics</h3>
    <p class="small" style="margin-bottom:12px">Custom reports on occupancy, revenue by region, demographics and booking trends.</p>
    <div class="grid-3">
      ${[["Occupancy by region","Monthly · dashboard"],["Revenue by month","YTD · export"],["User demographics","Quarterly"],["Booking trends","Weekly"],["Host funnel","Monthly"],["Support SLA","Real-time"]].map(r=>`
      <div class="panel" style="background:var(--card-2)"><b style="font-family:var(--fs-serif);font-size:17px">${r[0]}</b><div class="small" style="margin:4px 0 10px">${r[1]}</div>
      <div class="btnrow"><button class="btn btn-ghost btn-sm" onclick="toast('Report opened','eye')">Open</button><button class="btn btn-ghost btn-sm" onclick="toast('Exported to CSV','download')">${I.download} CSV</button></div></div>`).join("")}
    </div>
  </div>`;
}
function admRoles(){
  return `<div class="panel"><h3 style="font-size:18px">Role-based access control</h3>
    <div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>Role</th><th>Access</th><th>Members</th><th></th></tr></thead><tbody>
    ${[["Admin","Full platform access","3","ok"],["Moderator","Listings, reviews, content","6","ok"],["Support agent","Users, disputes, messages","14","ok"],["Finance","Payouts, invoices, tax","2","ok"],["Marketing","Campaigns, CMS, banners","4","ok"],["Analyst","Reports (read-only)","2","info"]].map(r=>`
    <tr><td class="strong">${r[0]}</td><td class="sub">${r[1]}</td><td>${r[2]}</td>
    <td><button class="btn btn-ghost btn-sm" onclick="toast('Permissions matrix opened','lock')">${I.edit} Edit</button></td></tr>`).join("")}
    </tbody></table></div>
    <div class="small" style="margin-top:10px">Every admin action is written to the immutable audit log — accountability by design.</div>
  </div>`;
}
function admAudit(){
  return `<div class="panel"><h3 style="font-size:18px">Audit log</h3>
    <div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th></th></tr></thead><tbody>
    ${ADMIN_STATE.audit.map(a=>`<tr><td class="sub">${a[0]}</td><td>${a[1]}</td><td>${a[2]}</td>
    <td><span class="pill-status ${a[3]==="ok"?"ok":a[3]==="warn"?"warn":"info"}">${a[3]}</span></td></tr>`).join("")}
    </tbody></table></div>
    <div class="btnrow" style="margin-top:12px"><button class="btn btn-ghost btn-sm" onclick="toast('Audit log exported (read-only)','download')">${I.download} Export</button>
    <button class="btn btn-ghost btn-sm" onclick="toast('Retention: 7 years, immutable','lock')">Retention policy</button></div>
  </div>`;
}

/* ---------------- ABOUT ---------------- */
function pAbout(){
  return `${pageHead([["Home","#/"],["About"]],"Luxury living, <em class='serif-i'>African soul</em>","Jollof Living exists to show the world that world-class luxury service is Nigerian-born and Nigerian-bred.")}
  <div class="page-body"><div class="wrap">
    <div class="grid-2" style="align-items:center">
      <div class="article">
        <h2>The story</h2>
        <p>We started Jollof Living after years of watching brilliant Nigerian homes — penthouses over the lagoon, courtyard houses in Ikoyi, villas behind Banana Island's guarded bridge — offered with indifferent service on global platforms that never understood them.</p>
        <p>So we built the platform we wanted: the operational depth of the world's best travel companies, the trust of escrow payments, the intelligence of AI — and the warmth of Nigerian hospitality. "Jollof" is the dish that brings everyone to one table. That's the standard.</p>
        <h2>What we believe</h2>
        <p>Every stay should feel considered — nothing average, never indifferent. And every guest, host and team member should be protected by design, not by promise.</p>
      </div>
      <div>
        <div class="collections-grid" style="grid-template-columns:1fr 1fr;gap:12px">
          ${[["p1","Est. 2025","Lagos & Abuja"],["p7","120+ features","25+ AI"],["p12","Jollof Verified","every home"],["p3","4.93★","avg rating"]].map(([img,b,t])=>`
          <div class="col-card" style="height:170px"><div class="img" style="background-image:url('data:image/jpeg;base64,${ASSETS[img]}')"></div><div class="veil"></div><div class="meta"><h3 style="font-size:17px">${b}</h3><p>${t}</p></div></div>`).join("")}
        </div>
      </div>
    </div>
    <div class="grid-3" style="margin-top:44px">
      ${[["shield","Compliance & privacy","NDPR & GDPR compliant. PCI-DSS secure payments. 2FA everywhere. Data export & erase available on request — a DPO is appointed."],
         ["scale","Anti-discrimination","Fair booking practices enforced on every listing, in every language. Equal access for all guests is a platform rule, not a policy aspiration."],
         ["leaf","Sustainability","Carbon offset at checkout, “Green Stay” badges, and a transparent sustainability score on every residence."]].map(c=>`
      <div class="panel"><div class="why-ico">${I[c[0]]}</div><h3 style="font-size:19px">${c[1]}</h3><p class="muted" style="font-size:14px">${c[2]}</p></div>`).join("")}
    </div>
    <div class="panel" style="margin-top:26px;background:linear-gradient(150deg,var(--card),var(--gold-soft));text-align:center">
      <b style="font-family:var(--fs-serif);font-size:24px">The road ahead</b>
      <p class="muted" style="max-width:60ch;margin:6px auto 14px">Business travel, fractional investment, AR previews — the full roadmap is open.</p>
      <a class="btn btn-gold" href="#/future">See the roadmap</a>
    </div>
  </div></div>`;
}

/* ---------------- REVIEWS ---------------- */
function pReviews(){
  const feat=PROPERTIES.filter(p=>p.reviewsList).slice(0,3);
  const avg=(PROPERTIES.reduce((a,p)=>a+p.rating,0)/PROPERTIES.length).toFixed(2);
  const tot=PROPERTIES.reduce((a,p)=>a+p.reviews,0);
  return `${pageHead([["Home","#/"],["Reviews"]],"Loved by <em class='serif-i'>thousands</em>","Every review below comes from a verified, completed stay. Nothing else is allowed on Jollof Living — it's in the platform rules.","<span class='badge ok'>${I.star} ${avg} average</span>")}
  <div class="page-body"><div class="wrap">
    <div class="grid-4">
      ${[[avg,"Average rating across residences"],[(tot).toLocaleString(),"Verified guest reviews"],[97,"% would stay again"],[72,"NPS — world-class range"]].map(s=>`
      <div class="stat-kpi"><div class="lbl">${s[0]}</div><div class="val gold-text" style="font-size:26px">${s[1]}</div></div>`).join("")}
    </div>
    <div class="grid-2" style="margin-top:20px">
      <div>
        <h3 style="font-size:20px;margin-bottom:12px">Recent verified reviews</h3>
        <div class="stack">${feat.map(p=>p.reviewsList.slice(0,2).map(r=>`
        <div class="rev-row panel"><div class="hd"><span class="avatar">${r[0][0]}</span>
          <div><b style="font-family:var(--fs-serif);font-size:17px">${esc(r[0])}</b><div class="small">${esc(r[1])} · stayed at <a href="#/stay/${p.id}">${esc(p.name)}</a></div></div>
          <span class="pill-status ok" style="margin-left:auto">${I.check} Verified stay</span></div>
          <div class="stars" style="margin:8px 0 6px">${I.star.repeat(5)}</div>
          <q>“${esc(r[2])}”</q></div>`).join("")).join("")}</div>
      </div>
      <div class="stack">
        <div class="ai-callout">${I.spark}<span><b>AI review summaries.</b> When a residence passes 20 reviews, Jollof AI distils them into one honest paragraph — guests see the real picture in seconds, hosts get an evidence-based improvement list.</span></div>
        ${feat.map(p=>`<div class="panel"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px">
          <b style="font-family:var(--fs-serif);font-size:18px">${esc(p.name)}</b>
          <span class="small">${I.star} ${p.rating.toFixed(2)} · ${p.reviews} reviews</span></div>
          <p class="small" style="margin-top:8px">${esc(p.aiSummary)}</p>
          <a class="link-arrow" style="font-size:11.5px" href="#/stay/${p.id}">Read ${p.reviews} reviews ${I.arrow}</a></div>`).join("")}
        <div class="panel" style="background:linear-gradient(150deg,var(--card),var(--gold-soft))">
          <h3 style="font-size:20px">How reviews work here</h3>
          ${[["Only verified stays","Bookings on the platform can be reviewed — nothing else."],["No pay-to-play","Hosts can't remove or buy reviews. Period."],["Structured + free-text","Cleanliness, accuracy, check-in, location, value & fairness."],["AI, then humans","Summaries are AI-drafted; wild claims always get human review."]].map(r=>`
          <div class="krow"><span class="k">${I.checkCircle}</span><span class="v">${r[0]} — <span class="muted">${r[1]}</span></span></div>`).join("")}
        </div>
      </div>
    </div>
    <h3 style="font-size:22px;margin:34px 0 14px;text-align:center">Stories from our guests</h3>
    <div class="rev-wall stagger">${TESTIMONIALS.map(t=>`
      <figure class="rev-card"><div class="stars">${I.star.repeat(5)}</div><q>“${esc(t[2])}”</q>
      <figcaption class="rev-who"><span class="avatar">${t[0][0]}</span><div><div class="nm">${esc(t[0])}</div><div class="st">${esc(t[1])}</div></div></figcaption></figure>`).join("")}
    </div>
  </div></div>`;
}

/* ---------------- APP ---------------- */
function pApp(){
  return `${pageHead([["Home","#/"],["Mobile app"]],"The <em class='serif-i'>app</em>","Keyless check-in, live messaging, wallet passes, voice booking — the whole platform, in your pocket.")}
  <div class="page-body"><div class="wrap" style="max-width:940px">
    <div class="grid-2" style="align-items:center">
      <div>${phoneMock()}</div>
      <div class="stack">
        ${[["key","Keyless check-in","Smart-lock codes generated per booking, expiring at checkout."],["chat","In-app messaging","Real-time chat with hosts and Jollof — read receipts, media, translation."],["calendar","Trips & wallet passes","Everything in one place: bookings, invoices, boarding passes to your stay."],["bot","Voice booking","“Hey Siri, book my favourite apartment in Abuja for Christmas.”"],["notification","Push, SMS & WhatsApp","Price drops, confirmations and reminders where you already are."],["shield","Biometric security","Face ID + 2FA, with your documents in an encrypted vault."]].map(f=>`
        <div style="display:flex;gap:14px"><div class="why-ico" style="margin:0;width:44px;height:44px;border-radius:12px">${I[f[0]]}</div>
        <div><b style="font-family:var(--fs-serif);font-size:19px">${f[1]}</b><p class="muted" style="font-size:14px">${f[2]}</p></div></div>`).join("")}
        <div class="btnrow" style="margin-top:8px">
          <button class="btn btn-gold" onclick="toast('iPhone demo build — coming to TestFlight','phone')">${I.phone} App Store</button>
          <button class="btn btn-ghost" onclick="toast('Android demo build — coming to Play','phone')">${I.phone} Google Play</button>
        </div>
      </div>
    </div>
  </div></div>`;
}

/* ---------------- ROADMAP ---------------- */
function pFuture(){
  return `${pageHead([["Home","#/"],["Roadmap"]],"The <em class='serif-i'>future</em> of Jollof Living","A live product roadmap — what's shipping, what's building, what's dreaming.")}
  <div class="page-body"><div class="wrap">
    <div class="legend" style="margin-bottom:16px">
      <span><i style="background:var(--ok)"></i>Live</span>
      <span><i style="background:var(--accent)"></i>In development</span>
      <span><i style="background:var(--info)"></i>Research</span>
    </div>
    <div class="grid-3">${ROADMAP.map(r=>`
      <div class="road-card"><span class="ph ${r.ph}">${r.status==="live"?"Live":r.status==="dev"?"In development":"Coming soon"}</span>
      <h3>${r.title}</h3><p>${r.desc}</p></div>`).join("")}
    </div>
  </div></div>`;
}

/* ---------------- 404 ---------------- */
function p404(){
  return `<div style="padding:calc(var(--header-h) + 90px) 20px;text-align:center">
    <div style="font-family:var(--fs-serif);font-size:clamp(5rem,16vw,9rem);font-weight:600;line-height:1" class="gold-text">404</div>
    <h1 style="font-size:clamp(1.6rem,4vw,2.4rem);margin:10px 0 8px">This address doesn't exist — yet</h1>
    <p class="muted" style="max-width:44ch;margin:0 auto 22px">The page you're looking for has checked out. Let us take you somewhere beautiful instead.</p>
    <div class="btnrow" style="justify-content:center"><a class="btn btn-gold" href="#/">Back home</a><a class="btn btn-ghost" href="#/stays">Browse stays</a></div>
  </div>`;
}
