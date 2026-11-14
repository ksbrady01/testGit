// Looks up a saved MySteps serving profile by email.
// Returns only what the page needs to redraw the profile: first name, answer IDs, skills note, date.
// Never returns the email, phone, or anything from Planning Center.
import { loadProfile } from '../lib/profiles.mjs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const config = { path: '/api/profile' };

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Use POST.' });
  let body;
  try { body = await req.json(); } catch { return json(400, { error: 'The request was not valid JSON.' }); }
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase().slice(0, 200) : '';
  if (!EMAIL_RE.test(email)) return json(400, { error: 'Enter an email like name@example.com.' });

  // Small fixed delay makes guessing many emails slow.
  await new Promise((r) => setTimeout(r, 400));

  try {
    const p = await loadProfile(email);
    if (!p) return json(404, { error: 'We couldn’t find a MySteps profile for that email.' });
    return json(200, { firstName: p.firstName, answers: p.answers, date: p.date });
  } catch (e) {
    console.error('MySteps profile lookup:', e.message);
    return json(500, { error: 'We couldn’t look up profiles right now. Please try again in a minute.' });
  }
};

function json(status, data) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
