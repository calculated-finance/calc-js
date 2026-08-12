import "@xyflow/react/dist/style.css";
import "prism-themes/themes/prism-duotone-sea.css";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import { useState } from "react";
import Editor from "react-simple-code-editor";

export function JsonEditor<T, U>({
  data,
  onExit,
}: {
  data: T;
  schema: U;
  onSave: (data: T) => void;
  onExit?: () => void;
}) {
  const [localCode] = useState<string>(JSON.stringify(data, null, 4));

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
            navigator.clipboard.writeText(localCode);
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
