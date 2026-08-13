import { Fragment } from "react";

type SentenceGroupProps = {
  className: string;
  sentenceClassName: string;
  sentences: readonly string[];
};

export default function SentenceGroup({
  className,
  sentenceClassName,
  sentences,
}: SentenceGroupProps) {
  return (
    <p className={className}>
      {sentences.map((sentence, index) => (
        <Fragment key={sentence}>
          <span className={sentenceClassName}>{sentence}</span>
          {index < sentences.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
