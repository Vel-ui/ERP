"use client";

import { useState, useCallback } from "react";
import { Button, Input, Modal } from "@/components/ui";

type AssetStatus = "Active" | "Disposed";

interface FixedAsset {
  id: string;
  assetId: string;
  name: string;
  assetClass: string;
  cost: number;
  accumulatedDepreciation: number;
  inServiceDate: string;
  usefulLife: number;
  status: AssetStatus;
  disposalDate?: string;
  saleValue?: number;
}

const statusColors: Record<AssetStatus, string> = {
  Active: "bg-green-500/15 text-green-400 border-green-500/25",
  Disposed: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
};

const mockAssets: FixedAsset[] = [
  { id: "1", assetId: "FA-001", name: "Office Building – HQ", assetClass: "Buildings", cost: 1250000, accumulatedDepreciation: 312500, inServiceDate: "2021-01-15", usefulLife: 40, status: "Active" },
  { id: "2", assetId: "FA-002", name: "Dell Server Cluster", assetClass: "IT Equipment", cost: 85000, accumulatedDepreciation: 56667, inServiceDate: "2022-06-01", usefulLife: 5, status: "Active" },
  { id: "3", assetId: "FA-003", name: "Company Vehicle – Fleet #1", assetClass: "Vehicles", cost: 42000, accumulatedDepreciation: 25200, inServiceDate: "2023-03-10", usefulLife: 5, status: "Active" },
  { id: "4", assetId: "FA-004", name: "Office Furniture Set", assetClass: "Furniture & Fixtures", cost: 18500, accumulatedDepreciation: 7400, inServiceDate: "2023-09-01", usefulLife: 7, status: "Active" },
  { id: "5", assetId: "FA-005", name: "CNC Machine – Floor 2", assetClass: "Machinery", cost: 320000, accumulatedDepreciation: 128000, inServiceDate: "2021-11-20", usefulLife: 10, status: "Active" },
];

export default function FixedAssetsPage() {
  const [assets, setAssets] = useState<FixedAsset[]>(mockAssets);
  const [disposingAsset, setDisposingAsset] = useState<FixedAsset | null>(null);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [saleValue, setSaleValue] = useState("");
  const [saleTax, setSaleTax] = useState("");

  const openDisposal = useCallback((asset: FixedAsset) => {
    setDisposingAsset(asset);
    setSaleDate(new Date().toISOString().split("T")[0]);
    setSaleValue("");
    setSaleTax("");
  }, []);

  const confirmDisposal = useCallback(() => {
    if (!disposingAsset) return;
    setAssets((prev) =>
      prev.map((a) =>
        a.id === disposingAsset.id
          ? {
              ...a,
              status: "Disposed" as AssetStatus,
              disposalDate: saleDate,
              saleValue: parseFloat(saleValue) || 0,
            }
          : a
      )
    );
    setDisposingAsset(null);
  }, [disposingAsset, saleDate, saleValue]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const nbv = (a: FixedAsset) => a.cost - a.accumulatedDepreciation;

  const disposalGainLoss = (() => {
    if (!disposingAsset) return 0;
    const netBookValue = nbv(disposingAsset);
    const proceeds = (parseFloat(saleValue) || 0) - (parseFloat(saleTax) || 0);
    return proceeds - netBookValue;
  })();

  const activeCount = assets.filter((a) => a.status === "Active").length;
  const totalCost = assets.reduce((s, a) => s + a.cost, 0);
  const totalNbv = assets.reduce((s, a) => s + nbv(a), 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Fixed Assets</h1>
          <p className="mt-1 text-muted">
            {activeCount} active assets &middot; Total NBV: {fmt(totalNbv)}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-sidebar p-5">
          <p className="text-sm text-muted">Total Assets</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{assets.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-sidebar p-5">
          <p className="text-sm text-muted">Total Cost</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{fmt(totalCost)}</p>
        </div>
        <div className="rounded-lg border border-border bg-sidebar p-5">
          <p className="text-sm text-muted">Net Book Value</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{fmt(totalNbv)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-sidebar">
                <th className="px-4 py-3 text-left font-medium text-muted">Asset ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Class</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Cost</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Accum. Depr.</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Net Book Value</th>
                <th className="px-4 py-3 text-left font-medium text-muted">In Service</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Useful Life</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-border last:border-0 hover:bg-sidebar-hover transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-foreground">{asset.assetId}</td>
                  <td className="px-4 py-3 text-foreground font-medium">{asset.name}</td>
                  <td className="px-4 py-3 text-muted">{asset.assetClass}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{fmt(asset.cost)}</td>
                  <td className="px-4 py-3 text-right font-mono text-red-400">{fmt(asset.accumulatedDepreciation)}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground font-medium">{fmt(nbv(asset))}</td>
                  <td className="px-4 py-3 text-muted">{asset.inServiceDate}</td>
                  <td className="px-4 py-3 text-muted">{asset.usefulLife} yr</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[asset.status]}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {asset.status === "Active" && (
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => openDisposal(asset)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Dispose
                      </Button>
                    )}
                    {asset.status === "Disposed" && (
                      <span className="text-xs text-muted">
                        {asset.disposalDate}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disposal Modal */}
      <Modal
        isOpen={!!disposingAsset}
        onClose={() => setDisposingAsset(null)}
        title="Dispose Asset"
        size="md"
      >
        {disposingAsset && (
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-sidebar p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Asset</span>
                <span className="text-foreground font-medium">{disposingAsset.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Original Cost</span>
                <span className="text-foreground font-mono">{fmt(disposingAsset.cost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Accumulated Depreciation</span>
                <span className="text-red-400 font-mono">{fmt(disposingAsset.accumulatedDepreciation)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-muted font-medium">Net Book Value</span>
                <span className="text-foreground font-mono font-medium">{fmt(nbv(disposingAsset))}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Input
                label="Sale Date"
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
              />
              <Input
                label="Sale Value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={saleValue}
                onChange={(e) => setSaleValue(e.target.value)}
              />
              <Input
                label="Tax"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={saleTax}
                onChange={(e) => setSaleTax(e.target.value)}
              />
            </div>

            {/* Gain/Loss preview */}
            <div className="rounded-lg border border-border bg-sidebar p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Gain / (Loss) on Disposal</span>
                <span className={`font-mono font-medium ${disposalGainLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {disposalGainLoss >= 0 ? "" : "("}
                  {fmt(Math.abs(disposalGainLoss))}
                  {disposalGainLoss < 0 ? ")" : ""}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="text" onClick={() => setDisposingAsset(null)}>
                Cancel
              </Button>
              <Button
                onClick={confirmDisposal}
                className="bg-red-600 hover:bg-red-500"
              >
                Confirm Disposal
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
