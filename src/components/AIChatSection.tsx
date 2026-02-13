import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Trash2 } from "lucide-react";

// Mock AI responses
const mockResponses: { [key: string]: string } = {
  emissions:
    "Energy usage rose **22%** between 3–5 PM due to HVAC load surge and reduced solar production from cloud cover.\n\n**Root Cause:** Zone C HVAC units ramped to full capacity during peak occupancy, while solar output dropped 34% from cloud coverage.\n\n**Recommended Actions:**\n• Shift non-critical loads to off-peak hours\n• Enable smart cooling mode in Zone C\n• Pre-cool buildings using morning solar surplus\n\n*Confidence: 94% — Based on 48h rolling window analysis*",

  energy:
    "Current energy consumption is **4.2 MW**, which is **18% above baseline** for this time of day.\n\n**Peak Consumers:**\n• HVAC System: 2.1 MW (50%)\n• Lighting: 0.8 MW (19%)\n• Equipment: 1.3 MW (31%)\n\n**Optimization Opportunity:** You could reduce consumption by ~12% by scheduling non-essential equipment maintenance during off-peak hours.\n\n*Updated: 2 seconds ago*",

  anomaly:
    "**3 Anomalies Detected Today:**\n\n1. **Building D - Zone 2** (Critical)\n   - Electric consumption spike at 14:32\n   - +156% above normal pattern\n   - Root Cause: HVAC equipment malfunction detected\n\n2. **Solar Production** (Warning)\n   - Cloud cover caused 40% output reduction\n   - Expected to normalize by 18:00\n\n3. **Power Factor** (Info)\n   - Slight deviation from ideal range\n   - No immediate action required\n\n*Alert confidence: 96%*",

  carbon:
    "Current carbon intensity: **42 gCO2/kWh**\n\n**Hourly Trend:**\n• 10:00 AM: 38 gCO2/kWh (↓ Low)\n• 01:00 PM: 45 gCO2/kWh (↑ Medium)\n• 04:00 PM: 42 gCO2/kWh (→ Stable)\n\n**Grid Energy Mix Right Now:**\n• Solar: 32% ☀️\n• Wind: 28% 💨\n• Natural Gas: 25%\n• Hydro: 15%\n\n**Recommendation:** Best time to consume energy is now with high renewable penetration!\n\n*Data from regional grid operator (2 min ago)*",

  default:
    "I'm the GreenStream AI Assistant, powered by real-time data and RAG intelligence.\n\nI can help you understand:\n• Why emissions or energy consumption changed\n• Identify anomalies and root causes\n• Get optimization recommendations\n• Track carbon intensity trends\n\nTry asking: 'Why did emissions increase?' or 'What's my current energy consumption?'\n\n*What would you like to explore?*",
};

interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
  isTyping?: boolean;
}

const AIChatSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      text: "Hi! I'm your GreenStream AI Assistant. Ask me anything about your energy consumption, emissions, or anomalies. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    "Why did emissions increase today?",
    "What's my current energy consumption?",
    "Are there any anomalies detected?",
    "What's the current carbon intensity?",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      type: "ai",
      text: "",
      isTyping: true,
    };

    setMessages((prev) => [...prev, typingMessage]);
    setInput("");
    setIsLoading(true);

    // Determine response based on keywords
    setTimeout(() => {
      let response = mockResponses.default;

      const lowerInput = input.toLowerCase();
      if (
        lowerInput.includes("emission") ||
        lowerInput.includes("why did")
      ) {
        response = mockResponses.emissions;
      } else if (
        lowerInput.includes("energy") ||
        lowerInput.includes("consumption")
      ) {
        response = mockResponses.energy;
      } else if (
        lowerInput.includes("anomal") ||
        lowerInput.includes("detect")
      ) {
        response = mockResponses.anomaly;
      } else if (
        lowerInput.includes("carbon") ||
        lowerInput.includes("intensity")
      ) {
        response = mockResponses.carbon;
      }

      // Remove typing message and add response
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => !msg.isTyping);
        return [
          ...withoutTyping,
          {
            id: `ai-${Date.now()}`,
            type: "ai",
            text: response,
          },
        ];
      });

      setIsLoading(false);
    }, 1000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "1",
        type: "ai",
        text: "Hi! I'm your GreenStream AI Assistant. Ask me anything about your energy consumption, emissions, or anomalies. What would you like to know?",
      },
    ]);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <section className="py-32 px-6 relative" id="assistant">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(150_20%_4%)] to-background" />
      <div className="relative z-10 max-w-4xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            AI <span className="text-gradient">Assistant</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ask anything. Get explainable, contextual insights in real-time.
          </p>
        </motion.div>

        <motion.div
          className="glass-panel p-0 overflow-hidden glow-blue flex flex-col h-[600px]"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between gap-3 p-6 border-b border-border bg-gradient-to-r from-secondary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-secondary animate-pulse-glow" />
              </div>
              <div>
                <p className="text-sm font-heading font-semibold">
                  GreenStream AI Assistant
                </p>
                <p className="text-xs text-primary">● Online — RAG-powered</p>
              </div>
            </div>
            {messages.length > 1 && (
              <button
                onClick={handleClear}
                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "ai" && (
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-secondary" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 max-w-xs md:max-w-md lg:max-w-lg ${
                      message.type === "user"
                        ? "bg-primary/20 text-foreground rounded-tr-sm"
                        : "bg-secondary/5 border border-secondary/10 rounded-tl-md text-muted-foreground"
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-200" />
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions or input area */}
          {messages.length === 1 && (
            <div className="p-6 border-t border-border space-y-3 bg-gradient-to-t from-background to-transparent">
              <p className="text-xs text-muted-foreground font-semibold mb-3">
                TRY ASKING:
              </p>
              <div className="space-y-2">
                {suggestedQuestions.map((question, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left text-sm p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 hover:border-secondary/40 transition-all text-muted-foreground hover:text-foreground"
                  >
                    → {question}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="p-4 border-t border-border bg-gradient-to-t from-background to-transparent">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Ask about emissions, energy, anomalies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSend();
                  }
                }}
                disabled={isLoading}
                className="flex-1 bg-muted/30 rounded-xl px-4 py-3 text-sm outline-none border border-border focus:border-secondary/40 transition-colors disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-secondary/10 hover:bg-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4 text-secondary" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIChatSection;
