export default function CreditMemosPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Credit Memos</h1>
        <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover">
          + Add Credit Memo
        </button>
      </div>
      <p className="mt-2 text-muted">Credit memo list will appear here.</p>
    </div>
  );
}
