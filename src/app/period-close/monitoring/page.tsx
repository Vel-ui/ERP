import { Activity, Bell, BarChart3, Clock } from "lucide-react";

export default function MonitoringPage() {
  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Close Monitoring</h1>
            <p className="mx-text-secondary mt-1">Real-time monitoring of period close progress and anomalies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="mx-card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#e8edeb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Activity size={32} style={{ color: '#154738' }} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#2D2926', marginBottom: 8 }}>Real-Time Dashboard</h2>
            <p className="mx-text-secondary" style={{ fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
              Live tracking of close progress across all workstreams. Monitor task completion, identify bottlenecks, and track SLA compliance in real time.
            </p>
          </div>

          <div className="mx-card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#fffbe9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Bell size={32} style={{ color: '#e8bf1b' }} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#2D2926', marginBottom: 8 }}>Smart Alerts</h2>
            <p className="mx-text-secondary" style={{ fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
              Automated alerts for overdue tasks, unusual variances, and process anomalies. Configurable notification rules by role, threshold, and priority.
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
              "Live close progress dashboard with timeline view",
              "Task dependency tracking and critical path analysis",
              "Automated anomaly detection for journal entries",
              "SLA tracking with escalation workflows",
              "Historical close performance analytics",
              "Configurable alert rules and notification channels",
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
