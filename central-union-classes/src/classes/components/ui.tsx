import { useEffect, useState, type ReactNode } from "react";
import { CAT_ICON } from "../constants";
import type { CourseData, LessonType } from "../types";
import { coverBg } from "../utils";
import { Icon } from "./Icon";

export function Ring({
  pct,
  size = 110,
  stroke = 10,
  color = "var(--gold-bright)",
  children,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(pct), 60);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} className="ring" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, shown)) / 100}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Bar({ pct, kind }: { pct: number; kind?: "gold" | "good" }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 50);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div
      className={`bar ${kind ?? ""}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <i style={{ width: `${w}%` }} />
    </div>
  );
}

const TYPE_LABEL: Record<LessonType, [string, string]> = {
  video: ["play", "Video"],
  pdf: ["file", "PDF"],
  text: ["text", "Reading"],
};

export function TypeBadge({ type }: { type: LessonType }) {
  const [ic, label] = TYPE_LABEL[type] ?? TYPE_LABEL.text;
  return (
    <span className={`type-badge t-${type || "text"}`}>
      <Icon n={ic} s={12} w={2.5} />
      {label}
    </span>
  );
}

export function Cover({
  course,
  height,
  className,
  children,
}: {
  course: Pick<CourseData, "category" | "hue">;
  height?: string;
  className?: string;
  children?: ReactNode;
}) {
  const ic = CAT_ICON[course.category] ?? "book";
  return (
    <div className={className || "cover"} style={{ background: coverBg(course.hue), height }}>
      <div className="cover-ico">
        <Icon n={ic} s={120} w={1.4} />
      </div>
      {children}
    </div>
  );
}

export function Skeletons({ count = 3 }: { count?: number }) {
  return (
    <div className="grid">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skel" />
      ))}
    </div>
  );
}

/* Simple, safe text format: "# Heading", "- bullet", blank line = paragraph, **bold** */
function inline(text: string, k: string): ReactNode[] {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .map((p, i) =>
      p.startsWith("**") && p.endsWith("**") && p.length > 4 ? (
        <strong key={`${k}-${i}`}>{p.slice(2, -2)}</strong>
      ) : (
        p
      ),
    );
}

export function RichText({ body }: { body: string }) {
  const lines = String(body || "")
    .replace(/\r/g, "")
    .split("\n");
  const out: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushP = () => {
    if (para.length) {
      const k = `p${out.length}`;
      out.push(<p key={k}>{inline(para.join(" "), k)}</p>);
      para = [];
    }
  };
  const flushL = () => {
    if (list.length) {
      const k = `l${out.length}`;
      out.push(
        <ul key={k}>
          {list.map((t, i) => (
            <li key={i}>{inline(t, k + i)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushP();
      flushL();
      continue;
    }
    if (/^#{1,3}\s/.test(line)) {
      flushP();
      flushL();
      out.push(<h3 key={`h${out.length}`}>{line.replace(/^#{1,3}\s/, "")}</h3>);
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      flushP();
      list.push(line.slice(2));
      continue;
    }
    flushL();
    para.push(line);
  }
  flushP();
  flushL();
  return <div>{out}</div>;
}
