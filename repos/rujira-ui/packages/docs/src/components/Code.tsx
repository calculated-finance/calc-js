import { Highlight, themes } from "prism-react-renderer";

export const Code = ({
  code,
  language,
}: {
  code: string;
  language: string;
}) => (
  <Highlight theme={themes.jettwaveDark} language={language} code={code}>
    {({ tokens, getLineProps, getTokenProps }) => (
      <pre>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);
