// 짬타이거 · mnd-meal
// 국방부 공공데이터(openapi.mnd.go.kr)에서 부대별 병영 식단을 가져와 meal_days 표에 저장해요.
// 인증키(MND_API_KEY)는 Supabase > Edge Functions > Secrets 에만 넣어요. 앱 코드에는 없어요.
// 하루 몇 번만 실제로 가져오고(식단 6시간 · 나머지 하루 간격), 그 사이에는 저장된 걸 그대로 써요.
// action 'sync' → 부대 식단 · action 'data' → PX 인기상품 · TMO · 군병원 · 장병 할인
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const KEY = Deno.env.get('MND_API_KEY') ?? '';
function serverKey(): string {
  const k = Deno.env.get('SB_SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (k) return k;
  try { const j = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}'); return j.default ?? Object.values(j)[0] ?? ''; } catch { return ''; }
}
const admin = createClient(Deno.env.get('SUPABASE_URL')!, serverKey());
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });

const BASE = 'https://openapi.mnd.go.kr';
const ymd = (d: Date) => d.toISOString().slice(0, 10);
// 메뉴 칸 정리: "쌀밥(1.2.5)" → "쌀밥", 알레르기 번호 · 괄호 · 공백 정리
const clean = (s: unknown) => String(s ?? '').replace(/\([0-9.,\s]*\)/g, '').replace(/[0-9.]+$/g, '').replace(/\s+/g, ' ').trim();
function pdate(s: string): string | null {
  const m = String(s || '').match(/(\d{4})\D?(\d{1,2})\D?(\d{1,2})/);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : null;
}
// 숫자 부대는 DS_TB_MNDT_DATEBYMLSVC_번호, 훈련소 · 교육기관은 이름이 달라서 후보를 차례로 시도해요
const ALIAS: Record<string, string[]> = { ATC: ['ATC', 'KATC', 'ARMYTC'], KIDA: ['KIDA', 'KIDA_MLSVC'] };
const svcOk: Record<string, string> = {};
async function fetchSvc(svc: string, a: number, b: number) {
  const r = await fetch(`${BASE}/${KEY}/json/${svc}/${a}/${b}/`, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error('http ' + r.status);
  const j = await r.json();
  const o = j[svc] ?? Object.values(j)[0] as any;
  if (!o || !o.row) throw new Error((o && o.RESULT && o.RESULT.MESSAGE) || (j.RESULT && j.RESULT.MESSAGE) || (o && o.MESSAGE) || 'no data');
  return { total: +o.list_total_count || 0, rows: o.row as any[] };
}
async function getRows(code: string, a: number, b: number): Promise<{ total: number; rows: any[] }> {
  if (svcOk[code]) return fetchSvc(svcOk[code], a, b);
  let last: unknown = null;
  for (const c of ALIAS[code] ?? [code]) {
    const svc = `DS_TB_MNDT_DATEBYMLSVC_${c}`;
    try { const r = await fetchSvc(svc, a, b); svcOk[code] = svc; return r; } catch (e) { last = e; }
  }
  throw last ?? new Error('no data');
}
async function syncUnit(code: string, from: string, to: string) {
  const first = await getRows(code, 1, 5);
  const total = first.total; if (!total) return 0;
  // 부대마다 날짜 순서가 뒤죽박죽이라 전부 훑어요. 메모리를 아끼려고 1000줄씩 받아서 바로 날짜별로 정리하고 버려요.
  const days: Record<string, { b: string[]; l: string[]; n: string[]; sp: string[] }> = {};
  let maxD = '';
  const lim = ymd(new Date(Date.now() - 400 * 864e5));   // 1년 넘은 옛날 식단은 건너뛰어요
  for (let a = 1; a <= Math.min(total, 15000); a += 1000) {
    const rows = (await getRows(code, a, Math.min(total, a + 999))).rows; let cur: string | null = null;
    for (const r of rows) {
      const d = pdate(r.dates ?? r.DATES ?? r.Dates); if (d) cur = d; if (!cur || cur < lim || cur > to) continue;
      if (cur > maxD) maxD = cur;
      const D = days[cur] ??= { b: [], l: [], n: [], sp: [] };
      const add = (arr: string[], v: unknown) => { const t = clean(v); if (t && !arr.includes(t) && arr.length < 15) arr.push(t); };
      add(D.b, r.brst ?? r.BRST); add(D.l, r.lunc ?? r.LUNC); add(D.n, r.dinr ?? r.DINR); add(D.sp, r.adspcfd ?? r.ADSPCFD);
    }
  }
  // 오늘 기준 20일 전 또는 '가장 최근 식단'부터 5주 전 중 더 이른 날부터 저장 (국방부가 늦게 올리는 부대)
  if (maxD) { const f2 = ymd(new Date(Date.parse(maxD + 'T00:00:00Z') - 35 * 864e5)); if (f2 < from) from = f2; }
  const up = Object.entries(days).filter(([d]) => d >= from).map(([d, v]) => ({ unit: code, d, ...v }));
  for (let i = 0; i < up.length; i += 300) { const { error } = await admin.from('meal_days').upsert(up.slice(i, i + 300)); if (error) throw error; }
  const { count } = await admin.from('meal_days').select('d', { count: 'exact', head: true }).eq('unit', code);
  await admin.from('meal_units').update({ days: count ?? up.length }).eq('code', code);
  return up.length;
}

// ---- PX 인기상품 · TMO · 군병원 · 장병 할인: 관리자가 적어둔 서비스 이름으로 가져와 mnd_cache 에 저장 ----
async function getAll(svc: string): Promise<any[]> {
  const first = await fetch(`${BASE}/${KEY}/json/${svc}/1/1/`).then((r) => r.json());
  const o0 = first[svc] ?? (Object.values(first)[0] as any); const total = +(o0 && o0.list_total_count) || 0;
  if (!total) throw new Error((o0 && o0.RESULT && o0.RESULT.MESSAGE) || 'no data');
  let rows: any[] = [];
  for (let a = 1; a <= Math.min(total, 6000); a += 1000) {
    const j = await fetch(`${BASE}/${KEY}/json/${svc}/${a}/${Math.min(total, a + 999)}/`).then((r) => r.json());
    const o = j[svc] ?? (Object.values(j)[0] as any); rows = rows.concat(o.row ?? []);
  }
  return rows.map((r) => { const k: Record<string, any> = {}; for (const [x, v] of Object.entries(r)) k[x.toLowerCase()] = typeof v === 'string' ? v.trim() : v; return k; });
}
const hm = (s: string) => (/^\d{1,2}:\d{2}$/.test(s || '') ? s : '');
function shape(kind: string, R: any[]): unknown {
  if (kind === 'px') {
    const M: Record<string, { q: [number, string][]; a: [number, string][] }> = {};
    for (const r of R) { const y = parseInt(r.sellyear), m = parseInt(String(r.sellmonth).replace(/\D/g, '')); if (!y || !m || !r.prdtnm) continue; const k = `${y}-${String(m).padStart(2, '0')}`; M[k] ??= { q: [], a: [] }; M[k][String(r.seltnstd).includes('수량') ? 'q' : 'a'].push([+r.rowno || 0, r.prdtnm]); }
    const out: Record<string, { q: string[]; a: string[] }> = {};
    for (const k of Object.keys(M).sort()) out[k] = { q: M[k].q.sort((a, b) => b[0] - a[0]).map((x) => x[1]), a: M[k].a.sort((a, b) => b[0] - a[0]).map((x) => x[1]) };
    return out;
  }
  if (kind === 'tmo') return R.map((t) => [t.tmo_nm, t.gnrltelno === '없음' ? '' : (t.gnrltelno || ''), hm(t.wkday_strtm) && hm(t.wkday_endtm) ? `${t.wkday_strtm}~${t.wkday_endtm}` : '', hm(t.wkend_strtm) && hm(t.wkend_endtm) ? `${t.wkend_strtm}~${t.wkend_endtm}` : '', t.pstnexpln || '', t.etc || '']).filter((t) => t[0]);
  if (kind === 'hosp') return R.map((h) => [h.hsptnm, h.hspt_addr, h.hspt_cntadr, +h.ltd, +h.lngt]).filter((h) => h[0]);
  if (kind === 'dc') return R.map((d) => [d.rgn || '', d.instltnnm || '', d.dcntenatvnm || '', String(d.dtlexpln || '').replace(/\s{2,}/g, ' ~ '), d.cntadr || '', d.fnshday || '', d.hmpg || '']).filter((d) => d[1]);
  return null;
}
async function syncData() {
  const { data: src } = await admin.from('mnd_sources').select('kind,svc');
  const out: Record<string, string | number> = {};
  for (const s of src ?? []) {
    if (!s.svc) continue;
    try { const v = shape(s.kind, await getAll(s.svc)); const n = Array.isArray(v) ? v.length : Object.keys(v as object).length; if (!n) throw new Error('empty');
      await admin.from('mnd_cache').upsert({ kind: s.kind, data: v, at: new Date().toISOString() }); out[s.kind] = n;
    } catch (e) { out[s.kind] = 'X ' + String((e as Error).message || e).slice(0, 60); }
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const body = await req.json().catch(() => ({}));
    if (body.action !== 'sync' && body.action !== 'data') return json({ error: 'bad action' }, 400);
    if (!KEY) return json({ error: 'MND_API_KEY 없음' }, 500);
    if (body.action === 'data') {
      const { data: st } = await admin.from('mnd_cache').select('at').order('at', { ascending: false }).limit(1).maybeSingle();
      if (!body.force && st && st.at && Date.now() - Date.parse(st.at) < 24 * 3600e3) return json({ skipped: true, at: st.at });
      return json({ ok: true, data: await syncData() });
    }
    const now = new Date(Date.now() + 9 * 3600e3), from = ymd(new Date(now.getTime() - 20 * 864e5)), to = ymd(new Date(now.getTime() + 45 * 864e5));
    // svc 칸에 서비스 이름을 적어둔 부대는 그 이름으로 가져와요
    let { data: units, error: ue } = await admin.from('meal_units').select('code,svc,synced_at').eq('active', true);
    if (ue) ({ data: units } = await admin.from('meal_units').select('code').eq('active', true));
    for (const u of units ?? []) if ((u as any).svc) svcOk[u.code] = String((u as any).svc).trim();
    // 부대가 많고 식단이 길어서 한 번에 다 하면 시간 초과가 나요.
    // → 오래전에 받은 부대부터 한 번에 최대 4곳(30초)만 받고, 나머지는 다음 호출 때 이어서 해요.
    const only = body.unit ? [String(body.unit)] : null;
    const old = (u: any) => !u.synced_at || Date.now() - Date.parse(u.synced_at) > 6 * 3600e3;
    let list = (units ?? []).filter((u: any) => only ? only.includes(u.code) : (body.force || old(u)))
      .sort((x: any, y: any) => String(x.synced_at || '').localeCompare(String(y.synced_at || ''))).map((u: any) => u.code);
    if (!list.length) return json({ skipped: true, msg: '모든 부대가 6시간 안에 업데이트됐어요' });
    const t0 = Date.now(), out: Record<string, number | string> = {}; let i = 0;
    const work = async () => { while (i < list.length && Date.now() - t0 < 30e3 && Object.keys(out).length < (only ? 1 : 4)) { const c = list[i++];
      try { out[c] = await syncUnit(c, from, to); } catch (e) { out[c] = 'X ' + String((e as Error).message || e).slice(0, 60); }
      try { await admin.from('meal_units').update({ synced_at: new Date().toISOString() }).eq('code', c); } catch { /* */ } } };
    await work();   // 한 곳씩 차례로 (자원 한도 때문에 동시에 받지 않아요)
    const left = list.length - Object.keys(out).length;
    return json({ ok: true, units: out, left, msg: left ? `${left}곳 남았어요 · 한 번 더 Send 하면 이어서 받아요` : '전부 받았어요' });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
