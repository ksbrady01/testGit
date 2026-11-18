import { Icon } from "../components/Icon";
import { useProfiles } from "../components/CourseBits";
import { Skeletons } from "../components/ui";
import { levelFor } from "../constants";
import { useApp } from "../state/AppProvider";
import type { LeaderRow } from "../types";
import { plural } from "../utils";

export function LeaderboardPage() {
  const { board, svc } = useApp();
  const ps = useProfiles(
    svc?.user,
    (board ?? []).map((r) => r.id),
  );
  const uid = svc?.uid;
  const nm = (id: string) => ps[id]?.name || (id === uid ? "You" : "Learner");
  const av = (id: string) => ps[id]?.avatarUrl;
  if (!board) return <Skeletons count={1} />;

  const top = board.slice(0, 3);
  const [first, second, third] = top;
  const podium: LeaderRow[] = first && second && third ? [second, first, third] : [];
  const avatar = (id: string) => {
    const src = av(id);
    return src ? (
      <img className="av" src={src} alt="" />
    ) : (
      <div className="av" style={{ background: "var(--surface-2)" }} />
    );
  };

  return (
    <div className="page">
      <div className="section-h" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">Community</div>
          <h1>Leaderboard</h1>
        </div>
        <span className="small muted">Ranked by XP earned</span>
      </div>
      {!board.length ? (
        <div className="card empty">
          <div className="ico-wrap">
            <Icon n="trophy" s={28} />
          </div>
          <h3>No one on the board yet</h3>
          <p className="muted">Complete a lesson to claim the first spot.</p>
        </div>
      ) : (
        <>
          {podium.length ? (
            <div className="podium">
              {podium.map((r) => {
                const rank = board.indexOf(r) + 1;
                return (
                  <div
                    key={r.id}
                    className={`card pod rise p${rank}`}
                    style={{ animationDelay: `${rank * 90}ms` }}
                  >
                    <div
                      className="lb-rank"
                      style={{ color: rank === 1 ? "var(--gold)" : "var(--muted)" }}
                    >
                      {rank === 1 ? <Icon n="trophy" s={22} /> : `#${rank}`}
                    </div>
                    {avatar(r.id)}
                    <b className="small">{nm(r.id)}</b>
                    <span className="lvl-pill">
                      Lv {levelFor(r.xp).n} · {r.xp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}
          <div className="card">
            {board.map((r, i) => (
              <div
                key={r.id}
                className={`lb-row${i === 0 ? " top1" : ""}${r.id === uid ? " me" : ""}`}
              >
                <div className="lb-rank num">{i + 1}</div>
                <div className="row" style={{ gap: "12px", minWidth: 0 }}>
                  {avatar(r.id)}
                  <div style={{ minWidth: 0 }}>
                    <b>{nm(r.id)}</b>
                    <div className="tiny muted">
                      {levelFor(r.xp).name} · {plural(r.completed ?? 0, "class")} completed
                    </div>
                  </div>
                </div>
                <div className="num" style={{ fontWeight: 700 }}>
                  {r.xp} XP
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
