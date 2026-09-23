declare global {
    interface BigInt {
        toJSON(): string
    }
}

/**
 * Side-effect module: JSON.stringify chokes on BigInt, and both the client
 * (draft persistence) and the workers (trigger logging) serialize values
 * containing Uint128 bigints. Import once per entrypoint.
 */
BigInt.prototype.toJSON = function() {
    return this.toString()
}

export {}
