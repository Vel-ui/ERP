"use client";

import { useState } from "react";
import { Button, Input, Select, Modal } from "@/components/ui";
import { MOCK_FIELDS } from "@/lib/mock-data";

const FIELD_TYPES = [
  { value: "Text", label: "Text" },
  { value: "Dropdown", label: "Dropdown" },
  { value: "Date", label: "Date" },
];

const DISPLAY_OPTIONS = [
  { value: "Standalone", label: "Standalone (text)" },
  { value: "Free tagging", label: "Free tagging (multi-select)" },
];

export default function FieldsPage() {
  const [fields, setFields] = useState(MOCK_FIELDS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "Dropdown",
    mandatory: false,
    displayAs: "Standalone",
    values: "",
  });

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.type) return;
    const values = form.type === "Dropdown" && form.values
      ? form.values.split(",").map((v) => v.trim()).filter(Boolean)
      : [];
    setFields((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: form.name,
        type: form.type,
        mandatory: form.mandatory,
        displayAs: form.displayAs,
        values,
      },
    ]);
    setForm({ name: "", type: "Dropdown", mandatory: false, displayAs: "Standalone", values: "" });
    setModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Custom Fields</h1>
          <p className="mt-1 text-sm text-muted">
            Add custom fields with values and rules. Mandatory toggle; Display: Standalone or Free
            tagging. Used fields cannot be deleted.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add Field</Button>
      </div>

      <div className="rounded-lg border border-border bg-sidebar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Mandatory</th>
              <th className="px-4 py-3 font-medium">Display</th>
              <th className="px-4 py-3 font-medium">Values</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr
                key={field.id}
                className="border-b border-border last:border-0 transition-colors hover:bg-sidebar-hover"
              >
                <td className="px-4 py-3 font-medium text-foreground">{field.name}</td>
                <td className="px-4 py-3 text-muted">{field.type}</td>
                <td className="px-4 py-3">
                  {field.mandatory ? (
                    <span className="text-accent">Yes</span>
                  ) : (
                    <span className="text-muted">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{field.displayAs}</td>
                <td className="px-4 py-3 text-muted text-sm">
                  {field.values.length > 0 ? field.values.join(", ") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Field" size="md">
        <form onSubmit={handleAddField} className="space-y-4">
          <Input
            label="Field Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Department"
            required
          />
          <Select
            label="Type"
            options={FIELD_TYPES}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          />
          <Select
            label="Display as"
            options={DISPLAY_OPTIONS}
            value={form.displayAs}
            onChange={(e) => setForm((f) => ({ ...f, displayAs: e.target.value }))}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="mandatory"
              checked={form.mandatory}
              onChange={(e) => setForm((f) => ({ ...f, mandatory: e.target.checked }))}
              className="h-4 w-4 rounded border-border bg-sidebar text-accent focus:ring-accent"
            />
            <label htmlFor="mandatory" className="text-sm text-foreground">
              Mandatory
            </label>
          </div>
          {form.type === "Dropdown" && (
            <Input
              label="Values (comma-separated)"
              value={form.values}
              onChange={(e) => setForm((f) => ({ ...f, values: e.target.value }))}
              placeholder="e.g. Engineering, Sales, Marketing"
            />
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Field</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
