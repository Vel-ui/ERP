interface BreadcrumbProps {
  items: string[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mx-breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-breadcrumb-sep">/</span>}
          <span className={i === items.length - 1 ? "mx-breadcrumb-current" : "mx-breadcrumb-item"}>
            {item}
          </span>
        </span>
      ))}
    </nav>
  );
}
