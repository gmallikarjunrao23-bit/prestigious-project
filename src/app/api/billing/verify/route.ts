import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const screenshot = formData.get("screenshot") as File;
    const plan = formData.get("plan") as string;
    const amount = parseFloat(formData.get("amount") as string);

    if (!screenshot || !plan || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bytes = await screenshot.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const screenshotUrl = `data:${screenshot.type};base64,${base64}`;

    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount,
        currency: "INR",
        upiId: "toxic-karthik.sai@fam",
        screenshotUrl,
        plan: plan as "PRO" | "ENTERPRISE",
        status: "PENDING",
      },
    });

    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "Payment verification pending",
        message: `Your payment of ₹${amount} is being verified by our team.`,
        type: "BILLING",
      },
    });

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error("Billing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

