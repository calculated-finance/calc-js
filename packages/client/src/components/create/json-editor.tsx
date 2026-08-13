import "@xyflow/react/dist/style.css";
import { Either, Schema } from "effect";
import "prism-themes/themes/prism-duotone-sea.css";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import { useState } from "react";
import Editor from "react-simple-code-editor";

export function JsonEditor<A, I>({
  value,
  schema,
  onExit,
}: {
  value: A;
  schema: Schema.Schema<A, I>;
  onSave: (value: A) => void;
  onExit?: () => void;
}) {
  // Encoding live values can fail mid-edit; never let that throw in render.
  const encoded = Schema.encodeUnknownEither(schema)(value);
  const [localCode] = useState<string>(() =>
    Either.isRight(encoded) ? JSON.stringify(encoded.right, null, 4) : "",
  );

  if (Either.isLeft(encoded)) {
    return (
      <div className="mt-4 flex flex-col gap-2">
        <code className="text-sm text-red-400/80">Fix the validation errors to view this node as JSON.</code>
        <code className="cursor-pointer text-sm text-zinc-500 underline" onClick={onExit}>
          exit
        </code>
      </div>
    );
  }

  return (
    <div className="mt-4 max-h-150 w-300 overflow-auto" style={{ scrollbarWidth: "none" }}>
      <Editor
        textareaClassName="outline-none"
        value={localCode}
        onValueChange={() => {}}
        highlight={(code) => Prism.highlight(code, Prism.languages.json, "json")}
        autoFocus={true}
        tabIndex={-1}
        style={{
          backgroundColor: "#transparent",
          fontFamily: "monospace",
          fontSize: "1rem",
          lineHeight: "1.7",
          overflow: "visible",
          scrollbarWidth: "none",
          paddingRight: "50px",
        }}
      />
      <style>{`
        .max-h-100::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="absolute top-6 right-6 flex gap-4">
        <code
          className="cursor-pointer text-sm text-zinc-500 underline"
          onClick={() => {
            void navigator.clipboard.writeText(localCode);
          }}
        >
          copy
        </code>
        <code className="cursor-pointer text-sm text-zinc-500 underline" onClick={onExit}>
          exit
        </code>
      </div>
    </div>
  );
}
