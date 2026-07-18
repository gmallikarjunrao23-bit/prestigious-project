"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Clock,
  Activity,
  MoreHorizontal,
  Pause,
  Play,
} from "lucide-react";
import { cn, getStatusColor, formatDuration } from "@/lib/utils";
import { Monitor as MonitorType } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardOverviewProps {
  monitors: MonitorType[];
}

export function DashboardOverview({ monitors }: DashboardOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden"
    >
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Active Monitors</h2>
          <p className="text-sm text-slate-500 mt-0.5">Real-time status overview</p>
        </div>
        <Link
          href="/monitors"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="divide-y divide-slate-800/50">
        {monitors.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400 font-medium">No monitors yet</p>
            <p className="text-sm text-slate-600 mt-1">Create your first monitor to get started</p>
          </div>
        ) : (
          monitors.map((monitor, index) => {
            const lastCheck = monitor.checks?.[0];
            const status = lastCheck?.status || "UP";
            const isUp = status === "UP";

            return (
              <motion.div
                key={monitor.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-slate-800/30 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", 
                      isUp ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                      "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    )} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white truncate">
                          {monitor.name}
                        </h3>
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider",
                          getStatusColor(status)
                        )}>
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {monitor.url}
                        </span>
                        <span className="text-xs text-slate-600">|</span>
                        <span className="text-xs text-slate-500">
                          {lastCheck?.responseTime ? formatDuration(lastCheck.responseTime) : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white">
                      {monitor.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                        <DropdownMenuItem className="text-slate-300 focus:text-white focus:bg-slate-800 cursor-pointer">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-300 focus:text-white focus:bg-slate-800 cursor-pointer">
                          Edit Monitor
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-slate-800 cursor-pointer">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

