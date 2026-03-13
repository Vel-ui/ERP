interface TagProps {
  variant?: "default" | "success" | "processing" | "warning" | "error" | "ledger" | "mint";
  children: React.ReactNode;
}

export function Tag({ variant = "default", children }: TagProps) {
  return (
    <span className={`mx-tag mx-tag-${variant}`}>
      {children}
    </span>
  );
}
