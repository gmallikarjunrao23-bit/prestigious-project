"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "00:00", uptime: 100, response: 120 },
  { time: "04:00", uptime: 99.9, response: 145 },
  { time: "08:00", uptime: 100, response: 110 },
  { time: "12:00", uptime: 99.5, response: 180 },
  { time: "16:00", uptime: 100, response: 95 },
  { time: "20:00", uptime: 99.8, response: 130 },
  { time: "23:59", uptime: 100, response: 115 },
];

export function ActivityChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-5"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Response Time & Uptime</h2>
          <p className="text-sm text-slate-500 mt-0.5">Last 24 hours performance</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500/50" />
            <span className="text-slate-400">Response Time (ms)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            <span className="text-slate-400">Uptime %</span>
          </div>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={[90, 100]} yAxisId="uptime" orientation="right" />
            <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} yAxisId="response" orientation="left" />
            <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "8px", color: "#F8FAFC" }} />
            <Area yAxisId="response" type="monotone" dataKey="response" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorResponse)" />
            <Area yAxisId="uptime" type="monotone" dataKey="uptime" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorUptime)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

