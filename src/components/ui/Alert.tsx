import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface AlertProps {
  type?: "success" | "warning" | "error" | "info";
  message: string;
  description?: string;
}

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

export function Alert({ type = "info", message, description }: AlertProps) {
  const Icon = icons[type];
  return (
    <div className={`mx-alert mx-alert-${type}`}>
      <Icon size={16} style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <div style={{ fontWeight: 500 }}>{message}</div>
        {description && <div style={{ marginTop: 4, opacity: 0.85 }}>{description}</div>}
      </div>
    </div>
  );
}
