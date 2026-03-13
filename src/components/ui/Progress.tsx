interface ProgressProps {
  percent: number;
  status?: "normal" | "success" | "error";
  size?: "default" | "sm";
  showText?: boolean;
}

export function Progress({ percent, status = "normal", size = "default", showText = true }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={`mx-progress mx-progress-${status} ${size === "sm" ? "mx-progress-sm" : ""}`}>
      <div className="mx-progress-track">
        <div className="mx-progress-bar" style={{ width: `${clamped}%` }} />
      </div>
      {showText && <span className="mx-progress-text">{clamped}%</span>}
    </div>
  );
}
