"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  table?: { headers: string[]; rows: string[][] };
  timestamp: Date;
}

const SUGGESTED_QUERIES = [
  "What was our ARR last month?",
  "Show me outstanding invoices",
  "Revenue by customer this quarter",
  "What's our cash runway?",
  "Show AP aging summary",
  "MRR trend last 6 months",
];

const SIDEBAR_PROMPTS = [
  { category: "Revenue", prompts: ["ARR breakdown by product", "Revenue recognition schedule", "Deferred revenue balance"] },
  { category: "Accounts Receivable", prompts: ["Outstanding invoices over 90 days", "Customer payment trends", "Invoice aging by entity"] },
  { category: "Accounts Payable", prompts: ["Upcoming bill payments", "Vendor spend analysis", "Accrued expenses summary"] },
  { category: "Close & Reporting", prompts: ["Month-end checklist status", "Trial balance summary", "Intercompany eliminations"] },
];

const MOCK_CONVERSATION: Message[] = [
  {
    id: "1",
    role: "user",
    content: "What was our ARR last month?",
    timestamp: new Date(2026, 2, 12, 14, 30),
  },
  {
    id: "2",
    role: "assistant",
    content: "Here's the ARR breakdown for February 2026 across all entities:",
    table: {
      headers: ["Entity", "Product", "Active Contracts", "MRR", "ARR"],
      rows: [
        ["Maximor US", "SaaS Platform - Annual", "142", "$284,000", "$3,408,000"],
        ["Maximor US", "SaaS Platform - Monthly", "89", "$44,500", "$534,000"],
        ["Maximor UK", "SaaS Platform - Annual", "67", "£95,400", "£1,144,800"],
        ["Maximor Europe", "SaaS Platform - Annual", "38", "€72,200", "€866,400"],
        ["Total (USD equiv.)", "All Products", "336", "$521,700", "$6,260,400"],
      ],
    },
    timestamp: new Date(2026, 2, 12, 14, 30),
  },
  {
    id: "3",
    role: "user",
    content: "Show me outstanding invoices",
    timestamp: new Date(2026, 2, 12, 14, 32),
  },
  {
    id: "4",
    role: "assistant",
    content: "Here are the outstanding invoices as of today, sorted by amount due:",
    table: {
      headers: ["Invoice #", "Customer", "Amount", "Due Date", "Days Overdue", "Status"],
      rows: [
        ["INV-2026-0847", "Acme Corp", "$45,000.00", "Feb 15, 2026", "26", "Overdue"],
        ["INV-2026-0892", "TechFlow Inc", "$32,500.00", "Feb 28, 2026", "13", "Overdue"],
        ["INV-2026-0901", "GlobalSoft Ltd", "£24,800.00", "Mar 1, 2026", "12", "Overdue"],
        ["INV-2026-0923", "DataSync GmbH", "€18,200.00", "Mar 10, 2026", "3", "Overdue"],
        ["INV-2026-0945", "CloudBase Co", "$15,750.00", "Mar 20, 2026", "—", "Pending"],
        ["INV-2026-0951", "NextGen AI", "$12,400.00", "Mar 25, 2026", "—", "Pending"],
      ],
    },
    timestamp: new Date(2026, 2, 12, 14, 32),
  },
];

export default function AuraAIPage() {
  const [messages, setMessages] = useState<Message[]>(MOCK_CONVERSATION);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've analyzed your request: "${content}". In a production environment, I would query your financial data in real time and provide detailed results with visualizations. This is a preview of the Aura AI interface.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center border-b px-6 py-4" style={{borderColor:'var(--mx-border)'}}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{background:'var(--mx-primary-bg)'}}>
              <span className="text-lg font-bold" style={{color:'var(--mx-primary)'}}>A</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Aura AI</h1>
              <p className="text-xs mx-text-secondary">Your intelligent financial assistant</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="mx-tag mx-tag-success">Online</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{background:'var(--mx-primary-bg)'}}>
                <span className="text-3xl font-bold" style={{color:'var(--mx-primary)'}}>A</span>
              </div>
              <h2 className="text-xl font-semibold">Welcome to Aura AI</h2>
              <p className="mt-2 text-sm mx-text-secondary">
                Ask me anything about your financial data.
              </p>
            </div>
          )}

          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{background:'var(--mx-primary-bg)'}}>
                    <span className="text-sm font-bold" style={{color:'var(--mx-primary)'}}>A</span>
                  </div>
                )}
                <div
                  className={`max-w-2xl ${
                    msg.role === "user"
                      ? "rounded-2xl rounded-tr-sm px-4 py-3 text-white"
                      : ""
                  }`}
                  style={msg.role === "user" ? {backgroundColor:'var(--mx-primary)'} : undefined}
                >
                  <p className="text-sm">
                    {msg.content}
                  </p>
                  {msg.table && (
                    <div className="mx-table-container mt-3">
                      <table className="mx-table">
                        <thead>
                          <tr>
                            {msg.table.headers.map((h) => (
                              <th key={h}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {msg.table.rows.map((row, ri) => (
                            <tr
                              key={ri}
                              className={ri === msg.table!.rows.length - 1 ? "font-medium" : ""}
                            >
                              {row.map((cell, ci) => (
                                <td
                                  key={ci}
                                  className={`${ci > 0 ? "mx-text-secondary" : ""} ${cell === "Overdue" ? "text-red-500" : ""} ${
                                    cell === "Pending" ? "text-yellow-500" : ""
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <p className="mt-1 text-xs mx-text-tertiary">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <span className="text-sm font-medium">U</span>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{background:'var(--mx-primary-bg)'}}>
                  <span className="text-sm font-bold" style={{color:'var(--mx-primary)'}}>A</span>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="mx-auto mt-8 max-w-3xl">
              <p className="mb-3 text-sm font-medium mx-text-secondary">Suggested queries</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {SUGGESTED_QUERIES.map((query) => (
                  <button
                    key={query}
                    onClick={() => handleSend(query)}
                    className="mx-card mx-card-white px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4" style={{borderColor:'var(--mx-border)'}}>
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Aura anything about your financial data..."
                className="mx-input w-full pr-12"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] mx-text-secondary" style={{borderColor:'var(--mx-border)'}}>
                Enter
              </kbd>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="mx-btn-primary shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <aside className="hidden w-72 shrink-0 border-l bg-white lg:block" style={{borderColor:'var(--mx-border)'}}>
        <div className="p-4">
          <h3 className="mb-4 mx-h4">Prompt Examples</h3>
          <div className="space-y-4">
            {SIDEBAR_PROMPTS.map((section) => (
              <div key={section.category}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider mx-text-secondary">
                  {section.category}
                </p>
                <div className="space-y-1">
                  {section.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="block w-full rounded-md px-3 py-2 text-left text-xs mx-text-secondary transition-colors hover:bg-gray-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t p-4" style={{borderColor:'var(--mx-border)'}}>
          <h3 className="mb-3 mx-h4">Quick Tips</h3>
          <div className="space-y-2 text-xs mx-text-secondary">
            <p>Ask about revenue, expenses, cash flow, or any financial metric.</p>
            <p>Aura can generate tables, charts, and drill-down views.</p>
            <p>Mention a specific entity to filter results by subsidiary.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
