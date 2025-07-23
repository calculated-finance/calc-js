import { createFileRoute } from "@tanstack/react-router";
import { ReactFlowProvider } from "@xyflow/react";
import CreateStrategy from "./create";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <ReactFlowProvider>
      <CreateStrategy />
    </ReactFlowProvider>
  );
}
