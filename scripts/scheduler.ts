import { prisma } from "../src/lib/prisma";
import { performCheck } from "../src/lib/monitoring/engine";
import { sendNotification } from "../src/lib/notifications/engine";
import cron from "node-cron";

async function runChecks() {
  console.log("[Scheduler] Running monitor checks...", new Date().toISOString());

  const monitors = await prisma.monitor.findMany({
    where: { isActive: true, isPaused: false },
  });

  for (const monitor of monitors) {
    try {
      const result = await performCheck(monitor);

      await prisma.monitorCheck.create({
        data: {
          monitorId: monitor.id,
          status: result.status,
          responseTime: result.responseTime,
          statusCode: result.statusCode,
          errorMessage: result.errorMessage,
          region: monitor.region,
        },
      });

      if (result.status !== "UP") {
        const existingIncident = await prisma.incident.findFirst({
          where: { monitorId: monitor.id, status: { not: "RESOLVED" } },
        });

        if (!existingIncident) {
          const incident = await prisma.incident.create({
            data: {
              monitorId: monitor.id,
              title: `${monitor.name} is ${result.status}`,
              description: result.errorMessage || `Monitor returned ${result.status}`,
              severity: result.status === "DOWN" ? "HIGH" : "MEDIUM",
              status: "INVESTIGATING",
              userId: monitor.userId,
            },
          });

          await sendNotification(monitor.userId, incident.id, "EMAIL");
        }
      } else {
        const openIncident = await prisma.incident.findFirst({
          where: { monitorId: monitor.id, status: { not: "RESOLVED" } },
        });

        if (openIncident) {
          await prisma.incident.update({
            where: { id: openIncident.id },
            data: { status: "RESOLVED", resolvedAt: new Date() },
          });

          await prisma.notification.create({
            data: {
              userId: monitor.userId,
              title: "Incident resolved",
              message: `${monitor.name} is back up.`,
              type: "RECOVERY",
            },
          });
        }
      }
    } catch (error) {
      console.error(`[Scheduler] Error checking ${monitor.name}:`, error);
    }
  }
}

console.log("[Scheduler] Starting InfraOps monitoring scheduler...");

cron.schedule("*/1 * * * *", runChecks);

runChecks();

