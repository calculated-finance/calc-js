export const Graph = ({
  percentage,
  width = 100,
}: {
  percentage: number;
  width?: number;
}) => {
  const d = width;
  const r = d * 0.5 - 5;
  const fullDraw = (100 * (2 * r * Math.PI)) / 100;
  const rDraw = (percentage * (2 * r * Math.PI)) / 100;

  return (
    <svg
      className="round"
      viewBox={`0 0 ${d} ${d}`}
      /* width={d}
      height={d} */
      fill="none">
      <circle
        cx={d * 0.5}
        cy={d * 0.5}
        r={r}
        strokeDasharray={`${fullDraw} 999`}
      />
      <circle
        cx={d * 0.5}
        cy={d * 0.5}
        r={r}
        strokeDasharray={`${rDraw} 999`}
      />
    </svg>
  );
};
