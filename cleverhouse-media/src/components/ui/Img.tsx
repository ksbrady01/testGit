import type { CSSProperties } from "react";
import imageLoader from "../../lib/imageLoader";
import clsx from "../../lib/clsx";

const WIDTHS = [384, 640, 828, 1080, 1280, 1600, 1920, 2560];

/**
 * Responsive image with the same props the site already uses.
 * - Unsplash images get a srcset resized by Unsplash's CDN (AVIF/WebP via auto=format).
 * - `fill` stretches the image over its positioned parent.
 * - `priority` loads eagerly with high fetch priority (above-the-fold art).
 */
export default function Img({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  priority,
  className,
  style,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const remote = src.startsWith("https://images.unsplash.com/");
  const srcSet = remote ? WIDTHS.map((w) => `${imageLoader({ src, width: w })} ${w}w`).join(", ") : undefined;
  const fillStyle: CSSProperties | undefined = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : undefined;
  return (
    <img
      src={remote ? imageLoader({ src, width: 1600 }) : src}
      srcSet={srcSet}
      sizes={remote ? sizes || "100vw" : undefined}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={clsx(className)}
      style={{ ...fillStyle, ...style }}
    />
  );
}
