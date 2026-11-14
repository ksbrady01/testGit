import Image from "@/components/ui/Img";
import clsx from "@/lib/clsx";

/**
 * Official CleverHouse Media logo (raster, extracted from the live site).
 * - variant "dark": original artwork (espresso wordmark) for light backgrounds
 * - variant "light": reverse version (espresso lettering set to bone, copper unchanged) for dark backgrounds
 * Replace /public/brand/*.png with the official vector (SVG) files when available.
 */
export function Logo({
  variant = "light",
  className,
  priority,
}: {
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === "light" ? "/brand/chm-logo-reverse.png" : "/brand/chm-logo.png"}
      alt="CleverHouse Media"
      width={1400}
      height={307}
      priority={priority}
      className={clsx("h-auto select-none", className)}
      sizes="(max-width: 768px) 180px, 240px"
    />
  );
}

export function LogoMark({ className, priority, alt = "" }: { className?: string; priority?: boolean; alt?: string }) {
  return (
    <Image
      src="/brand/chm-mark.png"
      alt={alt}
      width={600}
      height={678}
      priority={priority}
      className={clsx("h-auto select-none", className)}
      sizes="160px"
    />
  );
}
