// 짬타이거 · transit-live
// 집으로 가는 길: 자동차 실제 경로(카카오모빌리티) · 버스 도착 · 지하철 도착 · 고속/시외버스 시간표 · 기차 시간표
// 키는 Supabase > Edge Functions > Secrets 에만 넣어요. 앱 코드에는 없어요.
//   KAKAO_REST_KEY   카카오 개발자 REST API 키 (자동차 길찾기)
//   DATA_GO_KR_KEY   공공데이터포털 일반 인증키 (Decoding) — 국토교통부 TAGO: 버스도착 · 버스정류소 · 고속버스 · 시외버스 · 열차정보
//   TMAP_APP_KEY     SK open API 앱 키 · TMAP 대중교통 (집→부대 실제 대중교통 경로 · 시외/고속버스 · KTX/SRT 포함)
//   ODSAY_WEB_KEY    ODsay LAB 웹(URI) 플랫폼 키 · 로그인한 사용자 앱에 전달 (사이트 주소로 제한된 키)
//   SEOUL_API_KEY    (선택) 서울 열린데이터광장 실시간 지하철 인증키 (도착 정보)
//   SEOUL_API_KEY2   (선택) 두 번째 실시간 지하철 인증키 (열차 위치) — 없으면 SEOUL_API_KEY 를 같이 써요
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const KAKAO = Deno.env.get('KAKAO_REST_KEY') ?? '';
const DGK = Deno.env.get('DATA_GO_KR_KEY') ?? '';
const SEOUL = Deno.env.get('SEOUL_API_KEY') ?? '';
const TMAP = Deno.env.get('TMAP_APP_KEY') ?? '';
const ODSAY_WEB = Deno.env.get('ODSAY_WEB_KEY') ?? '';   // ODsay 웹(URI) 키 · 짬타이거 사이트 주소에서만 작동해요   // SK open API · TMAP 대중교통 (실제 대중교통 길찾기)
const SEOUL2 = Deno.env.get('SEOUL_API_KEY2') || SEOUL;   // (선택) 열차 위치용 두 번째 키 — 하루 한도를 나눠 써요
function serverKey(): string {
  const k = Deno.env.get('SB_SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (k) return k;
  try { const j = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}'); return j.default ?? Object.values(j)[0] ?? ''; } catch { return ''; }
}
const admin = createClient(Deno.env.get('SUPABASE_URL')!, serverKey());
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const kst = () => new Date(Date.now() + 9 * 3600e3);
const ymd = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
const num = (v: unknown) => (typeof v === 'number' ? v : parseFloat(String(v ?? '')));

// ---- 작은 캐시 (transit_cache 표) ----
async function cget(k: string, maxAgeH: number) {
  try { const { data } = await admin.from('transit_cache').select('v,at').eq('k', k).maybeSingle(); if (data && Date.now() - Date.parse(data.at) < maxAgeH * 3600e3) return data.v; } catch { /* 표가 없어도 괜찮아요 */ }
  return null;
}
async function cset(k: string, v: unknown) { try { await admin.from('transit_cache').upsert({ k, v, at: new Date().toISOString() }); } catch { /* */ } }

// ---- 공공데이터포털 (TAGO) ----
// 2026년에 공공데이터포털이 고속·시외버스·열차 주소를 바꿨어요 (예: TrainInfoService/getX → TrainInfo/GetX). 새 주소 먼저, 안 되면 옛 주소.
const NEWPATH: Record<string, string> = { TrainInfoService: 'TrainInfo', ExpBusInfoService: 'ExpBusInfo', SuburbsBusInfoService: 'SuburbsBusInfo' };
function altPath(path: string) { const [svc, op] = path.split('/'); return NEWPATH[svc] ? `${NEWPATH[svc]}/${op.charAt(0).toUpperCase()}${op.slice(1)}` : ''; }
const lower = (o: any) => { const r: any = {}; Object.keys(o || {}).forEach((k) => (r[k.toLowerCase()] = o[k])); return r; };
async function tago1(path: string, p: Record<string, string | number>) {
  if (!DGK) throw new Error('DATA_GO_KR_KEY 없음');
  const key = DGK.includes('%') ? DGK : encodeURIComponent(DGK);
  const qs = Object.entries({ _type: 'json', numOfRows: 100, pageNo: 1, ...p }).map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
  const r = await fetch(`https://apis.data.go.kr/1613000/${path}?serviceKey=${key}&${qs}`);
  const t = await r.text(); let j: any;
  try { j = JSON.parse(t); } catch { j = null; }
  if (/NO_OPENAPI_SERVICE/.test(t)) { const e: any = new Error('NO_SERVICE'); e.noService = true; throw e; }
  if (!j || !j.response) throw new Error('TAGO 응답: ' + t.replace(/\s+/g, ' ').slice(0, 110));
  const h = j?.response?.header; if (h && h.resultCode && h.resultCode !== '00') throw new Error((h.resultMsg || 'TAGO 오류') + ' (' + h.resultCode + ')');
  const it = j?.response?.body?.items?.item; return (it ? (Array.isArray(it) ? it : [it]) : []).map(lower);   // 필드 이름 대소문자가 바뀌어도 되게 전부 소문자로
}
const pathOk: Record<string, string> = {};
async function tago(path: string, p: Record<string, string | number>) {
  const svc = path.split('/')[0], alt = altPath(path);
  if (pathOk[svc] === 'new' && alt) return tago1(alt, p);
  if (alt) { try { const r = await tago1(alt, p); pathOk[svc] = 'new'; return r; } catch (e) { if (!(e as any).noService) throw e; } }
  try { return await tago1(path, p); } catch (e) { if ((e as any).noService) throw new Error('공공데이터포털에서 이 API 활용신청을 확인해 주세요 (' + svc.replace('Service', '') + ')'); throw e; }
}
const strip = (s: string) => String(s || '').replace(/\(.*?\)/g, '').replace(/\s/g, '').replace(/(공영버스터미널|종합버스터미널|시외버스터미널|고속버스터미널|시외버스정류장|버스터미널|종합터미널|공용터미널|정류소|정류장|터미널|역)$/, '').trim();
const hm = (s: unknown) => { const t = String(s ?? ''); return t.length >= 12 ? `${t.slice(8, 10)}:${t.slice(10, 12)}` : ''; };

// 열차역 목록 (도시별로 모아 30일 캐시)
async function trainStations(): Promise<{ id: string; n: string }[]> {
  const c = await cget('train_st2', 24 * 30); if (c && c.length) return c;
  const cities = await tago('TrainInfoService/getCtyCodeList', {});
  const out: { id: string; n: string }[] = [];
  await Promise.all(cities.map(async (cy: any) => { try { (await tago('TrainInfoService/getCtyAcctoTrainSttnList', { cityCode: cy.citycode, numOfRows: 500 })).forEach((s: any) => out.push({ id: s.nodeid, n: s.nodename })); } catch { /* */ } }));
  if (out.length) await cset('train_st2', out); return out;
}
function pickSt(L: { id: string; n: string }[], name: string) {
  const n = strip(name); return L.find((s) => s.n === n) || L.find((s) => strip(s.n) === n) || L.find((s) => s.n.startsWith(n));
}
async function trains(from: string, to: string, kind: string) {
  const L = await trainStations(), a = pickSt(L, from), b = pickSt(L, to);
  if (!a || !b) return { items: [], note: `${!a ? from : to} 역을 찾지 못했어요` };
  const run = async (d: Date) => (await tago('TrainInfoService/getStrtpntAlocFndTrainInfo', { depPlaceId: a.id, arrPlaceId: b.id, depPlandTime: ymd(d), numOfRows: 200 }))
    .map((t: any) => ({ g: String(t.traingradename || ''), no: String(t.trainno ?? ''), dep: hm(t.depplandtime), arr: hm(t.arrplandtime), fare: num(t.adultcharge) || 0, day: ymd(d) }))
    .filter((t: any) => (kind === 'ktx' ? /KTX/i.test(t.g) : !/KTX/i.test(t.g)))
    .sort((x: any, y: any) => x.dep.localeCompare(y.dep));
  const now = kst(); const today = await run(now); let tmr: any[] = [];
  if (!today.some((t: any) => t.dep >= now.toISOString().slice(11, 16))) tmr = (await run(new Date(now.getTime() + 864e5))).slice(0, 4);
  return { items: today, tomorrow: tmr, from: a.n, to: b.n };
}
// 고속버스 → 없으면 시외버스
async function buses(from: string, to: string) {
  const f = strip(from), t = strip(to), now = kst();
  const tryKind = async (svc: string, list: string, op: string, idk: string, nmk: string) => {
    const find = async (n: string) => { const ck = `t2:${svc}:${n}`; const c = await cget(ck, 24 * 30); if (c) return c; const r = await tago(`${svc}/${list}`, { terminalNm: n, numOfRows: 30 }); const x = r.find((z: any) => String(z[nmk.toLowerCase()]).includes(n)) || r[0]; const v = x ? { id: x[idk.toLowerCase()], n: x[nmk.toLowerCase()] } : null; if (v) await cset(ck, v); return v; };
    const A = await find(f), B = await find(t); if (!A || !B) return null;
    const run = async (d: Date) => (await tago(`${svc}/${op}`, { depTerminalId: A.id, arrTerminalId: B.id, depPlandTime: ymd(d), numOfRows: 200 }))
      .map((x: any) => ({ g: String(x.gradenm || '일반'), dep: hm(x.depplandtime), arr: hm(x.arrplandtime), fare: num(x.charge) || 0, day: ymd(d) }))
      .sort((x: any, y: any) => x.dep.localeCompare(y.dep));
    const today = await run(now); if (!today.length) { const tm = await run(new Date(now.getTime() + 864e5)); if (!tm.length) return null; return { items: [], tomorrow: tm.slice(0, 4), from: A.n, to: B.n }; }
    let tmr: any[] = []; if (!today.some((x: any) => x.dep >= now.toISOString().slice(11, 16))) tmr = (await run(new Date(now.getTime() + 864e5))).slice(0, 4);
    return { items: today, tomorrow: tmr, from: A.n, to: B.n };
  };
  let r: any = null, err = '';
  try { r = await tryKind('ExpBusInfoService', 'getExpBusTrminlList', 'getStrtpntAlocFndExpbusInfo', 'terminalId', 'terminalNm'); if (r) r.kind = '고속버스'; } catch (e) { err = String((e as Error).message); }
  if (!r) { try { r = await tryKind('SuburbsBusInfoService', 'getSuberbsBusTrminlList', 'getStrtpntAlocFndSuberbsBusInfo', 'terminalId', 'terminalNm'); if (r) r.kind = '시외버스'; } catch (e) { err = err || String((e as Error).message); } }
  return r || { items: [], note: err || '이 구간 배차 정보를 찾지 못했어요' };
}
// 가까운 버스정류장 · 도착 예정
async function busArr(lat: number, lng: number) {
  const st = (await tago('BusSttnInfoInqireService/getCrdntPrxmtSttnList', { gpsLati: lat, gpsLong: lng, numOfRows: 6 }))
    .map((s: any) => ({ city: s.citycode, id: s.nodeid, n: s.nodenm, d: Math.round(Math.hypot((num(s.gpslati) - lat) * 111e3, (num(s.gpslong) - lng) * 88e3)) }))
    .sort((a: any, b: any) => a.d - b.d).slice(0, 3);
  const out: any[] = [];
  for (const s of st) {
    try {
      const a = (await tago('ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList', { cityCode: s.city, nodeId: s.id, numOfRows: 30 }))
        .map((x: any) => ({ no: String(x.routeno ?? ''), min: Math.max(0, Math.round(num(x.arrtime) / 60)), left: num(x.arrprevstationcnt) || 0, tp: String(x.routetp || '') }))
        .sort((x: any, y: any) => x.min - y.min);
      out.push({ stop: s.n, dist: s.d, arr: a.slice(0, 6) });
    } catch { out.push({ stop: s.n, dist: s.d, arr: [] }); }
    if (out.filter((o) => o.arr.length).length >= 2) break;
  }
  return { stops: out };
}
// 서울 실시간 지하철 도착
async function subway(name: string) {
  if (!SEOUL) return { items: [], note: 'SEOUL_API_KEY 없음' };
  const n = strip(name).replace(/\s/g, '');
  const r = await fetch(`http://swopenapi.seoul.go.kr/api/subway/${SEOUL}/json/realtimeStationArrival/0/12/${encodeURIComponent(n)}`);
  const j = await r.json(); const L = j.realtimeArrivalList || [];
  if (!L.length && (j.errorMessage || j.code)) { const m = (j.errorMessage && j.errorMessage.message) || j.message || ''; if (!/INFO-200|해당하는 데이터/.test(String((j.errorMessage && j.errorMessage.code) || j.code) + m)) return { items: [], note: '서울시 키 확인: ' + m.slice(0, 60), st: n }; }
  return { items: L.map((x: any) => ({ line: String(x.trainLineNm || ''), dir: String(x.updnLine || ''), msg: String(x.arvlMsg2 || ''), sec: num(x.barvlDt) || 0, lid: String(x.subwayId || '') })).slice(0, 8), st: n };
}
// 서울 실시간 열차 위치 (노선별) — 지도에 열차 아이콘
const LINES = ['1호선', '2호선', '3호선', '4호선', '5호선', '6호선', '7호선', '8호선', '9호선', '중앙선', '경의중앙선', '공항철도', '경춘선', '수인분당선', '신분당선', '우이신설선', '서해선', '경강선', 'GTX-A'];
async function positions(line: string) {
  if (!SEOUL2) return { trains: [], note: 'SEOUL_API_KEY 없음' };
  if (!LINES.includes(line)) return { trains: [], note: 'bad line' };
  const ck = 'pos:' + line, c = await cget(ck, 20 / 3600); if (c) return c;   // 20초 안에 같은 노선은 다시 안 불러요 (하루 1,000번 한도)
  const r = await fetch(`http://swopenapi.seoul.go.kr/api/subway/${SEOUL2}/json/realtimePosition/0/200/${encodeURIComponent(line)}`);
  const j = await r.json(); const L = j.realtimePositionList || [];
  const out = { line, at: Date.now(), trains: L.map((x: any) => ({ st: String(x.statnNm || ''), no: String(x.trainNo || ''), ud: String(x.updnLine ?? ''), s: String(x.trainSttus ?? ''), tnm: String(x.statnTnm || ''), ex: String(x.directAt || '') === '1' })) };
  await cset(ck, out); return out;
}
// 카카오모빌리티 자동차 길찾기 (실제 도로 경로)
async function car(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  if (!KAKAO) throw new Error('KAKAO_REST_KEY 없음');
  const r = await fetch(`https://apis-navi.kakaomobility.com/v1/directions?origin=${a.lng},${a.lat}&destination=${b.lng},${b.lat}&priority=RECOMMEND&summary=false`, { headers: { Authorization: `KakaoAK ${KAKAO}` } });
  const j = await r.json(); const R = j.routes && j.routes[0];
  if (!R || R.result_code !== 0) throw new Error((R && R.result_msg) || j.msg || '경로 없음');
  const pts: number[][] = [];
  (R.sections || []).forEach((s: any) => (s.roads || []).forEach((rd: any) => { const v = rd.vertexes || []; for (let i = 0; i + 1 < v.length; i += 2) pts.push([+v[i + 1].toFixed(5), +v[i].toFixed(5)]); }));
  const step = Math.max(1, Math.ceil(pts.length / 500)), path = pts.filter((_, i) => i % step === 0 || i === pts.length - 1);
  return { min: Math.round(R.summary.duration / 60), km: Math.round(R.summary.distance / 100) / 10, toll: R.summary.fare?.toll || 0, taxi: R.summary.fare?.taxi || 0, path };
}

// ---- TMAP 대중교통 길찾기 (지금 시각 기준 · 문 앞부터 문 앞까지) ----
const kstStamp = () => { const d = kst(); return d.toISOString().slice(0, 16).replace(/[-T:]/g, ''); };
function shape(ls: unknown): number[][] {
  const out: number[][] = []; String(ls || '').trim().split(/\s+/).forEach((p) => { const [x, y] = p.split(',').map(Number); if (isFinite(x) && isFinite(y)) out.push([+y.toFixed(5), +x.toFixed(5)]); });
  const step = Math.max(1, Math.ceil(out.length / 160)); return out.filter((_, i) => i % step === 0 || i === out.length - 1);
}
async function plan(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  if (!TMAP) throw new Error('TMAP_APP_KEY 없음');
  const ck = `plan:${a.lat.toFixed(3)},${a.lng.toFixed(3)}>${b.lat.toFixed(3)},${b.lng.toFixed(3)}:${Math.floor(Date.now() / 6e5)}`;
  const c = await cget(ck, 0.2); if (c) return c;   // 같은 출발·도착은 10분 동안 다시 안 불러요 (사용량 아끼기)
  const r = await fetch('https://apis.openapi.sk.com/transit/routes', { method: 'POST', headers: { appKey: TMAP, accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({ startX: String(a.lng), startY: String(a.lat), endX: String(b.lng), endY: String(b.lat), count: 10, lang: 0, format: 'json', searchDttm: kstStamp() }) });
  const t = await r.text(); let j: any; try { j = JSON.parse(t); } catch { throw new Error('TMAP 응답: ' + t.replace(/\s+/g, ' ').slice(0, 100)); }
  const st = j?.result?.status ?? j?.error?.code; const msg = j?.result?.message || j?.error?.message;
  const its = j?.metaData?.plan?.itineraries;
  if (!Array.isArray(its)) throw new Error(`TMAP ${st ?? r.status}: ${msg || '경로 없음'}`);
  const pt = (o: any) => ({ name: String(o?.name || ''), lat: num(o?.lat), lng: num(o?.lon) });
  const out = { at: Date.now(), items: its.map((it: any) => ({
    min: Math.round(num(it.totalTime) / 60), fare: num(it?.fare?.regular?.totalFare) || 0, walk: Math.round(num(it.totalWalkTime) / 60), tr: num(it.transferCount) || 0, type: it.pathType,
    legs: (it.legs || []).map((l: any) => ({
      mode: String(l.mode || ''), min: Math.max(1, Math.round(num(l.sectionTime) / 60)), dist: num(l.distance) || 0,
      route: String(l.route || ''), color: l.routeColor ? '#' + String(l.routeColor).replace('#', '') : '', type: l.type ?? null, service: l.service ?? null,
      from: pt(l.start), to: pt(l.end), stops: Array.isArray(l?.passStopList?.stationList) ? l.passStopList.stationList.length - 1 : 0,
      lanes: Array.isArray(l.Lane || l.lane) ? (l.Lane || l.lane).map((z: any) => String(z.route || '')).filter(Boolean).slice(0, 4) : [],
      path: l.passShape ? shape(l.passShape.linestring) : Array.isArray(l.steps) ? shape(l.steps.map((z: any) => z.linestring).join(' ')) : [],
    })),
  })) };
  await cset(ck, out); return out;
}

// 키 진단: 대시보드 Test 에서 {"action":"diag"} 로 각 키가 실제로 되는지 확인해요
async function diag() {
  const out: Record<string, string> = {};
  try { const r = await car({ lat: 37.5547, lng: 126.9707 }, { lat: 37.2664, lng: 127.0001 }); out.kakao = `OK (서울역→수원역 ${r.min}분)`; } catch (e) { out.kakao = 'X ' + String((e as Error).message).slice(0, 120); }
  try { const r = await tago('BusSttnInfoInqireService/getCrdntPrxmtSttnList', { gpsLati: 37.5547, gpsLong: 126.9707, numOfRows: 3 }); out.tago_bus = `OK (정류장 ${r.length}곳)`; } catch (e) { out.tago_bus = 'X ' + String((e as Error).message).slice(0, 120); }
  try { const r = await tago('TrainInfoService/getCtyCodeList', {}); out.tago_train = `OK (도시 ${r.length}곳)`; } catch (e) { out.tago_train = 'X ' + String((e as Error).message).slice(0, 120); }
  try { const r = await tago('ExpBusInfoService/getExpBusTrminlList', { terminalNm: '동서울', numOfRows: 3 }); out.tago_exp = `OK (터미널 ${r.length}곳)`; } catch (e) { out.tago_exp = 'X ' + String((e as Error).message).slice(0, 120); }
  try { const r: any = await plan({ lat: 37.5547, lng: 126.9707 }, { lat: 37.2664, lng: 127.0001 }); out.tmap = `OK (경로 ${r.items.length}개)`; } catch (e) { out.tmap = 'X ' + String((e as Error).message).slice(0, 120); }
  try { const r: any = await subway('서울'); out.seoul = r.note ? 'X ' + r.note : `OK (도착 ${r.items.length}건)`; } catch (e) { out.seoul = 'X ' + String((e as Error).message).slice(0, 120); }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const b = await req.json().catch(() => ({}));
    if (b.action === 'diag') return json(await diag());
    if (b.action !== 'ping') {
      // 로그인한 짬타이거 사용자만 (Verify JWT 는 꺼두고 여기서 확인해요)
      const tok = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
      const { data: u, error: ue } = tok ? await admin.auth.getUser(tok) : { data: null, error: true } as any;
      if (ue || !u || !u.user) return json({ error: '로그인이 필요해요' }, 401);
    }
    const L = (v: unknown) => { const n = num(v); if (!isFinite(n)) throw new Error('bad coord'); return n; };
    switch (b.action) {
      case 'cfg': return json({ odsay: ODSAY_WEB });
      case 'plan': return json(await plan({ lat: L(b.a?.lat), lng: L(b.a?.lng) }, { lat: L(b.b?.lat), lng: L(b.b?.lng) }));
      case 'car': return json(await car({ lat: L(b.a?.lat), lng: L(b.a?.lng) }, { lat: L(b.b?.lat), lng: L(b.b?.lng) }));
      case 'bus': return json(await busArr(L(b.lat), L(b.lng)));
      case 'subway': return json(await subway(String(b.st || '').slice(0, 30)));
      case 'pos': return json(await positions(String(b.line || '').slice(0, 12)));
      case 'exp': return json(await buses(String(b.from || '').slice(0, 30), String(b.to || '').slice(0, 30)));
      case 'train': return json(await trains(String(b.from || '').slice(0, 30), String(b.to || '').slice(0, 30), b.kind === 'itx' ? 'itx' : 'ktx'));
      case 'ping': return json({ kakao: !!KAKAO, data: !!DGK, seoul: !!SEOUL, tmap: !!TMAP, odsay: !!ODSAY_WEB });
      default: return json({ error: 'bad action' }, 400);
    }
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 200);
  }
});
