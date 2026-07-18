import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createMonitorSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["HTTP", "HTTPS", "TCP", "UDP", "PING", "DNS", "API"]),
  interval: z.string().transform(Number).default("60"),
  timeout: z.string().transform(Number).default("30"),
  retries: z.string().transform(Number).default("3"),
  expectedStatus: z.string().transform(Number).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createMonitorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, _count: { select: { monitors: true } } },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const maxMonitors = user.plan === "FREE" ? 5 : user.plan === "PRO" ? 50 : 999999;
    if (user._count.monitors >= maxMonitors) {
      return NextResponse.json(
        { error: `Monitor limit reached. Upgrade to add more. (${user._count.monitors}/${maxMonitors})` },
        { status: 403 }
      );
    }

    const monitor = await prisma.monitor.create({
      data: {
        name: parsed.data.name,
        url: parsed.data.url,
        type: parsed.data.type,
        interval: parsed.data.interval,
        timeout: parsed.data.timeout,
        retries: parsed.data.retries,
        expectedStatus: parsed.data.expectedStatus,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ monitor }, { status: 201 });
  } catch (error) {
    console.error("Create monitor error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const monitors = await prisma.monitor.findMany({
      where: { userId: session.user.id },
      include: {
        checks: { orderBy: { checkedAt: "desc" }, take: 1 },
        _count: { select: { incidents: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ monitors });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

