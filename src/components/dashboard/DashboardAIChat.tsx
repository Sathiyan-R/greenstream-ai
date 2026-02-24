import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Trash2, Sparkles } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import type { DashboardState } from "@/lib/api";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  "Why did emissions increase?",
  "What will happen tomorrow?",
  "Is there abnormal activity?",
  "Give sustainability suggestions.",
];

const DashboardAIChat = ({ dashboardState }: { dashboardState: DashboardState }) => {
  const { messages, isLoading, send, clear } = useAIChat(dashboardState);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    send(input.trim());
    setInput("");
  };

  return (
    <div className="glass-panel glow-blue flex flex-col h-[500px]">
      {