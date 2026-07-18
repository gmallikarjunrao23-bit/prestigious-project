"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const insights = [
  {
    id: 1,
    type: "prediction",
    title: "Latency spike predicted",
    description: "API Gateway response time trending upward. Expected to exceed 500ms threshold within 2 hours.",
    confidence: 87,
    severity: "medium" as const,
    icon: TrendingUp,
  },
  {
    id: 2,
    type: "recommendation",
    title: "Enable caching layer",
    description: "Database queries show 40% repeat rate. Redis caching could reduce response time by 60%.",
    confidence: 92,
    severity: "low" as const,
    icon: Lightbulb,
  },
  {
    id: 3,
    type: "anomaly",
    title: "Unusual traffic pattern",
    description: "Asia region showing 3x normal request volume. No corresponding user growth detected.",
    confidence: 78,
    severity: "high" as const,
    icon: AlertCircle,
  },
];

const severityColors = {
  low: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  critical: "text-red-500 bg-red-500/20 border-red-500/30",
};

export function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden"
    >
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">AI Insights</h2>
          <p className="text-sm text-slate-500">Powered by GPT-4 Operations Engine</p>
        </div>
      </div>

      <div className="divide-y divide-slate-800/50">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="p-4 border-l-2 hover:bg-slate-800/30 transition-colors cursor-pointer"
            style={{ borderLeftColor: insight.severity === "high" ? "#EF4444" : insight.severity === "medium" ? "#F59E0B" : "#3B82F6" }}
          >
            <div className="flex items-start gap-3">
              <div className={cn("p-1.5 rounded-md mt-0.5", severityColors[insight.severity].split(" ").slice(1, 3).join(" "))}>
                <insight.icon className={cn("w-4 h-4", severityColors[insight.severity].split(" ")[0])} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-white">{insight.title}</h3>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase", severityColors[insight.severity])}>
                    {insight.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{insight.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all" style={{ width: `${insight.confidence}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500">{insight.confidence}% confidence</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

