/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Comma-separated emails that can edit any class and see the Learners page. */
  readonly VITE_ADMIN_EMAILS?: string;
  /** Public site URL used in "Share class" links. Defaults to the current site. */
  readonly VITE_APP_URL?: string;
}
