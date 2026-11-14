import Link from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import clsx from "@/lib/clsx";
import { Magnetic } from "@/components/motion/Motion";

type Variant = "copper" | "ghost" | "dark" | "ghost-dark";

export function Button({
  href,
  children,
  variant = "copper",
  className,
  magnetic = true,
  icon = true,
  type,
  onClick,
  disabled,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  icon?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = clsx("btn", `btn-${variant}`, disabled && "pointer-events-none opacity-60", className);
  const inner = (
    <>
      <span className="relative">{children}</span>
      {icon && (
        <span className="btn-icon" aria-hidden="true">
          <ArrowUpRight size={16} strokeWidth={2} />
        </span>
      )}
    </>
  );
  const el = href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type={type || "button"} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
  return magnetic ? <Magnetic strength={0.25}>{el}</Magnetic> : el;
}

export function Eyebrow({ children, className, dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return <p className={clsx("label label-dot", dark ? "text-copper-700" : "text-copper-300", className)}>{children}</p>;
}

export function IndexTag({ n, className }: { n: string; className?: string }) {
  return <span className={clsx("font-mono text-xs tracking-[0.2em] text-copper-400", className)}>({n})</span>;
}
