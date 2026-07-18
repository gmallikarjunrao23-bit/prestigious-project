import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { ActivityChart } from "@/components/dashboard/ActivityChart";

async function getDashboardData(userId: string) {
  const [
    monitors,
    incidents,
    checks,
    openIncidents,
  ] = await Promise.all([
    prisma.monitor.findMany({
      where: { userId },
      include: {
        checks: { orderBy: { checkedAt: "desc" }, take: 1 },
        _count: { select: { checks: true, incidents: true } },
      },
    }),
    prisma.incident.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { monitor: true },
    }),
    prisma.monitorCheck.findMany({
      where: {
        monitor: { userId },
        checkedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.incident.count({
      where: { userId, status: { not: "RESOLVED" } },
    }),
  ]);

  const totalMonitors = monitors.length;
  const activeMonitors = monitors.filter((m) => m.isActive && !m.isPaused).length;
  const downMonitors = monitors.filter((m) => m.checks[0]?.status === "DOWN").length;

  const uptimeChecks = checks.filter((c) => c.status === "UP").length;
  const totalChecks = checks.length;
  const avgUptime = totalChecks > 0 ? (uptimeChecks / totalChecks) * 100 : 100;

  const avgResponseTime = checks.length > 0
    ? Math.round(checks.reduce((sum, c) => sum + (c.responseTime || 0), 0) / checks.length)
    : 0;

  const healthScore = Math.round(
    (avgUptime * 0.4) +
    ((avgResponseTime < 500 ? 100 : avgResponseTime < 1000 ? 70 : 40) * 0.3) +
    ((1 - downMonitors / Math.max(totalMonitors, 1)) * 100 * 0.3)
  );

  return {
    stats: {
      totalMonitors,
      activeMonitors,
      downMonitors,
      totalIncidents: monitors.reduce((sum, m) => sum + m._count.incidents, 0),
      openIncidents,
      avgUptime,
      avgResponseTime,
      checksToday: totalChecks,
      healthScore,
    },
    monitors: monitors.slice(0, 6),
    incidents,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const data = await getDashboardData(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your infrastructure health</p>
      </div>

      <StatsCards stats={data.stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardOverview monitors={data.monitors} />
          <ActivityChart />
        </div>
        <div className="space-y-6">
          <AIInsights />
          <RecentIncidents incidents={data.incidents} />
        </div>
      </div>
    </div>
  );
}

