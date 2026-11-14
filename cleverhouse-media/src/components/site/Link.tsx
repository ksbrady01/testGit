import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Link as RouterLink } from "@tanstack/react-router";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/**
 * Internal link that accepts a plain `href` (the site's content is data-driven,
 * so paths are strings). Internal paths go through TanStack Router for
 * preloading; hashes, mailto and external URLs render a normal anchor.
 */
const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ href, children, ...rest }, ref) {
  const internal = href.startsWith("/") && !href.startsWith("//");
  if (!internal) {
    return (
      <a ref={ref} href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    // The router resolves literal paths (e.g. /work/ember-and-oak) against the
    // route tree at runtime; the cast only bridges string-typed content data.
    <RouterLink ref={ref} to={href as "/"} {...(rest as object)}>
      {children}
    </RouterLink>
  );
});

export default Link;
