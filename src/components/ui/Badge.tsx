interface BadgeProps {
  count?: number;
  children: React.ReactNode;
}

export function Badge({ count, children }: BadgeProps) {
  return (
    <span className="mx-badge" style={{ position: "relative", display: "inline-flex" }}>
      {children}
      {count !== undefined && count > 0 && (
        <span className="mx-badge-dot">{count > 99 ? "99+" : count}</span>
      )}
    </span>
  );
}
