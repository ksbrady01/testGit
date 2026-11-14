// Saved serving profiles, so people can come back later and find theirs by email.
// Stored in Netlify Blobs under a SHA-256 hash of the email (the raw email is never the key).
// Only what's needed to redraw the profile is kept: first name, answer IDs, skills note, date.
import { getStore } from '@netlify/blobs';
import { createHash } from 'node:crypto';

const ALLOWED = {
  enjoy: ['teach', 'encourage', 'welcome', 'organize', 'lead', 'behind', 'practical', 'faith', 'give', 'media', 'tech', 'hands'],
  gifts: ['teaching', 'encouragement', 'service', 'hospitality', 'leadership', 'administration', 'mercy', 'giving', 'evangelism', 'discovering'],
  ministries: ['greeter', 'worship', 'tech', 'usher', 'baptism', 'connection', 'youth', 'grief', 'outreach', 'fit'],
  freq: ['weekly', 'twice', 'monthly', 'events', 'unsure'],
};

const store = () => getStore({ name: 'mysteps-profiles', consistency: 'strong' });
const keyFor = (email) => createHash('sha256').update((process.env.PROFILE_SALT || 'mysteps') + ':' + email.trim().toLowerCase()).digest('hex');
const pick = (list, allowed) => (Array.isArray(list) ? [...new Set(list.filter((x) => allowed.includes(x)))] : []);

export async function saveProfile(email, { name, ids, skills, followUp }) {
  const record = {
    v: 1,
    firstName: String(name || '').trim().split(/\s+/)[0].slice(0, 60),
    answers: {
      enjoy: pick(ids?.enjoy, ALLOWED.enjoy),
      gifts: pick(ids?.gifts, ALLOWED.gifts).slice(0, 3),
      ministries: pick(ids?.ministries, ALLOWED.ministries),
      freq: ALLOWED.freq.includes(ids?.freq) ? ids.freq : 'unsure',
      followUp: followUp === 'yes' ? 'yes' : 'no',
      skills: typeof skills === 'string' ? skills.trim().slice(0, 500) : '',
    },
    date: new Date().toISOString(),
  };
  await store().setJSON(keyFor(email), record);
  return record;
}

export async function loadProfile(email) {
  return store().get(keyFor(email), { type: 'json' });
}
