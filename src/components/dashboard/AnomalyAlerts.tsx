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

