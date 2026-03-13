"use client";

import { useState } from "react";
import { Button, Select, Modal } from "@/components/ui";
import { MOCK_MEMBERS } from "@/lib/mock-data";

const ROLES = [
  { value: "Admin", label: "Admin" },
  { value: "Accountant", label: "Accountant" },
];

export default function MembersPage() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [editRole, setEditRole] = useState("");

  const handleEditRole = (member: (typeof members)[0]) => {
    setEditingMember(member);
    setEditRole(member.role);
    setEditModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === editingMember.id ? { ...m, role: editRole } : m))
    );
    setEditModalOpen(false);
    setEditingMember(null);
  };

  const handleArchive = (id: string) => {
    if (confirm("Archive this member? This will permanently remove their access.")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Members & Roles</h1>
        <p className="mt-1 text-sm text-muted">
          Manage team access. Edit role via three-dot menu. Archive = remove access (permanent).
        </p>
      </div>

      <div className="rounded-lg border border-border bg-sidebar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="border-b border-border last:border-0 transition-colors hover:bg-sidebar-hover"
              >
                <td className="px-4 py-3 font-medium text-foreground">{member.name}</td>
                <td className="px-4 py-3 text-muted">{member.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      member.role === "Admin"
                        ? "bg-accent/20 text-accent"
                        : "bg-sidebar-hover text-muted"
                    }`}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditRole(member)}
                      className="text-sm text-accent hover:underline"
                    >
                      Edit role
                    </button>
                    <span className="text-muted">|</span>
                    <button
                      onClick={() => handleArchive(member.id)}
                      className="text-sm text-muted hover:text-red-400 hover:underline"
                    >
                      Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="secondary" className="mt-4">
        + Invite Member
      </Button>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit role: ${editingMember?.name}`}
      >
        <form onSubmit={handleSaveRole} className="space-y-4">
          <Select
            label="Role"
            options={ROLES}
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
