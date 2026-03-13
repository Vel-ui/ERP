"use client";

import { useState, useCallback } from "react";
import { Plus, Edit, Trash2, Lock, Unlock, Copy, Paperclip, CheckCircle } from "lucide-react";
import { Button, Input, Select, Modal, Tag } from "@/components/ui";

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
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + 7);
    setTasks((prev) => [...prev, { id: Date.now().toString(), name: newTaskName.trim(), owner: "unassigned", dueDate: nextDue.toISOString().split("T")[0], completed: false, attachments: [] }]);
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
      return { ...t, id: Date.now().toString() + t.id, dueDate: date.toISOString().split("T")[0], completed: false, attachments: [] };
    });
    setTasks(newTasks);
    setIsLocked(false);
    setShowCopyConfirm(false);
    const currentIdx = periods.findIndex((p) => p.value === period);
    if (currentIdx > 0) setPeriod(periods[currentIdx - 1].value);
  }, [tasks, period]);

  const handleAttach = useCallback((id: string) => {
    if (isLocked) return;
    const filename = `attachment_${Date.now()}.pdf`;
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, attachments: [...t.attachments, filename] } : t));
  }, [isLocked]);

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="mx-h1">Close Checklist</h1>
            <p className="mx-text-secondary mt-1">{completedCount}/{tasks.length} tasks complete &middot; {progressPct}%</p>
          </div>
          <div className="flex items-center gap-3">
            <div style={{ width: 176 }}>
              <Select options={periods} value={period} onChange={(e) => setPeriod(e.target.value)} />
            </div>
            {isLocked && <Tag variant="warning">Locked</Tag>}
          </div>
        </div>

        <div style={{ height: 8, borderRadius: 4, background: '#E9E9E9', overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ height: '100%', borderRadius: 4, background: '#154738', width: `${progressPct}%`, transition: 'width 0.5s' }} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button size="sm" onClick={() => setShowAddModal(true)} disabled={isLocked}><Plus size={14} className="mr-1" /> Add Task</Button>
          <Button variant="default" size="sm" onClick={() => setShowCopyConfirm(true)}><Copy size={14} className="mr-1" /> Copy &amp; Create New Month</Button>
          {!isLocked ? (
            <Button variant="danger" size="sm" onClick={() => setIsLocked(true)} className="ml-auto">
              <Lock size={14} className="mr-1" /> Close Books
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={() => setIsLocked(false)} className="ml-auto">
              <Unlock size={14} className="mr-1" /> Reopen
            </Button>
          )}
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th style={{ width: 48 }}>Done</th>
                <th>Task Name</th>
                <th style={{ width: 160 }}>Owner</th>
                <th style={{ width: 144 }}>Due Date</th>
                <th style={{ width: 112 }}>Attachments</th>
                <th style={{ width: 96, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <button
                      onClick={() => toggleComplete(task.id)}
                      disabled={isLocked}
                      style={{ width: 20, height: 20, borderRadius: 4, border: task.completed ? '1px solid #067f54' : '1px solid #E9E9E9', background: task.completed ? '#edfdec' : '#fff', color: '#067f54', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.5 : 1 }}
                    >
                      {task.completed && <CheckCircle size={14} />}
                    </button>
                  </td>
                  <td style={{ fontWeight: 500, color: task.completed ? '#a0a2aa' : '#2D2926', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.name}</td>
                  <td>
                    <select value={task.owner} onChange={(e) => updateOwner(task.id, e.target.value)} disabled={isLocked} className="mx-select" style={{ width: '100%', opacity: isLocked ? 0.5 : 1 }}>
                      {owners.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                    </select>
                  </td>
                  <td>
                    <input type="date" value={task.dueDate} onChange={(e) => updateDueDate(task.id, e.target.value)} disabled={isLocked} className="mx-input" style={{ width: '100%', opacity: isLocked ? 0.5 : 1 }} />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleAttach(task.id)} disabled={isLocked} style={{ background: 'none', border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer', color: '#a0a2aa', opacity: isLocked ? 0.5 : 1 }}>
                        <Paperclip size={16} />
                      </button>
                      {task.attachments.length > 0 && (
                        <span className="mx-text-secondary" style={{ fontSize: 12 }}>{task.attachments.length}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditingTask({ ...task })} disabled={isLocked} style={{ background: 'none', border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer', padding: 4, borderRadius: 4, color: '#a0a2aa', opacity: isLocked ? 0.5 : 1 }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteTask(task.id)} disabled={isLocked} style={{ background: 'none', border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer', padding: 4, borderRadius: 4, color: '#a0a2aa', opacity: isLocked ? 0.5 : 1 }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32 }} className="mx-text-secondary">No tasks yet. Click &quot;+ Add Task&quot; to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Task" size="sm">
          <div className="space-y-4">
            <Input label="Task Name" placeholder="e.g. Reconcile bank accounts" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
            <div className="flex justify-end gap-2">
              <Button variant="default" size="sm" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button size="sm" onClick={addTask} disabled={!newTaskName.trim()}>Add Task</Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task" size="sm">
          {editingTask && (
            <div className="space-y-4">
              <Input label="Task Name" value={editingTask.name} onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })} />
              <Select label="Owner" options={owners} value={editingTask.owner} onChange={(e) => setEditingTask({ ...editingTask, owner: e.target.value })} />
              <Input label="Due Date" type="date" value={editingTask.dueDate} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} />
              <div className="flex justify-end gap-2">
                <Button variant="default" size="sm" onClick={() => setEditingTask(null)}>Cancel</Button>
                <Button size="sm" onClick={saveEdit}>Save</Button>
              </div>
            </div>
          )}
        </Modal>

        <Modal isOpen={showCopyConfirm} onClose={() => setShowCopyConfirm(false)} title="Copy & Create New Month" size="sm">
          <div className="space-y-4">
            <p className="mx-text-secondary" style={{ fontSize: 14 }}>
              This will copy all {tasks.length} tasks to a new month with due dates shifted forward by one month. Completion status and attachments will be reset.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="default" size="sm" onClick={() => setShowCopyConfirm(false)}>Cancel</Button>
              <Button size="sm" onClick={copyAndCreateNewMonth}>Confirm Copy</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
