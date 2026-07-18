import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeIncident, getInsights } from "@/lib/ai/engine";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { incidentId, type } = body;

    if (type === "incident" && incidentId) {
      const analysis = await analyzeIncident(incidentId);
      return NextResponse.json({ analysis });
    }

    if (type === "insights") {
      const insights = await getInsights(session.user.id);
      return NextResponse.json({ insights });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

