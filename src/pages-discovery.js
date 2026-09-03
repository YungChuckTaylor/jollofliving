/* ============================================================
   JOLLOF LIVING — pages-discovery.js
   home · stays · stay / map / collections / neighborhoods / experiences
   ============================================================ */

/* ---------------- HOME ---------------- */
function pHome() {
  const featured = PROPERTIES.filter(p=>p.featured);
  return `
  <div class="hero">
    <div class="hero-bg" style="background-image:url('data:image/jpeg;base64,${ASSETS.hero}')"></div>
    <div class="hero-tint"></div>
    <div class="hero-inner">
      <span class="eyebrow center">Luxury Living · African Soul</span>
      <h1>Exclusive residences,<br><em class="serif-i gold-text">crafted for the extraordinary</em></h1>
      <p class="sub">Lagos &amp; Abuja's finest penthouses, villas, suites and heritage homes — <b>short stays, long stays</b> and everything in between, with a concierge that never sleeps.</p>
      <div class="search-card" role="search">
        <div class="field loc">
          <label>${I.pin}Location</label>
          <select id="hLoc">
            <option value="all">Anywhere in Nigeria</option>
            ${[...new Set(PROPERTIES.map(p=>p.area))].map(a=>`<option>${a}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label>${I.calendar}Check in</label>
          <input type="date" id="hIn" min="${todayStr()}">
        </div>
        <div class="field">
          <label>${I.calendar}Check out</label>
          <input type="date" id="hOut" min="${todayStr()}">
        </div>
        <div class="field">
          <label>${I.users}Guests</label>
          <select id="hGuests">${[1,2,3,4,5,6,7,8].map(n=>`<option>${n}</option>`).join("")}</select>
        </div>
        <div class="search-go"><button class="btn btn-gold" id="hGo">Search</button></div>
      </div>
      <div class="hero-chips">
        <button class="chip solid" data-go="/stays?tab=waterfront">🌊 Waterfront escapes</button>
        <button class="chip" data-go="/stays?tab=lastmin">⚡ Last-minute — save 15%</button>
        <button class="chip" data-go="/stays?flex=1">📅 I'm flexible</button>
        <button class="chip" data-go="/stays?loc=Eko Atlantic">✨ Eko Atlantic</button>
        <button class="chip" data-go="/experiences">🍲 Private chefs &amp; cruises</button>
      </div>
      <div class="hero-trust">
        <span>${I.shield} Escrow-protected payments</span>
        <span>${I.gold} Jollof Verified homes</span>
        <span>${I.bolt} 24/7 concierge &amp; AI support</span>
      </div>
    </div>
    <div class="scroll-hint">Scroll</div>
  </div>

  <section class="stats"><div class="wrap"><div class="grid">
    <div class="stat"><div class="num gold-text">120+</div><div class="lbl">Features</div></div>
    <div class="stat"><div class="num gold-text">25+</div><div class="lbl">AI features</div></div>
    <div class="stat"><div class="num gold-text">12</div><div class="lbl">Curated categories</div></div>
    <div class="stat"><div class="num gold-text">4.93★</div><div class="lbl">Avg. rating</div></div>
  </div></div></section>

  <section class="sec-pad" id="collections">
    <div class="wrap">
      <div class="sec-head reveal"><span class="eyebrow">Curated Collections</span>
        <h2>Stays with a <em class="serif-i">point of view</em></h2>
        <p>Waterfront escapes, sky-high penthouses, executive suites and heritage homes — each collection hand-finished by our editors.</p>
        <div style="margin-top:16px"><a class="link-arrow" href="#/collections">Browse all ${COLLECTIONS.length}+ collections ${I.arrow}</a></div>
      </div>
      <div class="collections-grid stagger">${colCards(COLLECTIONS.slice(0,6))}</div>
    </div>
  </section>

  <section class="sec-pad alt-bg" id="featured">
    <div class="wrap">
      <div class="sec-head reveal" style="display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap">
        <div><span class="eyebrow">Seasonal &amp; featured</span><h2>Editor's <em class="serif-i">picks</em></h2></div>
        <a class="link-arrow" href="#/stays">View the whole collection ${I.arrow}</a>
      </div>
      <div class="stays-grid stagger">${featured.map(stayCard).join("")}</div>
    </div>
  </section>

  <section class="sec-pad" id="home-why">
    <div class="wrap">
      <div class="sec-head center reveal"><span class="eyebrow center">The Jollof Standard</span>
        <h2>Considered in every <em class="serif-i">detail</em></h2>
        <p>The operational depth of a global platform, the warmth of Nigerian hospitality.</p></div>
      <div class="why-grid stagger">
        ${[["instant","Instant Booking","Verified listings reserve in seconds — no host approval, no waiting.",""],
           ["shield","Escrow Payments","Funds held securely, released to hosts only after you confirm check-in.",""],
           ["bot","Jollof AI Concierge","Books, arranges and translates in English, Pidgin, Yoruba, Hausa, Igbo & French.","AI"],
           ["wallet","Split & Flexible Pay","−25% monthly, instalments on long stays, NGN · USD · GBP · EUR.",""],
           ["gold","Jollof Verified","In-person inspections, full KYC and AI fraud screening on every listing.",""],
           ["spark","Price-Drop Alerts","AI predicts the cheapest dates and alerts you the moment prices dip.","AI"],
           ["chatBell","24/7 Human Support","Chat, phone, WhatsApp — median first response under 3 minutes.",""],
           ["gift","Long-Stay Living","30+ night stays with digital lease agreements and housekeeping.",""]].map(w=>`
        <div class="why-card">${w[3]?`<span class="ai-pill">${w[3]}</span>`:""}<div class="why-ico">${I[w[0]]}</div><h3>${w[1]}</h3><p>${w[2]}</p></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="sec-pad alt-bg" id="home-exp">
    <div class="wrap">
      <div class="sec-head reveal"><span class="eyebrow">Beyond the stay</span>
        <h2>Experiences, <em class="serif-i">arranged for you</em></h2>
        <p>Boat cruises, private chefs, spa rituals and city tours — bundled with your residence or booked alone.</p></div>
      <div class="exp-grid stagger">${EXPERIENCES.slice(0,4).map(expCard).join("")}</div>
      <div style="margin-top:22px;text-align:center"><a class="link-arrow" href="#/experiences">All experiences ${I.arrow}</a></div>
    </div>
  </section>

  <section class="sec-pad" id="home-map">
    <div class="wrap">
      <div class="sec-head reveal"><span class="eyebrow">Explore the map</span>
        <h2>Where in <em class="serif-i">Lagos</em> will you land?</h2>
        <p>Live price pins across the city's most coveted addresses.</p></div>
      <div class="map-shell reveal">${mapSVG()}<div class="map-side">
        <h3>Neighbourhood guide</h3>
        <p class="serif-i" style="color:var(--ink-faint);font-size:14.5px;margin-bottom:8px">Average nightly rate by area</p>
        ${AREAS_LIST()}
        <div style="margin-top:16px"><a class="btn btn-ghost btn-sm" href="#/neighborhoods">Full neighbourhood guides</a></div>
      </div></div>
    </div>
  </section>

  <section class="sec-pad alt-bg" id="home-host">
    <div class="wrap host-shell">
      <div class="reveal">
        <span class="eyebrow">Become a host</span>
        <h2 style="font-size:clamp(1.9rem,4vw,2.8rem);margin:13px 0 10px">Your home, <em class="serif-i">curated by us</em></h2>
        <p class="muted">We handle photography, pricing intelligence, guest screening and payouts — you keep 88% and the compliments.</p>
        <ul class="host-checks">
          <li>${I.checkCircle} Professional photography &amp; AI listing optimisation</li>
          <li>${I.checkCircle} Dynamic pricing, seasonal premiums &amp; calendar control</li>
          <li>${I.checkCircle} Escrow payouts &amp; automatic transfers, every week</li>
          <li>${I.checkCircle} Superhost programme, co-host tools &amp; channel sync</li>
        </ul>
        <div class="btnrow"><a class="btn btn-gold" href="#/host/onboarding">Start hosting</a><a class="btn btn-ghost" href="#/host/dashboard">Open host dashboard</a></div>
      </div>
      <div class="calc-card reveal">
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
  </section>

  <section class="sec-pad" id="home-club">
    <div class="wrap">
      <div class="sec-head center reveal"><span class="eyebrow center">Jollof Club</span>
        <h2>Membership that <em class="serif-i">travels well</em></h2>
        <p>Earn Jollof Points on every stay — redeem for upgrades, transfers and experiences.</p></div>
      <div class="tiers stagger">${tierCards().slice(1,4).join("")}</div>
      <div style="text-align:center;margin-top:26px"><a class="link-arrow" href="#/membership">Full membership details ${I.arrow}</a></div>
    </div>
  </section>

  <section class="sec-pad alt-bg" id="home-reviews">
    <div class="wrap rev-shell reveal">
      <div class="sec-head center"><span class="eyebrow center">Guest stories</span>
        <h2>Loved, <em class="serif-i">again and again</em></h2></div>
      <div class="rev-grid stagger">${TESTIMONIALS.slice(0,6).map(t=>`<figure class="rev-card"><div class="stars">${I.star.repeat(5)}</div><q>“${esc(t[2])}”</q><figcaption class="rev-who"><span class="avatar">${t[0][0]}</span><div><div class="nm">${esc(t[0])}</div><div class="st">${esc(t[1])}</div></div></figcaption></figure>`).join("")}</div>
    </div>
  </section>

  <section class="sec-pad" id="home-blog">
    <div class="wrap">
      <div class="sec-head reveal" style="display:flex;align-items:flex-end;justify-content:space-between;gap:18px;flex-wrap:wrap">
        <div><span class="eyebrow">The Journal</span><h2>Guides &amp; <em class="serif-i">culture</em></h2></div>
        <a class="link-arrow" href="#/blog">All stories ${I.arrow}</a>
      </div>
      <div class="grid-3 stagger">${BLOG.slice(0,3).map(postCard).join("")}</div>
    </div>
  </section>

  <section class="sec-pad alt-bg" id="home-app">
    <div class="wrap app-grid">
      <div class="reveal">
        <span class="eyebrow">On the go</span>
        <h2 style="font-size:clamp(1.8rem,3.6vw,2.7rem);margin:12px 0 10px">The Jollof Living <em class="serif-i">app</em></h2>
        <p class="muted" style="max-width:52ch">Keyless check-in, live chat with hosts, trip dashboards, wallet passes, voice booking with Siri and Google Assistant — everything, in your pocket.</p>
        <div class="btnrow" style="margin-top:20px"><a class="btn btn-ghost" href="#/app">Explore app features</a><a class="btn btn-gold" href="#/account">Open your account</a></div>
      </div>
      <div class="reveal" style="justify-self:end">
        ${phoneMock()}
      </div>
    </div>
  </section>`;
}
function bindHome() {
  const hGo=$("#hGo");
  hGo.addEventListener("click", ()=>{
    const loc=$("#hLoc").value, g=$("#hGuests").value, din=$("#hIn").value, dout=$("#hOut").value;
    nav("/stays?loc="+encodeURIComponent(loc)+"&g="+g+(din?"&in="+din+"&out="+dout:""));
  });
  $$(".hero .chip").forEach(c=>c.addEventListener("click",()=>nav(c.dataset.go)));
  const rcalc=()=>{ const rate=+$("#hRate").value, occ=+$("#hOcc").value;
    const m=rate*30*occ/100, g=m*12;
    $("#hRateVal").textContent="\u20A6"+(rate*1000).toLocaleString();
    $("#hOccVal").textContent=occ+"%";
    ["#hRate","#hOcc"].forEach(s=>{const el=$(s); el.style.setProperty("--fill",((el.value-el.min)/(el.max-el.min)*100)+"%");});
    $("#hGross").textContent="\u20A6"+Math.round(m).toLocaleString()+" / mo";
    $("#hNet").textContent="\u20A6"+Math.round(m*0.88).toLocaleString()+" / mo";
    $("#hYear").textContent="\u20A6"+Math.round(g*0.88).toLocaleString()+" / yr";
    $("#hAvg").textContent="\u20A6"+Math.round(rate*1000).toLocaleString()+" / night";
  };
  ["#hRate","#hOcc"].forEach(s=>$(s).addEventListener("input",rcalc));
  rcalc();
  /* NOTE: no auto-scroll, no auto-advancing carousels — the page never moves by itself. */
}

/* ---------------- STAYS ---------------- */
function pStays(q) {
  const f={ loc:"all", guests:1, price:500, type:"all", beds:1, instant:false, flex:false, tab:"all", sort:"rec" };
  if(q.loc) f.loc=q.loc; if(q.g) f.guests=q.g; if(q.type) f.type=q.type; if(q.instant) f.instant=true;
  if(q.flex) f.flex=true; if(q.tab) f.tab=q.tab;
  S.filters=f;
  return `
  <div class="page-top"></div>
  <div class="page-head"><div class="wrap">
    <div class="crumbs"><a href="#/">Home</a> / Stays</div>
    <h1>The <em class="serif-i">Collection</em></h1>
    <p>Every residence is inspected, verified and dressed to a standard — before it ever reaches you. Filter by location, price, dates, type and amenities.</p>
  </div></div>
  <div class="page-body"><div class="wrap">

    <div class="panel" style="margin-bottom:26px" id="filterPanel">
      <div class="frm-grid">
        <div class="frm-row"><label>Location</label><select class="sel" id="fLoc">
          <option value="all">Anywhere in Nigeria</option>
          ${[...new Set(PROPERTIES.map(p=>[p.area,p.city]))].map(([a,c])=>`<option>${a} · ${c}</option>`).join("")}</select></div>
        <div class="frm-row"><label>Property type</label><select class="sel" id="fType">
          <option value="all">All types</option><option>Penthouse</option><option>Villa</option><option>Suite</option><option>Loft</option><option>Furnished Townhouse</option></select></div>
        <div class="frm-row"><label>Check-in</label><input type="date" class="inp" id="fIn" min="${todayStr()}"></div>
        <div class="frm-row"><label>Check-out</label><input type="date" class="inp" id="fOut" min="${todayStr()}"></div>
        <div class="frm-row"><label>Guests</label><select class="sel" id="fGuests">${[1,2,3,4,5,6,7,8].map(n=>`<option>${n}</option>`).join("")}</select></div>
        <div class="frm-row"><label>Bedrooms min.</label><select class="sel" id="fBeds"><option>1</option><option>2</option><option>3</option><option>4</option></select></div>
      </div>
      <div class="frm-row" style="margin-top:6px"><label>Max price / night — <b id="fPriceVal" style="color:var(--accent)">₦500,000</b></label>
        <input type="range" id="fPrice" min="90" max="500" value="${f.price}" step="5"></div>
      <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;margin-top:10px">
        <label class="chk"><input type="checkbox" id="fInstant"> Instant Book only</label>
        <label class="chk"><input type="checkbox" id="fFlex"> I'm flexible — cheapest dates</label>
        <div class="spacer" style="flex:1"></div>
        <button class="btn btn-gold btn-sm" id="fGo">Search</button>
        <button class="btn btn-ghost btn-sm" id="fClear">Reset</button>
      </div>
    </div>

    <div class="tabs" style="margin-bottom:18px">
      <button class="tab ${f.tab==="all"?"active":""}" data-tab="all">All</button>
      <button class="tab ${f.tab==="waterfront"?"active":""}" data-tab="waterfront">Waterfront</button>
      <button class="tab ${f.tab==="penthouse"?"active":""}" data-tab="penthouse">Penthouse &amp; Sky</button>
      <button class="tab ${f.tab==="abuja"?"active":""}" data-tab="abuja">Abuja Executive</button>
      <button class="tab ${f.tab==="verified"?"active":""}" data-tab="verified">Jollof Verified</button>
      <button class="tab ${f.tab==="lastmin"?"active":""}" data-tab="lastmin">Last-Minute Deals</button>
      <button class="tab ${f.tab==="new"?"active":""}" data-tab="new">New This Season</button>
    </div>

    <div class="filter-bar">
      <div class="results-note" id="staysNote" style="margin:0"></div>
      <div class="spacer"></div>
      <div class="sort">Sort
        <select class="select-pill" id="fSort"><option value="rec">Recommended</option><option value="price-asc">Price ↑</option><option value="price-desc">Price ↓</option><option value="rating">Top rated</option><option value="new">Newest</option></select>
      </div>
      <div class="tabs" style="display:inline-flex"><button class="tab ${f.view!=="map"?"active":""}" id="vList">${I.grid} List</button><button class="tab ${f.view==="map"?"active":""}" id="vMap">${I.pin} Map</button></div>
    </div>

    <div id="staysWrap"><div class="stays-grid" id="staysGrid">${filteredStays().map(stayCard).join("")}</div></div>
    <div id="mapWrap" style="display:none" class="mtl"><div class="map-shell" style="margin-top:22px">${mapSVG()}
      <div class="map-side"><h3>Results by area</h3>${AREAS_LIST()}</div></div></div>
  </div></div>`;
}
function filteredStays() {
  const f=S.filters;
  let list=[...PROPERTIES];
  if(f.loc&&f.loc!=="all") list=list.filter(p=>f.loc.includes(p.area)||f.loc.includes(p.city));
  if(f.guests>1) list=list.filter(p=>p.guests>=f.guests);
  if(f.beds>1) list=list.filter(p=>p.beds>=f.beds);
  if(f.price) { const mx=f.price*1000; list=list.filter(p=>p.price<=mx); }
  if(f.type!=="all") list=list.filter(p=>p.type.includes(f.type)||p.type.toLowerCase().includes(f.type.toLowerCase()));
  if(f.instant) list=list.filter(p=>p.instant);
  if(f.tab==="waterfront") list=list.filter(p=>p.amens.some(a=>/pool|ocean|lagoon|frontage/i.test(a)));
  else if(f.tab==="penthouse") list=list.filter(p=>/penthouse|terrace|loft|sky/i.test(p.type));
  else if(f.tab==="abuja") list=list.filter(p=>p.city==="Abuja");
  else if(f.tab==="verified") list=list.filter(p=>p.badge.includes("Verified"));
  else if(f.tab==="new") list=list.filter(p=>p.new);
  else if(f.tab==="lastmin") list=list.filter(p=>p.badge==="Last-Minute Deal"||p.oldPrice);
  if(f.sort==="price-asc") list.sort((a,b)=>a.price-b.price);
  if(f.sort==="price-desc") list.sort((a,b)=>b.price-a.price);
  if(f.sort==="rating") list.sort((a,b)=>b.rating-a.rating);
  if(f.sort==="new") list.sort((a,b)=>(b.new?1:0)-(a.new?1:0));
  return list;
}
function bindStays() {
  const q=qps()||{};
  if(q.flex) $("#fFlex").checked=true;
  if(q.instant) $("#fInstant").checked=true;
  const sync=()=>{
    const f=S.filters;
    $("#fLoc").value=f.loc; $("#fType").value=f.type; $("#fGuests").value=f.guests; $("#fBeds").value=f.beds;
    $("#fPrice").value=f.price; $("#fPriceVal").textContent=fmt(f.price*1000);
  };
  sync();
  const re=()=>{ $("#staysGrid").innerHTML=filteredStays().map(stayCard).join(""); note(); };
  const note=()=>{ const l=filteredStays(); $("#staysNote").innerHTML=`${l.length} exclusive ${l.length===1?"residence":"residences"} · updated with your filters`; };
  note();
  $("#fGo").addEventListener("click",()=>{
    const f=S.filters;
    f.loc=$("#fLoc").value; f.type=$("#fType").value; f.guests=+$("#fGuests").value; f.beds=+$("#fBeds").value;
    f.price=+$("#fPrice").value; f.instant=$("#fInstant").checked; f.flex=$("#fFlex").checked;
    const di=$("#fIn").value, dO=$("#fOut").value; if(di&&dO) S.searchDates={in:di,out:dO};
    re();
    if(f.flex) toast("Cheapest dates suggested — Tuesday arrivals save ~15% on average","spark");
    else if(di&&dO) toast(`Checking availability for ${di} → ${dO}`,"calendar");
  });
  $("#fClear").addEventListener("click",()=>{ S.filters={loc:"all",guests:1,price:500,type:"all",beds:1,instant:false,flex:false,tab:"all",sort:"rec"}; sync(); re(); });
  $("#fPrice").addEventListener("input",e=>$("#fPriceVal").textContent=fmt(e.target.value*1000));
  $$("#stays #fSort").forEach(s=>{});
  const sort=$("#fSort"); if(sort) sort.addEventListener("change",()=>{ S.filters.sort=sort.value; re(); });
  $$(".tabs .tab").forEach(t=>t.addEventListener("click",()=>{
    S.filters.tab=t.dataset.tab;
    $$(".tabs .tab").forEach(x=>x.classList.toggle("active",x===t));
    re();
    if(t.dataset.tab!=="all") $("#stays").scrollIntoView({behavior:"smooth"});
  }));
  const vList=$("#vList"), vMap=$("#vMap");
  vList.addEventListener("click",()=>{ $("#staysWrap").style.display=""; $("#mapWrap").style.display="none"; vList.classList.add("active"); vMap.classList.remove("active"); });
  vMap.addEventListener("click",()=>{ $("#staysWrap").style.display="none"; $("#mapWrap").style.display="block"; vMap.classList.add("active"); vList.classList.remove("active"); });
}

/* ---------------- STAY DETAIL ---------------- */
function pStay(id) {
  const p=PROPERTIES.find(x=>x.id===id); if(!p) return p404();
  recentAdd(p.id);
  const n=3, m=priceMath(p,n);
  const sold=tourRanges(p);
  return `
  <div class="page-head"><div class="wrap">
    <div class="crumbs"><a href="#/">Home</a> / <a href="#/stays">Stays</a> / ${esc(p.area)}</div>
    <div class="breadcrumb-bar" style="margin-bottom:0">
      <div><h1 style="margin-bottom:6px">${esc(p.name)}</h1>
      <div class="sd-meta" style="margin:0">
        <span class="rt"><b>${I.star} ${p.rating.toFixed(2)}</b> · ${p.reviews} reviews</span>
        <span>${I.pin}${esc(p.area)}, ${esc(p.city)}</span>
        <span class="badge ${p.badgeGold?"":""}">${p.badgeGold?I.gold:I.shield} ${esc(p.badge)}</span>
        ${p.instant?'<span class="badge ok">'+I.bolt+' Instant Book</span>':'<span class="badge warn">'+I.clock+' Request to Book</span>'}
      </div></div>
      <div class="btnrow" style="margin-left:auto">
        <button class="btn btn-ghost btn-sm" data-heart="${p.id}">${I.heart} Save</button>
        <button class="btn btn-ghost btn-sm" data-cmp="${p.id}">${I.scale} Compare</button>
        <button class="btn btn-ghost btn-sm" onclick="shareStay('${p.id}')">${I.share} Share</button>
      </div>
    </div>
  </div></div>
  <div class="page-body"><div class="wrap">
    <div class="sd-gallery">
      <div class="sd-main" id="sdMain" style="background-image:url('data:image/jpeg;base64,${ASSETS[p.img]}')"></div>
      <div class="sd-tags">
        ${p.tour?'<span class="tag" style="background:rgba(10,12,9,.6);color:#f0ead8;backdrop-filter:blur(8px)">'+I.eye+' Virtual tour available</span>':""}
        ${p.soldOut?'<span class="tag" style="background:rgba(180,68,58,.8);color:#fff">'+I.clock+' Waitlist open for holidays</span>':""}
      </div>
      <div class="sd-thumbs" id="sdThumbs">
        ${[p.img,"p8"].filter(k=>ASSETS[k]).map((k,i)=>`<button class="${i===0?"on":""}" data-sd="${i}"><img src="data:image/jpeg;base64,${ASSETS[k]}" alt=""></button>`).join("")}
        <button data-sd="360" onclick="openVirtualTour('${p.id}')" style="opacity:.9"><span style="display:grid;place-items:center;height:100%;color:#fff;background:rgba(0,0,0,.35);font-size:11px;letter-spacing:.08em">360°</span></button>
      </div>
    </div>

    <div class="sd-layout">
      <div>
        <div class="sd-sec" style="margin-top:0"><h3>${I.book} About this residence</h3>
          <p class="sd-desc">${esc(p.desc)}</p>
          <div class="panel" style="margin-top:16px;display:flex;gap:26px;flex-wrap:wrap">
            <div><div class="small">Type</div><b>${esc(p.type)}</b></div>
            <div><div class="small">Sleeps</div><b>${p.guests} guests</b></div>
            <div><div class="small">Bedrooms</div><b>${p.beds}</b></div>
            <div><div class="small">Bathrooms</div><b>${p.baths}</b></div>
            <div><div class="small">Floor plan</div><b>${esc(p.floor)}</b></div>
            <div><div class="small">Policy</div><b>${p.policy[0].toUpperCase()+p.policy.slice(1)}</b></div>
            ${p.tour?'<div><div class="small">Tour</div><b>360° virtual walkthrough</b></div>':""}
          </div>
        </div>

        <div class="sd-sec"><h3>${I.gift} Amenities &amp; smart features</h3>
          <div class="amen-grid">${p.amens.map(a=>`<span class="amen">${I.checkCircle}${esc(a)}</span>`).join("")}</div>
        </div>

        <div class="sd-sec"><h3>${I.camera} Floor plan</h3>
          <div class="panel" style="padding:10px">${floorPlan(p)}</div>
        </div>

        <div class="sd-sec"><h3>${I.star} Guest reviews</h3>
          <div class="ai-callout">${I.spark}<span><b>AI summary:</b> ${esc(p.aiSummary)}</span></div>
          <div class="panel" style="display:flex;gap:22px;align-items:center;flex-wrap:wrap">
            <div style="text-align:center;min-width:110px"><div style="font-family:var(--fs-serif);font-size:52px;font-weight:600;line-height:1">${p.rating.toFixed(2)}</div>${stars(5,12)}<div class="small">${p.reviews} reviews</div></div>
            <div class="rev-scores" style="flex:1;min-width:260px;margin:0">
              ${Object.entries(p.scores).map(([k,v])=>`<div class="rev-score"><div class="s">${v.toFixed(1)}</div><div class="l">${({c:"Cleanliness",a:"Accuracy",com:"Communication",loc:"Location",ci:"Check-in",v:"Value"})[k]}</div></div>`).join("")}
            </div>
          </div>
          <div style="margin-top:16px">${p.reviewsList.map(r=>`<div class="rev-mini"><div class="h"><span class="nm"><span class="avatar">${r[0][0]}</span>${esc(r[0])}</span><span class="dt">${esc(r[1])}</span></div><p>“${esc(r[2])}”</p></div>`).join("")}
          <a class="link-arrow" style="margin-top:14px" href="#/reviews">Read the AI analysis of all ${p.reviews} reviews ${I.arrow}</a></div>
        </div>

        <div class="sd-sec"><h3>${I.pin} Neighbourhood highlights</h3>
          <div class="panel">${p.nearby.map(n=>`<div class="nearby-row"><span>${I.pin}${esc(n[0])}</span><span class="d">${esc(n[1])}</span></div>`).join("")}
          <a class="link-arrow" style="margin-top:12px" href="#/neighborhoods">Full neighbourhood guide ${I.arrow}</a></div>
        </div>

        <div class="sd-sec"><h3>${I.book} House rules</h3>
          <ul class="rules-list">
            <li>${I.check} Check-in from 3pm · keyless smart-code entry</li>
            <li>${I.check} ${p.guests>4?"Intimate events welcome by arrangement":"Quiet hours after 10pm · no parties"}</li>
            <li>${I.check} No smoking indoors · pets on request</li>
            <li>${I.check} ${p.instant?"Instant booking — reserve now":"Host confirmation within 24 hours"} · ${p.policy} cancellation</li>
            <li>${I.check} Safety: smoke detectors, fire extinguisher, first-aid kit</li>
          </ul>
        </div>

        <div class="sd-sec"><h3>${I.users} Your host</h3>
          <div class="host-card">
            <div class="avatar">T</div>
            <div class="inf"><div class="nm">Tunde Bakare ${I.gold} Superhost</div>
            <div class="st">Verified · KYC complete · replies in ~5 min · 4 listings</div></div>
            <button class="btn btn-ghost btn-sm" data-goto="/messages?to=team-onyx">${I.chat} Message</button>
          </div>
        </div>
      </div>

      <div>
        <div class="book-card" id="bookCard">
          <div class="pr"><span class="amt" data-price="${p.price}">${fmt(p.price)}</span><span class="per">/ night</span>${p.oldPrice?`<span class="old-price">${fmt(p.oldPrice)}</span>`:""}</div>
          ${p.soldOut?`<div class="store-note">${I.clock}<span><b>Waitlist open</b> — ${esc(p.soldOut.replace("/"," – "))} is fully booked. Join the waitlist and we'll alert you instantly.</span></div>`:""}
          <div style="margin-bottom:12px">${calWidget({},sold)}</div>
          <div class="book-dates" style="margin:10px 0 4px">
            <div class="fld"><label>Check-in</label><input type="date" id="dIn" min="${todayStr()}" value="${todayStr(7)}"></div>
            <div class="fld"><label>Check-out</label><input type="date" id="dOut" min="${todayStr(7)}" value="${todayStr(10)}"></div>
          </div>
          <div class="guest-row" style="display:flex;align-items:center;justify-content:space-between;border:1px solid var(--line);border-radius:12px;padding:10px 13px;margin-bottom:10px">
            <div class="small">Guests</div>
            <div class="stepper">
              <button onclick="gDec()" ${""}>${I.minus}</button><b id="gNum">2</b><button onclick="gInc()">${I.plus}</button>
            </div>
          </div>
          <label class="chk" style="margin-bottom:10px"><input type="checkbox" id="dFlex"> I'm flexible — show cheapest dates</label>
          <select class="sel" style="margin-bottom:10px" id="dPolicy">
            <option value="flexible">Flexible — full refund up to 48h</option>
            <option value="moderate" ${p.policy==="moderate"?"selected":""}>Moderate — full refund up to 5 days</option>
            <option value="strict" ${p.policy==="strict"?"selected":""}>Strict — 50% refund up to 14 days</option>
          </select>
          <div class="breakdown" id="dBreak">${breakdownHTML(p,{in:todayStr(7),out:todayStr(10),n:(()=>3)(),guests:2})}</div>
          <div class="book-actions">
            ${p.instant
              ?`<button class="btn btn-gold btn-block" data-goto="/booking/${p.id}">${I.bolt} Reserve — Instant Book</button>`
              :`<button class="btn btn-gold btn-block" data-goto="/booking/${p.id}?req=1">${I.send} Request to Book</button>`}
          </div>
          <div class="escrow-note">${I.shield}<span>Payment held in escrow and released to the host only after you confirm check-in. You won't be charged yet.</span></div>
          <div class="alt-btns">
            <button onclick="joinWait('${p.id}')">${I.clock} Waitlist</button>
            <button onclick="gcalStay('${p.id}')">${I.calendar} Calendar</button>
            <button onclick="shareStay('${p.id}')">${I.share} Share</button>
          </div>
        </div>
        <div class="ai-callout" style="margin-top:16px">${I.spark}<span><b>AI price watch:</b> this residence is ${p.oldPrice?`<b>${Math.round((1-p.price/p.oldPrice)*100)}% below</b> its recent high`:"priced at market"} — Tuesday arrivals typically save ~15%.</span></div>
        <div class="panel" style="margin-top:16px">
          <b style="font-family:var(--fs-serif);font-size:17px">Why stay here</b>
          <div style="margin-top:10px">${[I.gold+" Jollof Verified quality",I.shield+" Escrow-protected payment",I.bolt+" 24/7 concierge + AI",I.wallet+" Split pay on long stays"].map(x=>`<div class="krow"><span class="k">${x}</span></div>`).join("")}</div>
        </div>
      </div>
    </div>
  </div></div>`;
}
function breakdownHTML(p,o) {
  const m=priceMath(p,o.n||3);
  return `
    <div class="brow"><span>${fmt(m.nightly)} × ${o.n} ${m.monthly?"nights (monthly −25%)":m.weekly?"nights (weekly −12%)":"nights"}</span><span>${fmt(m.subtotal)}</span></div>
    ${o.flex?`<div class="brow"><span>Cheapest nearby dates (flexible)</span><span class="free">${fmt(Math.round(p.price*0.85))} avg</span></div>`:""}
    <div class="brow"><span>Cleaning fee</span><span>${fmt(RATES.cleaning)}</span></div>
    <div class="brow"><span>Service fee (8%)</span><span>${fmt(m.svc)}</span></div>
    <div class="brow"><span>VAT (7.5%)</span><span>${fmt(m.vat)}</span></div>
    <div class="brow"><span>Security deposit (held)</span><span>${fmt(m.deposit)}</span></div>
    <div class="brow total"><span>Total</span><b>${fmt(m.total)}</b></div>`;
}
function bindStay(id) {
  const p=PROPERTIES.find(x=>x.id===id);
  const sold=tourRanges(p);
  const guestState={n:2};
  window.gDec=()=>{ if(guestState.n>1){guestState.n--; $("#gNum").textContent=guestState.n;} };
  window.gInc=()=>{ if(guestState.n<p.guests){guestState.n++; $("#gNum").textContent=guestState.n;} };
  const sel={in:$("#dIn").value,out:$("#dOut").value};
  const refresh=()=>{
    const n=nightsBetween(sel.in,sel.out)||3;
    sel.in=sel.in||todayStr(7); sel.out=sel.out||todayStr(10);
    $("#dBreak").innerHTML=breakdownHTML(p,{n,guests:guestState.n,flex:$("#dFlex").checked});
  };
  bindCal(sel,sold,refresh);
  ["#dIn","#dOut"].forEach(s=>{ $(s).addEventListener("change",e=>{ if(s==="#dIn")sel.in=e.target.value; else sel.out=e.target.value; refresh(); }); });
  $("#dFlex").addEventListener("change",refresh);
  /* thumbs */
  $$("#sdThumbs [data-sd]").forEach(b=>b.addEventListener("click",()=>{
    if(b.dataset.sd==="360") return;
    const path=[p.img,"p8"].filter(k=>ASSETS[k])[+b.dataset.sd];
    $("#sdMain").style.backgroundImage=`url('data:image/jpeg;base64,${ASSETS[path]}')`;
    $$("#sdThumbs button").forEach((x,i)=>x.classList.toggle("on",i===+b.dataset.sd));
  }));
}
function tourRanges(p){ return p.soldOut?[p.soldOut.split("/")]:[]; }
function openVirtualTour(id){
  const p=PROPERTIES.find(x=>x.id===id);
  openModal(`<h2 style="margin-bottom:4px">360° virtual tour</h2>
    <p class="small" style="margin-bottom:16px">${esc(p.name)} · drag to look around, scroll to zoom. Drone footage of the exterior available after booking.</p>
    <div style="position:relative;border-radius:16px;overflow:hidden;aspect-ratio:16/9;background:var(--bg-3);cursor:grab" id="tourStage">
      <div id="tourPano" style="position:absolute;inset:-40%;background-image:url('data:image/jpeg;base64,${ASSETS[p.img]}');background-size:cover;transition:transform .1s linear"></div>
      <div style="position:absolute;left:14px;bottom:14px;background:rgba(10,12,9,.6);color:#f0ead8;padding:8px 14px;border-radius:999px;font-size:12px" id="tourHint">Drag to explore · wheel to zoom</div>
    </div>
    <div class="btnrow" style="margin-top:16px"><button class="btn btn-green" onclick="closeModal();openVirtualTour('${p.id}')">Replay</button><button class="btn btn-ghost" onclick="closeModal()">Close</button></div>`);
  const stage=$("#tourStage"), pano=$("#tourPano");
  let tx=0,ty=0,z=1.4,drag=false,px=0,py=0;
  stage.addEventListener("mousedown",e=>{drag=true;px=e.clientX;py=e.clientY;});
  addEventListener("mouseup",()=>drag=false);
  addEventListener("mousemove",e=>{ if(!drag)return; tx+=(e.clientX-px)*0.4; ty+=(e.clientY-py)*0.4; px=e.clientX; py=e.clientY; pano.style.transform=`translate(${tx}px,${ty}px) scale(${z})`; });
  stage.addEventListener("wheel",e=>{e.preventDefault(); z=Math.min(3,Math.max(1,z+(e.deltaY<0?0.1:-0.1))); pano.style.transform=`translate(${tx}px,${ty}px) scale(${z})`;},{passive:false});
}
function floorPlan(p){
  const rooms=[["Living",10,70,120,74],["Kitchen",10,154,54,40],["Master bed",150,70,110,70],["Bed 2",150,150,84,58],["Bed 3",244,150,0,0],["Baths",244,70,64,50]].filter(r=>r[4]);
  return `<svg viewBox="0 0 330 240" style="width:100%;max-width:520px;display:block;margin:0 auto">
    <rect x="8" y="8" width="314" height="224" rx="10" fill="none" stroke="var(--accent)" stroke-width="1.6"/>
    ${rooms.map(r=>`<rect x="${r[1]}" y="${r[2]}" width="${r[3]}" height="${r[4]}" rx="6" fill="var(--gold-soft)" stroke="var(--accent)" stroke-opacity=".5"/><text x="${r[1]+r[3]/2}" y="${r[2]+r[4]/2+4}" text-anchor="middle" font-size="10.5" font-family="Jost,sans-serif" fill="var(--ink-soft)">${r[0]}</text>`).join("")}
    <text x="165" y="28" text-anchor="middle" font-size="11" font-family="Jost,sans-serif" letter-spacing="2" fill="var(--ink-faint)">${esc(p.floor)} · ~${p.beds*95+p.guests*8} m²</text>
  </svg>`;
}
function shareStay(id){ const p=PROPERTIES.find(x=>x.id===id);
  const txt=`${p.name} — ${fmt(p.price)}/night on Jollof Living. ${p.desc.slice(0,90)}…`;
  if(navigator.share){ navigator.share({title:p.name,text:txt}).catch(()=>{}); }
  else { navigator.clipboard&&navigator.clipboard.writeText(txt+" jollofliving.com"); toast("Stay details copied — ready to share","share"); }
}
function gcalStay(id){ const p=PROPERTIES.find(x=>x.id===id);
  const url=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Stay — "+p.name)}&dates=${todayStr(7).replace(/-/g,"")}/${todayStr(10).replace(/-/g,"")}&details=${encodeURIComponent(p.name+" via Jollof Living")}&location=${encodeURIComponent(p.area+", "+p.city)}`;
  window.open(url,"_blank"); toast("Added to Google Calendar","calendar");
}
function joinWait(id){ const p=PROPERTIES.find(x=>x.id===id);
  if(S.waitlist.includes(id)){ toast("Already on the waitlist — we'll alert you instantly","clock"); return; }
  S.waitlist.push(id); dump(); toast(`You're on the waitlist for ${p.name} — we'll alert you the moment dates open`,"clock");
}

/* ---------------- MAP ---------------- */
const PIN_POS={ "ocean-spearl":[372,205],"villa-azur":[300,262],"sky-garden":[430,172],"onyx":[500,300],"atelier-loft":[236,258],"heritage-house":[462,208],"lagoon-villa":[338,235],"maitama":[540,60],"lagoon-duplex":[510,318],"eko-icon":[250,290],"abuja-sky":[560,40],"island-retreat":[316,246] };
function mapSVG(){
  return `<div class="map-wrap">
    <svg viewBox="0 0 620 340" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of Lagos with property price pins">
      <g>
        <path d="M0 0h620v340H340C240 280 210 220 240 150 260 90 220 40 120 0H0z" fill="var(--map-land)"/>
        <path d="M0 0h120C240 60 260 100 240 170c-20 60 30 100 100 170H0z" fill="var(--map-water)"/>
        <path d="M300 262c30-14 44-38 40-64 12 6 28 10 44 10" fill="none" stroke="var(--map-water2)" stroke-width="1.6" stroke-dasharray="4 4"/>
      </g>
      <g font-size="13.5" font-family="Jost,sans-serif" fill="var(--map-text)" opacity=".9">
        <text x="70" y="180" transform="rotate(-64 70 180)">LAGOS LAGOON</text>
        <text x="392" y="120">IKOYI</text><text x="352" y="322">LEKKI PHASE 1</text>
        <text x="150" y="318">EKO ATLANTIC</text><text x="318" y="168">VICTORIA ISLAND</text>
      </g>
      <g>
        <rect x="460" y="12" width="140" height="62" rx="12" fill="var(--map-card)" stroke="var(--map-card-stroke)" stroke-width="1"/>
        <text x="530" y="34" text-anchor="middle" font-size="10.5" letter-spacing="2.5" fill="var(--map-text)" font-family="Jost,sans-serif">ABUJA</text>
      </g>
      ${Object.entries(PIN_POS).map(([id,[x,y]])=>{ const p=PROPERTIES.find(q=>q.id===id); if(!p) return "";
        return `<g class="map-pin" transform="translate(${x},${y})" data-goto="/stay/${id}" data-tip="${esc(p.name)}">
        <circle r="9" fill="#c9a227" stroke="var(--map-pin-stroke)" stroke-width="2.5"/>
        <circle r="16" fill="none" stroke="#c9a227" stroke-opacity=".35" stroke-width="1.5">
          <animate attributeName="r" values="12;20;12" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" values=".4;0;.4" dur="3s" repeatCount="indefinite"/>
        </circle>
        <rect x="0" y="18" width="0" height="0" fill="none"/>
        <g transform="translate(0,16)"><rect x="-33" y="0" width="66" height="21" rx="10" fill="var(--map-card)" stroke="#c9a227" stroke-width="1"/><text x="0" y="14.5" text-anchor="middle" font-size="11" font-family="Jost,sans-serif" font-weight="600" fill="#8a6a1f">${K(p.price)}</text></g>
      </g>`;}).join("")}
    </svg>
    <div class="map-tip" id="mapTip"></div>
  </div>`;
}
function AREAS_LIST(){
  const byArea=(area)=>{ const l=PROPERTIES.filter(p=>p.area.includes(area)||p.city.includes(area)); return {n:l.length, avg: l.length?Math.round(l.reduce((a,p)=>a+p.price,0)/l.length):0, ids:l.slice(0,1)[0]?l[0].id:null}; };
  return [
    ["Victoria Island","ocean-spearl"],["Banana Island","villa-azur"],["Ikoyi","sky-garden"],
    ["Lekki Phase 1","onyx"],["Eko Atlantic","atelier-loft"],["Maitama · Abuja","maitama"],
  ].map(([a,id])=>{ const d=byArea(a); return `<div class="area-row" data-goto="/stay/${id}"><span class="dot"></span><span class="nm">${a}</span><span class="ct">${d.n} stays</span><span class="pr">${K(d.avg)}</span></div>`; }).join("");
}
function bindMap(){
  const svg=$(".map-wrap svg"); if(!svg) return;
  svg.addEventListener("mousemove",e=>{ const t=e.target.closest(".map-pin"); const tip=$("#mapTip");
    if(t&&tip){ const r=svg.getBoundingClientRect();
      tip.innerHTML=`<b>${t.dataset.tip}</b>Tap to view`;
      tip.style.left=(e.clientX-r.left)+"px"; tip.style.top=(e.clientY-r.top)+"px"; tip.style.opacity=1;
    } else if(tip) tip.style.opacity=0;
  });
}

/* ---------------- COLLECTIONS ---------------- */
function pCollections(){
  return `${pageHead([["Home","#/"],["Collections"]],"Curated <em class='serif-i'>collections</em>","Twelve editorially curated ways to fall in love with a city — from waterfront escapes to cultural heritage stays.")}
  <div class="page-body"><div class="wrap">
    <div class="collections-grid stagger" style="grid-template-columns:repeat(4,1fr)">${COLLECTIONS.map(c=>`<div class="col-card" data-gocol="${c.id}"><div class="img" style="background-image:url('data:image/jpeg;base64,${ASSETS[c.img]}')"></div><div class="veil"></div><div class="n">${COLLECTION_MAP[c.id].length} stays</div><div class="meta"><h3>${esc(c.name)}</h3><p>${esc(c.sub)}</p></div></div>`).join("")}</div>
  </div></div>`;
}
function bindCollections(){
  $$("[data-gocol]").forEach(c=>c.addEventListener("click",()=>{
    nav("/stays?tab=col-"+c.dataset.gocol);
  }));
}

/* ---------------- NEIGHBORHOODS ---------------- */
function pNeighborhoods(){
  return `${pageHead([["Home","#/"],["Neighbourhood guides"]],"Neighbourhood <em class='serif-i'>guides</em>","Restaurants, nightlife, safety tips and transport — the insider's view of every address we serve.", `<button class="btn btn-gold" data-goto="/stays">Browse stays in these areas</button>`)}
  <div class="page-body"><div class="wrap">
    <div class="grid-3 stagger">${NEIGHBORHOODS.map(n=>`
      <div class="neigh-card" data-goto="/neighborhood/${n.id}">
        <div class="bg" style="background-image:url('data:image/jpeg;base64,${ASSETS[n.img]}')"></div><div class="veil"></div>
        <div class="txt"><div class="small" style="color:#e0d3a4">From ${K(n.avg)}/night · ${n.stays} stays</div><h3>${esc(n.name)}</h3><p style="font-size:13px;color:#ddd5bd">${esc(n.tag)}</p></div>
      </div>`).join("")}
    </div>
  </div></div>`;
}
function pNeighborhood(id){
  const n=NEIGHBORHOODS.find(x=>x.id===id)||NEIGHBORHOODS[0];
  const si=(l)=>`<ul class="list-non" style="list-style:none;display:grid;gap:8px;font-size:14px;color:var(--ink-soft)">${l.map(x=>`<li style="display:flex;gap:9px"><span style="color:var(--accent)">◆</span>${esc(x)}</li>`).join("")}</ul>`;
  return `${pageHead([["Home","#/"],["Neighbourhood guides","#/neighborhoods"],[n.name]],n.name,`${esc(n.tag)} · from ${K(n.avg)}/night across ${n.stays} stays`)}
  <div class="page-body"><div class="wrap">
    <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:26px" class="grid-2m">
      <div class="stack">
        <div class="panel"><h3>About ${esc(n.name)}</h3><p class="muted" style="font-size:15px">${esc(n.desc)}</p></div>
        <div class="panel"><h3>${I.wine} Where to eat</h3>${si(n.dining)}</div>
        <div class="panel"><h3>${I.moon} Nightlife</h3>${si(n.night)}</div>
        <div class="panel"><h3>${I.camera} Culture &amp; sights</h3>${si(n.culture)}</div>
      </div>
      <div class="stack">
        <div class="panel"><h3>${I.car} Getting around</h3>${si(n.transport)}</div>
        <div class="panel"><h3>${I.shield} Safety notes</h3>${si(n.safety)}</div>
        <div class="panel"><h3>${I.pin} Homes in ${esc(n.name)}</h3>
          ${PROPERTIES.filter(p=>p.area.includes(n.name.slice(0,6))||p.city===n.name||n.name.includes(p.area.slice(0,6)) ).map(p=>`<div class="krow"><span class="k">${esc(p.name)}</span><a class="v" style="color:var(--accent)" data-goto="/stay/${p.id}">${fmt(p.price)} →</a></div>`).join("")||'<div class="small">See the map for live pins.</div>'}
        </div>
        <div class="panel" style="background:linear-gradient(150deg,var(--card),var(--gold-soft))"><h3>Ask the concierge</h3>
          <p class="muted" style="font-size:14px">Not sure where to stay? Jollof knows every street.</p>
          <div class="btnrow" style="margin-top:12px"><button class="btn btn-green btn-sm" data-goto="/concierge?q=">Ask Jollof</button></div></div>
      </div>
    </div>
    <style>@media(max-width:900px){.grid-2m{grid-template-columns:1fr!important}}</style>
  </div></div>`;
}

/* ---------------- EXPERIENCES ---------------- */
function expCard(e){
  return `<article class="exp-card"><div class="bg" style="background-image:url('data:image/jpeg;base64,${ASSETS[e.img]}')"></div><div class="veil"></div>
    <div class="txt"><div class="k">${esc(e.cat)} · ${esc(e.dur)}</div><h3>${esc(e.name)}</h3><p>${esc(e.desc)}</p>
    <span class="go">${e.price?("From "+fmt(e.price)):"Included with select stays"} ${I.arrow}</span></div></article>`;
}
function pExperiences(){
  return `${pageHead([["Home","#/"],["Experiences"]],"Experiences, <em class='serif-i'>arranged for you</em>","Boat cruises, private chefs, spa rituals and city tours — bundled with your residence, or booked alone.","<button class='btn btn-gold' data-goto='/stays'>Bundle with a stay</button>")}
  <div class="page-body"><div class="wrap">
    <div class="tabs" id="expTabs" style="margin-bottom:22px">
      <button class="tab active" data-cat="all">All</button>
      ${[...new Set(EXPERIENCES.map(e=>e.cat))].map(c=>`<button class="tab" data-cat="${c}">${c}</button>`).join("")}
    </div>
    <div class="exp-grid stagger" id="expGrid" style="grid-template-columns:repeat(4,1fr)">${EXPERIENCES.map(expCard).join("")}</div>
    <div class="panel" style="margin-top:26px;background:linear-gradient(150deg,var(--card),var(--gold-soft))">
      <div class="grid-2" style="align-items:center;gap:30px">
        <div><h3 style="font-size:23px">Every experience is Jollof-verified</h3>
        <p class="muted" style="font-size:14.5px">Vetted operators, transparent pricing, and the concierge on call before, during and after. Cancel freely up to 24h before.</p></div>
        <div class="btnrow"><button class="btn btn-green" onclick="toast('The concierge will tailor an itinerary for your dates ✨','spark')">Plan my itinerary</button>
        <button class="btn btn-ghost" data-goto="/concierge">Ask the AI concierge</button></div>
      </div>
    </div>
  </div></div>`;
}
function bindExperiences(){
  $$("#expTabs .tab").forEach(t=>t.addEventListener("click",()=>{
    $$("#expTabs .tab").forEach(x=>x.classList.toggle("active",x===t));
    const cat=t.dataset.cat;
    $("#expGrid").innerHTML=EXPERIENCES.filter(e=>cat==="all"||e.cat===cat).map(expCard).join("");
  }));
}

/* ---------------- shared bits ---------------- */
function colCards(list){ return list.map(c=>`<div class="col-card ${c.wide?"wide":""} ${c.tall?"tall":""}" data-gocol="${c.id}"><div class="img" style="background-image:url('data:image/jpeg;base64,${ASSETS[c.img]}')"></div><div class="veil"></div><div class="n">${COLLECTION_MAP[c.id].length} stays</div><div class="meta"><h3>${esc(c.name)}</h3><p>${esc(c.sub)}</p></div></div>`).join(""); }
function tierCards(){ return TIERS.map(t=>`
  <div class="tier ${t.featured?"featured":""}">
    ${t.featured?'<span class="best">Most loved</span>':""}
    <div class="medal">${t.letter}</div><h3>${t.name}</h3><div class="req">${t.req}</div>
    <ul>${t.perks.map(p=>`<li>${I.check}${p}</li>`).join("")}</ul>
    <div class="pts"><b>${t.pts}</b> points · earn ${t.mult} per stay</div>
  </div>`); }
function postCard(b){ return `<article class="post-card" data-goto="/blog/${b.slug}"><div class="im"><div class="bg" style="background-image:url('data:image/jpeg;base64,${ASSETS[b.img]}')"></div></div>
  <div class="bd"><span class="cat">${esc(b.cat)}</span><h3>${esc(b.title)}</h3><p>${esc(b.excerpt)}</p><div class="meta">${b.date} · ${b.read} read</div></div></article>`; }
function phoneMock(){ return `<div class="phone"><div class="notch"></div><div class="scr">
  <div style="display:flex;align-items:center;gap:8px;margin-top:4px"><img src="data:image/png;base64,${ASSETS["wordmark-light"]}" style="height:20px"><span class="small" style="margin-left:auto">${"●"}</span></div>
  <div class="mini-card"><img src="data:image/jpeg;base64,${ASSETS.p1}" alt=""><div class="t"><b style="font-family:var(--fs-serif);font-size:13px">The Onyx Penthouse</b><div class="small">₦185,000/night · ★ 4.97</div></div></div>
  <div class="mini-card"><img src="data:image/jpeg;base64,${ASSETS.p3}" alt=""><div class="t"><b style="font-family:var(--fs-serif);font-size:13px">Villa Azur</b><div class="small">₦420,000/night · ★ 4.99</div></div></div>
  <div style="background:var(--gold-grad);border-radius:12px;padding:10px;color:#231a05;font-size:11.5px;font-weight:500">${I.bot} Jollof: “Booked your boat cruise for Saturday ⛵”</div>
  <div style="margin-top:auto;background:var(--card);border:1px solid var(--line-soft);border-radius:12px;padding:8px 10px;font-size:10px;color:var(--ink-faint)">Check-in code · 4471# · Sep 6, 3PM</div>
</div></div>`; }
