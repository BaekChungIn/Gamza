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
const GROQ = env('GROQ_API_KEY'), GROQ_MODEL_ENV = env('GROQ_MODEL');
const RESEND = env('RESEND_API_KEY'), MAIL_TO = env('REPORT_EMAIL', 'micbael11@naver.com'), MAIL_FROM = env('MAIL_FROM', '짬타이거 <onboarding@resend.dev>');
const CRON_KEY = env('CRON_KEY');
const SITE = env('SITE_URL', 'https://baekchungin.github.io/Gamza/');

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
const db = createClient(env('SUPABASE_URL'), serverKey());
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const today = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); // 한국 날짜
const strip = (s: string) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

async function naver(api: 'news' | 'webkr', query: string, n = 10) {
  // NAVER API HUB (네이버 클라우드) 방식
  const r = await fetch(`https://naverapihub.apigw.ntruss.com/search/v1/${api}?display=${n}&sort=${api === 'news' ? 'date' : 'sim'}&query=${encodeURIComponent(query)}`,
    { headers: { 'X-NCP-APIGW-API-KEY-ID': NID, 'X-NCP-APIGW-API-KEY': NSEC } });
  if (!r.ok) return [];
  const d = await r.json();
  return (d.items ?? []).map((x: any) => ({ title: strip(x.title), desc: strip(x.description), url: x.originallink || x.link, date: x.pubDate || '' }));
}
async function search(query: string) {
  const [a, b] = await Promise.all([naver('news', query, 8).catch(() => []), naver('webkr', query, 6).catch(() => [])]);
  return [...a, ...b].slice(0, 14);
}
// Groq 모델은 자주 바뀌어서, 지금 내 키로 쓸 수 있는 모델 중 좋은 것을 자동으로 골라요
let MODEL = '';
const PREFER = ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile', 'moonshotai/kimi-k2-instruct', 'qwen/qwen3-32b', 'meta-llama/llama-4-maverick-17b-128e-instruct', 'openai/gpt-oss-20b', 'llama-3.1-8b-instant'];
async function pickModel(): Promise<string> {
  if (MODEL) return MODEL;
  if (GROQ_MODEL_ENV) return (MODEL = GROQ_MODEL_ENV);
  try {
    const r = await fetch('https://api.groq.com/openai/v1/models', { headers: { Authorization: `Bearer ${GROQ}` } });
    const ids: string[] = ((await r.json()).data ?? []).filter((m: any) => m.active !== false).map((m: any) => m.id);
    MODEL = PREFER.find((x) => ids.includes(x)) ?? ids.find((x) => !/whisper|guard|tts|playai|prompt|compound|embed|vision/i.test(x)) ?? 'openai/gpt-oss-120b';
  } catch { MODEL = 'openai/gpt-oss-120b'; }
  return MODEL;
}
function parseJSON(txt: string): any {
  try { return JSON.parse(txt); } catch { /* 아래에서 다시 */ }
  const m = String(txt ?? '').match(/\{[\s\S]*\}/); if (m) { try { return JSON.parse(m[0]); } catch { /* 무시 */ } }
  return {};
}
async function groq(system: string, user: string): Promise<any> {
  let jsonMode = true, reason = true;
  for (let t = 0; t < 6; t++) {
    const model = await pickModel();
    const body: any = { model, temperature: 0.1, messages: [{ role: 'system', content: system + '\n반드시 JSON 객체 하나만 출력해.' }, { role: 'user', content: user }] };
    if (jsonMode) body.response_format = { type: 'json_object' };
    if (reason && /gpt-oss/.test(model)) body.reasoning_effort = 'low';
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${GROQ}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.status === 429) { await new Promise((ok) => setTimeout(ok, 4000 * (t + 1))); continue; }
    if (r.status === 404 || r.status === 400) {
      const txt = await r.text();
      if (/model/i.test(txt) && /not exist|decommission|not found|access/i.test(txt) && !GROQ_MODEL_ENV) { PREFER.splice(PREFER.indexOf(model) >>> 0, 1); MODEL = ''; const nx = PREFER.find(Boolean); if (nx) { MODEL = nx; continue; } }
      if (reason && /reasoning/i.test(txt)) { reason = false; continue; }
      if (jsonMode && /json|response_format/i.test(txt)) { jsonMode = false; continue; }
      throw new Error('groq ' + r.status + ' ' + txt.slice(0, 200));
    }
    if (!r.ok) throw new Error('groq ' + r.status + ' ' + (await r.text()).slice(0, 200));
    const d = await r.json();
    return parseJSON(d.choices?.[0]?.message?.content ?? '');
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
    const uc = userClient(req);
    const { data: isA, error: ae } = await uc.rpc('is_admin');
    ok = isA === true;
    if (!ok) return json({ error: 'forbidden', why: ae ? ae.message : (isA === false ? 'not admin (profiles.is_admin = false)' : 'no login') }, 403);
  }
  if (!ok) return json({ error: 'forbidden' }, 403);
  if (!NID || !GROQ) return json({ error: 'NAVER / GROQ keys missing' }, 500);

  let body: any = {}; try { body = (await req.json()) ?? {}; } catch { /* 기본값 */ }
  if (body.mode === 'diag') {
    const k = serverKey(), out: any = { has_service_role: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), has_secret_keys: !!Deno.env.get('SUPABASE_SECRET_KEYS'), has_custom: !!Deno.env.get('SB_SERVICE_KEY'), key_type: k.startsWith('sb_secret') ? 'sb_secret' : k.startsWith('ey') ? 'jwt' : (k ? 'other' : 'none') };
    const r1 = await db.from('app_content').select('key').limit(1); out.read = r1.error ? 'X ' + r1.error.message : 'OK (' + (r1.data || []).length + ')';
    const r2 = await db.from('app_content').upsert({ key: 'diag', data: { at: new Date().toISOString() }, updated_by: 'diag' }); out.write = r2.error ? 'X ' + r2.error.message : 'OK';
    return json(out);
  }
  // 일은 뒤에서 하고, 요청에는 바로 답해요 (연결이 오래 걸려 끊기지 않게)
  const task = runTask(body);
  try { EdgeRuntime.waitUntil(task); } catch { await task; }
  return json({ ok: true, started: true, mode: body.mode || 'content' });
});

let RUN_ID = '';
async function runTask(body: any) {
  const T = today(), reports: { kind: string; title: string; detail: any }[] = [], log: string[] = [];
  const mode = body.mode || 'content', offset = Number(body.offset || 0), run = String(body.run || new Date().toISOString());
  RUN_ID = run;
  const logKey = mode === 'stars' || mode === 'star_verify' ? 'run_log_stars' : 'run_log_content';
  try {
    if (mode === 'stars') {
      await checkStars(T, reports, log);
      if (reports.length) await saveReports(reports, log);
    } else if (mode === 'star_verify') {
      const idx = Number(body.idx || 0);
      const more = await verifyStar(idx, T, reports, log);
      if (reports.length) await saveReports(reports, log);
      if (more) { chain({ mode: 'star_verify', idx: idx + 1, run }); log.push('다음 후보 이어서 확인'); }
      else { log.push('스타 확인 완료'); const { data: all } = await db.from('content_reports').select('kind,title,detail').gte('created_at', run).eq('kind', 'new_star'); if (all && all.length) await sendMail(T, all, log); }
    } else if (mode === 'content') {
      await stepEvents(T, reports, log);
      if (reports.length) await saveReports(reports, log);
      chain({ mode: 'verify', offset: 0, run });
      log.push('카드·적금·이벤트 검증은 뒤에서 이어서 진행돼요 (몇 분 뒤 점검 결과·메일 확인)');
    } else if (mode === 'verify') {
      const checks = await buildChecks(T);
      const part = checks.slice(offset, offset + STEP);
      for (const c of part) {
        const ev2 = await search(c.query);
        if (!ev2.length) continue;
        const r = await groq(CHECK_SYS, JSON.stringify({ 항목: c.name, ours: c.ours, evidence: ev2 }));
        const issues = (r.issues ?? []).filter((x: any) => x && x.fix && x.confidence !== 'low');
        if (issues.length) reports.push({ kind: c.kind, title: `${c.name} — 확인 필요 ${issues.length}건`, detail: issues });
      }
      if (reports.length) await saveReports(reports, log);
      log.push(`검증 ${Math.min(offset + STEP, checks.length)}/${checks.length}`);
      if (offset + STEP < checks.length) { chain({ mode: 'verify', offset: offset + STEP, run }); log.push('다음 묶음 이어서 진행'); }
      else {
        log.push('검증 완료');
        // 마지막 단계: 이번 실행에서 나온 결과를 모아 메일 한 통
        const { data: all } = await db.from('content_reports').select('kind,title,detail').gte('created_at', run).neq('kind', 'new_star');
        if (all && all.length) await sendMail(T, all, log);
      }
    }
    if (MODEL) log.push('AI ' + MODEL);
  } catch (e) {
    log.push('오류: ' + String(e).slice(0, 200));
  }
  await runLog(logKey, run, mode === 'content' || mode === 'stars', log, mode);
}
async function runLog(key: string, run: string, reset: boolean, lines: string[], mode: string) {
  let prev: any = reset ? null : await getContent(key);
  if (!prev || prev.run !== run) prev = { run, lines: [] };
  const done = (mode === 'verify' || mode === 'star_verify') ? !lines.some((l) => /이어서|뒤에서/.test(l)) : false;
  prev.lines = [...prev.lines, ...lines].slice(-40); prev.at = new Date().toISOString(); prev.mode = mode;
  await db.from('app_content').upsert({ key, data: prev, updated_at: prev.at, updated_by: 'auto' });
}



// ---------- 한 번에 조금씩 (서버 함수 시간 제한 때문에) ----------
declare const EdgeRuntime: any;
const STEP = 3;
async function saveReports(reports: any[], log: string[]) {
  const { error } = await db.from('content_reports').insert(reports);
  if (error) log.push('점검 결과 저장 실패: ' + error.message);
}
function chain(next: any) {
  const p = fetch(env('SUPABASE_URL') + '/functions/v1/content-check', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-cron-key': CRON_KEY }, body: JSON.stringify(next) }).catch(() => null);
  try { EdgeRuntime.waitUntil(p); } catch { /* 로컬 */ }
}
async function stepEvents(T: string, reports: any[], log: string[]) {
  let ev = await getContent('events');
  if (!ev) { try { ev = await (await fetch(SITE + 'events.json?' + Date.now())).json(); } catch { ev = { events: [] }; } }
  const events: any[] = Array.isArray(ev.events) ? ev.events : [];
  const live = events.filter((e) => !e.end || e.end >= T);
  const ended = events.filter((e) => e.end && e.end < T && !e.closed);
  ended.forEach((e) => (e.closed = true));
  log.push(`이벤트: 진행 ${live.length} · 오늘 종료 처리 ${ended.length}`);
  const news = (await Promise.all(['나라사랑카드 이벤트', '국군장병 할인 이벤트', '군인 장병 캐시백 이벤트', '장병 혜택 이벤트 기간'].map((q) => naver('news', q, 10).catch(() => [])))).flat();
  const seen = new Set<string>(); const uniq = news.filter((n) => !seen.has(n.url) && seen.add(n.url)).slice(0, 28);
  let added = 0;
  if (uniq.length) {
    const found = await groq(`너는 한국 군 장병 대상 혜택 이벤트를 정리하는 편집자야. 오늘은 ${T}.
뉴스 목록에서 '지금 진행 중이거나 곧 시작하는' 장병·군인 대상 이벤트만 골라. 이미 있는 이벤트(existing)와 같은 건 빼.
기간(시작·종료일)이 기사에 분명히 있는 것만 넣고, 날짜는 YYYY-MM-DD. 종료일이 오늘보다 이전이면 빼.
JSON 으로만: {"events":[{"title":"","org":"","benefit":"","target":"","start":"","end":"","note":"","url":""}]}`,
      JSON.stringify({ existing: events.map((e) => e.title), news: uniq.map((n) => ({ t: n.title, d: n.desc.slice(0, 160), u: n.url, p: n.date })) }));
    const add = (found.events ?? []).filter((e: any) => e && e.title && e.end && e.end >= T && /^\d{4}-\d{2}-\d{2}$/.test(e.end) && !events.some((x) => x.title === e.title || (e.url && x.url === e.url)));
    add.forEach((e: any) => { e.auto = true; e.added = T; events.push(e); });
    if (add.length) reports.push({ kind: 'new_event', title: `새 혜택 이벤트 ${add.length}개를 자동으로 추가했어요`, detail: add });
    added = add.length; log.push(`새 이벤트 ${add.length}`);
  }
  // 매일 확인했으니 '마지막 업데이트' 날짜를 오늘로 바꿔요
  const { error: ue } = await db.from('app_content').upsert({ key: 'events', data: { ...ev, events, updated: T }, updated_at: new Date().toISOString(), updated_by: 'auto' });
  log.push(ue ? '이벤트 저장 실패: ' + ue.message : '업데이트 날짜 ' + T);
}
async function buildChecks(T: string) {
  const checks: { kind: string; name: string; query: string; ours: any }[] = [];
  const cards = await getContent('cards');
  for (const c of Array.isArray(cards) ? cards : []) if (!/중단/.test(c.tag ?? '')) checks.push({ kind: 'card', name: c.n, query: `${c.n} 혜택 ${T.slice(0, 4)}`, ours: c.items });
  const sav = await getContent('savings');
  for (const b of Array.isArray(sav) ? sav : []) checks.push({ kind: 'savings', name: `${b.n} 장병내일준비적금`, query: `${b.n}은행 장병내일준비적금 우대금리`, ours: { 기본금리: b.b, 최고금리: b.max, 우대조건: b.o } });
  const ev = await getContent('events'); const events: any[] = ev && Array.isArray(ev.events) ? ev.events : [];
  for (const e of events.filter((e) => !e.closed && !e.auto && (!e.end || e.end >= T)).slice(0, 8)) checks.push({ kind: 'event', name: e.title, query: e.title, ours: { 기간: `${e.start} ~ ${e.end}`, 혜택: e.benefit, 대상: e.target } });
  return checks;
}
async function sendMail(T: string, reports: any[], log: string[]) {
  if (!RESEND || !reports.length) return;
  const html = `<div style="font-family:sans-serif;max-width:640px">
<h2 style="margin:0 0 4px">짬타이거 자동 점검 결과 (${T})</h2><p style="color:#8B95A1;margin:0 0 18px">앱 관리자 화면 → 점검 결과에서도 볼 수 있어요.</p>
${reports.map((r) => `<div style="border:1px solid #E5E8EB;border-radius:12px;padding:14px;margin-bottom:12px"><b>${esc(r.title)}</b>
${(r.detail ?? []).map((i: any) => r.kind === 'new_star'
  ? `<div style="margin-top:8px;font-size:13px">• <b>${esc(i.n)}</b> (${esc(i.g)}) ${esc(i.t)} · 입대 ${esc(i.e)} → 전역 예정 ${esc(i.d)} · 확인 ${esc(i.votes)}/5</div>`
  : r.kind === 'new_event'
  ? `<div style="margin-top:8px;font-size:13px">• <b>${esc(i.title)}</b> (${esc(i.org)}) ${esc(i.start)} ~ ${esc(i.end)}<br>${esc(i.benefit)} <a href="${esc(i.url)}">출처</a></div>`
  : `<div style="margin-top:8px;font-size:13px">• <b>${esc(i.item)}</b><br>앱: ${esc(i.ours)}<br>검색: ${esc(i.found)}<br><b style="color:#D94867">수정: ${esc(i.fix)}</b> <a href="${esc(i.source)}">근거</a></div>`).join('')}</div>`).join('')}</div>`;
  const m = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${RESEND}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: MAIL_FROM, to: [MAIL_TO], subject: `[짬타이거] 수정이 필요한 내용 ${reports.length}건 (${T})`, html }),
  });
  log.push('메일 ' + (m.ok ? '보냄' : '실패 ' + m.status));
}

// ================= MY스타: 새로 입대한 스타 찾기 (5번 교차 확인) =================
const SVC_M: Record<string, number> = { army: 18, band: 18, marine: 18, navy: 20, airforce: 21, social: 21 };
function addMonths(d: string, m: number) { const x = new Date(d + 'T00:00:00Z'); x.setUTCMonth(x.getUTCMonth() + m); x.setUTCDate(x.getUTCDate() - 1); return x.toISOString().slice(0, 10); }
function sid(name: string, group: string) { let h = 0; for (const ch of name + '|' + group) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 'a_' + h.toString(36); }
const wait = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
async function checkStars(T: string, reports: any[], log: string[]) {
  // 현재 목록: 앱 기본 목록(stars.js) + 자동 추가 목록
  let baseNames: string[] = [];
  try { const txt = await (await fetch(SITE + 'stars.js?' + Date.now())).text(); baseNames = [...txt.matchAll(/\['[a-z0-9_]+', '([^']+)', '([^']*)'/g)].map((m) => m[1] + '|' + m[2]); } catch { /* 무시 */ }
  const extra: any[] = (await getContent('stars')) ?? [];
  const known = new Set([...baseNames.map((x) => x.split('|')[0]), ...extra.map((x) => x.n)]);

  // 1차: 뉴스에서 입대 소식 모으기
  const qs = ['연예인 입대', '아이돌 현역 입대', '배우 입대 훈련소', '사회복무요원 복무 시작 아이돌', '해병대 입대 가수', '군악대 입대 아이돌', '상무 입대 선수', '입대 앞두고 팬들에게'];
  const news = (await Promise.all(qs.map((q) => naver('news', q, 10).catch(() => [])))).flat();
  const seen = new Set<string>(); const uniq = news.filter((n) => !seen.has(n.url) && seen.add(n.url)).slice(0, 40);
  if (!uniq.length) { log.push('스타: 뉴스 없음'); return; }
  const ext = await groq(`너는 한국 연예인·운동선수의 군 입대 정보를 정리하는 꼼꼼한 기자야. 오늘은 ${T}.
뉴스에서 '입대일이 날짜로 분명히 나온' 한국 스타만 뽑아. 입대일은 오늘 기준 1년 전 ~ 60일 후 사이만.
이미 목록에 있는 사람(known)은 빼. 추측 금지. 날짜가 애매하면 빼.
cat: idol(아이돌)/singer(가수)/actor(배우)/sports(운동선수)/creator(인플루언서·유튜버)
svc: army(육군 현역)/band(군악대)/marine(해병대)/navy(해군)/airforce(공군)/social(사회복무요원)
JSON 으로만: {"stars":[{"n":"이름","g":"그룹/소속(배우면 '배우')","cat":"","e":"YYYY-MM-DD","svc":"","d":"전역일 기사에 있으면 YYYY-MM-DD 없으면 빈칸"}]}`,
    JSON.stringify({ known: [...known], news: uniq.map((n) => ({ t: n.title, d: String(n.desc).slice(0, 140), p: n.date })) }));
  const cands = (ext.stars ?? []).filter((c: any) => c && c.n && /^\d{4}-\d{2}-\d{2}$/.test(c.e) && !known.has(c.n) && SVC_M[c.svc]).slice(0, 4);
  log.push(`스타 후보 ${cands.length}`);

  // 2차는 후보 한 명씩 따로 실행해요 (시간 제한 때문에)
  const { error: qe } = await db.from('app_content').upsert({ key: 'star_queue', data: { day: T, cands }, updated_at: new Date().toISOString(), updated_by: 'auto' });
  if (qe) { log.push('DB 저장 실패: ' + qe.message); return; }
  if (cands.length) { chain({ mode: 'star_verify', idx: 0, run: RUN_ID }); log.push(`후보 ${cands.length}명 교차 확인은 뒤에서 이어서 진행돼요`); } else log.push('스타 확인 완료');
}
async function verifyStar(idx: number, T: string, reports: any[], log: string[]): Promise<boolean> {
  const q0 = await getContent('star_queue'); const cands: any[] = q0?.cands ?? [];
  const c = cands[idx]; if (!c) return false;
  const extra: any[] = (await getContent('stars')) ?? [];
  if (extra.some((x) => x.n === c.n)) return idx + 1 < cands.length;
  const probes = [`${c.n} 입대`, `${c.n} 입소`, `${c.n} ${c.g} 군 복무`, `${c.n} 전역 예정`, `${c.n} ${c.e.slice(0, 7).replace('-', '년 ')}월 입대`];
  let votes = 0; const dVotes: Record<string, number> = {};
  for (const q of probes) {
    const ev = await search(q);
    if (!ev.length) continue;
    const v = await groq(`검색 결과만 근거로 판단해. 질문: "${c.n}"(${c.g})이(가) ${c.e}에 입대(또는 복무 시작)했거나 할 예정인가?
JSON 으로만: {"confirmed":true/false,"enlist":"근거상 입대일 YYYY-MM-DD 또는 빈칸","svc":"army/band/marine/navy/airforce/social 또는 빈칸","discharge":"근거상 전역(소집해제) 예정일 YYYY-MM-DD 또는 빈칸"}`,
      JSON.stringify(ev.slice(0, 8).map((x: any) => ({ t: x.title, d: String(x.desc).slice(0, 160), p: x.date }))));
    if (v.confirmed === true && v.enlist === c.e) { votes++; if (/^\d{4}-\d{2}-\d{2}$/.test(v.discharge || '')) dVotes[v.discharge] = (dVotes[v.discharge] || 0) + 1; }
  }
  if (votes >= 4) {
    const dTop = Object.entries(dVotes).sort((a, b) => b[1] - a[1])[0];
    const d = dTop && dTop[1] >= 2 ? dTop[0] : (/^\d{4}-\d{2}-\d{2}$/.test(c.d || '') ? c.d : addMonths(c.e, SVC_M[c.svc]));
    const row = { id: sid(c.n, c.g || ''), n: c.n, g: c.g || '', c: ['idol', 'singer', 'actor', 'sports', 'creator'].includes(c.cat) ? c.cat : 'idol', e: c.e, d, t: c.svc, auto: true, added: T, votes };
    extra.push(row);
    const { error } = await db.from('app_content').upsert({ key: 'stars', data: extra, updated_at: new Date().toISOString(), updated_by: 'auto' });
    if (error) log.push('DB 저장 실패: ' + error.message);
    reports.push({ kind: 'new_star', title: `새로 입대한 스타 ${row.n}을(를) 자동으로 추가했어요`, detail: [row] });
    log.push(`${c.n}: 확인 ${votes}/5 → 추가`);
  } else log.push(`${c.n}: 확인 ${votes}/5 (보류)`);
  return idx + 1 < cands.length;
}
