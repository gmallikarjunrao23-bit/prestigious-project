import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ payments });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { paymentId, status } = body;

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedBy: session.user.id,
        verifiedAt: new Date(),
      },
    });

    if (status === "VERIFIED") {
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          plan: payment.plan,
          planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "Payment verified!",
          message: `Your ${payment.plan} plan is now active.`,
          type: "BILLING",
        },
      });
    }

    return NextResponse.json({ payment });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

