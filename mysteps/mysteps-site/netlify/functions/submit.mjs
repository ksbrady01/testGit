// MySteps → Planning Center People.
// Receives a MySteps submission, finds or creates the person, saves their answers as a
// note, and (if they asked for follow-up) adds them to a follow-up workflow.
// Secrets live in Netlify environment variables, never in the page.
//
// Required env:  PCO_APP_ID, PCO_SECRET          (Planning Center personal access token)
//                PCO_NOTE_CATEGORY_ID            (note category for MySteps answers)
// Optional env:  PCO_WORKFLOW_ID                 (workflow for people who want follow-up)
//                ALLOWED_ORIGIN                  (e.g. https://www.yourchurch.org, if embedded elsewhere)

import { saveProfile } from '../lib/profiles.mjs';

const API = 'https://api.planningcenteronline.com/people/v2';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const config = { path: '/api/submit' };

export default async (req) => {
  const cors = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'Use POST.' }, cors);

  let body;
  try { body = await req.json(); } catch { return json(400, { error: 'The request was not valid JSON.' }, cors); }
  const a = body?.answers || {};

  // Honeypot: real people never fill this hidden field. Pretend success for bots.
  if (a.hp) return json(200, { ok: true }, cors);

  const name = clip(a.name, 120);
  const email = clip(a.email, 200).toLowerCase();
  const phone = clip(a.phone, 40);
  if (!name || !EMAIL_RE.test(email)) return json(400, { error: 'A name and a valid email are required.' }, cors);

  // Save the serving profile first so the person can find it later, even if Planning Center is down.
  try { await saveProfile(email, { name, ids: a.ids, skills: a.skills, followUp: a.followUp }); }
  catch (e) { console.error('MySteps: profile not saved:', e.message); }

  const { PCO_APP_ID, PCO_SECRET, PCO_NOTE_CATEGORY_ID, PCO_WORKFLOW_ID } = process.env;
  if (!PCO_APP_ID || !PCO_SECRET || !PCO_NOTE_CATEGORY_ID) {
    console.error('MySteps: missing PCO_APP_ID, PCO_SECRET or PCO_NOTE_CATEGORY_ID');
    return json(500, { error: 'MySteps is not connected to Planning Center yet. Please let the church office know.' }, cors);
  }
  const auth = 'Basic ' + Buffer.from(`${PCO_APP_ID}:${PCO_SECRET}`).toString('base64');

  const pco = async (path, init = {}) => {
    const r = await fetch(API + path, {
      ...init,
      headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json', ...(init.headers || {}) },
    });
    const text = await r.text();
    if (!r.ok) throw new Error(`Planning Center ${r.status} on ${init.method || 'GET'} ${path}: ${text.slice(0, 400)}`);
    return text ? JSON.parse(text) : null;
  };

  try {
    // 1. Find the person by email, or create them.
    let personId = await findPersonByEmail(pco, email);
    let created = false;
    if (!personId) {
      const [first, ...rest] = name.split(/\s+/);
      const attributes = { first_name: first };
      if (rest.length) attributes.last_name = rest.join(' ');
      const p = await pco('/people', { method: 'POST', body: JSON.stringify({ data: { type: 'Person', attributes } }) });
      personId = p.data.id;
      created = true;
      await pco(`/people/${personId}/emails`, { method: 'POST', body: JSON.stringify({ data: { type: 'Email', attributes: { address: email, location: 'Home', primary: true } } }) });
      if (phone) {
        await pco(`/people/${personId}/phone_numbers`, { method: 'POST', body: JSON.stringify({ data: { type: 'PhoneNumber', attributes: { number: phone, location: 'Mobile', primary: true } } }) })
          .catch((e) => console.warn('MySteps: phone not saved:', e.message));
      }
    }

    // 2. Save the answers as a note on their profile.
    await pco(`/people/${personId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ data: { type: 'Note', attributes: { note: noteText(a, body.matches, { name, email, phone }), note_category_id: PCO_NOTE_CATEGORY_ID } } }),
    });

    // 3. Follow-up requested → add a card to the follow-up workflow (non-fatal if it fails).
    let followUpCard = false;
    if (a.followUp === 'yes' && PCO_WORKFLOW_ID) {
      try {
        await pco(`/workflows/${PCO_WORKFLOW_ID}/cards`, {
          method: 'POST',
          body: JSON.stringify({ data: { type: 'WorkflowCard', attributes: { person_id: personId } } }),
        });
        followUpCard = true;
      } catch (e) {
        console.error('MySteps: workflow card failed:', e.message);
      }
    }

    return json(200, { ok: true, created, followUpCard }, cors);
  } catch (e) {
    console.error('MySteps:', e.message);
    return json(502, { error: 'Planning Center did not accept the submission. Please try again in a minute.' }, cors);
  }
};

async function findPersonByEmail(pco, email) {
  const r = await pco(`/emails?where[address]=${encodeURIComponent(email)}&per_page=5`);
  const hit = (r?.data || []).find((e) => (e.attributes?.address || '').toLowerCase() === email);
  const id = hit?.relationships?.person?.data?.id;
  if (id) return id;
  // Fallback: people search by email.
  const s = await pco(`/people?where[search_name_or_email]=${encodeURIComponent(email)}&per_page=2`);
  return s?.data?.length === 1 ? s.data[0].id : null;
}

function noteText(a, matches, who) {
  const list = (v) => (Array.isArray(v) ? v.map((x) => clip(x, 120)).filter(Boolean).slice(0, 15).join(', ') : '') || '—';
  const top = Array.isArray(matches) ? matches.slice(0, 3).map((m, i) => `${i + 1}. ${clip(m?.name, 80)} (${Number(m?.pct) || 0}% fit)`).join('\n') : '—';
  return [
    'MySteps: Discover Your Gifts & Find Your Place',
    `Submitted ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    '',
    `Contact: ${who.name} · ${who.email}${who.phone ? ' · ' + who.phone : ''}`,
    `Enjoys: ${list(a.enjoy)}`,
    `Spiritual gifts: ${list(a.gifts)}`,
    `Skills/interests: ${clip(a.skills, 600) || '—'}`,
    `Ministries to explore: ${list(a.ministries)}`,
    `Can serve: ${clip(a.freq, 40) || '—'}`,
    `Wants follow-up: ${a.followUp === 'yes' ? 'Yes' : 'No'}`,
    '',
    'MySteps recommended:',
    top,
  ].join('\n');
}

function clip(v, n) { return typeof v === 'string' ? v.trim().slice(0, n) : ''; }

function corsHeaders(req) {
  const allowed = process.env.ALLOWED_ORIGIN;
  const origin = req.headers.get('origin');
  if (!allowed || origin !== allowed) return {};
  return { 'Access-Control-Allow-Origin': allowed, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' };
}

function json(status, data, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}
