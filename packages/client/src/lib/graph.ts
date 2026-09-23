import type { Action, ActionNode, Condition, Node } from "@template/domain/calc";

/**
 * Pure helpers over the v2 strategy graph: a flat list of nodes addressed by
 * `index`, linked by `next` (actions) and `on_success`/`on_failure`
 * (conditions). The builder maintains the invariant that a node's index
 * equals its array position; these helpers preserve it and repair it after
 * removals.
 */

/** A node minus its graph wiring — what the action picker produces. */
export type NodeBody = { action: Action } | { condition: Condition };

export const isActionNode = (node: Node): node is ActionNode => "action" in node;

export const nodeIndex = (node: Node): number => (isActionNode(node) ? node.action.index : node.condition.index);

/**
 * The pointer a node follows on the ordinary path: `next` for actions,
 * `on_success` for conditions.
 */
export const primaryNext = (node: Node): number | undefined => {
  const target = isActionNode(node) ? node.action.next : node.condition.on_success;
  return target ?? undefined;
};

/** All outgoing links, labelled for rendering. */
export const outgoingEdges = (node: Node): { target: number; kind: "next" | "success" | "failure" }[] => {
  if (isActionNode(node)) {
    return node.action.next != null ? [{ target: node.action.next, kind: "next" }] : [];
  }
  const edges: { target: number; kind: "next" | "success" | "failure" }[] = [];
  if (node.condition.on_success != null) edges.push({ target: node.condition.on_success, kind: "success" });
  if (node.condition.on_failure != null) edges.push({ target: node.condition.on_failure, kind: "failure" });
  return edges;
};

const withIndex = (body: NodeBody, index: number): Node =>
  "action" in body
    ? { action: { action: body.action, index, next: null } }
    : { condition: { condition: body.condition, index, on_success: null, on_failure: null } };

const relink = (node: Node, remap: (target: number | null | undefined) => number | null): Node =>
  isActionNode(node)
    ? { action: { ...node.action, next: remap(node.action.next) } }
    : {
        condition: {
          ...node.condition,
          on_success: remap(node.condition.on_success),
          on_failure: remap(node.condition.on_failure),
        },
      };

/**
 * The index of the node a new step should chain from: the end of the primary
 * path starting at the entry node. Undefined when the graph is empty or the
 * path ends in a node whose primary slot is taken (a loop).
 */
export const tailIndex = (nodes: readonly Node[]): number | undefined => {
  if (nodes.length === 0) return undefined;
  const byIndex = new Map(nodes.map((node) => [nodeIndex(node), node]));
  const visited = new Set<number>();
  let current = nodeIndex(nodes[0]);

  while (!visited.has(current)) {
    visited.add(current);
    const node = byIndex.get(current);
    if (!node) return undefined;
    const next = primaryNext(node);
    if (next === undefined) return current;
    current = next;
  }

  return undefined;
};

/**
 * Appends a node at the end of the array and links the primary path's tail
 * to it. The first node appended becomes the entry node.
 */
export const appendNode = (nodes: readonly Node[], body: NodeBody): Node[] => {
  const tail = tailIndex(nodes);
  return tail === undefined ? [...nodes, withIndex(body, nodes.length)] : appendAfter(nodes, tail, body);
};

/**
 * Appends a node and links `fromIndex`'s primary slot (next / on_success) to
 * it, regardless of which branch `fromIndex` sits on.
 */
export const appendAfter = (nodes: readonly Node[], fromIndex: number, body: NodeBody): Node[] => {
  const index = nodes.length;

  return [
    ...nodes.map((node) => {
      if (nodeIndex(node) !== fromIndex) return node;
      return isActionNode(node)
        ? { action: { ...node.action, next: index } }
        : { condition: { ...node.condition, on_success: index } };
    }),
    withIndex(body, index),
  ];
};

/** Replaces the payload of the node at `index`, leaving the wiring intact. */
export const replaceNodeBody = (nodes: readonly Node[], index: number, body: NodeBody): Node[] =>
  nodes.map((node) => {
    if (nodeIndex(node) !== index) return node;
    if (isActionNode(node) && "action" in body) {
      return { action: { ...node.action, action: body.action } };
    }
    if (!isActionNode(node) && "condition" in body) {
      return { condition: { ...node.condition, condition: body.condition } };
    }
    // Kind changed: keep what wiring translates (primary pointer), drop the rest.
    const primary = primaryNext(node) ?? null;
    return "action" in body
      ? { action: { action: body.action, index, next: primary } }
      : { condition: { condition: body.condition, index, on_success: primary, on_failure: null } };
  });

/**
 * Removes the node at `index`. Pointers into the removed node are bypassed to
 * its primary next (or cleared when it had none), remaining nodes are
 * renumbered to keep index == array position, and every pointer is remapped.
 */
export const removeNode = (nodes: readonly Node[], index: number): Node[] => {
  const removed = nodes.find((node) => nodeIndex(node) === index);
  if (!removed) return [...nodes];

  const bypass = primaryNext(removed) ?? null;
  const kept = nodes.filter((node) => nodeIndex(node) !== index);
  const newIndex = new Map(kept.map((node, position) => [nodeIndex(node), position]));

  const remap = (target: number | null | undefined): number | null => {
    if (target == null) return null;
    const resolved = target === index ? bypass : target;
    if (resolved == null) return null;
    return newIndex.get(resolved) ?? null;
  };

  return kept.map((node, position) => {
    const relinked = relink(node, remap);
    return isActionNode(relinked)
      ? { action: { ...relinked.action, index: position } }
      : { condition: { ...relinked.condition, index: position } };
  });
};
