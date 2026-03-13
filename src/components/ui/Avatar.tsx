/* eslint-disable @next/next/no-img-element */
interface AvatarProps {
  initials?: string;
  size?: "sm" | "md" | "lg";
  src?: string;
}

export function Avatar({ initials, size = "md", src }: AvatarProps) {
  const sizeClass = size !== "md" ? `mx-avatar-${size}` : "";
  return (
    <span className={`mx-avatar ${sizeClass}`}>
      {src ? (
        <img src={src} alt={initials || "avatar"} />
      ) : (
        initials || "?"
      )}
    </span>
  );
}
