import { prisma } from "@/lib/prisma";

const AI_API_URL = process.env.AI_API_URL || "https://r-bots-free-apis.co08.art/api/v1/api/gptlogic";

export async function analyzeIncident(incidentId: string) {
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: { monitor: true, timeline: true },
    });

    if (!incident) throw new Error("Incident not found");

    const prompt = `Analyze this infrastructure incident and provide:
1. Root cause analysis
2. Recommended fixes
3. Estimated recovery time
4. Business impact assessment

Incident: ${incident.title}
Description: ${incident.description}
Monitor: ${incident.monitor.name} (${incident.monitor.type})
Status: ${incident.status}
Severity: ${incident.severity}`;

    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const fallback = generateFallbackAnalysis(incident);
      await prisma.incident.update({
        where: { id: incidentId },
        data: { aiAnalysis: fallback.analysis, aiRecommendations: fallback.recommendations },
      });
      return fallback;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    const analysis = content.split("Recommended fixes")[0]?.trim() || content;
    const recommendations = content.split("Recommended fixes")[1]?.trim() || "";

    await prisma.incident.update({
      where: { id: incidentId },
      data: { aiAnalysis: analysis, aiRecommendations: recommendations },
    });

    return { analysis, recommendations };
  } catch (error) {
    console.error("AI analysis error:", error);
    return generateFallbackAnalysis(await prisma.incident.findUnique({ where: { id: incidentId } }));
  }
}

export async function getInsights(userId: string) {
  const monitors = await prisma.monitor.findMany({
    where: { userId },
    include: { checks: { orderBy: { checkedAt: "desc" }, take: 100 } },
  });

  const avgResponseTime = monitors.reduce((sum, m) => {
    const avg = m.checks.reduce((s, c) => s + (c.responseTime || 0), 0) / Math.max(m.checks.length, 1);
    return sum + avg;
  }, 0) / Math.max(monitors.length, 1);

  const insights = [];

  if (avgResponseTime > 500) {
    insights.push({
      type: "recommendation",
      title: "High average response time detected",
      description: `Your average response time is ${Math.round(avgResponseTime)}ms. Consider enabling caching or upgrading your infrastructure.`,
      confidence: 85,
      severity: "medium",
    });
  }

  const downMonitors = monitors.filter((m) => m.checks[0]?.status === "DOWN");
  if (downMonitors.length > 0) {
    insights.push({
      type: "anomaly",
      title: `${downMonitors.length} monitor(s) currently down`,
      description: "Immediate attention required for affected services.",
      confidence: 100,
      severity: "high",
    });
  }

  insights.push({
    type: "prediction",
    title: "SSL certificates health check",
    description: "Review upcoming certificate expirations to prevent service disruptions.",
    confidence: 92,
    severity: "low",
  });

  return insights;
}

function generateFallbackAnalysis(incident: any) {
  return {
    analysis: `Based on the incident data, ${incident?.monitor?.name || "the service"} experienced a ${incident?.severity?.toLowerCase() || "unknown"} severity issue. The system detected ${incident?.status?.toLowerCase() || "unknown"} status.`,
    recommendations: "1. Check service logs\n2. Verify network connectivity\n3. Review recent deployments\n4. Scale resources if needed",
  };
}

