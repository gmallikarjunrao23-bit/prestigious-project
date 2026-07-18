"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  AlertTriangle,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { cn, formatUptime, getHealthScoreColor } from "@/lib/utils";
import { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Monitors",
      value: stats.totalMonitors,
      subtitle: `${stats.activeMonitors} active`,
      icon: Monitor,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      trend: stats.activeMonitors > 0 ? "up" : "neutral",
    },
    {
      title: "System Uptime",
      value: formatUptime(stats.avgUptime),
      subtitle: "Last 24 hours",
      icon: Activity,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      trend: stats.avgUptime > 99 ? "up" : stats.avgUptime > 95 ? "neutral" : "down",
    },
    {
      title: "Avg Response Time",
      value: `${stats.avgResponseTime}ms`,
      subtitle: "Global average",
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      trend: stats.avgResponseTime < 300 ? "up" : stats.avgResponseTime < 800 ? "neutral" : "down",
    },
    {
      title: "Open Incidents",
      value: stats.openIncidents,
      subtitle: `${stats.downMonitors} monitors down`,
      icon: AlertTriangle,
      color: stats.openIncidents > 0 ? "text-red-400" : "text-emerald-400",
      bgColor: stats.openIncidents > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
      borderColor: stats.openIncidents > 0 ? "border-red-500/20" : "border-emerald-500/20",
      trend: stats.openIncidents > 0 ? "down" : "up",
    },
    {
      title: "Health Score",
      value: `${stats.healthScore}`,
      subtitle: "AI calculated",
      icon: Activity,
      color: getHealthScoreColor(stats.healthScore),
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      trend: stats.healthScore > 90 ? "up" : "neutral",
    },
    {
      title: "Checks Today",
      value: stats.checksToday.toLocaleString(),
      subtitle: "Total checks run",
      icon: Monitor,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      trend: "neutral",
    },
  ];

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-slate-500" />;
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
    >
      {cards.map((card) => (
        <motion.div
          key={card.title}
          variants={item}
          className={cn(
            "relative overflow-hidden rounded-xl border p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20",
            card.bgColor,
            card.borderColor
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-400">{card.title}</p>
              <div className="flex items-baseline gap-2">
                <span className={cn("text-2xl font-bold tracking-tight", card.color)}>
                  {card.value}
                </span>
                <TrendIcon trend={card.trend} />
              </div>
              <p className="text-xs text-slate-500">{card.subtitle}</p>
            </div>
            <div className={cn("p-2.5 rounded-lg", card.bgColor)}>
              <card.icon className={cn("w-5 h-5", card.color)} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
        </motion.div>
      ))}
    </motion.div>
  );
}

