/**
 * Image URL builder used by the Img component.
 * - Unsplash photos are resized and format-negotiated (AVIF/WebP) by Unsplash's own CDN.
 * - Local assets (logo files) are served as-is.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality || 72));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }
  return src;
}
