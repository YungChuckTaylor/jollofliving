/* ===== data.js ===== */
/* ============================================================
   JOLLOF LIVING — data.js  (all platform data)
   ============================================================ */
"use strict";

const FX = { NGN:{s:"\u20A6",r:1,d:0}, USD:{s:"$",r:1/1550,d:0}, GBP:{s:"\u00A3",r:1/2140,d:0}, EUR:{s:"\u20AC",r:1/1830,d:0} };

const RATES = { cleaning:15000, service:0.08, vat:0.075, weeklyDisc:0.12, monthlyDisc:0.25, deposit:0.20, insurance:0.03 };
const PROMOS = { JOLLOF10:{off:0.10,label:"10% off your stay"}, WELCOME5:{off:0.05,label:"5% off first booking"}, REFER5000:{off:0, flat:5000, label:"\u20A65,000 off" } };
const ADDONS = {
  transfer:{name:"Airport transfer", price:25000, ico:"car", note:"Vetted luxury SUV · both ways"},
  welcome:{name:"Curated welcome basket", price:15000, ico:"gift", note:"Nigerian snacks, wine & a handwritten note"},
  housekeeping:{name:"Mid-stay housekeeping", price:20000, ico:"broom", note:"Once per 7 nights"},
  lateco:{name:"Late check-out · 2pm", price:10000, ico:"clock", note:"Subject to availability"},
  insurance:{name:"Stay protection (3%)", price:0.03, ico:"shield", note:"Covers cancellations & damage"},
  carbon:{name:"Carbon offset", price:2500, ico:"leaf", note:"Verified offset program"},
  exp:{name:"Signature experience bundle", price:60000, ico:"spark", note:"Boat cruise + private chef for two"},
};

const PROPERTIES = [
  {
    id:"onyx", name:"The Onyx Penthouse", area:"Lekki Phase 1", city:"Lagos", img:"p1",
    price:185000, oldPrice:210000, rating:4.97, reviews:128, beds:3, baths:3.5, guests:6,
    type:"Penthouse", badge:"Jollof Verified", badgeGold:true, instant:true, policy:"moderate",
    acreage:"Lekki", map:[0.29,0.72], featured:true, new:false, tour:true, floor:"3 Bed Penthouse",
    desc:"A dark, cinematic penthouse in the sky above Lekki Phase 1. Black marble walls, brass detailing and a private cinema — engineered for quiet drama, with the Lagos skyline flickering beyond 12-foot glass.",
    amens:["Infinity pool","Private cinema","Smart home","Gym","Rooftop terrace","Chef's kitchen","Fast Wi-Fi (1Gbps)","24/7 security","Backup generator","Concierge on call"],
    scores:{c:4.9,a:5.0,com:5.0,loc:4.9,ci:5.0,v:4.8},
    aiSummary:"Guests love the cinema room, the flawless Wi-Fi for video calls, and the concierge's speed. A few noted the lift can be slow at peak hours.",
    reviewsList:[["Adaeze O.","Lagos · Apr 2026","The cinema room alone is worth it. Spotless, concierge arranged a private chef — impeccable."],["James K.","London · Jun 2026","Feels like a five-star hotel floor, but entirely yours. Escrow payment gave total peace of mind."],["Chuka E.","Abuja · Aug 2026","Smart-home everything, blackout blinds, flawless Wi-Fi for calls. Best stay I've had in Lagos."]],
    nearby:[["Ocean Basket Restaurant","1.2 km"],["Landmark Beach","3.4 km"],["Lekki Conservation Centre","6.1 km"],["Palms Mall","2.0 km"],["Nike Art Gallery","4.6 km"]],
  },
  {
    id:"ocean-spearl", name:"Ocean Pearl Suite", area:"Victoria Island", city:"Lagos", img:"p2",
    price:145000, oldPrice:null, rating:4.92, reviews:96, beds:2, baths:2, guests:4,
    type:"Oceanfront Suite", badge:"Superhost", badgeGold:false, instant:true, policy:"flexible",
    acreage:"Victoria Island", map:[0.52,0.42], featured:true, new:false, tour:true, floor:"2 Bed Suite",
    desc:"Wake to the Atlantic. A serene two-bedroom suite with a private balcony over the water, soft linen, warm oak and a slow morning light that turns the ocean to silver.",
    amens:["Ocean view balcony","King beds","Daily housekeeping","Smart TV + Netflix","Fast Wi-Fi","Backup power","Airport pickup available","Espresso bar"],
    scores:{c:4.9,a:4.9,com:4.9,loc:5.0,ci:4.9,v:4.8},
    aiSummary:"Guests consistently praise the sunrise view and digital check-in. The building's gym gets a few mentions as small.",
    reviewsList:[["Funmi A.","Lagos · Mar 2026","The balcony view at sunrise is unbeatable. Concierge had a boat booked in ten minutes."],["Daniel M.","Accra · Jun 2026","Spotless, quiet, and the digital check-in meant midnight arrival was effortless."],["Sarah B.","New York · Aug 2026","Long-stay discount + split payment made a month here very comfortable."]],
    nearby:[["Eko Hotel & Suites","1.5 km"],["Landmark Event Centre","2.8 km"],["Bar Beach","1.1 km"],["Cubana Lagos","2.2 km"]],
  },
  {
    id:"villa-azur", name:"Villa Azur", area:"Banana Island", city:"Lagos", img:"p3",
    price:420000, oldPrice:null, rating:4.99, reviews:74, beds:4, baths:5, guests:8,
    type:"Private Villa", badge:"Jollof Verified", badgeGold:true, instant:false, policy:"strict",
    acreage:"Banana Island", map:[0.36,0.56], featured:true, new:false, tour:true, floor:"4 Bed Villa",
    soldOut:"2026-12-20/2027-01-05",
    desc:"Banana Island's quietest address. A private infinity pool melting into the lagoon, palm-framed terraces, and a villa team on call. This is Nigerian luxury at its most unhurried.",
    amens:["Private infinity pool","Lagoon frontage","Full villa team","Wine cellar","Poolside bar","Private gym","Event hosting","Boat jetty","Smart home","Secure parking"],
    scores:{c:5.0,a:5.0,com:5.0,loc:5.0,ci:5.0,v:5.0},
    aiSummary:"Perfect scores across the board. Guests highlight the boat jetty and the invisible-but-present villa team. High demand — book early or join the waitlist.",
    reviewsList:[["Bolanle T.","Lagos · Feb 2026","We hosted a small engagement here. The team was invisible until we needed them — flawless."],["Hans W.","Berlin · May 2026","The best villa we've stayed at anywhere in Africa. The boat jetty is a touch of genius."],["Zainab M.","Dubai · Jul 2026","Escrow release only after check-in confirmation — exactly how luxury platforms should work."]],
    nearby:[["Banana Island Shopping Court","1.0 km"],["Ikoyi Golf Club","4.2 km"],["The Wheatbaker","5.0 km"],["Nike Art Gallery","6.5 km"]],
  },
  {
    id:"sky-garden", name:"The Sky Garden Terrace", area:"Ikoyi", city:"Lagos", img:"p4",
    price:210000, oldPrice:null, rating:4.95, reviews:143, beds:3, baths:3, guests:6,
    type:"Terrace Residence", badge:"Superhost", badgeGold:false, instant:true, policy:"moderate",
    acreage:"Ikoyi", map:[0.47,0.68], featured:true, new:false, tour:true, floor:"3 Bed Terrace",
    desc:"A lantern-lit rooftop over Ikoyi. Outdoor lounge, heat lamps, and the whole lagoon as your backdrop — designed for golden-hour dinners and long, warm nights.",
    amens:["Rooftop terrace","Outdoor lounge","Lagoon view","BBQ + pizza oven","Wine fridge","Backup generator","Smart locks","Sonos sound"],
    scores:{c:4.9,a:4.9,com:5.0,loc:4.9,ci:5.0,v:4.9},
    aiSummary:"The terrace is the star — guests mention sunsets constantly. Nightlife watchers note street noise on weekends; earplugs provided.",
    reviewsList:[["Tobi F.","Lagos · Jan 2026","Sunsets from this terrace should be illegal. One of Lagos' best-kept secrets."],["Anna P.","Paris · Apr 2026","Beautiful, airy, and the welcome package with chin-chin and wine was so thoughtful."],["Emeka N.","Enugu · Aug 2026","Booked via the AI concierge — three messages and it was done."]],
    nearby:[["Awolowo Road boutique strip","1.4 km"],["The George Hotel","0.9 km"],["Ikoyi Golf Club","2.3 km"],["Rooftop M Restaurant","1.1 km"]],
  },
  {
    id:"maitama", name:"Maitama Executive Residence", area:"Maitama", city:"Abuja", img:"p5",
    price:165000, oldPrice:null, rating:4.90, reviews:88, beds:2, baths:2.5, guests:4,
    type:"Executive Suite", badge:"Corporate Ready", badgeGold:false, instant:true, policy:"flexible",
    acreage:"Maitama", map:[0.75,0.2], featured:false, new:false, tour:true, floor:"2 Bed Executive",
    desc:"The address of choice for dignitaries and executives. A calm, brass-lit residence above the green hills of Maitama, minutes from the Central Business District.",
    amens:["Hill view","Boss-friendly desk","Meeting corner","Fast fibre Wi-Fi","Invoicing & PO billing","Backup power","Airport transfer","Tea & coffee bar"],
    scores:{c:4.8,a:4.9,com:4.9,loc:5.0,ci:4.9,v:4.8},
    aiSummary:"Corporate guests rate value highly thanks to PO billing and invoicing. The desk and meeting corner get frequent praise; gym access requires a short walk.",
    reviewsList:[["Ngozi U.","Abuja · May 2026","Corporate billing with PO numbers was seamless for our team's month-long project."],["Robert S.","Nairobi · Jul 2026","The quietest executive stay in Abuja. Wi-Fi never blinked during two weeks of calls."],["Hadiza Y.","Kano · Aug 2026","Airport pickup, check-in, everything arranged by message. Effortless."]],
    nearby:[["Transcorp Hilton","2.6 km"],["World Trade Centre","3.1 km"],["Jabi Lake Mall","6.0 km"],["Sheraton Abuja","4.4 km"]],
  },
  {
    id:"atelier-loft", name:"The Atelier Loft", area:"Eko Atlantic", city:"Lagos", img:"p6",
    price:135000, oldPrice:155000, rating:4.87, reviews:66, beds:2, baths:2, guests:4,
    type:"Designer Loft", badge:"Last-Minute Deal", badgeGold:true, instant:true, policy:"flexible",
    acreage:"Eko Atlantic", map:[0.22,0.68], featured:false, new:true, tour:false, floor:"2 Bed Loft",
    desc:"A double-height loft in the city of the future. Raw concrete softened with oak and brass, and Eko Atlantic's skyline glowing past floor-to-ceiling glass.",
    amens:["Double-height glass","Designer kitchen","City skyline view","Gym access","Smart home","Fast Wi-Fi","Valet parking","Balcony"],
    scores:{c:4.8,a:4.9,com:4.8,loc:4.9,ci:4.9,v:4.7},
    aiSummary:"Guests call it 'architectural eye candy'. A few note morning construction noise in the district — the double glazing handles most of it.",
    reviewsList:[["Kelechi O.","Lagos · Aug 2026","Architectural eye candy, and 15% off for booking within 48 hours of check-in."],["Grace L.","Accra · Aug 2026","The loft has a gallery feel. Concierge recommended an amazing rooftop dinner nearby."],["Uche A.","Lagos · Sep 2026","Checking in took ninety seconds with the keyless code."]],
    nearby:[["Eko Atlantic Boulevard","0.4 km"],["Azure Beach","2.0 km"],["City Mall, VI","3.6 km"],["Eko Hotel","3.9 km"]],
  },
  {
    id:"heritage-house", name:"Heritage House Lagos", area:"Old Ikoyi", city:"Lagos", img:"p7",
    price:120000, oldPrice:null, rating:4.93, reviews:112, beds:3, baths:2, guests:6,
    type:"Heritage Stay", badge:"Cultural Heritage", badgeGold:false, instant:false, policy:"moderate",
    acreage:"Ikoyi", map:[0.5,0.62], featured:false, new:false, tour:true, floor:"3 Bed Courtyard House",
    desc:"A lovingly restored 1950s Ikoyi courtyard house — shutters, terrazzo and antique woods, layered with contemporary comfort and Nigerian art on every wall.",
    amens:["Courtyard garden","Curated art collection","Heritage architecture","Outdoor dining","Cook available","Library","Fast Wi-Fi","Board games"],
    scores:{c:4.9,a:4.9,com:5.0,loc:4.9,ci:4.9,v:4.9},
    aiSummary:"Guests describe it as a museum that is also home. The courtyard breakfasts, curated art and the house tour are mentioned in most reviews.",
    reviewsList:[["Yewande S.","Lagos · Mar 2026","Stayed two nights and felt like I'd been to a museum that also happens to be home."],["Olivia R.","Cape Town · Jun 2026","The courtyard breakfasts were the highlight of my Nigeria trip."],["Ibrahim G.","Kano · Aug 2026","Beautiful, storied, immaculate. The house tour was a lovely touch."]],
    nearby:[["Freedom Park","2.8 km"],["Nike Art Gallery","3.2 km"],["Cathedral Church of Christ","3.0 km"],["Terra Kulture","2.4 km"]],
  },
  {
    id:"lagoon-villa", name:"The Lagoon Villa", area:"Victoria Island", city:"Lagos", img:"hero",
    price:175000, oldPrice:null, rating:4.96, reviews:151, beds:3, baths:3.5, guests:6,
    type:"Waterfront Villa", badge:"Waterfront Escapes", badgeGold:false, instant:true, policy:"moderate",
    acreage:"Victoria Island", map:[0.44,0.5], featured:true, new:false, tour:true, floor:"3 Bed Villa",
    desc:"Glass-walled living above the lagoon. An emerald-and-gold great room that turns into a lantern at dusk, with the city shimmering across the water.",
    amens:["Lagoon frontage","Floor-to-ceiling glass","Private dock","Chef's kitchen","Home cinema","Gym","Concierge on call","Paddle boards"],
    scores:{c:4.9,a:5.0,com:4.9,loc:4.9,ci:5.0,v:4.9},
    aiSummary:"The dock at sunset is the most-photographed spot in the portfolio. Generous for families; split payments made two-month stays popular with relocators.",
    reviewsList:[["Amina Z.","Abuja · Feb 2026","We watched the sunset from the dock every evening. Pure magic."],["Tom H.","London · May 2026","The AI review summary said guests love the view — it undersold it."],["Chioma P.","Lagos · Jul 2026","Split payments made a two-month stay painless. Felt like a resident."]],
    nearby:[["Lagos Yacht Club","1.8 km"],["Landmark Beach","3.0 km"],["Nike Art Gallery","5.2 km"],["Circular Bar, VI","1.6 km"]],
  },
  {
    id:"lagoon-duplex", name:"Lekki Lagoon Duplex", area:"Lekki Phase 1", city:"Lagos", img:"p10",
    price:165000, oldPrice:null, rating:4.88, reviews:59, beds:4, baths:4.5, guests:8,
    type:"Furnished Townhouse", badge:"Family Favourite", badgeGold:false, instant:true, policy:"moderate",
    acreage:"Lekki", map:[0.31,0.78], featured:false, new:true, tour:true, floor:"4 Bed Duplex",
    desc:"A warm, wood-screened duplex with a plunge-pool courtyard — made for families and long-term comfort. Quiet street, generous living, thoughtful storage.",
    amens:["Plunge pool courtyard","4 ensuite bedrooms","Full kitchen + pantry","Playroom","Office nook","Fast Wi-Fi","Secure parking for 3","Housekeeping available"],
    scores:{c:4.8,a:4.9,com:4.9,loc:4.8,ci:4.9,v:4.9},
    aiSummary:"Families love the playroom and pantry. Excellent value for 30+ nights — monthly pricing with -25% plus housekeeping keeps long stays effortless.",
    reviewsList:[["Damilola A.","Lagos · Aug 2026","We moved in for six weeks between homes. It absorbed our whole family life beautifully."],["Kate O.","Ibadan · Sep 2026","The courtyard pool saved our summer. Kids never wanted to leave."],["Femi S.","Abuja · Sep 2026","Secure parking, backup power, calm street. Long-stay done right."]],
    nearby:[["Nike Art Gallery","1.9 km"],["Lekki Market","1.2 km"],["Landmark Beach","5.0 km"],["Casa Chianti","0.8 km"]],
  },
  {
    id:"eko-icon", name:"The Eko Icon Suite", area:"Eko Atlantic", city:"Lagos", img:"p11",
    price:95000, oldPrice:null, rating:4.85, reviews:41, beds:1, baths:1.5, guests:2,
    type:"Hotel Suite", badge:"New This Season", badgeGold:false, instant:true, policy:"flexible",
    acreage:"Eko Atlantic", map:[0.25,0.62], featured:false, new:true, tour:false, floor:"1 Bed Suite",
    desc:"A boutique one-bedroom suite with soft champagne tones and city views — the smart, elegant base for a weekend in Eko Atlantic. Hotel services, apartment privacy.",
    amens:["Ocean-facing view","Hotel services","Smart TV","Rain shower","Nespresso","Fast Wi-Fi","Daily housekeeping","24/7 reception"],
    scores:{c:4.9,a:4.8,com:4.9,loc:4.8,ci:4.9,v:4.7},
    aiSummary:"Effortless for short stays — guests praise the 24/7 reception and rain shower. It books fast on event weekends.",
    reviewsList:[["Bella E.","Lagos · Sep 2026","Perfect weekend base. The reception team is lovely and the bed is cloud-soft."],["Ahmed B.","Kano · Sep 2026","Check-in took two minutes. Great Wi-Fi, great shower, great value."],["Rita N.","Port Harcourt · Sep 2026","Eko Atlantic's best budget-luxury secret."]],
    nearby:[["Eko Atlantic Promenade","0.3 km"],["Azure Beach","2.1 km"],["Palms Mall","3.4 km"]],
  },
  {
    id:"abuja-sky", name:"Abuja Sky Residence", area:"Maitama", city:"Abuja", img:"p9",
    price:190000, oldPrice:null, rating:4.91, reviews:77, beds:3, baths:3, guests:5,
    type:"Penthouse", badge:"Corporate Ready", badgeGold:false, instant:false, policy:"strict",
    acreage:"Maitama", map:[0.79,0.26], featured:false, new:false, tour:true, floor:"3 Bed Penthouse",
    desc:"High above the green hills of Abuja — a charcoal-and-brass penthouse with sunset terraces on two sides and the skyline of the capital at your feet.",
    amens:["Twin terraces","Hill & skyline views","Master suite + dressing","Chef's kitchen","Meeting corner","Fibre Wi-Fi","Gym access","Airport transfer","Backup power"],
    scores:{c:4.9,a:4.9,com:4.9,loc:5.0,ci:4.8,v:4.8},
    aiSummary:"Terraces and privacy are the recurring love letters. A couple of guests asked for earlier check-in — late checkout is available on request.",
    reviewsList:[["Moses A.","Abuja · Jun 2026","Sunset on the west terrace, briefing in the meeting corner. This is the executive life."],["Claire D.","London · Jul 2026","The most beautiful home I've stayed in in West Africa. Immaculate."],["Yakubu M.","Kaduna · Sep 2026","Quiet, secure, elegant. The booking request was confirmed within an hour."]],
    nearby:[["Transcorp Hilton","2.2 km"],["Nairobi Street restaurants","1.5 km"],["Jabi Lake","5.8 km"],["City Gate","3.0 km"]],
  },
  {
    id:"island-retreat", name:"The Island Retreat", area:"Banana Island", city:"Lagos", img:"p12",
    price:240000, oldPrice:null, rating:4.94, reviews:63, beds:3, baths:3, guests:6,
    type:"Garden Villa", badge:"Jollof Verified", badgeGold:true, instant:false, policy:"moderate",
    acreage:"Banana Island", map:[0.34,0.5], featured:false, new:false, tour:true, floor:"3 Bed Garden Villa",
    desc:"A garden villa wrapped in palms on the most exclusive island in West Africa — daybeds by a still reflecting pool, birdsong mornings and complete, guarded calm.",
    amens:["Private garden","Reflecting pool","Daybeds & hammocks","Outdoor rain shower","Chef available","Reading room","Smart home","Estate security","Boat access"],
    scores:{c:4.9,a:5.0,com:4.9,loc:5.0,ci:4.9,v:4.9},
    aiSummary:"The garden is the soul of the house — guests describe it as 'a private botanical resort'. Chef bookings sell out, so reserve ahead.",
    reviewsList:[["Oluwaseun F.","Lagos · Apr 2026","Birdsong mornings, pool reflections, total privacy. A quiet kind of luxury."],["Marie L.","Paris · Jul 2026","The rainshower under the palms is unforgettable. Villa team was superb."],["Tunde K.","Lagos · Sep 2026","Booked the chef for a birthday lunch. Effortless, memorable, immaculate."]],
    nearby:[["Banana Island Shopping Court","0.8 km"],["Ikoyi Golf Club","4.5 km"],["Villa Cinemas","5.4 km"]],
  },
];

const COLLECTIONS = [
  { id:"waterfront", name:"Waterfront Escapes", sub:"Lagoon & ocean living", img:"p3", wide:false, tall:true },
  { id:"lagos-penthouses", name:"Lagos Penthouses", sub:"Above the skyline", img:"p1", wide:false, tall:false },
  { id:"abuja-executive", name:"Abuja Executive Suites", sub:"Power stays, perfected", img:"p9", wide:false, tall:false },
  { id:"heritage", name:"Cultural Heritage Stays", sub:"Stories in every wall", img:"p7", wide:false, tall:false },
  { id:"romantic", name:"Romantic Getaways", sub:"For two, beautifully", img:"p2", wide:true, tall:false },
  { id:"family", name:"Family & Long Stays", sub:"Room to breathe", img:"p10", wide:false, tall:false },
];
const COLLECTION_MAP = {
  waterfront:["ocean-spearl","villa-azur","lagoon-villa"],
  "lagos-penthouses":["onyx","sky-garden","atelier-loft"],
  "abuja-executive":["maitama","abuja-sky"],
  heritage:["heritage-house"],
  romantic:["ocean-spearl","sky-garden","lagoon-villa"],
  family:["lagoon-duplex","island-retreat","lagoon-villa"],
};

const NEIGHBORHOODS = [
  { id:"victoria-island", name:"Victoria Island", tag:"The beating heart of Lagos", img:"p2", avg:145000, stays:2,
    desc:"Lagos' commercial centre turned nightlife capital — boardrooms by day, some of West Africa's best restaurants and rooftops by night.",
    dining:["Bogobiri House — Afro-modern fine dining","Circular Bar — lagoon-side cocktails","Rooftop Grill at the George"],
    night:["Flytime Music Hall","Landmark Beach sundowners"],
    transport:["Chauffeurs & ride apps in 5 min","Ferry terminal to Ikoyi","Helipad nearby"],
    safety:["Well-lit main arteries","Estate security at gated residences","24/7 concierge line"],
    culture:["Nike Art Gallery · Terra Kulture"] },
  { id:"ikoyi", name:"Ikoyi", tag:"Old money, green avenues", img:"p4", avg:210000, stays:2,
    desc:"Lagos' most storied residential district — quiet tree-lined streets, boutiques, golf and the lagoon on every horizon.",
    dining:["The George — fine dining","Awolowo Road cafés","Bungalow Restaurant"],
    night:["M Restaurant rooftop","The View, Ikoyi"],
    transport:["Awolowo Road shuttle","Boat services to VI","Ride apps everywhere"],
    safety:["Very low traffic noise","Gated compounds","Street-level lighting"],
    culture:["Heritage architecture walks"] },
  { id:"lekki", name:"Lekki Phase 1", tag:"The new money neighbourhood", img:"p10", avg:165000, stays:2,
    desc:"The city's fastest-growing luxury postcode — new towers, art galleries, beach clubs and the best of Lagos' creative energy.",
    dining:["Nike Art Gallery Café","Casa Chianti — Italian","Suckling Pig by Bol"],
    night:["Beach clubs on Landmark","Live at the Jazzhole"],
    transport:["Lekki-Epe expressway","Ride apps & chauffeurs","Water taxi to VI"],
    safety:["Estate security teams","CCTV at main gates","Emergency response"],
    culture:["Nike Art Gallery · Design Week"] },
  { id:"banana", name:"Banana Island", tag:"Nigeria's most exclusive address", img:"p12", avg:330000, stays:2,
    desc:"Africa's most celebrated artificial island — a private, guarded enclave of villas where the lagoon meets absolute calm.",
    dining:["Estate clubhouse","Private chefs on call","Premium provisions delivery"],
    night:["Private villa evenings","Yacht sundowners"],
    transport:["Private bridge access","Helipad on the island","Chauffeured fleets"],
    safety:["24/7 armed estate security","Access-controlled bridge","Villa alarm systems"],
    culture:["Island yachting & regattas"] },
  { id:"eko-atlantic", name:"Eko Atlantic", tag:"The city of tomorrow", img:"p11", avg:115000, stays:2,
    desc:"Built on land reclaimed from the Atlantic — Eko Atlantic is a planned city of glass towers, promenades and ocean views, rising fast.",
    dining:["Promenade cafés","Azure Beach Club","Marina restaurants"],
    night:["Beachfront lounges","Skyline bars in new towers"],
    transport:["Linked to VI by Boulevard","Ride apps 24/7","Underground parking"],
    safety:["Brand-new infrastructure","CCTV everywhere","Rapid-response security"],
    culture:["Art & design galleries opening weekly"] },
  { id:"maitama", name:"Maitama, Abuja", tag:"The gilded north", img:"p9", avg:175000, stays:2,
    desc:"Abuja's diplomatic and executive quarter — green hills, embassies and discreet luxury minutes from the Central Business District.",
    dining:["Nairobi Street restaurants","Transcorp Hilton dining","Jabi Lake eateries"],
    night:["Diplomatic lounges","Sunset at Jabi Lake"],
    transport:["Airport 35 min","Chauffeur services","Gated estate entry"],
    safety:["Diplomatic security presence","CCTV & patrols","24/7 concierge"],
    culture:["National Gallery nearby"] },
];

const EXPERIENCES = [
  { id:"cruise", name:"Lagos Lagoon Cruise", cat:"Signature", img:"exp-boat", price:85000, dur:"3 hours",
    desc:"Sunset aboard a private yacht — champagne, canapés and the skyline drifting past on the world's most storied lagoon." },
  { id:"chef", name:"Private Chef & Jollof Masterclass", cat:"Taste", img:"exp-chef", price:55000, dur:"2–3 hours",
    desc:"A Jollof Living-approved chef cooks a tasting menu in your kitchen — or teaches you the legend of the perfect jollof." },
  { id:"spa", name:"Spa & Wellness Ritual", cat:"Restore", img:"exp-spa", price:45000, dur:"90 min",
    desc:"In-residence massages, facials and private trainers, delivered to your door by vetted therapists." },
  { id:"tour", name:"Art & Heritage City Tour", cat:"Culture", img:"exp-tour", price:35000, dur:"4 hours",
    desc:"Nike Art Gallery, Freedom Park and the creative studios of Lagos, guided by artists and local historians." },
  { id:"transfer", name:"Airport Transfer", cat:"Essential", img:"p11", price:25000, dur:"45 min",
    desc:"Vetted chauffeurs in luxury SUVs — meet-and-greet, flight tracking and a chilled bottle on board." },
  { id:"events", name:"Event Curation", cat:"Bespoke", img:"p4", price:120000, dur:"Half day",
    desc:"Birthdays, proposals, corporate retreats — our events team designs and runs the whole thing." },
  { id:"shopper", name:"Personal Shopper", cat:"Bespoke", img:"p7", price:30000, dur:"3 hours",
    desc:"Pre-stock groceries, fashion-styling runs, or gift sourcing — someone brilliant, on your side." },
  { id:"festival", name:"Festival Calendar", cat:"Culture", img:"exp-tour", price:0, dur:"Ongoing",
    desc:"Detty December, Eko Jazz, art weeks — we curate tickets and tables for the moments everyone remembers." },
];

const BLOG = [
  { slug:"top-10-stays-lagos", cat:"Guides", title:"The Top 10 Stays in Lagos Right Now", date:"Aug 2026", read:"9 min", img:"p1",
    excerpt:"From sky-high penthouses to lagoon villas — the residences defining luxury travel in Lagos this season.",
    body:["Lagos has never had more beautiful places to stay. A decade of architectural ambition, a new wave of design talent and the world's most vibrant energy have combined into a stay-city without equal.","Our editors visited, slept and hosted at every residence in the current collection, scoring comfort, design, service and location. Here is what rose to the top.","Number one this season is The Onyx Penthouse, a black-marble and brass tour de force in Lekki Phase 1. The private cinema room convinced our judges within the first hour.","Rounding out the list: The Sky Garden Terrace's sunset lounge, Heritage House's restored courtyard, and the Eko Icon Suite — the smartest budget-luxury play in the city."] },
  { slug:"jollof-100", cat:"Food", title:"The Legend of Jollof, Explained Over One Plate", date:"Jul 2026", read:"6 min", img:"exp-chef",
    excerpt:"Every Nigerian claims the perfect recipe. Our private chefs settle the argument — with party rice, of course.",
    body:["There is no dish in West Africa with a bigger reputation. Jollof rice is the dish of celebration, competition and occasionally international diplomacy.","It begins with a smoky base: onions, peppers, scotch bonnet and tomato, cooked low until the flavour lays down. The rice cooks in that sauce, never after it.","Party rice takes it further — the smoky, slightly charred version cooked over a bigger flame, served at every occasion that matters.","Our private chefs run jollof masterclasses in every residence on request, with the recipe that won them their family bragging rights."] },
  { slug:"guidetodettydecember", cat:"Culture", title:"The Insider's Guide to Detty December", date:"Jun 2026", read:"11 min", img:"p4",
    excerpt:"The world's greatest month of music, parties and homecoming — and how to live it like a local.",
    body:["When the diaspora flies home, Lagos becomes the happiest city on earth. Detty December is a full month of concerts, festivals, beach days and long dinners.","Base yourself near the action — Vi, Ikoyi or Lekki Phase 1 — and let the concierge build your calendar, because events sell out in days.","Book early. Our best residences are reserved 60 to 90 days ahead, and the villa team at Villa Azur becomes the most popular address in the city.","Use the last-minute deals channel for flexibility, and always arrange transfers in advance — the December roads demand it."] },
  { slug:"work-from-lagos", cat:"Work", title:"Working From Lagos: The Executive Playbook", date:"May 2026", read:"8 min", img:"p5",
    excerpt:"Fibre Wi-Fi, power resilience and a desk with a view — how to run a serious work week from Nigeria's capital.",
    body:["Lagos and Abuja are quietly becoming remote-work capitals. English-speaking, arts-rich, food-obsessed, and connected by subsea cables to Europe in under 60ms.","The key is choosing a residence built for work: dedicated desks, backup generation, and fibre that never blinks. Our Maitama and Eko Atlantic addresses are favourites.","Extend the workday into the evening the Lagos way — rooftop dinner, jazz, then breakfast with lagoon light.","Our Corporate Ready homes support PO billing, traveler policies and monthly invoicing for companies sending teams."] },
  { slug:"longstay-guide", cat:"Living", title:"Six Weeks in Lagoon Living: A Long-Stay Diary", date:"Apr 2026", read:"7 min", img:"p12",
    excerpt:"What it actually costs, what it actually feels like, and why monthly-staying is the best way to know a city.",
    body:["We asked a guest who stayed six weeks at The Lagoon Villa to keep a diary: costs, routines, discoveries, and the moments she'd never have found as a tourist.","Week one: the split-payment plan meant the move was painless. Weekly housekeeping kept the villa perfect. Week three: she had a standing table at two restaurants and a regular boatman.","Long-stay pricing drops 25% on monthly bookings, with a digital lease agreement that covers everything in plain language.","By week six she knew the market, the barber, the sunset spot and the tide chart."] },
  { slug:"escrow-explained", cat:"Trust", title:"How Escrow Makes Luxury Stays Safe", date:"Mar 2026", read:"5 min", img:"p2",
    excerpt:"Your money is held by Jollof Living until you check in. Here's the full flow — and why it changes everything.",
    body:["The biggest fear in travel is paying for something that isn't what you were promised. Escrow removes that anxiety completely.","When you book, your payment is captured but held by Jollof Living — the host has not received it. You check in, inspect, and confirm. Only then are funds released.","If the residence isn't as described, our Dispute Resolution Centre steps in within hours, not days.","Every booking on the platform is protected this way, with a refund timeline published before you pay."] },
];

const TESTIMONIALS = [
  ["Adaeze O.","The Onyx Penthouse · Lekki","From the airport pickup to the private chef, everything felt considered. This is how luxury travel should work — with African soul."],
  ["James K.","Villa Azur · Banana Island","I've used the big platforms in thirty countries. Nothing matches this finish, this service, or this trust in payments."],
  ["Ngozi U.","Maitama Executive · Abuja","Our company books a month of suites here. Corporate invoicing, split payments, zero friction."],
  ["Tobi F.","The Sky Garden Terrace · Ikoyi","The AI concierge planned our whole weekend — boat, chef, late check-out. Three messages, done."],
  ["Hans W.","Ocean Pearl · Victoria Island","The escrow system means you pay with confidence. Check-in confirmation released the host's funds — it just works."],
  ["Yewande S.","Heritage House · Old Ikoyi","An old Lagos house, restored perfectly. I felt the culture in a way no hotel could ever give me."],
  ["Kelechi O.","The Atelier Loft · Eko Atlantic","Booked the last-minute deal two days before arriving. Best decision of the trip."],
];

const FAQS = [
  ["What are the cancellation policies?","Three transparent tiers: Flexible (full refund up to 48h before check-in), Moderate (full refund up to 5 days, 50% after), and Strict (50% up to 14 days). Each listing shows its policy clearly before you book."],
  ["How do escrow payments work?","Your payment is held securely by Jollof Living and released to the host only after you confirm check-in. If the property isn't as described, our Dispute Resolution Centre and 24/7 team step in."],
  ["Can I split payments on long stays?","Yes. For stays of 30 nights or more you can pay in two installments — 50% at booking and 50% at check-in — easing the financial burden of long-term luxury living."],
  ["What does Jollof Verified mean?","Properties that pass an in-person or video inspection earn the Jollof Verified badge. Every host also completes full KYC identity verification, and every listing is screened by our AI moderation systems."],
  ["Do I need an extended-stay agreement?","For 30+ night stays we generate a digital lease-style agreement with clear terms — signed securely in-app, with a copy stored in your encrypted documents vault."],
  ["What payment methods do you accept?","Cards (Visa, Mastercard, Verve), bank transfer, USSD, mobile money, Paystack, Flutterwave, Stripe, Apple Pay and Google Pay — in NGN, USD, GBP or EUR with real-time exchange rates."],
  ["How is my identity verified?","Three steps: government ID upload, a selfie match, and phone/SMS verification. Verified guests unlock instant booking on more residences and build trust with hosts."],
  ["Can I host an event at a residence?","Selected listings (marked 'Event Hosting') accept intimate events — birthdays, proposals, small retreats. Always request approval at booking; strict noise policies apply after 10pm."],
  ["What is Jollof Points and how do I earn them?","Earn points per night based on your membership tier (5×–15×). Redeem for discounts, late check-outs, upgrades and experiences. Your ledger is in your account."],
  ["How do I become a host?","Start the listing wizard — you'll be guided step by step through details, pricing, policies and photos. Our team then verifies and (on request) photographs your property. You can earn from your first booking."],
  ["Is there help if something goes wrong?","24/7 support on chat, phone and WhatsApp, an in-app dispute resolution centre, and one-tap emergency assistance. Median first response is under 3 minutes."],
  ["Do you support corporate travel?","Jollof Living for Business provides centralized billing, PO numbers, travel policy enforcement, monthly invoicing and a dedicated account manager. Bookings count toward your company's travel dashboard."],
];

const NOTIFS = [
  { id:1, ico:"check", title:"Booking confirmed", body:"Your stay at The Onyx Penthouse (Sep 10–17) is confirmed. Invoice #JL-2026-0912 is ready.", time:"2h ago", unread:true },
  { id:2, ico:"heart", title:"Price drop on a wishlist home", body:"The Atelier Loft dropped to ₦135,000/night — 13% below your last view.", time:"5h ago", unread:true },
  { id:3, ico:"calendar", title:"Check-in in 3 days", body:"Digital lock code for Ocean Pearl Suite unlocks Sep 6, 3:00 PM.", time:"1d ago", unread:true },
  { id:4, ico:"spark", title:"AI price alert", body:"Book Tuesday–Thursday for an estimated 15% saving on The Lagoon Villa.", time:"1d ago", unread:false },
  { id:5, ico:"wallet", title:"Payout processed", body:"₦2,574,000 sent to your Zenith account (ref JL-PO-88731).", time:"2d ago", unread:false },
  { id:6, ico:"star", title:"New review received", body:"Adaeze O. rated your stay 5.0★ — “impeccable.”", time:"3d ago", unread:false },
  { id:7, ico:"gift", title:"Referral bonus earned", body:"Tunde K. joined with your code — ₦10,000 credit added.", time:"4d ago", unread:false },
  { id:8, ico:"moon", title:"Detty December waitlist", body:"You joined the Villa Azur waitlist for Dec 20 – Jan 5. We'll alert you instantly.", time:"5d ago", unread:false },
];

const CONVERSATIONS = [
  { id:"concierge", name:"Jollof Concierge", sub:"AI · online", mine:false, online:true,
    msgs:[ {from:"bot", text:"Welcome! I'm <b>Jollof</b> ✨ — booking, transfers, chefs, anything.", t:"09:41"},
           {from:"me", text:"Book me something nice in Lekki for next weekend", t:"09:42"},
           {from:"bot", text:"Lovely! <b>The Onyx Penthouse</b> in Lekki Phase 1 is available Sep 5–7 at ₦185,000/night — it's <b>Instant Book</b>, so I can reserve it now. Want me to add an airport transfer?", t:"09:42"} ] },
  { id:"team-onyx", name:"The Onyx Penthouse", sub:"Superhost · replies ~5 min", mine:false, online:true,
    msgs:[ {from:"bot", text:"Welcome to The Onyx! Your check-in code is 4471# — the lift is express to P22.", t:"08:05"},
           {from:"me", text:"Perfect. Could we get a crib for the little one?", t:"08:11"},
           {from:"bot", text:"Already done — arriving with the welcome basket at 2pm. See you tomorrow! ✓✓", t:"08:12", read:true} ] },
  { id:"support", name:"Jollof Support", sub:"24/7 · human team", mine:false, online:true,
    msgs:[ {from:"me", text:"Hi — can I add a night to my Ocean Pearl stay?", t:"Yesterday"},
           {from:"bot", text:"Of course! Extended Sep 17→18 at your existing rate. I've sent a modification request to the host — you'll be notified within the hour.", t:"Yesterday", read:true} ] },
];

const ADMIN_STATE = {
  users:[
    ["Adebayo Ogunlesi","adebayo@jolof...","Guest · Host","Gold","Aug 2025","Verified","ok"],
    ["Adaeze Okonkwo","adaeze@...","Guest","Gold","Mar 2026","Verified","ok"],
    ["James Kepler","jkepler@...","Guest","Silver","Jan 2026","Verified","ok"],
    ["Ngozi Ude","ngoz@...","Corporate","Platinum","Nov 2025","Verified","ok"],
    ["Tunde Bakare","tunde@...","Host","Gold","Jun 2025","Verified","ok"],
    ["Hans Weber","hans@...","Guest","Bronze","Feb 2026","Verified","ok"],
    ["Chioma P","chioma@...","Guest","Gold","Dec 2025","Pending ID","warn"],
    ["Moses Adeyemi","moses@...","Host","Silver","Apr 2026","Flagged · 2FA off","warn"],
    ["Yewande Sola","yewande@...","Guest","Gold","May 2026","Verified","ok"],
    ["Femi Scores","femi@...","Host","Bronze","Aug 2026","Under review","warn"],
    ["Zainab M","zainab@...","Guest","Platinum","Sep 2025","Verified","ok"],
    ["Idris Yusuf","idris@...","Guest","—","Sep 2026","Suspended · dispute","bad"],
  ],
  moderation:[
    ["Island Retreat Photos (v2)","island-retreat","Photo set · 24 images","AI passed · awaiting human check","warn"],
    ["New listing: Banana Breeze Villa","—","New listing · Legit Lagos","KYC complete · inspection booked","info"],
    ["Review flag: 'perfect' ×19","sky-garden","Suspicious pattern","AI flagged · human review","warn"],
    ["Villa Azur Dec pricing","villa-azur","Pricing change · +20%","Payout standard","ok"],
  ],
  fraud:[
    ["FRA-0919","Booking · Villa Azur","Card mismatch + new account","72","warn"],
    ["FRA-0921","Payment · ₦1.2M","Velocity anomaly on card","54","warn"],
    ["FRA-0920","Listing · Banana Breeze","Image reuse detected","88","bad"],
    ["FRA-0917","Guest message","Phishing link in chat","61","warn"],
    ["FRA-0915","Payout change","Bank change 24h after booking","45","info"],
  ],
  campaigns:[
    ["NAIROBI-25","Detty December Preview","Oct 1 – Dec 20","Live","₦18.4M","ok"],
    ["REFER10","Give ₦10k, Get ₦10k","Rolling","Live","₦6.1M","ok"],
    ["WELCOME5","First-stay 5%","Rolling","Live","₦2.2M","ok"],
    ["VIP-GOLD","Platinum early access","Q4","Scheduled","—","info"],
    ["MAR25","March long-stay promo","Mar 2027","Draft","—","info"],
  ],
  audit:[
    ["09:12","A. Ogunlesi (Admin)","Approved listing · mod-0812","ok"],
    ["08:47","Finance Bot","Payout batch #88731 settled","info"],
    ["Yesterday","Moderator 3","Flagged review · sky-garden","warn"],
    ["Yesterday","D. Rufai (Support)","Resolved dispute #D-4410 · partial refund","ok"],
    ["2 days ago","DM: Risk","Escalated FRA-0916 to manual review","warn"],
  ],
  cms:[
    ["Home hero slide 2","Live","Jul 30","A. Ogunlesi"],
    ["Neighbourhood guide · Ikoyi","Live","Aug 12","Content team"],
    ["Blog: Detty December insider's guide","Live","Aug 24","Content team"],
    ["Promo banner · Last-minute deals","Live","Sep 1","Growth"],
    ["Help: How escrow works","Draft","—","Support"],
  ],
};

const TIERS = [
  { key:"bronze", letter:"B", name:"Bronze", req:"Every member", mult:"5×", perks:["Earn 5× Jollof Points per stay","Wishlists & price-drop alerts","Standard concierge support","Welcome baskets on select stays"], pts:"0+" },
  { key:"silver", letter:"S", name:"Silver", req:"10,000 points", mult:"8×", perks:["Earn 8× Jollof Points","Late check-out on request","Priority support line","Monthly members-only deals"], pts:"10k+" },
  { key:"gold", letter:"G", name:"Gold", req:"50,000 points", mult:"12×", featured:true, perks:["Earn 12× Jollof Points","Complimentary upgrades","Free airport transfers","Early access to new listings"], pts:"50k+" },
  { key:"platinum", letter:"P", name:"Platinum", req:"150,000 points", mult:"15×", perks:["Earn 15× Jollof Points","Dedicated account manager","Personal shopper & errand service","VIP event invitations"], pts:"150k+" },
];

const POINTS_LEDGER = [
  ["Sep 2, 2026","Shell Lagoon Experience","−12,000","redeem"],
  ["Aug 30, 2026","Stay · Ocean Pearl Suite (12n × 12×)","+52,560","earn"],
  ["Aug 1, 2026","Stay · The Sky Garden Terrace (7n × 12×)","+31,200","earn"],
  ["Jul 12, 2026","Referral bonus · Tunde K.","+10,000","earn"],
  ["Jul 4, 2026","Stay · Heritage House (3n × 12×)","+8,640","earn"],
  ["Jun 20, 2026","Gift purchase · ₦100,000 card","+1,000","earn"],
];

const HELP_CATEGORIES = [
  { id:"booking", name:"Booking & reservations", n:4, ico:"calendar" },
  { id:"payments", name:"Payments, invoices & tax", n:3, ico:"wallet" },
  { id:"hosting", name:"Hosting on Jollof Living", n:3, ico:"building" },
  { id:"trust", name:"Trust, safety & disputes", n:4, ico:"shield" },
  { id:"account", name:"Account, ID & security", n:3, ico:"lock" },
  { id:"app", name:"Using the app", n:2, ico:"phone" },
];

const ROADMAP = [
  { ph:"live", title:"Jollof Living for Business", desc:"Corporate travel portal with centralized billing, travel policy enforcement and team dashboards.", status:"live" },
  { ph:"dev", title:"Jollof Living Experiences", desc:"A standalone marketplace for local experiences, separate from property stays.", status:"dev" },
  { ph:"dev", title:"Jollof Living Homes", desc:"Six-to-twelve-month furnished rentals for relocating professionals.", status:"dev" },
  { ph:"dev", title:"Jollof Living Invest", desc:"Fractional property investment — own a share of luxury residences and earn rental income.", status:"dev" },
  { ph:"soon", title:"AR Property Previews", desc:"Augmented-reality walk-throughs through your phone camera.", status:"soon" },
  { ph:"soon", title:"Blockchain Verification", desc:"Immutable ownership and review verification on-chain.", status:"soon" },
  { ph:"soon", title:"IoT Smart Monitoring", desc:"Real-time noise, energy and occupancy monitoring for hosts.", status:"soon" },
  { ph:"soon", title:"Jollof Living Magazine", desc:"A digital lifestyle publication showcasing African luxury living.", status:"soon" },
  { ph:"soon", title:"The Jollof Card", desc:"Co-branded debit card with cashback on bookings and partner perks.", status:"soon" },
  { ph:"dev", title:"Carbon Offset Programme", desc:"Offset your travel footprint at checkout — verified projects.", status:"dev" },
];

const AUTH_METHODS = ["Email","Phone","Google","Apple","Facebook"];
const PAY_METHODS = [
  { id:"card", name:"Credit / debit card", note:"Visa, Mastercard, Verve", ico:"wallet" },
  { id:"paystack", name:"Paystack", note:"Instant · NGN & USD", ico:"bolt" },
  { id:"flutterwave", name:"Flutterwave", note:"Cards, bank, mobile money", ico:"globe" },
  { id:"bank", name:"Bank transfer", note:"All Nigerian banks", ico:"building" },
  { id:"ussd", name:"USSD", note:"*737# style dial codes", ico:"phone" },
  { id:"mobile", name:"Mobile money", note:"MTN MoMo, OPay, PalmPay", ico:"phone" },
  { id:"applepay", name:"Apple Pay", note:"One touch on iOS", ico:"lock" },
  { id:"googlepay", name:"Google Pay", note:"One touch on Android", ico:"lock" },
];


/* ===== ui.js ===== */
/* ============================================================
   JOLLOF LIVING — ui.js  (icons, helpers, components)
   ============================================================ */

const I = {
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
  bed:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 18h18M3 18v2m18-2v2M6 9V7a2 2 0 0 1 2-2h3v4"/></svg>',
  bath:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2z"/><path d="M6 12V5a2 2 0 0 1 4 0M7 19l-1 2m11-2l1 2"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M16 4.6a3.2 3.2 0 0 1 0 6.2M17.5 14.4c2 .7 3.3 2.3 3.7 4.6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg>',
  ok:"✓", x:"✕",
  checkCircle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-5"/></svg>',
  wifi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2.5 8.5C8 3.5 16 3.5 21.5 8.5M5.5 12c4-3.4 9-3.4 13 0M9 15.3c2-1.7 4-1.7 6 0"/><circle cx="12" cy="18.6" r="1.2" fill="currentColor"/></svg>',
  pool:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 17c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0M2 21c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0M8 15V5.5A1.5 1.5 0 0 1 11 5m0 3.5A1.5 1.5 0 0 1 14 10m-6 5V3.8"/></svg>',
  car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 16v-4l1.8-4.2A2 2 0 0 1 7.7 6.5h8.6a2 2 0 0 1 1.9 1.3L20 12v4m-16 0v2m16-2v2M4 16h16M6.5 13.5h.01M17.5 13.5h.01"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.5l7.5 3v6c0 4.8-3.2 8.2-7.5 10-4.3-1.8-7.5-5.2-7.5-10v-6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/></svg>',
  wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="6" width="19" height="13" rx="2.5"/><path d="M2.5 10h19M16 15h2.5"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4zM19 16l.9 2.6L22.5 19l-2.6.9L19 22.5l-.9-2.6L15.5 19l2.6-.9z"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 2.5V7m8-4.5V7"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20.5S3.5 15 3.5 9.1A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.5c0 5.9-8.5 11.4-8.5 11.4z"/></svg>',
  heartFill:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5S3.5 15 3.5 9.1A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.5c0 5.9-8.5 11.4-8.5 11.4z"/></svg>',
  sun:'<svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.5 4.5l1.8 1.8M17.7 17.7l1.8 1.8M4.5 19.5l1.8-1.8M17.7 6.3l1.8-1.8"/></svg>',
  moon:'<svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  xsvg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.4-4.1-1L3 21l1.6-5A8.5 8.5 0 1 1 21 12z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16 16"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16M13 5l7 7-7 7"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 2.6 4.2 5.6 4.2 9S14.8 18.4 12 21c-2.8-2.6-4.2-5.6-4.2-9S9.2 5.6 12 3z"/></svg>',
  gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="8" width="17" height="4"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13M12 8s-4.5.2-5.5-2C5.8 4.2 8 2.6 9.5 3.8 11 5 12 8 12 8zm0 0s4.5.2 5.5-2c.7-1.8-1.5-3.4-3-2.2C13 5 12 8 12 8z"/></svg>',
  broom:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13.5 3l7 7-1.8 1.8a3 3 0 0 1-4.2 0L8 5.2M7 8L3 20l9-3.5M4.5 15.5L9 19"/></svg>',
  key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="15" r="4.5"/><path d="M11.5 11.5L20 3m-3 3l3 3m-6 0l2.5 2.5"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
  scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v18M5 21h14M5 6l7-3 7 3M5 6l-2.5 7a3 3 0 0 0 5 0L5 6zm14 0l-2.5 7a3 3 0 0 0 5 0L19 6z"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V5a2 2 0 0 1 2-2h13v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H19v-4"/></svg>',
  leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 20c0-9 4-15 15-16-.5 10-5 16-13 16M5 20c1.5-6 5-10 10-12"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5z"/></svg>',
  tv:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="6.5" width="18" height="12" rx="2"/><path d="M8 3l4 3.5L16 3"/></svg>',
  dumbbell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 8v8m10-8v8M3.5 9.5v5M20.5 9.5v5M7 12h10"/></svg>',
  wine:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 3h8l-.7 6a3.3 3.3 0 0 1-6.6 0zM12 15v6M8.5 21h7M8.5 3l-2 4.5a2.5 2.5 0 0 0 4.8 1M15.5 3l2 4.5a2.5 2.5 0 0 1-4.8 1"/></svg>',
  ac:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="7" width="19" height="10" rx="2"/><path d="M7 10v4m5-4v4m5-4v4"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8.5 7h2m3 0h2m-7 4h2m3 0h2m-7 4h2m3 0h2M10 21v-3h4v3"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
  bot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4.5V8M8.5 13h.01M15.5 13h.01M9 16.5h6"/><circle cx="12" cy="4" r="1.6"/></svg>',
  exchange:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/></svg>',
  gold:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7.5l4.2 3.3L12 4.5l4.8 6.3L21 7.5l-1.6 10.5H4.6z"/><path d="M5 21h14"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="6.5" width="19" height="13" rx="2.5"/><path d="M8.5 6.5L10 4h4l1.5 2.5M12 10a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>',
  zoom:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16 16M11 8v6M8 11h6"/></svg>',
  chatBell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/></svg>',
  video:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="6.5" width="13" height="11" rx="2.5"/><path d="M15.5 10.5l6-3v9l-6-3z"/></svg>',
  call:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2m4 0l-.8 12a2 2 0 0 1-2 1.9H7.8a2 2 0 0 1-2-1.9L5 7M10 11v6m4-6v6"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20h4L20 8l-4-4L4 16zM13.5 6.5l4 4"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="12" r="2.6"/><circle cx="17.5" cy="5.5" r="2.6"/><circle cx="17.5" cy="18.5" r="2.6"/><path d="M8.3 10.8l6.9-4M8.3 13.2l6.9 4"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  notification:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/></svg>',
};

/* ---------------- helpers ---------------- */
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k,d){ try{ const v = localStorage.getItem("jl_"+k); return v===null?d:JSON.parse(v);}catch(e){return d;} },
  set(k,v){ try{ localStorage.setItem("jl_"+k, JSON.stringify(v)); }catch(e){} },
};
let currency = store.get("currency","NGN");
const fmt = (ngn) => { const c = FX[currency]; const v = ngn*c.r; return c.s + (v>=1000 ? Math.round(v).toLocaleString("en-NG") : v.toFixed(c.d)); };
const K = (ngn) => fmt(ngn).replace(/,000$/,"k");

const todayStr = (off=0) => { const d=new Date(); d.setDate(d.getDate()+off); return d.toISOString().slice(0,10); };

/* ------------- multi-page URL map (authoring uses "/path", runtime uses real files) ------------- */
const PAGE_MAP = {
  "/": "index.html", "/index": "index.html",
  "/stays": "stays.html", "/map": "map.html",
  "/collections": "collections.html",
  "/experiences": "experiences.html",
  "/reviews": "reviews.html",
  "/blog": "blog.html",
  "/help": "help.html",
  "/membership": "membership.html",
  "/giftcards": "giftcards.html",
  "/referral": "referral.html",
  "/business": "business.html",
  "/about": "about.html",
  "/app": "app.html",
  "/future": "future.html",
  "/concierge": "concierge.html",
  "/messages": "messages.html",
  "/notifications": "notifications.html",
  "/trips": "trips.html",
  "/wishlist": "wishlist.html",
  "/compare": "compare.html",
  "/account": "account.html",
  "/auth": "auth.html",
  "/host": "host.html",
  "/host/onboarding": "host-onboarding.html",
  "/host/dashboard": "host-dashboard.html",
  "/payments": "payments.html",
  "/admin": "admin.html",
  "/admin-login": "admin-login.html",
  "/404": "404.html",
};
const URL = (path) => {
  let p = path || "/", qs = "";
  const qi = p.indexOf("?"); if (qi > -1) { qs = p.slice(qi); p = p.slice(0, qi); }
  const seg = p.split("/").filter(Boolean);
  const s1 = seg[0] || "", s2 = seg[1] || "";
  if (s1 === "stay" && s2) return `stay-${s2}.html${qs}`;
  if (s1 === "booking" && s2) return `booking-${s2}.html${qs}`;
  if (s1 === "neighborhood" && s2) return `neighborhood-${s2}.html${qs}`;
  if (s1 === "blog" && s2) return `blog-${s2}.html${qs}`;
  if (s1 === "confirm" && s2) return `confirm.html?ref=${encodeURIComponent(s2)}`;
  if (PAGE_MAP[p]) return PAGE_MAP[p] + qs;                  // exact two-segment first
  return (PAGE_MAP["/" + s1] || "404.html") + qs;
};
/* navigate to an internal route */
function nav(path) { location.href = URL(path); }
/* current page id from the generated <body data-page="…"> */
const PAGE_ID = (document.body && document.body.getAttribute("data-page")) || "index";
const qp = (k) => new URLSearchParams(location.search).get(k);
const qps = () => Object.fromEntries(new URLSearchParams(location.search).entries());

/* turns authoring links ("#/stays", data-goto="/stay/onyx") into real page navigation */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#/"]');
  if (a) { e.preventDefault(); location.href = URL(a.getAttribute("href").slice(1)); return; }
  const g = e.target.closest("[data-goto]");
  if (g) { location.href = URL(g.dataset.goto); return; }
});

/* global mutable state */
const S = {
  wishlists: store.get("wishlists", { default: [] }),        // {name:[ids]}
  activeWishlist: store.get("activeWishlist","default"),
  compare: store.get("compare", []),
  bookings: store.get("bookings", []),                        // guest trips
  requests: store.get("requests", []),
  waitlist: store.get("waitlist", []),
  recent: store.get("recent", []),
  points: store.get("points", 62400),
  notifsRead: store.get("notifsRead", []),
  tier: store.get("tier","gold"),
  notifications: NOTIFS,
  promoApplied: null, giftApplied: null,
  hostListings: store.get("hostListings", []),
  filters: { loc:"all", guests:1, price:500, type:"all", instants:false, flex:false },
  searchDates: null,
};

const dump = () => { ["wishlists","activeWishlist","compare","bookings","requests","waitlist","recent","points","tier","hostListings"].forEach(k=>store.set(k,S[k])); store.set("notifsRead",S.notifsRead); };

/* recent views (stay pages) */
function recentAdd(id){
  const i=S.recent.indexOf(id); if(i>-1) S.recent.splice(i,1);
  S.recent.unshift(id); if(S.recent.length>10) S.recent.length=10; dump();
}

/* ---------------- toast ---------------- */
function toast(msg, icon="check") {
  const t=document.createElement("div"); t.className="toast";
  t.innerHTML=(I[icon]?I[icon]:I.check)+`<span>${msg}</span>`;
  $("#toasts").appendChild(t);
  setTimeout(()=>t.classList.add("out"),3600); setTimeout(()=>t.remove(),4100);
}

/* ---------------- modal / sheet ---------------- */
function openModal(html, cls="") {
  const body=$("#modalBody"), panel=$("#modalPanel");
  body.innerHTML=html; panel.className="modal-panel "+cls;
  $("#modalRoot").classList.add("open"); document.body.style.overflow="hidden";
  const s=body.querySelector(".mscroll"); if(s){ const t=body.querySelector(".mtop"); if(t) t.scrollIntoView({block:"start"}); }
}
function closeModal(){ $("#modalRoot").classList.remove("open"); document.body.style.overflow=""; }
function openSheet(html){ $("#sheetPanel").innerHTML=html; $("#sheetRoot").classList.add("open"); document.body.style.overflow="hidden"; }
function closeSheet(){ $("#sheetRoot").classList.remove("open"); document.body.style.overflow=""; }
document.getElementById("modalX").addEventListener("click", closeModal);

/* ---------------- charts (pure SVG) ---------------- */
function lineChart(data, opts={}) {
  const W=560,H=210,P=34, vals=data.map(d=>d.v), min=Math.min(...vals)*0.92, max=Math.max(...vals)*1.06;
  const x=i=>P+i*(W-2*P)/(data.length-1), y=v=>H-P-(v-min)/(max-min)*(H-2*P);
  let path="", area=`M${x(0)},${y(vals[0])}`;
  vals.forEach((v,i)=>{ path+=`${i?"L":"M"}${x(i)},${y(v)}`; area+=` L${x(i)},${y(v)}`; });
  area+=` L${x(vals.length-1)},${H-P} L${x(0)},${H-P} Z`;
  const last=vals[vals.length-1];
  const grid=[0,0.5,1].map(f=>H-P-f*(H-2*P)).map(gy=>`<line x1="${P}" x2="${W-P}" y1="${gy}" y2="${gy}" stroke="var(--line-soft)" stroke-width="1"/>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" role="img">
    ${grid}
    <path d="${area}" fill="var(--gold-soft)"/>
    <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round"/>
    ${vals.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="${i===vals.length-1?5:2.6}" fill="${i===vals.length-1?"var(--accent)":"var(--card)"}" stroke="var(--accent)" stroke-width="1.6"/>`).join("")}
    <text x="${x(vals.length-1)}" y="${y(last)-12}" text-anchor="end" font-size="13" font-family="Cormorant Garamond,serif" font-weight="600" fill="var(--accent)">${opts.fmt?opts.fmt(last):last}</text>
    ${(opts.labels||[]).map((l,i)=>`<text x="${x(i)}" y="${H-10}" text-anchor="middle" font-size="10.5" fill="var(--ink-faint)" font-family="Jost,sans-serif">${l}</text>`).join("")}
  </svg>`;
}
function barChart(data, opts={}) {
  const W=560,H=210,P=44, max=Math.max(...data.map(d=>d.v))*1.12;
  const bw=(W-2*P)/data.length*0.58;
  return `<svg viewBox="0 0 ${W} ${H}">
    <line x1="${P}" x2="${W-P}" y1="${H-P}" y2="${H-P}" stroke="var(--line)" stroke-width="1"/>
    ${data.map((d,i)=>{ const h=(d.v/max)*(H-2*P); const x=P+i*(W-2*P)/data.length+( (W-2*P)/data.length-bw)/2; return `<rect x="${x}" y="${H-P-h}" width="${bw}" height="${h}" rx="6" fill="${d.c||"var(--accent)"}" opacity="${d.c?"0.9":"0.85"}"/><text x="${x+bw/2}" y="${H-P+16}" text-anchor="middle" font-size="10.5" fill="var(--ink-faint)" font-family="Jost,sans-serif">${d.l}</text>`;}).join("")}
  </svg>`;
}
function donutChart(parts, center) {
  const total=parts.reduce((a,p)=>a+p.v,0); let acc=0;
  const ring=parts.map(p=>{ const a0=acc/total*360; acc+=p.v; const a1=acc/total*360;
    const large=a1-a0>180?1:0; const r1=54,r0=34, c=(x,y)=>[x,y];
    const pt=(r,a)=>{ const rad=(a-90)*Math.PI/180; return [100+r*Math.cos(rad),100+r*Math.sin(rad)]; };
    const [x0,y0]=pt(r1,a0),[x1,y1]=pt(r1,a1),[x2,y2]=pt(r0,a1),[x3,y3]=pt(r0,a0);
    return `<path d="M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z" fill="${p.c}"/>`;}).join("");
  return `<svg viewBox="0 0 200 200" style="max-width:200px;margin:0 auto">${ring}<text x="100" y="96" text-anchor="middle" font-size="24" font-family="Cormorant Garamond,serif" font-weight="600" fill="var(--ink)">${center[0]}</text><text x="100" y="116" text-anchor="middle" font-size="10.5" fill="var(--ink-faint)" font-family="Jost,sans-serif">${center[1]}</text></svg>`;
}
function sparkline(data, w=120, h=34) {
  const min=Math.min(...data), max=Math.max(...data);
  const pts=data.map((v,i)=>`${(i*(w-8)/(data.length-1)+4)},${h-5-(v-min)/(max-min||1)*(h-10)}`).join(" ");
  return `<svg viewBox="0 0 ${w} ${h}" style="width:${w}px;height:${h}px"><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/></svg>`;
}

/* ---------------- prices & booking math ---------------- */
function nightsBetween(a,b){ const n=Math.round((new Date(b)-new Date(a))/864e5); return n>0?n:0; }
function priceMath(p, n, opts={}) {
  const monthly=n>=30, weekly=n>=7;
  const discRate=monthly?RATES.monthlyDisc:weekly?RATES.weeklyDisc:0;
  const nightly=p.price*(1-discRate);
  const subtotal=nightly*n;
  let addons=0; (opts.addons||[]).forEach(a=>{ addons += a.k==="insurance"? subtotal*RATES.insurance : ADDONS[a].price; });
  const svc=Math.round(subtotal*RATES.service);
  const vat=Math.round((subtotal+svc)*RATES.vat);
  const deposit=Math.round(subtotal*RATES.deposit);
  let total=subtotal+svc+vat+RATES.cleaning+addons;
  if(opts.promo){ const pr=PROMOS[opts.promo]; if(pr) total-= pr.off? Math.round(total*pr.off) : (pr.flat||0); }
  if(opts.gift) total-=Math.min(opts.gift, total>0?Math.max(0,total):0);
  return { monthly, weekly, discRate, nightly, subtotal, addons, svc, vat, deposit, total: Math.max(0,Math.round(total)), split: monthly||weekly };
}
function persist(){ dump(); renderBadges(); }

/* ---------------- badges ---------------- */
function renderBadges() {
  const wl=$("#wlCount"); if(wl) wl.textContent=Object.values(S.wishlists).reduce((a,l)=>a+l.length,0);
  const nc=$("#notifCount"); if(nc){ const u=S.notifications.filter(n=>n.unread&&!S.notifsRead.includes(n.id)).length; nc.textContent=u; nc.style.display=u?"grid":"none"; }
  const mc=$("#msgCount"); if(mc){ mc.textContent=S.unreadMsgs||0; mc.style.display=S.unreadMsgs?"grid":"none"; }
}

/* ---------------- stay card ---------------- */
function stayCard(p) {
  const fav=(S.wishlists[S.activeWishlist]||[]).includes(p.id);
  const cmp=S.compare.includes(p.id);
  return `
  <article class="stay-card reveal in">
    <div class="stay-media" data-goto="/stay/${p.id}">
      <img src="data:image/jpeg;base64,${ASSETS[p.img]}" alt="${esc(p.name)}" loading="lazy">
      <span class="ribbon ${p.badgeGold?"gold":""}">${p.badgeGold?I.gold:I.shield}${esc(p.badge)}</span>
      <button class="heart-btn ${fav?"active":""}" data-heart="${p.id}" aria-label="Save to wishlist">${fav?I.heartFill:I.heart}</button>
    </div>
    <div class="stay-body">
      <div class="stay-top">
        <div>
          <h3 data-goto="/stay/${p.id}">${esc(p.name)}</h3>
          <div class="stay-loc">${I.pin}${esc(p.area)}, ${esc(p.city)}</div>
        </div>
        <div class="stay-rating">${I.star}${p.rating.toFixed(2)}<span class="rev">(${p.reviews})</span></div>
      </div>
      <div class="stay-specs">
        <span class="spec">${I.bed}${p.beds} bd</span><span class="spec">${I.bath}${p.baths} ba</span><span class="spec">${I.users}${p.guests} guests</span>
      </div>
      <div class="stay-foot">
        <div class="price">${p.oldPrice?`<span class="old-price">${fmt(p.oldPrice)}</span>`:""}<span class="amt" data-price="${p.price}">${fmt(p.price)}</span><span class="per">/night</span></div>
        <div class="btnrow" style="gap:6px">
          ${S.compare.length<3||cmp?`<button class="btn btn-ghost btn-sm" data-cmp="${p.id}">${I.scale.replace("fill=\"none\"","fill=\"none\"")}Compare</button>`:""}
          <button class="btn btn-green btn-sm" data-goto="/stay/${p.id}">View</button>
        </div>
      </div>
    </div>
  </article>`;
}

/* ---------------- calendar widget ---------------- */
function calWidget(sel, soldRanges) {
  const now=new Date();
  const calTitle=(m,y)=>new Date(m,y,1).toLocaleDateString("en-GB",{month:"long",year:"numeric"});
  const cells=(m,y)=>{
    const first=new Date(m,y,1).getDay(), days=new Date(m,y+1,0).getDate();
    let h=`${["S","M","T","W","T","F","S"].map(d=>`<div class="dow">${d}</div>`).join("")}`;
    for(let i=0;i<first;i++) h+="<span></span>";
    for(let d=1;d<=days;d++){
      const iso=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const past=iso<todayStr();
      const sold=(soldRanges||[]).some(r=>iso>=r[0]&&iso<=r[1]);
      let cls="cd"; if(past) cls+=" past"; if(sold) cls+=" sold"; if(iso===todayStr()) cls+=" today";
      if(sel && iso===sel.in) cls+=" edge"; else if(sel && iso===sel.out) cls+=" edge";
      else if(sel && iso>sel.in && iso<sel.out) cls+=" inrange";
      h+=`<div class="${cls}" data-d="${iso}">${d}</div>`;
    }
    return h;
  };
  const state={m:now.getMonth(),y:now.getFullYear()};
  return `<div class="cal" id="calBox">
    <div class="cals-head">
      <button class="icon-btn" data-cal="-1" aria-label="Previous month">‹</button>
      <b id="calTitle">${calTitle(state.m,state.y)}</b>
      <button class="icon-btn" data-cal="1" aria-label="Next month">›</button>
    </div>
    <div class="cal-grid" id="calGrid">${cells(state.m,state.y)}</div>
  </div>`;
}
function bindCal(sel, soldRanges, onPick) {
  const box=$("#calBox"); if(!box) return;
  const title=$("#calTitle");
  let m=box.dataset.m?+box.dataset.m:new Date().getMonth(), y=box.dataset.y?+box.dataset.y:new Date().getFullYear();
  const render=()=>{
    box.dataset.m=m; box.dataset.y=y;
    title.textContent=new Date(m,y,1).toLocaleDateString("en-GB",{month:"long",year:"numeric"});
    box.querySelectorAll("#calGrid .cd").forEach(()=>{});
    const grid=box.querySelector("#calGrid");
    const first=new Date(m,y,1).getDay(), days=new Date(m,y+1,0).getDate();
    let h=grid.querySelector(".dow")?grid.outerHTML.match(/<div class="dow">[^]*?<\/div>/g)[0]:"";
    let cell="";
    for(let i=0;i<first;i++) cell+="<span></span>";
    for(let d=1;d<=days;d++){
      const iso=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const past=iso<todayStr();
      const sold=(soldRanges||[]).some(r=>iso>=r[0]&&iso<=r[1]);
      let cls="cd"; if(past) cls+=" past"; if(sold) cls+=" sold"; if(iso===todayStr()) cls+=" today";
      if(sel && iso===sel.in) cls+=" edge"; else if(sel && iso===sel.out) cls+=" edge";
      else if(sel && iso>sel.in && iso<sel.out) cls+=" inrange";
      cell+=`<div class="${cls}" data-d="${iso}">${d}</div>`;
    }
    grid.innerHTML=cell;
    grid.querySelectorAll(".cd").forEach(c=>c.addEventListener("click",()=>{
      const d=c.dataset.d;
      if(!sel.in||(sel.in&&sel.out)||d<=sel.in){ sel.in=d; sel.out=null; }
      else if(d>sel.in){ sel.out=d; }
      render(); onPick&&onPick(sel);
    }));
  };
  box.querySelectorAll("[data-cal]").forEach(b=>b.addEventListener("click",()=>{ m+=+b.dataset.cal; if(m<0){m=11;y--;} if(m>11){m=0;y++;} render(); }));
  render();
}

/* ---------------- review stars ---------------- */
function stars(n, size=14) {
  let h="";
  for(let i=1;i<=5;i++) h+=`<svg viewBox="0 0 24 24" class="${i<=n?"":"off"}"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>`;
  return `<span class="stars-row">${h}</span>`;
}

/* ---------------- page scaffolding ---------------- */
function pageHead(crumbs, title, sub, actions="") {
  return `<div class="page-head"><div class="wrap">
    <div class="crumbs">${crumbs.map(c=>c[1]?`<a href="${c[1]}">${c[0]}</a>`:c[0]).join(" &nbsp;/&nbsp; ")}</div>
    <h1>${title}</h1>
    ${sub?`<p>${sub}</p>`:""}
    ${actions?`<div class="head-actions">${actions}</div>`:""}
  </div></div>`;
}

/* delegated actions (navigation for data-goto/`#/` links lives in ui.js helpers above) */
document.addEventListener("click", (e)=>{
  const hb=e.target.closest("[data-heart]");
  if(hb){ e.stopPropagation(); toggleWish(hb.dataset.heart, hb); }
  const cb=e.target.closest("[data-cmp]");
  if(cb){ e.stopPropagation(); toggleCompare(cb.dataset.cmp); return; }
  const cls=e.target.closest("[data-closeall]");
  if(cls){ closeModal(); closeSheet(); }
  const cl2=e.target.closest("[data-close]");
  if(cl2){ closeDrawer(); }
});


/* ===== pages-discovery.js ===== */
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


/* ===== pages-booking.js ===== */
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
    <div class="crumbs"><a href="#/">Home</a> / <a href="#/stay/${id}">${esc(p.name)}</a> / ${BOOK_STATE.req?"Request to Book":"Checkout"}</div>
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
      <a class="btn btn-ghost" href="#/stay/${BOOK_STATE.id}">← Back to listing</a>
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
          <img src="data:image/jpeg;base64,${ASSETS[p.img]}" style="width:120px;height:88px;object-fit:cover;border-radius:12px" alt="">
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
function confirmBooking(p){
  const m=bkCalc();
  const ref="JL-2026-"+String(Math.floor(1000+Math.random()*9000));
  const booking={
    ref, prop:p.id, name:p.name, img:p.img, area:p.area, city:p.city,
    in:BOOK_STATE.in, out:BOOK_STATE.out, nights:nightsBetween(BOOK_STATE.in,BOOK_STATE.out)||3,
    guests:BOOK_STATE.guests, policy:BOOK_STATE.policy, method:BOOK_STATE.method,
    addons:BOOK_STATE.addons, split:BOOK_STATE.split, req:BOOK_STATE.req,
    total:Math.round(m.total), status:BOOK_STATE.req?"pending":"confirmed",
    createdAt:new Date().toISOString(),
  };
  S.bookings.unshift(booking); dump();
  const earned=Math.floor(booking.total/1000)*(TIERS.find(t=>t.key===S.tier).mult==="5×"?5:TIERS.find(t=>t.key===S.tier).mult==="8×"?8:TIERS.find(t=>t.key===S.tier).mult==="12×"?12:15);
  S.points+=earned; dump();
  nav("/confirm/"+encodeURIComponent(ref));
}
function pConfirm(ref){
  const b=S.bookings.find(x=>x.ref===decodeURIComponent(ref))||S.bookings[0];
  if(!b) return p404();
  const p=PROPERTIES.find(x=>x.id===b.prop);
  const earned=Math.floor(b.total/1000)*(S.tier==="platinum"?15:S.tier==="gold"?12:S.tier==="silver"?8:5);
  return `
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
        <img src="data:image/jpeg;base64,${ASSETS[b.img]}" style="width:130px;height:92px;object-fit:cover;border-radius:12px" alt="">
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
  const p=PROPERTIES.find(x=>x.id===b.prop);
  openModal(`
    <div class="mhead" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
      <div><span class="eyebrow">Invoice ${b.ref}</span><h2 style="margin-top:8px">Jollof Living</h2></div>
      <div style="text-align:right"><div class="small">Luxury Living, African Soul</div><div class="small">www.jollofliving.com</div></div>
    </div>
    <div class="separator" style="height:1px;background:var(--line);margin:14px 0 20px"></div>
    <div class="grid-2" style="gap:20px;margin-bottom:20px">
      <div><div class="small">Billed to</div><div class="muted" style="font-size:14.5px">Adebayo Ogunlesi<br>adebayo@jollofliving.com<br>Lagos, Nigeria</div></div>
      <div><div class="small">Stay</div><div class="muted" style="font-size:14.5px">${esc(b.name)}<br>${esc(b.area)}, ${esc(b.city)}<br>${b.in} → ${b.out}</div></div>
    </div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>
      <tr><td>${fmt(p.price)} × ${b.nights} nights ${b.nights>=30?"(−25%)":b.nights>=7?"(−12%)":""}</td><td>${b.nights}</td><td>${fmt(p.price)}</td><td style="text-align:right">${fmt(b.total*0.75)}</td></tr>
      ${b.addons.map(a=>`<tr><td>${ADDONS[a].name}</td><td>1</td><td>${ADDONS[a].price>=1?fmt(ADDONS[a].price):"3%"}</td><td style="text-align:right">${ADDONS[a].price>=1?fmt(ADDONS[a].price):fmt(Math.round(b.total*0.03))}</td></tr>`).join("")}
      <tr><td>Cleaning fee</td><td>1</td><td>${fmt(RATES.cleaning)}</td><td style="text-align:right">${fmt(RATES.cleaning)}</td></tr>
      <tr><td>Service fee (8%) + VAT (7.5%)</td><td>1</td><td>—</td><td style="text-align:right">${fmt(Math.round(b.total*0.13))}</td></tr>
      <tr><td colspan="3"><b>Total due (${b.split?"split: 50% now":PAY_METHODS.find(x=>x.id===b.method).name})</b></td><td style="text-align:right"><b style="font-family:var(--fs-serif);font-size:19px">${fmt(b.total)}</b></td></tr>
    </tbody></table></div>
    <div class="small" style="margin-top:14px">VAT computed at 7.5% · WHT applies to host payouts · Payment held in escrow until check-in confirmation. Thank you for staying with Jollof Living.</div>
    <div class="btnrow" style="margin-top:18px"><button class="btn btn-gold" onclick="toast('Invoice downloaded as PDF ✨','download')">${I.download} Download PDF</button>
    <button class="btn btn-ghost" onclick="toast('Sent to your email inbox','send')">${I.send} Email me</button></div>
  `);
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
  const upcoming=S.bookings.filter(b=>b.status!=="cancelled"&&b.in>=now);
  const active=S.bookings.filter(b=>b.status==="active"||(b.in<=now&&b.out>=now));
  const past=S.bookings.filter(b=>b.out<now||b.status==="completed");
  const pending=S.bookings.filter(b=>b.status==="pending");
  const all={upcoming,active,past,pending};
  const list=all[tab]||[];
  return `${pageHead([["Home","#/"],["My trips"]],"<em class='serif-i'>My</em> trips","Every reservation, request and stay — in one organised place.",
    `<button class="btn btn-gold" data-goto="/stays">Book a new stay</button>`)}
  <div class="page-body"><div class="wrap">
    <div class="tabs" style="margin-bottom:24px" id="tripTabs">
      ${[["upcoming","Upcoming"],["pending","Awaiting host"],["active","Active"],["past","Past"]].map(([k,l])=>`<button class="tab ${tab===k?"active":""}" data-tt="${k}">${l}</button>`).join("")}
    </div>
    ${list.length? `<div class="stack">${list.map(b=>tripCard(b)).join("")}</div>`
    : `<div class="empty-state">${I.calendar}<b>Nothing ${tab} yet</b>Your reservations will appear here — from instant bookings to host-approved requests.<br><br><a class="btn btn-gold" href="#/stays">Browse residences</a></div>`}
    ${S.waitlist.length?`<div class="panel" style="margin-top:26px"><h3 style="font-size:18px">${I.clock} Waitlists</h3>
      ${S.waitlist.map(id=>{const p=PROPERTIES.find(x=>x.id===id); return `<div class="krow"><span class="k">${esc(p.name)} · ${p.soldOut||"dates"} </span><span class="v"><span class="pill-status gold">Watching for openings</span></span></div>`;}).join("")}
    </div>`:""}
  </div></div>`;
}
function tripCard(b){
  const p=PROPERTIES.find(x=>x.id===b.prop);
  const st={confirmed:["ok","Confirmed"],pending:["warn","Awaiting host"],active:["info","In progress"],completed:["ok","Completed"],cancelled:["bad","Cancelled"]}[b.status]||["info",b.status];
  return `<div class="panel" style="padding:0;overflow:hidden">
    <div style="display:flex;flex-wrap:wrap;gap:18px;padding:18px;align-items:center">
      <img src="data:image/jpeg;base64,${ASSETS[b.img]}" style="width:150px;height:104px;object-fit:cover;border-radius:12px" alt="">
      <div style="flex:1;min-width:220px">
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="pill-status ${st[0]}">${st[1]}</span><span class="small">${b.ref}</span></div>
        <b style="font-family:var(--fs-serif);font-size:21px;display:block;margin:6px 0 2px">${esc(b.name)}</b>
        <div class="small">${b.in} → ${b.out} · ${b.nights} nights · ${b.guests} guests · ${PAY_METHODS.find(x=>x.id===b.method)?.name||"card"}</div>
        <div class="small" style="color:var(--accent);margin-top:4px">${fmt(b.total)} total ${b.split?"· split 50/50":""} · +${Math.floor(b.total/1000)*(S.tier==="gold"?12:S.tier==="platinum"?15:S.tier==="silver"?8:5)} pts</div>
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
function tripCheckin(ref){ const b=S.bookings.find(x=>x.ref===ref);
  b.status="active"; dump(); render(); renderBadges();
  openModal(`<div style="text-align:center;padding:12px 0"><div class="why-ico" style="margin:0 auto 16px;width:60px;height:60px;border-radius:18px">${I.key}</div>
    <h2>You're checked in 🎉</h2><p class="muted" style="margin:8px 0 2px">Welcome to ${esc(b.name)}. The host has been notified and the escrow payment is now released.</p>
    <div class="small" style="margin-bottom:16px">If anything isn't right, report it from your stay dashboard within 24h.</div>
    <div class="btnrow" style="justify-content:center"><button class="btn btn-green" onclick="closeModal()">Enjoy your stay</button><button class="btn btn-ghost" data-goto="/messages?to=team-onyx">Message host</button></div></div>`);
}
function tripCheckout(ref){ const b=S.bookings.find(x=>x.ref===ref); b.status="completed"; dump(); render(); renderBadges();
  toast("Check-out confirmed — thank you! Please leave a review ✨","star"); }
function openModify(ref){ const b=S.bookings.find(x=>x.ref===ref);
  openModal(`<h2 style="margin-bottom:4px">Modify reservation</h2><p class="small" style="margin-bottom:16px">Change dates, guest count, or add add-ons. ${b.ref}</p>
    <div class="frm-grid"><div class="frm-row"><label>New check-in</label><input class="inp" type="date" id="mIn" value="${b.in}"></div>
    <div class="frm-row"><label>New check-out</label><input class="inp" type="date" id="mOut" value="${b.out}"></div></div>
    <div class="frm-row"><label>Guests</label><input class="inp" type="number" id="mG" value="${b.guests}" min="1" max="8"></div>
    <div class="panel" style="background:var(--gold-soft)"><div class="small">Any rate difference is applied instantly; the host is notified of the change. Extended stays re-qualify for weekly/monthly discounts automatically.</div></div>
    <div class="btnrow" style="margin-top:16px"><button class="btn btn-gold" onclick="submitModify('${b.ref}')">Request modification</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
}
function submitModify(ref){ const b=S.bookings.find(x=>x.ref===ref);
  b.in=$("#mIn").value; b.out=$("#mOut").value; b.guests=+$("#mG").value; b.nights=nightsBetween(b.in,b.out)||b.nights;
  dump(); closeModal(); render(); toast(`Modification requested for ${b.ref} — host will confirm shortly`,"calendar"); }
function openCancel(ref){ const b=S.bookings.find(x=>x.ref===ref);
  const refunds={flexible:1,moderate:0.5,strict:0.5};
  const rf=refunds[b.policy];
  openModal(`<h2 style="margin-bottom:4px">Cancel this reservation?</h2><p class="muted" style="font-size:14.5px;margin-bottom:14px">${b.ref} · ${esc(b.name)}</p>
    <div class="panel" style="margin-bottom:14px">
      <div class="krow"><span class="k">Cancellation policy</span><span class="v">${b.policy[0].toUpperCase()+b.policy.slice(1)}</span></div>
      <div class="krow"><span class="k">Total paid</span><span class="v">${fmt(b.total)}</span></div>
      <div class="krow"><span class="k">Estimated refund</span><span class="v" style="color:var(--ok)">${fmt(Math.round(b.total*rf))}</span></div>
      <div class="krow"><span class="k">Refund method</span><span class="v">Original payment · 3–5 days</span></div>
    </div>
    <div class="btnrow"><button class="btn btn-ghost" onclick="closeModal()">Keep booking</button><button class="btn btn-ghost" style="border-color:var(--bad);color:var(--bad)" onclick="doCancel('${b.ref}')">Cancel reservation</button></div>`);
}
function doCancel(ref){ const b=S.bookings.find(x=>x.ref===ref); b.status="cancelled"; dump(); closeModal(); render(); toast("Cancellation confirmed — refund on its way","clock"); }
function openReview(ref){ const b=S.bookings.find(x=>x.ref===ref);
  openModal(`<h2 style="margin-bottom:4px">Rate your stay</h2><p class="small" style="margin-bottom:14px">${esc(b.name)} · ${b.in} → ${b.out}</p>
    ${["cleanliness","accuracy","communication","location","checkin","value"].map(k=>`
      <div class="krow"><span class="k" style="text-transform:capitalize">${k}</span><span class="v" id="rv-${k}"><button onclick="rvSet('${k}',1)">★</button><button onclick="rvSet('${k}',2)">★</button><button onclick="rvSet('${k}',3)">★</button><button onclick="rvSet('${k}',4)">★</button><button onclick="rvSet('${k}',5)">★</button></span></div>`).join("")}
    <div class="frm-row" style="margin-top:12px"><label>Your review</label><textarea class="txa" id="rvTxt" placeholder="What should future guests know?"></textarea></div>
    <div class="btnrow"><button class="btn btn-gold" onclick="submitReview('${b.ref}')">Publish review</button><button class="btn btn-ghost" onclick="closeModal()">Cancel</button></div>`);
  window.rvSet=(k,v)=>{ const el=$("#rv-"+k); el.innerHTML=""; for(let i=1;i<=5;i++){ const b=document.createElement("button"); b.textContent="★"; b.style.color=i<=v?"var(--accent)":"var(--line)"; b.onclick=()=>window.rvSet(k,i); el.appendChild(b);} };
}
function submitReview(ref){ const b=S.bookings.find(x=>x.ref===ref);
  closeModal(); toast("Thank you! Your review is live — guests will love it ✨","star"); S.points+=2000; dump(); }

/* ---------------- WISHLIST ---------------- */
function pWishlist(){
  const lists=Object.keys(S.wishlists);
  const active=S.activeWishlist||"default";
  const items=S.wishlists[active]||[];
  return `${pageHead([["Home","#/"],["Wishlist"]],"<em class='serif-i'>My</em> wishlist","Save residences to named lists, get push alerts on price drops, and share plans with your travel crew.",
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
          <button class="btn btn-ghost btn-sm" onclick="toast('Wishlist link copied — ready to share','share')">${I.share} Share list</button>
        </div>
        ${items.length?`<div class="stays-grid">${items.map(id=>{const p=PROPERTIES.find(x=>x.id===id); return p?stayCard(p):"";}).join("")}</div>`
        :`<div class="empty-state">${I.heartFill}<b>Nothing saved here yet</b>Tap the ♥ on any residence to add it to ${active==="default"?"your wishlist":"this list"}.<br><br><a class="btn btn-gold" href="#/stays">Browse residences</a></div>`}
      </div>
    </div>
    <style>@media(max-width:860px){.wl-shell{grid-template-columns:1fr!important}}</style>
  </div></div>`;
}
function bindWishlist(){
  $$("[data-wl]").forEach(r=>r.addEventListener("click",()=>{
    if(r.dataset.wl==="+add"){
      const name=prompt("Name your list (e.g. “December Trip”, “Work Travel”):");
      if(name&&name.trim()){ S.wishlists[name.trim()]=[]; S.activeWishlist=name.trim(); dump(); render(); toast("List created ✨","gift"); }
      return;
    }
    S.activeWishlist=r.dataset.wl; dump(); render();
  }));
  const wlNew=$("#wlNew");
  if(wlNew) wlNew.addEventListener("click",()=>{ const name=prompt("Name your list:"); if(name&&name.trim()){ S.wishlists[name.trim()]=[]; S.activeWishlist=name.trim(); dump(); render(); toast("List created ✨","gift"); } });
}
function toggleWish(id,btn){
  const list=S.wishlists[S.activeWishlist]||(S.wishlists[S.activeWishlist]=[]);
  const i=list.indexOf(id);
  if(i>-1){ list.splice(i,1); toast("Removed from wishlist","heart"); }
  else { list.push(id); toast("Saved to your wishlist — alerts on","heart"); }
  if(btn){ btn.classList.toggle("active",i===-1); btn.innerHTML=i===-1?I.heartFill:I.heart; }
  persist();
  const grid=$("#staysGrid"); if(grid) grid.innerHTML=filteredStays?filteredStays().map(stayCard).join(""):"";
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
  return `${pageHead([["Home","#/"],["Compare"]],"Compare <em class='serif-i'>residences</em>","Side by side across price, rating, size and policies — up to three homes at once.",
    `<a class="btn btn-gold" href="#/stays">Add more residences</a>`)}
  <div class="page-body"><div class="wrap">
    ${items.length? `
    <div class="tbl-wrap"><table class="tbl" style="min-width:700px">
      <thead><tr><th style="width:150px"></th>${items.map(p=>`<th><div style="border-radius:14px;overflow:hidden;aspect-ratio:4/3;margin-bottom:10px"><img src="data:image/jpeg;base64,${ASSETS[p.img]}" style="width:100%;height:100%;object-fit:cover" alt=""></div>
        <div style="font-family:var(--fs-serif);font-size:19px;cursor:pointer" data-goto="/stay/${p.id}">${esc(p.name)}</div>
        <button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="toggleCompare('${p.id}')">Remove</button></th>`).join("")}</tr></thead>
      <tbody>${rows.map(([l,f])=>`<tr><th>${l}</th>${items.map(p=>`<td>${f(p)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>
    <div class="ai-callout" style="margin-top:20px">${I.spark}<span><b>AI verdict:</b> ${items.length>1?`${items[0].id!==items[1].id?`<b>${items[0].name}</b> scores highest on rating, while <b>${items[1].name}</b> offers ${Math.round((1-items[1].price/items[0].price)*100)}% more value per night.`:"these are the same residence"}`:""}</span></div>`
    : `<div class="empty-state">${I.scale}<b>Nothing to compare yet</b>Pick up to three residences using the “Compare” button on any card.<br><br><a class="btn btn-gold" href="#/stays">Browse residences</a></div>`}
  </div></div>`;
}
function toggleCompare(id){
  const i=S.compare.indexOf(id);
  if(i>-1)S.compare.splice(i,1);
  else{ if(S.compare.length>=3){ toast("You can compare up to 3 residences","scale"); return; } S.compare.push(id); }
  persist(); render(); renderBadges();
}


/* ===== pages-comm.js ===== */
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


/* ===== pages-host.js ===== */
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


/* ===== pages-misc.js ===== */
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


/* ===== app.js ===== */
/* ============================================================
   JOLLOF LIVING — app.js  (multi-page boot & per-page dispatch)
   Each page is a REAL .html file; this file reads <body data-page>
   and renders that page's view + wires the shared chrome.
   Load order: data.js → ui.js → pages-discovery.js →
   pages-booking.js → pages-comm.js → pages-host.js →
   pages-misc.js → app.js
   ============================================================ */

/* ---------------- per-page dispatch ---------------- */
const PAGE_RENDER = {
  index:            () => ({ html: pHome(), bind: bindHome }),
  stays:            () => ({ html: pStays(qps()), bind: bindStays }),
  map:              () => ({ html: pStays(qps()), bind: bindStays }),
  collections:      () => ({ html: pCollections(), bind: bindCollections }),
  experiences:      () => ({ html: pExperiences(), bind: bindExperiences }),
  reviews:          () => ({ html: pReviews() }),
  blog:             () => ({ html: pBlog() }),
  blog_post:        (p) => ({ html: pBlogPost(p) }),
  help:             () => ({ html: pHelp(qps()), bind: bindHelp }),
  membership:       () => ({ html: pMembership() }),
  giftcards:        () => ({ html: pGiftCards() }),
  referral:         () => ({ html: pReferral() }),
  business:         () => ({ html: pBusiness() }),
  about:            () => ({ html: pAbout() }),
  app:              () => ({ html: pApp() }),
  future:           () => ({ html: pFuture() }),
  concierge:        () => ({ html: pConcierge(qps()), bind: bindConcierge }),
  messages:         () => ({ html: pMessages(qps()), bind: bindMessages }),
  notifications:    () => ({ html: pNotif() }),
  trips:            () => ({ html: pTrips(qps()), bind: bindTrips }),
  wishlist:         () => ({ html: pWishlist(), bind: bindWishlist }),
  compare:          () => ({ html: pCompare() }),
  account:          () => ({ html: pAccount(), bind: bindAccount }),
  auth:             () => ({ html: pAuth(qp("mode") || "signin") }),
  host:             () => ({ html: pHost() }),
  host_onboarding:  () => ({ html: pHostOnboarding(), bind: bindHostOnboarding }),
  host_dashboard:   () => ({ html: pHostDashboard(qps()), bind: bindHostDashboard }),
  payments:         () => ({ html: pPayments(qps()), bind: bindPayments }),
  admin:            () => ({ html: pAdmin(qps()), bind: bindAdminLogin }),
  admin_login:      () => ({ html: pAdminLogin(), bind: bindAdminLogin }),
  confirm:          () => ({ html: pConfirm(qp("ref") || "") }),
  notfound:         () => ({ html: p404() }),
  /* dynamic pages keyed by the id carried in <body data-page="stay-onyx"> */
  stay:             (p) => ({ html: pStay(p), bind: () => bindStay(p) }),
  booking:          (p) => ({ html: pBooking(p, qps()), bind: () => bindBooking(p, qps()) }),
  neighborhood:     (p) => ({ html: pNeighborhood(p) || p404() }),
  blog_post:        (p) => ({ html: pBlogPost(p) }),
};

function pageKey() {
  const id = PAGE_ID;                       // e.g. "stay-onyx" | "blog-jollof-100" | "host-dashboard"
  if (id.startsWith("stay-")) return ["stay", id.slice(5)];
  if (id.startsWith("booking-")) return ["booking", id.slice(8)];
  if (id.startsWith("neighborhood-")) return ["neighborhood", id.slice(13)];
  if (id.startsWith("blog-")) return ["blog_post", id.slice(5)];
  return [id.replace(/-/g, "_"), null];    // host-dashboard → host_dashboard
}

function render() {
  const [key, param] = pageKey();
  const entry = PAGE_RENDER[key] || PAGE_RENDER.notfound;
  let out;
  try { out = entry(param); } catch (err) { console.error(err); out = { html: p404() }; }
  const view = $("#view"); if (!view) return;
  view.innerHTML = out.html || p404();
  observeReveals();
  if (out.bind) { try { out.bind(); } catch (err) { console.error("[bind]", err); } }
  renderBadges();
  window.scrollTo(0, 0);
}

/* ---------------- theme ---------------- */
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  store.set("theme", t);
  const pick = (d, l) => (t === "dark" ? ASSETS[d] : ASSETS[l]);
  const wm = $("#brandImg"), dw = $("#drawerLogo"), fl = $("#footLogo");
  if (wm && ASSETS["wordmark-dark"]) wm.src = "data:image/png;base64," + pick("wordmark-dark", "wordmark-light");
  if (dw && ASSETS["wordmark-dark"]) dw.src = "data:image/png;base64," + pick("wordmark-dark", "wordmark-light");
  if (fl && ASSETS["logo-dark"]) fl.src = "data:image/png;base64," + pick("logo-dark", "logo-light");
}
$("#themeBtn").addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  toast(next === "dark" ? "Dark mode — good evening ✦" : "Light mode — good morning ☀", next === "dark" ? "moon" : "sun");
});

/* ---------------- header ---------------- */
addEventListener("scroll", () => { $("#header").classList.toggle("scrolled", scrollY > 30); }, { passive: true });

/* ---------------- active nav state ---------------- */
(function () {
  const id = PAGE_ID;
  const section =
    id === "index" ? "/" :
    id.startsWith("stay") || id.startsWith("booking") || id === "stays" || id === "map" || id === "collections" ? "/stays" :
    id === "experiences" ? "/experiences" :
    id.startsWith("neighborhood") ? "/neighborhoods" :
    id.startsWith("host") ? "/host" :
    id === "membership" ? "/membership" :
    id === "help" ? "/help" : null;
  if (!section) return;
  $$("#navLinks a").forEach(a => a.classList.toggle("active", a.getAttribute("data-r") === section));
})();

/* ---------------- drawer ---------------- */
function openDrawer() { $("#drawer").classList.add("open"); document.body.style.overflow = "hidden"; }
function closeDrawer() { const d = $("#drawer"); if (d) d.classList.remove("open"); document.body.style.overflow = ""; }
$("#burgerBtn").addEventListener("click", openDrawer);
$("#drawer").addEventListener("click", (e) => { if (e.target.closest("a")) closeDrawer(); });

/* drawer content: real page links */
(function () {
  const links = [["/", "Home"], ["/stays", "Stays"], ["/experiences", "Experiences"],
    ["/neighborhoods", "Neighbourhoods"], ["/concierge", "AI Concierge"],
    ["/trips", "My trips"], ["/wishlist", "Wishlist"], ["/host", "Host"],
    ["/membership", "Jollof Club"], ["/reviews", "Reviews"], ["/blog", "Journal"], ["/help", "Help"]];
  const dl = $("#drawerLinks");
  if (dl) dl.innerHTML = links.map(([h, l]) => `<a href="${URL(h)}">${l}</a>`).join("");
  const dc = $("#drawerCtas");
  if (dc) dc.innerHTML =
    `<a class="btn btn-gold" href="${URL("/host/onboarding")}">List your home</a>
     <a class="btn btn-ghost" href="${URL("/auth")}">Sign in / Join</a>
     <a class="btn btn-ghost" href="${URL("/account")}">My account</a>`;
})();

/* ---------------- quick actions (real page links) ---------------- */
$("#notifBtn").addEventListener("click", () => nav("/notifications"));
$("#msgBtn").addEventListener("click", () => nav("/messages"));
$("#wlBtn").addEventListener("click", () => nav("/wishlist"));
$("#chatFab").addEventListener("click", () => nav("/concierge"));

/* ---------------- currency ---------------- */
const curSel = $("#currencySel");
curSel.value = currency;
curSel.addEventListener("change", () => {
  currency = curSel.value; store.set("currency", currency);
  render();
  toast("Prices shown in " + currency, "exchange");
});

/* ---------------- newsletter ---------------- */
$("#newsBtn").addEventListener("click", () => {
  const em = $("#newsInput").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { toast("Please enter a valid email", "x"); return; }
  $("#newsInput").value = "";
  toast("Welcome to the inner circle — check your inbox ✨", "check");
});

/* ---------------- scrims & escape ---------------- */
$$(".modal-root .scrim, .sheet .scrim").forEach((s) => s.addEventListener("click", () => { closeModal(); closeSheet(); closeDrawer(); }));
addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeSheet(); closeDrawer(); } });

/* ---------------- reveal on scroll (visual only — never scrolls the page) ---------------- */
let io = null;
function observeReveals() {
  if (!io) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
  $$(".reveal, .stagger").forEach((el) => io.observe(el));
}

/* ---------------- boot ---------------- */
$("#yearNow").textContent = new Date().getFullYear();
applyTheme(store.get("theme", (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"));
render();
