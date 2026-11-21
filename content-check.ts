// 짬타이거 · content-check  (매일 1번 자동 실행 + 관리자 화면에서 수동 실행)
// 1) 끝난 혜택 이벤트를 정리하고, 네이버 뉴스에서 새로 시작한 장병 혜택을 찾아 자동으로 추가해요.
// 2) 앱에 적힌 나라사랑카드 혜택 · 군적금 우대조건 · 진행 중 이벤트를 네이버 검색 결과와 비교해요 (Groq AI).
// 3) 틀렸거나 바뀐 내용, 새로 추가한 이벤트를 micbael11@naver.com 으로 메일 보내요 (Resend).
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const env = (k: string, d = '') => Deno.env.get(k) ?? d;
const NID = env('NAVER_CLIENT_ID'), NSEC = env('NAVER_CLIENT_SECRET');
const GROQ = env('GROQ_API_KEY'), GROQ_MODEL = env('GROQ_MODEL', 'llama-3.3-70b-versatile');
const RESEND = env('RESEND_API_KEY'), MAIL_TO = env('REPORT_EMAIL', 'micbael11@naver.com'), MAIL_FROM = env('MAIL_FROM', '짬타이거 <onboarding@resend.dev>');
const CRON_KEY = env('CRON_KEY');
const SITE = env('SITE_URL', 'https://baekchungin.github.io/Gamza/');
const db = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const today = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); // 한국 날짜
const strip = (s: string) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

async function naver(api: 'news' | 'webkr', query: string, n = 10) {
  const r = await fetch(`https://openapi.naver.com/v1/search/${api}.json?display=${n}&sort=${api === 'news' ? 'date' : 'sim'}&query=${encodeURIComponent(query)}`,
    { headers: { 'X-Naver-Client-Id': NID, 'X-Naver-Client-Secret': NSEC } });
  if (!r.ok) return [];
  const d = await r.json();
  return (d.items ?? []).map((x: any) => ({ title: strip(x.title), desc: strip(x.description), url: x.originallink || x.link, date: x.pubDate || '' }));
}
async function search(query: string) {
  const [a, b] = await Promise.all([naver('news', query, 8).catch(() => []), naver('webkr', query, 6).catch(() => [])]);
  return [...a, ...b].slice(0, 14);
}
async function groq(system: string, user: string): Promise<any> {
  for (let t = 0; t < 3; t++) {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST', headers: { Authorization: `Bearer ${GROQ}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: GROQ_MODEL, temperature: 0.1, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
    });
    if (r.status === 429) { await new Promise((ok) => setTimeout(ok, 4000 * (t + 1))); continue; }
    if (!r.ok) throw new Error('groq ' + r.status + ' ' + (await r.text()).slice(0, 200));
    const d = await r.json();
    try { return JSON.parse(d.choices[0].message.content); } catch { return {}; }
  }
  return {};
}
const CHECK_SYS = `너는 한국 군 장병 혜택 정보를 검수하는 꼼꼼한 편집자야. 앱에 적힌 내용(ours)과 네이버 검색 결과(evidence)를 비교해.
검색 결과에 '분명한 근거'가 있을 때만 틀렸다고 판단하고, 근거가 없거나 애매하면 지적하지 마.
반드시 JSON 으로만 답해: {"issues":[{"item":"항목 이름","ours":"앱에 적힌 내용","found":"검색 결과 내용","fix":"이렇게 고치면 됨","source":"근거 URL","confidence":"high|medium"}]}
문제 없으면 {"issues":[]}.`;

async function getContent(key: string) {
  const { data } = await db.from('app_content').select('data').eq('key', key).maybeSingle();
  return data?.data ?? null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  // 실행 권한: 예약 실행(x-cron-key) 또는 관리자
  let ok = !!CRON_KEY && req.headers.get('x-cron-key') === CRON_KEY;
  if (!ok) {
    const { data: u } = await db.auth.getUser((req.headers.get('Authorization') ?? '').replace('Bearer ', ''));
    if (u?.user) { const { data: p } = await db.from('profiles').select('is_admin').eq('id', u.user.id).maybeSingle(); ok = !!p?.is_admin; }
  }
  if (!ok) return json({ error: 'forbidden' }, 403);
  if (!NID || !GROQ) return json({ error: 'NAVER / GROQ keys missing' }, 500);

  const T = today(), reports: { kind: string; title: string; detail: any }[] = [], log: string[] = [];
  try {
    // ---------- 1) 혜택 이벤트: 끝난 것 정리 + 새 이벤트 찾기 ----------
    let ev = await getContent('events');
    if (!ev) { try { ev = await (await fetch(SITE + 'events.json?' + Date.now())).json(); } catch { ev = { events: [] }; } }
    const events: any[] = Array.isArray(ev.events) ? ev.events : [];
    const live = events.filter((e) => !e.end || e.end >= T);
    const ended = events.filter((e) => e.end && e.end < T && !e.closed);
    ended.forEach((e) => (e.closed = true));
    log.push(`이벤트: 진행 ${live.length} · 오늘 종료 처리 ${ended.length}`);

    const news = (await Promise.all(['나라사랑카드 이벤트', '국군장병 할인 이벤트', '군인 장병 캐시백 이벤트', '장병 혜택 이벤트 기간'].map((q) => naver('news', q, 12).catch(() => [])))).flat();
    const seen = new Set<string>(); const uniq = news.filter((n) => !seen.has(n.url) && seen.add(n.url)).slice(0, 36);
    if (uniq.length) {
      const found = await groq(`너는 한국 군 장병 대상 혜택 이벤트를 정리하는 편집자야. 오늘은 ${T}.
뉴스 목록에서 '지금 진행 중이거나 곧 시작하는' 장병·군인 대상 이벤트만 골라. 이미 있는 이벤트(existing)와 같은 건 빼.
기간(시작·종료일)이 기사에 분명히 있는 것만 넣고, 날짜는 YYYY-MM-DD. 종료일이 오늘보다 이전이면 빼.
JSON 으로만: {"events":[{"title":"","org":"","benefit":"","target":"","start":"","end":"","note":"","url":""}]}`,
        JSON.stringify({ existing: events.map((e) => e.title), news: uniq.map((n) => ({ t: n.title, d: n.desc, u: n.url, p: n.date })) }));
      const add = (found.events ?? []).filter((e: any) => e && e.title && e.end && e.end >= T && /^\d{4}-\d{2}-\d{2}$/.test(e.end) && !events.some((x) => x.title === e.title || (e.url && x.url === e.url)));
      add.forEach((e: any) => { e.auto = true; e.added = T; events.push(e); });
      if (add.length) reports.push({ kind: 'new_event', title: `새 혜택 이벤트 ${add.length}개를 자동으로 추가했어요`, detail: add });
      log.push(`새 이벤트 ${add.length}`);
    }
    if (ended.length || reports.some((r) => r.kind === 'new_event')) {
      await db.from('app_content').upsert({ key: 'events', data: { ...ev, events, updated: T }, updated_at: new Date().toISOString(), updated_by: 'auto' });
    }

    // ---------- 2) 내용 검증 ----------
    const checks: { kind: string; name: string; query: string; ours: any }[] = [];
    const cards = await getContent('cards');
    for (const c of Array.isArray(cards) ? cards : []) if (!/중단/.test(c.tag ?? '')) checks.push({ kind: 'card', name: c.n, query: `${c.n} 혜택 ${T.slice(0, 4)}`, ours: c.items });
    const sav = await getContent('savings');
    for (const b of Array.isArray(sav) ? sav : []) checks.push({ kind: 'savings', name: `${b.n} 장병내일준비적금`, query: `${b.n}은행 장병내일준비적금 우대금리`, ours: { 기본금리: b.b, 최고금리: b.max, 우대조건: b.o } });
    for (const e of events.filter((e) => !e.closed && !e.auto && (!e.end || e.end >= T)).slice(0, 8)) checks.push({ kind: 'event', name: e.title, query: e.title, ours: { 기간: `${e.start} ~ ${e.end}`, 혜택: e.benefit, 대상: e.target } });

    for (const c of checks) {
      const ev2 = await search(c.query);
      if (!ev2.length) continue;
      const r = await groq(CHECK_SYS, JSON.stringify({ 항목: c.name, ours: c.ours, evidence: ev2 }));
      const issues = (r.issues ?? []).filter((i: any) => i && i.fix && i.confidence !== 'low');
      if (issues.length) reports.push({ kind: c.kind, title: `${c.name} — 확인 필요 ${issues.length}건`, detail: issues });
      await new Promise((ok) => setTimeout(ok, 1200));
    }
    log.push(`검증 ${checks.length}개 · 문제 ${reports.filter((r) => r.kind !== 'new_event').length}개`);

    // ---------- 3) 저장 + 메일 ----------
    if (reports.length) {
      await db.from('content_reports').insert(reports);
      if (RESEND) {
        const html = `<div style="font-family:sans-serif;max-width:640px">
<h2 style="margin:0 0 4px">짬타이거 자동 점검 결과 (${T})</h2><p style="color:#8B95A1;margin:0 0 18px">앱 관리자 화면 → 점검 결과에서도 볼 수 있어요.</p>
${reports.map((r) => `<div style="border:1px solid #E5E8EB;border-radius:12px;padding:14px;margin-bottom:12px"><b>${esc(r.title)}</b>
${(r.detail ?? []).map((i: any) => r.kind === 'new_event'
  ? `<div style="margin-top:8px;font-size:13px">• <b>${esc(i.title)}</b> (${esc(i.org)}) ${esc(i.start)} ~ ${esc(i.end)}<br>${esc(i.benefit)} <a href="${esc(i.url)}">출처</a></div>`
  : `<div style="margin-top:8px;font-size:13px">• <b>${esc(i.item)}</b><br>앱: ${esc(i.ours)}<br>검색: ${esc(i.found)}<br><b style="color:#D94867">수정: ${esc(i.fix)}</b> <a href="${esc(i.source)}">근거</a></div>`).join('')}</div>`).join('')}</div>`;
        const m = await fetch('https://api.resend.com/emails', {
          method: 'POST', headers: { Authorization: `Bearer ${RESEND}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: MAIL_FROM, to: [MAIL_TO], subject: `[짬타이거] 수정이 필요한 내용 ${reports.length}건 (${T})`, html }),
        });
        log.push('메일 ' + (m.ok ? '보냄' : '실패 ' + m.status));
      }
    }
    return json({ ok: true, reports: reports.length, log });
  } catch (e) {
    return json({ ok: false, error: String(e), log }, 500);
  }
});
