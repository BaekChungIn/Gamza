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
const RC = { car: '#3182F6', taxi: '#F2A900', bus: '#2FB36E', big: '#7B5CF5', metro: '#1F7AE0', ktx: '#E5484D', walk: '#8B95A1' };
const legColor = x => (x.t === 'bus' && x.big ? RC.big : RC[x.t] || '#191F28');
const rtCk = x => `${x.a.lat},${x.a.lng}>${x.b.lat},${x.b.lng}`;
(function () {
  const css = `
#rt-mapw{position:sticky;top:0;z-index:6;margin:0 -16px 12px;padding:2px 16px 10px;background:var(--bg-main)}
#rt-map{height:min(34vh,260px);border-radius:22px;overflow:hidden;background:#E9EEF2;position:relative;box-shadow:0 6px 18px rgba(0,0,0,.06)}
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
    if (!x.a || !x.b || x.t === 'walk') return;
    if (rhav(cur, x.a) > .05) segs.push({ pts: [[cur.lat, cur.lng], [x.a.lat, x.a.lng]], c: RC.walk, dash: 1, w: 3 });
    const real = (x.t === 'car' || x.t === 'taxi') && RT.car[rtCk(x)];
    const pts = real ? real.path : rhav(x.a, x.b) < 2 ? [[x.a.lat, x.a.lng], [x.b.lat, x.b.lng]] : rtCurve(x.a, x.b, x.t === 'ktx' ? .07 : (i % 2 ? -.1 : .1));
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
  const pin = (p, cls, t) => `<div class="rt-pin ${cls}">${t}</div>`, dot = s => `<div class="rt-dot" style="--c:${s.c}"><i></i><span>${esc(s.n)}</span></div>`;
  if (RT.kind === 'k') {
    const K = kakao.maps, LL = p => new K.LatLng(p[0], p[1]), bd = new K.LatLngBounds();
    segs.forEach(s => {
      const path = s.pts.map(LL); path.forEach(p => bd.extend(p));
      if (!s.dash) { const cas = new K.Polyline({ path, strokeWeight: s.w + 4, strokeColor: '#FFFFFF', strokeOpacity: .95 }); cas.setMap(M); RT.objs.push(cas); }
      const l = new K.Polyline({ path, strokeWeight: s.w, strokeColor: s.c, strokeOpacity: .95, strokeStyle: s.dash ? 'shortdash' : 'solid' }); l.setMap(M); RT.objs.push(l);
    });
    stops.forEach(s => { const ov = new K.CustomOverlay({ position: new K.LatLng(s.p.lat, s.p.lng), content: dot(s), xAnchor: 0, yAnchor: 0, zIndex: 2 }); ov.setMap(M); RT.objs.push(ov); });
    [[A, 's', '출발'], [B, 'e', '도착']].forEach(([p, c, t]) => { const ov = new K.CustomOverlay({ position: new K.LatLng(p.lat, p.lng), content: pin(p, c, t), yAnchor: 1, zIndex: 3 }); ov.setMap(M); RT.objs.push(ov); bd.extend(new K.LatLng(p.lat, p.lng)); });
    M.relayout(); M.setBounds(bd, 46, 28, 22, 28);
  } else {
    const Lf = window.L, all = [];
    segs.forEach(s => { if (!s.dash) RT.objs.push(Lf.polyline(s.pts, { color: '#fff', weight: s.w + 4, opacity: .95 }).addTo(M)); RT.objs.push(Lf.polyline(s.pts, { color: s.c, weight: s.w, opacity: .95, dashArray: s.dash ? '6 7' : null }).addTo(M)); all.push(...s.pts); });
    stops.forEach(s => RT.objs.push(Lf.marker([s.p.lat, s.p.lng], { icon: Lf.divIcon({ className: '', html: dot(s), iconSize: [0, 0] }) }).addTo(M)));
    [[A, 's', '출발'], [B, 'e', '도착']].forEach(([p, c, t]) => { RT.objs.push(Lf.marker([p.lat, p.lng], { icon: Lf.divIcon({ className: '', html: `<div style="transform:translate(-50%,-100%)">${pin(p, c, t)}</div>`, iconSize: [0, 0] }) }).addTo(M)); all.push([p.lat, p.lng]); });
    M.invalidateSize(); M.fitBounds(all, { padding: [36, 28] });
  }
}
/* ---- 실시간: 버스 도착 · 지하철 도착 · 고속/시외버스 · 기차 시간표 · 자동차 실제 경로 ---- */
function rtCall(body) {
  const k = JSON.stringify(body); if (RT.live[k]) return RT.live[k];
  return (RT.live[k] = (async () => { try { const r = await sb.functions.invoke('transit-live', { body }); return r.data || { error: (r.error && r.error.message) || 'error' }; } catch (e) { return { error: String(e) }; } })());
}
const nowHM = (add) => { const d = new Date(Date.now() + (add || 0) * 6e4); return [String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'), d.getDate() !== new Date().getDate()]; };
const lvHead = t => `<div class="lv-h"><i></i>${t}</div>`;
const lvErr = r => /없음/.test((r && r.error) || '') ? `${lvHead('실시간')}<div class="lv-x">실시간 정보를 준비하고 있어요</div>` : `${lvHead('실시간')}<div class="lv-x">지금은 정보를 불러오지 못했어요${r && r.note ? ' · ' + esc(r.note) : ''}</div>`;
function lvSched(r, at, label) {
  if (!r || r.error) return lvErr(r);
  const [ready, nextDay] = nowHM(at + 10), list = nextDay ? [] : (r.items || []).filter(x => x.dep >= ready), fare = x => x.fare ? ` · ${W(x.fare)}` : '';
  const head = lvHead(`${label}${r.kind ? ' · ' + r.kind : ''} 시간표${r.from ? ` · ${esc(r.from)} → ${esc(r.to)}` : ''}`);
  if (!list.length) { const t = (r.tomorrow || [])[0]; return head + (t ? `<div class="lv-rec">오늘 남은 차가 없어요</div><div class="lv-sub">내일 첫차 <b>${t.dep}</b> ${esc(t.g)} · 도착 ${t.arr}${fare(t)}</div>` : `<div class="lv-x">${r.note ? esc(r.note) : '오늘 남은 배차가 없어요'}</div>`); }
  const rec = list[0];
  return head + `<div class="lv-rec">추천 <em>${rec.dep}</em> ${esc(rec.g)}${rec.no ? ' ' + esc(rec.no) + '호' : ''} · 도착 ${rec.arr}</div><div class="lv-sub">지금 출발하면 ${ready}쯤 도착해서 여유 있게 탈 수 있어요${fare(rec)}</div>${list.length > 1 ? `<div class="lv-ch">${list.slice(1, 6).map(x => `<span>${x.dep} <small style="color:#8B95A1">${esc(x.g)}</small></span>`).join('')}</div>` : ''}`;
}
function lvBus(r) {
  if (!r || r.error) return lvErr(r); const S = (r.stops || []).filter(s => s.arr.length);
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
    else if (x.t === 'bus' && !x.big) rtCall({ action: 'bus', lat: +x.a.lat.toFixed(4), lng: +x.a.lng.toFixed(4) }).then(r => put(lvBus(r)));
    else if (x.t === 'metro') rtCall({ action: 'subway', st: x.from || x.a.name }).then(r => put(lvSub(r)));
    else if (x.t === 'bus' && x.big) rtCall({ action: 'exp', from: x.from, to: x.to }).then(r => put(lvSched(r, at, '버스')));
    else if (x.t === 'ktx') rtCall({ action: 'train', from: x.from, to: x.to, kind: /KTX/.test(x.tx || '') ? 'ktx' : 'itx' }).then(r => put(lvSched(r, at, /KTX/.test(x.tx || '') ? 'KTX' : '열차')));
  });
}
function rtFitH() { const p = document.getElementById('rt-pager'); if (!p) return; const pg = p.children[RT.idx]; if (pg) p.style.height = pg.offsetHeight + 'px'; }
function rtSel(i) {
  RT.idx = i; document.querySelectorAll('#rt-tabs button').forEach((b, k) => b.classList.toggle('on', k === i)); document.querySelectorAll('#rt-dots i').forEach((b, k) => b.classList.toggle('on', k === i));
  const t = document.querySelectorAll('#rt-tabs button')[i]; if (t) t.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  rtFitH(); rtDraw(i); rtLive(i);
}
window.rtPg = i => { const p = document.getElementById('rt-pager'); if (!p) return; p.scrollTo({ left: i * p.clientWidth, behavior: 'smooth' }); rtSel(i); };
window.rtPgSync = el => { const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth)); if (i !== RT.idx) rtSel(i); };
window.rtRefresh = i => { RT.live = {}; const o = RT.L[i]; if (o) { o._live = 0; rtLive(i, true); } };
window.rtSet = (L, a, b) => { RT.L = L; RT.A = a; RT.B = b; L.forEach(o => o._live = 0); RT.idx = 0; requestAnimationFrame(() => { rtFitH(); rtDraw(0); rtLive(0); }); };
window.rtShow = () => { if (RT.map) { try { RT.kind === 'k' ? RT.map.relayout() : RT.map.invalidateSize(); } catch (e) { } } rtDraw(RT.idx); rtFitH(); };
