import { useState, useEffect, useLayoutEffect } from "react";

// useLayoutEffect fires synchronously before browser paint, eliminating the
// flash where size-dependent layout hasn't updated yet. On the server it
// would warn, so we fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Size {
  width: number;
  height: number;
}

export const BreakPoints = {
  xsmall: 420,
  small: 576,
  medium: 768,
  large: 1024,
  xl: 1440,
  xxl: 1680,
  hd: 1920,
  ultra: 2560,
}

export function useWindowSize(): Size {
  const [windowSize, setWindowSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  useIsomorphicLayoutEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export const useWindowDimensions = (innerWidth: number) => {
  const [isMobileSize, setIsMobileSize] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const windowResizeHandler = () => {
      setIsMobileSize(matchMedia(`(max-width: ${innerWidth}px)`).matches);
    };

    window.addEventListener('resize', windowResizeHandler);
    windowResizeHandler();
    return () => window.removeEventListener('resize', windowResizeHandler);
  }, [innerWidth]);

  return isMobileSize;
};