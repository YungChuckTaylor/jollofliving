/* ============================================================
   JOLLOF LIVING — pages-comm.js
   messages · notifications · concierge · account · auth
   ============================================================ */

/* ---------------- MESSAGES ---------------- */
let msgState=null;
function pMessages(q){
  if(!msgState||(q&&q.to&&msgState.lastTo!==q.to)) { /* reset on new visit */ }
  msgState={lastTo:(q&&q.to)||"concierge"};
  return `${pageHead([["Home","#/"],["Messages"]],"<em class='serif-i'>Inbox</em>","Real-time chat with hosts, support and Jollof — with read receipts, media sharing and AI translation.")}
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
          <button class="btn btn-ghost btn-sm" onclick="toast('New conversation started — say hello!','chat')">${I.plus} New message</button>
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
      <button class="icon-btn" onclick="toast('Voice call starting… (in-app, optional feature)','call')" title="Voice call">${I.call}</button>
      <button class="icon-btn" onclick="toast('Video call starting… (in-app, optional feature)','video')" title="Video call">${I.video}</button>
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
    <button class="icon-btn" onclick="toast('Attachment: photo added to the conversation','camera')" title="Attach">${I.camera}</button>
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
function sendChat(id){
  const inp=$("#chatInp"); const txt=inp.value.trim(); if(!txt) return; inp.value="";
  const body=$("#chatBody");
  body.insertAdjacentHTML("beforeend",`<div class="msg me">${esc(txt)}<span class="mtime">now · delivered ✓</span></div>`);
  body.scrollTop=body.scrollHeight;
  setTimeout(()=>{
    let reply="";
    if(/code|check-in|key/.test(txt)) reply="Your keyless code is <b>4471#</b> — it unlocks ${todayStr(7)} from 3:00 PM.";
    else if(/extend|night|longer/.test(txt)) reply="You can extend! I've applied your rate — say the word and I'll send the modification request to the host.";
    else if(/invoice|receipt|pdf/.test(txt)) reply="Sending your invoice now 📄 (ref JL-2026). It's also in your Trips page.";
    else if(/transfer|airport|driver/.test(txt)) reply="Arranged ✅ — a vetted chauffeur in a black SUV, meet-and-greet at arrivals. Message me your flight number and I'll track it.";
    else if(/thank|great|perfect/.test(txt)) reply="Anytime! Anything else — housekeeping, the chef, sunset cruise? ✨";
    else reply="Got it — our team is on it. I'll confirm within a few minutes. (Translated & logged by Jollof AI)";
    body.insertAdjacentHTML("beforeend",`<div class="msg bot">${reply}<span class="mtime">now</span></div>`);
    body.scrollTop=body.scrollHeight;
    const alertBadge=$("#msgCount"); if(alertBadge) alertBadge.style.display="none";
  },900);
}

/* ---------------- NOTIFICATIONS ---------------- */
function pNotif(){
  const unread=S.notifications.filter(n=>n.unread&&!S.notifsRead.includes(n.id)).length;
  return `${pageHead([["Home","#/"],["Notifications"]],"<em class='serif-i'>Notifications</em>",`${unread} unread · booking alerts, price drops, promotions and system updates.`,
    `<button class="btn btn-ghost btn-sm" onclick="markAllRead()">Mark all read</button>
     <button class="btn btn-ghost btn-sm" onclick="openNotifSettings()">Preferences</button>`)}
  <div class="page-body"><div class="wrap" style="max-width:820px">
    <div class="panel" style="padding:10px 20px">
      ${S.notifications.map(n=>{ const isU=n.unread&&!S.notifsRead.includes(n.id);
        return `<div class="notif-item ${isU?"unread":""}"><span class="ico">${I[n.ico]||I.check}</span>
        <div class="bd"><b>${esc(n.title)}</b><p>${esc(n.body)}</p><div class="t">${esc(n.time)}</div></div>
        ${isU?`<button class="icon-btn" style="width:30px;height:30px" onclick="markRead(${n.id})" title="Mark read">${I.check}</button>`:""}
      </div>`; }).join("")}
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
function markRead(id){ if(!S.notifsRead.includes(id)) S.notifsRead.push(id); dump(); render(); renderBadges(); }
function markAllRead(){ S.notifications.forEach(n=>{ if(!S.notifsRead.includes(n.id)) S.notifsRead.push(n.id); }); dump(); render(); renderBadges(); }
function openNotifSettings(){
  openModal(`<h2 style="margin-bottom:14px">Notification preferences</h2>
    ${[["Booking confirmations & reminders",true],["Price drops on wishlisted homes",true],["Promotions & seasonal campaigns",true],["WhatsApp booking updates",true],["SMS for critical alerts",true],["Product news & Jollof Club",false]].map(([k,v],i)=>`<label class="chk" style="margin:10px 0"><input type="checkbox" ${v?"checked":""} onchange="toast('Preference updated','check')"> ${k}</label>`).join("")}
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
  return `${pageHead([["Home","#/"],["AI Concierge"]],"Meet <em class='serif-i gold-text'>Jollof</em>","Your 24/7 AI concierge. Books, arranges, plans and translates — in English, Pidgin, Yoruba, Hausa, Igbo & French.",`<span class="badge ok">${I.bolt} 2,400+ conversations this month</span>`)}
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
function concAsk(txt){
  if(!txt) return;
  concSay(esc(txt));
  const box=$("#concMsgs");
  setTimeout(()=>{ box.insertAdjacentHTML("beforeend",`<div class="msg bot"><span class="typing"><i></i><i></i><i></i></span></div>`); box.scrollTop=box.scrollHeight;
    setTimeout(()=>{ const ty=$(".conc-msgs .typing"); ty&&ty.closest(".msg").remove(); concSay(concReply(txt),"bot"); },900);
  },320);
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
  const tier=TIERS.find(t=>t.key===S.tier)||TIERS[2];
  return `${pageHead([["Home","#/"],["Account"]],"<em class='serif-i'>Your</em> account","Profile, verification, security and the tools of the Jollof Club.")}
  <div class="page-body"><div class="wrap" style="max-width:880px">
    <div class="panel" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
      <div class="avatar" style="width:76px;height:76px;font-size:30px">A</div>
      <div style="flex:1;min-width:220px"><b style="font-family:var(--fs-serif);font-size:25px">Adebayo Ogunlesi</b>
      <div class="small">adebayo@jollofliving.com · +234 803 555 0123 · Member since Aug 2025</div>
      <div class="btnrow" style="margin-top:8px"><span class="badge ok">${I.check} Email verified</span><span class="badge ok">${I.check} Phone verified</span><span class="badge">${I.gold} ID verified</span><span class="badge">${tier.letter} ${tier.name}</span></div></div>
      <div style="text-align:right"><div class="small">Jollof Points</div><div style="font-family:var(--fs-serif);font-size:34px;font-weight:600;color:var(--accent)">${S.points.toLocaleString()}</div>
      <div class="small">${tier.name} · ${tier.mult} multiplier</div></div>
    </div>

    <div class="grid-2" style="margin-top:18px">
      <div class="panel"><h3 style="font-size:18px">Identity verification (KYC)</h3>
        ${[["Government ID uploaded",true],["Selfie match complete",true],["Phone verified",true],["Background check (optional)",false]].map(([k,v])=>`<div class="krow"><span class="k">${k}</span><span class="v" style="color:${v?"var(--ok)":"var(--ink-faint)"}">${v?I.check:"pending"}</span></div>`).join("")}
        <div class="btnrow" style="margin-top:10px"><button class="btn btn-ghost btn-sm" onclick="toast('ID details opened — re-upload anytime','doc')">${I.doc} Manage documents</button></div>
      </div>
      <div class="panel"><h3 style="font-size:18px">Security</h3>
        <div class="krow"><span class="k">Password</span><span class="v">Last changed 3 months ago</span></div>
        <div class="krow"><span class="k">Two-factor authentication</span><span class="v" style="color:var(--ok)">${I.check} SMS + authenticator</span></div>
        <div class="krow"><span class="k">Active sessions</span><span class="v">3 devices</span></div>
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
function bindAccount(){
  const cur=$("#accCur"); if(cur){ cur.value=currency;
    cur.addEventListener("change",()=>{ currency=cur.value; store.set("currency",currency); render(); toast("Prices now shown in "+currency,"exchange"); });
  }
}

/* ---------------- AUTH ---------------- */
function pAuth(mode){
  const isIn=mode!=="register";
  return `<div style="padding:calc(var(--header-h) + 30px) 20px 70px"><div class="auth-shell">
    <div class="auth-card">
      <span class="eyebrow">${isIn?"Welcome back":"Join the inner circle"}</span>
      <h1 style="margin-top:10px">${isIn?"Sign in to Jollof Living":"Create your account"}</h1>
      <p class="small">${isIn?"Trips, wishlists, points — all waiting.":"Email, phone or social — onboarding takes 90 seconds."}</p>
      <div class="social-btns">
        <button onclick="authDone()"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 11v3.8h5.4c-.5 2.4-2.6 3.7-5.4 3.7a6 6 0 1 1 0-12c1.9 0 3.2.7 4.3 1.7l2.9-2.9A9.8 9.8 0 1 0 12 22c5.7 0 9.4-4 9.4-9.6 0-.6 0-1-.1-1.4z"/></svg> Continue with Google</button>
        <button onclick="authDone()"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.7 12.9c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.3-.9-1.7 0-3.2 1-4.1 2.5-1.7 3-.4 7.5 1.3 10 .8 1.2 1.8 2.6 3.1 2.5 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.3zM14.4 5.7c.7-.8 1.1-2 1-3.2-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.5 2.9-1.3z"/></svg> Continue with Apple</button>
        <button onclick="authDone()"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg> Continue with Facebook</button>
      </div>
      <div class="or-sep">or use email</div>
      <div class="frm-row"><label>${isIn?"Email or phone":"Full name"}</label><input class="inp" placeholder="${isIn?"you@example.com or +234…":"Adebayo Ogunlesi"}"></div>
      ${!isIn?`<div class="frm-row"><label>Email</label><input class="inp" placeholder="you@example.com"></div>`:""}
      <div class="frm-row"><label>Password</label><input class="inp" type="password" placeholder="••••••••"></div>
      <label class="chk" style="margin:6px 0 14px"><input type="checkbox" ${!isIn?"checked":""}> Keep me signed in · ${!isIn?"I agree to the Terms & Privacy Policy":""}</label>
      <button class="btn btn-gold btn-block" onclick="authDone()">${isIn?"Sign in":"Create account"}</button>
      <p class="small" style="text-align:center;margin-top:14px">${isIn?'New here? <a href="#/auth/register" style="color:var(--accent)">Create an account</a>':"Already a member? <a href='#/auth' style='color:var(--accent)'>Sign in</a>"}</p>
      <p class="small" style="text-align:center;margin-top:8px">${I.shield} 2FA available · NDPR/GDPR compliant</p>
    </div>
  </div></div>`;
}
function authDone(){ toast("Signed in — welcome back, Adebayo ✨","check"); nav("/account"); }
