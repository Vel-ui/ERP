"use client";

import { useState, useCallback } from "react";
import { Button, Input, Select, Modal } from "@/components/ui";

interface ChecklistTask {
  id: string;
  name: string;
  owner: string;
  dueDate: string;
  completed: boolean;
  attachments: string[];
}

const owners = [
  { value: "unassigned", label: "Unassigned" },
  { value: "sarah", label: "Sarah Chen" },
  { value: "mike", label: "Mike Johnson" },
  { value: "emily", label: "Emily Rodriguez" },
  { value: "james", label: "James Park" },
  { value: "lisa", label: "Lisa Wang" },
];

const periods = [
  { value: "2026-03", label: "March 2026" },
  { value: "2026-02", label: "February 2026" },
  { value: "2026-01", label: "January 2026" },
  { value: "2025-12", label: "December 2025" },
];

function buildInitialTasks(): ChecklistTask[] {
  return [
    { id: "1", name: "Reconcile bank accounts", owner: "sarah", dueDate: "2026-04-05", completed: true, attachments: ["bank_rec_mar.pdf"] },
    { id: "2", name: "Review outstanding AP", owner: "mike", dueDate: "2026-04-06", completed: true, attachments: [] },
    { id: "3", name: "Post depreciation", owner: "emily", dueDate: "2026-04-07", completed: true, attachments: ["depreciation_schedule.xlsx"] },
    { id: "4", name: "Review AR aging", owner: "james", dueDate: "2026-04-08", completed: false, attachments: [] },
    { id: "5", name: "Post accruals", owner: "lisa", dueDate: "2026-04-09", completed: false, attachments: [] },
    { id: "6", name: "Reconcile payroll", owner: "sarah", dueDate: "2026-04-10", completed: false, attachments: [] },
    { id: "7", name: "Review prepaid schedule", owner: "emily", dueDate: "2026-04-11", completed: false, attachments: ["prepaid_amort.xlsx"] },
    { id: "8", name: "Final review", owner: "james", dueDate: "2026-04-12", completed: false, attachments: [] },
  ];
}

export default function ChecklistPage() {
  const [period, setPeriod] = useState("2026-03");
  const [tasks, setTasks] = useState<ChecklistTask[]>(buildInitialTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [editingTask, setEditingTask] = useState<ChecklistTask | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const toggleComplete = useCallback((id: string) => {
    if (isLocked) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, [isLocked]);

  const updateOwner = useCallback((id: string, owner: string) => {
    if (isLocked) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, owner } : t)));
  }, [isLocked]);

  const updateDueDate = useCallback((id: string, dueDate: string) => {
    if (isLocked) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, dueDate } : t)));
  }, [isLocked]);

  const deleteTask = useCallback((id: string) => {
    if (isLocked) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [isLocked]);

  const addTask = useCallback(() => {
    if (!newTaskName.trim()) return;
    const id = Date.now().toString();
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + 7);
    setTasks((prev) => [
      ...prev,
      {
        id,
        name: newTaskName.trim(),
        owner: "unassigned",
        dueDate: nextDue.toISOString().split("T")[0],
        completed: false,
        attachments: [],
      },
    ]);
    setNewTaskName("");
    setShowAddModal(false);
  }, [newTaskName]);

  const saveEdit = useCallback(() => {
    if (!editingTask) return;
    setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? editingTask : t)));
    setEditingTask(null);
  }, [editingTask]);

  const copyAndCreateNewMonth = useCallback(() => {
    const newTasks = tasks.map((t) => {
      const date = new Date(t.dueDate);
      date.setMonth(date.getMonth() + 1);
      return {
        ...t,
        id: Date.now().toString() + t.id,
        dueDate: date.toISOString().split("T")[0],
        completed: false,
        attachments: [],
      };
    });
    setTasks(newTasks);
    setIsLocked(false);
    setShowCopyConfirm(false);
    const currentIdx = periods.findIndex((p) => p.value === period);
    if (currentIdx > 0) {
      setPeriod(periods[currentIdx - 1].value);
    }
  }, [tasks, period]);

  const handleAttach = useCallback((id: string) => {
    if (isLocked) return;
    const filename = `attachment_${Date.now()}.pdf`;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, attachments: [...t.attachments, filename] } : t
      )
    );
  }, [isLocked]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Close Checklist</h1>
          <p className="mt-1 text-muted">
            {completedCount}/{tasks.length} tasks complete &middot; {progressPct}%
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <Select
              options={periods}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </div>
          {isLocked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400 border border-yellow-500/25">
              🔒 Locked
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-sidebar overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={() => setShowAddModal(true)} disabled={isLocked}>
          + Add Task
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowCopyConfirm(true)}
        >
          Copy &amp; Create New Month
        </Button>
        {!isLocked ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsLocked(true)}
            className="ml-auto border-red-500/40 text-red-400 hover:bg-red-500/10"
          >
            🔒 Close Books
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsLocked(false)}
            className="ml-auto border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
          >
            🔓 Reopen
          </Button>
        )}
      </div>

      {/* Tasks table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-sidebar">
                <th className="w-12 px-4 py-3 text-left font-medium text-muted">Done</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Task Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted w-40">Owner</th>
                <th className="px-4 py-3 text-left font-medium text-muted w-36">Due Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted w-28">Attachments</th>
                <th className="px-4 py-3 text-right font-medium text-muted w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-border last:border-0 hover:bg-sidebar-hover transition-colors"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      disabled={isLocked}
                      className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                        task.completed
                          ? "border-green-500 bg-green-500/20 text-green-400"
                          : "border-border hover:border-accent"
                      } disabled:opacity-50`}
                    >
                      {task.completed && <span className="text-xs">✓</span>}
                    </button>
                  </td>
                  <td className={`px-4 py-3 font-medium ${task.completed ? "text-muted line-through" : "text-foreground"}`}>
                    {task.name}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={task.owner}
                      onChange={(e) => updateOwner(task.id, e.target.value)}
                      disabled={isLocked}
                      className="w-full rounded border border-border bg-sidebar px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-50"
                    >
                      {owners.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={task.dueDate}
                      onChange={(e) => updateDueDate(task.id, e.target.value)}
                      disabled={isLocked}
                      className="w-full rounded border border-border bg-sidebar px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAttach(task.id)}
                        disabled={isLocked}
                        className="text-muted hover:text-foreground transition-colors disabled:opacity-50"
                        title="Attach file"
                      >
                        📎
                      </button>
                      {task.attachments.length > 0 && (
                        <span className="text-xs text-muted">{task.attachments.length}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingTask({ ...task })}
                        disabled={isLocked}
                        className="rounded p-1 text-muted hover:bg-sidebar-hover hover:text-foreground transition-colors disabled:opacity-50"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        disabled={isLocked}
                        className="rounded p-1 text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">
                    No tasks yet. Click &quot;+ Add Task&quot; to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Task" size="sm">
        <div className="space-y-4">
          <Input
            label="Task Name"
            placeholder="e.g. Reconcile bank accounts"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <div className="flex justify-end gap-2">
            <Button variant="text" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={addTask} disabled={!newTaskName.trim()}>
              Add Task
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
        size="sm"
      >
        {editingTask && (
          <div className="space-y-4">
            <Input
              label="Task Name"
              value={editingTask.name}
              onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
            />
            <Select
              label="Owner"
              options={owners}
              value={editingTask.owner}
              onChange={(e) => setEditingTask({ ...editingTask, owner: e.target.value })}
            />
            <Input
              label="Due Date"
              type="date"
              value={editingTask.dueDate}
              onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="text" size="sm" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={saveEdit}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Copy & Create Confirm Modal */}
      <Modal
        isOpen={showCopyConfirm}
        onClose={() => setShowCopyConfirm(false)}
        title="Copy & Create New Month"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            This will copy all {tasks.length} tasks to a new month with due dates shifted forward by one month.
            Completion status and attachments will be reset.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="text" size="sm" onClick={() => setShowCopyConfirm(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={copyAndCreateNewMonth}>
              Confirm Copy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
