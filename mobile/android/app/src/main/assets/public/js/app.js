var ks=Object.defineProperty;var H=(t,e,s)=>()=>{if(s)throw s[0];try{return t&&(e=t(t=0)),e}catch(n){throw s=[n],n}};var ee=(t,e)=>{for(var s in e)ks(t,s,{get:e[s],enumerable:!0})};var Ss,Ps,ot,nn,an,te,oe,Ls,Es,As,fe,L,on,P,it,at,Ie,rn,Cs,Os,Ts,Ms,_e,ln,C=H(()=>{Ss=t=>{let e=new Map;e.set("web",{name:"web"});let s=t.CapacitorPlatforms||{currentPlatform:{name:"web"},platforms:e},n=(i,o)=>{s.platforms.set(i,o)},a=i=>{s.platforms.has(i)&&(s.currentPlatform=s.platforms.get(i))};return s.addPlatform=n,s.setPlatform=a,s},Ps=t=>t.CapacitorPlatforms=Ss(t),ot=Ps(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),nn=ot.addPlatform,an=ot.setPlatform;(function(t){t.Unimplemented="UNIMPLEMENTED",t.Unavailable="UNAVAILABLE"})(te||(te={}));oe=class extends Error{constructor(e,s,n){super(e),this.message=e,this.code=s,this.data=n}},Ls=t=>{var e,s;return t?.androidBridge?"android":!((s=(e=t?.webkit)===null||e===void 0?void 0:e.messageHandlers)===null||s===void 0)&&s.bridge?"ios":"web"},Es=t=>{var e,s,n,a,i;let o=t.CapacitorCustomPlatform||null,c=t.Capacitor||{},p=c.Plugins=c.Plugins||{},u=t.CapacitorPlatforms,M=()=>o!==null?o.name:Ls(t),A=((e=u?.currentPlatform)===null||e===void 0?void 0:e.getPlatform)||M,je=()=>A()!=="web",us=((s=u?.currentPlatform)===null||s===void 0?void 0:s.isNativePlatform)||je,gs=b=>{let y=Ne.get(b);return!!(y?.platforms.has(A())||tt(b))},hs=((n=u?.currentPlatform)===null||n===void 0?void 0:n.isPluginAvailable)||gs,ms=b=>{var y;return(y=c.PluginHeaders)===null||y===void 0?void 0:y.find(X=>X.name===b)},tt=((a=u?.currentPlatform)===null||a===void 0?void 0:a.getPluginHeader)||ms,fs=b=>t.console.error(b),vs=(b,y,X)=>Promise.reject(`${X} does not have an implementation of "${y}".`),Ne=new Map,bs=(b,y={})=>{let X=Ne.get(b);if(X)return console.warn(`Capacitor plugin "${b}" already registered. Cannot register plugins twice.`),X.proxy;let J=A(),Z=tt(b),_,ws=async()=>(!_&&J in y?_=typeof y[J]=="function"?_=await y[J]():_=y[J]:o!==null&&!_&&"web"in y&&(_=typeof y.web=="function"?_=await y.web():_=y.web),_),xs=($,S)=>{var j,D;if(Z){let W=Z?.methods.find(O=>S===O.name);if(W)return W.rtype==="promise"?O=>c.nativePromise(b,S.toString(),O):(O,he)=>c.nativeCallback(b,S.toString(),O,he);if($)return(j=$[S])===null||j===void 0?void 0:j.bind($)}else{if($)return(D=$[S])===null||D===void 0?void 0:D.bind($);throw new oe(`"${b}" plugin is not implemented on ${J}`,te.Unimplemented)}},qe=$=>{let S,j=(...D)=>{let W=ws().then(O=>{let he=xs(O,$);if(he){let me=he(...D);return S=me?.remove,me}else throw new oe(`"${b}.${$}()" is not implemented on ${J}`,te.Unimplemented)});return $==="addListener"&&(W.remove=async()=>S()),W};return j.toString=()=>`${$.toString()}() { [capacitor code] }`,Object.defineProperty(j,"name",{value:$,writable:!1,configurable:!1}),j},st=qe("addListener"),nt=qe("removeListener"),$s=($,S)=>{let j=st({eventName:$},S),D=async()=>{let O=await j;nt({eventName:$,callbackId:O},S)},W=new Promise(O=>j.then(()=>O({remove:D})));return W.remove=async()=>{console.warn("Using addListener() without 'await' is deprecated."),await D()},W},Be=new Proxy({},{get($,S){switch(S){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return Z?$s:st;case"removeListener":return nt;default:return qe(S)}}});return p[b]=Be,Ne.set(b,{name:b,proxy:Be,platforms:new Set([...Object.keys(y),...Z?[J]:[]])}),Be},ys=((i=u?.currentPlatform)===null||i===void 0?void 0:i.registerPlugin)||bs;return c.convertFileSrc||(c.convertFileSrc=b=>b),c.getPlatform=A,c.handleError=fs,c.isNativePlatform=us,c.isPluginAvailable=hs,c.pluginMethodNoop=vs,c.registerPlugin=ys,c.Exception=oe,c.DEBUG=!!c.DEBUG,c.isLoggingEnabled=!!c.isLoggingEnabled,c.platform=c.getPlatform(),c.isNative=c.isNativePlatform(),c},As=t=>t.Capacitor=Es(t),fe=As(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),L=fe.registerPlugin,on=fe.Plugins,P=class{constructor(e){this.listeners={},this.retainedEventArguments={},this.windowListeners={},e&&(console.warn(`Capacitor WebPlugin "${e.name}" config object was deprecated in v3 and will be removed in v4.`),this.config=e)}addListener(e,s){let n=!1;this.listeners[e]||(this.listeners[e]=[],n=!0),this.listeners[e].push(s);let i=this.windowListeners[e];i&&!i.registered&&this.addWindowListener(i),n&&this.sendRetainedArgumentsForEvent(e);let o=async()=>this.removeListener(e,s);return Promise.resolve({remove:o})}async removeAllListeners(){this.listeners={};for(let e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,s,n){let a=this.listeners[e];if(!a){if(n){let i=this.retainedEventArguments[e];i||(i=[]),i.push(s),this.retainedEventArguments[e]=i}return}a.forEach(i=>i(s))}hasListeners(e){return!!this.listeners[e].length}registerWindowListener(e,s){this.windowListeners[s]={registered:!1,windowEventName:e,pluginEventName:s,handler:n=>{this.notifyListeners(s,n)}}}unimplemented(e="not implemented"){return new fe.Exception(e,te.Unimplemented)}unavailable(e="not available"){return new fe.Exception(e,te.Unavailable)}async removeListener(e,s){let n=this.listeners[e];if(!n)return;let a=n.indexOf(s);this.listeners[e].splice(a,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){let s=this.retainedEventArguments[e];s&&(delete this.retainedEventArguments[e],s.forEach(n=>{this.notifyListeners(e,n)}))}},it=t=>encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),at=t=>t.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent),Ie=class extends P{async getCookies(){let e=document.cookie,s={};return e.split(";").forEach(n=>{if(n.length<=0)return;let[a,i]=n.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");a=at(a).trim(),i=at(i).trim(),s[a]=i}),s}async setCookie(e){try{let s=it(e.key),n=it(e.value),a=`; expires=${(e.expires||"").replace("expires=","")}`,i=(e.path||"/").replace("path=",""),o=e.url!=null&&e.url.length>0?`domain=${e.url}`:"";document.cookie=`${s}=${n||""}${a}; path=${i}; ${o};`}catch(s){return Promise.reject(s)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(s){return Promise.reject(s)}}async clearCookies(){try{let e=document.cookie.split(";")||[];for(let s of e)document.cookie=s.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}},rn=L("CapacitorCookies",{web:()=>new Ie}),Cs=async t=>new Promise((e,s)=>{let n=new FileReader;n.onload=()=>{let a=n.result;e(a.indexOf(",")>=0?a.split(",")[1]:a)},n.onerror=a=>s(a),n.readAsDataURL(t)}),Os=(t={})=>{let e=Object.keys(t);return Object.keys(t).map(a=>a.toLocaleLowerCase()).reduce((a,i,o)=>(a[i]=t[e[o]],a),{})},Ts=(t,e=!0)=>t?Object.entries(t).reduce((n,a)=>{let[i,o]=a,c,p;return Array.isArray(o)?(p="",o.forEach(u=>{c=e?encodeURIComponent(u):u,p+=`${i}=${c}&`}),p.slice(0,-1)):(c=e?encodeURIComponent(o):o,p=`${i}=${c}`),`${n}&${p}`},"").substr(1):null,Ms=(t,e={})=>{let s=Object.assign({method:t.method||"GET",headers:t.headers},e),a=Os(t.headers)["content-type"]||"";if(typeof t.data=="string")s.body=t.data;else if(a.includes("application/x-www-form-urlencoded")){let i=new URLSearchParams;for(let[o,c]of Object.entries(t.data||{}))i.set(o,c);s.body=i.toString()}else if(a.includes("multipart/form-data")||t.data instanceof FormData){let i=new FormData;if(t.data instanceof FormData)t.data.forEach((c,p)=>{i.append(p,c)});else for(let c of Object.keys(t.data))i.append(c,t.data[c]);s.body=i;let o=new Headers(s.headers);o.delete("content-type"),s.headers=o}else(a.includes("application/json")||typeof t.data=="object")&&(s.body=JSON.stringify(t.data));return s},_e=class extends P{async request(e){let s=Ms(e,e.webFetchExtra),n=Ts(e.params,e.shouldEncodeUrlParams),a=n?`${e.url}?${n}`:e.url,i=await fetch(a,s),o=i.headers.get("content-type")||"",{responseType:c="text"}=i.ok?e:{};o.includes("application/json")&&(c="json");let p,u;switch(c){case"arraybuffer":case"blob":u=await i.blob(),p=await Cs(u);break;case"json":p=await i.json();break;default:p=await i.text()}let M={};return i.headers.forEach((A,je)=>{M[je]=A}),{data:p,headers:M,status:i.status,url:i.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:"GET"}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:"POST"}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:"PUT"}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:"PATCH"}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:"DELETE"}))}},ln=L("CapacitorHttp",{web:()=>new _e})});var rt={};ee(rt,{AppWeb:()=>ze});var ze,lt=H(()=>{C();ze=class extends P{constructor(){super(),this.handleVisibilityChange=()=>{let e={isActive:document.hidden!==!0};this.notifyListeners("appStateChange",e),document.hidden?this.notifyListeners("pause",null):this.notifyListeners("resume",null)},document.addEventListener("visibilitychange",this.handleVisibilityChange,!1)}exitApp(){throw this.unimplemented("Not implemented on web.")}async getInfo(){throw this.unimplemented("Not implemented on web.")}async getLaunchUrl(){return{url:""}}async getState(){return{isActive:document.hidden!==!0}}async minimizeApp(){throw this.unimplemented("Not implemented on web.")}}});var ct={};ee(ct,{SplashScreenWeb:()=>Ge});var Ge,dt=H(()=>{C();Ge=class extends P{async show(e){}async hide(e){}}});var ut={};ee(ut,{PreferencesWeb:()=>We});var We,gt=H(()=>{C();We=class extends P{constructor(){super(...arguments),this.group="CapacitorStorage"}async configure({group:e}){typeof e=="string"&&(this.group=e)}async get(e){return{value:this.impl.getItem(this.applyPrefix(e.key))}}async set(e){this.impl.setItem(this.applyPrefix(e.key),e.value)}async remove(e){this.impl.removeItem(this.applyPrefix(e.key))}async keys(){return{keys:this.rawKeys().map(s=>s.substring(this.prefix.length))}}async clear(){for(let e of this.rawKeys())this.impl.removeItem(e)}async migrate(){var e;let s=[],n=[],a="_cap_",i=Object.keys(this.impl).filter(o=>o.indexOf(a)===0);for(let o of i){let c=o.substring(a.length),p=(e=this.impl.getItem(o))!==null&&e!==void 0?e:"",{value:u}=await this.get({key:c});typeof u=="string"?n.push(c):(await this.set({key:c,value:p}),s.push(c))}return{migrated:s,existing:n}}async removeOld(){let e="_cap_",s=Object.keys(this.impl).filter(n=>n.indexOf(e)===0);for(let n of s)this.impl.removeItem(n)}get impl(){return window.localStorage}get prefix(){return this.group==="NativeStorage"?"":`${this.group}.`}rawKeys(){return Object.keys(this.impl).filter(e=>e.indexOf(this.prefix)===0)}applyPrefix(e){return this.prefix+e}}});var mt={};ee(mt,{Network:()=>js,NetworkWeb:()=>we});function ht(){let t=window.navigator.connection||window.navigator.mozConnection||window.navigator.webkitConnection,e="unknown",s=t?t.type||t.effectiveType:null;if(s&&typeof s=="string")switch(s){case"bluetooth":case"cellular":e="cellular";break;case"none":e="none";break;case"ethernet":case"wifi":case"wimax":e="wifi";break;case"other":case"unknown":e="unknown";break;case"slow-2g":case"2g":case"3g":e="cellular";break;case"4g":e="wifi";break;default:break}return e}var we,js,ft=H(()=>{C();we=class extends P{constructor(){super(),this.handleOnline=()=>{let s={connected:!0,connectionType:ht()};this.notifyListeners("networkStatusChange",s)},this.handleOffline=()=>{let e={connected:!1,connectionType:"none"};this.notifyListeners("networkStatusChange",e)},typeof window<"u"&&(window.addEventListener("online",this.handleOnline),window.addEventListener("offline",this.handleOffline))}async getStatus(){if(!window.navigator)throw this.unavailable("Browser does not support the Network Information API");let e=window.navigator.onLine,s=ht();return{connected:e,connectionType:e?s:"none"}}},js=new we});var U,ie,Je=H(()=>{(function(t){t.Heavy="HEAVY",t.Medium="MEDIUM",t.Light="LIGHT"})(U||(U={}));(function(t){t.Success="SUCCESS",t.Warning="WARNING",t.Error="ERROR"})(ie||(ie={}))});var jt={};ee(jt,{HapticsWeb:()=>Ke});var Ke,Nt=H(()=>{C();Je();Ke=class extends P{constructor(){super(...arguments),this.selectionStarted=!1}async impact(e){let s=this.patternForImpact(e?.style);this.vibrateWithPattern(s)}async notification(e){let s=this.patternForNotification(e?.type);this.vibrateWithPattern(s)}async vibrate(e){let s=e?.duration||300;this.vibrateWithPattern([s])}async selectionStart(){this.selectionStarted=!0}async selectionChanged(){this.selectionStarted&&this.vibrateWithPattern([70])}async selectionEnd(){this.selectionStarted=!1}patternForImpact(e=U.Heavy){return e===U.Medium?[43]:e===U.Light?[20]:[61]}patternForNotification(e=ie.Success){return e===ie.Warning?[30,40,30,50,60]:e===ie.Error?[27,45,50]:[35,65,21]}vibrateWithPattern(e){if(navigator.vibrate)navigator.vibrate(e);else throw this.unavailable("Browser does not support the vibrate API")}}});var Qe={};ee(Qe,{SHEETS:()=>Bt,mountAll:()=>Y,mountSprite:()=>_t,spriteTag:()=>B,unmountAll:()=>le});function _t(t,e,s={}){let n=Bt[e];if(!t||!n)return null;let a=new Ye(t,n,s);return It.add(a),a.play(),a}function Y(t=document){let e=[];return t.querySelectorAll("[data-sprite]").forEach(s=>{if(s.__sprite)return;let n=_t(s,s.dataset.sprite,{loop:s.dataset.spriteLoop==="false"?!1:void 0,fps:s.dataset.spriteFps?Number(s.dataset.spriteFps):void 0});n&&(s.__sprite=n,e.push(n))}),e}function le(t=document){t.querySelectorAll("[data-sprite]").forEach(e=>{e.__sprite&&(e.__sprite.destroy(),It.delete(e.__sprite),e.__sprite=null)})}function B(t,e="",s=""){return`<div class="sprite-holder ${e}"><div data-sprite="${t}" ${s}></div></div>`}var Bt,Ye,It,V=H(()=>{"use strict";Bt={skyline:{src:"sprites/skyline.png",frames:24,w:360,h:360,fps:14,loop:!0},keys:{src:"sprites/keys.png",frames:20,w:360,h:360,fps:16,loop:!0},concierge:{src:"sprites/concierge.png",frames:22,w:360,h:360,fps:14,loop:!0},compass:{src:"sprites/compass.png",frames:24,w:360,h:360,fps:15,loop:!0},heart:{src:"sprites/heart.png",frames:18,w:240,h:240,fps:18,loop:!1},success:{src:"sprites/success.png",frames:22,w:260,h:260,fps:20,loop:!1},empty:{src:"sprites/empty.png",frames:20,w:240,h:240,fps:12,loop:!0},loading:{src:"sprites/loading.png",frames:16,w:160,h:160,fps:20,loop:!0},offline:{src:"sprites/offline.png",frames:18,w:240,h:240,fps:12,loop:!0}},Ye=class{constructor(e,s,n={}){this.el=e,this.sheet=s,this.frame=0,this.raf=null,this.last=0,this.loop=n.loop??s.loop,this.fps=n.fps||s.fps,this.onEnd=n.onEnd,this.visible=!0,e.classList.add("sprite"),e.style.setProperty("--sprite-w",s.w+"px"),e.style.setProperty("--sprite-h",s.h+"px"),e.style.width=s.w+"px",e.style.height=s.h+"px",e.style.backgroundImage=`url("${s.src}")`,e.style.backgroundSize=`${s.w*s.frames}px ${s.h}px`,e.style.backgroundRepeat="no-repeat",e.style.backgroundPosition="0 0","IntersectionObserver"in window&&(this.io=new IntersectionObserver(a=>{for(let i of a)this.visible=i.isIntersecting,this.visible&&!this.raf&&this.play(),this.visible||this.pause()},{threshold:.05}),this.io.observe(e))}step(e){this.last||(this.last=e);let s=1e3/this.fps;if(e-this.last>=s){if(this.last=e,this.frame++,this.frame>=this.sheet.frames)if(this.loop)this.frame=0;else{this.frame=this.sheet.frames-1,this.paint(),this.raf=null,this.onEnd&&this.onEnd();return}this.paint()}this.raf=requestAnimationFrame(n=>this.step(n))}paint(){this.el.style.backgroundPosition=`-${this.frame*this.sheet.w}px 0`}play(){return this.raf?this:(this.last=0,this.raf=requestAnimationFrame(e=>this.step(e)),this)}pause(){return this.raf&&cancelAnimationFrame(this.raf),this.raf=null,this}restart(){return this.frame=0,this.paint(),this.play()}destroy(){this.pause(),this.io&&this.io.disconnect()}},It=new Set});C();var ve=L("App",{web:()=>Promise.resolve().then(()=>(lt(),rt)).then(t=>new t.AppWeb)});C();var Re=L("SplashScreen",{web:()=>Promise.resolve().then(()=>(dt(),ct)).then(t=>new t.SplashScreenWeb)});C();var be;(function(t){t.Dark="DARK",t.Light="LIGHT",t.Default="DEFAULT"})(be||(be={}));var pt;(function(t){t.None="NONE",t.Slide="SLIDE",t.Fade="FADE"})(pt||(pt={}));var De=L("StatusBar");C();var ye=L("Preferences",{web:()=>Promise.resolve().then(()=>(gt(),ut)).then(t=>new t.PreferencesWeb)});C();var He=L("Network",{web:()=>Promise.resolve().then(()=>(ft(),mt)).then(t=>new t.NetworkWeb)});var vt="https://kxq.lop.temporary.site/jollof/api/mobile/",Ns="http://192.168.1.100:8080/api/mobile/",N={apiBase:vt,devApiBase:Ns,appVersion:"1.0.0",device:"Android",timeoutMs:15e3,refreshAfterMs:3e5,imageBase:vt.replace(/api\/mobile\/?$/,"assets/img/")};var g={token:"jl_token",user:"jl_user",catalogue:"jl_catalogue",version:"jl_version",me:"jl_me",owner:"jl_owner",queue:"jl_queue",seen:"jl_onboarded",syncedAt:"jl_synced_at"},r={token:null,user:null,catalogue:{properties:[],collections:[],neighborhoods:[],experiences:[],blog:[],tiers:[],rates:{},fx:{},addons:{},promos:{},payMethods:[],reviews:[],areas:[],propertyTypes:[]},me:null,owner:null,queue:[],online:!0,syncing:!1,syncedAt:null,version:null,onboarded:!1},Fe=new Set,bt=t=>(Fe.add(t),()=>Fe.delete(t)),G=()=>Fe.forEach(t=>{try{t()}catch(e){console.warn(e)}});async function z(t,e=null){try{let{value:s}=await ye.get({key:t});return s==null?e:JSON.parse(s)}catch{return e}}async function E(t,e){try{await ye.set({key:t,value:JSON.stringify(e)})}catch(s){console.warn("persist failed",s)}}async function xe(t){try{await ye.remove({key:t})}catch{}}async function yt(){let[t,e,s,n,a,i,o,c,p]=await Promise.all([z(g.token),z(g.user),z(g.catalogue),z(g.me),z(g.owner),z(g.queue,[]),z(g.seen,!1),z(g.version),z(g.syncedAt)]);r.token=t,r.user=e,s&&(r.catalogue=s),r.me=n,r.owner=a,r.queue=i||[],r.onboarded=!!o,r.version=c,r.syncedAt=p;let u=await He.getStatus().catch(()=>({connected:!0}));r.online=!!u.connected,He.addListener("networkStatusChange",M=>{let A=r.online;r.online=!!M.connected,G(),!A&&r.online&&Et()}),G()}var T=()=>!!r.token,se=()=>!!(r.user&&r.user.isHost);async function wt(){r.onboarded=!0,await E(g.seen,!0)}function qs(t,e){let s=new URL(N.apiBase.replace(/\/?$/,"/")+t);return Object.entries(e||{}).forEach(([n,a])=>{a!=null&&a!==""&&s.searchParams.set(n,a)}),s.toString()}async function K(t,{method:e="GET",body:s,params:n,clientKey:a,timeout:i=N.timeoutMs}={}){let o={Accept:"application/json"};s&&(o["Content-Type"]="application/json"),r.token&&(o.Authorization=`Bearer ${r.token}`),a&&(o["X-Client-Key"]=a),o["X-App-Version"]=N.appVersion;let c=new AbortController,p=setTimeout(()=>c.abort(),i);try{let u=await fetch(qs(t,n),{method:e,headers:o,signal:c.signal,body:s?JSON.stringify(s):void 0}),M=await u.text(),A;try{A=JSON.parse(M)}catch{throw new Error("The server sent something we could not read.")}return u.status===401&&A.requiresAuth?(await Pt(),{ok:!1,requiresAuth:!0,message:A.message||"Please sign in again."}):A}finally{clearTimeout(p)}}async function xt({name:t,email:e,password:s,phone:n,accountType:a}){let i=await K("auth.php",{method:"POST",body:{action:"register",name:t,email:e,password:s,phone:n,account_type:a,device:N.device}});return i.ok&&i.data?.token&&await St(i.data),i}async function $t({email:t,password:e}){let s=await K("auth.php",{method:"POST",body:{action:"login",email:t,password:e,device:N.device}});return s.ok&&s.data?.token&&await St(s.data),s}async function kt(){let t=await K("auth.php",{method:"POST",body:{action:"upgrade"}});return t.ok&&t.data?.user&&(r.user=t.data.user,await E(g.user,r.user),await F({force:!0})),t}async function St(t){r.token=t.token,r.user=t.user,await Promise.all([E(g.token,r.token),E(g.user,r.user)]),G(),await F({force:!0})}async function Pt(){r.token=null,r.user=null,r.me=null,r.owner=null,await Promise.all([xe(g.token),xe(g.user),xe(g.me),xe(g.owner)]),G()}async function Lt(){try{await K("auth.php",{method:"POST",body:{action:"logout"}})}catch{}await Pt()}async function F({force:t=!1,scope:e="all"}={}){if(r.syncing)return{ok:!0,skipped:!0};if(!r.online)return{ok:!1,offline:!0};r.syncing=!0,G();try{await Et();let s=await K("sync.php",{params:{scope:e,version:t?"":r.version||""}});if(!s.ok)return s;let n=s.data||{};return n.catalogue?(r.catalogue=n.catalogue,r.version=n.version,await Promise.all([E(g.catalogue,r.catalogue),E(g.version,r.version)])):n.version&&(r.version=n.version,await E(g.version,r.version)),n.me&&(r.me=n.me,await E(g.me,r.me)),n.me?.user&&(r.user=n.me.user,await E(g.user,r.user)),n.owner&&(r.owner=n.owner,await E(g.owner,r.owner)),r.syncedAt=Date.now(),await E(g.syncedAt,r.syncedAt),s}catch{return{ok:!1,message:navigator.onLine?"We could not reach Jollof Living.":"You are offline."}}finally{r.syncing=!1,G()}}var Bs=()=>`${Date.now()}-${Math.random().toString(36).slice(2,10)}`;async function q(t,{optimistic:e}={}){let s=Bs();if(e&&e(),!r.online)return r.queue.push({clientKey:s,payload:t,at:Date.now()}),await E(g.queue,r.queue),G(),{ok:!0,queued:!0,message:"Saved \u2014 we will send this when you are back online."};try{let n=await K("action.php",{method:"POST",body:t,clientKey:s});return n.ok&&await F({scope:"me"}),n}catch{return r.queue.push({clientKey:s,payload:t,at:Date.now()}),await E(g.queue,r.queue),G(),{ok:!0,queued:!0,message:"Saved \u2014 we will send this when the connection returns."}}}async function Et(){if(!r.online||!r.queue.length)return;let t=[...r.queue],e=[];for(let s of t)try{let n=await K("action.php",{method:"POST",body:s.payload,clientKey:s.clientKey});!n.ok&&!n.replayed&&console.warn("queued action refused:",n.message)}catch{e.push(s)}r.queue=e,await E(g.queue,r.queue),G()}var $e=()=>r.catalogue.properties||[],re=t=>$e().find(e=>e.id===t||e.slug===t)||null,ne=()=>{let t=r.me?.wishlists||{},e=r.me?.activeWishlist||"default";return t[e]||t.default||[]},Ue=t=>ne().includes(t),At=()=>r.me?.bookings||[],Ct=()=>r.me?.notifications||[],Ve=()=>r.me?.unreadNotifs||0,Ot=()=>r.me?.points??r.user?.points??0,Tt=()=>r.me?.tier||r.user?.tier||"bronze",Mt=()=>r.owner||null;function w(t){return"\u20A6"+Math.round(Number(t)||0).toLocaleString("en-NG")}function ke(t){let e=Number(t)||0;return e>=1e6?"\u20A6"+(e/1e6).toFixed(1)+"m":e>=1e3?"\u20A6"+Math.round(e/1e3)+"k":"\u20A6"+e}C();Je();var qt=L("Haptics",{web:()=>Promise.resolve().then(()=>(Nt(),jt)).then(t=>new t.HapticsWeb)});V();var d=(t,e=document)=>e.querySelector(t),h=(t,e=document)=>[...e.querySelectorAll(t)],l=t=>String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Is={back:'<path d="M15 5l-7 7 7 7"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',heart:'<path d="M12 20.5S3.5 15 3.5 9.1A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.5c0 5.9-8.5 11.4-8.5 11.4z"/>',home:'<path d="M4 11l8-6 8 6"/><path d="M6 10v9h12v-9"/>',compass:'<circle cx="12" cy="12" r="8.5"/><path d="M15 9l-2 5-4 1 2-5z"/>',trips:'<rect x="3.5" y="6" width="17" height="14" rx="2.5"/><path d="M8 4v4M16 4v4M3.5 11h17"/>',user:'<circle cx="12" cy="8.5" r="3.7"/><path d="M5 20a7 7 0 0 1 14 0"/>',bell:'<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/>',star:'<path d="M12 3.6l2.5 5 5.6.8-4 4 .9 5.6-5-2.6-5 2.6.9-5.6-4-4 5.6-.8z"/>',pin:'<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',bed:'<path d="M3 18v-7h18v7"/><path d="M3 11V7M7 11V9h5v2"/>',bath:'<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M7 12V6a2 2 0 0 1 4 0"/>',users:'<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 7.5a3 3 0 0 1 0 5.6M17.5 19a5 5 0 0 0-2-4"/>',plus:'<path d="M12 5v14M5 12h14"/>',chart:'<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',wallet:'<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M16 12.5h3"/>',logout:'<path d="M15 17l5-5-5-5"/><path d="M20 12H9"/><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6"/>',check:'<path d="M4 12.5l5 5L20 7"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',send:'<path d="M4 12l16-7-7 16-2-6z"/>',building:'<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6"/>',refresh:'<path d="M20 11a8 8 0 1 0-1.5 5.5"/><path d="M20 5v6h-6"/>',chevron:'<path d="M9 5l7 7-7 7"/>'},m=(t,e="",s=14)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" class="ico ico-${t} ${e}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">${Is[t]||""}</svg>`,Pe=(t=26,e="")=>`<img class="brand-mark ${e}" src="img/wordmark-dark.png" alt="Jollof Living" style="height:${t}px;width:auto;margin:0 auto">`,Gt=(t=96,e="")=>`<img class="brand-mark ${e}" src="img/logo-dark.png" alt="Jollof Living" style="height:${t}px;width:auto;margin:0 auto">`;function ce(t){return t?/^(https?:|data:)/.test(t)?t:/\.(jpe?g|png|webp|avif|gif)$/i.test(t)?N.imageBase+t:N.imageBase+t+".jpg":N.imageBase+"p1.jpg"}var zt;function f(t,e=""){let s=d("#toast");s&&(s.textContent=t,s.className="on "+e,clearTimeout(zt),zt=setTimeout(()=>{s.className=""},2900))}async function k(t=U.Light){try{await qt.impact({style:t})}catch{}}function x(t,e,s,n=""){return`<div class="state fade-in">
    ${B(t,"sprite-md")}
    <h3>${l(e)}</h3>
    <p>${l(s)}</p>
    ${n}
  </div>`}function Le(t=3){return`<div class="stack">${Array.from({length:t},()=>`<div class="card"><div class="skel" style="aspect-ratio:4/3"></div>
     <div style="padding:12px"><div class="skel" style="height:15px;width:64%"></div>
     <div class="skel" style="height:12px;width:40%;margin-top:8px"></div></div></div>`).join("")}</div>`}var R=t=>{if(!t)return"";let e=new Date(t);return isNaN(e)?String(t):e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})};V();var Ee=null,I=[{name:"home",params:{}}],Rt=()=>I[I.length-1],Dt=()=>I.length;function Wt(t){Ee=t}var _s=new Set(["home","explore","wishlist","trips","account","owner"]);function v(t,e={}){_s.has(t)?(I.length=0,I.push({name:t,params:e})):I.push({name:t,params:e}),Ee?.()}function Xe(){return I.length>1?(I.pop(),Ee?.(),!0):!1}function Ht(t="home"){I.length=0,I.push({name:t,params:{}}),Ee?.()}V();function et(t){let e=Ue(t.id);return`<article class="stay" data-open="${l(t.id)}">
    <div class="ph">
      <img loading="lazy" src="${ce(t.img)}" alt="${l(t.name)}">
      ${t.badge?`<span class="tag">${l(t.badge)}</span>`:""}
      <button class="heart ${e?"on":""}" data-wish="${l(t.id)}" aria-label="Save">${m("heart")}</button>
    </div>
    <div class="body">
      <h3>${l(t.name)}</h3>
      <div class="meta">${m("pin","")} ${l(t.area)}, ${l(t.city)}
        <span style="margin-left:auto;color:var(--gold)">\u2605 ${Number(t.rating||0).toFixed(2)}</span></div>
      <div class="price"><b>${w(t.price)}</b> <span class="small">/ night</span></div>
    </div>
  </article>`}function Gs(t){return`<div class="card stay-row" data-open="${l(t.id)}">
    <img loading="lazy" src="${ce(t.img)}" alt="">
    <div style="flex:1;min-width:0">
      <h3 style="font-size:15.5px">${l(t.name)}</h3>
      <div class="small">${l(t.area)} \xB7 \u2605 ${Number(t.rating||0).toFixed(2)}</div>
      <div style="margin-top:5px"><b style="color:var(--gold)">${w(t.price)}</b> <span class="small">/ night</span></div>
    </div>
  </div>`}function Ft(){let t=$e();if(!t.length)return r.syncing?`<div class="screen">${Le(3)}</div>`:`<div class="screen">${x("offline","Nothing to show yet","We could not reach Jollof Living. Pull down to try again once you have signal.",'<button class="btn btn-gold" data-act="sync">Try again</button>')}</div>`;let e=t.filter(i=>i.featured).slice(0,6),s=e.length?e:t.slice(0,6),n=t.filter(i=>i.isNew).slice(0,6),a=r.user?r.user.name.split(" ")[0]:null;return`<div class="screen flush fade-in">
    <div style="padding:4px 16px 0">
      <p class="small" style="letter-spacing:.14em;text-transform:uppercase">${a?`Welcome back, ${l(a)}`:"Luxury living, African soul"}</p>
      <h1 style="font-size:29px;margin:6px 0 2px">Find your <em class="serif-i">next stay</em></h1>
    </div>

    <div style="padding:14px 16px 2px">
      <button class="btn btn-ghost btn-block" data-go="search" style="justify-content:flex-start;gap:10px">
        ${m("search")} <span class="muted">Search Lagos, Abuja, anywhere\u2026</span>
      </button>
    </div>

    <div class="sec-head" style="padding:0 16px"><h2>Featured</h2><a data-go="explore">See all</a></div>
    <div class="hscroll">${s.map(et).join("")}</div>

    ${n.length?`
      <div class="sec-head" style="padding:0 16px"><h2>Just added</h2></div>
      <div class="hscroll">${n.map(et).join("")}</div>`:""}

    ${(r.catalogue.collections||[]).length?`
      <div class="sec-head" style="padding:0 16px"><h2>Collections</h2></div>
      <div class="hscroll">
        ${r.catalogue.collections.slice(0,6).map(i=>`
          <div class="card" data-collection="${l(i.id||i.slug)}" style="padding:15px">
            <h3 style="font-size:17px">${l(i.name||i.title)}</h3>
            <p class="small" style="margin:6px 0 0">${l(i.blurb||i.description||"")}</p>
          </div>`).join("")}
      </div>`:""}

    <div style="padding:26px 16px 0">
      <div class="panel" style="text-align:center">
        ${B("concierge","sprite-sm")}
        <h3 style="font-size:18px;margin-top:6px">Concierge on call</h3>
        <p class="small" style="margin:6px 0 12px">Chefs, drivers, airport pickup \u2014 arranged before you land.</p>
        <button class="btn btn-ghost" data-go="messages">Message the team</button>
      </div>
    </div>
  </div>`}var de={q:"",area:"",type:"",max:0};function pe(){let t=$e(),e=de;if(e.q){let n=e.q.toLowerCase();t=t.filter(a=>[a.name,a.area,a.city,a.ptype].some(i=>String(i||"").toLowerCase().includes(n)))}e.area&&(t=t.filter(n=>n.area===e.area)),e.type&&(t=t.filter(n=>n.ptype===e.type)),e.max&&(t=t.filter(n=>Number(n.price)<=e.max));let s=r.catalogue.areas||[];return`<div class="screen flush fade-in">
    <div style="padding:0 16px 12px">
      <input class="inp" id="q" placeholder="Search homes, areas\u2026" value="${l(e.q)}" inputmode="search">
    </div>
    <div class="chips">
      <button class="chip ${e.area?"":"on"}" data-area="">All areas</button>
      ${s.map(n=>`<button class="chip ${e.area===n?"on":""}" data-area="${l(n)}">${l(n)}</button>`).join("")}
    </div>
    <div style="padding:14px 16px 0" class="small">${t.length} home${t.length===1?"":"s"}</div>
    <div style="padding:10px 16px 0" class="stack">
      ${t.length?t.map(et).join(""):x("empty","Nothing matches yet","Try a wider search \u2014 clear the filters and start again.",'<button class="btn btn-ghost" data-act="clear-filters">Clear filters</button>')}
    </div>
  </div>`}function Ae(t){let e=d("#q",t);e&&e.addEventListener("input",()=>{de.q=e.value;let s=t.scrollTop;Ze(t,pe());let n=d("#q",t);n&&(n.value=de.q,n.focus(),n.setSelectionRange(n.value.length,n.value.length)),t.scrollTop=s}),h("[data-area]",t).forEach(s=>s.addEventListener("click",()=>{de.area=s.dataset.area,k(),Ze(t,pe()),Ae(t)})),h('[data-act="clear-filters"]',t).forEach(s=>s.addEventListener("click",()=>{de={q:"",area:"",type:"",max:0},Ze(t,pe()),Ae(t)}))}function Ze(t,e){t.innerHTML=e,Promise.resolve().then(()=>(V(),Qe)).then(s=>s.mountAll(t))}function Ut(t){let e=re(t.slug);if(!e)return`<div class="screen">${x("empty","Home not found","This residence is no longer listed.")}</div>`;let s=Ue(e.id),n=(r.catalogue.reviews||[]).filter(a=>a.property===e.id||a.propertySlug===e.id).slice(0,3);return`<div class="screen flush fade-in">
    <div class="stay hero-ph" style="position:relative;border-radius:0;border:0;box-shadow:none">
      <img src="${ce(e.img)}" alt="${l(e.name)}" style="width:100%;aspect-ratio:4/3;object-fit:cover">
      <button class="heart ${s?"on":""}" data-wish="${l(e.id)}" aria-label="Save">
        ${m("heart")}
      </button>
    </div>

    <div style="padding:16px">
      <h1 style="font-size:25px">${l(e.name)}</h1>
      <div class="row small" style="margin-top:6px">
        ${m("pin")} ${l(e.area)}, ${l(e.city)}
        <span style="color:var(--gold);margin-left:auto">\u2605 ${Number(e.rating||0).toFixed(2)} \xB7 ${e.reviews||0} reviews</span>
      </div>

      <div class="row" style="gap:14px;margin:14px 0;flex-wrap:wrap">
        <span class="badge">${m("bed")} ${e.beds} beds</span>
        <span class="badge">${m("bath")} ${e.baths} baths</span>
        <span class="badge">${m("users")} ${e.guests} guests</span>
        ${e.instant?'<span class="badge ok">Instant book</span>':'<span class="badge warn">Request to book</span>'}
      </div>

      <p class="muted" style="font-size:14.5px">${l(e.description||"")}</p>

      ${(e.amenities||[]).length?`
        <h3 style="font-size:18px;margin:20px 0 10px">What's here</h3>
        <div class="row" style="flex-wrap:wrap;gap:8px">
          ${e.amenities.slice(0,10).map(a=>`<span class="badge">${l(a.label||a)}</span>`).join("")}
        </div>`:""}

      ${n.length?`
        <h3 style="font-size:18px;margin:22px 0 10px">Guest reviews</h3>
        <div class="stack">
          ${n.map(a=>`<div class="panel">
            <div class="spread"><b style="font-size:14px">${l(a.author)}</b>
              <span style="color:var(--gold);font-size:13px">\u2605 ${Number(a.rating||5).toFixed(1)}</span></div>
            <p class="small" style="margin:7px 0 0;color:var(--ink-soft)">${l(a.body)}</p>
          </div>`).join("")}
        </div>`:""}
    </div>

    <div style="position:sticky;bottom:calc(var(--tabbar-h) + var(--safe-bottom));background:rgba(11,15,12,.95);
                backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:13px 16px;display:flex;
                align-items:center;gap:14px">
      <div><b style="color:var(--gold);font-size:19px">${w(e.price)}</b><div class="small">per night</div></div>
      <button class="btn btn-gold" style="flex:1" data-book="${l(e.id)}">
        ${e.instant?"Book now":"Request to book"}
      </button>
    </div>
  </div>`}function Vt(t){let e=re(t.slug);if(!e)return`<div class="screen">${x("empty","Home not found","This residence is no longer listed.")}</div>`;let s=new Date,n=new Date(s.getTime()+14*864e5).toISOString().slice(0,10),a=new Date(s.getTime()+18*864e5).toISOString().slice(0,10);return`<div class="screen fade-in">
    <div class="card stay-row" style="margin-bottom:16px">
      <img src="${ce(e.img)}" alt="">
      <div><h3 style="font-size:15.5px">${l(e.name)}</h3>
        <div class="small">${l(e.area)} \xB7 ${w(e.price)} / night</div></div>
    </div>

    <label class="field"><span>Check in</span><input class="inp" type="date" id="bIn" value="${n}"></label>
    <label class="field"><span>Check out</span><input class="inp" type="date" id="bOut" value="${a}"></label>
    <label class="field"><span>Guests</span>
      <select class="inp" id="bGuests">
        ${Array.from({length:Math.max(1,e.guests)},(i,o)=>`<option value="${o+1}" ${o===1?"selected":""}>${o+1} guest${o?"s":""}</option>`).join("")}
      </select></label>

    <div class="panel" id="quoteBox" style="margin:6px 0 16px">
      <div class="small">Working out your total\u2026</div>
    </div>

    <button class="btn btn-gold btn-block" id="bGo" data-prop="${l(e.id)}">
      ${e.instant?"Confirm reservation":"Send booking request"}
    </button>
    <p class="small" style="text-align:center;margin-top:10px">
      Priced by the same engine as the website \u2014 no surprises at checkout.</p>
  </div>`}function Jt(t,e){let s=re(e.slug);if(!s)return;let n=d("#quoteBox",t);async function a(){let i=d("#bIn",t).value,o=d("#bOut",t).value;if(!i||!o)return;n.innerHTML='<div class="small">Working out your total\u2026</div>';let c=await q({do:"quote",property:s.id,checkin:i,checkout:o,guests:Number(d("#bGuests",t).value)});if(!c.ok){n.innerHTML=`<div class="small" style="color:var(--bad)">${l(c.message||"Could not price these dates.")}</div>`;return}let p=c.data;n.innerHTML=`
      <div class="krow"><span class="k">${w(p.nightly)} \xD7 ${p.nights} nights</span><span class="v">${w(p.base)}</span></div>
      ${p.lengthDiscount?`<div class="krow"><span class="k">Length discount</span><span class="v" style="color:var(--ok)">\u2212${w(p.lengthDiscount)}</span></div>`:""}
      ${p.cleaning?`<div class="krow"><span class="k">Cleaning</span><span class="v">${w(p.cleaning)}</span></div>`:""}
      <div class="krow"><span class="k">Service fee</span><span class="v">${w(p.service)}</span></div>
      <div class="krow"><span class="k">VAT</span><span class="v">${w(p.vat)}</span></div>
      <div class="krow" style="border-top:1px solid var(--line);margin-top:4px;padding-top:10px">
        <span class="k"><b style="color:var(--ink)">Total</b></span><span class="v" style="color:var(--gold);font-size:16px">${w(p.total)}</span></div>`}["bIn","bOut","bGuests"].forEach(i=>d("#"+i,t)?.addEventListener("change",a)),a(),d("#bGo",t)?.addEventListener("click",async i=>{let o=i.currentTarget;if(!T()){v("auth",{mode:"signin",next:"booking",slug:s.id});return}o.disabled=!0,o.textContent="Sending\u2026",k();let c=await q({do:"booking-create",property:s.id,checkin:d("#bIn",t).value,checkout:d("#bOut",t).value,guests:Number(d("#bGuests",t).value),name:r.user?.name,email:r.user?.email,phone:r.user?.phone,request:!s.instant});if(o.disabled=!1,o.textContent=s.instant?"Confirm reservation":"Send booking request",c.queued){f(c.message,"good"),v("trips");return}if(!c.ok){f(c.message||"We could not complete that.","bad");return}v("confirmed",{ref:c.data.ref,total:c.data.total})})}function Kt(t){return`<div class="screen fade-in">
    <div class="state" style="padding-top:44px">
      ${B("success","",'data-sprite-loop="false"')}
      <h3 style="font-size:24px">Booking confirmed</h3>
      <p>Reference <b style="color:var(--gold)">${l(t.ref||"")}</b>${t.total?` \xB7 ${w(t.total)}`:""}</p>
      <p class="small">A confirmation is in your notifications, and the home's host has been told.</p>
      <div class="stack" style="width:100%;max-width:320px;margin-top:8px">
        <button class="btn btn-gold btn-block" data-go="trips">See my trips</button>
        <button class="btn btn-ghost btn-block" data-go="home">Back to browsing</button>
      </div>
    </div>
  </div>`}function Yt(){if(!T())return ue("Save the homes you love","Sign in to keep a wishlist across your phone and the website.");let e=ne().map(s=>re(s)).filter(Boolean);return e.length?`<div class="screen fade-in"><div class="stack">${e.map(Gs).join("")}</div></div>`:`<div class="screen">${x("heart","No saved homes yet","Tap the heart on any residence and it will appear here \u2014 on your phone and on the website.",'<button class="btn btn-gold" data-go="explore">Browse homes</button>')}</div>`}function Qt(){if(!T())return ue("Your trips live here","Sign in to see reservations you made here or on the website.");let t=At();if(!t.length)return`<div class="screen">${x("empty","No trips yet","When you book a residence it appears here, with your check-in code and receipt.",'<button class="btn btn-gold" data-go="explore">Find a stay</button>')}</div>`;let e=Date.now(),s=t.filter(i=>new Date(i.out).getTime()>=e&&i.status!=="cancelled"),n=t.filter(i=>new Date(i.out).getTime()<e||i.status==="cancelled"),a=i=>`<div class="card" style="padding:13px">
    <div class="spread">
      <b style="font-size:15px">${l(i.name)}</b>
      <span class="pill ${l(i.status)}">${l(i.status)}</span>
    </div>
    <div class="small" style="margin-top:5px">${R(i.in)} \u2192 ${R(i.out)} \xB7 ${i.nights} night${i.nights===1?"":"s"}</div>
    <div class="spread" style="margin-top:9px">
      <span class="small">Ref ${l(i.ref)}</span>
      <b style="color:var(--gold)">${w(i.total)}</b>
    </div>
    ${i.code?`<div class="small" style="margin-top:6px">Check-in code <b style="color:var(--ink)">${l(i.code)}</b></div>`:""}
  </div>`;return`<div class="screen fade-in">
    ${s.length?`<div class="sec-head" style="margin-top:2px"><h2>Upcoming</h2></div>
      <div class="stack">${s.map(a).join("")}</div>`:""}
    ${n.length?`<div class="sec-head"><h2>Past</h2></div>
      <div class="stack">${n.map(a).join("")}</div>`:""}
  </div>`}function Xt(){if(!T())return ue("Your account","Sign in to see your points, tier and trips.");let t=r.user,e=Tt(),s=Ot();return`<div class="screen fade-in">
    <div class="panel" style="text-align:center">
      <div style="width:66px;height:66px;border-radius:50%;background:var(--gold);color:#231a05;
                  display:grid;place-items:center;font-size:26px;font-weight:700;margin:0 auto 10px;
                  font-family:var(--fs-serif)">${l((t.name||"?")[0].toUpperCase())}</div>
      <h2 style="font-size:21px">${l(t.name)}</h2>
      <p class="small">${l(t.email)}</p>
      <div class="row" style="justify-content:center;gap:8px;margin-top:10px">
        <span class="badge ok">${l(e)} member</span>
        <span class="badge">${s.toLocaleString("en-NG")} points</span>
        ${t.isHost?'<span class="badge">Property owner</span>':""}
      </div>
    </div>

    <div class="stack" style="margin-top:16px">
      ${t.isHost?`<button class="btn btn-gold btn-block" data-go="owner">${m("chart")} Owner dashboard</button>`:`<button class="btn btn-ghost btn-block" data-act="become-owner">${m("building")} Become a host</button>`}
      <button class="btn btn-ghost btn-block" data-go="notifications">${m("bell")} Notifications</button>
      <button class="btn btn-ghost btn-block" data-go="messages">${m("send")} Messages</button>
      <button class="btn btn-ghost btn-block" data-act="sync">${m("refresh")} Sync now</button>
      <button class="btn btn-ghost btn-block" data-act="signout" style="color:var(--bad)">${m("logout")} Log out</button>
    </div>

    <p class="small" style="text-align:center;margin-top:18px">
      ${r.syncedAt?`Last synced ${new Date(r.syncedAt).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}`:"Not synced yet"}
      ${r.queue.length?` \xB7 ${r.queue.length} change${r.queue.length===1?"":"s"} waiting to send`:""}
    </p>
  </div>`}function Zt(){if(!T())return ue("Notifications","Sign in to see updates about your trips.");let t=Ct();return t.length?`<div class="screen fade-in">
    <div class="stack">
      ${t.map(e=>`<div class="card" style="padding:13px">
        <div class="spread"><b style="font-size:14.5px">${l(e.title)}</b>
          ${e.unread?'<span class="badge warn">new</span>':""}</div>
        <p class="small" style="margin:5px 0 0">${l(e.body)}</p>
        <div class="small" style="margin-top:6px;opacity:.7">${l(e.time||e.created_at||"")}</div>
      </div>`).join("")}
    </div>
    <button class="btn btn-ghost btn-block" data-act="read-all" style="margin-top:14px">Mark all as read</button>
  </div>`:`<div class="screen">${x("empty","Nothing new","Booking updates and offers will appear here.")}</div>`}function es(){if(!T())return ue("Messages","Sign in to talk to hosts and the concierge team.");let t=r.me?.conversations||[];return t.length?`<div class="screen fade-in"><div class="stack">
    ${t.map(e=>`<div class="card" style="padding:13px">
      <div class="spread"><b style="font-size:15px">${l(e.name||e.title||"Conversation")}</b>
        ${e.unread?`<span class="badge warn">${e.unread}</span>`:""}</div>
      <p class="small" style="margin:5px 0 0">${l(e.preview||(e.messages||[]).slice(-1)[0]?.body||"")}</p>
    </div>`).join("")}
  </div></div>`:`<div class="screen">${x("concierge","No messages yet","Book a stay or ask the concierge anything \u2014 replies land here.")}</div>`}function ue(t,e){return`<div class="screen">${x("keys",t,e,`<div class="stack" style="width:100%;max-width:300px">
       <button class="btn btn-gold btn-block" data-go="auth" data-mode="signin">Sign in</button>
       <button class="btn btn-ghost btn-block" data-go="auth" data-mode="register">Create an account</button>
     </div>`)}</div>`}V();var ge=[{sprite:"skyline",title:"Luxury living,<br><em class='serif-i'>African soul</em>",body:"Penthouses over the lagoon, courtyard houses in Ikoyi, villas behind Banana Island's bridge."},{sprite:"compass",title:"Find your <em class='serif-i'>bearing</em>",body:"Search by neighbourhood, browse curated collections, and see exactly what a night costs before you commit."},{sprite:"keys",title:"Book with <em class='serif-i'>confidence</em>",body:"Payment held in escrow until check-in, verified homes, and a check-in code the moment you are confirmed."},{sprite:"concierge",title:"Concierge <em class='serif-i'>on call</em>",body:"Chefs, drivers, airport pickup and spa visits \u2014 arranged before you land."}];function ts(){return`<div class="onboard" id="onboard">
    <div class="ob-brand">${Pe(30)}</div>
    <div class="slides" id="slides">
      ${ge.map(t=>`<section class="slide">
        ${B(t.sprite)}
        <h2>${t.title}</h2>
        <p>${l(t.body)}</p>
      </section>`).join("")}
    </div>
    <div class="foot">
      <div class="dots" id="dots">${ge.map((t,e)=>`<i class="${e===0?"on":""}"></i>`).join("")}</div>
      <button class="btn btn-ghost" id="obSkip">Skip</button>
      <button class="btn btn-gold" id="obNext">Next</button>
    </div>
  </div>`}function ss(t,e){let s=d("#slides",t),n=h("#dots i",t),a=d("#obNext",t),i=d("#obSkip",t),o=0,c=()=>{o=Math.round(s.scrollLeft/s.clientWidth),n.forEach((u,M)=>u.classList.toggle("on",M===o)),a.textContent=o===ge.length-1?"Get started":"Next",i.style.visibility=o===ge.length-1?"hidden":"visible"};s.addEventListener("scroll",()=>{clearTimeout(s._t),s._t=setTimeout(c,70)}),a.addEventListener("click",async()=>{if(k(),o>=ge.length-1){await p();return}s.scrollTo({left:(o+1)*s.clientWidth,behavior:"smooth"})}),i.addEventListener("click",p);async function p(){await wt(),le(t),e()}c()}var ae="signin",Ce="customer";function Oe(t={}){t.mode!==void 0&&(ae=t.mode==="register"?"register":"signin");let e=ae==="register";return`<div class="screen fade-in">
    <div style="text-align:center;margin:6px 0 18px">
      ${Gt(104)}
      <div class="rule-gold" style="margin:16px auto 14px"></div>
      <h1 style="font-size:28px;margin-top:4px">${e?"Create your account":"Welcome back"}</h1>
      <p class="small">${e?"Trips, wishlists and points \u2014 synced with the website.":"Sign in to pick up where you left off."}</p>
    </div>

    ${e?`
      <div class="grid-2" style="margin-bottom:16px">
        <button class="chip ${Ce==="customer"?"on":""}" data-type="customer"
                style="width:100%;justify-content:center;padding:14px 10px;border-radius:14px;text-align:center">
          <div><div style="font-size:14px;font-weight:600">I'm travelling</div>
          <div class="small" style="margin-top:2px">Book stays</div></div>
        </button>
        <button class="chip ${Ce==="owner"?"on":""}" data-type="owner"
                style="width:100%;justify-content:center;padding:14px 10px;border-radius:14px;text-align:center">
          <div><div style="font-size:14px;font-weight:600">I have a home</div>
          <div class="small" style="margin-top:2px">List and host</div></div>
        </button>
      </div>
      <label class="field"><span>Full name</span><input class="inp" id="aName" autocomplete="name"></label>
    `:""}

    <label class="field"><span>Email</span>
      <input class="inp" id="aEmail" type="email" inputmode="email" autocomplete="email" autocapitalize="off"></label>
    ${e?`<label class="field"><span>Phone (optional)</span>
      <input class="inp" id="aPhone" type="tel" inputmode="tel" autocomplete="tel"></label>`:""}
    <label class="field"><span>Password</span>
      <input class="inp" id="aPass" type="password" autocomplete="${e?"new-password":"current-password"}"></label>

    <button class="btn btn-gold btn-block" id="aGo" style="margin-top:6px">
      ${e?"Create account":"Sign in"}</button>

    <p class="small" style="text-align:center;margin-top:16px">
      ${e?"Already with us?":"New to Jollof Living?"}
      <a style="color:var(--gold)" data-switch="${e?"signin":"register"}">
        ${e?"Sign in":"Create an account"}</a>
    </p>
  </div>`}function Te(t,e={}){h("[data-type]",t).forEach(s=>s.addEventListener("click",()=>{Ce=s.dataset.type,k(),t.innerHTML=Oe(),Te(t,e),Y(t)})),h("[data-switch]",t).forEach(s=>s.addEventListener("click",()=>{ae=s.dataset.switch,t.innerHTML=Oe(),Te(t,e),Y(t)})),d("#aGo",t)?.addEventListener("click",async s=>{let n=s.currentTarget,a=d("#aEmail",t).value.trim(),i=d("#aPass",t).value;if(!a||!i){f("Please enter your email and password.","bad");return}n.disabled=!0,n.textContent=ae==="register"?"Creating\u2026":"Signing in\u2026";let o=ae==="register"?await xt({name:d("#aName",t).value.trim(),email:a,password:i,phone:d("#aPhone",t)?.value.trim()||"",accountType:Ce}):await $t({email:a,password:i});if(n.disabled=!1,n.textContent=ae==="register"?"Create account":"Sign in",!o.ok){f(o.message||"That did not work.","bad");return}k(),f(o.message||"Welcome \u2728","good"),e.next?v(e.next,e):se()?v("owner"):v("home")})}V();var Me="overview",Ws=t=>{Me=t},Hs=[["overview","Overview"],["listings","Listings"],["bookings","Bookings"],["calendar","Calendar"],["earnings","Earnings"],["payouts","Payouts"]];function is(){if(!T())return`<div class="screen">${x("keys","Owner dashboard","Sign in with your owner account to manage listings, bookings and payouts.",'<button class="btn btn-gold" data-go="auth" data-mode="signin">Sign in</button>')}</div>`;if(!se())return`<div class="screen">${x("building","Start hosting","Your account is not set up for hosting yet. Turn it on and keep every trip, wishlist and point you already have.",'<button class="btn btn-gold" data-act="become-owner">Become a host</button>')}</div>`;let t=Mt();if(!t)return`<div class="screen">${Le(2)}</div>`;let e={overview:ns,listings:Fs,bookings:Us,calendar:Vs,earnings:Js,payouts:Ks}[Me]||ns;return`<div class="screen flush fade-in">
    <div class="chips" style="padding-top:2px">
      ${Hs.map(([s,n])=>`<button class="chip ${Me===s?"on":""}" data-tab="${s}">${n}</button>`).join("")}
    </div>
    <div style="padding:16px">${e(t)}</div>
  </div>`}function ns(t){let e=t.stats||{};if(!(t.listings||[]).length)return x("building","No listings yet","Publish your first residence and your occupancy, earnings and bookings appear here.",'<button class="btn btn-gold" data-act="new-listing">Add a listing</button>');let s=[["Occupancy",(e.occupancy||0)+"%"],["Avg nightly",e.adr?ke(e.adr):"\u2014"],["RevPAR",e.revpar?ke(e.revpar):"\u2014"],["Rating",e.rating?String(e.rating):"\u2014"]],n=(t.earnings||[]).filter(o=>typeof o.v=="number"),a=Math.max(1,...n.map(o=>o.v)),i=(t.bookings||[]).filter(o=>["pending","confirmed"].includes(o.status)).slice(0,4);return`
    <div class="grid-2" style="gap:10px">
      ${s.map(o=>`<div class="kpi"><div class="lbl">${o[0]}</div><div class="val">${o[1]}</div></div>`).join("")}
    </div>

    ${n.length?`
      <div class="panel" style="margin-top:14px">
        <h3 style="font-size:17px;margin-bottom:12px">Earnings</h3>
        <div style="display:flex;align-items:flex-end;gap:5px;height:96px">
          ${n.map(o=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%">
            <div style="background:var(--gold);border-radius:3px 3px 0 0;height:${Math.max(3,o.v/a*100)}%"></div>
          </div>`).join("")}
        </div>
        <div class="row" style="justify-content:space-between;margin-top:7px">
          <span class="small">${l(n[0]?.l||"")}</span>
          <span class="small">${l(n[n.length-1]?.l||"")}</span>
        </div>
      </div>`:""}

    ${i.length?`
      <div class="sec-head"><h2 style="font-size:18px">Next arrivals</h2></div>
      <div class="stack">
        ${i.map(o=>`<div class="card" style="padding:12px">
          <div class="spread"><b style="font-size:14.5px">${l(o.guest||o.name||"Guest")}</b>
            <span class="pill ${l(o.status)}">${l(o.status)}</span></div>
          <div class="small" style="margin-top:4px">${l(o.property||o.listing||"")} \xB7 ${R(o.in||o.checkin)} \u2192 ${R(o.out||o.checkout)}</div>
          <div style="margin-top:6px;color:var(--gold);font-weight:600">${w(o.total||0)}</div>
        </div>`).join("")}
      </div>`:""}

    <button class="btn btn-gold btn-block" data-act="new-listing" style="margin-top:16px">
      ${m("plus")} Add a listing</button>`}function Fs(t){let e=t.listings||[];return e.length?`<div class="stack">
    ${e.map(s=>`<div class="card" style="padding:13px">
      <div class="spread">
        <b style="font-size:15px">${l(s.title||s.name)}</b>
        <span class="pill ${l(s.status)}">${l(s.status)}</span>
      </div>
      <div class="small" style="margin-top:4px">${l(s.area||"")} \xB7 ${s.photos||0} photos</div>
      <div class="spread" style="margin-top:10px">
        <b style="color:var(--gold)">${w(s.rate||s.price||0)} <span class="small">/ night</span></b>
        <div class="row" style="gap:7px">
          <button class="btn btn-ghost" style="padding:8px 13px;min-height:0;font-size:12.5px"
                  data-price="${l(s.id||s.slug)}" data-current="${s.rate||s.price||0}">Price</button>
          <button class="btn btn-ghost" style="padding:8px 13px;min-height:0;font-size:12.5px"
                  data-status="${l(s.id||s.slug)}" data-now="${l(s.status)}">
            ${s.status==="live"?"Pause":"Go live"}</button>
        </div>
      </div>
    </div>`).join("")}
    <button class="btn btn-gold btn-block" data-act="new-listing">${m("plus")} Add a listing</button>
  </div>`:x("building","No listings yet","Add your first residence \u2014 our team verifies it within 24 hours.",'<button class="btn btn-gold" data-act="new-listing">Add a listing</button>')}function Us(t){let e=t.bookings||[];return e.length?`<div class="stack">
    ${e.map(s=>`<div class="card" style="padding:13px">
      <div class="spread"><b style="font-size:14.5px">${l(s.guest||s.name||"Guest")}</b>
        <span class="pill ${l(s.status)}">${l(s.status)}</span></div>
      <div class="small" style="margin-top:4px">${l(s.property||"")} \xB7 ${R(s.in||s.checkin)} \u2192 ${R(s.out||s.checkout)}</div>
      <div class="spread" style="margin-top:8px">
        <span class="small">${l(s.ref||"")}</span>
        <b style="color:var(--gold)">${w(s.total||0)}</b>
      </div>
    </div>`).join("")}
  </div>`:x("empty","No bookings yet","Reservations for your homes will appear here.")}function Vs(t){let e=t.calendar||{},s=e.days||[];if(!s.length)return x("empty","No calendar yet","Add a listing to manage availability and nightly pricing.");let n=["M","T","W","T","F","S","S"],a=Number(e.firstDow||0);return`<div class="panel">
    <div class="spread" style="margin-bottom:12px">
      <b>${l(e.monthLabel||"")}</b>
      <span class="small">${l(e.property?.name||e.property?.title||"")}</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center">
      ${n.map(i=>`<div class="small" style="opacity:.6">${i}</div>`).join("")}
      ${Array.from({length:a},()=>"<div></div>").join("")}
      ${s.map(i=>{let o=i.status==="booked"||i.booked,c=i.status==="blocked";return`<div style="aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;
                     align-items:center;justify-content:center;font-size:12px;
                     background:${o?"var(--gold)":"var(--card-2)"};
                     color:${o?"#231a05":c?"var(--ink-faint)":"var(--ink)"};
                     ${c?"text-decoration:line-through;opacity:.55":""}">
          <span>${i.d||i.day||""}</span>
          ${i.price?`<span style="font-size:8.5px;opacity:.8">${Math.round(i.price/1e3)}k</span>`:""}
        </div>`}).join("")}
    </div>
    <div class="row" style="gap:14px;margin-top:12px;flex-wrap:wrap">
      <span class="small"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--gold);margin-right:5px"></i>Booked</span>
      <span class="small"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--card-2);margin-right:5px"></i>Available</span>
    </div>
  </div>`}function Js(t){let e=t.stats||{},s=(t.sources||[]).filter(a=>a.v>0),n=s.reduce((a,i)=>a+i.v,0)||1;return`
    <div class="grid-2" style="gap:10px">
      <div class="kpi"><div class="lbl">Gross earnings</div><div class="val">${ke(e.gross||e.earnings||0)}</div></div>
      <div class="kpi"><div class="lbl">Your take rate</div><div class="val">${Math.round((e.takeRate||.12)*100)}%</div></div>
    </div>
    ${s.length?`
      <div class="panel" style="margin-top:14px">
        <h3 style="font-size:17px;margin-bottom:12px">Where bookings come from</h3>
        ${s.map(a=>`
          <div style="margin-bottom:11px">
            <div class="spread" style="margin-bottom:5px">
              <span class="small">${l(a.l)}</span>
              <span class="small">${Math.round(a.v/n*100)}%</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${a.v/n*100}%"></div></div>
          </div>`).join("")}
      </div>`:""}
    ${(t.insights||[]).length?`
      <div class="panel" style="margin-top:14px">
        <h3 style="font-size:17px;margin-bottom:8px">Suggestions</h3>
        ${t.insights.slice(0,4).map(a=>`<div class="krow"><span class="k">${l(a.title||a.label||a)}</span>
          <span class="v small">${l(a.value||"")}</span></div>`).join("")}
      </div>`:""}`}function Ks(t){let e=t.payouts||[],s=t.payoutSettings||{};return`
    <div class="panel">
      <h3 style="font-size:17px;margin-bottom:8px">Payout account</h3>
      <div class="krow"><span class="k">Bank</span><span class="v">${l(s.bank||"Not set")}</span></div>
      <div class="krow"><span class="k">Account</span><span class="v">${l(s.account||s.account_number||"\u2014")}</span></div>
      <div class="krow"><span class="k">Schedule</span><span class="v">${l(s.schedule||"After check-in")}</span></div>
    </div>
    ${e.length?`
      <div class="sec-head"><h2 style="font-size:18px">History</h2></div>
      <div class="stack">
        ${e.map(n=>`<div class="card" style="padding:12px">
          <div class="spread"><b>${w(n.amount||0)}</b>
            <span class="pill ${l(n.status)}">${l(n.status)}</span></div>
          <div class="small" style="margin-top:4px">${l(n.reference||"")} \xB7 ${R(n.created_at||n.date)}</div>
        </div>`).join("")}
      </div>`:`<div style="margin-top:14px">${x("empty","No payouts yet","Once a guest checks in, your earnings are released and appear here.")}</div>`}`}function as(){return`<div class="screen fade-in">
    <div style="text-align:center;margin-bottom:16px">
      ${B("building"in{}?"building":"keys","sprite-sm")}
      <h1 style="font-size:24px">Add a listing</h1>
      <p class="small">Our team verifies every home within 24 hours.</p>
    </div>
    <label class="field"><span>Title</span><input class="inp" id="lTitle" placeholder="Ocean-view penthouse"></label>
    <div class="grid-2">
      <label class="field"><span>Area</span><input class="inp" id="lArea" placeholder="Ikoyi"></label>
      <label class="field"><span>City</span><input class="inp" id="lCity" value="Lagos"></label>
    </div>
    <label class="field"><span>Nightly rate (\u20A6)</span><input class="inp" id="lPrice" type="number" inputmode="numeric" placeholder="150000"></label>
    <div class="grid-2">
      <label class="field"><span>Bedrooms</span><input class="inp" id="lBeds" type="number" inputmode="numeric" value="1"></label>
      <label class="field"><span>Bathrooms</span><input class="inp" id="lBaths" type="number" inputmode="numeric" value="1"></label>
    </div>
    <label class="field"><span>Guests</span><input class="inp" id="lGuests" type="number" inputmode="numeric" value="2"></label>
    <label class="field"><span>Description</span><textarea class="inp" id="lDesc" rows="4"
      placeholder="What makes this home special?"></textarea></label>
    <button class="btn btn-gold btn-block" id="lGo">Submit for verification</button>
  </div>`}function os(t){d("#lGo",t)?.addEventListener("click",async e=>{let s=e.currentTarget,n=d("#lTitle",t).value.trim(),a=Number(d("#lPrice",t).value);if(n.length<4){f("Please give your home a longer title.","bad");return}if(!a||a<1e3){f("Please set a nightly rate of at least \u20A61,000.","bad");return}s.disabled=!0,s.textContent="Submitting\u2026";let i=await q({do:"listing-create",title:n,price:a,area:d("#lArea",t).value.trim()||"Lagos",city:d("#lCity",t).value.trim()||"Lagos",beds:Number(d("#lBeds",t).value)||1,baths:Number(d("#lBaths",t).value)||1,guests:Number(d("#lGuests",t).value)||2,description:d("#lDesc",t).value.trim()});if(s.disabled=!1,s.textContent="Submit for verification",!i.ok&&!i.queued){f(i.message||"We could not submit that.","bad");return}k(),f(i.message,"good"),Ws("listings"),v("owner")})}function rs(t){h("[data-tab]",t).forEach(e=>e.addEventListener("click",()=>{Me=e.dataset.tab,k(),v("owner")})),h("[data-price]",t).forEach(e=>e.addEventListener("click",async()=>{let s=e.dataset.current,n=window.prompt("New nightly rate in naira",s);if(n==null)return;let a=Number(String(n).replace(/[^\d]/g,""));if(!a||a<1e3){f("Please set a rate of at least \u20A61,000.","bad");return}let i=await q({do:"listing-price",property:e.dataset.price,price:a});f(i.message||(i.ok?"Rate updated.":"Could not update."),i.ok||i.queued?"good":"bad"),i.ok&&v("owner")})),h("[data-status]",t).forEach(e=>e.addEventListener("click",async()=>{let s=e.dataset.now==="live"?"paused":"live",n=await q({do:"listing-status",property:e.dataset.status,status:s});f(n.message||(n.ok?"Updated.":"Could not update."),n.ok||n.queued?"good":"bad"),n.ok&&v("owner")})),h('[data-act="new-listing"]',t).forEach(e=>e.addEventListener("click",()=>v("new-listing")))}var ls={home:{view:Ft,title:"Jollof Living",root:!0},explore:{view:pe,title:"Explore",root:!0,bind:Ae},wishlist:{view:Yt,title:"Wishlist",root:!0},trips:{view:Qt,title:"My trips",root:!0},account:{view:Xt,title:"Account",root:!0},owner:{view:is,title:"Owner dashboard",root:!0,bind:rs},stay:{view:Ut,title:""},booking:{view:Vt,title:"Confirm your stay",bind:Jt},confirmed:{view:Kt,title:"Confirmed"},auth:{view:Oe,title:"",bind:Te},notifications:{view:Zt,title:"Notifications"},messages:{view:es,title:"Messages"},"new-listing":{view:as,title:"Add a listing",bind:os}},Qs=[["home","Home","home"],["explore","Explore","compass"],["wishlist","Saved","heart"],["trips","Trips","trips"],["account","Account","user"]];function Q(){let t=d("#app"),{name:e,params:s}=Rt(),n=ls[e]||ls.home;le(t);let a=!!n.root,i=Dt()>1,o=typeof n.title=="function"?n.title(s):n.title;t.innerHTML=`
    ${o||i?`<header class="appbar">
      ${i?`<button class="back" id="navBack" aria-label="Back">${m("back")}</button>`:""}
      ${e==="home"&&!i?`<div class="brand-slot">${Pe(24)}</div>`:`<h1>${l(o||"")}</h1>`}
      ${n.root?`<button class="act" data-go="notifications" aria-label="Notifications">
          ${m("bell")}${Ve()?`<span class="dot" style="top:4px;right:4px">${Ve()}</span>`:""}
        </button>`:""}
    </header>`:""}
    <main id="view">${n.view(s)}</main>
    ${a?Xs(e):""}
  `;let c=d("#view",t);Y(t),Zs(t,c,s),n.bind?.(c,s),window.scrollTo?.(0,0)}Wt(Q);function Xs(t){return`<nav class="tabbar">
    ${(se()?[["home","Home","home"],["explore","Explore","compass"],["owner","Hosting","chart"],["trips","Trips","trips"],["account","Account","user"]]:Qs).map(([n,a,i])=>`<button data-go="${n}" class="${t===n?"on":""}">
      ${m(i)}<span>${a}</span>
      ${n==="wishlist"&&ne().length?`<span class="dot">${ne().length}</span>`:""}
    </button>`).join("")}
  </nav>`}function Zs(t,e,s){d("#navBack",t)?.addEventListener("click",()=>{k(),Xe()}),h("[data-go]",t).forEach(n=>n.addEventListener("click",a=>{a.stopPropagation(),k(),v(n.dataset.go,n.dataset.mode?{mode:n.dataset.mode}:{})})),h("[data-open]",t).forEach(n=>n.addEventListener("click",a=>{a.target.closest("[data-wish]")||(k(),v("stay",{slug:n.dataset.open}))})),h("[data-book]",t).forEach(n=>n.addEventListener("click",()=>{k(),v("booking",{slug:n.dataset.book})})),h("[data-wish]",t).forEach(n=>n.addEventListener("click",async a=>{if(a.stopPropagation(),!T()){v("auth",{mode:"signin"});return}let i=n.dataset.wish,o=!n.classList.contains("on");n.classList.toggle("on",o),k(),o&&en(n);let c=await q({do:"wishlist-toggle",property:i});!c.ok&&!c.queued?(n.classList.toggle("on",!o),f(c.message||"Could not save that.","bad")):c.queued&&f(c.message,"")})),h('[data-act="sync"]',t).forEach(n=>n.addEventListener("click",async()=>{f("Syncing\u2026");let a=await F({force:!0});f(a.ok?"Up to date \u2728":a.message||"Could not sync.",a.ok?"good":"bad"),Q()})),h('[data-act="signout"]',t).forEach(n=>n.addEventListener("click",async()=>{await Lt(),f("Signed out."),Ht("home")})),h('[data-act="become-owner"]',t).forEach(n=>n.addEventListener("click",async()=>{n.disabled=!0;let a=await kt();n.disabled=!1,f(a.message||(a.ok?"Hosting enabled \u2728":"Could not enable hosting."),a.ok?"good":"bad"),a.ok&&v("owner")})),h('[data-act="read-all"]',t).forEach(n=>n.addEventListener("click",async()=>{await q({do:"notifications-read"}),Q()})),h("[data-collection]",t).forEach(n=>n.addEventListener("click",()=>{v("explore")}))}function en(t){let e=t.getBoundingClientRect(),s=document.createElement("div");s.style.cssText=`position:fixed;left:${e.left+e.width/2-120}px;
    top:${e.top+e.height/2-120}px;width:240px;height:240px;pointer-events:none;z-index:400`;let n=document.createElement("div");s.appendChild(n),document.body.appendChild(s),Promise.resolve().then(()=>(V(),Qe)).then(({mountSprite:a})=>{let i=a(n,"heart",{loop:!1,onEnd:()=>{i.destroy(),s.remove()}});i||s.remove()})}function cs(){let t=d("#offlineBar");if(!t)return;let e=r.queue.length;t.textContent=e?`Offline \u2014 ${e} change${e===1?"":"s"} will send when you reconnect`:"You are offline \u2014 showing your saved copy",t.classList.toggle("on",!r.online)}async function tn(){try{await De.setStyle({style:be.Dark})}catch{}try{await De.setBackgroundColor({color:"#0a100d"})}catch{}if(await yt(),bt(cs),cs(),!r.onboarded){let t=document.createElement("div");t.innerHTML=ts(),document.body.appendChild(t),Y(t),ss(t,()=>{t.remove(),Q(),F()});try{await Re.hide()}catch{}return}Q();try{await Re.hide()}catch{}F().then(()=>Q()),ve.addListener("backButton",()=>{Xe()||ve.exitApp()}),ve.addListener("appStateChange",({isActive:t})=>{t&&(!r.syncedAt||Date.now()-r.syncedAt>300*1e3)&&F().then(()=>Q())})}var ds=!1,ps=()=>{ds||(ds=!0,tn())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ps):ps();
/*! Bundled license information:

@capacitor/core/dist/index.js:
  (*! Capacitor: https://capacitorjs.com/ - MIT License *)
*/
