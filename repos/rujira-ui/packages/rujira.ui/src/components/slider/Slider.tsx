import ReactSlider, { ReactSliderProps } from "react-slider";

const _consoleError = console.error;
console.error = (...args: Parameters<typeof console.error>) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes('"key" prop is being spread')
  )
    return;
  _consoleError(...args);
};

// Generic over the value shape so a single-thumb slider (`value={n}`) and a
// dual-thumb range slider (`value={[lo, hi]}`) are both fully typed. Defaults to
// `number` so existing single-value callers are unaffected.
export const Slider = <T extends number | readonly number[] = number>(
  props: ReactSliderProps<T>
) => {
  return (
    <ReactSlider
      {...props}
      className="slider grow"
      trackClassName="slider__track"
      thumbClassName="slider__thumb"
    />
  );
};
