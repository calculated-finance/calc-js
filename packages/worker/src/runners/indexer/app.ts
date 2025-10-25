import { Effect } from "effect";

const indexer = Effect.gen(function* () {
  console.log("Starting indexer worker...");

  // Indexer logic goes here

  console.log("Indexer worker started.");
});

indexer.pipe(Effect.runFork);
