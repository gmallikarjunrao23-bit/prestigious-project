import { MonitorType, Priority, Environment, CheckStatus, Severity, IncidentStatus, Plan, UserRole, AlertChannel } from "@prisma/client";

export interface Monitor {
  id: string;
  name: string;
  url: string;
  type: MonitorType;
  method: string;
  interval: number;
  timeout: number;
  retries: number;
  expectedStatus: number | null;
  expectedKeyword: string | null;
  isActive: boolean;
  isPaused: boolean;
  region: string;
  tags: string[];
  priority: Priority;
  environment: Environment;
  userId: string;
  teamId: string | null;
  createdAt: Date;
  updatedAt: Date;
  checks?: MonitorCheck[];
  incidents?: Incident[];
  uptimePercentage?: number;
  avgResponseTime?: number;
  lastCheck?: MonitorCheck;
}

export interface MonitorCheck {
  id: string;
  monitorId: string;
  status: CheckStatus;
  responseTime: number | null;
  statusCode: number | null;
  errorMessage: string | null;
  region: string;
  checkedAt: Date;
}

export interface Incident {
  id: string;
  monitorId: string;
  title: string;
  description: string | null;
  severity: Severity;
  status: IncidentStatus;
  rootCause: string | null;
  aiAnalysis: string | null;
  aiRecommendations: string | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  monitor?: Monitor;
  timeline?: IncidentTimeline[];
}

export interface IncidentTimeline {
  id: string;
  incidentId: string;
  message: string;
  type: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalMonitors: number;
  activeMonitors: number;
  downMonitors: number;
  totalIncidents: number;
  openIncidents: number;
  avgUptime: number;
  avgResponseTime: number;
  checksToday: number;
  healthScore: number;
}

export interface AnalyticsData {
  uptimeTrend: { date: string; uptime: number }[];
  responseTimeTrend: { date: string; avg: number; p95: number; p99: number }[];
  incidentHistory: { date: string; count: number }[];
  regionPerformance: { region: string; avgResponseTime: number; availability: number }[];
}

export interface AIInsight {
  type: "prediction" | "recommendation" | "anomaly" | "summary";
  title: string;
  description: string;
  confidence: number;
  severity?: "low" | "medium" | "high" | "critical";
  metadata?: Record<string, unknown>;
}

export interface NotificationSettings {
  email: boolean;
  webhook: boolean;
  discord: boolean;
  slack: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
}

export interface PaymentVerification {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  upiId: string;
  screenshotUrl: string | null;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  plan: Plan;
  createdAt: Date;
  user?: {
    name: string | null;
    email: string;
  };
}

export interface StatusPageConfig {
  slug: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  brandColor: string;
  monitors: {
    name: string;
    status: CheckStatus;
    uptime: number;
  }[];
  incidents: {
    title: string;
    status: IncidentStatus;
    createdAt: Date;
  }[];
}

export type { MonitorType, Priority, Environment, CheckStatus, Severity, IncidentStatus, Plan, UserRole, AlertChannel };

