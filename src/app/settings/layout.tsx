import { SettingsSidebar } from "@/components/layout/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex w-full gap-8 p-8">
        <SettingsSidebar />
        <div className="min-w-0 flex-1 rounded-lg bg-white p-6">{children}</div>
      </div>
    </div>
  );
}
