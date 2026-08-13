import type { Action, Condition, Node, Strategy } from "@template/domain/calc";
import { describe, expect, it } from "vitest";
import { CHILD_OFFSET_X, NODE_HEIGHT, NODE_SPACING, NODE_WIDTH } from "../src/lib/layout/constants";
import { graphNodeType } from "../src/lib/layout/layout";
import { layoutStrategy } from "../src/lib/layout/layout-strategy";

// Layout only reads structure (indexes and pointers), never the schema
// payloads, so fixtures carry the minimum shape.
const swap = { swap: {} } as unknown as Action;
const schedule = { schedule: {} } as unknown as Condition;
const balance = { balance_available: {} } as unknown as Condition;

const swapNode = (index: number, next: number | null = null): Node => ({
  action: { action: swap, index, next },
});
const scheduleNode = (index: number, onSuccess: number | null = null, onFailure: number | null = null): Node => ({
  condition: { condition: schedule, index, on_success: onSuccess, on_failure: onFailure },
});
const balanceNode = (index: number, onSuccess: number | null = null, onFailure: number | null = null): Node => ({
  condition: { condition: balance, index, on_success: onSuccess, on_failure: onFailure },
});

const strategyWith = (nodes: Node[]): Strategy =>
  ({
    id: "strategy-1",
    chainId: "thorchain",
    label: "Test",
    status: "draft",
    nodes,
  }) as unknown as Strategy;

const context = { startX: 0, startY: 0, nodeSpacing: NODE_SPACING };
const noop = () => undefined;

describe("graphNodeType", () => {
  it("maps each node kind to its component type", () => {
    expect(graphNodeType(swapNode(0))).toBe("swapNode");
    expect(graphNodeType(scheduleNode(0))).toBe("scheduleNode");
    expect(graphNodeType(balanceNode(0))).toBe("conditionNode");
    expect(graphNodeType({ action: { action: { distribute: {} } as unknown as Action, index: 0 } })).toBe(
      "distributeNode",
    );
    expect(graphNodeType({ action: { action: { limit_order: {} } as unknown as Action, index: 0 } })).toBe(
      "limitOrderNode",
    );
  });
});

describe("layoutStrategy", () => {
  it("lays out a bare strategy as a single node", () => {
    const layout = layoutStrategy({ strategy: strategyWith([]), update: noop }, context);

    expect(layout.nodes).toHaveLength(1);
    expect(layout.nodes[0]).toMatchObject({ type: "strategyNode", position: { x: 0, y: 0 } });
    expect(layout.edges).toHaveLength(0);
    expect(layout.bounds).toEqual({ width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  it("chains strategy -> schedule -> swap left to right", () => {
    const strategy = strategyWith([scheduleNode(0, 1), swapNode(1)]);
    const layout = layoutStrategy({ strategy, update: noop }, context);

    const byId = Object.fromEntries(layout.nodes.map((node) => [node.id, node]));

    expect(layout.nodes).toHaveLength(3);
    expect(byId["strategy-1:0"].position.x).toBe(CHILD_OFFSET_X);
    expect(byId["strategy-1:1"].position.x).toBe(CHILD_OFFSET_X * 2);
    expect(byId["strategy-1:0"].position.y).toBe(byId["strategy-1:1"].position.y);

    expect(layout.edges.map((edge) => [edge.source, edge.target])).toEqual(
      expect.arrayContaining([
        ["strategy-1", "strategy-1:0"],
        ["strategy-1:0", "strategy-1:1"],
      ]),
    );
  });

  it("stacks a condition's branches in the same next column", () => {
    const strategy = strategyWith([balanceNode(0, 1, 2), swapNode(1), swapNode(2)]);
    const layout = layoutStrategy({ strategy, update: noop }, context);

    const byId = Object.fromEntries(layout.nodes.map((node) => [node.id, node]));

    expect(byId["strategy-1:1"].position.x).toBe(CHILD_OFFSET_X * 2);
    expect(byId["strategy-1:2"].position.x).toBe(CHILD_OFFSET_X * 2);
    expect(byId["strategy-1:2"].position.y - byId["strategy-1:1"].position.y).toBe(NODE_HEIGHT + NODE_SPACING);

    // the condition stays level with its success branch; failure hangs below
    expect(byId["strategy-1:0"].position.y).toBe(byId["strategy-1:1"].position.y);

    const kinds = Object.fromEntries(layout.edges.map((edge) => [`${edge.source}>${edge.target}`, edge.style?.stroke]));
    expect(kinds["strategy-1:0>strategy-1:1"]).not.toBe(kinds["strategy-1:0>strategy-1:2"]);
  });

  it("drops an only-failure child a lane below the main row", () => {
    const strategy = strategyWith([balanceNode(0, null, 1), swapNode(1)]);
    const layout = layoutStrategy({ strategy, update: noop }, context);

    const byId = Object.fromEntries(layout.nodes.map((node) => [node.id, node]));

    expect(byId["strategy-1:1"].position.y - byId["strategy-1:0"].position.y).toBe(NODE_HEIGHT + NODE_SPACING);
  });

  it("routes failure edges through the bottom handle and flags the node", () => {
    const strategy = strategyWith([balanceNode(0, null, 1), swapNode(1)]);
    const layout = layoutStrategy({ strategy, update: noop }, context);

    const head = layout.nodes.find((node) => node.id === "strategy-1:0");
    expect((head?.data as { hasFailure: boolean }).hasFailure).toBe(true);
    expect((head?.data as { hasOutgoing: boolean }).hasOutgoing).toBe(false);
    // primary slot still empty, so chain-building stays available
    expect((head?.data as { addNext?: unknown }).addNext).toBeTypeOf("function");

    const failureEdge = layout.edges.find((edge) => edge.id === "strategy-1:0-to-strategy-1:1");
    expect(failureEdge?.sourceHandle).toBe("failure");
  });

  it("renders a loop as an edge without re-laying the target", () => {
    // 0 -> 1, 1 loops back to 0.
    const strategy = strategyWith([scheduleNode(0, 1), swapNode(1, 0)]);
    const layout = layoutStrategy({ strategy, update: noop }, context);

    // strategy root + two graph nodes, no duplicates
    expect(layout.nodes).toHaveLength(3);
    expect(layout.edges.map((edge) => [edge.source, edge.target])).toEqual(
      expect.arrayContaining([
        ["strategy-1:0", "strategy-1:1"],
        ["strategy-1:1", "strategy-1:0"],
      ]),
    );
  });

  it("wires node removal back through the strategy update", () => {
    const updates: Strategy[] = [];
    const strategy = strategyWith([scheduleNode(0, 1), swapNode(1)]);
    const layout = layoutStrategy(
      {
        strategy,
        update: (updated) => {
          updates.push(updated);
        },
      },
      context,
    );

    const child = layout.nodes.find((node) => node.id === "strategy-1:1");
    const data = child?.data as { remove: () => void };
    data.remove();

    expect(updates).toHaveLength(1);
    expect(updates[0].nodes).toHaveLength(1);
    expect(updates[0].nodes[0]).toMatchObject({ condition: { index: 0, on_success: null } });
  });

  it("exposes addNext only on nodes with an empty primary slot", () => {
    const strategy = strategyWith([scheduleNode(0, 1), swapNode(1)]);
    const layout = layoutStrategy({ strategy, update: noop }, context);

    const head = layout.nodes.find((node) => node.id === "strategy-1:0");
    const tail = layout.nodes.find((node) => node.id === "strategy-1:1");

    expect((head?.data as { addNext?: unknown }).addNext).toBeUndefined();
    expect((tail?.data as { addNext?: unknown }).addNext).toBeTypeOf("function");
  });
});
