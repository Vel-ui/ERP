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
          <h1 className="mx-h1">Custom Fields</h1>
          <p className="mt-1 text-sm mx-text-secondary">
            Add custom fields with values and rules. Mandatory toggle; Display: Standalone or Free
            tagging. Used fields cannot be deleted.
          </p>
        </div>
        <button className="mx-btn-primary" onClick={() => setModalOpen(true)}>+ Add Field</button>
      </div>

      <div className="mx-table-container">
        <table className="mx-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Mandatory</th>
              <th>Display</th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.id} className="hover:bg-gray-50">
                <td className="font-medium">{field.name}</td>
                <td className="mx-text-secondary">{field.type}</td>
                <td>
                  {field.mandatory ? (
                    <span style={{color:'var(--mx-primary)'}}>Yes</span>
                  ) : (
                    <span className="mx-text-secondary">No</span>
                  )}
                </td>
                <td className="mx-text-secondary">{field.displayAs}</td>
                <td className="mx-text-secondary text-sm">
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
              className="h-4 w-4 rounded"
              style={{accentColor:'var(--mx-primary)'}}
            />
            <label htmlFor="mandatory" className="text-sm">
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
            <button type="button" className="mx-btn-default" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="mx-btn-primary">Add Field</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
