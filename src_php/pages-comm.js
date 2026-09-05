/* ============================================================
   JOLLOF LIVING — pages-comm.js
   messages · notifications · concierge · account · auth
   ============================================================ */

/* ---------------- MESSAGES ---------------- */
let msgState=null;
function pMessages(q){
  if(!msgState||(q&&q.to&&msgState.lastTo!==q.to)) { /* reset on new visit */ }
  msgState={lastTo:(q&&q.to)||"concierge"};
  return `${pageHead([["Home",URL("/")],["Messages"]],"<em class='serif-i'>Inbox</em>","Real-time chat with hosts, support and Jollof — with read receipts, media sharing and AI translation.")}
  <div class="page-body"><div class="wrap">
    <div class="chat-page">
      <aside class="conv-list" id="convList">
        <h3>Conversations</h3>
        ${CONVERSATIONS.map(c=>`<div class="conv ${c.id===msgState.lastTo?"active":""}" data-conv="${c.id}">
          <span class="avatar ${c.id==="concierge"?"green":"ivory"}">${c.id==="concierge"?"J":c.name[0]}</span>
          <div class="inf"><div class="nm">${esc(c.name)}</div><div class="last">${esc(c.msgs[c.msgs.length-1].text.replace(/<[^>]+>/g,"").slice(0,26))}…</div></div>
          <span class="t">${c.msgs[c.msgs.length-1].t}</span>
        </div>`).join("")}
        <div style="display:grid;gap:9px;margin-top:16px">
          <a class="btn btn-ghost btn-sm" href="${URL('/messages')}?to=concierge">${I.plus} Message the concierge</a>
        </div>
      </aside>
      <div class="chat-main" id="chatMain"></div>
    </div>
  </div></div>`;
}
function chatThread(id){
  const c=CONVERSATIONS.find(x=>x.id===id);
  msgState.thread=id;
  const isJenny=c.id==="support";
  return `
  <div class="chat-head">
    <span class="avatar ${c.id==="concierge"?"green":"ivory"}">${c.id==="concierge"?"J":c.name[0]}</span>
    <div><div class="nm">${esc(c.name)}</div><div class="st">${esc(c.sub)}</div></div>
    <div class="btnrow" style="margin-left:auto">
      <a class="icon-btn" href="tel:${esc((JL.data&&JL.data.contactPhone)||'+2348000000000')}" title="Call the concierge">${I.call}</a>
    </div>
  </div>
  <div class="chat-body" id="chatBody">
    ${c.moreDays?`<div class="day">Yesterday</div>`:""}
    ${c.msgs.map(m=>`<div class="msg ${m.from==="me"?"me":"bot"}" >${m.text}
      <span class="mtime">${m.t}${m.from==="me"?` <span class="rr">${m.read?"read":"delivered"} ${m.read?I.check:I.check}</span>`:""}</span></div>`).join("")}
  </div>
  <div class="quick-replies" id="qrBox">
    ${["Check-in code, please","Can I extend by a night?","Send me the invoice","Airport transfer, please"].map(x=>`<button data-qr="${esc(x)}">${esc(x)}</button>`).join("")}
  </div>
  <div class="chat-foot">

    <input class="inp" id="chatInp" placeholder="Write a message…" style="border-radius:999px">
    <button class="btn btn-gold" style="border-radius:50%;width:46px;height:46px;padding:0" id="chatSend" aria-label="Send">${I.send.replace("<svg","<svg style='width:18px;height:18px'")}</button>
  </div>`;
}
function bindMessages(q){
  const thread=(q&&q.to)||"concierge";
  const load=(id)=>{ $("#chatMain").innerHTML=chatThread(id);
    const body=$("#chatBody"); body.scrollTop=body.scrollHeight;
    $("#chatSend").addEventListener("click",()=>sendChat(id));
    $("#chatInp").addEventListener("keydown",e=>{ if(e.key==="Enter") sendChat(id); });
    $$("#qrBox button").forEach(b=>b.addEventListener("click",()=>{ $("#chatInp").value=b.dataset.qr; sendChat(id); }));
  };
  $$(".conv").forEach(c=>c.addEventListener("click",()=>{ $$(".conv").forEach(x=>x.classList.remove("active")); c.classList.add("active"); load(c.dataset.conv); }));
  load(thread);
}
async function sendChat(id){
  const inp=$("#chatInp"); const txt=inp.value.trim(); if(!txt) return; inp.value="";
  const conv=CONVERSATIONS.find(x=>x.id===id);
  const body=$("#chatBody");
  body.insertAdjacentHTML("beforeend",`<div class="msg me">${esc(txt)}<span class="mtime">sending…</span></div>`);
  body.scrollTop=body.scrollHeight;
  /* the API keys threads by their numeric row id */
  const r=await api("message-send.php",{conversation:conv?conv.cid:id,text:txt});
  const mine=body.querySelector(".msg.me:last-child .mtime");
  if(!r.ok){ if(mine) mine.textContent="not delivered"; toast(r.message||"Message not delivered","x"); return; }
  if(mine) mine.textContent=(r.data&&r.data.time?r.data.time:"now")+" · delivered ✓";
  if(r.data&&r.data.reply){
    body.insertAdjacentHTML("beforeend",`<div class="msg bot">${r.data.reply}<span class="mtime">${esc(r.data.replyTime||"now")}</span></div>`);
    body.scrollTop=body.scrollHeight;
  }
  const badge=$("#msgCount"); if(badge){ badge.style.display="none"; }
}

/* ---------------- NOTIFICATIONS ---------------- */
function pNotif(){
  const unread=S.notifications.filter(n=>n.unread).length;
  return `${pageHead([["Home",URL("/")],["Notifications"]],"<em class='serif-i'>Notifications</em>",`${unread} unread · booking alerts, price drops, promotions and system updates.`,
    `<button class="btn btn-ghost btn-sm" onclick="markAllRead()">Mark all read</button>
     <button class="btn btn-ghost btn-sm" onclick="openNotifSettings()">Preferences</button>`)}
  <div class="page-body"><div class="wrap" style="max-width:820px">
    <div class="panel" style="padding:10px 20px">
      ${S.notifications.length?S.notifications.map(n=>{ const isU=n.unread;
        return `<div class="notif-item ${isU?"unread":""}"><span class="ico">${I[n.ico]||I.check}</span>
        <div class="bd"><b>${esc(n.title)}</b><p>${esc(n.body)}</p><div class="t">${esc(n.time)}</div></div>
        ${isU?`<button class="icon-btn" style="width:30px;height:30px" onclick="markRead(${n.id})" title="Mark read">${I.check}</button>`:""}
      </div>`; }).join(""):`<div class="empty-state">${I.notification}<b>No notifications yet</b>Booking alerts, price drops and promotions will land here.</div>`}
    </div>
    <div class="panel" style="margin-top:18px">
      <h3 style="font-size:18px">Delivery channels</h3>
      <div class="grid-3" style="margin-top:10px">
        ${[["Push notifications","On"],["Email digest","Daily"],["SMS alerts","Critical only"],["WhatsApp updates","On"],["Price drops","Instant"],["Marketing","Weekly"]].map(([k,v])=>`<div class="krow"><span class="k">${k}</span><span class="v" style="color:var(--ok)">${v}</span></div>`).join("")}
      </div>
      <div class="btnrow" style="margin-top:12px"><button class="btn btn-ghost btn-sm" onclick="toast('Preferences saved','check')">Save preferences</button></div>
    </div>
  </div></div>`;
}
async function markRead(id){
  const r=await api("notifications.php",{action:"read",id});
  if(!r.ok){ toast(r.message||"Could not update that notification","x"); return; }
  const n=S.notifications.find(x=>x.id===id); if(n) n.unread=false;
  render(); renderBadges();
}
async function markAllRead(){
  const r=await api("notifications.php",{action:"read-all"});
  if(!r.ok){ toast(r.message||"Could not update notifications","x"); return; }
  S.notifications.forEach(n=>{ n.unread=false; });
  render(); renderBadges(); toast("All caught up ✨","check");
}
function savePref(el){
  api("notifications.php",{action:"pref",key:el.parentElement.textContent.trim(),on:el.checked})
    .then(r=>toast(r.ok?"Preference updated":"Could not save that preference", r.ok?"check":"x"));
}
function openNotifSettings(){
  openModal(`<h2 style="margin-bottom:14px">Notification preferences</h2>
    ${[["Booking confirmations & reminders",true],["Price drops on wishlisted homes",true],["Promotions & seasonal campaigns",true],["WhatsApp booking updates",true],["SMS for critical alerts",true],["Product news & Jollof Club",false]].map(([k,v],i)=>`<label class="chk" style="margin:10px 0"><input type="checkbox" ${v?"checked":""} onchange="savePref(this)"> ${k}</label>`).join("")}
    <div class="btnrow" style="margin-top:14px"><button class="btn btn-gold" onclick="closeModal();toast('Preferences saved ✨','check')">Save</button></div>`);
}

/* ---------------- CONCIERGE ---------------- */
function concReply(txt){
  const t=txt.toLowerCase();
  const byArea=PROPERTIES.find(p=>t.includes(p.area.toLowerCase()));
  if(/itinerar|plan|weekend|schedule|itinerary/.test(t)){
    const p=byArea||PROPERTIES[0];
    return `Here's your <b>dream weekend</b> itinerary ✨<br><b>Day 1:</b> check-in at ${p.name} (3pm) → sunset cruise on the lagoon (6pm)<br><b>Day 2:</b> private chef brunch → Nike Art Gallery → rooftop dinner at ${p.area}<br><b>Day 3:</b> spa ritual in-residence → late checkout (2pm).<br>Bundle it — the experience package saves ~15%.`;
  }
  if(/hello|hi|hey|good (morning|evening)/.test(t)) return "Hello! 👋 I'm <b>Jollof</b>, your AI concierge — ask me about stays, prices, transfers or experiences, in English, Pidgin or Yoruba.";
  if(/book|want|need|find|stay|apartment|place|room|nice/.test(t)){
    const pick=byArea||PROPERTIES.find(p=>p.price<=150000)||PROPERTIES[0];
    return `I can help! ✨ <b>${pick.name}</b> in ${pick.area} (${fmt(pick.price)}/night, ★${pick.rating}) is a lovely fit — ${pick.instant?"it's <b>Instant Book</b>, no approval needed.":"the host confirms within 24h."} Want me to add a transfer or chef?`;
  }
  if(/how much|price|cost|cheap|budget|naira|₦/.test(t)){
    const opts=[...PROPERTIES].sort((a,b)=>a.price-b.price).slice(0,3);
    return `Prices start at ${fmt(opts[0].price)}/night. Best value now: ${opts.map(p=>`<b>${p.name}</b> (${fmt(p.price)})`).join(" · ")}. Weekly −12%, monthly −25% + split payments.`;
  }
  if(/lagos|lekki|ikoyi|victoria|banana|eko|abuja|maitama/.test(t)){
    const city=/abuja|maitama/.test(t)?"Abuja":"Lagos";
    const list=PROPERTIES.filter(p=>p.city===city).slice(0,3);
    return `${city} has ${PROPERTIES.filter(p=>p.city===city).length} residences — ${list.map(p=>`<b>${p.name}</b>`).join(", ")}. Tap any card for rates, photos & availability.`;
  }
  if(/pool|wifi|gym|cinema|amenit/.test(t)){
    const p=byArea||PROPERTIES[0];
    return `<b>${p.name}</b> offers: ${p.amens.slice(0,4).join(", ").toLowerCase()} and more. Use the filters in Explore to narrow by amenity.`;
  }
  if(/payment|pay|escrow|split|installment|transfer|currency|crypto/.test(t))
    return "Pay by card, bank transfer, USSD, mobile money, Paystack, Flutterwave, Stripe, Apple/Google Pay — in NGN, USD, GBP or EUR. Funds sit in <b>escrow</b> until you check in; 30+ night stays split <b>50/50</b>. 🔒";
  if(/chef|cook|food|jollof|restaurant/.test(t)) return "Our private chefs are Jollof-approved — Nigerian fine dining, jollof masterclasses and tasting menus in your kitchen. From ₦55,000. Want your dates? 🍲";
  if(/boat|cruise|lagoon|experience|tour/.test(t)) return "Signature experiences: <b>Lagos sunset cruises</b> (₦85k), private chefs, spa rituals and heritage tours. Bundle any with your stay — save ~15%. 🛥️";
  if(/safe|security|verified|trust/.test(t)) return "Every Jollof listing is KYC-verified, AI-screened and (for the gold badge) inspected in person. Payments ride in escrow until you confirm check-in. 🛡️";
  if(/long|month|weekly|discount/.test(t)) return "7+ nights: −12%. 30+ nights: −25%, split payments, and a digital lease agreement. Long-stay, made effortless. 📆";
  if(/cancel|refund/.test(t)) return "Cancellation tiers: <b>Flexible</b> (full refund to 48h), <b>Moderate</b> (full to 5 days), <b>Strict</b> (50% to 14 days). Every listing shows its policy before payment.";
  if(/host|list|earn|income|rent out/.test(t)) return "Hosts keep <b>88%</b>, with dynamic pricing, weekly escrow payouts, professional photography and sync to Airbnb, Booking.com & VRBO. Use the earnings calculator on the Host page. 🏠";
  if(/refer|invite|friend/.test(t)) return "Our referral programme: <b>give ₦10,000, get ₦10,000</b>. Your code is <b>ADEBAYO10</b> — share it from the Membership page. 🎁";
  if(/thank|thanks/.test(t)) return "You're welcome! 🇳🇬 Anything else — transfers, chefs, or a last-minute deal within 48 hours?";
  return "I can help with <b>bookings</b>, <b>prices</b>, <b>amenities</b>, <b>payments</b>, <b>transfers</b>, <b>chefs</b> and <b>experiences</b>. Try “book me something nice in Lekki for next weekend”.";
}
function pConcierge(q){
  const prefill=q&&q.q?decodeURIComponent(q.q):"";
  return `${pageHead([["Home",URL("/")],["AI Concierge"]],"Meet <em class='serif-i gold-text'>Jollof</em>","Your 24/7 AI concierge. Books, arranges, plans and translates — in English, Pidgin, Yoruba, Hausa, Igbo & French.",`<span class="badge ok">${I.bolt} 2,400+ conversations this month</span>`)}
  <div class="page-body"><div class="wrap">
    <div class="conc-banner reveal">
      <div class="grid">
        <div>
          <span class="eyebrow">Concierge · always on</span>
          <h2>Ask, and it's <em class="serif-i">arranged</em></h2>
          <p>Jollof knows every residence, price and experience. Ask for a stay, an itinerary, a transfer — or a jollof masterclass on a Tuesday.</p>
          <div class="lang-chips" id="langChips">${["English","Pidgin","Yoruba","Hausa","Igbo","French"].map((l,i)=>`<span>${i===0?`<b>${l}</b>`:l}</span>`).join("")}</div>
          <div class="sample-prompts" style="display:grid;gap:9px;margin-top:20px">
            ${[["Book me something nice in Lekki for next weekend"],["What's the cheapest stay in Lagos? Can I split payments?"],["Plan me a perfect 3-day Lagos itinerary"],["Arrange a boat cruise and a private chef for my anniversary"],["How do escrow payments work?"]].map(p=>`<button style="text-align:left;padding:12px 16px;border-radius:13px;border:1px dashed var(--line);background:var(--card-2);font-size:14px;color:var(--ink-soft);cursor:pointer;transition:.2s" onclick="concAsk('${p[0]}')">${I.spark.replace("<svg","<svg style='width:15px;height:15px;color:var(--accent);vertical-align:-2px'")} ${p[0]}</button>`).join("")}
          </div>
        </div>
        <div class="conc-demo">
          <div class="head">
            <div class="orb">${I.bot}</div>
            <div><div class="nm">Jollof Concierge</div><div class="st">Online · replies in seconds</div></div>
          </div>
          <div class="conc-msgs" id="concMsgs"></div>
          <div class="conc-input">
            <input type="text" id="concInput" placeholder="Try “book me something nice in Lekki…”" autocomplete="off">
            <button id="concSend" aria-label="Send">${I.send}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="sec-head center" style="margin-top:70px"><span class="eyebrow center">Under the hood</span>
      <h2>25+ AI features, <em class="serif-i">all live</em></h2></div>
    <div class="why-grid stagger">
      ${[["search","AI Search & Discovery","Natural-language + visual search: “3-bed flat in VI with a pool under ₦150k.”"],
         ["spark","Personalised Recommendations","Collaborative filtering — guests like you also loved…"],
         ["grid","Dynamic Pricing Alerts","Predicts price drops and the cheapest days to book."],
         ["star","Review Summarisation","Turns 100+ reviews into sentiment, trends and highlights."],
         ["calendar","Trip Itineraries","Day-by-day plans from destination, dates, interests, budget."],
         ["eye","Accessibility Matching","Finds homes that fit mobility, hearing and visual needs."],
         ["gold","Listing Optimiser","A/B tests titles, photos and descriptions for hosts."],
         ["scale","Competitive Analysis","“Properties like yours average ₦85k — you're 12% below.”"],
         ["shield","Guest Screening","Risk scores every booking request before it reaches a host."],
         ["chatBell","Support Triage","Classifies, prioritises and auto-resolves tickets."],
         ["globe","Translation","Real-time messaging translation across 6+ languages."],
         ["leaf","Sustainability Scoring","“Green Stay” badges from energy and waste data."]].map(w=>`
      <div class="why-card"><span class="ai-pill">AI</span><div class="why-ico">${I[w[0]]}</div><h3>${w[1]}</h3><p>${w[2]}</p></div>`).join("")}
    </div>
  </div></div>`;
}
function concSay(txt,who="me"){
  const box=$("#concMsgs"); if(!box) return;
  box.insertAdjacentHTML("beforeend",`<div class="msg ${who}">${txt}</div>`); box.scrollTop=box.scrollHeight;
}
async function concAsk(txt){
  if(!txt||!txt.trim()) return;
  concSay(esc(txt));
  const box=$("#concMsgs");
  box.insertAdjacentHTML("beforeend",`<div class="msg bot"><span class="typing"><i></i><i></i><i></i></span></div>`);
  box.scrollTop=box.scrollHeight;
  /* logged to the concierge thread in MySQL; the server answers from live inventory */
  const r=await api("concierge.php",{text:txt});
  const ty=$(".conc-msgs .typing"); if(ty) ty.closest(".msg").remove();
  concSay((r.ok&&r.data&&r.data.reply)?r.data.reply:concReply(txt),"bot");
}
function bindConcierge(){
  const send=()=>{ const v=$("#concInput").value; $("#concInput").value=""; concAsk(v); };
  $("#concSend").addEventListener("click",send);
  $("#concInput").addEventListener("keydown",e=>{ if(e.key==="Enter") send(); });
  concSay("Welcome to <b>Jollof Living</b> ✨ I'm your AI concierge — bookings, prices, transfers, chefs, itineraries. Ask away, in any language.", "bot");
  const pre=qp("q")||"";
  if(pre) setTimeout(()=>concAsk(decodeURIComponent(pre)),600);
}

/* ---------------- ACCOUNT ---------------- */
function pAccount(){
  if(!USER) return pAuth("signin");
  const U=USER;
  const tier=TIERS.find(t=>t.key===S.tier)||TIERS[0]||{letter:"B",name:"Bronze",mult:"5×"};
  return `${pageHead([["Home",URL("/")],["Account"]],"<em class='serif-i'>Your</em> account","Profile, verification, security and the tools of the Jollof Club.")}
  <div class="page-body"><div class="wrap" style="max-width:880px">
    <div class="panel" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
      <div class="avatar" style="width:76px;height:76px;font-size:30px">${esc((U.name||"G").charAt(0).toUpperCase())}</div>
      <div style="flex:1;min-width:220px"><b style="font-family:var(--fs-serif);font-size:25px">${esc(U.name||"Guest")}</b>
      <div class="small">${esc(U.email||"")}${U.phone?" · "+esc(U.phone):""} · Member since ${esc(U.memberSince||"")}</div>
      <div class="btnrow" style="margin-top:8px">${U.emailVerified?`<span class="badge ok">${I.check} Email verified</span>`:`<span class="badge">Email unverified</span>`}${U.phone?`<span class="badge ok">${I.check} Phone verified</span>`:""}${U.kyc?`<span class="badge">${I.gold} ID verified</span>`:`<span class="badge">ID pending</span>`}<span class="badge">${tier.letter} ${tier.name}</span></div></div>
      <div style="text-align:right"><div class="small">Jollof Points</div><div style="font-family:var(--fs-serif);font-size:34px;font-weight:600;color:var(--accent)">${S.points.toLocaleString()}</div>
      <div class="small">${tier.name} · ${tier.mult} multiplier</div></div>
    </div>

    <div class="grid-2" style="margin-top:18px">
      <div class="panel"><h3 style="font-size:18px">Identity verification (KYC)</h3>
        ${[["Government ID uploaded",!!U.kyc],["Selfie match complete",!!U.kyc],["Phone verified",!!U.phone],["Background check (optional)",false]].map(([k,v])=>`<div class="krow"><span class="k">${k}</span><span class="v" style="color:${v?"var(--ok)":"var(--ink-faint)"}">${v?I.check:"pending"}</span></div>`).join("")}
        <div class="btnrow" style="margin-top:10px"><button class="btn btn-ghost btn-sm" onclick="toast('ID details opened — re-upload anytime','doc')">${I.doc} Manage documents</button></div>
      </div>
      <div class="panel"><h3 style="font-size:18px">Security</h3>
        <div class="krow"><span class="k">Password</span><span class="v"><button class="btn btn-ghost btn-sm" onclick="openPasswordChange()">Change password</button></span></div>
        <div class="krow"><span class="k">Two-factor authentication</span><span class="v" style="color:var(--ok)">${I.check} SMS + authenticator</span></div>
        <div class="krow"><span class="k">Last sign-in</span><span class="v">${esc(U.lastLogin||"just now")}</span></div>
        <div class="krow"><span class="k">NDPR / GDPR</span><span class="v">Data export &amp; erase ready</span></div>
        <div class="btnrow" style="margin-top:10px"><button class="btn btn-ghost btn-sm" onclick="toast('Security centre opened','lock')">${I.lock} Manage</button></div>
      </div>
    </div>

    <div class="grid-2" style="margin-top:18px">
      <div class="panel"><h3 style="font-size:18px">Preferences</h3>
        <div class="frm-row"><label>Language</label><select class="sel"><option>English</option><option>Yoruba</option><option>Hausa</option><option>Igbo</option><option>Pidgin</option><option>French</option></select></div>
        <div class="frm-row"><label>Currency</label><select class="sel" id="accCur"><option value="NGN">NGN ₦</option><option value="USD">USD $</option><option value="GBP">GBP £</option><option value="EUR">EUR €</option></select></div>
        <label class="chk"><input type="checkbox" checked> Email me private openings</label>
        <label class="chk" style="margin-top:8px"><input type="checkbox" checked> WhatsApp booking updates</label>
      </div>
      <div class="panel"><h3 style="font-size:18px">Connected services</h3>
        ${[["Google Calendar & Outlook",true],["Apple / Google Wallet passes",true],["WhatsApp Business",true],["QuickBooks, Xero (host)",false],["Salesforce / HubSpot (business)",false]].map(([k,v])=>`<div class="krow"><span class="k">${k}</span><span class="v">${v?`<span style="color:var(--ok)">connected</span>`:"<button class='btn btn-ghost btn-sm' onclick=\"toast('Integration connection started','globe')\">Connect</button>"}</span></div>`).join("")}
      </div>
    </div>

    <div class="panel" style="margin-top:18px;text-align:center">
      <b style="font-family:var(--fs-serif);font-size:19px">Report, block &amp; community</b>
      <p class="small" style="margin:6px 0 14px">Respect is the house rule. Every member is protected by our anti-discrimination policy and community guidelines.</p>
      <div class="btnrow" style="justify-content:center">
        <button class="btn btn-ghost btn-sm" onclick="toast('Reporting centre opened — we respond within 24h','shield')">Report a concern</button>
        <button class="btn btn-ghost btn-sm" onclick="toast('Blocked users are never shown your listings','lock')">Blocked users</button>
        <button class="btn btn-ghost btn-sm" data-goto="/about">NDPR &amp; compliance</button>
      </div>
    </div>
  </div></div>`;
}
function openPasswordChange(){
  openModal(`<h2 style="margin-bottom:4px">Change your password</h2>
    <p class="small" style="margin-bottom:14px">Choose something long — a short phrase beats a scrambled word.</p>
    <div class="frm-row"><label>Current password</label><input class="inp" type="password" id="pwOld"></div>
    <div class="frm-row"><label>New password</label><input class="inp" type="password" id="pwNew" placeholder="At least 8 characters"></div>
    <div class="frm-row"><label>Confirm new password</label><input class="inp" type="password" id="pwNew2"></div>
    <div class="btnrow"><button class="btn btn-gold" onclick="submitPassword()">Update password</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
}
async function submitPassword(){
  const oldPw=$("#pwOld").value, np=$("#pwNew").value, np2=$("#pwNew2").value;
  if(np!==np2){ toast("Those new passwords do not match","x"); return; }
  const r=await api("account.php",{action:"password",current:oldPw,password:np,confirm:np2});
  if(!r.ok){ toast(r.message||"Could not update your password","x"); return; }
  closeModal(); toast(r.message||"Password updated ✨","check");
}
function setCurrencyCookie(c){
  document.cookie="jl_currency="+encodeURIComponent(c)+";path=/;max-age="+(60*60*24*365)+";samesite=lax";
}
function bindAccount(){
  const cur=$("#accCur"); if(cur){ cur.value=currency;
    cur.addEventListener("change",()=>{ currency=cur.value; store.set("currency",currency); setCurrencyCookie(currency); render(); toast("Prices now shown in "+currency,"exchange"); });
  }
}

/* ---------------- AUTH ---------------- */
function pAuth(mode){
  const isIn=mode!=="register";
  const next=qp("next")||"";
  // /auth?mode=register&type=owner preselects the owner card, so the
  // "Create an owner account" links land on the right choice.
  const wantOwner=qp("type")==="owner";
  return `<div style="padding:calc(var(--header-h) + 30px) 20px 70px"><div class="auth-shell">
    <div class="auth-card">
      <span class="eyebrow">${isIn?"Welcome back":"Join the inner circle"}</span>
      <h1 style="margin-top:10px">${isIn?"Sign in to Jollof Living":"Create your account"}</h1>
      <p class="small">${isIn?"Trips, wishlists, points — all waiting.":"Email and a password — onboarding takes 90 seconds."}</p>
      <form id="authForm" novalidate autocomplete="on">
        <input type="hidden" id="authNext" value="${esc(next)}">
        ${isIn?"":`
        <div class="frm-row">
          <label>I want to…</label>
          <div class="acct-pick" id="auType" role="radiogroup" aria-label="Account type">
            ${[["customer","Book a stay","Find and book residences, save wishlists, earn points."],
               ["owner","List my property","Publish listings, manage bookings and get paid."]]
              .map(([v,t,d])=>{ const on=(v==="owner")===wantOwner; return `
              <label class="acct-opt${on?" active":""}" data-acct="${v}">
                <input type="radio" name="account_type" value="${v}"${on?" checked":""}>
                <span class="acct-t">${t}</span>
                <span class="acct-d">${d}</span>
              </label>`; }).join("")}
          </div>
        </div>`}
        ${isIn?"":`<div class="frm-row"><label>Full name</label><input class="inp" id="auName" name="name" placeholder="Adebayo Ogunlesi" autocomplete="name" required></div>`}
        <div class="frm-row"><label>Email</label><input class="inp" id="auEmail" name="email" type="email" placeholder="you@example.com" autocomplete="${isIn?"username":"email"}" required></div>
        ${isIn?"":`<div class="frm-row"><label>Phone <span class="small">(optional)</span></label><input class="inp" id="auPhone" name="phone" placeholder="+234 803 555 0123" autocomplete="tel"></div>`}
        <div class="frm-row"><label>Password</label>
          <div class="pw-wrap"><input class="inp" id="auPass" name="password" type="password" placeholder="${isIn?"••••••••":"At least 8 characters"}" autocomplete="${isIn?"current-password":"new-password"}" required>
          <button type="button" id="auEye" aria-label="Show or hide password">${I.eye}</button></div>
        </div>
        ${isIn?"":`<label class="chk" style="margin:6px 0 14px"><input type="checkbox" id="auTerms" checked> I agree to the Terms &amp; Privacy Policy</label>`}
        <button class="btn btn-gold btn-block" id="auSubmit" type="submit">${isIn?"Sign in":"Create account"}</button>
      </form>
      <p class="small" style="text-align:center;margin-top:14px">${isIn
        ? `New here? <a href="${URL("/auth?mode=register")}" style="color:var(--accent)">Create an account</a>`
        : `Already a member? <a href="${URL("/auth")}" style="color:var(--accent)">Sign in</a>`}</p>
      <p class="small" style="text-align:center;margin-top:8px">${I.shield} Passwords are hashed · NDPR/GDPR compliant</p>
    </div>
  </div></div>`;
}
function bindAuth(){
  const f=$("#authForm"); if(!f) return;
  const pick=$("#auType");
  if(pick){
    pick.addEventListener("change",()=>{
      $$(".acct-opt",pick).forEach(o=>o.classList.toggle("active",!!o.querySelector("input").checked));
    });
  }
  const eye=$("#auEye");
  if(eye) eye.addEventListener("click",()=>{ const p=$("#auPass"); p.type=p.type==="password"?"text":"password"; });
  f.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const isRegister=!!$("#auName");
    const btn=$("#auSubmit"); btn.disabled=true;
    const label=btn.textContent; btn.textContent=isRegister?"Creating your account…":"Signing you in…";
    const payload={
      action:isRegister?"register":"login",
      email:($("#auEmail").value||"").trim(),
      password:$("#auPass").value||"",
    };
    if(isRegister){
      payload.name=($("#auName").value||"").trim();
      payload.phone=($("#auPhone").value||"").trim();
      // the API rejects a registration that has not accepted the terms
      const terms=$("#auTerms");
      if(terms && !terms.checked){
        btn.disabled=false; btn.textContent=label;
        toast("Please accept the Terms & Privacy Policy to continue","shield");
        return;
      }
      payload.terms=true;
      const picked=f.querySelector('input[name="account_type"]:checked');
      payload.account_type=picked?picked.value:"customer";
    }
    const r=await api("auth.php",payload);
    if(!r.ok){ btn.disabled=false; btn.textContent=label; toast(r.message||"Could not sign you in","x"); return; }
    toast(r.message||"Welcome ✨","check");
    // The server decides where to land: owners go to their workspace,
    // customers to their account. An explicit ?next= always wins.
    const next=$("#authNext").value;
    const dest=next || (r.data&&r.data.redirect) || URL("/account");
    setTimeout(()=>{ location.href = dest; },600);
  });
}
