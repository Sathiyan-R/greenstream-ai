import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, User, Send } from "lucide-react";

const aiResponse = `Energy usage rose **22%** between 3–5 PM due to HVAC load surge and reduced solar production from cloud cover.

**Root Cause:** Zone C HVAC units ramped to full capacity during peak occupancy, while solar output dropped 34% from cloud coverage.

**Recommended Actions:**
• Shift non-critical loads to off-peak hours
• Enable smart cooling mode in Zone C
• Pre-cool buildings using morning solar surplus

*Confidence: 94% — Based on 48h rolling window analysis*`;

const AIChatSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setIsTyping(true);
    let i = 0;
    const timer = setInterval(() => {
      if (i < aiResponse.length) {
        setDisplayedText(aiResponse.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 12);
    return () => clearInterval(timer);
  }, [inView]);

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
          className="glass-panel p-6 md:p-8 glow-blue"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-heading font-semibold">GreenStream AI Assistant</p>
              <p className="text-xs text-primary">● Online — RAG-powered</p>
            </div>
          </div>

          {/* User message */}
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="bg-muted/50 rounded-2xl rounded-tl-md px-4 py-3 max-w-lg">
              <p className="text-sm">Why did Building A's emissions increase today?</p>
            </div>
          </div>

          {/* AI response */}
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-secondary" />
            </div>
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-2xl">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {isTyping && <span className="inline-block w-2 h-4 bg-secondary ml-1 animate-pulse-glow" />}
              </p>
            </div>
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <input
              type="text"
              placeholder="Ask about emissions, energy, or anomalies..."
              className="flex-1 bg-muted/30 rounded-xl px-4 py-3 text-sm outline-none border border-border focus:border-secondary/40 transition-colors"
              readOnly
            />
            <button className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors">
              <Send className="w-4 h-4 text-secondary" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIChatSection;
