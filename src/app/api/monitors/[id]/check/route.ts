import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { performCheck } from "@/lib/monitoring/engine";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const monitor = await prisma.monitor.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!monitor) return NextResponse.json({ error: "Monitor not found" }, { status: 404 });

    const result = await performCheck(monitor);

    const check = await prisma.monitorCheck.create({
      data: {
        monitorId: monitor.id,
        status: result.status,
        responseTime: result.responseTime,
        statusCode: result.statusCode,
        errorMessage: result.errorMessage,
        region: monitor.region,
      },
    });

    if (result.status !== "UP" && monitor.isActive) {
      const existingIncident = await prisma.incident.findFirst({
        where: { monitorId: monitor.id, status: { not: "RESOLVED" } },
      });

      if (!existingIncident) {
        await prisma.incident.create({
          data: {
            monitorId: monitor.id,
            title: `${monitor.name} is ${result.status}`,
            description: result.errorMessage || `Monitor returned status ${result.status}`,
            severity: result.status === "DOWN" ? "HIGH" : "MEDIUM",
            status: "INVESTIGATING",
            userId: session.user.id,
          },
        });
      }
    }

    return NextResponse.json({ check });
  } catch (error) {
    console.error("Check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

