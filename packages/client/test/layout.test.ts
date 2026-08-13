import type { Action, Strategy } from "@template/domain/calc";
import { describe, expect, it } from "vitest";
import { CHILD_OFFSET_X, MULTI_CHILD_OFFSET_X, NODE_HEIGHT, NODE_SPACING, NODE_WIDTH } from "../src/lib/layout/constants";
import { actionKeyOf } from "../src/lib/layout/layout";
import { layoutStrategy } from "../src/lib/layout/layout-strategy";

// Layout only reads structure (ids and the action tree), never the schema
// payloads, so fixtures carry the minimum shape.
const swapAction = (id: string) => ({ id, swap: {} }) as unknown as Action;
const scheduleAction = (id: string, child?: Action) => ({ id, schedule: { action: child } }) as unknown as Action;
const manyAction = (id: string, children: Action[]) => ({ id, many: children }) as unknown as Action;

const strategyWith = (action?: Action): Strategy =>
  ({
    id: "strategy-1",
    chainId: "thorchain",
    label: "Test",
    status: "draft",
    action,
  }) as unknown as Strategy;

const context = { startX: 0, startY: 0, nodeSpacing: NODE_SPACING };
const noop = () => undefined;

describe("actionKeyOf", () => {
  it("identifies each action variant", () => {
    expect(actionKeyOf(swapAction("a"))).toBe("swap");
    expect(actionKeyOf(manyAction("a", []))).toBe("many");
    expect(actionKeyOf(scheduleAction("a"))).toBe("schedule");
    expect(actionKeyOf({ id: "a", distribute: {} } as unknown as Action)).toBe("distribute");
  });
});

describe("layoutStrategy", () => {
  it("lays out a bare strategy as a single node", () => {
    const layout = layoutStrategy({ strategy: strategyWith(), update: noop }, context);

    expect(layout.nodes).toHaveLength(1);
    expect(layout.nodes[0]).toMatchObject({ type: "strategyNode", position: { x: 0, y: 0 } });
    expect(layout.edges).toHaveLength(0);
    expect(layout.bounds).toEqual({ width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  it("chains strategy -> schedule -> swap left to right", () => {
    const strategy = strategyWith(scheduleAction("sched", swapAction("swap")));
    const layout = layoutStrategy({ strategy, update: noop }, context);

    const byId = Object.fromEntries(layout.nodes.map((node) => [node.id, node]));

    expect(layout.nodes).toHaveLength(3);
    expect(byId.sched.position.x).toBe(CHILD_OFFSET_X);
    expect(byId.swap.position.x).toBe(CHILD_OFFSET_X * 2);
    expect(byId.sched.position.y).toBe(byId.swap.position.y);

    expect(layout.edges.map((edge) => [edge.source, edge.target])).toEqual(
      expect.arrayContaining([
        ["strategy-1", "sched"],
        ["sched", "swap"],
      ]),
    );
  });

  it("fans a group out to a wider column and stacks children with spacing", () => {
    const strategy = strategyWith(manyAction("group", [swapAction("one"), swapAction("two")]));
    const layout = layoutStrategy({ strategy, update: noop }, context);

    const byId = Object.fromEntries(layout.nodes.map((node) => [node.id, node]));

    expect(byId.one.position.x).toBe(CHILD_OFFSET_X + MULTI_CHILD_OFFSET_X);
    expect(byId.two.position.x).toBe(CHILD_OFFSET_X + MULTI_CHILD_OFFSET_X);
    expect(byId.two.position.y - byId.one.position.y).toBe(NODE_HEIGHT + NODE_SPACING);

    // container vertically centred on its children
    const centre = (byId.one.position.y + byId.two.position.y + NODE_HEIGHT) / 2;
    expect(byId.group.position.y + NODE_HEIGHT / 2).toBe(centre);

    expect(layout.edges.map((edge) => [edge.source, edge.target])).toEqual(
      expect.arrayContaining([
        ["group", "one"],
        ["group", "two"],
      ]),
    );
  });

  it("keeps a single-child group at the narrow offset", () => {
    const strategy = strategyWith(manyAction("group", [swapAction("only")]));
    const layout = layoutStrategy({ strategy, update: noop }, context);

    const only = layout.nodes.find((node) => node.id === "only");
    expect(only?.position.x).toBe(CHILD_OFFSET_X * 2);
  });

  it("wires child updates back through the parent action", () => {
    const updates: Strategy[] = [];
    const strategy = strategyWith(manyAction("group", [swapAction("one"), swapAction("two")]));
    const layout = layoutStrategy(
      {
        strategy,
        update: (updated) => {
          updates.push(updated);
        },
      },
      context,
    );

    const child = layout.nodes.find((node) => node.id === "one");
    const data = child?.data as { remove: () => void };
    data.remove();

    expect(updates).toHaveLength(1);
    const updatedAction = updates[0].action as unknown as { many: { id: string }[] };
    expect(updatedAction.many.map((a) => a.id)).toEqual(["two"]);
  });
});
