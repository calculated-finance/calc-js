// Namespace exports (existing)
export * as assets from "./assets.js"
export * as calc from "./calc.js"
export * as calc2 from "./calc2.js"
export * as chains from "./chains.js"
export * as clients from "./clients.js"
export * as keplr from "./clients/keplr.js"
export * as local from "./clients/local.js"
export * as metamask from "./clients/metamask.js"
export * as cosmos from "./cosmos.js"
export * as cosmwasm from "./cosmwasm.js"
export * as evm from "./evm.js"
export * as numbers from "./numbers.js"
export * as rujira from "./rujira.js"
export * as storage from "./storage.js"
export * as strategies from "./strategies.js"
export * as types from "./types.js"
export * as utils from "./utils.js"
// Provide v2 graph API under a single namespace to avoid symbol collisions
export * as v2 from "./v2_index.js"

// (Temporarily removed problematic flat v2 re-exports to avoid duplicate symbol conflicts)
