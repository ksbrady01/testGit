/* Site settings. Edit these, or set them as AI Studio environment variables. */

export const ORG = "Central Union Church of Christ";

/*
 * Email addresses that get editor rights: edit or delete any class and see the
 * Learners page. Comma-separated in VITE_ADMIN_EMAILS, or list them here.
 */
export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

/* Public URL of the app, used in "Share class" links. Defaults to the current page. */
export const APP_URL = import.meta.env.VITE_APP_URL || "";

/* Brand assets (served from /public/brand). */
const base = import.meta.env.BASE_URL || "/";
export const BRAND = {
  logo: base + "brand/logo.png",          // full logo, for dark backgrounds
  logoDeep: base + "brand/logo-deep.png", // deep-gold logo, for light backgrounds (certificates)
  emblem: base + "brand/emblem.png"       // cross + globe + Bible mark (header, favicon)
};
