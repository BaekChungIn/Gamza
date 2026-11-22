// 짬타이거 · naver-search
// 앱이 부르는 서버 함수. 네이버 키는 여기(서버)에만 있고 앱 코드에는 없어요.
//  - kind: 'products' → 굿맨 화장품 상품 이미지 (네이버 이미지 검색)
//  - kind: 'stars'    → MY스타 프로필 이미지 (네이버 이미지 검색)
// 한 번 찾은 이미지는 img_cache 표에 저장해서 모든 사용자가 같이 써요 (30일).
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const NID = Deno.env.get('NAVER_CLIENT_ID') ?? '';
const NSEC = Deno.env.get('NAVER_CLIENT_SECRET') ?? '';

// 서버 키: 예전 이름(SUPABASE_SERVICE_ROLE_KEY) 또는 새 이름(SUPABASE_SECRET_KEYS) 둘 다 지원
function serverKey(): string {
  const k = Deno.env.get('SB_SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (k) return k;
  try { const j = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}'); return j.default ?? Object.values(j)[0] ?? ''; } catch { return ''; }
}
// 요청한 사람으로 로그인된 클라이언트 (앱이 보낸 apikey + 로그인 토큰 그대로 사용)
function userClient(req: Request) {
  const anon = req.headers.get('apikey') || Deno.env.get('SUPABASE_ANON_KEY') || '';
  return createClient(Deno.env.get('SUPABASE_URL')!, anon, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } }, auth: { persistSession: false } });
}
const admin = createClient(Deno.env.get('SUPABASE_URL')!, serverKey());
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });

// 네이버 오픈API는 NAVER API HUB(네이버 클라우드)로 옮겨졌어요. 쇼핑 검색은 종료돼서 상품도 이미지 검색으로 찾아요.
const HUB = 'https://naverapihub.apigw.ntruss.com/search/v1';
async function naver(_api: 'shop' | 'image', query: string): Promise<string | null> {
  const url = `${HUB}/image?display=5&sort=sim&filter=medium&query=${encodeURIComponent(query)}`;
  const r = await fetch(url, { headers: { 'X-NCP-APIGW-API-KEY-ID': NID, 'X-NCP-APIGW-API-KEY': NSEC } });
  if (!r.ok) return null;
  const d = await r.json();
  const it = (d.items ?? [])[0];
  if (!it) return null;
  return it.thumbnail || it.link || null;
}


// ---- 떡밥 자판기: 무대 추천(AI 후보 → 네이버 검색으로 확인) · 위로 문구(AI) · 최신 소식(네이버 뉴스) ----
const GROQ = Deno.env.get('GROQ_API_KEY') ?? '';
let gModel = '';
async function groqJSON(sys: string, user: string): Promise<any> {
  if (!GROQ) return null;
  if (!gModel) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/models', { headers: { Authorization: 'Bearer ' + GROQ } });
      const ids: string[] = ((await r.json()).data ?? []).map((m: any) => m.id);
      gModel = ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile', 'openai/gpt-oss-20b', 'llama-3.1-8b-instant'].find((x) => ids.includes(x)) || ids.find((x) => !/whisper|guard|tts/i.test(x)) || '';
    } catch { return null; }
  }
  if (!gModel) return null;
  const body: any = { model: gModel, temperature: 0.7, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: sys }, { role: 'user', content: user }] };
  if (gModel.startsWith('openai/')) body.reasoning_effort = 'low';
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { Authorization: 'Bearer ' + GROQ, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) return null;
  try { return JSON.parse((await r.json()).choices[0].message.content); } catch { return null; }
}
const clean = (v: any, n: number) => String(v ?? '').replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;|&gt;/g, '').replace(/[<>]/g, '').trim().slice(0, n);
async function hub(api: 'news' | 'webkr', q: string, n = 10) {
  const r = await fetch(`${HUB}/${api}?display=${n}&sort=${api === 'news' ? 'date' : 'sim'}&query=${encodeURIComponent(q)}`, { headers: { 'X-NCP-APIGW-API-KEY-ID': NID, 'X-NCP-APIGW-API-KEY': NSEC } });
  if (!r.ok) return [];
  return ((await r.json()).items ?? []) as any[];
}
const yt = (q: string) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
async function buildDrops(name: string, group: string) {
  const who = (group && !/배우|솔로|트로트|·/.test(group) ? group + ' ' : '') + name;
  const out: any = { stages: [], comforts: [], news: [] };
  // 최신 소식 (네이버 뉴스, 실제 기사)
  try {
    const ns = await hub('news', `${who} 군대`, 10);
    out.news = ns.map((x: any) => ({ t: clean(x.title, 90), u: String(x.originallink || x.link || '') })).filter((x: any) => x.t && /^https:\/\//.test(x.u)).slice(0, 6);
  } catch { }
  // 무대 추천: AI 후보를 네이버 웹검색으로 한 번 더 확인해서 확인된 것만
  const ai = await groqJSON('너는 K-팝·배우 덕질을 잘 아는 도우미야. 확실히 아는 것만 말하고, 모르면 빈 배열을 줘. JSON으로만 답해.',
    `"${who}"의 팬이 다시 보면 좋을 대표 무대·명장면 8개를 골라줘. 노래 제목(또는 작품명)과 무대/방송 이름을 정확히.\n그리고 군대 간 스타를 기다리는 팬을 위한 짧은 위로 문구 10개(스타가 한 말처럼 쓰지 말고, 팬에게 건네는 말로, 30자 이내).\n형식: {"stages":[{"song":"","show":"","year":""}],"comforts":[""]}`);
  if (ai) {
    out.comforts = (ai.comforts ?? []).map((x: any) => clean(x, 60)).filter((x: string) => x.length >= 4).slice(0, 12);
    const cand = (ai.stages ?? []).map((x: any) => ({ song: clean(x.song, 40), show: clean(x.show, 40), year: clean(x.year, 6) })).filter((x: any) => x.song).slice(0, 8);
    const ok = await Promise.all(cand.map(async (c: any) => {
      try {
        const items = await hub('webkr', `${name} ${c.song}`, 5);
        const hit = items.some((it: any) => clean(it.title + ' ' + it.description, 400).replace(/\s/g, '').includes(c.song.replace(/\s/g, '')));
        return hit ? c : null;
      } catch { return null; }
    }));
    out.stages = ok.filter(Boolean).map((c: any) => ({ t: `${c.song}${c.show ? ' · ' + c.show : ''}${c.year ? ' (' + c.year + ')' : ''}`, u: yt(`${who} ${c.song} ${c.show || '무대'}`) }));
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    // 로그인한 사용자만
    const auth = req.headers.get('Authorization') ?? '';
    const { data: u } = await userClient(req).auth.getUser(auth.replace('Bearer ', ''));
    if (!u?.user) return json({ error: 'login required' }, 401);
    if (!NID || !NSEC) return json({ error: 'NAVER keys missing' }, 500);

    const body = await req.json();
    const { kind, items } = body;
    // 스타 등록 화면: 한 스타의 사진 여러 장
    if (kind === 'photos') {
      const qy = String(body.q ?? '').slice(0, 60);
      if (!qy) return json({ photos: [] });
      const ck = 'photos:' + qy;
      const { data: c } = await admin.from('img_cache').select('url,updated_at').eq('key', ck).maybeSingle();
      if (c?.url && c.updated_at > new Date(Date.now() - 7 * 864e5).toISOString()) return json({ photos: JSON.parse(c.url) });
      const r = await fetch(`${HUB}/image?display=40&sort=sim&filter=large&query=${encodeURIComponent(qy)}`, { headers: { 'X-NCP-APIGW-API-KEY-ID': NID, 'X-NCP-APIGW-API-KEY': NSEC } });
      if (!r.ok) return json({ photos: [], error: 'naver ' + r.status });
      const d = await r.json();
      const photos = [...new Set((d.items ?? []).map((x: any) => x.thumbnail || x.link).filter(Boolean))].slice(0, 24);
      await admin.from('img_cache').upsert({ key: ck, url: JSON.stringify(photos), updated_at: new Date().toISOString() });
      return json({ photos });
    }
    // 떡밥 자판기 재료 (스타별로 하루 동안 모두가 같이 써요)
    if (kind === 'drops') {
      const sid = String(body.sid ?? '');
      if (!/^[a-z0-9_]{1,40}$/.test(sid)) return json({ error: 'bad request' }, 400);
      const name = clean(body.name, 20), group = clean(body.group, 30);
      const ck = 'drops:' + sid;
      const { data: c } = await admin.from('img_cache').select('url,updated_at').eq('key', ck).maybeSingle();
      if (c?.url && c.updated_at > new Date(Date.now() - 864e5).toISOString()) return json(JSON.parse(c.url));
      const d = await buildDrops(name, group);
      if (d.stages.length || d.comforts.length || d.news.length) await admin.from('img_cache').upsert({ key: ck, url: JSON.stringify(d), updated_at: new Date().toISOString() });
      return json(d);
    }
    if (!['products', 'stars'].includes(kind) || !Array.isArray(items)) return json({ error: 'bad request' }, 400);
    const list = items.slice(0, 300).filter((x: any) => x && typeof x.id === 'string' && typeof x.q === 'string' && x.q.length < 80);
    const keys = list.map((x: any) => `${kind}:${x.id}`);
    const since = new Date(Date.now() - 30 * 864e5).toISOString();
    const { data: cached } = await admin.from('img_cache').select('key,url,updated_at').in('key', keys);
    const map: Record<string, string> = {};
    const fresh = new Set<string>();
    for (const c of cached ?? []) { if (c.url) map[c.key.slice(kind.length + 1)] = c.url; if (c.updated_at > since) fresh.add(c.key); }

    // 새로 찾아야 할 것 (한 번에 최대 60개 · 나머지는 다음 호출에)
    const todo = list.filter((x: any) => !fresh.has(`${kind}:${x.id}`)).slice(0, 60);
    const rows: { key: string; url: string | null; updated_at: string }[] = [];
    for (let i = 0; i < todo.length; i += 6) {
      const part = todo.slice(i, i + 6);
      const res = await Promise.all(part.map((x: any) => naver(kind === 'products' ? 'shop' : 'image', x.q).catch(() => null)));
      part.forEach((x: any, k: number) => {
        rows.push({ key: `${kind}:${x.id}`, url: res[k], updated_at: new Date().toISOString() });
        if (res[k]) map[x.id] = res[k] as string;
      });
    }
    if (rows.length) await admin.from('img_cache').upsert(rows);
    const left = list.length - fresh.size - todo.length;
    return json({ images: map, pending: Math.max(0, left) });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
