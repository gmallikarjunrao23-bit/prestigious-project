import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendNotification(userId: string, incidentId: string, channel: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: { monitor: true },
    });

    if (!user || !incident) return;

    const subject = `[${incident.severity}] ${incident.title} - ${incident.monitor.name}`;
    const body = `
      <h2>Infrastructure Alert</h2>
      <p><strong>Monitor:</strong> ${incident.monitor.name}</p>
      <p><strong>Status:</strong> ${incident.status}</p>
      <p><strong>Severity:</strong> ${incident.severity}</p>
      <p><strong>Description:</strong> ${incident.description || "N/A"}</p>
      <p><strong>Time:</strong> ${incident.createdAt.toISOString()}</p>
      <hr/>
      <p>View details in your InfraOps dashboard.</p>
    `;

    if (channel === "EMAIL" && user.email) {
      await transporter.sendMail({
        from: `"InfraOps" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject,
        html: body,
      });
    }

    await prisma.alert.create({
      data: {
        incidentId,
        channel: channel as any,
        status: "SENT",
        sentAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Notification error:", error);
    await prisma.alert.create({
      data: {
        incidentId,
        channel: channel as any,
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

