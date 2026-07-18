import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate, getStatusColor } from "@/lib/utils";
import { MonitorCheck } from "@prisma/client";

interface Props {
  params: { slug: string };
}

export default async function PublicStatusPage({ params }: Props) {
  const statusPage = await prisma.statusPage.findUnique({
    where: { slug: params.slug },
    include: {
      user: {
        include: {
          monitors: {
            include: { checks: { orderBy: { checkedAt: "desc" }, take: 1 } },
          },
          incidents: {
            where: { status: { not: "RESOLVED" } },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      },
    },
  });

  if (!statusPage || !statusPage.isPublic) {
    notFound();
  }

  const monitors = statusPage.user.monitors;
  const incidents = statusPage.user.incidents;
  const allUp = monitors.every((m) => m.checks[0]?.status === "UP");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">{statusPage.name}</h1>
          <p className="text-slate-400">{statusPage.description}</p>
          <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            allUp ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            <span className={`w-2 h-2 rounded-full ${allUp ? "bg-emerald-500" : "bg-red-500"}`} />
            {allUp ? "All Systems Operational" : "Some Systems Experiencing Issues"}
          </div>
        </div>

        <div className="space-y-3 mb-12">
          {monitors.map((monitor) => {
            const status = monitor.checks[0]?.status || "UP";
            return (
              <div key={monitor.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    status === "UP" ? "bg-emerald-500" : status === "DOWN" ? "bg-red-500" : "bg-amber-500"
                  }`} />
                  <span className="font-medium">{monitor.name}</span>
                </div>
                <span className={`text-sm ${status === "UP" ? "text-emerald-400" : "text-red-400"}`}>
                  {status}
                </span>
              </div>
            );
          })}
        </div>

        {incidents.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Incidents</h2>
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div key={incident.id} className="p-4 rounded-lg border border-red-500/20 bg-red-950/20">
                  <h3 className="font-medium text-red-400">{incident.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{incident.description}</p>
                  <p className="text-xs text-slate-600 mt-2">{formatDate(incident.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-600">
          <p>Powered by InfraOps</p>
        </div>
      </div>
    </div>
  );
}

