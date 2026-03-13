"use client";

import { useState } from "react";
import { Select, Modal } from "@/components/ui";
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
        <h1 className="mx-h1">Members &amp; Roles</h1>
        <p className="mt-1 text-sm mx-text-secondary">
          Manage team access. Edit role via three-dot menu. Archive = remove access (permanent).
        </p>
      </div>

      <div className="mx-table-container">
        <table className="mx-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="font-medium">{member.name}</td>
                <td className="mx-text-secondary">{member.email}</td>
                <td>
                  <span
                    className="mx-tag"
                    style={member.role === "Admin" ? {background:'var(--mx-primary-bg)', color:'var(--mx-primary)'} : undefined}
                  >
                    {member.role}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditRole(member)}
                      className="text-sm hover:underline"
                      style={{color:'var(--mx-primary)'}}
                    >
                      Edit role
                    </button>
                    <span className="mx-text-secondary">|</span>
                    <button
                      onClick={() => handleArchive(member.id)}
                      className="text-sm mx-text-secondary hover:text-red-500 hover:underline"
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

      <button className="mx-btn-default mt-4">
        + Invite Member
      </button>

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
            <button type="button" className="mx-btn-default" onClick={() => setEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="mx-btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
