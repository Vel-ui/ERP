export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Organization Settings</h1>
      <p className="mt-2 text-muted">
        Configure banks, chart of accounts, custom fields, members, and more. Use the sidebar to
        navigate.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted">Select a section from the sidebar to get started</p>
      </div>
    </div>
  );
}
