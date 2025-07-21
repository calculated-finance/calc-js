import Editor from "@monaco-editor/react";
import { useMemo } from "react";
import { useCreateActionStore } from "../../hooks/use-action-store";

export function ActionJsonEditor() {
  const { action, generateJson } = useCreateActionStore();

  const json = useMemo(() => {
    const action = generateJson();
    return action ? JSON.stringify(action, null, 2) : "";
  }, [action, generateJson]);

  return (
    <Editor
      height="100vh"
      language="json"
      value={json}
      options={{
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: "on",
        minimap: { enabled: false },
        lineDecorationsWidth: 0,
        scrollbar: {
          horizontal: "hidden",
          vertical: "hidden",
        },
        wordWrap: "off",
        theme: "vs-dark",
      }}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("custom", {
          base: "vs-dark",
          inherit: true,
          colors: {
            "editor.background": "#000000",
            "editor.foreground": "#000000",
          },
          rules: [],
        });
        monaco.editor.setTheme("custom");
      }}
    />
  );
}
