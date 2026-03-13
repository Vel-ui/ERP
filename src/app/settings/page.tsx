export default function SettingsPage() {
  return (
    <div>
      <h1 className="mx-h1">Organization Settings</h1>
      <p className="mt-2 mx-text-secondary">
        Configure banks, chart of accounts, custom fields, members, and more. Use the sidebar to
        navigate.
      </p>
      <div className="mt-8 mx-card p-8 text-center" style={{borderStyle:'dashed'}}>
        <p className="text-sm mx-text-secondary">Select a section from the sidebar to get started</p>
      </div>
    </div>
  );
}
