import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Zap } from "lucide-react";
import { ZoneData } from "@/types/map";
import { useDNACalculation, getRiskColor, getRiskBgColor, traitMetadata } from "@/hooks/useDNACalculation";
import { DNARadarChart } from "./DNARadarChart";
import { Button } from "@/components/ui/button";

interface AlertDNAPanelProps {
  zone: ZoneData | null;
  isOpen: boolean;
  onClose: () => void;
}

