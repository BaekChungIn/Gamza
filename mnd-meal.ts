// 짬타이거 · mnd-meal
// 국방부 공공데이터(openapi.mnd.go.kr)에서 부대별 병영 식단을 가져와 meal_days 표에 저장해요.
// 인증키(MND_API_KEY)는 Supabase > Edge Functions > Secrets 에만 넣어요. 앱 코드에는 없어요.
// 하루 몇 번만 실제로 가져오고(6시간 간격), 그 사이에는 저장된 걸 그대로 써요.
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
async function getRows(code: string, a: number, b: number): Promise<{ total: number; rows: any[] }> {
  const svc = `DS_TB_MNDT_DATEBYMLSVC_${code}`;
  const r = await fetch(`${BASE}/${KEY}/json/${svc}/${a}/${b}/`, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error('http ' + r.status);
  const j = await r.json();
  const o = j[svc] ?? Object.values(j)[0] as any;
  if (!o || !o.row) throw new Error((o && o.RESULT && o.RESULT.MESSAGE) || 'no data');
  return { total: +o.list_total_count || 0, rows: o.row };
}
async function syncUnit(code: string, from: string, to: string) {
  const first = await getRows(code, 1, 5);
  const total = first.total; if (!total) return 0;
  // 최근 데이터가 뒤쪽에 쌓여요. 뒤에서 3000줄(약 몇 달치)만 가져와요.
  const start = Math.max(1, total - 2999); let rows: any[] = [];
  for (let a = start; a <= total; a += 1000) rows = rows.concat((await getRows(code, a, Math.min(total, a + 999))).rows);
  const days: Record<string, { b: string[]; l: string[]; n: string[]; sp: string[] }> = {};
  let cur: string | null = null;
  for (const r of rows) {
    const k: Record<string, any> = {}; for (const [x, v] of Object.entries(r)) k[x.toLowerCase()] = v;
    const d = pdate(k.dates); if (d) cur = d; if (!cur || cur < from || cur > to) continue;
    const D = days[cur] ??= { b: [], l: [], n: [], sp: [] };
    const add = (arr: string[], v: unknown) => { const t = clean(v); if (t && !arr.includes(t) && arr.length < 15) arr.push(t); };
    add(D.b, k.brst); add(D.l, k.lunc); add(D.n, k.dinr); add(D.sp, k.adspcfd);
  }
  const up = Object.entries(days).map(([d, v]) => ({ unit: code, d, ...v }));
  for (let i = 0; i < up.length; i += 300) { const { error } = await admin.from('meal_days').upsert(up.slice(i, i + 300)); if (error) throw error; }
  return up.length;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const body = await req.json().catch(() => ({}));
    if (body.action !== 'sync') return json({ error: 'bad action' }, 400);
    if (!KEY) return json({ error: 'MND_API_KEY 없음' }, 500);
    const { data: st } = await admin.from('meal_sync').select('at').eq('id', 1).maybeSingle();
    if (!body.force && st && st.at && Date.now() - Date.parse(st.at) < 6 * 3600e3) return json({ skipped: true, at: st.at });
    await admin.from('meal_sync').upsert({ id: 1, at: new Date().toISOString() });
    const now = new Date(Date.now() + 9 * 3600e3), from = ymd(new Date(now.getTime() - 20 * 864e5)), to = ymd(new Date(now.getTime() + 45 * 864e5));
    const { data: units } = await admin.from('meal_units').select('code').eq('active', true);
    const out: Record<string, number | string> = {};
    for (const u of units ?? []) { try { out[u.code] = await syncUnit(u.code, from, to); } catch (e) { out[u.code] = 'X ' + String((e as Error).message || e).slice(0, 60); } }
    return json({ ok: true, units: out });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
