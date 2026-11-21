const C='zzamtiger-v49',A=['./','index.html','manifest.json','logo.png','icon-192.png','tiger_cheer.png','splash.jpg','card_hana.png','card_shinhan.png','card_ibk.png','card_kb.png','tiger_recruit.svg','tiger_ib.png','tiger_ilb.png','tiger_sb.png','tiger_bj.png','gf_cat.png','gf_bear.png','passbook.jpg','questions.js','px.js','route.js','stars.js','rl_car.png','rl_wheelL.png','rl_wheelR.png','px_cream.jpg','px_serum.jpg','px_toner.jpg','px_mask.jpg','px_sun.jpg','px_cleansing.jpg','px_trouble.jpg','px_makeup.jpg','px_men.jpg','px_hair.jpg','px_body.jpg','px_lip.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))))});
/* 백그라운드 동기화: 오프라인에서 저장한 답변을 연결되면 앱이 전송 */
self.addEventListener('sync',e=>{if(e.tag==='zt-sync')e.waitUntil(self.clients.matchAll({includeUncontrolled:true}).then(l=>l.forEach(c=>c.postMessage({type:'zt-sync'}))))});
/* 주기적 동기화: 앱 파일 최신 상태 유지 */
self.addEventListener('periodicsync',e=>{if(e.tag==='zt-refresh')e.waitUntil(caches.open(C).then(c=>Promise.all(['index.html','questions.js','px.js'].map(u=>fetch(u,{cache:'no-store'}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))))});
/* 푸시 알림 */
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data&&e.data.text()}}
e.waitUntil(self.registration.showNotification(d.title||'짬타이거',{body:d.body||'오늘의 질문이 도착했어요',icon:'icon-192.png',badge:'icon-192.png',data:{url:d.url||'./?tab=qna'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=(e.notification.data&&e.notification.data.url)||'./';
e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c){c.navigate(u);return c.focus()}}return self.clients.openWindow(u)}))});
