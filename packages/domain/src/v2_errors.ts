import { Data } from "effect"

// Domain Errors (expandable)
export class V2ValidationError extends Data.TaggedError("V2ValidationError")<{
    issues: ReadonlyArray<string>
}> {}

export class V2InvariantError extends Data.TaggedError("V2InvariantError")<{
    message: string
}> {}

export class V2EncodingError extends Data.TaggedError("V2EncodingError")<{
    message: string
}> {}

export class V2NotFoundError extends Data.TaggedError("V2NotFoundError")<{
    entity: string
    id: string
}> {}

export class V2ConflictError extends Data.TaggedError("V2ConflictError")<{
    message: string
}> {}

export type V2DomainError =
    | V2ValidationError
    | V2InvariantError
    | V2EncodingError
    | V2NotFoundError
    | V2ConflictError
