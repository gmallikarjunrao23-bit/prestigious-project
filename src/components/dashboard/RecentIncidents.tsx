"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { cn, getStatusColor, formatDate } from "@/lib/utils";
import { Incident } from "@/types";

interface RecentIncidentsProps {
  incidents: Incident[];
}

export function RecentIncidents({ incidents }: RecentIncidentsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden"
    >
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent Incidents</h2>
          <p className="text-sm text-slate-500 mt-0.5">Last 5 incidents</p>
        </div>
        <Link href="/incidents" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
          View all →
        </Link>
      </div>

      <div className="divide-y divide-slate-800/50">
        {incidents.length === 0 ? (
          <div className="p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No incidents</p>
            <p className="text-sm text-slate-600 mt-1">Everything is running smoothly</p>
          </div>
        ) : (
          incidents.map((incident, index) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="p-4 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", incident.status === "RESOLVED" ? "bg-emerald-500" : "bg-red-500")} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{incident.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase", getStatusColor(incident.status))}>
                      {incident.status}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(incident.createdAt)}
                    </span>
                  </div>
                  {incident.monitor && <p className="text-xs text-slate-600 mt-1">{incident.monitor.name}</p>}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

