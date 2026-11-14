export const LEVELS = [
  { name: "Newcomer", xp: 0 }, { name: "Seeker", xp: 100 }, { name: "Learner", xp: 250 },
  { name: "Disciple", xp: 500 }, { name: "Servant", xp: 900 }, { name: "Steward", xp: 1400 },
  { name: "Shepherd", xp: 2100 }, { name: "Elder", xp: 3000 }
];

export function levelFor(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) idx = i;
  const cur = LEVELS[idx], next = LEVELS[idx + 1];
  const pct = next ? Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100) : 100;
  return { idx, n: idx + 1, name: cur.name, next, pct, toNext: next ? next.xp - xp : 0 };
}
