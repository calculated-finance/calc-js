import { createFileRoute } from "@tanstack/react-router";
import CreateStrategy from "./create";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <CreateStrategy />;
}
