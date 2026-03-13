import { GitCompare, Clock, Shield } from "lucide-react";

export default function ReconciliationsPage() {
  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Reconciliations</h1>
            <p className="mx-text-secondary mt-1">Account reconciliations and balance verification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="mx-card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#e8edeb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <GitCompare size={32} style={{ color: '#154738' }} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#2D2926', marginBottom: 8 }}>Account Reconciliation</h2>
            <p className="mx-text-secondary" style={{ fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
              Automated matching of GL balances to subledger and bank statement balances. Reconcile cash, AR, AP, and intercompany accounts with configurable matching rules.
            </p>
          </div>

          <div className="mx-card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f3f1fb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Shield size={32} style={{ color: '#a3a0af' }} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#2D2926', marginBottom: 8 }}>Certification Workflow</h2>
            <p className="mx-text-secondary" style={{ fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
              Multi-level certification process for reconciled accounts. Preparers complete reconciliation, reviewers verify accuracy, and controllers certify for close.
            </p>
          </div>
        </div>

        <div className="mx-card mt-6" style={{ padding: 24 }}>
          <div className="flex items-center gap-3 mb-4">
            <Clock size={20} style={{ color: '#e8bf1b' }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D2926' }}>Coming Soon</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Automated bank reconciliation with transaction matching",
              "Subledger-to-GL reconciliation workflows",
              "Intercompany balance verification",
              "Configurable matching rules and thresholds",
              "Reconciliation status tracking and reporting",
              "Multi-level certification and sign-off",
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-2" style={{ fontSize: 13 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#154738', marginTop: 6, flexShrink: 0 }} />
                <span className="mx-text-secondary">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
