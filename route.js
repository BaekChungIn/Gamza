/* 집으로가기 · 구간별 이동 경로 추정 (K=KTX·SRT역, T=시외·고속버스 터미널, M=수도권 전철역) — 좌표·시간·요금은 모두 추정치 */
const RH = [
['서울',37.555,126.972,'KTM'],['용산',37.530,126.965,'KM'],['청량리',37.580,127.047,'KM'],['수서',37.487,127.102,'K'],['영등포',37.516,126.907,'KM'],['광명',37.416,126.885,'KM'],['행신',37.612,126.834,'KM'],
['수원',37.266,127.000,'KTM'],['동탄',37.200,127.095,'KM'],['지제',36.990,127.090,'KM'],['평택',36.990,127.085,'TM'],['오산',37.145,127.067,'M'],['천안아산',36.794,127.105,'KM'],['천안',36.810,127.150,'TM'],
['오송',36.620,127.327,'K'],['청주',36.640,127.490,'T'],['대전',36.332,127.434,'KT'],['서대전',36.322,127.404,'K'],['김천구미',36.113,128.181,'K'],['김천',36.140,128.113,'T'],['구미',36.120,128.340,'T'],
['동대구',35.880,128.629,'KT'],['영천',35.970,128.940,'T'],['경산',35.830,128.740,'T'],['신경주',35.799,129.139,'K'],['경주',35.840,129.210,'T'],['울산(통도사)',35.553,129.139,'K'],['울산',35.540,129.310,'T'],
['부산',35.115,129.040,'KT'],['구포',35.209,128.999,'K'],['김해',35.230,128.880,'T'],['양산',35.340,129.040,'T'],['밀양',35.468,128.746,'K'],['창원중앙',35.256,128.624,'K'],['마산',35.210,128.580,'T'],['창원',35.230,128.680,'T'],
['진주',35.190,128.090,'KT'],['통영',34.850,128.430,'T'],['거제',34.880,128.620,'T'],['포항',36.072,129.342,'K'],['안동',36.590,128.730,'KT'],['영주',36.820,128.620,'KT'],['상주',36.410,128.160,'T'],['문경',36.590,128.190,'T'],
['영덕',36.410,129.370,'T'],['울진',36.990,129.400,'T'],['제천',37.130,128.190,'KT'],['충주',36.990,127.930,'T'],['원주',37.361,127.953,'KT'],['평창',37.547,128.441,'K'],['진부',37.640,128.560,'K'],['강릉',37.764,128.900,'KT'],
['동해',37.520,129.110,'T'],['삼척',37.450,129.170,'T'],['태백',37.170,128.990,'T'],['속초',38.210,128.590,'T'],['양양',38.080,128.620,'T'],['고성',38.380,128.470,'T'],['정선',37.380,128.660,'T'],['춘천',37.885,127.717,'TM'],
['홍천',37.690,127.890,'T'],['인제',38.070,128.170,'T'],['양구',38.110,127.990,'T'],['화천',38.110,127.710,'T'],['철원',38.150,127.310,'T'],['익산',35.940,126.947,'KT'],['군산',35.970,126.740,'T'],['전주',35.850,127.118,'KT'],
['정읍',35.576,126.843,'KT'],['남원',35.416,127.390,'KT'],['순창',35.370,127.140,'T'],['고창',35.440,126.700,'T'],['부안',35.730,126.730,'T'],['김제',35.800,126.880,'T'],['무주',36.010,127.660,'T'],['광주송정',35.138,126.791,'K'],
['광주',35.160,126.880,'T'],['나주',35.015,126.712,'K'],['담양',35.320,126.990,'T'],['영광',35.280,126.510,'T'],['무안',34.990,126.480,'T'],['목포',34.792,126.387,'KT'],['해남',34.570,126.600,'T'],['완도',34.310,126.760,'T'],
['보성',34.770,127.080,'T'],['순천',34.945,127.504,'KT'],['광양',34.940,127.700,'T'],['여수',34.752,127.745,'KT'],['고흥',34.610,127.290,'T'],['함양',35.520,127.730,'T'],['거창',35.690,127.910,'T'],['하동',35.070,127.750,'T'],
['남해',34.840,127.890,'T'],['대구서',35.860,128.540,'T'],['서산',36.780,126.450,'T'],['당진',36.890,126.630,'T'],['태안',36.750,126.300,'T'],['홍성',36.600,126.660,'T'],['예산',36.680,126.850,'T'],['보령',36.330,126.610,'T'],
['공주',36.460,127.120,'T'],['논산',36.190,127.100,'T'],['옥천',36.300,127.570,'T'],['영동',36.170,127.780,'T'],['보은',36.490,127.730,'T'],['진천',36.860,127.440,'T'],['음성',36.940,127.690,'T'],['괴산',36.810,127.790,'T'],
['안산',37.320,126.830,'TM'],['인천',37.470,126.630,'TM'],['부천',37.484,126.783,'TM'],['안양',37.400,126.922,'TM'],['시흥',37.380,126.800,'TM'],['성남',37.440,127.140,'TM'],['용인',37.240,127.180,'TM'],['화성',37.200,126.830,'TM'],
['광주(경기)',37.410,127.260,'TM'],['하남',37.540,127.210,'TM'],['구리',37.600,127.140,'M'],['남양주',37.640,127.220,'TM'],['이천',37.270,127.430,'TM'],['여주',37.300,127.640,'TM'],['양평',37.490,127.490,'TM'],['가평',37.815,127.510,'TM'],
['의정부',37.738,127.047,'TM'],['양주',37.820,127.060,'TM'],['동두천',37.900,127.060,'TM'],['소요산',37.948,127.061,'M'],['연천',38.097,127.075,'TM'],['전곡',38.000,127.070,'T'],['포천',37.890,127.200,'T'],['문산',37.859,126.787,'TM'],
['파주',37.760,126.780,'TM'],['일산',37.680,126.770,'TM'],['김포',37.620,126.720,'T'],['강화',37.750,126.490,'T'],['과천',37.430,126.990,'M']
];
const RHUB = RH.map(a => ({ n: a[0], lat: a[1], lng: a[2], k: a[3].includes('K'), t: a[3].includes('T'), m: a[3].includes('M') }));
const RI = {
  walk: '<circle cx="13" cy="4.6" r="1.8"/><path d="M9.5 21l2.3-6.2 2.4 2.2V21M11.8 14.8l-.8-5 3.2-1 1.9 3.6h2.4M11 9.8l-2.8 2.7"/>',
  bus: '<rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16M8 21v-4M16 21v-4"/><circle cx="8.5" cy="14" r=".7"/><circle cx="15.5" cy="14" r=".7"/>',
  metro: '<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 11h14M9 21l2-3M15 21l-2-3"/><circle cx="9" cy="14.5" r=".7"/><circle cx="15" cy="14.5" r=".7"/>',
  ktx: '<path d="M7 3h10a3 3 0 0 1 3 3v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a3 3 0 0 1 3-3z"/><path d="M4 11h16M8 21l2-3M16 21l-2-3M9 7h6"/>',
  car: '<path d="M5 16l1.6-5a2 2 0 0 1 1.9-1.4h7a2 2 0 0 1 1.9 1.4L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/><circle cx="7.5" cy="18" r=".7"/><circle cx="16.5" cy="18" r=".7"/>',
  taxi: '<path d="M5 16l1.6-5a2 2 0 0 1 1.9-1.4h7a2 2 0 0 1 1.9 1.4L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/><path d="M10 6.5h4v3h-4z"/><circle cx="7.5" cy="18" r=".7"/><circle cx="16.5" cy="18" r=".7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  wallet: '<path d="M3 8a2 2 0 0 1 2-2h11v3"/><rect x="3" y="8" width="18" height="12" rx="2.5"/><circle cx="16.5" cy="14" r="1"/>'
};
const rico = (k, c) => `<svg viewBox="0 0 24 24" class="ri ${c || ''}">${RI[k] || ''}</svg>`;
const P = p => ({ lat: p.lat, lng: p.lng, name: p.name });
const rhav = (a, b) => { const d = x => x * Math.PI / 180, dl = d(b.lat - a.lat), dg = d(b.lng - a.lng), h = Math.sin(dl / 2) ** 2 + Math.cos(d(a.lat)) * Math.cos(d(b.lat)) * Math.sin(dg / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };
const hubName = (h, f) => f === 'K' ? h.n + '역' : f === 'T' ? h.n + ' 터미널' : h.n + '역';
const hubPt = (h, f) => ({ lat: h.lat, lng: h.lng, name: hubName(h, f), h });
function nearH(p, f, k) { const key = f === 'K' ? 'k' : f === 'T' ? 't' : 'm'; return RHUB.filter(h => h[key]).map(h => ({ h, d: rhav(p, h) })).sort((a, b) => a.d - b.d).slice(0, k).map(x => x.h); }
const nearD = p => { let m = 1e9; RHUB.forEach(h => { const d = rhav(p, h); if (d < m) m = d; }); return m; };
const rFare = road => road <= 10 ? 1550 : road <= 50 ? 1550 + Math.ceil((road - 10) / 5) * 100 : 1550 + 800 + Math.ceil((road - 50) / 8) * 100;
function lDirect(a, b) {
  const d = rhav(a, b), road = d * 1.3;
  if (d <= .9) return [{ t: 'walk', min: Math.max(3, Math.round(road * 12)), cost: 0, a: P(a), b: P(b) }];
  const rural = nearD(a) > 7 || nearD(b) > 7, sp = d < 10 ? 18 : d < 40 ? 26 : 34, wait = (d < 10 ? 7 : 12) + (rural ? 12 : 0);
  return [{ t: 'walk', min: 4, cost: 0 }, { t: 'bus', min: Math.round(road / sp * 60 + wait), cost: 1500 + (road > 10 ? Math.ceil((road - 10) / 5) * 100 : 0), tr: d < 5 ? 0 : d < 20 ? 1 : d < 45 ? 2 : 3, to: b.name, a: P(a), b: P(b) }, { t: 'walk', min: 4, cost: 0 }];
}
const lSum = L => L.reduce((s, x) => s + x.min, 0);
function lPlan(a, b) {
  let best = lDirect(a, b);
  const sa = nearH(a, 'M', 1)[0], sb = nearH(b, 'M', 1)[0];
  if (sa && sb && sa !== sb && rhav(a, sa) <= 15 && rhav(b, sb) <= 15 && rhav(sa, sb) >= 6) {
    const pa = hubPt(sa, 'M'), pb = hubPt(sb, 'M'), road = rhav(sa, sb) * 1.25, sp = road > 40 ? 46 : 36;
    const L = [...(rhav(a, sa) > .25 ? lDirect(a, pa) : []), { t: 'metro', min: Math.round(road / sp * 60 + 6), cost: rFare(road), tr: road > 25 ? Math.min(2, Math.floor(road / 30)) : road > 10 ? 1 : 0, from: pa.name, to: pb.name, a: P(pa), b: P(pb) }, ...(rhav(sb, b) > .25 ? lDirect(pb, b) : [])];
    if (lSum(L) < lSum(best)) best = L;
  }
  return best.map(x => Object.assign({}, x));
}
function mkTrunk(kind, h1, h2, f) {
  const p1 = hubPt(h1, f), p2 = hubPt(h2, f), km = rhav(h1, h2), rail = km * 1.2, road = km * 1.3;
  if (kind === 'ktx') return { t: 'ktx', min: Math.round(rail / 170 * 60 + 20), cost: rail * 143, tx: 'KTX·SRT', from: p1.name, to: p2.name, a: P(p1), b: P(p2) };
  if (kind === 'itx') return { t: 'ktx', min: Math.round(rail / 85 * 60 + 15), cost: rail * 75, tx: 'ITX·무궁화호', from: p1.name, to: p2.name, a: P(p1), b: P(p2) };
  if (kind === 'exp') return { t: 'bus', min: Math.round(road / 80 * 60 + 15), cost: road * 62, tx: '고속·시외버스', from: p1.name, to: p2.name, big: 1, a: P(p1), b: P(p2) };
  return { t: 'bus', min: Math.round(road / 80 * 60 + 15), cost: road * 93, tx: '고속버스 우등', from: p1.name, to: p2.name, big: 1, a: P(p1), b: P(p2) };
}
function trunkPlan(a, b, kind, f, minKm) {
  const A = nearH(a, f, 4), B = nearH(b, f, 4); let best = null;
  A.forEach(h1 => B.forEach(h2 => {
    if (h1 === h2 || rhav(h1, h2) < minKm) return;
    const L = [...lPlan(a, hubPt(h1, f)), mkTrunk(kind, h1, h2, f), ...lPlan(hubPt(h2, f), b)], s = lSum(L);
    if (!best || s < best.s) best = { L, s };
  }));
  return best && best.L;
}
function rWrap(n, icon, L, lines, links) {
  const m = []; L.forEach(x => { const p = m[m.length - 1]; if (p && p.t === 'walk' && x.t === 'walk') p.min += x.min; else m.push(x); });
  const veh = m.filter(x => x.t !== 'walk' && x.t !== 'car' && x.t !== 'taxi');
  return { n, icon, legs: m, min: m.reduce((s, x) => s + x.min, 0), cost: m.reduce((s, x) => s + (x.cost || 0), 0), walk: m.filter(x => x.t === 'walk').reduce((s, x) => s + x.min, 0), tr: Math.max(0, veh.length - 1) + veh.reduce((s, x) => s + (x.tr || 0), 0), lines: lines || [], links: links || [] };
}
function buildOpts(km, c) {
  const a = c.a, b = c.b, road = km * 1.3, o = [], W_ = n => (Math.round(n / 100) * 100).toLocaleString('ko-KR') + '원';
  const kk = m => `https://map.kakao.com/link/by/${m}/${encodeURIComponent(a.name)},${a.lat},${a.lng}/${encodeURIComponent(b.name)},${b.lat},${b.lng}`;
  const KORAIL = ['코레일톡 시간표', 'https://www.letskorail.com'], SRT = ['SRT 시간표', 'https://etk.srail.kr'], KOBUS = ['고속버스 시간표', 'https://www.kobus.co.kr'], BUSTA = ['시외버스 시간표', 'https://www.bustago.or.kr'];
  o.push(rWrap('자가용 · 렌트', 'car', [{ t: 'car', min: Math.round(road / 80 * 60 + 10), cost: road * 142 + (road >= 40 ? road * 45 : 0), tx: '자가용', big: 1, a: P(a), b: P(b) }], [`유류비 약 ${W_(road * 142)}${road >= 40 ? ` + 통행료 약 ${W_(road * 45)}` : ''} (연비 12km/L 가정)`, `도로 약 ${Math.round(road)}km · 막히면 더 걸려요`], [['카카오맵 자동차 길찾기', kk('car')]]));
  if (km < 60) o.push(rWrap('택시', 'taxi', [{ t: 'taxi', min: Math.round(road / 45 * 60 + 5), cost: 4800 + Math.max(0, road - 1.6) * 1000, tx: '택시', big: 1, a: P(a), b: P(b) }], ['기본요금+거리요금 단순 계산 (할증·지역별 차이)'], [['카카오맵 길찾기', kk('car')]]));
  if (km >= .3 && km < 1.6) o.push(rWrap('도보', 'walk', [{ t: 'walk', min: Math.round(road * 12), cost: 0, a: P(a), b: P(b) }], ['가까워서 걸어갈 수 있어요']));
  if (km >= 1.6 && km <= 130) { const L = lPlan(a, b), hasMetro = L.some(x => x.t === 'metro'); if (hasMetro || km <= 45) o.push(rWrap('시내·광역 대중교통', hasMetro ? 'metro' : 'bus', L, ['나라사랑카드 등 대중교통 청구할인 가능', '배차 간격·막차 시간은 지도 앱에서 꼭 확인하세요'], [['카카오맵 대중교통', kk('publictransit')]])); }
  if (km >= 30) { const L = trunkPlan(a, b, 'exp', 'T', 25); if (L) o.push(rWrap('시외·고속버스 (일반)', 'bus', L, ['군 장병 우대 10~20% 할인 가능 (터미널 창구·티머니GO)'], [KOBUS, BUSTA])); }
  if (km >= 60) { const L = trunkPlan(a, b, 'pre', 'T', 40); if (L) o.push(rWrap('고속버스 (우등)', 'bus', L, ['좌석이 넓은 우등 등급', '군 장병 우대 할인 가능'], [KOBUS])); }
  if (km >= 90) { const L = trunkPlan(a, b, 'ktx', 'K', 60); if (L) o.push(rWrap('KTX · SRT 환승 이동', 'ktx', L, ['밀리패스 인증 시 열차 요금 약 10% 할인', 'TMO 대상 휴가증(포상·위로·보상·청원)이면 열차 무료'], [KORAIL, SRT])); }
  if (km >= 60) { const L = trunkPlan(a, b, 'itx', 'K', 50); if (L) o.push(rWrap('ITX · 무궁화호', 'ktx', L, ['KTX보다 느리지만 저렴해요', 'TMO 대상 휴가증이면 무료'], [KORAIL])); }
  return o;
}

/* ================= 집으로 가는 길 · 카카오맵 + 실시간 ================= */
const RT = { map: null, kind: '', objs: [], idx: 0, live: {}, car: {}, L: [], A: null, B: null };
RT.C = { walk: '#9AA3AD' };
const RC = { car: '#3182F6', taxi: '#F2A900', bus: '#2FB36E', big: '#7B5CF5', metro: '#1F7AE0', ktx: '#E5484D', walk: '#8B95A1' };
const legColor = x => { const T = rtTh(); return x.t === 'walk' ? '#9AA3AD' : (x.t === 'car' || x.t === 'ktx' || x.big) ? T.l1 : x.t === 'metro' && x.color ? x.color : T.l2; };
const rtCk = x => `${x.a.lat},${x.a.lng}>${x.b.lat},${x.b.lng}`;
(function () {
  const css = `
.rt-mapx{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;color:#8B95A1;font-weight:700}
.rt-tabs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -16px 10px;padding:2px 16px}.rt-tabs::-webkit-scrollbar{display:none}
.rt-tabs button{flex-shrink:0;display:flex;align-items:center;gap:6px;height:42px;padding:0 13px 0 6px;border-radius:14px;background:#fff;border:1px solid #E5E8EB;font-size:13px;font-weight:700;color:#4E5968;white-space:nowrap}
.rt-tabs button em{font-style:normal;width:22px;height:22px;border-radius:8px;background:#F2F4F6;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800}
.rt-tabs button small{font-size:11.5px;color:#8B95A1;font-weight:700}
.rt-tabs button .ri{width:16px;height:16px}
.rt-tabs button.on{background:#191F28;border-color:#191F28;color:#fff}.rt-tabs button.on em{background:rgba(255,255,255,.18)}.rt-tabs button.on small{color:rgba(255,255,255,.65)}
.rt-pager{display:flex;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:none;align-items:flex-start;margin:0 -16px;transition:height .25s}.rt-pager::-webkit-scrollbar{display:none}
.rt-page{flex:0 0 100%;min-width:0;scroll-snap-align:start;padding:0 16px;box-sizing:border-box}
.rt-card{background:#fff;border-radius:24px;padding:18px;border:1px solid rgba(107,123,92,.06);box-shadow:0 8px 24px rgba(107,123,92,.04)}
.rt-card .rt-sum{background:#F7F8FA}
.rt-dots{display:flex;justify-content:center;gap:6px;margin:12px 0 4px}.rt-dots i{width:6px;height:6px;border-radius:3px;background:#D1D6DB;transition:all .2s}.rt-dots i.on{width:18px;background:#191F28}
.rt-live{display:none;margin:2px 0 6px 30px;padding:10px 12px;border-radius:14px;background:#F5F7FA;font-size:12.5px;color:#333D4B;line-height:1.5}.rt-live.on{display:block}
.rt-live .lv-h{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:#8B95A1;margin-bottom:4px}
.rt-live .lv-h i{width:6px;height:6px;border-radius:50%;background:#2FB36E;box-shadow:0 0 0 3px rgba(47,179,110,.18);animation:lvP 1.6s infinite}
@keyframes lvP{50%{box-shadow:0 0 0 6px rgba(47,179,110,0)}}
.rt-live .lv-rec{font-size:14px;font-weight:800;color:#191F28}.rt-live .lv-rec em{font-style:normal;color:#E5484D}
.rt-live .lv-sub{color:#6B7684;font-size:12px;margin-top:2px}
.rt-live .lv-ch{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.rt-live .lv-ch span{background:#fff;border:1px solid #E5E8EB;border-radius:9px;padding:4px 8px;font-size:12px;font-weight:700}
.rt-live .lv-ch span b{color:#E5484D}
.rt-live .lv-x{color:#8B95A1;font-size:12px}
.rt-pin{transform:translateY(-4px);padding:5px 9px;border-radius:10px;color:#fff;font-size:12px;font-weight:800;white-space:nowrap;box-shadow:0 3px 8px rgba(0,0,0,.25);position:relative}
.rt-pin::after{content:'';position:absolute;left:50%;bottom:-5px;margin-left:-5px;border:5px solid transparent;border-bottom:0;border-top-color:inherit}
.rt-pin.s{background:#191F28;border-color:#191F28}.rt-pin.e{background:#E5484D;border-color:#E5484D}
.rt-dot{display:flex;align-items:center;gap:4px;transform:translate(-6px,-6px)}.rt-dot i{width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid var(--c)}.rt-dot span{background:rgba(255,255,255,.92);padding:2px 6px;border-radius:7px;font-size:11px;font-weight:800;color:#191F28;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.rt-refresh{font-size:11px;font-weight:800;color:#4E5968;background:#F2F4F6;border-radius:9px;padding:5px 9px;display:inline-flex;align-items:center;gap:4px}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
function rtCurve(a, b, k) {
  const n = 30, c = { lat: (a.lat + b.lat) / 2 - (b.lng - a.lng) * k, lng: (a.lng + b.lng) / 2 + (b.lat - a.lat) * k }, out = [];
  for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; out.push([u * u * a.lat + 2 * u * t * c.lat + t * t * b.lat, u * u * a.lng + 2 * u * t * c.lng + t * t * b.lng]); }
  return out;
}
function rtSegs(o) {
  const A = RT.A, B = RT.B, segs = [], stops = []; let cur = A;
  o.legs.forEach((x, i) => {
    if (x.t === 'walk' && x.path && x.path.length > 1) { segs.push({ pts: x.path, c: RT.C.walk, dash: 1, w: 3 }); cur = x.b || cur; return; }
    if (!x.a || !x.b || x.t === 'walk') return;
    if (rhav(cur, x.a) > .05) segs.push({ pts: [[cur.lat, cur.lng], [x.a.lat, x.a.lng]], c: RC.walk, dash: 1, w: 3 });
    const real = (x.t === 'car' || x.t === 'taxi') && RT.car[rtCk(x)];
    const pts = x.path && x.path.length > 1 ? x.path : real ? real.path : rhav(x.a, x.b) < 2 ? [[x.a.lat, x.a.lng], [x.b.lat, x.b.lng]] : rtCurve(x.a, x.b, x.t === 'ktx' ? .07 : (i % 2 ? -.1 : .1));
    segs.push({ pts, c: legColor(x), w: x.big || x.t === 'ktx' || x.t === 'car' ? 6 : 5 });
    if (x.t !== 'car' && x.t !== 'taxi') [[x.a, x.from], [x.b, x.to]].forEach(([p, n]) => { n = n || p.name; if (n && n !== A.name && n !== B.name && !stops.some(s => s.n === n)) stops.push({ p, n, c: legColor(x) }); });
    cur = x.b;
  });
  if (rhav(cur, B) > .05) segs.push({ pts: [[cur.lat, cur.lng], [B.lat, B.lng]], c: RC.walk, dash: 1, w: 3 });
  return { segs, stops };
}
function leafReady() {
  return new Promise(res => {
    if (window.L && window.L.map) return res(true);
    const c = document.createElement('link'); c.rel = 'stylesheet'; c.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'; document.head.appendChild(c);
    const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'; s.onload = () => res(!!window.L); s.onerror = () => res(false); document.head.appendChild(s);
  });
}
async function rtMapInit() {
  const el = document.getElementById('rt-map'); if (!el) return false;
  if (RT.map && RT.el === el) return true;
  RT.el = el; RT.objs = []; RT.map = null;
  try {
    if (typeof kakaoReady === 'function' && await kakaoReady()) { RT.kind = 'k'; RT.map = new kakao.maps.Map(el, { center: new kakao.maps.LatLng(RT.A.lat, RT.A.lng), level: 9 }); return true; }
  } catch (e) { }
  if (await leafReady()) { RT.kind = 'l'; RT.map = window.L.map(el, { zoomControl: false }); window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(RT.map); return true; }
  el.innerHTML = '<div class="rt-mapx">지도를 불러오지 못했어요</div>'; return false;
}
async function rtDraw(i) {
  const o = RT.L[i]; if (!o || !(await rtMapInit())) return;
  const { segs, stops } = rtSegs(o), A = RT.A, B = RT.B, M = RT.map;
  RT.objs.forEach(x => { try { RT.kind === 'k' ? x.setMap(null) : M.removeLayer(x); } catch (e) { } }); RT.objs = [];
  const pin = (p, cls, t) => `<div class="rt-pin ${cls}" style="${cls === 'e' ? `background:${rtTh().e};border-color:${rtTh().e}` : ''}">${t}</div>`, dot = s => `<div class="rt-dot" style="--c:${s.c}"><i></i><span>${esc(s.n)}</span></div>`;
  if (RT.kind === 'k') {
    const K = kakao.maps, LL = p => new K.LatLng(p[0], p[1]), bd = new K.LatLngBounds();
    segs.forEach(s => {
      const path = s.pts.map(LL); path.forEach(p => bd.extend(p));
      if (!s.dash) { const cas = new K.Polyline({ path, strokeWeight: s.w + 4, strokeColor: '#FFFFFF', strokeOpacity: .95 }); cas.setMap(M); RT.objs.push(cas); }
      const l = new K.Polyline({ path, strokeWeight: s.w, strokeColor: s.c, strokeOpacity: .95, strokeStyle: s.dash ? 'shortdash' : 'solid' }); l.setMap(M); RT.objs.push(l);
    });
    stops.forEach(s => { const ov = new K.CustomOverlay({ position: new K.LatLng(s.p.lat, s.p.lng), content: dot(s), xAnchor: 0, yAnchor: 0, zIndex: 2 }); ov.setMap(M); RT.objs.push(ov); });
    [[A, 's', '출발'], [B, 'e', '도착']].forEach(([p, c, t]) => { const ov = new K.CustomOverlay({ position: new K.LatLng(p.lat, p.lng), content: pin(p, c, t), yAnchor: 1, zIndex: 3 }); ov.setMap(M); RT.objs.push(ov); bd.extend(new K.LatLng(p.lat, p.lng)); });
    RT.bd = bd; M.relayout(); M.setBounds(bd, rtTopPad(), 30, rtSheetVis() + 24, 30);
  } else {
    const Lf = window.L, all = [];
    segs.forEach(s => { if (!s.dash) RT.objs.push(Lf.polyline(s.pts, { color: '#fff', weight: s.w + 4, opacity: .95 }).addTo(M)); RT.objs.push(Lf.polyline(s.pts, { color: s.c, weight: s.w, opacity: .95, dashArray: s.dash ? '6 7' : null }).addTo(M)); all.push(...s.pts); });
    stops.forEach(s => RT.objs.push(Lf.marker([s.p.lat, s.p.lng], { icon: Lf.divIcon({ className: '', html: dot(s), iconSize: [0, 0] }) }).addTo(M)));
    [[A, 's', '출발'], [B, 'e', '도착']].forEach(([p, c, t]) => { RT.objs.push(Lf.marker([p.lat, p.lng], { icon: Lf.divIcon({ className: '', html: `<div style="transform:translate(-50%,-100%)">${pin(p, c, t)}</div>`, iconSize: [0, 0] }) }).addTo(M)); all.push([p.lat, p.lng]); });
    RT.bdl = all; M.invalidateSize(); M.fitBounds(all, { paddingTopLeft: [30, rtTopPad()], paddingBottomRight: [30, rtSheetVis() + 24] });
  }
}
/* ---- 실시간: 버스 도착 · 지하철 도착 · 고속/시외버스 · 기차 시간표 · 자동차 실제 경로 ---- */
function rtCall(body) {
  const k = JSON.stringify(body); if (RT.live[k]) return RT.live[k];
  return (RT.live[k] = (async () => { try { const r = await sb.functions.invoke('transit-live', { body }); if (r.data) return r.data;
    let m = (r.error && r.error.message) || 'error'; try { const c = r.error && r.error.context; if (c && c.status) m = `HTTP ${c.status} · ` + ((await c.text()) || '').slice(0, 80); } catch (e) { }
    if (/401|JWT|Unauthorized/i.test(m)) m += ' (함수 Verify JWT 설정 확인)'; if (/404|not found/i.test(m)) m += ' (transit-live 함수 이름 확인)'; return { error: m }; } catch (e) { return { error: String(e) }; } })());
}
const nowHM = (add) => { const d = new Date(Date.now() + (add || 0) * 6e4); return [String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'), d.getDate() !== new Date().getDate()]; };
const lvHead = t => `<div class="lv-h"><i></i>${t}</div>`;
const lvErr = r => /없음/.test((r && r.error) || '') ? `${lvHead('실시간')}<div class="lv-x">실시간 정보를 준비하고 있어요 (${esc(String(r.error).replace(/ 없음/, ''))} 필요)</div>` : `${lvHead('실시간')}<div class="lv-x">지금은 정보를 불러오지 못했어요${r && (r.note || r.error) ? `<br><span style="font-size:11px;color:#B0B8C1">${esc(String(r.note || r.error).slice(0, 90))}</span>` : ''}</div>`;
function lvSched(r, at, label) {
  if (!r || r.error) return lvErr(r);
  const [ready, nextDay] = nowHM(at + 10), list = nextDay ? [] : (r.items || []).filter(x => x.dep >= ready), fare = x => x.fare ? ` · ${W(x.fare)}` : '';
  const head = lvHead(`${label}${r.kind ? ' · ' + r.kind : ''} 시간표${r.from ? ` · ${esc(r.from)} → ${esc(r.to)}` : ''}`);
  if (!list.length) { const t = (r.tomorrow || [])[0]; return head + (t ? `<div class="lv-rec">오늘 남은 차가 없어요</div><div class="lv-sub">내일 첫차 <b>${t.dep}</b> ${esc(t.g)} · 도착 ${t.arr}${fare(t)}</div>` : `<div class="lv-x">${r.note ? esc(r.note) : '오늘 남은 배차가 없어요'}</div>`); }
  const rec = list[0];
  return head + `<div class="lv-rec">추천 <em>${rec.dep}</em> ${esc(rec.g)}${rec.no ? ' ' + esc(rec.no) + '호' : ''} · 도착 ${rec.arr}</div><div class="lv-sub">지금 출발하면 ${ready}쯤 도착해서 여유 있게 탈 수 있어요${fare(rec)}</div>${list.length > 1 ? `<div class="lv-ch">${list.slice(1, 6).map(x => `<span>${x.dep} <small style="color:#8B95A1">${esc(x.g)}</small></span>`).join('')}</div>` : ''}`;
}
function lvBus(r, nos) {
  if (!r || r.error) return lvErr(r);
  if (nos && nos.length) { const want = a => nos.some(n => String(a.no).replace(/\s/g, '').split('(')[0] === n); const R = (r.stops || []).map(s => Object.assign({}, s, { arr: s.arr.filter(want) })).filter(s => s.arr.length); if (R.length) r = Object.assign({}, r, { stops: R }); else if ((r.stops || []).some(s => s.arr.length)) return lvHead('실시간 버스 도착') + `<div class="lv-x">${esc(nos.join(' · '))}번은 지금 도착 예정 정보가 없어요</div>`; }
  const S = (r.stops || []).filter(s => s.arr.length);
  if (!S.length) return lvHead('실시간 버스') + `<div class="lv-x">${(r.stops || []).length ? `${esc(r.stops[0].stop)} 정류장에 곧 오는 버스 정보가 없어요` : '근처 정류장을 찾지 못했어요'}</div>`;
  return lvHead('실시간 버스 도착') + S.map(s => `<div style="margin-top:4px"><b>${esc(s.stop)}</b> <span style="color:#8B95A1;font-size:11.5px">${s.dist}m</span><div class="lv-ch">${s.arr.slice(0, 5).map(a => `<span>${esc(a.no)}번 <b>${a.min ? a.min + '분 뒤' : '곧 도착'}</b>${a.left ? ` <small style="color:#8B95A1">${a.left}정거장 전</small>` : ''}</span>`).join('')}</div></div>`).join('');
}
function lvSub(r) {
  if (!r || r.error || r.note) return r && /SEOUL/.test(r.note || '') ? '' : lvErr(r);
  if (!(r.items || []).length) return lvHead('실시간 지하철') + `<div class="lv-x">${esc(r.st || '')}역 도착 정보가 없어요 (수도권 전철만 지원)</div>`;
  return lvHead(`실시간 지하철 · ${esc(r.st)}역`) + `<div class="lv-ch">${r.items.slice(0, 6).map(x => `<span>${esc(x.line.split(' - ')[0])} <b>${x.sec ? Math.max(1, Math.round(x.sec / 60)) + '분 뒤' : esc(x.msg)}</b></span>`).join('')}</div>`;
}
function rtLive(i, force) {
  const o = RT.L[i]; if (!o || (o._live && !force)) return; o._live = 1; let before = 0;
  o.legs.forEach((x, j) => {
    const at = before; before += x.min;
    const put = h => { const b = document.querySelector(`#rt-pager [data-lk="${i}-${j}"]`); if (!b) return; b.innerHTML = h; b.classList.toggle('on', !!h); rtFitH(); };
    if (!x.a) return;
    if (x.t === 'car' || x.t === 'taxi') rtCall({ action: 'car', a: x.a, b: x.b }).then(r => {
      if (!r || r.error || !r.path) return put(lvErr(r)); RT.car[rtCk(x)] = r;
      if (!x._real) { x._real = 1; x.min = r.min; x.cost = x.t === 'taxi' ? (r.taxi || x.cost) : r.km * 142 + (r.toll || 0); o.min = o.legs.reduce((t, l) => t + l.min, 0); o.cost = o.legs.reduce((t, l) => t + (l.cost || 0), 0);
        const pg = document.querySelectorAll('#rt-pager .rt-page')[i], tb = document.querySelectorAll('#rt-tabs button small')[i];
        if (pg && typeof rtCardHTML === 'function') { pg.innerHTML = rtCardHTML(o, i); if (tb) tb.textContent = fmtM(o.min); o._live = 0; return rtLive(i); } }
      put(lvHead('카카오내비 실제 경로') + `<div class="lv-rec">${fmtM(r.min)} · ${r.km}km</div><div class="lv-sub">${r.toll ? `통행료 ${W(r.toll)}` : '통행료 없음'}${x.t === 'taxi' && r.taxi ? ` · 택시비 약 ${W(r.taxi)}` : ''} · 지금 교통 상황 기준</div>`);
      if (RT.idx === i) rtDraw(i);
    });
    else if (x.t === 'bus' && !x.big) rtCall({ action: 'bus', lat: +x.a.lat.toFixed(4), lng: +x.a.lng.toFixed(4) }).then(r => put(lvBus(r, x.nos)));
    else if (x.t === 'metro') rtCall({ action: 'subway', st: x.from || x.a.name }).then(r => { put(lvSub(r)); const ids = [...new Set(((r && r.items) || []).map(z => z.lid).filter(z => SUBL[z]))]; if (ids.length) { RT.lines[i] = [...new Set([...(RT.lines[i] || []), ...ids])].slice(0, 2); if (RT.idx === i) rtTrains(i); } });
    else if (x.t === 'bus' && x.big) rtCall({ action: 'exp', from: x.from, to: x.to }).then(r => put(lvSched(r, at, '버스')));
    else if (x.t === 'ktx' && /SRT/.test(x.tx || '') && !/KTX/.test(x.tx || '')) put(lvHead('SRT') + `<div class="lv-x">SRT 시간표는 SRT 앱 · 웹에서 확인해요</div>`);
    else if (x.t === 'ktx' && /항공|여객선/.test(x.tx || '')) put('');
    else if (x.t === 'ktx') rtCall({ action: 'train', from: x.from, to: x.to, kind: /KTX/.test(x.tx || '') ? 'ktx' : 'itx' }).then(r => put(lvSched(r, at, /KTX/.test(x.tx || '') ? 'KTX' : '열차')));
  });
}
function rtFitH() { const p = document.getElementById('rt-pager'); if (!p) return; const pg = p.children[RT.idx]; if (pg) p.style.height = pg.offsetHeight + 'px'; }
function rtSel(i) {
  RT.idx = i; document.querySelectorAll('#rt-tabs button').forEach((b, k) => b.classList.toggle('on', k === i)); document.querySelectorAll('#rt-dots i').forEach((b, k) => b.classList.toggle('on', k === i));
  const t = document.querySelectorAll('#rt-tabs button')[i]; if (t) t.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  const bd = document.getElementById('route-body'); if (bd && bd.scrollTop > 0) bd.scrollTo({ top: 0, behavior: 'smooth' });
  rtFitH(); rtDraw(i); rtLive(i); rtTrains(i);
}
window.rtPg = i => { const p = document.getElementById('rt-pager'); if (!p) return; p.scrollTo({ left: i * p.clientWidth, behavior: 'smooth' }); rtSel(i); };
window.rtPgSync = el => { const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth)); if (i !== RT.idx) rtSel(i); };
window.rtRefresh = i => { RT.live = {}; const o = RT.L[i]; if (o) { o._live = 0; rtLive(i, true); } };
window.rtSet = (L, a, b) => { rtApplyTh(); if (!RT.sheetInit) { RT.sheetInit = 1; rtSheet(1, true); } RT.L = L; RT.A = a; RT.B = b; RT.lines = {}; rtTrainsOff(); L.forEach(o => o._live = 0); RT.idx = 0; requestAnimationFrame(() => { rtFitH(); rtDraw(0); rtLive(0); }); };
window.rtShow = () => { rtSheet(RT.snap, true); if (RT.map) { try { RT.kind === 'k' ? RT.map.relayout() : RT.map.invalidateSize(); } catch (e) { } } rtDraw(RT.idx); rtFitH(); };

/* ---- 지도 위 실시간 열차 (서울 실시간 열차 위치 · 30초마다) ---- */
const SUBL = { '1001': ['1호선', '#0052A4'], '1002': ['2호선', '#00A84D'], '1003': ['3호선', '#EF7C1C'], '1004': ['4호선', '#00A5DE'], '1005': ['5호선', '#996CAC'], '1006': ['6호선', '#CD7C2F'], '1007': ['7호선', '#747F00'], '1008': ['8호선', '#E6186C'], '1009': ['9호선', '#BDB092'], '1061': ['중앙선', '#77C4A3'], '1063': ['경의중앙선', '#77C4A3'], '1065': ['공항철도', '#0090D2'], '1067': ['경춘선', '#0C8E72'], '1075': ['수인분당선', '#FABE00'], '1077': ['신분당선', '#D4003B'], '1092': ['우이신설선', '#B0CE18'], '1093': ['서해선', '#8FC31F'], '1081': ['경강선', '#003DA5'], '1032': ['GTX-A', '#9A6292'] };
RT.lines = {}; RT.tobj = []; RT.poll = null;
RT.stC = (() => { try { return JSON.parse(localStorage.getItem('zt_stc') || '{}'); } catch (e) { return {}; } })();
(function () { const st = document.createElement('style'); st.textContent = `.rt-train{display:flex;align-items:center;gap:3px;transform:translate(-50%,-50%);pointer-events:none}
.rt-train b{width:22px;height:22px;border-radius:8px;background:var(--c);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid #fff}
.rt-train b svg{width:13px;height:13px}.rt-train span{font-size:10px;font-weight:800;color:#191F28;background:rgba(255,255,255,.9);border-radius:6px;padding:1px 4px;white-space:nowrap}
.rt-train.ar b{animation:rtTr 1.4s infinite}@keyframes rtTr{50%{box-shadow:0 0 0 6px rgba(0,0,0,0),0 0 0 3px var(--c)}}
.rt-train.d1{margin-left:14px}.rt-train.d0{margin-left:-14px}`; document.head.appendChild(st); })();
const TRN = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 10h14M9 21l1.5-3M15 21l-1.5-3"/></svg>';
function rtTrainsOff() { clearTimeout(RT.poll); RT.poll = null; RT.tobj.forEach(x => { try { RT.kind === 'k' ? x.setMap(null) : RT.map.removeLayer(x); } catch (e) { } }); RT.tobj = []; }
function stGeo(n) {
  n = String(n || '').replace(/\(.*?\)/g, '').replace(/역$/, '').trim(); if (!n) return Promise.resolve(null);
  if (n in RT.stC) return Promise.resolve(RT.stC[n]);
  if (!(window.kakao && kakao.maps && kakao.maps.services && kakao.maps.services.Places)) return Promise.resolve(null);
  return new Promise(res => new kakao.maps.services.Places().keywordSearch(n + '역', (d, st) => {
    const L = st === kakao.maps.services.Status.OK ? d : [], x = L.find(p => p.place_name.replace(/\s/g, '').startsWith(n + '역')) || L[0];
    const v = x ? [+(+x.y).toFixed(5), +(+x.x).toFixed(5)] : null; RT.stC[n] = v; try { localStorage.setItem('zt_stc', JSON.stringify(RT.stC)); } catch (e) { } res(v);
  }, { category_group_code: 'SW8' }));
}
async function rtTrains(i) {
  rtTrainsOff(); const ids = RT.lines[i]; if (!ids || !ids.length || RT.idx !== i || !RT.map) return;
  const shown = () => { const m = document.getElementById('modal-route'); return m && !m.classList.contains('hidden') && document.visibilityState === 'visible'; };
  if (!shown()) return;
  const add = [];
  for (const lid of ids) {
    const [line, col] = SUBL[lid]; let r; try { r = (await sb.functions.invoke('transit-live', { body: { action: 'pos', line } })).data; } catch (e) { r = null; }
    if (!r || !r.trains) continue;
    const T = r.trains, q2 = [...T]; const work = async () => { while (q2.length) { const t = q2.shift(); const p = await stGeo(t.st); if (p) add.push({ t, p, col, line }); } };
    await Promise.all([work(), work(), work(), work()]);
  }
  if (RT.idx !== i || !shown()) return; rtTrainsOff();
  { const ML = RT.L[i].legs.filter(x => x.t === 'metro' && x.a && x.b); if (ML.length) { let la0 = 90, la1 = -90, lo0 = 180, lo1 = -180; ML.forEach(x => (x.path && x.path.length ? x.path : [[x.a.lat, x.a.lng], [x.b.lat, x.b.lng]]).forEach(([la, lo]) => { la0 = Math.min(la0, la); la1 = Math.max(la1, la); lo0 = Math.min(lo0, lo); lo1 = Math.max(lo1, lo); }));
    const m = .03; for (let k = add.length - 1; k >= 0; k--) { const [la, lo] = add[k].p; if (la < la0 - m || la > la1 + m || lo < lo0 - m || lo > lo1 + m) add.splice(k, 1); } } }
  add.forEach(({ t, p, col }) => {
    const html = `<div class="rt-train d${t.ud === '1' ? 1 : 0}${t.s === '1' ? ' ar' : ''}" style="--c:${col}"><b>${TRN}</b><span>${esc(String(t.tnm).replace(/역$/, ''))}${t.ex ? ' 급행' : ''}</span></div>`;
    if (RT.kind === 'k') { const ov = new kakao.maps.CustomOverlay({ position: new kakao.maps.LatLng(p[0], p[1]), content: html, xAnchor: 0, yAnchor: 0, zIndex: 4 }); ov.setMap(RT.map); RT.tobj.push(ov); }
    else if (window.L) RT.tobj.push(window.L.marker(p, { icon: window.L.divIcon({ className: '', html, iconSize: [0, 0] }) }).addTo(RT.map));
  });
  const box = document.querySelector(`#rt-pager .rt-page:nth-child(${i + 1}) .rt-trn`) || (() => { const lv = [...document.querySelectorAll(`#rt-pager [data-lk^="${i}-"]`)].find(e => /지하철/.test(e.textContent)); if (!lv) return null; const d = document.createElement('div'); d.className = 'rt-trn lv-sub'; lv.appendChild(d); return d; })();
  RT.tpts = add.map(x => x.p);
  if (box) box.innerHTML = add.length ? `<div class="flex items-center gap-2 mt-1.5"><span>지도에 열차 ${add.length}대 · 30초마다 새로 고쳐요</span><button onclick="rtZoomMetro(${i})" class="rt-refresh ml-auto" style="background:#191F28;color:#fff">지도에서 열차 보기</button></div>` : '';
  RT.poll = setTimeout(() => rtTrains(i), 30000);
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && RT.L.length) rtTrains(RT.idx); });

window.rtZoomMetro = i => {
  const o = RT.L[i]; if (!o || !RT.map) return; const P = [];
  o.legs.filter(x => x.t === 'metro' && x.a).forEach(x => P.push([x.a.lat, x.a.lng], [x.b.lat, x.b.lng]));
  (RT.tpts || []).forEach(p => P.push(p)); if (!P.length) return;
  rtSheet(0); setTimeout(() => { if (RT.kind === 'k') { const bd = new kakao.maps.LatLngBounds(); P.forEach(p => bd.extend(new kakao.maps.LatLng(p[0], p[1]))); RT.map.setBounds(bd, rtTopPad(), 40, rtSheetVis() + 24, 40); } else RT.map.fitBounds(P, { paddingTopLeft: [36, rtTopPad()], paddingBottomRight: [36, rtSheetVis() + 24] }); }, 340);
};

/* ================= 전체 지도 + 아래에서 올라오는 시트 · 색상 테마 ================= */
const ZT_PAL = window.ZT_PAL = {
  army: { n: '짬타이거', p: '#2B3426', t: '#EEF2E8', a: '#6B7B5C', l1: '#2B3426', l2: '#8FA36B', e: '#B5523B', s: ['#2B3426', '#6B7B5C', '#E4E8DD'] },
  wine: { n: '와인 밀크', p: '#930400', t: '#FFF7E6', a: '#95BAEB', l1: '#930400', l2: '#5E8FD6', e: '#930400', s: ['#930400', '#FFF7E6', '#95BAEB'] },
  choco: { n: '버터 초코', p: '#432F2E', t: '#FEF5D6', a: '#C4DAE8', l1: '#432F2E', l2: '#6E9CC0', e: '#D49A12', s: ['#432F2E', '#FEEFB8', '#C4DAE8'] },
  mint: { n: '민트 초코', p: '#684F48', t: '#E6F2F4', a: '#F9E7C7', l1: '#684F48', l2: '#6FA7B4', e: '#C98B5A', s: ['#684F48', '#D6E9ED', '#F9E7C7'] }
};
const thGet = () => { try { return localStorage.getItem('zt_th') || localStorage.getItem('zt_rtth') || 'army'; } catch (e) { return 'army'; } };
const thSet = k => { try { localStorage.setItem('zt_th', k); localStorage.removeItem('zt_rtth'); localStorage.removeItem('zt_mlth'); } catch (e) { } };
const rtTh = () => ZT_PAL[thGet()] || ZT_PAL.army;
window.rtThemeDots = () => `<span class="rt-dots3">${rtTh().s.map(c => `<i style="background:${c}"></i>`).join('')}</span>`;
function rtApplyTh() {
  const m = document.getElementById('modal-route'), T = rtTh(); if (!m) return;
  m.style.setProperty('--tp', T.p); m.style.setProperty('--tt', T.t); m.style.setProperty('--ta', T.a); m.style.setProperty('--te', T.e); m.style.setProperty('--tl2', T.l2);
}
window.rtThemePick = () => {
  const cur = thGet(), ov = document.createElement('div'); ov.className = 'rt-thov'; ov.onclick = e => { if (e.target === ov) ov.remove(); };
  ov.innerHTML = `<div class="rt-thbox"><b>색상 테마</b><p style="grid-column:1/-1;font-size:13px;color:#8B95A1;margin:-6px 0 4px">집으로 가기 · 식단표에 같이 적용돼요</p>${Object.entries(ZT_PAL).map(([k, T]) => `<button data-k="${k}" class="${k === cur ? 'on' : ''}"><span class="rt-dots3 big">${T.s.map(c => `<i style="background:${c}"></i>`).join('')}</span>${T.n}</button>`).join('')}</div>`;
  ov.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { thSet(b.dataset.k); ov.remove(); rtApplyTh(); const t = document.querySelector('.rt-thb'); if (t) t.innerHTML = rtThemeDots(); rtDraw(RT.idx); });
  document.getElementById('modal-route').appendChild(ov);
};
/* 시트: 아래 · 중간 · 거의 전체 3단계, 손잡이를 끌어서 올리고 내려요 */
const rtSnaps = () => { const H = window.innerHeight; return [Math.round(H * .36), Math.round(H * .58), Math.round(H - Math.max(70, (window.visualViewport ? 0 : 0) + 70))]; };
RT.snap = 1;
function rtSheetVis() { const s = document.getElementById('rt-sheet'); return s ? Math.min(s.offsetHeight, window.innerHeight * .62) : 300; }
function rtTopPad() { return 86; }
function rtSheet(i, noAnim) {
  const s = document.getElementById('rt-sheet'); if (!s) return; RT.snap = Math.max(0, Math.min(2, i)); s.style.transition = noAnim ? 'none' : 'height .34s cubic-bezier(.2,.9,.3,1)'; s.style.height = rtSnaps()[RT.snap] + 'px';
  clearTimeout(RT.refit); RT.refit = setTimeout(rtRefit, noAnim ? 0 : 360);
}
function rtRefit() { if (!RT.map) return; try { if (RT.kind === 'k' && RT.bd) { RT.map.relayout(); RT.map.setBounds(RT.bd, rtTopPad(), 30, rtSheetVis() + 24, 30); } else if (RT.bdl) { RT.map.invalidateSize(); RT.map.fitBounds(RT.bdl, { paddingTopLeft: [30, rtTopPad()], paddingBottomRight: [30, rtSheetVis() + 24] }); } } catch (e) { } }
(function () {
  let st = null;
  document.addEventListener('pointerdown', e => { const h = e.target.closest && e.target.closest('#rt-shead'); if (!h || e.target.closest('button,#rt-tabs')) { if (!(e.target.closest && e.target.closest('.rt-grab'))) return; } const s = document.getElementById('rt-sheet'); st = { y: e.clientY, h: s.offsetHeight, t: Date.now() }; s.style.transition = 'none'; });
  document.addEventListener('pointermove', e => { if (!st) return; const s = document.getElementById('rt-sheet'), S = rtSnaps(); s.style.height = Math.max(S[0] * .7, Math.min(S[2], st.h - (e.clientY - st.y))) + 'px'; });
  const end = e => { if (!st) return; const s = document.getElementById('rt-sheet'), h = s.offsetHeight, v = (st.y - e.clientY) / Math.max(1, Date.now() - st.t), S = rtSnaps(); st = null;
    let i = S.reduce((b, x, k) => Math.abs(x - h) < Math.abs(S[b] - h) ? k : b, 0); if (v > .5) i = Math.min(2, RT.snap + 1); if (v < -.5) i = Math.max(0, RT.snap - 1); rtSheet(i); };
  document.addEventListener('pointerup', end); document.addEventListener('pointercancel', end);
  window.addEventListener('resize', () => { if (document.getElementById('rt-sheet')) rtSheet(RT.snap, true); });
})();
(function () { const st = document.createElement('style'); st.textContent = `
#modal-route{--tp:#2B3426;--tt:#EEF2E8;--ta:#6B7B5C;--te:#B5523B;--tl2:#8FA36B}
#rt-map{position:absolute;inset:0;background:#E9EEF2}
.rt-topbar{position:absolute;left:12px;right:12px;z-index:8;display:flex;gap:8px;align-items:center;pointer-events:none}
.rt-fab{pointer-events:auto;width:42px;height:42px;border-radius:16px;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.14);display:flex;align-items:center;justify-content:center;color:#191F28;flex-shrink:0}
.rt-od{pointer-events:auto;flex:1;min-width:0;height:42px;border-radius:15px;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.14);display:flex;align-items:center;gap:6px;padding:0 13px;font-size:13.5px}
.rt-od b{font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:0 1 auto}.rt-od i{font-style:normal;color:#B0B8C1;font-weight:800}
.rt-od .o,.rt-od .d{width:9px;height:9px;border-radius:50%;flex-shrink:0;background:#191F28}.rt-od .d{background:var(--te)}
.rt-sheet{position:absolute;left:0;right:0;bottom:0;z-index:9;height:58vh;background:#fff;border-radius:26px 26px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.14);display:flex;flex-direction:column}
.rt-shead{flex-shrink:0;touch-action:none;border-bottom:1px solid #F2F3F5}
.rt-grab{height:22px;display:flex;align-items:center;justify-content:center;cursor:grab}.rt-grab i{width:44px;height:5px;border-radius:3px;background:#D1D6DB}
.rt-hrow{display:flex;align-items:center;gap:10px;padding:0 16px 10px}
.rt-seg{display:flex;background:#F2F4F6;border-radius:12px;padding:3px}.rt-seg button{height:30px;padding:0 11px;border-radius:9px;font-size:12.5px;font-weight:700;color:#6B7684}.rt-seg button.on{background:#fff;color:#191F28;box-shadow:0 1px 3px rgba(0,0,0,.1)}
.rt-km{font-size:12px;color:#8B95A1;font-weight:600}
.rt-thb{margin-left:auto;height:30px;padding:0 10px;border-radius:12px;background:#F2F4F6;display:flex;align-items:center}
.rt-dots3{display:inline-flex}.rt-dots3 i{width:14px;height:14px;border-radius:50%;border:2px solid #fff;margin-left:-4px;box-shadow:0 0 0 1px rgba(0,0,0,.06)}.rt-dots3 i:first-child{margin-left:0}
.rt-dots3.big i{width:22px;height:22px;margin-left:-6px}
#modal-route .rt-tabs{margin:0;padding:0 16px 12px}
#modal-route .rt-tabs button{height:38px;font-size:13px;border-radius:13px}
#modal-route .rt-tabs button.on{background:var(--tp);border-color:var(--tp)}
.rt-sbody{flex:1;overflow-y:auto;overscroll-behavior:contain;padding-bottom:max(24px,env(safe-area-inset-bottom))}
#modal-route .rt-pager{margin:0}
#modal-route .rt-card{border:0;box-shadow:none;border-radius:0;padding:16px 2px 4px;background:transparent}
.rt-big{font-size:23px;font-weight:900;letter-spacing:-.8px;line-height:1.1;color:#191F28}
.rt-arr{font-size:13px;color:#4E5968;font-weight:600;margin-top:4px}
.rt-badge{font-size:11px;font-weight:800;padding:3px 8px;border-radius:99px;background:var(--tp);color:#fff}.rt-badge.s{background:var(--tt);color:var(--tp);box-shadow:inset 0 0 0 1px var(--tp)}
.rt-chain{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:12px 0 4px}
.rt-chain .ri{width:15px;height:15px}
.rt-cv{width:27px;height:27px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:var(--tt);color:var(--tp)}
.rt-cv.ktx,.rt-cv.car,.rt-cv.big{background:var(--tp);color:#fff}
.rt-cw{display:inline-flex;align-items:center;gap:1px;height:27px;padding:0 6px 0 3px;border-radius:9px;background:#F2F4F6;color:#4E5968;font-size:11.5px;font-weight:800}
.rt-cs{font-style:normal;color:#B0B8C1;font-weight:800;font-size:13px}
.rt-steps{margin-top:8px}
#modal-route .rt-n{padding:6px 0}#modal-route .rt-n span{font-size:14.5px}#modal-route .rt-n em{font-size:11.5px}
#modal-route .rt-n i{width:18px;height:18px;border-color:var(--tp)}#modal-route .rt-n.end i{background:var(--te);border-color:var(--te)}
#modal-route .rt-r{padding:8px 0}#modal-route .rt-t{font-size:14px}#modal-route .rt-c{font-size:13.5px}
#modal-route .rt-ic{width:28px;height:28px;border-radius:10px;color:var(--tp);border-color:#E5E8EB;margin-left:-6px}#modal-route .rt-ic .ri{width:16px;height:16px}
#modal-route .rt-live{margin:2px 0 6px 32px;padding:10px 12px;border-radius:14px;background:var(--tt);font-size:13px}
#modal-route .rt-live .lv-h{font-size:11px;color:var(--ta)}#modal-route .rt-live .lv-h i{background:var(--tp);box-shadow:0 0 0 3px color-mix(in srgb,var(--tp) 20%,transparent)}
#modal-route .rt-live .lv-rec{font-size:14.5px}#modal-route .rt-live .lv-rec em{color:var(--te)}
#modal-route .rt-live .lv-sub{font-size:12px}#modal-route .rt-live .lv-x{font-size:12.5px}
#modal-route .rt-live .lv-ch span{font-size:12.5px;padding:4px 8px;border-radius:9px}#modal-route .rt-live .lv-ch span b{color:var(--te)}
.rt-notes{font-size:12px;color:#4E5968;line-height:1.6;margin-top:10px}
.rt-link{font-size:12px;font-weight:800;background:var(--tt);color:var(--tp);border-radius:10px;padding:7px 10px}
#modal-route .rt-refresh{font-size:11.5px;padding:6px 9px;border-radius:10px}
#modal-route .rt-dots i.on{background:var(--tp)}
.rt-ext{display:block;text-align:center;border-radius:13px;padding:11px 0;font-size:12.5px;font-weight:800}.rt-ext.k{background:#FEE500;color:#191F28}.rt-ext.n{background:#03C75A;color:#fff}
.rt-foot{font-size:10.5px;color:#8B95A1;line-height:1.55;padding:12px 18px 0}
.rt-thov{position:absolute;inset:0;z-index:20;background:rgba(0,0,0,.3);display:flex;align-items:flex-end}
.rt-thbox{width:100%;background:#fff;border-radius:24px 24px 0 0;padding:20px 16px max(20px,env(safe-area-inset-bottom));display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rt-thbox b{grid-column:1/-1;font-size:18px;font-weight:900;margin-bottom:4px}
.rt-thbox button{display:flex;align-items:center;gap:10px;height:58px;padding:0 14px;border-radius:16px;background:#F7F8FA;font-size:15px;font-weight:800;color:#191F28;border:2px solid transparent}
.rt-thbox button.on{border-color:#191F28;background:#fff}
#modal-route .rt-pin.s{background:#191F28}`; document.head.appendChild(st); })();

window.ztThemeName = () => (ZT_PAL[thGet()] || ZT_PAL.army).n;
window.ztThemePick = () => {
  const cur = thGet(), ov = document.createElement('div'); ov.className = 'rt-thov'; ov.style.position = 'fixed'; ov.style.zIndex = '120'; ov.onclick = e => { if (e.target === ov) ov.remove(); };
  ov.innerHTML = `<div class="rt-thbox"><b>색상 테마</b><p style="grid-column:1/-1;font-size:13px;color:#8B95A1;margin:-6px 0 4px">집으로 가기 · 식단표에 같이 적용돼요</p>${Object.entries(ZT_PAL).map(([k, T]) => `<button data-k="${k}" class="${k === cur ? 'on' : ''}"><span class="rt-dots3 big">${T.s.map(c => `<i style="background:${c}"></i>`).join('')}</span>${T.n}</button>`).join('')}</div>`;
  ov.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { thSet(b.dataset.k); ov.remove(); try { rtApplyTh(); if (window.mlApplyTh) mlApplyTh(); if (typeof openSettings === 'function' && document.getElementById('modal-settings') && !document.getElementById('modal-settings').classList.contains('hidden')) openSettings(); } catch (e) { } if (typeof zpToast === 'function') zpToast(`${ZT_PAL[b.dataset.k].n} 테마로 저장했어요`); });
  document.body.appendChild(ov);
};

/* ================= 친구 위치 지도 ================= */
const FM = { map: null, kind: '', objs: [], list: [], mine: null, share: false, at: null, poll: null, watch: null, lastUp: 0 };
(function () { const st = document.createElement('style'); st.textContent = `
#modal-fmap{position:fixed;inset:0;z-index:88;background:#E9EEF2;display:none;overflow:hidden}
#fm-map{position:absolute;inset:0}
.fm-top{position:absolute;left:12px;right:12px;top:max(12px,env(safe-area-inset-top));z-index:5;display:flex;gap:8px;align-items:center}
.fm-title{flex:1;height:42px;border-radius:15px;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.14);display:flex;align-items:center;padding:0 14px;font-size:15px;font-weight:800;gap:8px}
.fm-share{height:42px;border-radius:15px;padding:0 12px;font-size:12.5px;font-weight:800;box-shadow:0 4px 14px rgba(0,0,0,.14);display:flex;align-items:center;gap:6px;background:#fff;color:#4E5968}
.fm-share i{width:8px;height:8px;border-radius:50%;background:#B0B8C1}.fm-share.on{background:var(--tp,#2B3426);color:#fff}.fm-share.on i{background:#7FE0A8;box-shadow:0 0 0 3px rgba(127,224,168,.3)}
.fm-bottom{position:absolute;left:0;right:0;bottom:0;z-index:5;padding:0 0 max(14px,env(safe-area-inset-bottom))}
.fm-me{position:absolute;right:14px;bottom:calc(100% + 10px);width:44px;height:44px;border-radius:15px;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.16);display:flex;align-items:center;justify-content:center;color:#191F28}
.fm-list{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:4px 14px}.fm-list::-webkit-scrollbar{display:none}
.fm-chip{flex-shrink:0;display:flex;align-items:center;gap:9px;background:#fff;border-radius:18px;padding:8px 14px 8px 8px;box-shadow:0 4px 14px rgba(0,0,0,.12);text-align:left}
.fm-chip .ph{width:38px;height:38px;border-radius:13px;overflow:hidden;background:#F2F4F6;flex-shrink:0}
.fm-chip b{display:block;font-size:14px;font-weight:800;color:#191F28;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fm-chip small{font-size:11.5px;color:#8B95A1;font-weight:600}
.fm-card{margin:0 14px;background:#fff;border-radius:22px;padding:18px;box-shadow:0 6px 20px rgba(0,0,0,.14)}
.fm-card b{font-size:16px;font-weight:900}.fm-card p{font-size:13px;color:#4E5968;margin-top:5px;line-height:1.5}
.fm-card .go{margin-top:12px;width:100%;height:46px;border-radius:14px;background:var(--tp,#2B3426);color:#fff;font-size:14.5px;font-weight:800}
.fm-pin{display:flex;flex-direction:column-reverse;align-items:center;position:relative;padding-bottom:9px}.fm-pin::after{content:'';position:absolute;bottom:0;left:50%;margin-left:-6px;border:6px solid transparent;border-bottom:0;border-top:9px solid #fff;filter:drop-shadow(0 2px 1px rgba(0,0,0,.2))}.fm-pin.me::after{border-top-color:#3182F6}
.fm-pin .ph{width:46px;height:46px;border-radius:50%;overflow:hidden;background:#fff;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.3)}
.fm-pin.me .ph{border-color:#3182F6}
.fm-pin span{margin-bottom:3px;background:#191F28;color:#fff;font-size:11px;font-weight:800;padding:2px 7px;border-radius:8px;white-space:nowrap}
.fm-pin.me span{background:#3182F6}.fm-pin.old .ph{filter:grayscale(.7);opacity:.85}`; document.head.appendChild(st); })();
const fmAgo = t => { if (!t) return ''; const m = Math.max(0, Math.round((Date.now() - Date.parse(t)) / 6e4)); return m < 1 ? '방금' : m < 60 ? m + '분 전' : m < 1440 ? Math.floor(m / 60) + '시간 전' : Math.floor(m / 1440) + '일 전'; };
function fmEl() {
  let m = document.getElementById('modal-fmap'); if (m) return m;
  m = document.createElement('div'); m.id = 'modal-fmap';
  m.innerHTML = `<div id="fm-map"></div><div class="fm-top"><button onclick="fmClose()" class="rt-fab" aria-label="뒤로" style="pointer-events:auto"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button><div class="fm-title">친구 위치</div><button id="fm-share" class="fm-share" onclick="fmShareToggle()"><i></i><span>공유 꺼짐</span></button></div><div class="fm-bottom"><button class="fm-me" onclick="fmFocusMe()" aria-label="내 위치"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></button><div id="fm-low"></div></div>`;
  document.body.appendChild(m); return m;
}
window.fmOpen = async () => {
  const m = fmEl(); try { const T = rtTh(); m.style.setProperty('--tp', T.p); } catch (e) { } m.style.display = 'block';
  if (!(await fmMapInit())) return;
  try { const { data } = await sb.rpc('my_loc_share'); const r = (data || [])[0]; FM.share = !!(r && r.share); } catch (e) { FM.share = false; }
  fmShareUI(); if (FM.share) fmWatch(); else fmLocateOnce();
  await fmLoad(); fmFit(); clearInterval(FM.poll); FM.poll = setInterval(fmLoad, 30000);
};
window.fmClose = () => { const m = document.getElementById('modal-fmap'); if (m) m.style.display = 'none'; clearInterval(FM.poll); if (FM.watch != null) { navigator.geolocation.clearWatch(FM.watch); FM.watch = null; } };
async function fmMapInit() {
  const el = document.getElementById('fm-map'); if (FM.map && FM.el === el) { try { FM.kind === 'k' ? FM.map.relayout() : FM.map.invalidateSize(); } catch (e) { } return true; }
  FM.el = el;
  try { if (typeof kakaoReady === 'function' && await kakaoReady()) { FM.kind = 'k'; FM.map = new kakao.maps.Map(el, { center: new kakao.maps.LatLng(37.55, 127.0), level: 9 }); return true; } } catch (e) { }
  if (await leafReady()) { FM.kind = 'l'; FM.map = window.L.map(el, { zoomControl: false }).setView([37.55, 127.0], 9); window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(FM.map); return true; }
  el.innerHTML = '<div class="rt-mapx">지도를 불러오지 못했어요</div>'; return false;
}
function fmShareUI() {
  const b = document.getElementById('fm-share'); if (b) { b.classList.toggle('on', FM.share); b.querySelector('span').textContent = FM.share ? '내 위치 공유 중' : '공유 꺼짐'; }
  const low = document.getElementById('fm-low'); if (!low) return;
  const chips = FM.list.map((P, i) => `<button class="fm-chip" onclick="fmFocus(${i})"><span class="ph">${typeof frAvatar === 'function' ? frAvatar(P) : ''}</span><span><b>${esc(P.nickname || '친구')}</b><small>${fmAgo(P.at)}</small></span></button>`).join('');
  low.innerHTML = (FM.share ? '' : `<div class="fm-card" style="margin-bottom:10px"><b>내 위치를 친구들에게 공유할까요?</b><p>수락한 친구에게만 보이고, 언제든 끌 수 있어요. 끄면 저장된 위치도 바로 지워져요.<br><span style="color:#B5523B;font-weight:700">부대 안에서는 보안을 위해 공유를 꺼주세요.</span></p><button class="go" onclick="fmShareToggle()">위치 공유 시작</button></div>`)
    + (FM.list.length ? `<div class="fm-list">${chips}</div>` : `<div class="fm-card"><b>아직 위치를 공유한 친구가 없어요</b><p>친구가 이 화면에서 '위치 공유 시작'을 누르면 지도에 프로필이 떠요.</p></div>`);
}
async function fmLoad() {
  try { const { data, error } = await sb.rpc('friend_locs_list'); if (!error) FM.list = (data || []).filter(x => isFinite(x.lat) && isFinite(x.lng)); } catch (e) { }
  fmDraw(); fmShareUI();
}
function fmDraw() {
  if (!FM.map) return; FM.objs.forEach(o => { try { FM.kind === 'k' ? o.setMap(null) : FM.map.removeLayer(o); } catch (e) { } }); FM.objs = [];
  const add = (lat, lng, html, z) => {
    if (FM.kind === 'k') { const ov = new kakao.maps.CustomOverlay({ position: new kakao.maps.LatLng(lat, lng), content: html, yAnchor: 1, zIndex: z }); ov.setMap(FM.map); FM.objs.push(ov); }
    else FM.objs.push(window.L.marker([lat, lng], { icon: window.L.divIcon({ className: '', html: `<div style="transform:translate(-50%,-100%)">${html}</div>`, iconSize: [0, 0] }), zIndexOffset: z }).addTo(FM.map));
  };
  FM.list.forEach(P => { const old = Date.now() - Date.parse(P.at) > 6 * 3600e3; add(P.lat, P.lng, `<div class="fm-pin${old ? ' old' : ''}"><div class="ph">${typeof frAvatar === 'function' ? frAvatar(P) : ''}</div><span>${esc(P.nickname || '친구')} · ${fmAgo(P.at)}</span></div>`, 3); });
  if (FM.mine) add(FM.mine[0], FM.mine[1], `<div class="fm-pin me"><div class="ph">${typeof myAvatarHTML === 'function' ? myAvatarHTML() : ''}</div><span>나${FM.share ? '' : ' (공유 안 함)'}</span></div>`, 4);
}
function fmFit() {
  const P = FM.list.map(x => [x.lat, x.lng]).concat(FM.mine ? [FM.mine] : []); if (!P.length || !FM.map) return;
  if (P.length === 1) return fmCenter(P[0], 4);
  if (FM.kind === 'k') { const bd = new kakao.maps.LatLngBounds(); P.forEach(p => bd.extend(new kakao.maps.LatLng(p[0], p[1]))); FM.map.setBounds(bd, 110, 50, 200, 50); }
  else FM.map.fitBounds(P, { paddingTopLeft: [50, 110], paddingBottomRight: [50, 200] });
}
function fmCenter(p, lv) { if (FM.kind === 'k') { FM.map.setLevel(lv || 4); FM.map.panTo(new kakao.maps.LatLng(p[0], p[1])); } else FM.map.setView(p, 15); }
window.fmFocus = i => { const P = FM.list[i]; if (P) fmCenter([P.lat, P.lng], 3); };
window.fmFocusMe = () => { if (FM.mine) fmCenter(FM.mine, 3); else fmLocateOnce(true); };
function fmGot(pos, push) {
  FM.mine = [pos.coords.latitude, pos.coords.longitude]; fmDraw();
  if (push && FM.share && Date.now() - FM.lastUp > 45000) { FM.lastUp = Date.now(); sb.rpc('set_my_loc', { la: FM.mine[0], ln: FM.mine[1], ac: Math.round(pos.coords.accuracy || 0) }).then(() => { }, () => { }); }
}
function fmLocateOnce(center) {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(p => { fmGot(p, true); if (center) fmCenter(FM.mine, 3); }, () => { if (center && typeof zpToast === 'function') zpToast('위치 권한을 허용하면 내 위치가 보여요'); }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
}
function fmWatch() { if (!navigator.geolocation || FM.watch != null) return; FM.lastUp = 0; FM.watch = navigator.geolocation.watchPosition(p => fmGot(p, true), () => { }, { enableHighAccuracy: true, maximumAge: 20000, timeout: 20000 }); }
window.fmShareToggle = async () => {
  if (!FM.share) {
    if (!navigator.geolocation) return showAlert('위치를 쓸 수 없어요', '이 기기에서는 위치 기능을 쓸 수 없어요.');
    const ok = await new Promise(res => navigator.geolocation.getCurrentPosition(p => { FM.mine = [p.coords.latitude, p.coords.longitude]; FM.acc = p.coords.accuracy; res(true); }, () => res(false), { enableHighAccuracy: true, timeout: 12000 }));
    if (!ok) return showAlert('위치 권한이 필요해요', '휴대폰 설정에서 브라우저(사파리)의 위치 접근을 허용해 주세요.');
    const { error } = await sb.rpc('set_loc_share', { on_: true }); if (error) return showAlert('오류', '잠시 후 다시 시도해주세요.');
    await sb.rpc('set_my_loc', { la: FM.mine[0], ln: FM.mine[1], ac: Math.round(FM.acc || 0) }); FM.lastUp = Date.now();
    FM.share = true; try { localStorage.setItem('zt_locshare', '1'); } catch (e) { } fmWatch(); fmDraw(); fmShareUI(); fmCenter(FM.mine, 4); if (typeof zpToast === 'function') zpToast('친구들에게 내 위치를 공유하고 있어요');
  } else {
    if (!(await zConfirm('위치 공유를 끌까요?\n저장된 내 위치도 지워져요.', { ok: '공유 끄기' }))) return;
    await sb.rpc('set_loc_share', { on_: false }); FM.share = false; try { localStorage.removeItem('zt_locshare'); } catch (e) { }
    if (FM.watch != null) { navigator.geolocation.clearWatch(FM.watch); FM.watch = null; } fmDraw(); fmShareUI(); if (typeof zpToast === 'function') zpToast('위치 공유를 껐어요');
  }
};
/* 공유를 켜둔 사람은 앱을 열 때마다 위치를 한 번 새로 올려요 (앱을 닫으면 멈춰요) */
(function () { let n = 0; const go = () => { if (typeof sb === 'undefined' || !sb || typeof me === 'undefined' || !me || !me.id) { if (n++ < 20) setTimeout(go, 2000); return; } let on = false; try { on = localStorage.getItem('zt_locshare') === '1'; } catch (e) { } if (on && navigator.geolocation) navigator.geolocation.getCurrentPosition(p => sb.rpc('set_my_loc', { la: p.coords.latitude, ln: p.coords.longitude, ac: Math.round(p.coords.accuracy || 0) }).then(() => { }, () => { }), () => { }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }); }; setTimeout(go, 3000); })();

/* ================= TMAP 대중교통 길찾기 → 앱 경로 모양으로 ================= */
window.rtTmap = async (a, b) => {
  let r; try { r = (await sb.functions.invoke('transit-live', { body: { action: 'plan', a: { lat: a.lat, lng: a.lng }, b: { lat: b.lat, lng: b.lng } } })).data; } catch (e) { return { err: String(e) }; }
  if (!r || r.error || !Array.isArray(r.items)) return { err: (r && r.error) || 'no data' };
  const P = p => ({ lat: p.lat, lng: p.lng, name: p.name });
  const subName = s => String(s || '').replace(/^수도권\s*/, '').replace(/^(\d+)$/, '$1호선');
  const opts = r.items.filter(it => it.legs && it.legs.length).map(it => {
    const legs = it.legs.map(l => {
      const base = { min: l.min, cost: 0, a: P(l.from), b: P(l.to), from: l.from.name, to: l.to.name, path: l.path, color: l.color, stops: l.stops };
      if (l.mode === 'WALK') return Object.assign(base, { t: 'walk', from: '', to: '' });
      if (l.mode === 'BUS') { const nos = [l.route].concat(l.lanes || []).map(x => String(x).split(':').pop().replace(/\s/g, '')).filter(Boolean); return Object.assign(base, { t: 'bus', tx: `${nos[0] || ''}번 버스${l.stops ? ` · ${l.stops}개 정류장` : ''}`, nos: [...new Set(nos)] }); }
      if (l.mode === 'SUBWAY') return Object.assign(base, { t: 'metro', tx: `${subName(l.route)}${l.stops ? ` · ${l.stops}개 역` : ''}` });
      if (l.mode === 'EXPRESSBUS') return Object.assign(base, { t: 'bus', big: 1, tx: /고속/.test(l.route) || l.type === 23 ? '고속버스' : '시외버스' });
      if (l.mode === 'TRAIN') return Object.assign(base, { t: 'ktx', tx: l.route || '열차' });
      return Object.assign(base, { t: 'ktx', tx: l.mode === 'AIRPLANE' ? '항공' : l.mode === 'FERRY' ? '여객선' : (l.route || '이동') });
    });
    const veh = legs.filter(x => x.t !== 'walk'), main = veh.slice().sort((x, y) => y.min - x.min)[0] || legs[0];
    const label = x => x.t === 'ktx' ? (x.tx || '열차').split(' ')[0] : x.t === 'bus' && x.big ? x.tx : x.t === 'metro' ? '전철' : '버스';
    const n = veh.map(label).filter((x, k, A) => x !== A[k - 1]).join(' + ') || '도보';
    const icon = main.t === 'ktx' ? 'ktx' : main.t === 'metro' ? 'metro' : 'bus';
    return { n, icon, legs, min: it.min, cost: it.fare, walk: it.walk, tr: it.tr, src: 'tmap',
      lines: ['TMAP 대중교통 길찾기 · 지금 출발 기준 실제 노선이에요', ...veh.filter(x => x.big || x.t === 'ktx').map(x => `${x.tx} ${x.from} → ${x.to} · 약 ${fmtM(x.min)}`)], links: [] };
  });
  // 같은 이름 · 같은 시간 경로는 하나만
  const seen = new Set(); return { opts: opts.filter(o => { const k = o.n + '|' + o.min; if (seen.has(k)) return false; seen.add(k); return true; }) };
};
