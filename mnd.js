/* 짬타이거 · 국방부 공공데이터 기능
   - PX 인기 TOP 10 (굿맨 탭 위)
   - 장병 할인 · TMO · 군병원 (혜택 탭)
   - 부대 식단표: 식단표 찾기(오늘 먹은 메뉴로 우리 부대 찾기) · 국방부 식단 자동 불러오기 */
(function () {
const D = () => window.MND || { px: {}, tmo: [], hosp: [], dc: [] };
const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const $ = id => document.getElementById(id);
const tel = t => t ? `<a href="tel:${E(t.replace(/[^0-9-]/g, ''))}" class="mnd-tel">${E(t)}</a>` : '';

/* ---------- 스타일 ---------- */
const css = `
.mnd-card{background:#fff;border-radius:24px;padding:20px;box-shadow:0 1px 2px rgba(0,0,0,.03)}
.mnd-h{font-size:17px;font-weight:800;display:flex;align-items:center;justify-content:space-between;gap:8px}
.mnd-s{font-size:11px;color:#8B95A1;margin-top:2px}
.mnd-chips{display:flex;gap:6px;overflow-x:auto;padding:12px 0 4px;scrollbar-width:none}.mnd-chips::-webkit-scrollbar{display:none}
.mnd-chip{flex-shrink:0;height:32px;padding:0 13px;border-radius:999px;background:#F2F4F6;font-size:12.5px;font-weight:700;color:#4E5968}
.mnd-chip.on{background:#191F28;color:#fff}
.mnd-seg{display:flex;background:#F2F4F6;border-radius:10px;padding:3px}.mnd-seg button{height:28px;padding:0 10px;border-radius:8px;font-size:12px;font-weight:700;color:#8B95A1}.mnd-seg button.on{background:#fff;color:#191F28;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.mnd-rk{display:flex;align-items:center;gap:12px;padding:9px 2px}
.mnd-rk b.n{width:22px;text-align:center;font-size:16px;font-weight:900;color:#191F28}
.mnd-rk.t3 b.n{color:var(--mil-green,#4E5B3A)}
.mnd-rk .nm{flex:1;min-width:0;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mnd-rk .ch{font-size:11px;font-weight:800;min-width:34px;text-align:right}
.mnd-row{padding:12px 0;border-top:1px solid #F2F3F5}.mnd-row:first-child{border-top:0}
.mnd-tel{display:inline-flex;align-items:center;white-space:nowrap;height:28px;padding:0 11px;border-radius:999px;background:#F2F4F6;font-size:12px;font-weight:700;color:#191F28}
.mnd-tabs{display:flex;gap:6px;margin-top:12px}.mnd-tabs button{flex:1;height:36px;border-radius:10px;background:#F2F4F6;font-size:13px;font-weight:800;color:#8B95A1}.mnd-tabs button.on{background:#191F28;color:#fff}
.mnd-pager{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;align-items:flex-start;margin-top:6px}.mnd-pager::-webkit-scrollbar{display:none}
.mnd-page{flex:0 0 100%;min-width:0;scroll-snap-align:start;padding:12px 20px 0;box-sizing:border-box}.mnd-pager .mnd-h{font-size:15px}
.mnd-in{width:100%;height:42px;border-radius:12px;background:#F5F6F8;padding:0 14px;font-size:14px;outline:none;margin-top:10px}
.mnd-more{width:100%;height:42px;border-radius:12px;background:#F5F6F8;font-size:13px;font-weight:700;color:#4E5968;margin-top:8px}
.mf{position:fixed;inset:0;z-index:110;background:#fff;display:flex;flex-direction:column}
.mf-top{display:flex;align-items:center;justify-content:space-between;padding:max(10px,env(safe-area-inset-top)) 12px 10px}
.mf-top button{width:40px;height:40px;display:flex;align-items:center;justify-content:center}
.mf-bar{height:3px;background:#EEF0F2}.mf-bar i{display:block;height:100%;background:#3DB37D;transition:width .3s}
.mf-body{flex:1;overflow-y:auto;padding:24px 22px}
.mf-t{font-size:22px;font-weight:900;letter-spacing:-.5px;line-height:1.35}.mf-t em{font-style:normal;color:#3DB37D}
.mf-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;margin-top:22px;align-items:start}
.mf-chip{justify-self:start;max-width:100%;padding:11px 15px;border-radius:12px;background:#F2F3F5;font-size:15px;font-weight:700;color:#333D4B;text-align:left;line-height:1.3}
.mf-chip:active{background:#E5E8EB}
.mf-dots{display:flex;justify-content:center;gap:7px;padding:14px 0 max(18px,env(safe-area-inset-bottom))}.mf-dots i{width:7px;height:7px;border-radius:50%;background:#D1D6DB}.mf-dots i.on{background:#333D4B}
.mf-ok{width:100%;height:54px;border-radius:16px;background:#191F28;color:#fff;font-size:16px;font-weight:800}
.mf-sub{width:100%;height:50px;border-radius:16px;background:#F2F4F6;color:#4E5968;font-size:15px;font-weight:700;margin-top:8px}
.ml-meal{background:#F7F8FA;border-radius:16px;padding:14px 16px;margin-top:10px}
.ml-meal b{font-size:13px}.ml-meal div{font-size:13px;color:#4E5968;line-height:1.6;margin-top:4px}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

/* ================= PX 인기 TOP 10 ================= */
const PX = { m: null, s: 'q', v: 'cos', p: 'all' };
window.mndPxRank = function () {
  const host = $('px-rank'); if (!host) return;
  const tabs = `<div class="mnd-tabs" style="margin:0 0 12px"><button class="${PX.v === 'cos' ? 'on' : ''}" onclick="mndPxSet(null,null,'cos')">화장품 순위</button><button class="${PX.v === 'all' ? 'on' : ''}" onclick="mndPxSet(null,null,'all')">전체 인기</button></div>`;
  if (PX.v === 'cos') { const C = (D().cos || {})[PX.p] || [], mx = Math.max(1, ...C.map(x => x[1]));
    host.innerHTML = `<div class="mnd-card" style="margin:0 0 12px">${tabs}<div class="mnd-h"><span>PX 화장품 인기 순위</span></div><div class="mnd-s">국방부 PX 인기상품 월간 TOP 10에 오른 화장품을 모아 점수로 매긴 순위예요</div><div class="mnd-chips">${[['1y', '최근 1년'], ['2y', '최근 2년'], ['all', '전체 기간']].map(([k, t]) => `<button class="mnd-chip ${PX.p === k ? 'on' : ''}" onclick="mndPxSet(null,null,null,'${k}')">${t}</button>`).join('')}</div><div>${C.slice(0, 10).map((x, r) => `<div class="mnd-rk ${r < 3 ? 't3' : ''}"><b class="n">${r + 1}</b><div class="nm" style="white-space:normal"><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${E(x[0])}</div><div style="height:4px;border-radius:2px;background:#F2F4F6;margin-top:5px"><i style="display:block;height:100%;width:${Math.round(x[1] / mx * 100)}%;border-radius:2px;background:linear-gradient(90deg,#F2B8C6,#E86F95)"></i></div></div><span class="ch" style="color:#8B95A1;min-width:60px">TOP10 ${x[3]}회</span></div>`).join('') || '<div class="text-center text-[13px] text-[#8B95A1] py-6">이 기간엔 순위에 오른 화장품이 없어요</div>'}</div></div>`; return; }
  const P = D().px, ks = Object.keys(P).sort(); if (!ks.length) { host.innerHTML = ''; return; }
  if (!PX.m || !P[PX.m]) PX.m = ks[ks.length - 1];
  const i = ks.indexOf(PX.m), prev = i > 0 ? (P[ks[i - 1]] || {})[PX.s] || [] : null, L = (P[PX.m] || {})[PX.s] || [];
  const lbl = k => `${+k.slice(5)}월`, yy = PX.m.slice(0, 4);
  const ch = (n, r) => { if (!prev) return ''; const j = prev.indexOf(n); if (j < 0) return '<span class="ch" style="color:#F04452">NEW</span>'; const d = j - r; return d > 0 ? `<span class="ch" style="color:#F04452">▲${d}</span>` : d < 0 ? `<span class="ch" style="color:#3182F6">▼${-d}</span>` : '<span class="ch" style="color:#B0B8C1">-</span>'; };
  host.innerHTML = `<div class="mnd-card" style="margin:0 0 12px">${tabs}<div class="mnd-h"><span>PX 인기 TOP 10</span><div class="mnd-seg"><button class="${PX.s === 'q' ? 'on' : ''}" onclick="mndPxSet(null,'q')">판매량</button><button class="${PX.s === 'a' ? 'on' : ''}" onclick="mndPxSet(null,'a')">판매액</button></div></div>
   <div class="mnd-s">국방부 공공데이터 · ${yy}년 ${lbl(PX.m)} 전군 PX 기준</div>
   <div class="mnd-chips">${ks.slice(-8).reverse().map(k => `<button class="mnd-chip ${k === PX.m ? 'on' : ''}" onclick="mndPxSet('${k}')">${k.slice(2, 4)}.${lbl(k)}</button>`).join('')}</div>
   <div>${L.map((n, r) => `<div class="mnd-rk ${r < 3 ? 't3' : ''}"><b class="n">${r + 1}</b><span class="nm">${E(n)}</span>${ch(n, r)}</div>`).join('')}</div></div>`;
};
window.mndPxSet = (m, s, v, p) => { if (m) PX.m = m; if (s) PX.s = s; if (v) PX.v = v; if (p) PX.p = p; mndPxRank(); };

/* ================= 혜택: 장병 할인 · TMO · 군병원 ================= */
const MB = { rg: '전체', q: '', lim: 8, tq: '', tlim: 6, near: null };
MB.pg = 0;
const IC = (d) => `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px">${d}</svg>`;
const PIN = IC('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'), CLK = IC('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>');
window.mndBenefitsHTML = () => `<div class="mnd-card" style="padding:16px 0 18px"><div class="px-5"><div class="text-[18px] font-extrabold">장병 생활 정보</div><div class="mnd-s">옆으로 넘겨서 할인 · TMO · 국군병원을 봐요</div><div class="mnd-tabs" id="mnd-tabs">${['할인 제휴처', 'TMO', '국군병원'].map((t, i) => `<button class="${i === MB.pg ? 'on' : ''}" onclick="mndPg(${i})">${t}</button>`).join('')}</div></div><div id="mnd-ben" class="mnd-pager" onscroll="mndPgSync(this)">${benInner()}</div></div>`;
window.mndPg = i => { const p = $('mnd-ben'); if (p) p.scrollTo({ left: i * p.clientWidth, behavior: 'smooth' }); };
window.mndPgSync = el => { const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth)); if (i === MB.pg) return; MB.pg = i; document.querySelectorAll('#mnd-tabs button').forEach((b, k) => b.classList.toggle('on', k === i)); };
function benInner() {
  const today = new Date().toISOString().slice(0, 10);
  const all = D().dc.filter(d => !d[5] || d[5] >= today), rgs = ['전체'].concat([...new Set(all.map(d => d[0]))].sort());
  const q = MB.q.trim().replace(/\s/g, ''), L = all.filter(d => (MB.rg === '전체' || d[0] === MB.rg) && (!q || (d[1] + d[2] + d[3]).replace(/\s/g, '').includes(q)));
  const dc = `<div class="mnd-page"><div class="mnd-h"><span>장병 할인 제휴처</span><span class="text-[12px] text-[#8B95A1] font-bold">${L.length}곳</span></div><div class="mnd-s">국방부 공공데이터 · 현역 장병 · 군 가족 할인 (이용 전 조건 확인)</div>
   <input class="mnd-in" placeholder="호텔, 영화관, 렌터카…" value="${E(MB.q)}" oninput="mndBen('q',this.value)">
   <div class="mnd-chips">${rgs.map(r => `<button class="mnd-chip ${r === MB.rg ? 'on' : ''}" onclick="mndBen('rg','${E(r)}')">${E(r)}</button>`).join('')}</div>
   <div>${L.slice(0, MB.lim).map(d => `<div class="mnd-row"><div class="flex items-start justify-between gap-2"><div class="min-w-0"><div class="text-[11px] font-bold text-[#8B95A1]">${E(d[0])} · ${E(d[2])}</div><div class="text-[15px] font-extrabold leading-snug mt-0.5">${E(d[1])}</div></div>${d[5] ? `<span class="text-[10px] font-bold text-[#F04452] whitespace-nowrap">~${E(d[5].slice(2).replace(/-/g, '.'))}</span>` : ''}</div><div class="text-[13px] text-[#4E5968] mt-1 leading-relaxed">${E(d[3])}</div><div class="flex gap-1.5 mt-2">${tel(d[4])}${d[6] ? `<a class="mnd-tel" target="_blank" rel="noopener" href="${E(d[6])}">복지포털</a>` : ''}</div></div>`).join('') || '<div class="text-center text-[13px] text-[#8B95A1] py-6">조건에 맞는 곳이 없어요</div>'}</div>
   ${L.length > MB.lim ? `<button class="mnd-more" onclick="mndBen('lim',${MB.lim + 10})">더보기 (${L.length - MB.lim}곳)</button>` : ''}</div>`;
  const tq = MB.tq.trim(), T = D().tmo.filter(t => !tq || t[0].includes(tq) || t[4].includes(tq));
  const tmo = `<div class="mnd-page"><div class="mnd-h"><span>TMO 위치 · 운영시간</span><span class="text-[12px] text-[#8B95A1] font-bold">${D().tmo.length}곳</span></div><div class="mnd-s">휴가 · 출장 때 역 · 터미널의 국군 여행장병 안내소</div>
   <input class="mnd-in" placeholder="역 이름으로 찾기 (예: 서울, 동대구)" value="${E(MB.tq)}" oninput="mndBen('tq',this.value)">
   <div class="mt-1">${T.slice(0, tq ? 99 : MB.tlim).map(t => `<div class="mnd-row"><div class="flex items-center justify-between gap-2"><div class="text-[15px] font-extrabold">${E(t[0])} TMO</div>${tel(t[1])}</div><div class="text-[12.5px] text-[#4E5968] mt-1 flex gap-1.5">${PIN}<span>${E(t[4])}</span></div>${t[2] || t[3] ? `<div class="text-[12.5px] text-[#4E5968] mt-0.5 flex gap-1.5">${CLK}<span>${t[2] ? '평일 ' + E(t[2]) : ''}${t[2] && t[3] ? ' · ' : ''}${t[3] ? '주말 ' + E(t[3]) : ''}</span></div>` : ''}${t[5] ? `<div class="text-[12px] text-[#8B95A1] mt-0.5 flex gap-1.5">${t[2] || t[3] ? '<span style="width:14px;flex-shrink:0"></span>' : CLK}<span>${E(t[5])}</span></div>` : ''}</div>`).join('') || '<div class="text-center text-[13px] text-[#8B95A1] py-6">찾는 TMO가 없어요</div>'}</div>
   ${!tq && T.length > MB.tlim ? `<button class="mnd-more" onclick="mndBen('tlim',99)">전체 보기 (${T.length - MB.tlim}곳 더)</button>` : ''}</div>`;
  let H = D().hosp.map(h => ({ h, km: MB.near ? dist(MB.near, [h[3], h[4]]) : null }));
  if (MB.near) H.sort((a, b) => a.km - b.km);
  const hp = `<div class="mnd-page"><div class="mnd-h"><span>국군병원</span><button onclick="mndNear()" class="mnd-tel">${MB.near ? '가까운 순 ✓' : PIN + '<span style="margin-left:4px">가까운 순</span>'}</button></div><div class="mnd-s">국방부 공공데이터 · 대표번호로 진료 예약 · 문의</div>
   <div class="mt-2">${H.map(({ h, km }) => `<div class="mnd-row"><div class="flex items-center justify-between gap-2"><div class="text-[15px] font-extrabold">${E(h[0])}${km != null ? ` <span class="text-[12px] font-bold text-[#3DB37D]">${km < 10 ? km.toFixed(1) : Math.round(km)}km</span>` : ''}</div>${tel(h[2])}</div><div class="text-[12.5px] text-[#4E5968] mt-1 flex gap-1.5">${PIN}<span>${E(h[1])}</span></div><a class="text-[12px] font-bold text-[var(--mil-green,#4E5B3A)] mt-1 inline-block" target="_blank" rel="noopener" href="https://map.kakao.com/link/map/${encodeURIComponent(h[0])},${h[3]},${h[4]}">지도에서 보기 ›</a></div>`).join('')}</div></div>`;
  return dc + tmo + hp;
}
function dist(a, b) { const R = 6371, r = x => x * Math.PI / 180, dl = r(b[0] - a[0]), dn = r(b[1] - a[1]); const s = Math.sin(dl / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(s)); }
window.mndBen = (k, v) => { MB[k] = v; if (k === 'rg' || k === 'q') MB.lim = 8; const box = $('mnd-ben'); if (!box) return; const sl = box.scrollLeft; const f = document.activeElement, fi = f && f.classList.contains('mnd-in') ? [...box.querySelectorAll('.mnd-in')].indexOf(f) : -1, pos = f && f.selectionStart; box.innerHTML = benInner(); box.scrollLeft = sl; if (fi >= 0) { const n = box.querySelectorAll('.mnd-in')[fi]; n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) { } } };
window.mndNear = () => {
  if (MB.near) { MB.near = null; mndBen('near', null); return; }
  const S = typeof S_ === 'function' ? S_() : null;
  if (S && S.unit_lat) { mndBen('near', [S.unit_lat, S.unit_lng]); return; }
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(p => mndBen('near', [p.coords.latitude, p.coords.longitude]), () => { if (typeof zDialog === 'function') zDialog({ title: '위치를 쓸 수 없어요', msg: '자대를 등록하거나 위치 권한을 허용하면 가까운 순으로 보여드려요.', cancel: false }); }, { timeout: 8000 });
};

/* ================= 부대 식단 (국방부 공공데이터) ================= */
const ML = { days: {}, unit: null, units: {}, synced: false };
const GENERIC = /^(밥|쌀밥|백미밥|잡곡밥|현미밥|흑미밥|보리밥|김치|배추김치|깍두기|총각김치|열무김치|우유|흰우유|저지방우유|맛김|조미김|김|요구르트|빵|식빵|잼|딸기잼|케찹|시리얼)$/;
const mealUnit = () => { const S = typeof S_ === 'function' ? S_() : null; return (S && S.meal_unit) || (window.me && me.meal_unit) || null; };
const ymdK = d => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 6e4); return z.toISOString().slice(0, 10); };
async function units() { if (Object.keys(ML.units).length) return ML.units; const { data } = await sb.from('meal_units').select('code,name').eq('active', true); (data || []).forEach(u => ML.units[u.code] = u.name); return ML.units; }
function sync() { if (ML.synced) return; ML.synced = true; try { sb.functions.invoke('mnd-meal', { body: { action: 'sync' } }).then(r => { if (r && r.data && r.data.units) { ML.days = {}; if (q('modal-menu').classList.contains('flex')) renderMenu(); } }).catch(() => { }); } catch (e) { } }
async function loadUnit(u, d) {
  const k = u + '|' + d.slice(0, 7); if (ML.days[k]) return ML.days[k];
  const a = new Date(d + 'T00:00:00'); a.setDate(1); a.setMonth(a.getMonth() - 0); const from = ymdK(new Date(a.getFullYear(), a.getMonth(), 1)), to = ymdK(new Date(a.getFullYear(), a.getMonth() + 1, 0));
  const { data } = await sb.from('meal_days').select('d,b,l,n,sp').eq('unit', u).gte('d', from).lte('d', to); const m = {}; (data || []).forEach(r => m[r.d] = r); return (ML.days[k] = m);
}
const items = a => (a || []).map(x => `<span class="inline-block bg-[#F5F6F8] rounded-full px-3 py-1 text-[12px] m-0.5">${E(x)}</span>`).join('');
/* 식단표 화면 위에 덧붙여요 (renderMenu 끝에서 불러요) */
window.mndMenuPatch = async function () {
  sync(); const u = mealUnit(), cards = q('menu-cards'), ub = q('menu-unit'); if (!cards) return;
  if (!u) {
    cards.insertAdjacentHTML('afterbegin', `<div class="toss-card !p-5" style="background:linear-gradient(135deg,#EAF7F0,#F7FBF9)"><div class="text-[15px] font-extrabold">🍚 우리 부대 식단표 찾기</div><div class="text-[12.5px] text-[#4E5968] mt-1 leading-relaxed">오늘 먹은 메뉴만 고르면 국방부 공공데이터에서<br>우리 부대 식단을 찾아 매일 자동으로 보여드려요.</div><button onclick="mealFind()" class="mt-3 w-full h-11 rounded-xl text-white font-bold text-[14px]" style="background:#3DB37D">식단표 찾기</button></div>`);
    return;
  }
  const date = q('menu-date-input').value, m = await loadUnit(u, date), r = m[date], U = await units();
  ub.innerHTML = `<span class="inline-flex gap-1 items-start">${PIN}<span>${E(U[u] || ('제' + u + '부대'))} · 국방부 공공데이터 <button onclick="mealFind()" class="font-bold text-[#3DB37D] ml-1">부대 바꾸기</button></span></span>`;
  if (!r) { cards.insertAdjacentHTML('afterbegin', `<div class="text-[12px] text-[#8B95A1] bg-white rounded-2xl px-4 py-3">이 날짜의 공공데이터 식단이 아직 없어요. 직접 입력한 식단이 있으면 아래에 보여요.</div>`); return; }
  cards.innerHTML = [['🌅', '조식', r.b], ['☀️', '중식', r.l], ['🌙', '석식', r.n]].map(([i, t, v]) => `<div class="toss-card !p-5"><div class="text-[14px] font-extrabold mb-2">${i} ${t}</div>${v && v.length ? items(v) : '<div class="text-[12px] text-[#8B95A1]">식단 정보가 없어요</div>'}</div>`).join('') + (r.sp && r.sp.length ? `<div class="toss-card !p-5"><div class="text-[14px] font-extrabold mb-2">🎉 특식</div>${items(r.sp)}</div>` : '');
};

/* ---------- 식단표 찾기 (오늘 먹은 메뉴로 우리 부대 찾기) ---------- */
const MF = { el: null, steps: [], si: 0, C: [], data: {}, pg: 0 };
const SL = { b: '아침', l: '점심', n: '저녁' };
function slots() {
  const now = new Date(), h = now.getHours(), out = [], seq = ['n', 'l', 'b'];
  let day = new Date(now), start = h < 9 ? 0 : h < 13 ? 2 : h < 18 ? 1 : 0; if (h < 9) day.setDate(day.getDate() - 1);
  for (let k = 0; k < 7; k++) { const i = (start + k) % 3; if (k && i === 0) day = new Date(day.getTime() - 864e5); out.push({ d: ymdK(day), m: seq[i] }); }
  return out;
}
function slotLabel(s) { const t = ymdK(new Date()), y = ymdK(new Date(Date.now() - 864e5)); return (s.d === t ? '오늘 ' : s.d === y ? '어제 ' : `${+s.d.slice(5, 7)}/${+s.d.slice(8)} `) + SL[s.m]; }
window.mealFind = async function () {
  if (!MF.el) { MF.el = document.createElement('div'); MF.el.className = 'mf'; document.body.appendChild(MF.el); }
  MF.el.style.display = 'flex'; MF.el.innerHTML = `<div class="mf-top"><button onclick="mealClose()">${CHEV}</button><b class="text-[17px]">식단표 찾기</b><button onclick="mealList()">${SRCH}</button></div><div class="mf-bar"><i style="width:8%"></i></div><div class="mf-body"><div class="text-center text-[14px] text-[#8B95A1] py-16">전군 식단을 불러오는 중…</div></div>`;
  sync(); MF.steps = slots(); MF.si = 0; MF.pg = 0;
  const ds = [...new Set(MF.steps.map(s => s.d))]; const { data } = await sb.from('meal_days').select('unit,d,b,l,n').in('d', ds); await units();
  MF.data = {}; (data || []).forEach(r => (MF.data[r.unit] ??= {})[r.d] = r);
  MF.C = Object.keys(MF.data);
  if (!MF.C.length) return mfMsg('아직 불러온 식단이 없어요', '국방부 공공데이터를 불러오는 중이에요. 잠시 뒤 다시 시도하거나, 오른쪽 위 🔍로 부대 번호를 직접 골라주세요.');
  mfStep();
};
window.mealClose = () => { if (MF.el) MF.el.style.display = 'none'; };
const CHEV = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" stroke-width="2.2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>', SRCH = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
function mfBody(h, pct) { MF.el.querySelector('.mf-body').outerHTML; MF.el.querySelector('.mf-bar i').style.width = (pct || 8) + '%'; MF.el.querySelector('.mf-body').innerHTML = h; const d = MF.el.querySelector('.mf-dots'); if (d) d.remove(); }
function mfMsg(t, s) { mfBody(`<div class="mf-t">${t}</div><p class="text-[14px] text-[#8B95A1] mt-3 leading-relaxed">${s}</p><button class="mf-ok mt-8" onclick="mealFind()">다시 찾기</button><button class="mf-sub" onclick="mealList()">부대 번호로 고르기</button>`, 100); }
function mfStep() {
  if (MF.C.length === 1) return mfFound(MF.C[0]);
  if (!MF.C.length) return mfMsg('식단표를 찾지 못했어요', '고른 메뉴가 들어간 부대가 없어요. 다시 한번 찾아보거나 부대 번호로 직접 골라주세요.');
  // 이 끼니에 정보가 있는 후보만 쓰고, 다 같거나 흔한 메뉴는 빼요
  while (MF.si < MF.steps.length) { const s = MF.steps[MF.si]; if (MF.C.some(u => ((MF.data[u] || {})[s.d] || {})[s.m] && MF.data[u][s.d][s.m].length)) break; MF.si++; }
  if (MF.si >= MF.steps.length) return mealList(MF.C);
  const s = MF.steps[MF.si], cnt = {};
  MF.C.forEach(u => { const a = ((MF.data[u] || {})[s.d] || {})[s.m] || []; new Set(a).forEach(x => { if (!GENERIC.test(x.replace(/\s/g, ''))) cnt[x] = (cnt[x] || 0) + 1; }); });
  let L = Object.keys(cnt).filter(x => cnt[x] < MF.C.length || MF.C.length === 1).sort((a, b) => cnt[b] - cnt[a] || a.localeCompare(b));
  if (!L.length) { MF.si++; return mfStep(); }
  MF.L = L; MF.pg = 0; mfPaint();
}
function mfPaint() {
  const s = MF.steps[MF.si], per = 14, pages = Math.ceil((MF.L.length + 1) / per), all = MF.L.concat(['__none']), P = all.slice(MF.pg * per, MF.pg * per + per);
  const lab = slotLabel(s).split(' ');
  mfBody(`<div class="mf-t"><em>${E(lab.join(' '))}</em>에 나온 메뉴를 찾아주세요!</div><p class="text-[15px] text-[#8B95A1] mt-3">고르신 메뉴를 기반으로 관련된 식단표를 찾아드릴게요.</p><p class="text-[14px] font-bold text-[#4E5968] mt-2">식단표 후보 수 : ${MF.C.length}개</p><div style="height:1px;background:#EEF0F2;margin:18px -22px 0"></div>
   <div class="mf-grid" id="mf-grid">${P.map(x => x === '__none' ? `<button class="mf-chip" onclick="mfPick(null)">해당 메뉴 없음</button>` : `<button class="mf-chip" data-x="${E(x)}">${E(x)}</button>`).join('')}</div>`, Math.min(92, 10 + MF.si * 14));
  MF.el.querySelectorAll('#mf-grid [data-x]').forEach(b => b.onclick = () => mfPick(b.dataset.x));
  if (pages > 1) { const d = document.createElement('div'); d.className = 'mf-dots'; d.innerHTML = Array.from({ length: pages }, (_, i) => `<i class="${i === MF.pg ? 'on' : ''}" onclick="mfPg(${i})"></i>`).join(''); MF.el.appendChild(d);
    let sx = null; const g = MF.el.querySelector('.mf-body'); g.onpointerdown = e => sx = e.clientX; g.onpointerup = e => { if (sx != null && Math.abs(e.clientX - sx) > 50) mfPg(Math.max(0, Math.min(pages - 1, MF.pg + (e.clientX < sx ? 1 : -1)))); sx = null; }; }
}
window.mfPg = i => { MF.pg = i; mfPaint(); };
window.mfPick = x => { const s = MF.steps[MF.si]; if (x) MF.C = MF.C.filter(u => ((((MF.data[u] || {})[s.d] || {})[s.m]) || []).includes(x)); MF.si++; mfStep(); };
async function mfFound(u) {
  const t = ymdK(new Date()), r = (MF.data[u] || {})[t];
  mfBody(`<div class="text-center pt-6"><div style="font-size:54px">🍱</div><div class="mf-t mt-3"><em>${E(ML.units[u] || '제' + u + '부대')}</em><br>식단표를 찾았어요!</div><p class="text-[14px] text-[#8B95A1] mt-2">이제 식단표에서 매일 자동으로 보여드려요</p></div>
   ${r ? [['아침', r.b], ['점심', r.l], ['저녁', r.n]].map(([k, v]) => `<div class="ml-meal"><b>오늘 ${k}</b><div>${E((v || []).join(', ') || '-')}</div></div>`).join('') : ''}
   <button class="mf-ok mt-6" onclick="mealSave('${u}')">이 식단표로 할게요</button><button class="mf-sub" onclick="mealFind()">다시 찾기</button>`, 100);
}
window.mealList = async function (only) {
  await units(); const C = Array.isArray(only) ? only : Object.keys(ML.units).sort();
  if (!MF.el) { MF.el = document.createElement('div'); MF.el.className = 'mf'; document.body.appendChild(MF.el); MF.el.innerHTML = `<div class="mf-top"><button onclick="mealClose()">${CHEV}</button><b class="text-[17px]">식단표 찾기</b><span style="width:40px"></span></div><div class="mf-bar"><i></i></div><div class="mf-body"></div>`; }
  MF.el.style.display = 'flex';
  mfBody(`<div class="mf-t">${Array.isArray(only) ? '후보가 몇 개 남았어요.<br>우리 부대를 골라주세요' : '부대 번호로 고르기'}</div><p class="text-[14px] text-[#8B95A1] mt-2">국방부 공공데이터에 식단을 공개한 부대예요</p><input class="mnd-in" placeholder="부대 번호 (예: 6176)" oninput="document.querySelectorAll('.mf-u').forEach(b=>b.style.display=b.dataset.c.includes(this.value.trim())?'':'none')"><div class="mt-3">${C.map(c => `<button class="mf-u w-full flex items-center justify-between py-4 border-b border-[#F2F3F5] text-[15px] font-bold" data-c="${E(c)}" onclick="mfFound('${E(c)}')">${E(ML.units[c] || c)}<span style="color:#B0B8C1">›</span></button>`).join('') || '<div class="text-center text-[13px] text-[#8B95A1] py-10">아직 등록된 부대가 없어요</div>'}</div>`, 100);
};
window.mfFound = mfFound;
window.mealSave = async function (u) {
  const { error } = await sb.from('profiles').update({ meal_unit: u }).eq('id', me.id);
  if (error) return showAlert('오류', '저장하지 못했어요. 잠시 후 다시 시도해주세요.');
  me.meal_unit = u; const S = typeof S_ === 'function' ? S_() : null; if (S && S.id === me.id) S.meal_unit = u;
  mealClose(); if (typeof zpToast === 'function') zpToast('우리 부대 식단표를 연결했어요'); if (q('modal-menu').classList.contains('flex')) renderMenu(); else openMenu();
};

/* ---------- 관리자: 내려받은 공공데이터 식단 파일(CSV) 한꺼번에 올리기 ---------- */
window.mealAdminImport = async function (inp) {
  const files = [...inp.files]; inp.value = ''; if (!files.length) return; let ok = 0, bad = [];
  for (const f of files) {
    const m = f.name.match(/(\d{3,5})\s*부대/) || f.name.match(/(\d{4})/); if (!m) { bad.push(f.name); continue; } const code = m[1];
    const buf = await f.arrayBuffer(); let t = new TextDecoder('utf-8').decode(buf); if (t.includes('�')) { try { t = new TextDecoder('euc-kr').decode(buf); } catch (e) { } }
    const rows = parseCSV(t.replace(/^﻿/, '')); if (rows.length < 2) { bad.push(f.name); continue; }
    const H = rows[0].map(x => x.trim()), ix = k => H.findIndex(h => h.includes(k) && !/열량|칼로리|kcal/i.test(h)), di = H.findIndex(h => /날짜|일자|dates/i.test(h)), bi = ix('조식'), li = ix('중식'), ni = ix('석식'), si = ix('특식');
    if (di < 0) { bad.push(f.name); continue; }
    const cl = v => (v || '').replace(/\([0-9.,\s]*\)/g, '').trim(), days = {}; let cur = null;
    rows.slice(1).forEach(r => { const mm = (r[di] || '').match(/(\d{4})\D?(\d{1,2})\D?(\d{1,2})/); if (mm) cur = `${mm[1]}-${mm[2].padStart(2, '0')}-${mm[3].padStart(2, '0')}`; if (!cur) return;
      const D0 = days[cur] ??= { unit: code, d: cur, b: [], l: [], n: [], sp: [] }; [[bi, 'b'], [li, 'l'], [ni, 'n'], [si, 'sp']].forEach(([i, k]) => { if (i < 0) return; String(r[i] || '').split(/\s*[,\n\/]\s*/).map(cl).filter(Boolean).forEach(x => { if (!D0[k].includes(x)) D0[k].push(x); }); }); });
    const out = Object.values(days); if (!out.length) { bad.push(f.name); continue; }
    await sb.from('meal_units').upsert({ code, name: '제' + code + '부대', active: true });
    for (let i = 0; i < out.length; i += 300) { const { error } = await sb.from('meal_days').upsert(out.slice(i, i + 300)); if (error) { bad.push(f.name + ' (' + error.message + ')'); break; } }
    ok++;
  }
  ML.days = {}; ML.units = {}; showAlert('식단 파일 올리기', `${ok}개 부대 식단을 올렸어요.${bad.length ? '<br><br>못 읽은 파일: ' + bad.map(E).join(', ') : ''}`);
};
})();
