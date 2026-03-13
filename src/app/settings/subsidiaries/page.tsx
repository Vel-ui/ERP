"use client";

import { useState } from "react";
import Link from "next/link";

const SUBSIDIARIES = [
  {
    id: "sub-1",
    name: "Maximor US",
    legalEntity: "Maximor Inc.",
    country: "United States",
    currency: "USD",
    status: "Active" as const,
  },
  {
    id: "sub-2",
    name: "Maximor UK",
    legalEntity: "Maximor Ltd.",
    country: "United Kingdom",
    currency: "GBP",
    status: "Active" as const,
  },
  {
    id: "sub-3",
    name: "Maximor Europe",
    legalEntity: "Maximor GmbH",
    country: "Germany",
    currency: "EUR",
    status: "Active" as const,
  },
  {
    id: "sub-4",
    name: "Maximor Canada",
    legalEntity: "Maximor Canada Corp.",
    country: "Canada",
    currency: "CAD",
    status: "Inactive" as const,
  },
];

export default function SubsidiariesPage() {
  const [search, setSearch] = useState("");

  const filtered = SUBSIDIARIES.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.legalEntity.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mx-h1">Subsidiaries</h1>
          <p className="mt-1 text-sm mx-text-secondary">
            Manage legal entities, currencies, and multi-entity structure.
          </p>
        </div>
        <button className="mx-btn-primary">Add Subsidiary</button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search subsidiaries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mx-input w-full max-w-sm"
        />
      </div>

      <div className="mx-table-container">
        <table className="mx-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Legal Entity</th>
              <th>Country</th>
              <th>Currency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td>
                  <Link
                    href={`/settings/subsidiaries/${sub.id}`}
                    className="font-medium hover:underline"
                    style={{color:'var(--mx-primary)'}}
                  >
                    {sub.name}
                  </Link>
                </td>
                <td className="text-sm mx-text-secondary">{sub.legalEntity}</td>
                <td className="text-sm mx-text-secondary">{sub.country}</td>
                <td>
                  <span className="mx-tag">{sub.currency}</span>
                </td>
                <td>
                  <span
                    className={
                      sub.status === "Active"
                        ? "mx-tag mx-tag-success"
                        : "mx-tag mx-tag-warning"
                    }
                  >
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-sm mx-text-secondary">
            No subsidiaries match your search.
          </div>
        )}
      </div>
    </div>
  );
}
