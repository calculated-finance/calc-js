import type { Asset } from "@template/domain/src/assets";
import type { PropsWithChildren, ReactNode } from "react";
import { useAssets } from "../../hooks/use-assets";

function highlightAssetsAndNumbers(text: string, assets: Asset[]): ReactNode {
  if (!assets.length) {
    return highlightNumbers(text);
  }

  const sortedAssets = [...assets].sort((a, b) => b.displayName.length - a.displayName.length);
  const assetPattern = sortedAssets.map((a) => a.displayName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const numberPattern = "[\\$#]?\\d+(?:[,.]\\d+)?[%#]?";
  const pattern = `(${assetPattern})|(${numberPattern})`;
  const regex = new RegExp(pattern, "gi");

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      const asset = sortedAssets.find((a) => a.displayName.toLowerCase() === match?.[1].toLowerCase());
      parts.push(
        <span key={match.index} style={{ color: asset?.color }}>
          {match[1]}
        </span>,
      );
    } else if (match[2]) {
      parts.push(
        <code key={match.index} className="rounded bg-zinc-900 px-1 py-[1px] font-mono">
          {match[2]}
        </code>,
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function highlightNumbers(text: string): ReactNode {
  const regex = /[\$#]?\d+(?:[,.]\d+)*(?:[.,]\d+)?[%#]?/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <code key={match.index} className="rounded bg-zinc-900 px-1 py-[1px]">
        {match[0]}
      </code>,
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function Code({
  children,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & PropsWithChildren) {
  const assets = useAssets();

  if (typeof children === "string") {
    return <code {...props}>{highlightAssetsAndNumbers(children, assets)}</code>;
  }

  return <code {...props}>{children}</code>;
}
