import { createFileRoute } from "@tanstack/react-router";
import { LeaderboardPage } from "../classes/pages/Leaderboard";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — Central Union Online Classes" }] }),
  component: LeaderboardPage,
});
