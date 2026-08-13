import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The builder lives at /create (whose search params carry the shareable
 * strategy selection). Rendering CreateStrategy here as well would crash:
 * its Route.useSearch()/useNavigate() are bound to the /create match.
 */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- thrown redirects are TanStack Router's API
    throw redirect({ to: "/create" });
  },
});
