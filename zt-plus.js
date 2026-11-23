/* 짬타이거 플러스 — 무궁화(코인) · 출석체크 · 상점 · 포토카드 · 떡밥 자판기 · 최애 부대 날씨
   무궁화 숫자는 서버(Supabase 함수)에서만 바뀌어요. 이 파일은 화면만 그려요. */

/* ---------- 상점 상품 (모양) — 가격은 서버 shop_items 에서 가져와요 ---------- */
const ZP_ITEMS = {
  th_night: { n: '밤하늘', k: 'theme', aud: 'mil', bg: 'radial-gradient(circle at 80% 15%,rgba(255,255,255,.18) 0 1px,transparent 2px) 0 0/22px 22px,radial-gradient(circle at 30% 60%,rgba(255,255,255,.12) 0 1px,transparent 2px) 0 0/31px 31px,linear-gradient(155deg,#1B2440 0%,#3A2F5B 55%,#0E1428 100%)' },
  th_sakura: { n: '벚꽃', k: 'theme', aud: 'mil', bg: 'radial-gradient(circle at 15% 20%,rgba(255,255,255,.35) 0 3px,transparent 4px) 0 0/38px 38px,linear-gradient(155deg,#F7C6D3 0%,#E89AB3 55%,#C9799B 100%)' },
  th_camo: { n: '디지털 위장', k: 'theme', aud: 'mil', bg: 'linear-gradient(90deg,rgba(0,0,0,.14) 50%,transparent 50%) 0 0/12px 12px,linear-gradient(rgba(255,255,255,.07) 50%,transparent 50%) 0 0/18px 18px,linear-gradient(155deg,#4E5B3A 0%,#3B4630 55%,#2C3424 100%)' },
  th_ocean: { n: '깊은 바다', k: 'theme', aud: 'mil', bg: 'radial-gradient(120% 60% at 50% 120%,rgba(120,200,255,.35),transparent 60%),linear-gradient(155deg,#2B6CB0 0%,#1E4E79 55%,#12355A 100%)' },
  th_gold: { n: '골드 에디션', k: 'theme', aud: 'mil', bg: 'linear-gradient(115deg,transparent 30%,rgba(255,255,255,.22) 45%,transparent 60%),linear-gradient(155deg,#2A220F 0%,#7A5C1C 45%,#C9A24C 72%,#5E4714 100%)' },
  pt_elite: { n: '특급전사', k: 'patch', aud: 'mil', d: 'tab', w: 56 },
  pt_shooter: { n: '특등사수', k: 'patch', aud: 'mil', d: 'tab', w: 56 },
  pt_flag: { n: '태극기', k: 'patch', aud: 'mil', c: ['#FFFFFF', '#1D3B8B', '#C8102E'], t: 'flag' },
  pt_tiger: { n: '짬타이거', k: 'patch', aud: 'mil', c: ['#3B4630', '#F2BA49', '#FFFFFF'], t: 'TIGER' },
  pt_heart: { n: '곰신 하트', k: 'patch', aud: 'mil', c: ['#F4A0B9', '#FFFFFF', '#E5486F'], t: 'heart' },
  bd_wings: { n: '은빛 날개 휘장', k: 'patch', aud: 'mil', d: 'wings', w: 58 },
  bd_bolt: { n: '번개 방패', k: 'patch', aud: 'mil', d: 'bolt' },
  bd_eagle: { n: '독수리 원형장', k: 'patch', aud: 'mil', d: 'eagle', w: 40 },
  bd_tiger: { n: '호랑이 줄무늬', k: 'patch', aud: 'mil', d: 'tiger' },
  bd_trefoil: { n: '삼엽 별 휘장', k: 'patch', aud: 'mil', d: 'trefoil', w: 42 },
  bd_triangle: { n: '삼각 삼성장', k: 'patch', aud: 'mil', d: 'tri', w: 42 },
  bd_anchor: { n: '닻과 별', k: 'patch', aud: 'mil', d: 'anchor' },
  bd_compass: { n: '화살 나침장', k: 'patch', aud: 'mil', d: 'compass', w: 40 },
  pc_basic: { n: '기본 화이트', k: 'frame', aud: 'fan' },
  pc_polaroid: { n: '폴라로이드', k: 'frame', aud: 'fan' },
  pc_holo: { n: '홀로그램', k: 'frame', aud: 'fan' },
  pc_army: { n: '군번줄', k: 'frame', aud: 'fan' },
  pc_star: { n: '별빛', k: 'frame', aud: 'fan' },
  pf_cat: { n: '블랙캣 스티커', k: 'frame', aud: 'fan', img: 1 },
  pf_jelly_sky: { n: '젤리 구름', k: 'frame', aud: 'fan', img: 1 },
  pf_jelly_pink: { n: '젤리 하트 핑크', k: 'frame', aud: 'fan', img: 1 },
  pf_jelly_mint: { n: '젤리 체리 민트', k: 'frame', aud: 'fan', img: 1 },
  pf_jelly_lilac: { n: '젤리 라일락', k: 'frame', aud: 'fan', img: 1 },
  pf_ging_peach: { n: '깅엄 피치', k: 'frame', aud: 'fan', img: 1 },
  pf_ging_blue: { n: '깅엄 블루', k: 'frame', aud: 'fan', img: 1 },
  pf_ging_lilac: { n: '깅엄 라일락', k: 'frame', aud: 'fan', img: 1 },
  pf_camera: { n: '실버 디카', k: 'frame', aud: 'fan', img: 1 },
  pf_vintage: { n: '빈티지 페이퍼', k: 'frame', aud: 'fan', img: 1 },
  pf_fabric: { n: '체크 패브릭', k: 'frame', aud: 'fan', img: 1 },
  pf_rhine_heart: { n: '큐빅 하트', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_rhine_crown: { n: '큐빅 크라운', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_crystal: { n: '크리스탈 나비', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_pearl_cream: { n: '진주 생크림', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_choco: { n: '초코 베어', k: 'frame', aud: 'fan', img: 1 },
  pf_berry: { n: '딸기 케이크', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_holo: { n: '홀로 보석', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_ocean: { n: '오션 레진', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_icefly: { n: '오로라 아이스 나비', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_amethyst: { n: '아메시스트 엔젤', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_gamer: { n: '게이머 펑크', k: 'frame', aud: 'fan', img: 1 },
  pf_antique: { n: '앤티크 골드', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_galaxy: { n: '네이비 갤럭시', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_gothic: { n: '고딕 로즈', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_clover: { n: '네잎클로버', k: 'frame', aud: 'fan', img: 1 },
  pf_ice: { n: '아이스 크리스탈', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_blackcat: { n: '블랙캣 데이지', k: 'frame', aud: 'fan', img: 1 },
  pf_candy: { n: '캔디 파스텔', k: 'frame', aud: 'fan', img: 1 },
  pf_cookie: { n: '초코 쿠키', k: 'frame', aud: 'fan', img: 1 },
  pf_rainbow: { n: '레인보우 보석', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_silverfly: { n: '실버 버터플라이', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_ribbon: { n: '핑크 큐빅 리본', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_silver: { n: '실버 참', k: 'frame', aud: 'fan', img: 1 },
  pf_seashell: { n: '블루 씨쉘', k: 'frame', aud: 'fan', img: 1 },
  pf_aqua: { n: '아쿠아 레진', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_opal: { n: '오팔 카메오', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_aurora: { n: '오로라 엔젤', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_mermaid: { n: '머메이드 드림', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_angelheart: { n: '엔젤 하트 크림', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  pf_mint: { n: '민트 크리스탈', k: 'frame', aud: 'fan', img: 1, gem: 1 },
  sk_love: { n: '러브 스티커 팩', k: 'sticker', aud: 'fan' },
  sk_army: { n: '밀리터리 스티커 팩', k: 'sticker', aud: 'fan' }
};
const ZP_CATS = { fan: [['frame', '포토카드 틀'], ['sticker', '스티커']], mil: [['theme', '프로필 테마'], ['patch', '패치 · 배지']] };
const ZP_FAN_TABS = [
  ['home', '홈', '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'],
  ['drops', '떡밥', '<circle cx="12" cy="9" r="6.5"/><path d="M5.5 9h13"/><path d="M9 15.5V21h6v-5.5"/>'],
  ['shop', '상점', '<path d="M5 7h14l-1.2 13H6.2z"/><path d="M9 7a3 3 0 0 1 6 0"/>'],
  ['qna', 'Q&A', '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'],
  ['community', '커뮤니티', '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'],
  ['weather', '부대날씨', '<path d="M17.5 19H8a5 5 0 1 1 .9-9.9A6 6 0 0 1 20 11.5 3.75 3.75 0 0 1 17.5 19z"/>']
];

/* ---------- 상태 ---------- */
const zp = { bal: null, checked: true, streak: 0, owned: new Set(), price: {}, shopOK: true, pcs: [], cat: null, booted: false };
const zpFan = () => !!(me && me.gender === 'S');
const zpAud = () => (zpFan() ? 'fan' : 'mil');
const zpTodayKST = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const zpMug = (c) => `<span class="zp-mug ${c || ''}">${MUG_SVG}</span>`;
const zpFmt = n => Number(n || 0).toLocaleString();
function zpToast(t) { const d = document.createElement('div'); d.className = 'zp-toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.classList.add('out'), 1800); setTimeout(() => d.remove(), 2300); }

/* ---------- 스타일 ---------- */
(function () {
  const css = `
.zp-mug{display:inline-flex;width:18px;height:18px;flex-shrink:0}.zp-mug svg{width:100%;height:100%;filter:drop-shadow(0 1px 1.2px rgba(0,0,0,.22))}
.zp-mug.big{width:120px;height:120px}.zp-mug.md{width:28px;height:28px}
.zp-pill{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 11px 0 7px;border-radius:999px;background:#fff;border:1px solid #E5E8EB;font-size:13px;font-weight:800;color:#191F28;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.zp-pill:active{transform:scale(.96)}.zp-pill.bump{animation:zpBump .6s cubic-bezier(.2,1.6,.4,1)}
@keyframes zpBump{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
.zp-toast{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);background:#191F28;color:#fff;font-size:13px;font-weight:700;padding:11px 18px;border-radius:999px;z-index:300;transition:opacity .4s,transform .4s;white-space:nowrap}.zp-toast.out{opacity:0;transform:translate(-50%,8px)}
.zp-att{position:relative;overflow:hidden;border-radius:24px;padding:16px 16px 16px 14px;background:linear-gradient(135deg,#FFFFFF 0%,#F7F3FF 55%,#FFF3F6 100%);border:1px solid #EEE8F7;display:flex;align-items:center;gap:12px;width:100%;text-align:left}
.zp-att .zp-mug{width:44px;height:44px;animation:zpSpin 12s linear infinite}
@keyframes zpSpin{to{transform:rotate(360deg)}}
.zp-att b.go{margin-left:auto;flex-shrink:0;background:#191F28;color:#fff;font-size:13px;padding:9px 14px;border-radius:999px}
.zp-ov{position:fixed;inset:0;z-index:250;background:rgba(17,20,26,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;text-align:center;padding:24px}
.zp-ov .burst{position:relative;width:200px;height:200px;display:flex;align-items:center;justify-content:center}
.zp-ov .burst .zp-mug{animation:zpPop .9s cubic-bezier(.2,1.5,.4,1) both,zpSpin 9s linear .9s infinite}
@keyframes zpPop{0%{transform:scale(.1) rotate(-120deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}
.zp-ov .rays{position:absolute;inset:-40px;border-radius:50%;background:repeating-conic-gradient(rgba(255,226,140,.0) 0 9deg,rgba(255,226,140,.28) 9deg 18deg);animation:zpSpin 14s linear infinite;mask:radial-gradient(circle,#000 30%,transparent 70%);-webkit-mask:radial-gradient(circle,#000 30%,transparent 70%)}
.zp-ov .amt{font-size:44px;font-weight:900;letter-spacing:-1px;margin-top:8px;font-variant-numeric:tabular-nums}
.zp-ov .amt.lucky{background:linear-gradient(90deg,#FFE69A,#F2BA49,#FFF6D6,#E3A72F);-webkit-background-clip:text;background-clip:text;color:transparent;animation:zpShine 1.6s linear infinite;background-size:200% 100%}
@keyframes zpShine{to{background-position:-200% 0}}
.zp-ov .petal{position:absolute;width:10px;height:14px;border-radius:50% 50% 50% 0;background:#F6D3DC;animation:zpPetal 1.6s ease-out forwards}
@keyframes zpPetal{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--x),var(--y)) rotate(var(--r));opacity:0}}
.zp-ov button.ok{margin-top:26px;background:#fff;color:#191F28;font-weight:800;font-size:15px;padding:14px 40px;border-radius:999px}
.zp-card{background:#fff;border-radius:24px;border:1px solid #EEF0F2;padding:18px}
.zp-chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}.zp-chips::-webkit-scrollbar{display:none}
.zp-chips button{flex-shrink:0;height:36px;padding:0 15px;border-radius:999px;font-size:13px;font-weight:700;background:#fff;border:1px solid #E5E8EB;color:#4E5968}
.zp-chips button.on{background:#191F28;border-color:#191F28;color:#fff}
.zp-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.zp-item{background:#fff;border:1px solid #EEF0F2;border-radius:22px;padding:12px;display:flex;flex-direction:column;gap:8px}
.zp-item .pv{height:120px;border-radius:16px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#F5F6F8;position:relative}
.zp-item .nm{font-size:14px;font-weight:800}.zp-item .pr{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:800;color:#4E5968}
.zp-item button{height:38px;border-radius:12px;font-size:13px;font-weight:800}
.zp-item .pv{border:0;width:100%;cursor:pointer}.zp-pvl{position:absolute;right:8px;bottom:8px;font-size:10px;font-weight:800;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,.88);color:#191F28}
.zp-lt .text-white{color:inherit!important}.zp-th .pbar{background:var(--ztrk)!important}.zp-th .pbar>div:first-child{background:var(--zbar)!important}
.zp-th .bg-white\/10{background:var(--ztrk)!important}.zp-th .bg-white\/25{background:var(--zbar)!important;opacity:.75}
.zp-pvs .pcard{text-align:left}
.zp-patches{position:absolute;top:16px;right:16px;display:flex;flex-direction:column;align-items:flex-end;gap:5px;z-index:3;pointer-events:none}
.pcard.zp-hasp>div:first-child .flex-1{padding-right:var(--pw,0)}
.zp-patch svg{width:100%;height:100%;display:block}
.zp-patch{display:block;filter:drop-shadow(0 3px 5px rgba(0,0,0,.3));animation:zpPatchIn .5s cubic-bezier(.2,1.5,.4,1)}
@keyframes zpPatchIn{0%{transform:scale(.3) rotate(-20deg);opacity:0}}
/* 포토카드 */
.pc2{position:relative;aspect-ratio:2/3;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 8px 20px rgba(17,20,26,.12);container-type:inline-size}
.pc2 .ph{position:absolute;inset:0;background:#E9ECEF center/cover no-repeat}
.pc2 .ph.empty{display:flex;align-items:center;justify-content:center;color:#B0B8C1;font-size:12px;font-weight:700}
.pc2 .lay{position:absolute;inset:0;pointer-events:none;z-index:3}
.zp-slots{display:flex;flex-direction:column;gap:8px;margin-top:4px;text-align:left}
.zp-slot{display:flex;align-items:center;gap:12px;text-align:left;padding:13px 14px;border-radius:14px;border:1.5px solid #E5E8EB;background:#fff;width:100%}
.zp-slot .ic{display:flex;color:#191F28}.zp-slot .ic svg{width:22px!important;height:22px!important}.zp-slot .tx{flex:1;display:flex;flex-direction:column}.zp-slot b{font-size:15px;color:#191F28}.zp-slot small{font-size:12px;color:#8B95A1;margin-top:2px}
.zp-slot .ck{width:20px;height:20px;border-radius:50%;border:2px solid #D1D6DB}
.zp-slot.on{border-color:#191F28;background:#F9FAFB}.zp-slot.on .ck{border:6px solid #191F28}
.pc2 .fimg{position:absolute;inset:0;background:center/100% 100% no-repeat;pointer-events:none;z-index:2}
.pc2.pfi{background:#F4F5F7}.pc2.pfi.fit,.zp-pchome .face .pc2.pfi.fit,.zp-pcv .face .pc2.pfi.fit{background:transparent!important;box-shadow:none!important;border-radius:0}.pc2.pfi.fit .fimg{filter:drop-shadow(0 10px 18px rgba(17,20,26,.22))}.zp-pchome .face:has(.fit)::after,.zp-pcv .face:has(.fit)::after{display:none}.pc2.pfi .cap{z-index:4}
.pc2 .gl{position:absolute;inset:0;pointer-events:none;z-index:2;-webkit-mask-size:100% 100%;mask-size:100% 100%;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.0) 40%,rgba(255,255,255,.85) 48%,rgba(210,240,255,.6) 50%,rgba(255,220,250,.5) 52%,transparent 62%);background-size:300% 100%;animation:zpGl 3.6s ease-in-out infinite;mix-blend-mode:screen}
@keyframes zpGl{0%{background-position:120% 0}60%,100%{background-position:-60% 0}}
.pc2 .tw{position:absolute;width:7cqw;height:7cqw;margin:-3.5cqw;pointer-events:none;z-index:3;background:radial-gradient(circle,#fff 0 7%,transparent 9%),linear-gradient(#fff,#fff) center/8% 100% no-repeat,linear-gradient(90deg,#fff,#fff) center/100% 8% no-repeat;-webkit-mask:radial-gradient(circle,#000 20%,transparent 70%);mask:radial-gradient(circle,#000 20%,transparent 70%);filter:drop-shadow(0 0 2px #fff) drop-shadow(0 0 5px rgba(200,230,255,.9));animation:zpTwk 2.2s ease-in-out infinite;opacity:0}
@keyframes zpTwk{0%,100%{opacity:0;transform:scale(.3) rotate(0)}45%{opacity:1;transform:scale(1) rotate(45deg)}70%{opacity:0;transform:scale(.4) rotate(90deg)}}
@media (prefers-reduced-motion:reduce){.pc2 .gl,.pc2 .tw{animation:none!important;opacity:0}}
.pc2 .sk{position:absolute;width:18%;aspect-ratio:1;transform:translate(-50%,-50%) scale(var(--s,1));pointer-events:auto;touch-action:none}
.pc2 .sk svg{width:100%;height:100%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))}
.pc2 .sk.sel{outline:2px dashed #fff;outline-offset:3px;border-radius:6px}
.pc2 .cap{position:absolute;left:0;right:0;bottom:0;padding:8% 7% 6%;font-weight:800;font-size:7.5cqw;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.45);line-height:1.2;word-break:keep-all}
.pcf-pc_basic{border:3.5cqw solid #fff}.pcf-pc_basic .ph{inset:0}
.pcf-pc_polaroid{background:#FBFAF7}.pcf-pc_polaroid .ph{inset:5cqw 5cqw 24cqw 5cqw;border-radius:2px}.pcf-pc_polaroid .cap{color:#3A3A3A;text-shadow:none;bottom:0;height:22cqw;display:flex;align-items:center;justify-content:center;padding:0 6%;font-family:'Nanum Pen Script',cursive,inherit;font-size:9cqw}
.pcf-pc_holo{padding:3cqw;background:conic-gradient(from var(--ha,0deg),#ffd6f5,#c5f1ff,#d8ffd1,#fff5bd,#ffd6f5);animation:zpHolo 5s linear infinite}
.pcf-pc_holo .ph{inset:3cqw;border-radius:10px}
.pcf-pc_holo::after{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.45) 48%,transparent 60%);background-size:250% 100%;animation:zpShine 3.2s linear infinite;pointer-events:none;mix-blend-mode:soft-light}
@property --ha{syntax:'<angle>';inherits:false;initial-value:0deg}
@keyframes zpHolo{to{--ha:360deg}}
.pcf-pc_army{background:#4E5B3A}.pcf-pc_army .ph{inset:12cqw 4cqw 4cqw 4cqw;border-radius:6px}
.pcf-pc_army::before{content:'ZZAMTIGER · ROKA';position:absolute;top:3.5cqw;left:0;right:0;text-align:center;font-size:5cqw;font-weight:900;letter-spacing:.3em;color:#E9E3C8;font-family:ui-monospace,monospace}
.pcf-pc_army .tag{position:absolute;top:1.5cqw;right:5cqw;width:16cqw;height:10cqw;border-radius:2.5cqw;background:linear-gradient(135deg,#E5E8EB,#9AA1A9);box-shadow:inset 0 0 0 .6cqw rgba(0,0,0,.15);z-index:2}
.pcf-pc_star{background:linear-gradient(160deg,#141B3A,#2C2A5C)}.pcf-pc_star .ph{inset:4cqw;border-radius:9px;box-shadow:0 0 0 .8cqw rgba(255,230,160,.6)}
.pcf-pc_star::after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 12% 8%,#FFE7A3 0 .8cqw,transparent 1.4cqw),radial-gradient(circle at 88% 15%,#fff 0 .6cqw,transparent 1.2cqw),radial-gradient(circle at 92% 90%,#FFE7A3 0 .9cqw,transparent 1.6cqw),radial-gradient(circle at 6% 85%,#fff 0 .5cqw,transparent 1.1cqw);animation:zpTw 2.4s ease-in-out infinite alternate}
@keyframes zpTw{to{opacity:.4}}
.zp-pcv .x{position:absolute;top:max(18px,env(safe-area-inset-top));right:18px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.16);color:#fff;font-size:24px;line-height:1}
.zp-pchome{display:flex;flex-direction:column;align-items:center;padding:6px 0 4px}
.zp-pchome .cw,.zp-pcv .cw{perspective:1100px;touch-action:pan-y;-webkit-box-reflect:below 12px linear-gradient(transparent 82%,rgba(255,255,255,.2));animation:zpPop .45s cubic-bezier(.2,1.4,.4,1)}
.zp-pchome .cube,.zp-pcv .cube{position:relative;width:100%;height:100%;transform-style:preserve-3d}
.zp-pchome .face,.zp-pcv .face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.zp-pchome .face .pc2,.zp-pcv .face .pc2{width:100%;height:100%;aspect-ratio:auto;box-shadow:0 24px 50px rgba(0,0,0,.35)}
.zp-pchome .face::after,.zp-pcv .face::after{content:'';position:absolute;inset:0;border-radius:14px;pointer-events:none;background:linear-gradient(105deg,rgba(255,255,255,.55) 0%,rgba(255,255,255,.08) 40%,rgba(0,0,0,.25) 100%);opacity:calc(var(--sh,0) * .9)}
.zp-pcv .nav{display:flex;align-items:center;gap:14px;margin-top:96px}
.zp-pcv .nav button{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font-size:20px;font-weight:700}
.zp-pchome .cw{-webkit-box-reflect:below 10px linear-gradient(transparent 86%,rgba(255,255,255,.09))}
.zp-pchome .dots{display:flex;gap:6px;margin-top:52px;min-height:7px}.zp-pchome .dots i{width:7px;height:7px;border-radius:99px;background:#D5D9DE;transition:all .25s}.zp-pchome .dots i.on{width:18px;background:#191F28}.zp-pchome .dots i.add{background:transparent;box-shadow:inset 0 0 0 1.5px #B0B8C1}.zp-pchome .dots i.add.on{background:#B0B8C1}
.zp-pchome .face .pc2{box-shadow:0 18px 36px rgba(17,20,26,.22)}
.zp-pcv .dots{display:flex;gap:6px}.zp-pcv .dots i{width:7px;height:7px;border-radius:99px;background:rgba(255,255,255,.35);transition:all .25s}.zp-pcv .dots i.on{width:18px;background:#fff}
.zp-pc-add{width:100%;border:2px dashed #D1D6DB;border-radius:24px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#8B95A1;text-align:center;padding:22px}
.zp-pc-add .plus{width:56px;height:56px;border-radius:50%;background:#F2F3F5;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:300;color:#4E5968}
.zp-pcs{display:flex;gap:12px;overflow-x:auto;scrollbar-width:none;padding:4px 2px 14px;margin:0 -2px}.zp-pcs::-webkit-scrollbar{display:none}
.zp-pcs>*{flex:0 0 128px}
/* 날씨 */
.zp-wx{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid #EEF0F2;border-radius:22px;padding:13px 15px;width:100%;text-align:left}
.zp-wx .ic{width:42px;height:42px;flex-shrink:0}.zp-wx .t{font-size:22px;font-weight:900;letter-spacing:-.5px}
#zp-wxc{position:fixed;inset:0;pointer-events:none;z-index:30}
/* 떡밥 자판기 */
.zp-gm{position:relative;width:230px;margin:6px auto 0;user-select:none}
.zp-gm .dome{position:relative;width:200px;height:200px;margin:0 auto;border-radius:50%;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.95) 0 8%,rgba(255,255,255,.25) 16%,rgba(230,240,255,.18) 60%,rgba(180,200,230,.35) 100%);border:4px solid #E4E8EE;box-shadow:inset 0 -10px 24px rgba(0,0,0,.08),0 10px 24px rgba(0,0,0,.08);overflow:hidden;z-index:2}
.zp-gm .balls{position:absolute;inset:0}
.zp-gm .ball{position:absolute;width:42px;height:42px;border-radius:50%;box-shadow:inset -5px -6px 0 rgba(0,0,0,.12),inset 4px 5px 0 rgba(255,255,255,.35)}
.zp-gm .ball::after{content:'';position:absolute;left:0;right:0;top:50%;height:2px;background:rgba(0,0,0,.12)}
.zp-gm.spin .balls{animation:zpMix .9s cubic-bezier(.45,.05,.55,.95) 2}
@keyframes zpMix{0%{transform:rotate(0)}50%{transform:rotate(200deg) scale(.96)}100%{transform:rotate(360deg)}}
.zp-gm .body{position:relative;width:230px;height:150px;margin:-34px auto 0;border-radius:26px 26px 30px 30px;background:linear-gradient(160deg,#2B3340,#191F28);box-shadow:0 14px 30px rgba(17,20,26,.22);z-index:1;display:flex;align-items:flex-end;justify-content:space-between;padding:0 20px 20px}
.zp-gm .lbl{position:absolute;top:44px;left:0;right:0;text-align:center;color:#E7C77A;font-weight:900;font-size:13px;letter-spacing:.12em}
.zp-gm .slot{width:62px;height:44px;border-radius:12px;background:#0E1218;box-shadow:inset 0 4px 10px rgba(0,0,0,.6);position:relative;overflow:visible}
.zp-gm .knob{width:58px;height:58px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F6E7B0,#C9A24C 60%,#8C6B22);box-shadow:0 4px 10px rgba(0,0,0,.35);position:relative}
.zp-gm .knob::after{content:'';position:absolute;left:50%;top:6px;bottom:6px;width:10px;margin-left:-5px;border-radius:6px;background:rgba(80,60,20,.55)}
.zp-gm.spin .knob{animation:zpKnob 1.1s cubic-bezier(.5,0,.3,1)}
@keyframes zpKnob{to{transform:rotate(360deg)}}
.zp-gm .drop{position:absolute;left:28px;bottom:26px;width:38px;height:38px;border-radius:50%;opacity:0;z-index:3}
.zp-gm.out .drop{animation:zpDrop .7s cubic-bezier(.3,1.4,.5,1) forwards}
@keyframes zpDrop{0%{transform:translateY(-70px) scale(.6);opacity:0}60%{opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}
.zp-pull{display:block;margin:18px auto 0;height:52px;padding:0 34px;border-radius:999px;background:#191F28;color:#fff;font-weight:900;font-size:16px;box-shadow:0 8px 18px rgba(17,20,26,.18)}
.zp-pull:active{transform:scale(.96)}.zp-pull:disabled{opacity:.6}
.zp-fc{position:fixed;inset:0;z-index:240;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(17,20,26,.55);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);padding:22px}
.zp-fc .cookie{position:relative;width:180px;height:120px}
.zp-fc .half{position:absolute;top:10px;width:96px;height:96px}
.zp-fc .half svg{width:100%;height:100%}
.zp-fc .l{left:0}.zp-fc .r{right:0}
.zp-fc .cookie.wob{animation:zpWob .55s ease-in-out 2}
@keyframes zpWob{25%{transform:rotate(-7deg)}75%{transform:rotate(7deg)}}
.zp-fc .cookie.crack .l{transition:transform .5s cubic-bezier(.3,1.4,.5,1);transform:translate(-34px,18px) rotate(-28deg)}
.zp-fc .cookie.crack .r{transition:transform .5s cubic-bezier(.3,1.4,.5,1);transform:translate(34px,18px) rotate(28deg)}
.zp-fc .slip{position:absolute;left:50%;top:46px;width:12px;height:40px;margin-left:-6px;background:#FFFDF6;border-radius:3px;opacity:0}
.zp-fc .cookie.crack .slip{animation:zpSlip .55s .25s cubic-bezier(.3,1.4,.5,1) forwards}
@keyframes zpSlip{0%{opacity:1;transform:translateY(0)}100%{opacity:1;transform:translateY(-70px) rotate(-8deg) scaleX(1.4)}}
.zp-fc .res{width:100%;max-width:340px;background:#FFFDF6;color:#191F28;border-radius:24px;padding:22px 20px 18px;margin-top:-10px;box-shadow:0 20px 40px rgba(0,0,0,.25);opacity:0;transform:translateY(20px) scale(.96);transition:all .45s cubic-bezier(.2,1.3,.4,1);position:relative;overflow:hidden}
.zp-fc .res.on{opacity:1;transform:none}
.zp-fc .res::before{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,236,170,.55) 48%,transparent 60%);background-size:250% 100%;animation:zpShine 2.2s linear 1;pointer-events:none}
.zp-sp{position:fixed;width:8px;height:8px;z-index:245;pointer-events:none;background:#FFE69A;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);animation:zpSp 1s ease-out forwards}
@keyframes zpSp{0%{transform:translate(0,0) scale(.4);opacity:1}100%{transform:translate(var(--x),var(--y)) scale(1.4);opacity:0}}
.zp-lb{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:800;padding:5px 10px;border-radius:999px;background:#191F28;color:#F6E7B0}
.zp-stb{width:48px;height:48px;padding:8px;border-radius:16px;background:#fff;border:1px solid #E5E8EB;display:inline-flex}.zp-stb svg{width:100%;height:100%}
.zp-drop-row{display:flex;gap:10px;align-items:flex-start;padding:12px 0;border-top:1px solid #F2F3F5}
@media (prefers-reduced-motion:reduce){.zp-gm.spin .balls,.zp-gm.spin .knob,.pcf-pc_holo,.zp-att .zp-mug{animation:none!important}}
`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();

/* ---------- 패치·스티커 그림 ---------- */
/* ---------- 패치(자수) · 배지(금속) 그림 ----------
   패치: 트윌 원단 결 + 새틴 실 결 + 메로우(오버로크) 테두리 실밥 + 천 질감 노이즈 + 두께 그림자
   배지: 크롬/금 그라디언트 + 빛 반사 엠보싱(베벨) + 에나멜 광택 */
const ZP_DEFS = `<defs>
<linearGradient id="zpAg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBFCFD"/><stop offset=".18" stop-color="#9AA3AD"/><stop offset=".36" stop-color="#F2F4F6"/><stop offset=".55" stop-color="#6B737C"/><stop offset=".76" stop-color="#DCE0E4"/><stop offset="1" stop-color="#7F8790"/></linearGradient>
<linearGradient id="zpAu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6CF"/><stop offset=".2" stop-color="#C8952A"/><stop offset=".38" stop-color="#FFE28A"/><stop offset=".6" stop-color="#9A6B12"/><stop offset=".8" stop-color="#F3CF6B"/><stop offset="1" stop-color="#7D5A10"/></linearGradient>
<linearGradient id="zpGl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity=".08"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
<pattern id="zpTw" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2.4" height="2.4" fill="none"/><rect width="1.1" height="2.4" fill="rgba(0,0,0,.16)"/><rect x="1.2" width=".5" height="2.4" fill="rgba(255,255,255,.10)"/></pattern>
<pattern id="zpSat" width="1.3" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(68)"><rect width=".65" height="6" fill="rgba(255,255,255,.34)"/><rect x=".65" width=".65" height="6" fill="rgba(0,0,0,.22)"/></pattern>
<pattern id="zpSat2" width="1.3" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)"><rect width=".65" height="6" fill="rgba(255,255,255,.30)"/><rect x=".65" width=".65" height="6" fill="rgba(0,0,0,.2)"/></pattern>
<pattern id="zpSat3" width="1.1" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)"><rect width=".5" height="6" fill="rgba(255,255,255,.13)"/></pattern>
<filter id="zpFab" x="-15%" y="-15%" width="130%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="1.9" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -.9 .62" result="na"/><feComposite in="na" in2="SourceAlpha" operator="in" result="nm"/><feMerge result="m"><feMergeNode in="SourceGraphic"/><feMergeNode in="nm"/></feMerge><feGaussianBlur in="SourceAlpha" stdDeviation="1.1" result="sb"/><feOffset in="sb" dy="1.6" result="so"/><feFlood flood-color="#000" flood-opacity=".42"/><feComposite in2="so" operator="in" result="sh"/><feMerge><feMergeNode in="sh"/><feMergeNode in="m"/></feMerge></filter>
<filter id="zpBev" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur in="SourceAlpha" stdDeviation="1.1" result="b"/><feSpecularLighting in="b" surfaceScale="3.2" specularConstant="1" specularExponent="24" lighting-color="#ffffff" result="s"><fePointLight x="-25" y="-35" z="55"/></feSpecularLighting><feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/><feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".75" k4="0" result="lit"/><feGaussianBlur in="SourceAlpha" stdDeviation="1" result="db"/><feOffset in="db" dy="1.4" result="do"/><feFlood flood-color="#000" flood-opacity=".5"/><feComposite in2="do" operator="in" result="ds"/><feMerge><feMergeNode in="ds"/><feMergeNode in="lit"/></feMerge></filter>
</defs>`;
const zpStarD = (cx, cy, r) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(2) + ' ' + (cy + Math.sin(a) * rr).toFixed(2); } return d + 'Z'; };
const zpStar = (cx, cy, r, f, st) => `<path d="${zpStarD(cx, cy, r)}" fill="${f}" ${st ? `stroke="${st}" stroke-width=".8"` : ''}/>`;
/* 실로 수놓은 모양: 색 + 새틴 결 */
const zpThread = (d, c, pat) => `<path d="${d}" fill="${c}"/><path d="${d}" fill="url(#${pat || 'zpSat'})"/>`;
const zpThreadT = (attrs, txt, c, pat) => `<text ${attrs} fill="${c}">${txt}</text><text ${attrs} fill="url(#${pat || 'zpSat2'})">${txt}</text>`;
/* 자수 패치 틀: 원단 + 결 + 내용 + 메로우 테두리(실밥) */
const zpEmb = (vb, shape, base, edge, inner) => `<svg viewBox="${vb}">${ZP_DEFS}<g filter="url(#zpFab)"><path d="${shape}" fill="${base}"/><path d="${shape}" fill="url(#zpTw)"/>${inner}<path d="${shape}" fill="none" stroke="${edge}" stroke-width="5" stroke-linejoin="round"/><path d="${shape}" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="4.2" stroke-dasharray=".7 .9" stroke-linejoin="round"/><path d="${shape}" fill="none" stroke="rgba(0,0,0,.35)" stroke-width=".6" stroke-linejoin="round"/></g></svg>`;
/* 금속 배지 틀 */
const zpMetal = (vb, inner) => `<svg viewBox="${vb}">${ZP_DEFS}<g filter="url(#zpBev)">${inner}</g></svg>`;
const zpEnamel = (d, c) => `<path d="${d}" fill="${c}"/><path d="${d}" fill="url(#zpGl)"/>`;
function zpPatchSVG(id) {
  const it = ZP_ITEMS[id]; if (!it) return '';
  const SH = 'M24 2 44 9v17c0 14-9 23-20 28C13 49 4 40 4 26V9z', SHi = 'M24 7 39.5 12.5v13.5c0 11-7 18.5-15.5 22.5C15.5 44.5 8.5 37 8.5 26V12.5z';
  const ARC = 'M4 50 Q60 -10 116 50 L100 67 Q60 22 20 67 Z';
  switch (id) {
    case 'pt_elite': return zpEmb('0 0 120 46', 'M5 5h110v36H5z', '#6E705A', '#17170F', `${zpThread(zpStarD(23, 23.5, 11), '#F5C518')}<path d="${zpStarD(23, 23.5, 11)}" fill="none" stroke="#8A6A00" stroke-width=".7"/>${zpThreadT('x="75" y="30" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="18"', '특급전사', '#17170F', 'zpSat3')}`);
    case 'pt_shooter': return zpEmb('0 0 120 46', 'M5 5h110v36H5z', '#6E705A', '#17170F', `<g stroke="#17170F" stroke-width="2.6" fill="none"><circle cx="23" cy="23" r="8.5"/><path d="M23 10v6.5M23 29.5V36M10 23h6.5M29.5 23H36"/></g><circle cx="23" cy="23" r="2.2" fill="#B3121F"/>${zpThreadT('x="75" y="30" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="18"', '특등사수', '#17170F', 'zpSat3')}`);
    case 'pt_flag': return zpEmb('0 0 48 58', SH, '#F7F5EE', '#1D3B8B', `${zpThread('M15 27a9 9 0 0 1 18 0 4.5 4.5 0 0 1-9 0 4.5 4.5 0 0 0-9 0z', '#C8102E')}${zpThread('M15 27a9 9 0 0 0 18 0 4.5 4.5 0 0 1-9 0 4.5 4.5 0 0 0-9 0z', '#1D3B8B')}` + [[13, 15, 45], [35, 15, -45], [13, 39, -45], [35, 39, 45]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${[-2.6, 0, 2.6].map(o => zpThread(`M-4.5 ${o - .7}h9v1.4h-9z`, '#1A1A1A')).join('')}</g>`).join(''));
    case 'pt_tiger': return zpEmb('0 0 48 58', SH, '#3B4630', '#E3A72F', `${zpThread('M13 20l5-7 6 4.5 6-4.5 5 7-2.6 1.8L30 17l-6 4.4-6-4.4-3.4 4.8z', '#E3A72F')}${zpThreadT('x="24" y="37" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="9.5" letter-spacing=".3"', 'TIGER', '#F6E7B0')}`);
    case 'pt_heart': return zpEmb('0 0 48 58', SH, '#F4A9BF', '#FFFFFF', zpThread('M24 40C13.5 32.5 10.5 26 13.5 20.5c3-4.5 8.5-3.5 10.5.8 2-4.3 7.5-5.3 10.5-.8 3 5.5 0 12-10.5 19.5z', '#E5486F'));
    case 'bd_wings': return zpMetal('0 0 120 62', [0, 1, 2, 3].map(i => `<path d="M52 ${30 + i * 4} C ${40 - i * 6} ${24 + i * 5}, ${18 - i * 3} ${20 + i * 6}, ${4 + i * 4} ${18 + i * 8} C ${22 - i * 2} ${30 + i * 5}, ${38 - i * 3} ${34 + i * 4}, 52 ${38 + i * 3} Z" fill="url(#zpAg)" stroke="#5B636B" stroke-width=".7"/><path d="M68 ${30 + i * 4} C ${80 + i * 6} ${24 + i * 5}, ${102 + i * 3} ${20 + i * 6}, ${116 - i * 4} ${18 + i * 8} C ${98 + i * 2} ${30 + i * 5}, ${82 + i * 3} ${34 + i * 4}, 68 ${38 + i * 3} Z" fill="url(#zpAg)" stroke="#5B636B" stroke-width=".7"/>`).join('') + `<circle cx="60" cy="34" r="14.5" fill="url(#zpAg)" stroke="#5B636B" stroke-width=".8"/><path d="${zpStarD(60, 34.5, 12.5)}" fill="url(#zpAu)" stroke="#7D5A10" stroke-width=".7"/><path d="M60 22 L60 34.5 L71.9 30.6Z M60 34.5 L67.3 44.6 M60 34.5 L52.7 44.6 M60 34.5 L48.1 30.6" stroke="rgba(120,80,10,.45)" stroke-width=".6" fill="none"/>`);
    case 'bd_bolt': return zpMetal('0 0 48 58', `<path d="${SH}" fill="url(#zpAg)"/>${zpEnamel(SHi, '#1E3A6E')}<path d="M27 11 14 32h9l-4 16 15-24h-9l4-13z" fill="url(#zpAu)" stroke="#7D5A10" stroke-width=".7"/>${zpStar(13, 17, 3.2, 'url(#zpAg)')}${zpStar(35, 17, 3.2, 'url(#zpAg)')}`);
    case 'bd_eagle': return zpMetal('0 0 48 48', `<circle cx="24" cy="24" r="22.5" fill="url(#zpAg)"/><circle cx="24" cy="24" r="22.5" fill="none" stroke="#5B636B" stroke-width=".6"/>${zpEnamel('M24 5.5a18.5 18.5 0 1 0 .01 0z', '#17233D')}<path d="M24 13c2 0 3 1.5 3 3l-1.4 1.2 1.2 2.6c4-3 9-4.2 13-3.6-3 1.4-5 3-6.5 5 2-.3 4 0 5.5.8-3 .5-5.4 1.8-7 3.6l-2 6 1.6 3.4H25l-1-2-1 2h-5.4l1.6-3.4-2-6c-1.6-1.8-4-3.1-7-3.6 1.5-.8 3.5-1.1 5.5-.8-1.5-2-3.5-3.6-6.5-5 4-.6 9 .6 13 3.6l1.2-2.6L21 16c0-1.5 1-3 3-3z" fill="url(#zpAu)" stroke="#7D5A10" stroke-width=".5"/>${zpStar(24, 9.5, 2.4, 'url(#zpAg)')}`);
    case 'bd_tiger': return zpMetal('0 0 48 58', `<path d="${SH}" fill="url(#zpAu)"/>${zpEnamel(SHi, '#E07A1F')}<g fill="#17120E">${['M8.5 15C14 15 18 18 21 23C15 21 11 21 8.5 22Z', 'M8.5 28C13 28 17 32 19 37C13 35 10 35 8.5 36Z', 'M12 42C15 42 17.5 45 19 48.5C15 47 13 47 12.5 47.5Z'].map(d => `<path d="${d}"/><path d="${d}" transform="translate(48 0) scale(-1 1)"/>`).join('')}</g><path d="${zpStarD(24, 29, 7)}" fill="url(#zpAu)" stroke="#5A3D0C" stroke-width=".7"/>`);
    case 'bd_trefoil': return zpMetal('0 0 48 46', `<g fill="url(#zpAu)" stroke="#7D5A10" stroke-width=".7"><circle cx="24" cy="13" r="11.5"/><circle cx="12.5" cy="31" r="11.5"/><circle cx="35.5" cy="31" r="11.5"/></g>${zpEnamel('M24 15.5a9.5 9.5 0 1 0 .01 0z', '#1E2A55')}${zpEnamel(zpStarD(24, 25.5, 7.2), '#C8202C')}`);
    case 'bd_triangle': return zpMetal('0 0 48 44', `<path d="M24 1.5 46.5 41.5h-45z" fill="url(#zpAg)" stroke="#5B636B" stroke-width=".6" stroke-linejoin="round"/>${zpEnamel('M24 8.5 40.5 38h-33z', '#1E2A55')}${zpStar(24, 21, 4.8, 'url(#zpAg)')}${zpStar(17, 32, 4.2, 'url(#zpAg)')}${zpStar(31, 32, 4.2, 'url(#zpAg)')}`);
    case 'bd_anchor': return zpMetal('0 0 48 58', `<path d="${SH}" fill="url(#zpAu)"/>${zpEnamel(SHi, '#0F2A4A')}<g fill="none" stroke="url(#zpAg)" stroke-width="3.2" stroke-linecap="round"><circle cx="24" cy="15" r="3"/><path d="M24 18v24M17 24h14M12.5 33.5c2 6 7 9 11.5 9s9.5-3 11.5-9"/></g><path d="M10 31l3 3.5 2.6-3.2M38 31l-3 3.5-2.6-3.2" fill="none" stroke="url(#zpAg)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`);
    case 'bd_compass': return zpMetal('0 0 48 48', `<circle cx="24" cy="24" r="22.5" fill="url(#zpAg)"/>${zpEnamel('M24 5a19 19 0 1 0 .01 0z', '#222A36')}<path d="M24 6 29 24 24 42 19 24z" fill="url(#zpAg)" stroke="#5B636B" stroke-width=".5"/><path d="M6 24 24 19.5 42 24 24 28.5z" fill="url(#zpAu)" stroke="#7D5A10" stroke-width=".5"/><path d="M24 6 29 24h-10z" fill="#C8202C"/><circle cx="24" cy="24" r="3" fill="url(#zpAg)"/>`);
  }
  return '';
}
const ZP_STK = {
  heart: { p: '', s: '<path d="M12 21C5 16 2 12 3.5 8 5 4.5 9.5 4 12 7.5 14.5 4 19 4.5 20.5 8 22 12 19 16 12 21z" fill="#F2606F"/>' },
  star: { p: '', s: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="#F2BA49"/>' },
  spark: { p: '', s: '<path d="M12 1l2 8 8 3-8 3-2 8-2-8-8-3 8-3z" fill="#FFE69A"/><path d="M19 2l.8 2.4L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.6z" fill="#fff"/>' },
  mug: { p: '', s: null },
  ribbon: { p: 'sk_love', s: '<path d="M12 11c-3-5-9-6-9-2s5 4 9 2zm0 0c3-5 9-6 9-2s-5 4-9 2z" fill="#F48FB1"/><path d="M12 11l-4 10 3-1 1 2 1-2 3 1z" fill="#EC6A97"/><circle cx="12" cy="11" r="2" fill="#D9487A"/>' },
  letter: { p: 'sk_love', s: '<rect x="2.5" y="6" width="19" height="13" rx="2" fill="#FFF6F8" stroke="#F2A1B5"/><path d="M3 7l9 6.5L21 7" fill="none" stroke="#F2A1B5" stroke-width="1.4"/><path d="M12 15.5c-1.6-1.2-2.4-2-2-3 .4-.8 1.5-.8 2 0 .5-.8 1.6-.8 2 0 .4 1-.4 1.8-2 3z" fill="#E5486F"/>' },
  crown: { p: 'sk_love', s: '<path d="M3 18l1.5-10 4.5 4 3-6 3 6 4.5-4L21 18z" fill="#F2BA49" stroke="#C9881E" stroke-width=".8"/><rect x="3" y="18" width="18" height="2.6" rx="1" fill="#C9881E"/>' },
  dogtag: { p: 'sk_army', s: '<rect x="6" y="5" width="12" height="16" rx="5" fill="#C9CED4" stroke="#8C939B"/><circle cx="12" cy="8.5" r="1.3" fill="#8C939B"/><path d="M8.5 13h7M8.5 15.5h5" stroke="#6B7280" stroke-width="1.2"/><path d="M12 1v6" stroke="#8C939B" stroke-dasharray="1 1"/>' },
  roka: { p: 'sk_army', s: '<rect x="1.5" y="7" width="21" height="10" rx="2" fill="#4E5B3A"/><text x="12" y="14.6" text-anchor="middle" font-size="6.6" font-weight="900" fill="#E9E3C8" font-family="sans-serif">ROKA</text>' },
  helmet: { p: 'sk_army', s: '<path d="M3 16c0-6 4-10 9-10s9 4 9 10z" fill="#5B6B45"/><rect x="2" y="15.5" width="20" height="3" rx="1.5" fill="#3B4630"/><path d="M8 9c1-1 2.5-1.6 4-1.6" stroke="#7E8F63" stroke-width="1.3" fill="none"/>' }
};
const zpStkSVG = k => k === 'mug' ? MUG_SVG.replace('<svg', '<svg') : `<svg viewBox="0 0 24 24">${(ZP_STK[k] || {}).s || ''}</svg>`;

const ZP_SPR = { b: { src: 'shop_badges.png', W: 1280, H: 768, m: {"pt_elite":[18,86,220,84],"pt_shooter":[274,86,220,84],"pt_flag":[549,18,182,220],"pt_tiger":[805,18,182,220],"pt_heart":[1061,18,182,220],"bd_wings":[18,327,220,114],"bd_bolt":[293,274,182,220],"bd_eagle":[530,274,220,220],"bd_tiger":[805,274,182,220],"bd_trefoil":[1042,279,220,211],"bd_triangle":[18,539,220,202],"bd_anchor":[293,530,182,220],"bd_compass":[530,530,220,220]} }, t: { src: 'shop_themes.png', W: 1440, H: 1392, m: {"th_night":[12,12,336,208],"th_sakura":[372,12,336,208],"th_camo":[732,12,336,208],"th_ocean":[1092,12,336,208],"th_gold":[12,244,336,208],"st_black_gold":[372,244,336,208],"st_black_silver":[732,244,336,208],"st_white_gold":[1092,244,336,208],"st_white_silver":[12,476,336,208],"st_khaki_gold":[372,476,336,208],"st_navy_silver":[732,476,336,208],"st_ivory_rose":[1092,476,336,208],"st_carbon_gold":[12,708,336,208],"st_matte_black":[372,708,336,208],"st_matte_white":[732,708,336,208],"st_army_dress":[1092,708,336,208],"st_airforce_dress":[12,940,336,208],"st_navy_dress":[372,940,336,208],"st_navy_summer":[732,940,336,208],"st_honor_guard":[1092,940,336,208],"st_ceremony_grey":[12,1172,336,208],"st_general_green":[372,1172,336,208]} } };
/* 상점 그림(이미지) — 올라와 있으면 이미지로, 없으면 코드로 그린 그림으로 */
zp.spr = {};
['b', 't'].forEach(k => { const im = new Image(); im.onload = () => { zp.spr[k] = true; try { zpApplyEquip(); const el = zpShopEl(); if (el && el.querySelector('.zp-grid')) zpShopRender(el); } catch (e) { } }; im.src = ZP_SPR[k].src + '?v=2'; });
function zpSpr(k, id, css) {
  const S = ZP_SPR[k], r = S.m[id]; if (!r || !zp.spr[k]) return '';
  const [x, y, w, h] = r;
  return `<span class="zp-spr" style="display:block;aspect-ratio:${w}/${h};background-image:url(${S.src}?v=2);background-repeat:no-repeat;background-size:${(S.W / w * 100).toFixed(3)}% ${(S.H / h * 100).toFixed(3)}%;background-position:${(x / (S.W - w) * 100).toFixed(3)}% ${(y / (S.H - h) * 100).toFixed(3)}%;${css || ''}"></span>`;
}
const zpPAsp = id => { const r = ZP_SPR.b.m[id]; return r ? r[2] / r[3] : (ZP_ITEMS[id] && ZP_ITEMS[id].w || 34) / 40; };
const zpPatchArt = id => zpSpr('b', id, 'width:100%;height:100%') || zpPatchSVG(id);
/* ---------- 데이터 ---------- */
async function zpLoadWallet() {
  try {
    const { data, error } = await sb.from('coin_wallet').select('balance,last_check,streak').eq('user_id', me.id).maybeSingle();
    if (error) { zp.shopOK = false; zp.bal = null; zp.checked = true; return; }
    zp.bal = data ? data.balance : 0; zp.streak = data ? data.streak : 0; zp.checked = !!(data && data.last_check === zpTodayKST());
  } catch (e) { zp.shopOK = false; }
}
async function zpLoadItems() {
  try {
    const [a, b] = await Promise.all([sb.from('shop_items').select('id,price,active'), sb.from('user_items').select('item_id').eq('user_id', me.id)]);
    if (a.error) { zp.shopOK = false; return; }
    zp.price = {}; (a.data || []).forEach(r => { if (r.active) zp.price[r.id] = r.price; });
    zp.owned = new Set((b.data || []).map(r => r.item_id));
  } catch (e) { zp.shopOK = false; }
}
async function zpLoadPCs() {
  if (!zpFan()) return;
  try { const { data, error } = await sb.from('photocards').select('*').eq('user_id', me.id).order('created_at'); if (!error) zp.pcs = data || []; } catch (e) { }
}
async function zpBoot() {
  if (zp.booted) return; zp.booted = true;
  await Promise.all([zpLoadWallet(), zpLoadItems(), zpLoadPCs()]);
  zpRender();
}

/* ---------- 화면 훅 (index.html 에서 불러요) ---------- */
function zpRender() {
  if (!me) return;
  if (!zp.booted) { zpBoot(); }
  zpHeader(); zpAttCard(); zpApplyEquip();
  const fan = zpFan(), rc = q('route-card'); if (rc) rc.classList.toggle('hidden', fan);
  let ph = q('zp-fan-home');
  if (fan) {
    if (!ph) { ph = document.createElement('div'); ph.id = 'zp-fan-home'; ph.className = 'space-y-4'; const sh = q('star-home'); sh.parentNode.insertBefore(ph, sh.nextSibling); }
    const sl = zpSlot(); ph.innerHTML = `<div id="zp-wx-home"></div><div id="${sl === 'q' ? 'zp-q-home' : 'zp-pc-home'}"></div>`; zpWxHome(); if (sl === 'q') zpQHome(); else zpPCHome();
  } else { if (ph) ph.remove(); zpMilWx(); }
}
/* 팬 홈 카드 자리: 포토카드 또는 오늘의 질문 (설정에서 골라요) */
const zpSlotKey = () => 'zt_homeslot:' + (me ? me.id : '');
function zpSlot() { try { return localStorage.getItem(zpSlotKey()) === 'q' ? 'q' : 'pc'; } catch (e) { return 'pc'; } }
async function zpSlotPick() {
  let v = zpSlot();
  const opt = (k, ic, t, d) => `<button type="button" data-k="${k}" class="zp-slot ${v === k ? 'on' : ''}"><span class="ic">${ic}</span><span class="tx"><b>${t}</b><small>${d}</small></span><span class="ck"></span></button>`;
  const svg = n => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;
  const html = `<div class="zp-slots">${opt('pc', svg('image'), '포토카드', '꾸민 포토카드를 크게 보여줘요')}${opt('q', svg('msg'), '오늘의 질문', 'MY스타 질문 카드를 보여줘요')}</div>`;
  const p = zDialog({ title: '홈 화면 카드', html, ok: '저장' });
  setTimeout(() => document.querySelectorAll('.zp-slot').forEach(b => b.onclick = () => { v = b.dataset.k; document.querySelectorAll('.zp-slot').forEach(x => x.classList.toggle('on', x === b)); }), 0);
  if (!(await p)) return;
  try { localStorage.setItem(zpSlotKey(), v); } catch (e) { }
  if (typeof renderSetRows === 'function') renderSetRows(); zpToast(v === 'q' ? '홈에 오늘의 질문을 보여줘요' : '홈에 포토카드를 보여줘요'); zpRender();
}
function zpQHome() {
  const box = q('zp-q-home'); if (!box) return;
  const s = typeof sqStar === 'function' ? sqStar() : null;
  if (!s) { box.innerHTML = `<button class="zp-pc-add" style="min-height:160px" onclick="starFlow()"><span class="plus">+</span><b class="text-[15px] text-[#191F28]">MY스타를 등록하면 오늘의 질문이 열려요</b></button>`; return; }
  if (!(window.STARQ && window.STARQ.army)) { box.innerHTML = `<div class="toss-card text-center py-8 text-[13px] text-[#8B95A1]">오늘의 질문을 불러오는 중…</div>`; sqEnsure().then(() => { if (q('zp-q-home')) zpQHome(); }).catch(() => { box.innerHTML = ''; }); return; }
  const I = starInfo(s), Q = window.STARQ[sqBranch(s)] || window.STARQ.army, L = Q.length, nm = starCall(s), r = myRow(s.id), th = r ? r.theme : 'black_gold', TH = STAR_TH[th] || {};
  const go = `switchTab('qna');window.scrollTo(0,0)`;
  if (I.pre) { box.innerHTML = `<div class="stk ${TH.m ? 'mt' : ''} text-center" onclick="${go}" style="${thVars(th)};cursor:pointer"><div class="relative z-[1]"><span class="lb">${esc(callAs(nm, '의'))} 입대까지 D-${I.toEnlist}</span><h2 class="text-[18px] font-extrabold leading-snug mt-4">입대하는 날부터<br>하루 한 질문이 열려요</h2></div></div>`; return; }
  const d = sqMap(I, L), row = Q[d - 1] || [], sp = row[2] || '', rk = row[3] || '';
  box.innerHTML = `<div class="stk ${TH.m ? 'mt' : ''} text-center active:scale-[.99] transition-transform" onclick="${go}" style="${thVars(th)};cursor:pointer"><div class="relative z-[1]">
   <span class="lb">${I.done ? esc(callAs(nm, '의')) + ' 전역을 축하해요' : esc(callAs(nm, '를')) + ' 기다린 지 ' + I.served + '일째'}</span>
   <div class="flex items-center justify-center gap-1.5 mt-3 flex-wrap">${sp ? `<span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold" style="background:var(--fg,#fff);color:var(--bg,#111)">${esc(sp)}</span>` : ''}<span class="px-2.5 py-1 rounded-full text-[11px] font-bold" style="background:rgba(127,127,127,.2)">Day ${d} / ${L}</span>${rk ? `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold" style="background:rgba(127,127,127,.2)">${esc(rk)}</span>` : ''}</div>
   <h2 class="text-[18px] font-extrabold leading-snug mt-3 break-keep">“${esc(sqText(row[0], nm))}”</h2>
   <p class="text-[12px] opacity-60 mt-2">${esc(row[1] || '오늘의 질문')}</p><p class="text-[11px] font-medium mt-3" style="opacity:.45">터치하면 답을 적을 수 있어요</p></div></div>`;
}
/* 군인·곰신: 자대 날씨 */
function zpMilLine(S, w, mine) {
  const nm = (S.nickname || '').trim(), k = zpKind(w.code), t = w.tc, who = mine ? '' : (nm ? callAs(nm, '가') + ' ' : '그 사람이 ');
  const pick = a => a[(new Date().getDate()) % a.length];
  if (k === 'snow') return mine ? pick(['자대에 눈 소식… 제설 작전 대비 단단히!', '눈 오는 날, 넉가래보다 핫팩 먼저 챙기기']) : pick([`${who}있는 곳에 눈이 와요. 제설 안 하길 바라며…`, `눈 오는 자대… ${nm ? callAs(nm, '는') : '그는'} 따뜻하게 있길`]);
  if (k === 'rain' || k === 'storm') return mine ? '자대에 비가 와요. 우의 챙기고 미끄럼 조심!' : `${who}있는 곳은 비가 와요. 우산 챙겼으면`;
  if (t <= -10) return mine ? `영하 ${-t}도! 깔깔이에 핫팩까지 풀장착` : `자대는 영하 ${-t}도… ${who}핫팩 꼭 챙겼길`;
  if (t <= 0) return mine ? '쌀쌀한 날, 감기 조심하세요' : `영하권 날씨, ${who}감기 안 걸리길`;
  if (t >= 30) return mine ? `${t}도 폭염, 물 많이 마시기!` : `${t}도 폭염… ${who}물 많이 마시길`;
  if (k === 'fog') return '안개 낀 날, 오늘도 안전하게';
  if (k === 'cloud') return mine ? '흐리지만 오늘 하루도 무탈하게' : `흐린 날이지만 ${who}하루는 맑기를`;
  return mine ? '맑은 날! 오늘 하루도 화이팅' : `햇살 좋은 날, ${who}웃는 하루였으면`;
}
async function zpMilWx() {
  let box = q('zp-mil-wx'); const S = (typeof S_ === 'function') ? S_() : null;
  if (!zpWxOn() || zpFan() || !S) { if (box) box.remove(); zpWxAnim(null); return; }
  if (!box) { box = document.createElement('div'); box.id = 'zp-mil-wx'; const ref = q('pager-dots') || q('profile-container'); ref.parentNode.insertBefore(box, ref.nextSibling); }
  const mine = S.id === me.id;
  if (!S.unit_lat || !S.unit_lng) { box.innerHTML = mine ? `<button class="zp-wx" onclick="openSettings();setGo('unit')"><span class="ic">${zpWxIcon('cloud', 1)}</span><div class="min-w-0"><div class="text-[14px] font-extrabold">자대 날씨</div><div class="text-[12px] text-[#8B95A1] mt-0.5">자대를 등록하면 매일 날씨를 알려드려요 ›</div></div></button>` : ''; zpWxAnim(null); return; }
  const w = await zpWx('unit_' + S.id, [S.unit_lat, S.unit_lng]); if (!w || !q('zp-mil-wx')) return;
  const k = zpKind(w.code);
  box.innerHTML = `<div class="zp-wx"><span class="ic">${zpWxIcon(k, w.day)}</span><div class="min-w-0 flex-1"><div class="flex items-baseline gap-2"><span class="t">${w.tc}°</span><span class="text-[13px] font-bold text-[#4E5968]">자대 · ${ZP_KN[k]} · 최고 ${w.hi}° 최저 ${w.lo}°</span></div><div class="text-[12.5px] text-[#4E5968] mt-0.5 truncate">${esc(zpMilLine(S, w, mine))}</div></div></div>`;
  zpWxAnim(k);
}
function zpHeader() {
  let row = q('zp-coin-row');
  if (!row) {
    const hd = document.querySelector('header'); if (!hd) return; hd.classList.add('flex-wrap');
    row = document.createElement('div'); row.id = 'zp-coin-row'; row.className = 'w-full flex justify-end'; row.style.marginTop = '2px'; hd.appendChild(row);
  }
  if (zp.bal === null && !zp.shopOK) { row.innerHTML = ''; return; }
  row.innerHTML = `<button id="zp-pill" class="zp-pill" onclick="zpOpenShop()" aria-label="무궁화 ${zpFmt(zp.bal)}개 · 상점">${zpMug()}<b id="zp-bal">${zp.bal === null ? '…' : zpFmt(zp.bal)}</b></button>`;
}
function zpSetBal(v, bump) { zp.bal = v; const b = q('zp-bal'); if (b) b.textContent = zpFmt(v); if (bump) { const p = q('zp-pill'); if (p) { p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); } } document.querySelectorAll('.zp-bal2').forEach(e => e.textContent = zpFmt(v)); }

/* ---------- 출석체크 ---------- */
function zpAttCard() {
  let c = q('zp-att'); const show = zp.shopOK && zp.bal !== null && !zp.checked;
  if (!show) { if (c) c.remove(); return; }
  if (!c) { c = document.createElement('button'); c.id = 'zp-att'; c.className = 'zp-att'; c.onclick = zpCheckin; const home = q('tab-home'); home.insertBefore(c, home.firstChild); }
  c.innerHTML = `${zpMug()}<div class="min-w-0"><div class="text-[15px] font-extrabold">오늘의 출석체크</div><div class="text-[12px] text-[#8B95A1] mt-0.5">무궁화 1~30개, 운 좋으면 <b class="text-[#C9881E]">100개</b>를 한 번에!${zp.streak ? ` · ${zp.streak}일 연속` : ''}</div></div><b class="go">출석하기</b>`;
}
let zpCkBusy = false;
async function zpCheckin() {
  if (zpCkBusy) return; zpCkBusy = true;
  const { data, error } = await sb.rpc('daily_checkin'); zpCkBusy = false;
  if (error) { if (/already/.test(error.message)) { zp.checked = true; zpAttCard(); return zpToast('오늘은 이미 출석했어요'); } return showAlert('출석체크', '잠시 후 다시 시도해주세요.'); }
  zp.checked = true; zp.streak = data.streak; zpAttCard();
  const ov = document.createElement('div'); ov.className = 'zp-ov';
  ov.innerHTML = `<div class="burst">${data.lucky ? '<div class="rays"></div>' : ''}${zpMug('big')}</div><div class="text-[14px] font-bold opacity-80 mt-2">${data.lucky ? '대박! 행운의 무궁화' : '출석 완료'} · ${data.streak}일 연속</div><div class="amt ${data.lucky ? 'lucky' : ''}">+<span id="zp-cnt">0</span></div><div class="text-[13px] opacity-70">무궁화를 받았어요</div><button class="ok" onclick="this.closest('.zp-ov').remove()">확인</button>`;
  document.body.appendChild(ov);
  const burst = ov.querySelector('.burst'); for (let i = 0; i < (data.lucky ? 26 : 14); i++) { const p = document.createElement('i'); p.className = 'petal'; const a = Math.random() * Math.PI * 2, R = 90 + Math.random() * 80; p.style.cssText = `left:95px;top:95px;--x:${Math.cos(a) * R}px;--y:${Math.sin(a) * R}px;--r:${Math.random() * 360}deg;animation-delay:${.2 + Math.random() * .3}s;background:${i % 3 ? '#F6D3DC' : '#E7C77A'}`; burst.appendChild(p); }
  const t0 = performance.now(), dur = data.lucky ? 1400 : 900; (function f(t) { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), el = q('zp-cnt'); if (el) el.textContent = Math.round(data.amount * e); if (k < 1) requestAnimationFrame(f); })(t0);
  setTimeout(() => zpSetBal(data.balance, true), 700);
}

/* ---------- 프로필 꾸미기 (군인·곰신) ---------- */
/* MY스타 테마 17가지를 군인·곰신 프로필 테마로도 (이름은 색 이름 그대로) */
function zpEnsureSt() { if (zpEnsureSt.d || typeof STAR_TH === 'undefined') return; zpEnsureSt.d = 1; Object.keys(STAR_TH).forEach(k => { ZP_ITEMS['st_' + k] = { n: STAR_TH[k].n, k: 'theme', aud: 'mil', star: k }; }); }
function zpLum(hex) { const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim()); if (!m) return 1; const n = parseInt(m[1], 16); return (.299 * (n >> 16) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255; }
function zpStyleCard(card, thId, ptId) {
  zpEnsureSt(); if (card.dataset.bg0 === undefined) { card.dataset.bg0 = card.style.background; card.dataset.c0 = card.style.color; }
  card.classList.remove('zp-th', 'zp-lt'); card.style.removeProperty('--zbar'); card.style.removeProperty('--ztrk'); card.style.position = 'relative';
  const it = ZP_ITEMS[thId];
  if (it && it.star && STAR_TH[it.star]) { const t = STAR_TH[it.star]; card.style.background = t.bg; card.style.color = t.fg; card.classList.add('zp-th'); card.style.setProperty('--zbar', t.bar); card.style.setProperty('--ztrk', t.trk); if (zpLum(t.fg) < .5) card.classList.add('zp-lt'); }
  else if (it && it.bg) { card.style.background = it.bg; card.style.color = card.dataset.c0 || ''; }
  else { card.style.background = card.dataset.bg0; card.style.color = card.dataset.c0 || ''; }
  const list = (Array.isArray(ptId) ? ptId : ptId ? [ptId] : []).filter(x => ZP_ITEMS[x]).slice(0, 3), sig = list.join(',');
  let box = card.querySelector('.zp-patches');
  if (!list.length) { if (box) box.remove(); card.classList.remove('zp-hasp'); return; }
  if (box && box.dataset.sig === sig + (zp.spr.b ? 'i' : '')) return;
  if (box) box.remove(); box = document.createElement('div'); box.className = 'zp-patches'; box.dataset.sig = sig + (zp.spr.b ? 'i' : '');
  const ph = x => zpPAsp(x) > 1.8 ? 25 : 29; box.innerHTML = list.map(x => { const it = ZP_ITEMS[x], h = ph(x); return `<i class="zp-patch" title="${esc(it.n)}" style="height:${h}px;width:${Math.round(h * zpPAsp(x))}px">${zpPatchArt(x)}</i>`; }).join('');
  card.classList.add('zp-hasp'); card.style.setProperty('--pw', (Math.max(...list.map(x => Math.round(ph(x) * zpPAsp(x)))) + 8) + 'px');
  card.appendChild(box);
}
const zpPatches = eq => { eq = eq || {}; return Array.isArray(eq.patches) ? eq.patches.slice(0, 3) : eq.patch ? [eq.patch] : []; };
/* 자세히 보기(복무 현황 · 기다림 현황) 카드에도 같은 테마 · 패치 */
function zpHero(which) {
  if (!me || zpFan()) return; const h = q(which === 'gd' ? 'gd-hero' : 'sd-hero'); if (!h) return;
  const card = h.parentElement && h.parentElement.parentElement; if (!card) return;
  const P = which === 'gd' ? (typeof G_ === 'function' ? G_() : null) : (typeof S_ === 'function' ? S_() : null), eq = (P && P.equip) || {};
  card.style.position = 'relative'; zpStyleCard(card, eq.theme, zpPatches(eq));
}
function zpApplyEquip() {
  if (!me || zpFan()) return;
  const sol = me.gender === 'M' ? me : (partner && partner.gender === 'M' ? partner : null), gom = me.gender === 'F' ? me : (partner && partner.gender === 'F' ? partner : null);
  [['soldier-card', sol], ['gf-profile-card', gom]].forEach(([id, P]) => { const card = document.querySelector('#' + id + ' .pcard'); if (!card) return; const eq = (P && P.equip) || {}; zpStyleCard(card, eq.theme, zpPatches(eq)); });
}

/* ---------- 상점 ---------- */
function zpItem(id) { zpEnsureSt(); return ZP_ITEMS[id] || null; }
function zpThLocked() { return false; }   // 팬 MY스타 테마는 모두 무료
async function zpThBuy(k, fn) { if (typeof window[fn] === 'function') window[fn](k); }
function zpOpenShop(cat) {
  if (cat) zp.cat = cat;
  if (zpFan()) { switchTab('shop'); window.scrollTo(0, 0); return; }
  let m = q('zp-shop-m');
  if (!m) { m = document.createElement('div'); m.id = 'zp-shop-m'; m.className = 'fixed inset-0 hidden flex-col'; m.style.cssText = 'z-index:70;background:var(--bg-main)'; m.innerHTML = `<div class="relative flex items-center justify-between px-4 pb-3" style="padding-top:max(14px,env(safe-area-inset-top))"><button onclick="closeModal('zp-shop-m')" class="w-10 h-10 rounded-full bg-white border border-[#E5E8EB] font-bold text-[18px]" aria-label="닫기">‹</button><div class="font-extrabold text-[17px]">무궁화 상점</div><div class="w-10"></div></div><div id="zp-shop-body" class="flex-1 overflow-y-auto px-4" style="padding-bottom:max(24px,env(safe-area-inset-bottom))"></div>`; document.body.appendChild(m); }
  openM('zp-shop-m'); zpShopRender(q('zp-shop-body'));
}
function zpShopTab() { zpShopRender(q('tab-shop')); }
const zpShopEl = () => (q('zp-shop-m') && !q('zp-shop-m').classList.contains('hidden')) ? q('zp-shop-body') : q('tab-shop');
function zpPV(id, it, big) {
  if (it.k === 'theme' && zp.spr.t && ZP_SPR.t.m[id]) return `<div style="width:${big ? 100 : 96}%">${zpSpr('t', id, 'width:100%;border-radius:12px')}</div>`;
  if (it.k === 'patch' && zp.spr.b && ZP_SPR.b.m[id]) { const a = zpPAsp(id); return `<div style="height:${a > 1.5 ? 56 : 84}px;width:${Math.round((a > 1.5 ? 56 : 84) * a)}px;max-width:92%">${zpPatchArt(id)}</div>`; }
  if (it.k === 'theme') { if (it.star) { const t = STAR_TH[it.star]; return `<div style="position:absolute;inset:0;background:${t.bg}"></div><div class="relative" style="width:${big ? 86 : 78}%"><div class="text-[11px] font-extrabold" style="color:${t.fg}">${esc(t.n)}</div><div class="mt-2 rounded-full overflow-hidden" style="height:12px;background:${t.trk}"><i class="block h-full" style="width:64%;background:${t.bar}"></i></div></div>`; } return `<div style="position:absolute;inset:0;background:${it.bg}"></div><div class="relative text-white text-[12px] font-extrabold" style="text-shadow:0 1px 3px rgba(0,0,0,.4)">${esc(it.n)}</div>`; }
  if (it.k === 'patch') return `<div style="width:58px;height:70px">${zpPatchSVG(id)}</div>`;
  if (it.k === 'frame') return `<div style="width:70px">${zpPCHTML({ frame: id, photo: null, deco: { cap: '' } }, true)}</div>`;
  return `<div class="flex flex-wrap gap-1 justify-center" style="width:100px">${Object.keys(ZP_STK).filter(k => ZP_STK[k].p === id).map(k => `<span style="width:30px;height:30px;display:inline-block">${zpStkSVG(k)}</span>`).join('')}</div>`;
}
async function zpShopRender(el) {
  if (!el) return; if (!zp.booted) await zpBoot(); zpEnsureSt();
  if (!zp.shopOK) { el.innerHTML = `<div class="zp-card text-center py-10 mt-2"><div class="text-[16px] font-extrabold">상점을 준비하고 있어요</div><p class="text-[13px] text-[#8B95A1] mt-2">잠시 후 다시 열어주세요.</p></div>`; return; }
  const cats = ZP_CATS[zpAud()].concat([['inv', '보관함']]); if (!zp.cat || !cats.some(c => c[0] === zp.cat)) zp.cat = cats[0][0];
  const inv = zp.cat === 'inv', eq = (me && me.equip) || {};
  const list = Object.entries(ZP_ITEMS).filter(([id, it]) => it.aud === zpAud() && zp.price[id] !== undefined && (inv ? zp.owned.has(id) : it.k === zp.cat));
  const cnt = Object.keys(ZP_ITEMS).filter(id => ZP_ITEMS[id].aud === zpAud() && zp.owned.has(id)).length;
  const note = inv ? '산 아이템은 모두 여기 있어요. 테마와 패치는 여기서 바꿔 끼울 수 있어요' : zp.cat === 'frame' ? '틀을 사면 홈에서 원하는 사진으로 포토카드를 만들 수 있어요' : zp.cat === 'sticker' ? '포토카드를 꾸밀 때 쓸 수 있는 스티커예요' : zp.cat === 'theme' ? '홈 프로필 카드의 색이 바뀌어요. 연인에게도 보여요 · 눌러서 미리보기' : '프로필 카드 오른쪽 위에 붙어요. 연인에게도 보여요 · 눌러서 미리보기';
  el.innerHTML = `<div class="zp-card mt-2 flex items-center gap-3" style="background:linear-gradient(135deg,#191F28,#2B3340);color:#fff;border:0">${zpMug('md')}<div><div class="text-[12px] opacity-70">내 무궁화</div><div class="text-[24px] font-black tabular-nums zp-bal2">${zpFmt(zp.bal)}</div></div><div class="ml-auto text-right text-[11px] opacity-70 leading-relaxed">매일 출석하면<br>1~30개 · 행운 100개</div></div>
   <div class="zp-chips mt-4">${cats.map(([k, n]) => `<button class="${k === zp.cat ? 'on' : ''}" onclick="zp.cat='${k}';zpShopRender(zpShopEl())">${n}${k === 'inv' && cnt ? ` ${cnt}` : ''}</button>`).join('')}</div>
   <p class="text-[12px] text-[#8B95A1] mt-3 mb-3 px-1">${note}</p>
   <div class="zp-grid">${list.map(([id, it]) => {
    const own = zp.owned.has(id), on = (it.k === 'theme' && eq.theme === id) || (it.k === 'patch' && zpPatches(eq).includes(id));
    let btn;
    if (!inv) btn = own ? `<button disabled class="bg-[#F2F3F5] text-[#8B95A1]">구매 완료</button>` : `<button onclick="zpBuy('${id}')" class="text-white" style="background:#191F28">구매하기</button>`;
    else btn = it.k === 'patch' ? `<button onclick="zpPatchToggle('${id}')" class="${on ? 'bg-[#F2F3F5] text-[#4E5968]' : 'text-white'}" ${on ? '' : 'style="background:var(--mil-green,#4E5B3A)"'}>${on ? '떼기' : '달기'}</button>` : it.k === 'theme' ? `<button onclick="zpEquip('theme',${on ? 'null' : `'${id}'`})" class="${on ? 'bg-[#F2F3F5] text-[#4E5968]' : 'text-white'}" ${on ? '' : 'style="background:var(--mil-green,#4E5B3A)"'}>${on ? '착용 해제' : '착용하기'}</button>` : it.k === 'frame' ? `<button onclick="zpPCEdit(null,'${id}')" class="text-white" style="background:var(--mil-green,#4E5B3A)">포토카드 만들기</button>` : `<button disabled class="bg-[#F2F3F5] text-[#8B95A1]">꾸미기에서 사용</button>`;
    const tag = inv ? (on ? `<span class="text-[#3B8A5A]">${it.k === 'patch' ? '프로필에 다는 중' : '착용 중'}</span>` : '<span class="text-[#8B95A1]">보관 중</span>') : own ? '<span class="text-[#3B8A5A]">구매 완료</span>' : zpMug() + zpFmt(zp.price[id]);
    return `<div class="zp-item"><button class="pv" onclick="zpPreview('${id}')">${zpPV(id, it)}<span class="zp-pvl">미리보기</span></button><div class="nm">${esc(it.n)}</div><div class="pr">${tag}</div>${btn}</div>`;
  }).join('') || `<div class="col-span-2 text-center text-[13px] text-[#8B95A1] py-10">${inv ? '아직 산 아이템이 없어요' : '곧 새 상품이 들어와요'}</div>`}</div><div class="h-6"></div>`;
}
/* 미리보기 */
function zpPreview(id) {
  const it = zpItem(id); if (!it) return; const own = zp.owned.has(id);
  const ov = document.createElement('div'); ov.className = 'zp-ov'; ov.onclick = e => { if (e.target === ov) ov.remove(); };
  let stage = '';
  if (it.k === 'theme' || it.k === 'patch') {
    const src = document.querySelector((me.gender === 'F' ? '#gf-profile-card' : '#soldier-card') + ' .pcard');
    stage = `<div class="zp-pvs" style="width:min(86vw,340px)"></div>`;
    setTimeout(() => {
      const box = ov.querySelector('.zp-pvs'); if (!box) return; let card;
      if (src && src.offsetParent !== null) { card = src.cloneNode(true); card.querySelectorAll('[id]').forEach(e => e.removeAttribute('id')); card.querySelectorAll('button,input').forEach(e => { e.disabled = true; e.style.pointerEvents = 'none'; }); delete card.dataset.bg0; delete card.dataset.c0; card.style.background = src.dataset.bg0 !== undefined ? src.dataset.bg0 : src.style.background; card.style.color = src.dataset.c0 || ''; }
      else { card = document.createElement('div'); card.className = 'pcard'; card.style.background = 'linear-gradient(155deg,var(--mil-dark,#3B4630) 0%,var(--mil-dark2,#2C3424) 100%)'; card.innerHTML = `<div class="text-[11px] font-semibold" style="opacity:.7">대한민국 육군</div><div class="text-[25px] font-extrabold mt-1">${esc(me.nickname || '이름')}</div><div class="pbar mt-4"><div style="position:absolute;inset:0 40% 0 0;background:var(--mil-green,#6B7B5C)"></div><div class="relative px-3.5 h-full flex items-center text-[17px] font-black">60%</div></div>`; }
      card.style.height = 'auto'; card.style.minHeight = '200px'; box.appendChild(card);
      const eq = (me && me.equip) || {}, pl = zpPatches(eq).filter(x => x !== id); if (it.k === 'patch') { if (pl.length >= 3) pl.pop(); pl.push(id); } zpStyleCard(card, it.k === 'theme' ? id : eq.theme, pl);
    }, 0);
  } else if (it.k === 'frame') stage = `<div style="width:min(62vw,240px)">${zpPCHTML({ frame: id, photo: null, deco: { cap: '미리보기' } })}</div>`;
  else stage = `<div class="flex flex-wrap gap-4 justify-center" style="max-width:280px">${Object.keys(ZP_STK).filter(k => ZP_STK[k].p === id).map(k => `<span style="width:72px;height:72px;display:inline-block">${zpStkSVG(k)}</span>`).join('')}</div>`;
  ov.innerHTML = `<div class="text-[13px] font-bold opacity-70 mb-3">미리보기</div>${stage}<div class="text-[20px] font-extrabold mt-5">${esc(it.n)}</div><div class="flex items-center gap-1.5 mt-1 text-[14px] font-bold opacity-80">${own ? '구매 완료' : zpMug() + zpFmt(zp.price[id])}</div>
   <div class="flex gap-2 mt-6">${own ? `<button class="ok" style="margin:0;padding:13px 30px;opacity:.55" disabled>구매 완료</button>` : `<button class="ok" style="margin:0;padding:13px 30px" onclick="this.closest('.zp-ov').remove();zpBuy('${id}')">구매하기</button>`}<button class="ok" style="margin:0;padding:13px 24px;background:rgba(255,255,255,.16);color:#fff" onclick="this.closest('.zp-ov').remove()">닫기</button></div>`;
  document.body.appendChild(ov);
}
function zpUseTh() { const id = (typeof stSel !== 'undefined' && myRow(stSel)) ? stSel : (myStars[0] && myStars[0].id); if (!id) return zpToast('MY스타를 먼저 등록해주세요'); thSheet(id); }
async function zpBuy(id, quiet) {
  const it = zpItem(id), p = zp.price[id]; if (!it || p === undefined) return false;
  if ((zp.bal || 0) < p) { showAlert('무궁화가 부족해요', `${esc(it.n)}은(는) 무궁화 <b>${zpFmt(p)}</b>개가 필요해요.<br>지금 ${zpFmt(zp.bal)}개 · 매일 출석체크로 모을 수 있어요.`); return false; }
  if (!(await zConfirm(`${it.n}${hasBat(it.n) ? "을" : "를"} 살까요?\n무궁화 ${p}개가 사용돼요.`, { ok: '구매하기' }))) return false;
  const { data, error } = await sb.rpc('shop_buy', { item: id });
  if (error) { showAlert('구매 실패', /enough/.test(error.message) ? '무궁화가 부족해요.' : /owned/.test(error.message) ? '이미 가지고 있어요.' : '잠시 후 다시 시도해주세요.'); return false; }
  zp.owned.add(id); zpSetBal(data.balance, true); zpToast(`${it.n} 구매 완료!`);
  if (quiet) return true;
  if (it.k === 'theme') { await zpEquip('theme', id, true); zpToast(`${it.n} 착용! 보관함에서 바꿀 수 있어요`); }
  else if (it.k === 'patch') { if (zpPatches(me.equip).length < 3) { await zpEquip('patch', id, true); zpToast(`${it.n}을(를) 프로필에 달았어요`.replace('을(를)', hasBat(it.n) ? '을' : '를')); } else zpToast('패치는 3개까지 · 보관함에서 바꿔 달 수 있어요'); }
  zpShopRender(zpShopEl());
  if (zpFan()) zpPCHome();
  return true;
}
async function zpPatchToggle(id) {
  const on = zpPatches(me.equip).includes(id);
  if (!on && zpPatches(me.equip).length >= 3) return showAlert('패치는 3개까지', '프로필에는 패치·배지를 3개까지 달 수 있어요.<br>달려 있는 것 중 하나를 먼저 떼주세요.');
  await zpEquip(on ? 'patch_off' : 'patch', id);
}
async function zpEquip(slot, id, quiet) {
  const { data, error } = await sb.rpc('shop_equip', { slot, item: id });
  if (error) return showAlert('오류', '잠시 후 다시 시도해주세요.');
  me.equip = data || {}; zpApplyEquip(); if (!quiet) zpToast(slot === 'patch' ? '프로필에 달았어요' : slot === 'patch_off' ? '뗐어요' : id ? '착용했어요' : '해제했어요');
  if (!quiet) zpShopRender(zpShopEl());
}

/* ---------- 포토카드 ---------- */
const ZP_INS = {"pf_amethyst": [11.3, 1.7, 6.2, 4.3], "pf_antique": [7.2, 2.3, 7.8, 0.7], "pf_blackcat": [6.9, 2.5, 6.2, 2.7], "pf_candy": [7.8, 3.0, 6.4, 1.8], "pf_clover": [4.3, 3.3, 5.0, 1.2], "pf_cookie": [7.4, 0.7, 5.9, 3.5], "pf_galaxy": [5.3, 0.7, 4.7, 1.8], "pf_gamer": [8.3, 4.7, 9.2, 5.0], "pf_gothic": [6.6, 2.2, 2.2, 1.8], "pf_ice": [20.4, 18.7, 7.6, 3.0], "pf_rainbow": [5.2, 0.5, 5.1, 0.0], "pf_ribbon": [6.8, 2.2, 5.8, 3.0], "pf_seashell": [5.4, 2.7, 6.4, 1.8], "pf_silver": [7.1, 3.2, 6.2, 4.8], "pf_silverfly": [10.3, 3.3, 5.0, 3.2], "pf_aqua": [8.0, 3.0, 6.3, 3.2], "pf_opal": [10.9, 4.2, 7.8, 5.2], "pf_aurora": [10.7, 4.8, 6.8, 3.5], "pf_mermaid": [7.9, 2.3, 5.6, 2.7], "pf_angelheart": [8.2, 2.3, 5.1, 2.7], "pf_mint": [9.4, 2.8, 8.0, 2.7], "pf_icefly": [9.9, 11.3, 3.4, 3.2]};
const ZP_TW = [[9, 6], [88, 9], [94, 42], [6, 58], [90, 88], [14, 93], [50, 4], [52, 96]];
function zpPCHTML(c, mini, edit) {
  const d = c.deco || {}, fr = ZP_ITEMS[c.frame] ? c.frame : 'pc_basic';
  const photo = c.photo && /^data:image\/jpeg;base64,/.test(c.photo) ? c.photo : '';
  const sk = (d.st || []).map((s, i) => `<div class="sk ${edit && edit.sel === i ? 'sel' : ''}" data-i="${i}" style="left:${+s[1] || 50}%;top:${+s[2] || 50}%;--s:${Math.min(2.2, Math.max(.5, +s[3] || 1))}">${zpStkSVG(String(s[0]))}</div>`).join('');
  const it = ZP_ITEMS[fr]; let ov = '';
  if (it.img) {
    const u = `${fr}.webp?v=4`; ov = `<i class="fimg" style="background-image:url('${u}')"></i>`;
    if (it.gem) ov += `<i class="gl" style="-webkit-mask-image:url('${u}');mask-image:url('${u}')"></i>` + ZP_TW.map(([x, y], i) => `<i class="tw" style="left:${x}%;top:${y}%;animation-delay:${(i * .37).toFixed(2)}s"></i>`).join('');
  }
  return `<div class="pc2 pcf-${fr}${it.img ? ' pfi' : ''}${ZP_INS[fr] ? ' fit' : ''}">${fr === 'pc_army' ? '<i class="tag"></i>' : ''}<div class="ph ${photo ? '' : 'empty'}" style="${ZP_INS[fr] ? `inset:${ZP_INS[fr][0]}% ${ZP_INS[fr][1]}% ${ZP_INS[fr][2]}% ${ZP_INS[fr][3]}%;border-radius:4cqw;` : ''}${photo ? `background-image:url('${photo}')` : ''}">${photo ? '' : (mini ? '' : '사진을 넣어주세요')}</div>${ov}<div class="lay">${sk}</div>${d.cap ? `<div class="cap">${esc(String(d.cap).slice(0, 24))}</div>` : ''}</div>`;
}
function zpPCHome() {
  const box = q('zp-pc-home'); if (!box) return;
  if (!zp.pcs.length) { box.innerHTML = `<button class="zp-pc-add" style="min-height:236px" onclick="zpPCNew()"><span class="plus">+</span><b class="text-[15px] text-[#191F28]">무궁화를 모으고 포토카드를 만들어 추가하세요</b><span class="text-[12px]">상점에서 포토카드 틀을 사면 원하는 사진으로 꾸밀 수 있어요</span></button>`; return; }
  /* 큰 포토카드 한 장 · 옆으로 밀면 큐브처럼 돌아가요 (마지막 면은 새 포토카드 추가) */
  const W = Math.min(innerWidth * .74, 300), n = zp.pcs.length + 1;
  zp.pcIdx = Math.min(zp.pcIdx || 0, n - 1);
  box.innerHTML = `<div class="zp-pchome"><div class="cw" style="width:${W}px;height:${W * 1.5}px"><div class="cube"><div class="face f0"></div><div class="face f1"></div></div></div><div class="dots"></div></div>`;
  const face = i => i < zp.pcs.length ? zpPCHTML(zp.pcs[i]) : `<div class="zp-pc-add" style="height:100%;border-radius:14px;padding:20px"><span class="plus">+</span><b class="text-[14px] text-[#191F28]">새 포토카드 만들기</b><span class="text-[11px]">상점에서 틀을 사면 원하는 사진으로 꾸밀 수 있어요</span></div>`;
  zpCube(box.querySelector('.cw'), { n, idx: zp.pcIdx, face, onIndex: i => { zp.pcIdx = i; const d = box.querySelector('.dots'); if (d) d.innerHTML = n > 1 ? Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''} ${k === n - 1 ? 'add' : ''}"></i>`).join('') : ''; }, onTap: i => i < zp.pcs.length ? zpPCView(zp.pcs[i].id) : zpPCNew() });
}
function zpPCNew() {
  const fr = Object.keys(ZP_ITEMS).filter(k => ZP_ITEMS[k].k === 'frame' && zp.owned.has(k));
  if (!fr.length) { zpToast('먼저 상점에서 포토카드 틀을 골라주세요'); return zpOpenShop('frame'); }
  zpPCEdit(null, fr[0]);
}
/* 포토카드 크게 보기 — 옆으로 밀면 큐브처럼 돌아가며 다음 카드로 */
/* 큐브 넘기기 (홈 · 크게 보기 공용) */
function zpCube(cw, o) {
  const cube = cw.querySelector('.cube'), f0 = cw.querySelector('.f0'), f1 = cw.querySelector('.f1'), W = cw.offsetWidth || parseFloat(cw.style.width), half = W / 2;
  let idx = o.idx || 0, busy = false;
  const setA = (a, anim) => { cube.style.transition = anim ? 'transform .55s cubic-bezier(.3,.9,.3,1)' : 'none'; cube.style.transform = `translateZ(${-half}px) rotateY(${a}deg)`; const k = Math.min(1, Math.abs(a) / 90); f0.style.setProperty('--sh', k.toFixed(3)); f1.style.setProperty('--sh', (1 - k).toFixed(3)); };
  const paint = () => { f0.innerHTML = o.face(idx); f0.style.transform = `rotateY(0deg) translateZ(${half}px)`; f1.style.visibility = 'hidden'; setA(0, false); o.onIndex && o.onIndex(idx); };
  const side = dir => { const j = idx + dir; if (j < 0 || j >= o.n) return false; f1.innerHTML = o.face(j); f1.style.transform = `rotateY(${dir * 90}deg) translateZ(${half}px)`; f1.style.visibility = 'visible'; return true; };
  const go = dir => { if (busy) return; if (!side(dir)) { setA(dir * -8, true); setTimeout(() => setA(0, true), 160); return; } busy = true; setA(-dir * 90, true); setTimeout(() => { idx += dir; paint(); busy = false; }, 560); };
  paint();
  let sx = null, sy = 0, dx = 0, dir = 0, ok = false, horiz = null;
  cw.addEventListener('pointerdown', e => { if (busy) return; sx = e.clientX; sy = e.clientY; dx = 0; dir = 0; horiz = null; });
  cw.addEventListener('pointermove', e => {
    if (sx === null) return; dx = e.clientX - sx; const dy = e.clientY - sy;
    if (horiz === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) { horiz = Math.abs(dx) > Math.abs(dy); if (horiz) try { cw.setPointerCapture(e.pointerId); } catch (x) { } }
    if (!horiz) return;
    const d = dx < 0 ? 1 : -1; if (d !== dir) { dir = d; ok = side(dir); }
    setA(ok ? Math.max(-90, Math.min(90, dx / W * 110)) : dx / W * 18, false);
  });
  const end = () => {
    if (sx === null) return; const was = horiz; sx = null;
    if (!was) { if (Math.abs(dx) < 6 && o.onTap) o.onTap(idx); return; }
    if (ok && Math.abs(dx) > W * .22) { busy = true; setA(-dir * 90, true); setTimeout(() => { idx += dir; paint(); busy = false; }, 560); } else setA(0, true);
  };
  cw.addEventListener('pointerup', end); cw.addEventListener('pointercancel', () => { sx = null; setA(0, true); });
  return { go, get idx() { return idx; } };
}
/* 포토카드 크게 보기 */
function zpPCView(id) {
  let idx = zp.pcs.findIndex(x => x.id === id); if (idx < 0) return;
  const ov = document.createElement('div'); ov.className = 'zp-ov zp-pcv';
  const W = Math.min(innerWidth * .72, 290);
  ov.innerHTML = `<button class="x" aria-label="닫기">×</button><div class="cw" style="width:${W}px;height:${W * 1.5}px"><div class="cube"><div class="face f0"></div><div class="face f1"></div></div></div>
   <div class="nav"><button class="pv" aria-label="이전">‹</button><div class="dots"></div><button class="nx" aria-label="다음">›</button></div>
   <div class="flex gap-2 mt-5"><button class="ok ed" style="margin:0;padding:13px 26px">꾸미기</button><button class="ok dl" style="margin:0;padding:13px 22px;background:rgba(255,255,255,.16);color:#fff">삭제</button></div>`;
  document.body.appendChild(ov);
  const C = zpCube(ov.querySelector('.cw'), { n: zp.pcs.length, idx, face: i => zpPCHTML(zp.pcs[i]), onIndex: i => { idx = i; ov.querySelector('.dots').innerHTML = zp.pcs.length > 1 ? zp.pcs.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('') : ''; ov.querySelector('.pv').style.opacity = i > 0 ? 1 : .25; ov.querySelector('.nx').style.opacity = i < zp.pcs.length - 1 ? 1 : .25; } });
  ov.querySelector('.pv').onclick = () => C.go(-1); ov.querySelector('.nx').onclick = () => C.go(1);
  ov.querySelector('.x').onclick = () => ov.remove(); ov.onclick = e => { if (e.target === ov) ov.remove(); };
  ov.querySelector('.ed').onclick = () => { const c = zp.pcs[idx]; ov.remove(); zpPCEdit(c.id); };
  ov.querySelector('.dl').onclick = e => zpPCDel(zp.pcs[idx].id, e.currentTarget);
}
async function zpPCDel(id, b) {
  if (!(await zConfirm('이 포토카드를 삭제할까요?', { ok: '삭제', danger: true }))) return;
  const { error } = await sb.from('photocards').delete().eq('id', id); if (error) return showAlert('오류', '삭제하지 못했어요.');
  zp.pcs = zp.pcs.filter(x => x.id !== id); b.closest('.zp-ov').remove(); zpPCHome();
}
let zpE = null;
function zpPCEdit(id, frame) {
  const c = id ? zp.pcs.find(x => x.id === id) : null;
  zpE = { id: id || null, frame: c ? c.frame : frame, photo: c ? c.photo : null, deco: JSON.parse(JSON.stringify((c && c.deco) || { cap: '', st: [] })), sel: -1, sid: c ? c.star_id : (myStars[0] && myStars[0].id) || null };
  zpE.deco.st = zpE.deco.st || [];
  let m = q('zp-pce');
  if (!m) { m = document.createElement('div'); m.id = 'zp-pce'; m.className = 'fixed inset-0 hidden flex-col'; m.style.cssText = 'z-index:80;background:var(--bg-main)'; document.body.appendChild(m); }
  if (q('zp-shop-m')) closeModal('zp-shop-m'); openM('zp-pce'); zpPCERender();
}
function zpPCERender() {
  const m = q('zp-pce'), E = zpE, frames = Object.keys(ZP_ITEMS).filter(k => ZP_ITEMS[k].k === 'frame'), stk = Object.keys(ZP_STK).filter(k => !ZP_STK[k].p || zp.owned.has(ZP_STK[k].p));
  m.innerHTML = `<div class="relative flex items-center justify-between px-4 pb-2" style="padding-top:max(14px,env(safe-area-inset-top))"><button onclick="closeModal('zp-pce')" class="w-10 h-10 rounded-full bg-white border border-[#E5E8EB] font-bold text-[18px]">‹</button><div class="font-extrabold text-[17px]">포토카드 꾸미기</div><button id="zp-pce-save" onclick="zpPCSave()" class="h-10 px-4 rounded-full bg-[#191F28] text-white text-[14px] font-bold">저장</button></div>
  <div class="flex-1 overflow-y-auto px-5" style="padding-bottom:max(24px,env(safe-area-inset-bottom))">
   <div id="zp-pce-card" style="width:min(62vw,250px);margin:8px auto 0">${zpPCHTML(E, false, E)}</div>
   <p class="text-center text-[11px] text-[#8B95A1] mt-2">스티커를 끌어서 옮기고, 눌러서 고를 수 있어요</p>
   <label class="block mt-4 h-12 rounded-2xl bg-white border border-[#E5E8EB] text-[14px] font-bold flex items-center justify-center gap-2 cursor-pointer"><input type="file" accept="image/*" class="hidden" onchange="zpPCPhoto(this)">${E.photo ? '사진 바꾸기' : '사진 넣기'}</label>
   <div class="text-[13px] font-extrabold mt-5 mb-2">틀</div>
   <div class="zp-chips">${frames.map(k => { const own = zp.owned.has(k); return `<button class="${E.frame === k ? 'on' : ''}" onclick="${own ? `zpE.frame='${k}';zpPCERender()` : `zpOpenShop('frame')`}">${esc(ZP_ITEMS[k].n)}${own ? '' : ' · 잠김'}</button>`; }).join('')}</div>
   <div class="text-[13px] font-extrabold mt-5 mb-2">문구</div>
   <input id="zp-pce-cap" maxlength="24" value="${esc(E.deco.cap || '')}" oninput="zpE.deco.cap=this.value.replace(/[<>]/g,'');zpPCECard()" placeholder="예) 기다릴게, 무사히만 돌아와" class="inp">
   <div class="text-[13px] font-extrabold mt-5 mb-2">스티커 <span class="text-[11px] text-[#8B95A1] font-semibold">눌러서 붙이기 · 최대 12개</span></div>
   <div class="flex flex-wrap gap-2">${stk.map(k => `<button onclick="zpStkAdd('${k}')" class="zp-stb">${zpStkSVG(k)}</button>`).join('')}<button onclick="zpOpenShop('sticker')" class="h-12 px-3 rounded-2xl bg-[#F2F3F5] text-[12px] font-bold text-[#4E5968]">더 받기</button></div>
   <div id="zp-pce-tools" class="${E.sel >= 0 ? '' : 'hidden'} mt-4 flex items-center gap-3 bg-white border border-[#E5E8EB] rounded-2xl p-3"><span class="text-[12px] font-bold text-[#4E5968]">크기</span><input type="range" min="0.5" max="2.2" step="0.05" value="${E.sel >= 0 ? (E.deco.st[E.sel][3] || 1) : 1}" oninput="if(zpE.sel>=0){zpE.deco.st[zpE.sel][3]=+this.value;zpPCECard()}" class="flex-1"><button onclick="zpE.deco.st.splice(zpE.sel,1);zpE.sel=-1;zpPCERender()" class="text-[12px] font-bold text-[#E5484D]">지우기</button></div>
   ${E.id ? `<button onclick="zpPCDel(${E.id},{closest:()=>({remove(){closeModal('zp-pce')}})})" class="w-full mt-6 text-[13px] text-[#8B95A1] underline">이 포토카드 삭제</button>` : ''}
  </div>`;
  zpPCEBind();
}
function zpPCECard() { const c = q('zp-pce-card'); if (c) { c.innerHTML = zpPCHTML(zpE, false, zpE); zpPCEBind(); } }
function zpStkAdd(k) { if (zpE.deco.st.length >= 12) return zpToast('스티커는 12개까지 붙일 수 있어요'); zpE.deco.st.push([k, 30 + Math.random() * 40, 25 + Math.random() * 45, 1]); zpE.sel = zpE.deco.st.length - 1; zpPCERender(); }
function zpPCEBind() {
  const card = document.querySelector('#zp-pce-card .pc2'); if (!card) return;
  card.querySelectorAll('.sk').forEach(el => {
    el.onpointerdown = ev => {
      ev.preventDefault(); const i = +el.dataset.i, r = card.getBoundingClientRect(); let moved = false; el.setPointerCapture(ev.pointerId);
      const mv = e => { moved = true; const x = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)), y = Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100)); zpE.deco.st[i][1] = +x.toFixed(1); zpE.deco.st[i][2] = +y.toFixed(1); el.style.left = x + '%'; el.style.top = y + '%'; };
      const up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); zpE.sel = i; if (!moved || zpE.sel !== i) zpPCERender(); else { card.querySelectorAll('.sk').forEach(s => s.classList.toggle('sel', +s.dataset.i === i)); const t = q('zp-pce-tools'); if (t) t.classList.remove('hidden'); } };
      el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    };
  });
}
function zpPCPhoto(inp) {
  const f = inp.files && inp.files[0]; inp.value = ''; if (!f || (typeof fileOK === 'function' && !fileOK(f, 'img'))) return;
  const url = URL.createObjectURL(f), im = new Image();
  im.onload = () => { const W = 600, H = 900, c = document.createElement('canvas'); c.width = W; c.height = H; const s = Math.max(W / im.width, H / im.height), w = im.width * s, h = im.height * s; c.getContext('2d').drawImage(im, (W - w) / 2, (H - h) / 2, w, h); let u = c.toDataURL('image/jpeg', .82); if (u.length > 560000) u = c.toDataURL('image/jpeg', .6); zpE.photo = u; URL.revokeObjectURL(url); zpPCERender(); };
  im.onerror = () => showAlert('알림', '사진을 열 수 없어요. 다른 사진을 골라주세요.'); im.src = url;
}
async function zpPCSave() {
  const b = q('zp-pce-save'); if (!zpE.photo) return showAlert('알림', '먼저 사진을 넣어주세요.'); b.disabled = true; b.innerText = '저장 중…';
  const deco = { cap: String(zpE.deco.cap || '').slice(0, 24), st: zpE.deco.st.slice(0, 12).map(s => [String(s[0]).slice(0, 10), +s[1] || 50, +s[2] || 50, +s[3] || 1]) };
  const { data, error } = await sb.rpc('photocard_save', { pid: zpE.id, frm: zpE.frame, pic: zpE.photo, dc: deco, sid: zpE.sid });
  b.disabled = false; b.innerText = '저장';
  if (error) return showAlert('저장 실패', /frame/.test(error.message) ? '이 틀을 먼저 상점에서 사주세요.' : /many/.test(error.message) ? '포토카드는 40장까지 만들 수 있어요.' : '잠시 후 다시 시도해주세요.');
  await zpLoadPCs(); closeModal('zp-pce'); zpPCHome(); zpToast('포토카드를 저장했어요');
  if (typeof curTab !== 'undefined' && curTab !== 'home') switchTab('home');
}

/* ---------- 날씨 켜기/끄기 (설정) ---------- */
const zpWxKey = () => 'zt_wx_on:' + (me ? me.id : '');
function zpWxOn() { try { return localStorage.getItem(zpWxKey()) !== '0'; } catch (e) { return true; } }
function zpWxToggle() { const on = !zpWxOn(); try { localStorage.setItem(zpWxKey(), on ? '1' : '0'); } catch (e) { } if (typeof renderSetRows === 'function') renderSetRows(); zpToast(on ? '날씨 표시를 켰어요' : '날씨 표시를 껐어요'); zpRender(); }

/* ---------- 최애 부대 날씨 ---------- */
const ZP_REG = { 철원: [38.146, 127.313], 연천: [38.096, 127.075], 포천: [37.894, 127.2], 파주: [37.76, 126.78], 화천: [38.106, 127.708], 양구: [38.11, 127.99], 인제: [38.069, 128.17], '고성(강원)': [38.38, 128.468], 춘천: [37.881, 127.73], 홍천: [37.697, 127.889], 횡성: [37.491, 127.985], 원주: [37.342, 127.92], 가평: [37.831, 127.51], 양주: [37.785, 127.046], 동두천: [37.904, 127.061], 의정부: [37.738, 127.034], 김포: [37.615, 126.716], 강화: [37.747, 126.488], 서울: [37.566, 126.978], 용산: [37.532, 126.99], 수원: [37.264, 127.029], 화성: [37.2, 126.831], 오산: [37.15, 127.077], 평택: [36.992, 127.113], 이천: [37.272, 127.435], '논산(육군훈련소)': [36.187, 127.099], 계룡: [36.275, 127.249], 대전: [36.351, 127.385], 청주: [36.642, 127.489], 서산: [36.785, 126.45], 익산: [36.948, 126.957], 강릉: [37.751, 128.876], 속초: [38.207, 128.591], 상주: [36.41, 128.159], 예천: [36.658, 128.452], 대구: [35.871, 128.601], '포항(해병대)': [36.019, 129.343], '진해(해군)': [35.133, 128.71], 창원: [35.228, 128.681], 김해: [35.228, 128.889], 부산: [35.18, 129.076], 사천: [35.004, 128.065], 진주: [35.18, 128.107], 목포: [34.812, 126.392], 광주: [35.16, 126.851], 제주: [33.499, 126.531], 백령도: [37.959, 124.665], 연평도: [37.665, 125.7], 울릉도: [37.484, 130.905] };
const zpRegKey = () => 'zt_wxreg:' + (me ? me.id : '');
function zpRegOf(id) { const r = myRow(id); if (r && r.region && ZP_REG[r.region]) return r.region; try { const v = JSON.parse(localStorage.getItem(zpRegKey()) || '{}')[id]; return ZP_REG[v] ? v : ''; } catch (e) { return ''; } }
async function zpSetReg(id, v) {
  if (v && !ZP_REG[v]) return; try { const m = JSON.parse(localStorage.getItem(zpRegKey()) || '{}'); if (v) m[id] = v; else delete m[id]; localStorage.setItem(zpRegKey(), JSON.stringify(m)); } catch (e) { }
  const r = myRow(id); if (r) r.region = v || null;
  try { await sb.from('star_fans').update({ region: v || null }).eq('user_id', me.id).eq('star_id', id); } catch (e) { }
  zpWxTab(); zpWxHome();
}
const zpWxCache = {};
async function zpWx(reg, ll) {
  const p = ll || ZP_REG[reg]; if (!p) return null; const k = 'zt_wx:' + reg;
  if (zpWxCache[reg] && Date.now() - zpWxCache[reg].t < 20 * 60e3) return zpWxCache[reg];
  try { const c = JSON.parse(localStorage.getItem(k) || 'null'); if (c && Date.now() - c.t < 20 * 60e3) return (zpWxCache[reg] = c); } catch (e) { }
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p[0]}&longitude=${p[1]}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=Asia%2FSeoul&forecast_days=2`);
    const j = await r.json(); if (!j.current) return null;
    const d = { t: Date.now(), tc: Math.round(j.current.temperature_2m), fl: Math.round(j.current.apparent_temperature), code: j.current.weather_code, wind: Math.round(j.current.wind_speed_10m), day: j.current.is_day, hi: Math.round(j.daily.temperature_2m_max[0]), lo: Math.round(j.daily.temperature_2m_min[0]), pop: j.daily.precipitation_probability_max[0], tm: { hi: Math.round(j.daily.temperature_2m_max[1]), lo: Math.round(j.daily.temperature_2m_min[1]), code: j.daily.weather_code[1] } };
    try { localStorage.setItem(k, JSON.stringify(d)); } catch (e) { } return (zpWxCache[reg] = d);
  } catch (e) { return null; }
}
const zpKind = c => c >= 95 ? 'storm' : (c >= 71 && c <= 77) || c === 85 || c === 86 ? 'snow' : (c >= 51 && c <= 67) || (c >= 80 && c <= 82) ? 'rain' : c === 45 || c === 48 ? 'fog' : c >= 2 ? 'cloud' : 'sun';
const ZP_KN = { sun: '맑음', cloud: '흐림', rain: '비', snow: '눈', storm: '뇌우', fog: '안개' };
function zpWxIcon(k, day) {
  const sun = '<circle cx="12" cy="12" r="4.5" fill="#F2BA49"/><g stroke="#F2BA49" stroke-width="1.8" stroke-linecap="round">' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="12" y1="2.5" x2="12" y2="4.6" transform="rotate(${a} 12 12)"/>`).join('') + '</g>';
  const moon = '<path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 15 7 7 0 0 1 15.5 3.5z" fill="#F2D27A"/>';
  const cloud = (c = '#C9D1DA') => `<path d="M17.5 19H8a4.5 4.5 0 1 1 .8-8.9A5.5 5.5 0 0 1 19 11.8 3.6 3.6 0 0 1 17.5 19z" fill="${c}"/>`;
  const m = { sun: day === 0 ? moon : sun, cloud: `<g opacity=".9" transform="translate(-3 -3) scale(.75)">${day === 0 ? moon : sun}</g>` + cloud(), rain: cloud('#AEB8C4') + '<g stroke="#5B8FD9" stroke-width="1.6" stroke-linecap="round"><line x1="9" y1="20" x2="8" y2="23"/><line x1="13" y1="20" x2="12" y2="23"/><line x1="17" y1="20" x2="16" y2="23"/></g>', snow: cloud('#C3CCD6') + '<g fill="#8FB8E8"><circle cx="9" cy="21.5" r="1.2"/><circle cx="13" cy="22.5" r="1.2"/><circle cx="17" cy="21.5" r="1.2"/></g>', storm: cloud('#9AA4B1') + '<path d="M12.5 18l-2.5 4h2.5l-1.5 3 4-5h-2.5l1.5-2z" fill="#F2BA49"/>', fog: '<g stroke="#AEB8C4" stroke-width="2" stroke-linecap="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="2" y1="13" x2="18" y2="13"/><line x1="6" y1="17" x2="22" y2="17"/></g>' };
  return `<svg viewBox="0 0 24 24">${m[k] || m.sun}</svg>`;
}
function zpWxLine(s, reg, w) {
  const nm = starCall(s), r = reg.replace(/\(.*\)/, ''), k = zpKind(w.code), t = w.tc, A = p => callAs(nm, p), pick = a => a[(new Date().getDate() + nm.length) % a.length];
  if (k === 'snow') return pick([`오늘 ${r}은 눈이 와요. ${A('가')} 제설 안 하길 바라며…`, `${r}에 눈 소식! ${A('의')} 넉가래가 바빠지지 않기를`, `눈 오는 ${r}… ${A('는')} 따뜻한 생활관에 있길`]);
  if (k === 'rain' || k === 'storm') return pick([`${r}에 비가 와요. ${A('가')} 우산 꼭 챙겼으면`, `비 오는 ${r}, 오늘은 ${A('의')} 실내 일과를 기원해요`, `${r} 빗소리 들으며 ${A('도')} 푹 쉬었으면`]);
  if (t <= -10) return pick([`${r} 영하 ${-t}도… ${A('가')} 핫팩 꼭 챙겼길`, `${r}은 오늘 매서운 추위! ${A('의')} 내복 출동`]);
  if (t <= 0) return pick([`쌀쌀한 ${r}, ${A('가')} 감기 안 걸리길`, `${r}은 영하권이에요. 따뜻하게 입었겠지?`]);
  if (t >= 30) return pick([`${r} ${t}도 폭염! ${A('가')} 물 많이 마시길`, `더운 ${r}… ${A('의')} 그늘진 하루를 응원해요`]);
  if (k === 'fog') return `안개 낀 ${r}, ${A('가')} 오늘도 안전하게`;
  if (k === 'cloud') return pick([`흐린 ${r}이지만 ${A('의')} 하루는 맑기를`, `구름 많은 ${r}, ${A('도')} 무탈하게`]);
  return pick([`맑은 ${r}! ${A('가')} 웃는 하루였으면`, `${r}은 햇살 가득, ${A('의')} 기분도 맑음`]);
}
function zpWxStar() { const ids = myStars.map(r => r.id); const cur = (typeof stSel !== 'undefined' && ids.includes(stSel)) ? stSel : ids[0]; const order = [cur, ...ids.filter(x => x !== cur)]; return order.find(id => zpRegOf(id)) || null; }
async function zpWxHome() {
  const box = q('zp-wx-home'); if (!box || !zpFan()) return;
  if (!zpWxOn()) { box.innerHTML = ''; zpWxAnim(null); return; }
  if (!myStars.length) { box.innerHTML = ''; zpWxAnim(null); return; }
  const id = zpWxStar();
  if (!id) { box.innerHTML = `<button class="zp-wx" onclick="switchTab('weather')"><span class="ic">${zpWxIcon('cloud', 1)}</span><div class="min-w-0"><div class="text-[14px] font-extrabold">최애 부대 날씨</div><div class="text-[12px] text-[#8B95A1] mt-0.5">자대 지역을 정하면 매일 날씨를 알려드려요 ›</div></div></button>`; zpWxAnim(null); return; }
  const s = starK[id], reg = zpRegOf(id), w = await zpWx(reg); if (!w || !q('zp-wx-home')) return;
  const k = zpKind(w.code);
  box.innerHTML = `<button class="zp-wx" onclick="switchTab('weather')"><span class="ic">${zpWxIcon(k, w.day)}</span><div class="min-w-0 flex-1"><div class="flex items-baseline gap-2"><span class="t">${w.tc}°</span><span class="text-[13px] font-bold text-[#4E5968]">${esc(reg.replace(/\(.*\)/, ''))} · ${ZP_KN[k]}</span></div><div class="text-[12.5px] text-[#4E5968] mt-0.5 truncate">${esc(zpWxLine(s, reg, w))}</div></div></button>`;
  zpWxAnim(k);
}
async function zpWxTab() {
  const el = q('tab-weather'); if (!el) return;
  if (!myStars.length) { el.innerHTML = `<div class="zp-card text-center py-10 mt-2"><div class="text-[16px] font-extrabold">MY스타를 먼저 등록해주세요</div><button onclick="starFlow()" class="mt-4 px-5 h-11 rounded-full text-[13px] font-extrabold text-white" style="background:#191F28">MY스타 등록하기</button></div>`; return; }
  const regs = Object.keys(ZP_REG);
  el.innerHTML = `<div class="px-1 mt-2 mb-3"><h2 class="text-[20px] font-extrabold">최애 부대 날씨</h2><p class="text-[12px] text-[#8B95A1] mt-1">최애의 자대 지역을 고르면 홈에 날씨와 한마디를 띄워줘요. 정확한 부대 위치는 공개되지 않으니 지역만 골라주세요.</p></div>` +
    myStars.map(r => { const s = starK[r.id]; if (!s) return ''; const reg = zpRegOf(r.id); return `<div class="zp-card mb-3" id="zp-wxc-${r.id}"><div class="flex items-center justify-between gap-3"><div class="text-[16px] font-extrabold">${esc(s.n)}</div><select onchange="zpSetReg('${r.id}',this.value)" class="h-9 rounded-xl bg-[#F5F6F8] px-3 text-[13px] font-bold outline-none"><option value="">지역 선택</option>${regs.map(x => `<option ${x === reg ? 'selected' : ''}>${x}</option>`).join('')}</select></div><div class="zp-wxb mt-3 text-[13px] text-[#8B95A1]">${reg ? '날씨를 불러오는 중…' : '자대 지역을 골라주세요'}</div></div>`; }).join('');
  for (const r of myStars) {
    const reg = zpRegOf(r.id), s = starK[r.id]; if (!reg || !s) continue; const w = await zpWx(reg), b = document.querySelector('#zp-wxc-' + r.id + ' .zp-wxb'); if (!b) continue;
    if (!w) { b.textContent = '날씨를 불러오지 못했어요'; continue; }
    const k = zpKind(w.code), tk = zpKind(w.tm.code);
    b.outerHTML = `<div class="mt-3 flex items-center gap-3"><span style="width:56px;height:56px">${zpWxIcon(k, w.day)}</span><div><div class="flex items-baseline gap-2"><span class="text-[34px] font-black tracking-tight">${w.tc}°</span><span class="text-[14px] font-bold text-[#4E5968]">${ZP_KN[k]}</span></div><div class="text-[12px] text-[#8B95A1]">체감 ${w.fl}° · 최고 ${w.hi}° / 최저 ${w.lo}° · 강수 ${w.pop ?? 0}% · 바람 ${w.wind}km/h</div></div></div>
     <div class="mt-3 rounded-2xl bg-[#F5F6F8] px-4 py-3 text-[14px] font-bold leading-relaxed">${esc(zpWxLine(s, reg, w))}</div>
     <div class="mt-2 text-[12px] text-[#8B95A1] flex items-center gap-1.5"><span style="width:18px;height:18px">${zpWxIcon(tk, 1)}</span>내일 ${ZP_KN[tk]} · ${w.tm.hi}° / ${w.tm.lo}°</div>`;
  }
  const cr = document.createElement('p'); cr.className = 'text-[11px] text-[#B0B8C1] text-center mt-2 mb-6'; cr.textContent = '날씨 정보: Open-Meteo'; el.appendChild(cr);
}

/* 홈 날씨 애니메이션 — 프로필 카드 위에는 그리지 않아요 */
let zpAn = { k: null, raf: 0, parts: [], cap: [], flash: 0 };
function zpWxAnim(k) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) k = null;
  const onHome = typeof curTab === 'undefined' || curTab === 'home';
  if (!k || !onHome || !zpWxOn()) { cancelAnimationFrame(zpAn.raf); zpAn.raf = 0; const c = q('zp-wxc'); if (c) c.remove(); zpAn.k = null; return; }
  let cv = q('zp-wxc'); if (!cv) { cv = document.createElement('canvas'); cv.id = 'zp-wxc'; document.body.appendChild(cv); }
  if (zpAn.k !== k) { zpAn.k = k; zpAn.parts = []; zpAn.cap = []; }
  if (!zpAn.raf) zpAn.raf = requestAnimationFrame(zpWxFrame);
}
function zpWxFrame() {
  const cv = q('zp-wxc'); if (!cv || !zpAn.k) { zpAn.raf = 0; return; }
  zpAn.raf = requestAnimationFrame(zpWxFrame); if (document.hidden) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1), W = innerWidth, H = innerHeight;
  if (cv.width !== W * dpr || cv.height !== H * dpr) { cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; zpAn.cap = []; }
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
  let R = null;
  if (zpFan()) { const sh = q('star-home'); R = sh && !sh.classList.contains('hidden') ? sh.querySelector('.stk') : null; }
  else { const cs = [...document.querySelectorAll('#profile-container .pg:not(.hidden) .pcard')]; R = cs.find(c => { const r = c.getBoundingClientRect(); return r.right > 20 && r.left < innerWidth - 20; }) || null; }
  const rc = R ? R.getBoundingClientRect() : null;
  const k = zpAn.k, P = zpAn.parts, want = k === 'snow' ? 70 : k === 'sun' ? 22 : (k === 'cloud' || k === 'fog') ? 7 : 90;
  while (P.length < want) P.push(k === 'snow' ? { x: Math.random() * W, y: -Math.random() * H, r: 1.2 + Math.random() * 2.6, v: .5 + Math.random() * 1.1, w: Math.random() * 6.28 }
    : k === 'sun' ? { x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 2.2, v: .15 + Math.random() * .35, w: Math.random() * 6.28 }
    : (k === 'cloud' || k === 'fog') ? { x: Math.random() * W, y: (k === 'fog' ? .25 + Math.random() * .6 : Math.random() * .3) * H, rw: 90 + Math.random() * 120, rh: 26 + Math.random() * 26, v: .12 + Math.random() * .25 }
    : { x: Math.random() * W * 1.2, y: -Math.random() * H, l: 10 + Math.random() * 14, v: 9 + Math.random() * 7 });
  g.save();
  if (rc) { g.beginPath(); g.rect(0, 0, W, H); g.rect(rc.left - 2, rc.top - 2, rc.width + 4, rc.height + 4); g.clip('evenodd'); }
  if (k === 'snow') {
    g.fillStyle = 'rgba(255,255,255,.98)'; g.shadowColor = 'rgba(80,100,135,.75)'; g.shadowBlur = 5;
    for (const p of P) {
      p.y += p.v; p.w += .02; p.x += Math.sin(p.w) * .5;
      if (rc && p.x > rc.left && p.x < rc.right && p.y >= rc.top - 2 && p.y < rc.top + 6) { const i = Math.floor((p.x - rc.left) / 4); zpAn.cap[i] = Math.min(9, (zpAn.cap[i] || 0) + p.r * .35); p.y = -10; p.x = Math.random() * W; continue; }
      if (p.y > H) { p.y = -10; p.x = Math.random() * W; }
      g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
    }
  } else if (k === 'sun') {
    for (const p of P) { p.y -= p.v; p.w += .03; p.x += Math.sin(p.w) * .3; if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; } const a = .25 + Math.sin(p.w * 2) * .2; g.fillStyle = `rgba(242,186,73,${a})`; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill(); }
  } else if (k === 'cloud' || k === 'fog') {
    for (const p of P) { p.x += p.v; if (p.x - p.rw > W) p.x = -p.rw; const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rw); gr.addColorStop(0, k === 'fog' ? 'rgba(200,208,218,.22)' : 'rgba(190,200,212,.18)'); gr.addColorStop(1, 'rgba(190,200,212,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(p.x, p.y, p.rw, p.rh, 0, 0, 6.283); g.fill(); }
  } else {
    g.strokeStyle = 'rgba(110,140,180,.38)'; g.lineWidth = 1.2; g.lineCap = 'round'; g.beginPath();
    for (const p of P) { p.y += p.v; p.x -= p.v * .18; if (p.y > H || p.x < -20) { p.y = -20; p.x = Math.random() * W * 1.2; } g.moveTo(p.x, p.y); g.lineTo(p.x + p.l * .18, p.y - p.l); }
    g.stroke();
    if (k === 'storm') { if (Math.random() < .004) zpAn.flash = 1; if (zpAn.flash > 0) { g.fillStyle = `rgba(255,255,255,${zpAn.flash * .35})`; g.fillRect(0, 0, W, H); zpAn.flash -= .06; } }
  }
  g.restore();
  if (k === 'snow' && rc) {   // 프로필 카드 윗면에 쌓이는 눈 (카드 밖, 위쪽에만)
    g.fillStyle = '#fff'; g.shadowColor = 'rgba(120,140,170,.35)'; g.shadowBlur = 4; g.beginPath(); g.moveTo(rc.left + 14, rc.top);
    const n = Math.ceil(rc.width / 4);
    for (let i = 0; i <= n; i++) { const c = zpAn.cap[i] || 0, x = rc.left + i * 4; if (x < rc.left + 14 || x > rc.right - 14) continue; g.lineTo(x, rc.top - c); }
    g.lineTo(rc.right - 14, rc.top); g.closePath(); g.fill(); g.shadowBlur = 0;
  }
}

/* ---------- 떡밥 자판기 ---------- */
const ZP_COMFORT = ['오늘도 잘 버텼어. 기다림도 실력이야', '전역 날, 제일 먼저 웃는 사람은 우리야', '보고 싶은 만큼 하루가 지나가고 있어', '오늘 하루도 무사히, 그거면 충분해', '기다리는 너도, 버티는 그도 멋져', '달력 한 칸이 또 지워졌어. 잘하고 있어', '지금 이 마음이 전역 날 가장 큰 선물이 될 거야', '힘든 날엔 예전 무대 하나 보고 자자', '천천히 가도 결국 그날은 와', '오늘의 응원이 내일의 웃음이 될 거야'];
const zpDrop = { sid: null, cache: {}, fan: {}, busy: false };
function zpDropStar() { const ids = myStars.map(r => r.id); if (!zpDrop.sid || !ids.includes(zpDrop.sid)) zpDrop.sid = ids.includes(stSel) ? stSel : ids[0]; return starK[zpDrop.sid] || null; }
async function zpDropLoad(s) {
  if (!zpDrop.cache[s.id]) {
    let d = null; try { const c = JSON.parse(localStorage.getItem('zt_drop:' + s.id) || 'null'); if (c && Date.now() - c.t < 6 * 3600e3) d = c.d; } catch (e) { }
    if (!d) { try { const { data } = await sb.functions.invoke('naver-search', { body: { kind: 'drops', sid: s.id, name: s.n, group: s.g || '' } }); if (data && !data.error) { d = data; try { localStorage.setItem('zt_drop:' + s.id, JSON.stringify({ t: Date.now(), d })); } catch (e) { } } } catch (e) { } }
    zpDrop.cache[s.id] = d || { stages: [], comforts: [], news: [] };
  }
  try { const { data } = await sb.from('star_drops').select('id,user_id,kind,body,url,created_at').eq('star_id', s.id).order('created_at', { ascending: false }).limit(60); zpDrop.fan[s.id] = data || []; } catch (e) { zpDrop.fan[s.id] = zpDrop.fan[s.id] || []; }
}
const ZP_BALLS = ['#F2878F', '#F2BA49', '#7CC6A4', '#7FA8E8', '#C79BE8', '#F6D3DC', '#E7C77A', '#9FD3E8'];
async function zpDrops() {
  const el = q('tab-drops'); if (!el) return; const s = zpDropStar();
  if (!s) { el.innerHTML = `<div class="zp-card text-center py-10 mt-2"><div class="text-[16px] font-extrabold">MY스타를 먼저 등록해주세요</div><button onclick="starFlow()" class="mt-4 px-5 h-11 rounded-full text-[13px] font-extrabold text-white" style="background:#191F28">MY스타 등록하기</button></div>`; return; }
  const balls = Array.from({ length: 11 }, (_, i) => { const a = i * 2.4, r = 18 + (i % 4) * 14; return `<i class="ball" style="left:${79 + Math.cos(a) * r}px;top:${92 + Math.sin(a) * r * .8 + (i % 3) * 10}px;background:${ZP_BALLS[i % ZP_BALLS.length]}"></i>`; }).join('');
  el.innerHTML = `${myStars.length > 1 ? `<div class="zp-chips mt-2 mb-1">${myStars.map(r => { const t = starK[r.id]; return t ? `<button class="${r.id === s.id ? 'on' : ''}" onclick="zpDrop.sid='${r.id}';zpDrops()">${esc(t.n)}</button>` : ''; }).join('')}</div>` : ''}
   <div class="text-center mt-3"><span class="zp-lb">오늘의 떡밥 자판기</span><h2 class="text-[20px] font-extrabold mt-3">${esc(callAs(starCall(s), '의'))} 떡밥 한 알 뽑기</h2><p class="text-[12px] text-[#8B95A1] mt-1">레전드 무대 · 팬들이 모은 어록 · 오늘의 위로 · 최신 소식</p></div>
   <div class="zp-gm" id="zp-gm"><div class="dome"><div class="balls">${balls}</div></div><div class="body"><div class="lbl">ZZAMTIGER</div><div class="slot"><i class="drop" id="zp-gm-drop"></i></div><div class="knob"></div></div></div>
   <button class="zp-pull" id="zp-pull" onclick="zpPull()">뽑기</button>
   <div class="zp-card mt-6"><div class="flex items-center justify-between"><h3 class="text-[16px] font-bold">팬들이 모은 떡밥</h3><button onclick="zpDropForm()" class="text-[12px] font-bold px-3 py-1.5 rounded-full bg-[#191F28] text-white">+ 등록하기</button></div><p class="text-[11px] text-[#8B95A1] mt-1">어록은 팬이 직접 등록한 내용이에요. 출처 링크를 함께 남겨주세요.</p><div id="zp-drop-list" class="mt-2 text-[13px] text-[#8B95A1]">불러오는 중…</div></div><div class="h-4"></div>`;
  await zpDropLoad(s); zpDropList(s);
}
function zpDropList(s) {
  const L = zpDrop.fan[s.id] || [], el = q('zp-drop-list'); if (!el) return;
  const KN = { quote: '어록', stage: '무대', comfort: '위로' };
  el.innerHTML = L.length ? L.slice(0, 30).map(d => `<div class="zp-drop-row"><span class="text-[10px] font-extrabold px-2 py-1 rounded-full bg-[#F2F3F5] text-[#4E5968] flex-shrink-0">${KN[d.kind] || ''}</span><div class="flex-1 min-w-0"><div class="text-[14px] text-[#191F28] break-words">${esc(d.body)}</div>${d.url ? `<a href="${safeUrl(d.url)}" target="_blank" rel="noopener" class="text-[12px] font-bold text-[var(--mil-green)]">링크 열기 ›</a>` : ''}</div>${d.user_id === me.id || me.is_admin ? `<button onclick="zpDropDel(${d.id})" class="text-[11px] text-[#B0B8C1] flex-shrink-0">삭제</button>` : ''}</div>`).join('') : '<div class="py-4 text-center">아직 등록된 떡밥이 없어요. 첫 떡밥을 남겨주세요!</div>';
}
async function zpDropDel(id) { if (!(await zConfirm('이 떡밥을 삭제할까요?', { ok: '삭제', danger: true }))) return; await sb.rpc('drop_delete', { did: id }); const s = zpDropStar(); await zpDropLoad(s); zpDropList(s); }
function zpDropForm() {
  const s = zpDropStar(); if (!s) return;
  const ov = document.createElement('div'); ov.className = 'zp-ov'; ov.style.alignItems = 'stretch'; ov.onclick = e => { if (e.target === ov) ov.remove(); };
  ov.innerHTML = `<div class="bg-white text-[#191F28] rounded-3xl p-5 text-left w-full max-w-[380px] mx-auto"><div class="text-[17px] font-extrabold">${esc(s.n)} 떡밥 등록</div><p class="text-[12px] text-[#8B95A1] mt-1">다른 팬들이 자판기에서 뽑을 수 있어요. 하루 10개까지.</p>
   <div class="zp-chips mt-4" id="zp-df-k"><button class="on" data-k="quote">어록</button><button data-k="stage">무대 추천</button><button data-k="comfort">위로 한마디</button></div>
   <textarea id="zp-df-b" maxlength="200" rows="3" class="w-full mt-3 bg-[#F5F6F8] rounded-2xl p-3 text-[14px] outline-none resize-none" placeholder="예) 2019 MAMA 무대 다시 보기"></textarea>
   <input id="zp-df-u" maxlength="290" class="w-full mt-2 bg-[#F5F6F8] rounded-2xl p-3 text-[13px] outline-none" placeholder="출처 링크 (유튜브·네이버·위버스 등, 선택)">
   <button id="zp-df-ok" class="w-full mt-4 h-12 rounded-2xl bg-[#191F28] text-white font-bold text-[14px]">등록하기</button><button class="w-full mt-1 h-10 text-[13px] text-[#8B95A1]" onclick="this.closest('.zp-ov').remove()">취소</button></div>`;
  document.body.appendChild(ov);
  let kind = 'quote'; ov.querySelectorAll('#zp-df-k button').forEach(b => b.onclick = () => { kind = b.dataset.k; ov.querySelectorAll('#zp-df-k button').forEach(x => x.classList.toggle('on', x === b)); });
  ov.querySelector('#zp-df-ok').onclick = async () => {
    const body = ov.querySelector('#zp-df-b').value.replace(/[<>]/g, '').trim(), url = ov.querySelector('#zp-df-u').value.trim();
    if (body.length < 2) return zpToast('내용을 적어주세요');
    if (url && !/^https:\/\/([a-z0-9-]+\.)*(youtube\.com|youtu\.be|naver\.com|naver\.me|weverse\.io|instagram\.com|x\.com|twitter\.com|tiktok\.com)\//i.test(url)) return zpToast('유튜브·네이버·위버스·인스타·X·틱톡 링크만 넣을 수 있어요');
    const { error } = await sb.rpc('drop_add', { sid: s.id, k: kind, txt: body, link: url || null });
    if (error) return zpToast(/many/.test(error.message) ? '오늘은 10개까지 등록할 수 있어요' : '등록하지 못했어요');
    ov.remove(); zpToast('떡밥을 등록했어요!'); await zpDropLoad(s); zpDropList(s);
  };
}
function zpPickDrop(s) {
  const d = zpDrop.cache[s.id] || {}, fan = zpDrop.fan[s.id] || [], nm = starCall(s), pool = [];
  fan.forEach(x => pool.push({ w: 3, k: x.kind === 'quote' ? '팬이 모은 레전드 어록' : x.kind === 'stage' ? '팬 추천 무대' : '팬이 남긴 위로', t: x.body, u: x.url, by: 1 }));
  (d.stages || []).forEach(x => pool.push({ w: 3, k: '다시 보는 레전드 무대', t: x.t, u: x.u }));
  (d.news || []).forEach(x => pool.push({ w: 2, k: '따끈한 소식', t: x.t, u: x.u }));
  (d.comforts || []).concat(ZP_COMFORT).forEach(x => pool.push({ w: 1, k: '오늘의 위로', t: x }));
  pool.push({ w: 1, k: '다시 보는 레전드 무대', t: `${nm} 무대 모음 보러 가기`, u: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(((s.g && !/배우|솔로|트로트|·/.test(s.g)) ? s.g + ' ' : '') + s.n + ' 무대') });
  let sum = pool.reduce((a, b) => a + b.w, 0), r = Math.random() * sum; for (const p of pool) { r -= p.w; if (r <= 0) return p; } return pool[0];
}
async function zpPull() {
  const s = zpDropStar(); if (!s || zpDrop.busy) return; zpDrop.busy = true; const btn = q('zp-pull'); btn.disabled = true;
  if (!zpDrop.cache[s.id]) await zpDropLoad(s);
  const gm = q('zp-gm'), drop = q('zp-gm-drop'), col = ZP_BALLS[Math.floor(Math.random() * ZP_BALLS.length)]; drop.style.background = col; drop.style.boxShadow = 'inset -4px -5px 0 rgba(0,0,0,.12),inset 3px 4px 0 rgba(255,255,255,.35)';
  gm.classList.remove('spin', 'out'); void gm.offsetWidth; gm.classList.add('spin');
  setTimeout(() => gm.classList.add('out'), 1250);
  setTimeout(() => { zpFortune(zpPickDrop(s)); gm.classList.remove('spin', 'out'); zpDrop.busy = false; btn.disabled = false; }, 2100);
}
function zpFortune(p) {
  const half = (flip) => `<svg viewBox="0 0 100 100"><path d="${flip ? 'M8 70C8 30 40 10 70 14c16 2 26 16 22 30-2 6-10 10-18 8 8 10 6 22-6 26C50 84 8 92 8 70z' : 'M92 70C92 30 60 10 30 14 14 16 4 30 8 44c2 6 10 10 18 8-8 10-6 22 6 26 18 6 60 14 60-8z'}" fill="#E9B866" stroke="#C98F3A" stroke-width="3"/><path d="${flip ? 'M30 40c10-8 26-10 38-4' : 'M70 40c-10-8-26-10-38-4'}" stroke="#F6D79B" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
  const ov = document.createElement('div'); ov.className = 'zp-fc';
  ov.innerHTML = `<div class="cookie wob"><div class="half l">${half(1)}</div><div class="half r">${half(0)}</div><div class="slip"></div></div>
   <div class="res"><span class="zp-lb">${esc(p.k)}</span><div class="text-[19px] font-extrabold leading-snug mt-3 break-keep">${esc(p.t)}</div>${p.by ? '<div class="text-[11px] text-[#8B95A1] mt-2">팬이 직접 등록한 내용이에요</div>' : ''}
   ${p.u ? `<a href="${safeUrl(p.u)}" target="_blank" rel="noopener" class="mt-4 flex items-center justify-center gap-2 h-12 rounded-2xl text-white font-bold text-[14px]" style="background:${/youtube|youtu\.be/.test(p.u) ? '#E5372F' : '#191F28'}">${/youtube|youtu\.be/.test(p.u) ? '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.6 3.6 12 3.6 12 3.6s-4.6 0-7.8.3c-.4.1-1.4.1-2.3 1C1.2 5.6 1 7.2 1 7.2S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.6 1 1.8.2 7.5.3 7.5.3s4.6 0 7.8-.3c.4-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.7 15.1V8.6l6.2 3.3-6.2 3.2z"/></svg>유튜브에서 보기' : '바로 보러 가기 ›'}</a>` : ''}
   <div class="grid grid-cols-2 gap-2 mt-3"><button class="h-11 rounded-2xl bg-[#F2F3F5] text-[13px] font-bold" onclick="this.closest('.zp-fc').remove()">닫기</button><button class="h-11 rounded-2xl bg-[#191F28] text-white text-[13px] font-bold" onclick="this.closest('.zp-fc').remove();zpPull()">한 번 더</button></div></div>`;
  document.body.appendChild(ov);
  setTimeout(() => { ov.querySelector('.cookie').classList.remove('wob'); ov.querySelector('.cookie').classList.add('crack'); }, 1150);
  setTimeout(() => { ov.querySelector('.res').classList.add('on'); const r = ov.querySelector('.res').getBoundingClientRect(); for (let i = 0; i < 18; i++) { const sp = document.createElement('i'); sp.className = 'zp-sp'; const a = Math.random() * 6.28, R = 60 + Math.random() * 110; sp.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + 30}px;--x:${Math.cos(a) * R}px;--y:${Math.sin(a) * R}px;animation-delay:${Math.random() * .25}s`; document.body.appendChild(sp); setTimeout(() => sp.remove(), 1400); } }, 1550);
}

/* 탭이 바뀔 때 */
function zpTab(t) {
  if (t === 'drops') zpDrops(); if (t === 'shop') zpShopTab(); if (t === 'weather') zpWxTab();
  if (t === 'home') { if (zpFan()) zpWxHome(); else zpMilWx(); } else zpWxAnim(null);
}
