"use client";

import { motion } from "framer-motion";
import { TrendingUp, Globe, Clock, Activity } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const uptimeData = [
  { name: "Mon", uptime: 99.9 },
  { name: "Tue", uptime: 99.5 },
  { name: "Wed", uptime: 100 },
  { name: "Thu", uptime: 99.8 },
  { name: "Fri", uptime: 99.2 },
  { name: "Sat", uptime: 100 },
  { name: "Sun", uptime: 99.9 },
];

const regionData = [
  { name: "US East", value: 35, color: "#3B82F6" },
  { name: "EU West", value: 25, color: "#8B5CF6" },
  { name: "Asia South", value: 20, color: "#10B981" },
  { name: "US West", value: 15, color: "#F59E0B" },
  { name: "Other", value: 5, color: "#6B7280" },
];

const responseData = [
  { range: "< 100ms", count: 450 },
  { range: "100-300ms", count: 320 },
  { range: "300-500ms", count: 180 },
  { range: "500ms-1s", count: 80 },
  { range: "> 1s", count: 25 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Deep insights into your infrastructure performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Uptime", value: "99.94%", icon: TrendingUp, color: "text-emerald-400" },
          { label: "Avg Response", value: "142ms", icon: Clock, color: "text-blue-400" },
          { label: "Total Checks", value: "1.2M", icon: Activity, color: "text-purple-400" },
          { label: "Regions", value: "5 Active", icon: Globe, color: "text-amber-400" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Uptime Trend (7 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uptimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[98, 100]} stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "8px", color: "#F8FAFC" }} />
                <Bar dataKey="uptime" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Traffic by Region</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={regionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "8px", color: "#F8FAFC" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {regionData.map((r) => (
              <div key={r.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-xs text-slate-400">{r.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Response Time Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responseData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
              <XAxis type="number" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="range" type="category" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "8px", color: "#F8FAFC" }} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

