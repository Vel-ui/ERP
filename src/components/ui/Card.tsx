interface CardProps {
  variant?: "default" | "white" | "elevated";
  hoverable?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Card({ variant = "default", hoverable = false, className = "", children }: CardProps) {
  const variantClass = variant !== "default" ? `mx-card-${variant}` : "";
  const hoverClass = hoverable ? "mx-card-hoverable" : "";
  return (
    <div className={`mx-card ${variantClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
