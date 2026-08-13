import type { Action, Condition, Node } from "@template/domain/calc";
import { describe, expect, it } from "vitest";
import {
  appendAfter,
  appendNode,
  nodeIndex,
  outgoingEdges,
  primaryNext,
  removeNode,
  replaceNodeBody,
  tailIndex,
} from "../src/lib/graph";

// Graph helpers only read structure, never the payloads.
const swap = { swap: {} } as unknown as Action;
const distribute = { distribute: {} } as unknown as Action;
const schedule = { schedule: {} } as unknown as Condition;

const actionNode = (index: number, next: number | null = null): Node => ({
  action: { action: swap, index, next },
});
const conditionNode = (index: number, onSuccess: number | null = null, onFailure: number | null = null): Node => ({
  condition: { condition: schedule, index, on_success: onSuccess, on_failure: onFailure },
});

describe("tailIndex", () => {
  it("is undefined for an empty graph", () => {
    expect(tailIndex([])).toBeUndefined();
  });

  it("follows the primary path to its end", () => {
    const nodes = [conditionNode(0, 1), actionNode(1, 2), actionNode(2)];
    expect(tailIndex(nodes)).toBe(2);
  });

  it("is undefined when the primary path loops", () => {
    const nodes = [conditionNode(0, 1), actionNode(1, 0)];
    expect(tailIndex(nodes)).toBeUndefined();
  });
});

describe("appendNode", () => {
  it("creates the entry node in an empty graph", () => {
    const nodes = appendNode([], { action: swap });
    expect(nodes).toHaveLength(1);
    expect(nodeIndex(nodes[0])).toBe(0);
    expect(primaryNext(nodes[0])).toBeUndefined();
  });

  it("links the tail's primary slot to the new node", () => {
    const nodes = appendNode([conditionNode(0)], { action: swap });
    expect(nodes).toHaveLength(2);
    expect(primaryNext(nodes[0])).toBe(1);
    expect(nodeIndex(nodes[1])).toBe(1);
  });
});

describe("appendAfter", () => {
  it("links a branch node that is not the global tail", () => {
    // 0 succeeds into 1; appending after 0's failure-free sibling 1 keeps 0 intact.
    const nodes = [conditionNode(0, 1, null), actionNode(1)];
    const appended = appendAfter(nodes, 0, { action: distribute });

    // 0's primary (on_success) is overwritten to the new node.
    expect(primaryNext(appended[0])).toBe(2);
    expect(appended).toHaveLength(3);
  });
});

describe("removeNode", () => {
  it("bypasses pointers through the removed node and renumbers", () => {
    // 0 -> 1 -> 2; removing 1 gives 0 -> (old 2, now 1)
    const nodes = [conditionNode(0, 1), actionNode(1, 2), actionNode(2)];
    const removed = removeNode(nodes, 1);

    expect(removed).toHaveLength(2);
    expect(nodeIndex(removed[0])).toBe(0);
    expect(nodeIndex(removed[1])).toBe(1);
    expect(primaryNext(removed[0])).toBe(1);
    expect(primaryNext(removed[1])).toBeUndefined();
  });

  it("clears pointers when the removed node had no next", () => {
    const nodes = [conditionNode(0, 1), actionNode(1)];
    const removed = removeNode(nodes, 1);

    expect(removed).toHaveLength(1);
    expect(primaryNext(removed[0])).toBeUndefined();
  });

  it("remaps failure branches too", () => {
    // 0: success -> 1, failure -> 2
    const nodes = [conditionNode(0, 1, 2), actionNode(1), actionNode(2)];
    const removed = removeNode(nodes, 1);

    expect(removed).toHaveLength(2);
    const edges = outgoingEdges(removed[0]);
    expect(edges).toEqual([{ target: 1, kind: "failure" }]);
  });
});

describe("replaceNodeBody", () => {
  it("keeps wiring when the kind is unchanged", () => {
    const nodes = [conditionNode(0, 1, null), actionNode(1)];
    const replaced = replaceNodeBody(nodes, 0, { condition: schedule });
    expect(outgoingEdges(replaced[0])).toEqual([{ target: 1, kind: "success" }]);
  });

  it("carries the primary pointer across a kind change", () => {
    const nodes = [conditionNode(0, 1, null), actionNode(1)];
    const replaced = replaceNodeBody(nodes, 0, { action: swap });
    expect(outgoingEdges(replaced[0])).toEqual([{ target: 1, kind: "next" }]);
  });
});
