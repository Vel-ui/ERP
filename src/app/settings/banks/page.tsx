"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

// Mock bank connections
const MOCK_BANKS = [
  {
    id: "1",
    name: "Chase Business Checking",
    institution: "Chase",
    accountType: "Checking",
    lastFour: "4521",
    status: "Connected",
  },
  {
    id: "2",
    name: "Mercury",
    institution: "Mercury",
    accountType: "Checking",
    lastFour: "8892",
    status: "Connected",
  },
];

export default function BanksPage() {
  const [banks] = useState(MOCK_BANKS);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Banks</h1>
          <p className="mt-1 text-sm text-muted">
            Connect your bank accounts via Plaid. 2FA may require periodic re-auth.
          </p>
        </div>
        <Button>+ Add Institution Connection</Button>
      </div>

      {banks.length === 0 ? (
        <div className="rounded-lg border border-border bg-sidebar p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-3xl">
            🏦
          </div>
          <p className="text-foreground">No bank connections yet</p>
          <p className="mt-1 text-sm text-muted">
            Connect your first bank to sync transactions for cash reconciliation
          </p>
          <Button className="mt-4">+ Add Institution Connection</Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-sidebar">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted">
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 font-medium">Institution</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Last 4</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr
                  key={bank.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-sidebar-hover"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{bank.name}</td>
                  <td className="px-4 py-3 text-muted">{bank.institution}</td>
                  <td className="px-4 py-3 text-muted">{bank.accountType}</td>
                  <td className="px-4 py-3 text-muted">••••{bank.lastFour}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      {bank.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-accent hover:underline">Reconnect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
