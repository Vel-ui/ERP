"use client";

import { useState, useCallback } from "react";
import { Building2, Server, Car, Package } from "lucide-react";
import { Button, Input, Modal, Tag } from "@/components/ui";

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

const mockAssets: FixedAsset[] = [
  { id: "1", assetId: "FA-001", name: "Office Building – HQ", assetClass: "Buildings", cost: 1250000, accumulatedDepreciation: 312500, inServiceDate: "2021-01-15", usefulLife: 40, status: "Active" },
  { id: "2", assetId: "FA-002", name: "Dell Server Cluster", assetClass: "IT Equipment", cost: 85000, accumulatedDepreciation: 56667, inServiceDate: "2022-06-01", usefulLife: 5, status: "Active" },
  { id: "3", assetId: "FA-003", name: "Company Vehicle – Fleet #1", assetClass: "Vehicles", cost: 42000, accumulatedDepreciation: 25200, inServiceDate: "2023-03-10", usefulLife: 5, status: "Active" },
  { id: "4", assetId: "FA-004", name: "Office Furniture Set", assetClass: "Furniture & Fixtures", cost: 18500, accumulatedDepreciation: 7400, inServiceDate: "2023-09-01", usefulLife: 7, status: "Active" },
  { id: "5", assetId: "FA-005", name: "CNC Machine – Floor 2", assetClass: "Machinery", cost: 320000, accumulatedDepreciation: 128000, inServiceDate: "2021-11-20", usefulLife: 10, status: "Active" },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

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
    setAssets((prev) => prev.map((a) => a.id === disposingAsset.id ? { ...a, status: "Disposed" as AssetStatus, disposalDate: saleDate, saleValue: parseFloat(saleValue) || 0 } : a));
    setDisposingAsset(null);
  }, [disposingAsset, saleDate, saleValue]);

  const nbv = (a: FixedAsset) => a.cost - a.accumulatedDepreciation;
  const activeCount = assets.filter((a) => a.status === "Active").length;
  const totalCost = assets.reduce((s, a) => s + a.cost, 0);
  const totalNbv = assets.reduce((s, a) => s + nbv(a), 0);

  const disposalGainLoss = (() => {
    if (!disposingAsset) return 0;
    const proceeds = (parseFloat(saleValue) || 0) - (parseFloat(saleTax) || 0);
    return proceeds - nbv(disposingAsset);
  })();

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Fixed Assets</h1>
            <p className="mx-text-secondary mt-1">{activeCount} active assets &middot; Total NBV: {formatCurrency(totalNbv)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="mx-card" style={{ padding: 20 }}>
            <p className="mx-text-secondary" style={{ fontSize: 13 }}>Total Assets</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#2D2926', marginTop: 4 }}>{assets.length}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <p className="mx-text-secondary" style={{ fontSize: 13 }}>Total Cost</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#2D2926', marginTop: 4 }}>{formatCurrency(totalCost)}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <p className="mx-text-secondary" style={{ fontSize: 13 }}>Net Book Value</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#2D2926', marginTop: 4 }}>{formatCurrency(totalNbv)}</p>
          </div>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Class</th>
                <th style={{ textAlign: 'right' }}>Cost</th>
                <th style={{ textAlign: 'right' }}>Accum. Depr.</th>
                <th style={{ textAlign: 'right' }}>Net Book Value</th>
                <th>In Service</th>
                <th>Useful Life</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td style={{ fontFamily: 'monospace', color: '#2D2926' }}>{asset.assetId}</td>
                  <td style={{ fontWeight: 500, color: '#2D2926' }}>{asset.name}</td>
                  <td>{asset.assetClass}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#2D2926' }}>{formatCurrency(asset.cost)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#f03c46' }}>{formatCurrency(asset.accumulatedDepreciation)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 500, color: '#2D2926' }}>{formatCurrency(nbv(asset))}</td>
                  <td>{asset.inServiceDate}</td>
                  <td>{asset.usefulLife} yr</td>
                  <td><Tag variant={asset.status === "Active" ? "success" : "default"}>{asset.status}</Tag></td>
                  <td style={{ textAlign: 'right' }}>
                    {asset.status === "Active" && (
                      <Button variant="danger" size="sm" onClick={() => openDisposal(asset)}>Dispose</Button>
                    )}
                    {asset.status === "Disposed" && (
                      <span className="mx-text-secondary" style={{ fontSize: 12 }}>{asset.disposalDate}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={!!disposingAsset} onClose={() => setDisposingAsset(null)} title="Dispose Asset" size="md">
          {disposingAsset && (
            <div className="space-y-5">
              <div className="mx-card" style={{ padding: 16 }}>
                <div className="flex justify-between" style={{ fontSize: 14, marginBottom: 8 }}>
                  <span className="mx-text-secondary">Asset</span>
                  <span style={{ fontWeight: 500, color: '#2D2926' }}>{disposingAsset.name}</span>
                </div>
                <div className="flex justify-between" style={{ fontSize: 14, marginBottom: 8 }}>
                  <span className="mx-text-secondary">Original Cost</span>
                  <span style={{ fontFamily: 'monospace', color: '#2D2926' }}>{formatCurrency(disposingAsset.cost)}</span>
                </div>
                <div className="flex justify-between" style={{ fontSize: 14, marginBottom: 8 }}>
                  <span className="mx-text-secondary">Accumulated Depreciation</span>
                  <span style={{ fontFamily: 'monospace', color: '#f03c46' }}>{formatCurrency(disposingAsset.accumulatedDepreciation)}</span>
                </div>
                <div className="flex justify-between" style={{ fontSize: 14, paddingTop: 8, borderTop: '1px solid #E9E9E9' }}>
                  <span className="mx-text-secondary" style={{ fontWeight: 500 }}>Net Book Value</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 500, color: '#2D2926' }}>{formatCurrency(nbv(disposingAsset))}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Input label="Sale Date" type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
                <Input label="Sale Value" type="number" step="0.01" min="0" placeholder="0.00" value={saleValue} onChange={(e) => setSaleValue(e.target.value)} />
                <Input label="Tax" type="number" step="0.01" min="0" placeholder="0.00" value={saleTax} onChange={(e) => setSaleTax(e.target.value)} />
              </div>
              <div className="mx-card" style={{ padding: 16 }}>
                <div className="flex justify-between" style={{ fontSize: 14 }}>
                  <span className="mx-text-secondary">Gain / (Loss) on Disposal</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 500, color: disposalGainLoss >= 0 ? '#067f54' : '#f03c46' }}>
                    {disposalGainLoss >= 0 ? "" : "("}
                    {formatCurrency(Math.abs(disposalGainLoss))}
                    {disposalGainLoss < 0 ? ")" : ""}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="default" onClick={() => setDisposingAsset(null)}>Cancel</Button>
                <Button variant="danger" onClick={confirmDisposal}>Confirm Disposal</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
