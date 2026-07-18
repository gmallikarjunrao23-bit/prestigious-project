import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

export function formatUptime(uptime: number): string {
  return `${uptime.toFixed(2)}%`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    UP: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    DOWN: "text-red-500 bg-red-500/10 border-red-500/20",
    DEGRADED: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    TIMEOUT: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    ERROR: "text-red-500 bg-red-500/10 border-red-500/20",
    INVESTIGATING: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    IDENTIFIED: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    MONITORING: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    RESOLVED: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  };
  return colors[status] || "text-gray-500 bg-gray-500/10 border-gray-500/20";
}

export function getHealthScoreColor(score: number): string {
  if (score >= 95) return "text-emerald-500";
  if (score >= 85) return "text-amber-500";
  if (score >= 70) return "text-orange-500";
  return "text-red-500";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

