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
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    // 로그인한 사용자만
    const auth = req.headers.get('Authorization') ?? '';
    const { data: u } = await admin.auth.getUser(auth.replace('Bearer ', ''));
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
