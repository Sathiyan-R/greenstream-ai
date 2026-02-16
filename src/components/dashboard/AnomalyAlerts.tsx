import { memo } from "react";
import { AlertTriangle, X } from "lucide-react";
import type { Anomaly } from "@/lib/anomalyDetection";
import { getSeverityColor, getSeverityBgColor } from "@/lib/anomalyDetection";
import { Button } from "@/components/ui/button";

interface AnomalyAlertsProps {
  anomalies: Anomaly[];
  onDismiss?: (id: string) => void;
  maxDisplay?: number;
}

/**
 * Anomaly Alert Item Component
 */
const AnomalyAlertItem = memo(
  ({ anomaly, onDismiss }: { anomaly: Anomaly; onDismiss?: (id: string) => void }) => {
    const severityColor = getSeverityColor(anomaly.severity);
    const bgColor = getSeverityBgColor(anomaly.severity);

    return (
      <div
        className={`border rounded-lg p-3 ${bgColor} flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300`}
      >
        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${severityColor}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{anomaly.metric}</p>
          <p className="text-xs text-muted-foreground mt-1">{anomaly.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs font-mono text-muted-foreground">
            <span>Expected: {anomaly.expectedValue.toFixed(1)}</span>
            <span>•</span>
            <span>Current: {anomaly.currentValue.toFixed(1)}</span>
            <span>•</span>
            <span>Deviation: {anomaly.deviation.toFixed(1)}</span>
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0"
            onClick={() => onDismiss(anomaly.id)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }
);

AnomalyAlertItem.displayName = "AnomalyAlertItem";

/**
 * Anomaly Alerts Panel
 * Displays detected anomalies with severity indicators
 */
export const AnomalyAlerts = memo(
  ({ anomalies, onDismiss, maxDisplay = 5 }: AnomalyAlertsProps) => {
    if (!anomalies || anomalies.length === 0) {
      return null;
    }

    const displayedAnomalies = anomalies.slice(0, maxDisplay);
    const hiddenCount = Math.max(0, anomalies.length - maxDisplay);

    return (
      <div className="space-y-2">
        {displayedAnomalies.map((anomaly) => (
          <AnomalyAlertItem key={anomaly.id} anomaly={anomaly} onDismiss={onDismiss} />
        ))}

        {hiddenCount > 0 && (
          <div className="p-2 bg-muted/30 rounded-lg border border-border/30 text-center">
            <p className="text-xs text-muted-foreground">+{hiddenCount} more anomaly alert(s)</p>
          </div>
        )}
      </div>
    );
  }
);

AnomalyAlerts.displayName = "AnomalyAlerts";

/**
 * Compact Anomaly Notification Badge
 * Shows count of active anomalies
 */
export const AnomalyBadge = memo(({ count, severe }: { count: number; severe?: boolean }) => {
  if (count === 0) return null;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
        severe ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
      }`}
    >
      <AlertTriangle className="w-3 h-3" />
      <span>{count} anomaly</span>
      {count !== 1 && <span>-ies</span>}
    </div>
  );
});

AnomalyBadge.displayName = "AnomalyBadge";

/**
 * Anomaly Statistics Summary
 */
export const AnomalySummary = memo(({ anomalies }: { anomalies: Anomaly[] }) => {
  const highSeverity = anomalies.filter((a) => a.severity === "high").length;
  const mediumSeverity = anomalies.filter((a) => a.severity === "medium").length;
  const lowSeverity = anomalies.filter((a) => a.severity === "low").length;

  if (anomalies.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <p className="text-sm font-semibold text-green-800">✅ No anomalies detected</p>
        <p className="text-xs text-green-700 mt-1">All metrics within expected ranges</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold">Anomaly Summary</p>
        <span className="text-lg font-bold text-muted-foreground">{anomalies.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        {highSeverity > 0 && (
          <div className="space-y-1">
            <p className="text-red-600 font-semibold">{highSeverity}</p>
            <p className="text-muted-foreground">High</p>
          </div>
        )}
        {mediumSeverity > 0 && (
          <div className="space-y-1">
            <p className="text-orange-600 font-semibold">{mediumSeverity}</p>
            <p className="text-muted-foreground">Medium</p>
          </div>
        )}
        {lowSeverity > 0 && (
          <div className="space-y-1">
            <p className="text-yellow-600 font-semibold">{lowSeverity}</p>
            <p className="text-muted-foreground">Low</p>
          </div>
        )}
      </div>
    </div>
  );
});

AnomalySummary.displayName = "AnomalySummary";
