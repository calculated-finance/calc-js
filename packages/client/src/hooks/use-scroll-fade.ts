import { useCallback, useEffect, useRef, useState } from "react";

const FADE_HEIGHT = 32;

/**
 * Fades a scroll container's top/bottom edges only while more content
 * continues past them, so a clipped list reads as scrollable. Attach `ref`
 * and `onScroll` to the container and set `maskImage` (and its Webkit
 * variant) in its style.
 */
export const useScrollFade = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ top: false, bottom: false });

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const top = el.scrollTop > 2;
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
    setFade((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
  }, []);

  // Size changes (ResizeObserver) and content changes (MutationObserver)
  // both move the scroll extents without firing a scroll event.
  useEffect(() => {
    onScroll();
    const el = ref.current;
    if (!el) return;
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(el);
    const mutationObserver = new MutationObserver(onScroll);
    mutationObserver.observe(el, { childList: true, subtree: true });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [onScroll]);

  const maskImage = `linear-gradient(to bottom, ${
    fade.top ? `transparent, black ${FADE_HEIGHT}px` : "black"
  }, ${fade.bottom ? `black calc(100% - ${FADE_HEIGHT}px), transparent` : "black"})`;

  return { ref, onScroll, maskImage };
};
