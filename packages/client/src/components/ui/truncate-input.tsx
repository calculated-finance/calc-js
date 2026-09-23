import { useEffect, useRef, useState } from "react";
import { Input } from "./input";

/**
 * An Input that middle-truncates its value to exactly fit the box while
 * unfocused — capacity is measured from the rendered font on every resize,
 * and the elision is drawn as dimmed, spaced dots. Clicking (or tabbing
 * into) the box swaps in a real input with the full value for editing.
 */
export function TruncateInput({
  value,
  onChange,
  style,
  placeholder,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange" | "style"> & {
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [capacity, setCapacity] = useState(0);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const context = document.createElement("canvas").getContext("2d");
    const observer = new ResizeObserver(() => {
      if (!context) return;
      const computed = getComputedStyle(element);
      // Firefox can return an empty font shorthand; rebuild it from parts.
      context.font = computed.font || `${computed.fontSize} ${computed.fontFamily}`;
      const charWidth = context.measureText("0").width || 8;
      // 24 = the input's horizontal padding (px-3 per side). This is the
      // box's true character capacity — the untruncated fit check uses it
      // as-is; headroom only applies once truncation is needed.
      setCapacity(Math.max(0, Math.floor((element.clientWidth - 24) / charWidth)));
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  const mergedStyle: React.CSSProperties = {
    boxShadow: "none",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1.25rem",
    ...style,
  };

  // A value that genuinely fits renders untouched. Once truncation is
  // needed, reserve four characters of headroom for the dots separator.
  const fits = capacity === 0 || value.length <= capacity;
  const visible = capacity - 4;

  return (
    // The display layer is absolutely positioned so its nowrap text never
    // contributes min-content width — otherwise a long value inflates every
    // flex ancestor (and the modal) instead of staying inside the box.
    <div ref={wrapperRef} className="relative h-12 w-full font-mono" style={{ fontSize: mergedStyle.fontSize }}>
      {isEditing ? (
        <Input
          style={mergedStyle}
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onBlur={() => {
            setIsEditing(false);
          }}
          ref={(element) => element?.focus()}
          {...props}
        />
      ) : (
        // Click-to-edit only: a tabbable display div would be the modal's
        // first focusable element and get auto-focused into edit mode on
        // open (the form's real inputs all opt out with tabIndex -1).
        <div
          onClick={() => {
            setIsEditing(true);
          }}
          className={`absolute inset-0 flex cursor-text items-center overflow-hidden whitespace-nowrap px-3 ${className ?? ""}`}
        >
          {value === "" ? (
            <span className="text-zinc-500">{placeholder}</span>
          ) : fits ? (
            value
          ) : (
            <>
              {value.slice(0, Math.ceil(visible / 2))}
              {/* flex gap spaces only BETWEEN the dots (letter-spacing would
                  trail the last one), keeping the surround symmetric. */}
              {/* pr trimmed slightly: the mono period glyph sits left in its
                  advance cell, so equal padding reads wider on the right. */}
              <span className="flex gap-[0.05em] pl-1 pr-[2px] text-zinc-500">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
              {value.slice(-Math.floor(visible / 2))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
