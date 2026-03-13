"use client";

import { useState } from "react";
import { Landmark } from "lucide-react";

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
          <h1 className="mx-h1">Banks</h1>
          <p className="mt-1 text-sm mx-text-secondary">
            Connect your bank accounts via Plaid. 2FA may require periodic re-auth.
          </p>
        </div>
        <button className="mx-btn-primary">+ Add Institution Connection</button>
      </div>

      {banks.length === 0 ? (
        <div className="mx-card mx-card-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{background:'var(--mx-primary-bg)'}}>
            <Landmark size={28} style={{color:'var(--mx-primary)'}} />
          </div>
          <p className="font-medium">No bank connections yet</p>
          <p className="mt-1 text-sm mx-text-secondary">
            Connect your first bank to sync transactions for cash reconciliation
          </p>
          <button className="mx-btn-primary mt-4">+ Add Institution Connection</button>
        </div>
      ) : (
        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Institution</th>
                <th>Type</th>
                <th>Last 4</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr key={bank.id} className="hover:bg-gray-50">
                  <td className="font-medium">{bank.name}</td>
                  <td className="mx-text-secondary">{bank.institution}</td>
                  <td className="mx-text-secondary">{bank.accountType}</td>
                  <td className="mx-text-secondary">••••{bank.lastFour}</td>
                  <td>
                    <span className="mx-tag mx-tag-success">{bank.status}</span>
                  </td>
                  <td>
                    <button className="text-sm hover:underline" style={{color:'var(--mx-primary)'}}>Reconnect</button>
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
