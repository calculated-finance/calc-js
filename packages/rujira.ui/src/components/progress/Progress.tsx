import clsx from "clsx";

export const Progress = ({
  percentage,
  fillStart = 0,
  height = 4,
  className,
  fillClassName,
  showLabels,
  label,
  labelMin = "0",
  labelMax = "100",
}: {
  percentage: number;
  height?: number;
  className?: string;
  fillClassName?: string;
  fillStart?: number;
  showLabels?: boolean;
  label?: string;
  labelMin?: string;
  labelMax?: string;
}) => {
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;
  if (fillStart + percentage > 100) percentage = 100 - fillStart;

  return (
    <div className={clsx({ progress: true, [`${className}`]: className })}>
      <div className="progress__height">
        <div className="progress__track" style={{ height: height }} />
        <div
          className={clsx("progress__percentage", fillClassName)}
          style={{ left: `${fillStart}%`, width: `${percentage}%`, ...(fillClassName ? { backgroundImage: "none" } : {}) }}
        />
      </div>
      {showLabels && (
        <div className="progress__labels">
          <div>{labelMin}</div>
          <div style={{ left: `${percentage}%` }}>{label || percentage}</div>
          <div>{labelMax}</div>
        </div>
      )}
    </div>
  );
};
