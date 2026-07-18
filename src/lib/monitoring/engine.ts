import { Monitor } from "@prisma/client";

export interface CheckResult {
  status: "UP" | "DOWN" | "DEGRADED" | "TIMEOUT" | "ERROR";
  responseTime: number | null;
  statusCode: number | null;
  errorMessage: string | null;
}

export async function performCheck(monitor: Monitor): Promise<CheckResult> {
  const startTime = Date.now();

  try {
    if (monitor.type === "HTTPS" || monitor.type === "HTTP" || monitor.type === "API") {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), monitor.timeout * 1000);

      const headers: Record<string, string> = {
        "User-Agent": "InfraOps-Monitor/1.0",
      };

      if (monitor.headers && typeof monitor.headers === "object") {
        Object.assign(headers, monitor.headers);
      }

      if (monitor.authType === "BEARER" && monitor.authValue) {
        headers["Authorization"] = `Bearer ${monitor.authValue}`;
      } else if (monitor.authType === "BASIC" && monitor.authValue) {
        headers["Authorization"] = `Basic ${Buffer.from(monitor.authValue).toString("base64")}`;
      }

      const response = await fetch(monitor.url, {
        method: monitor.method || "GET",
        headers,
        body: monitor.body || undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        return {
          status: response.status >= 500 ? "DOWN" : "DEGRADED",
          responseTime,
          statusCode: response.status,
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      if (monitor.expectedStatus && response.status !== monitor.expectedStatus) {
        return {
          status: "DEGRADED",
          responseTime,
          statusCode: response.status,
          errorMessage: `Expected status ${monitor.expectedStatus}, got ${response.status}`,
        };
      }

      if (monitor.expectedKeyword) {
        const body = await response.text();
        if (!body.includes(monitor.expectedKeyword)) {
          return {
            status: "DEGRADED",
            responseTime,
            statusCode: response.status,
            errorMessage: `Keyword "${monitor.expectedKeyword}" not found in response`,
          };
        }
      }

      return {
        status: responseTime > 2000 ? "DEGRADED" : "UP",
        responseTime,
        statusCode: response.status,
        errorMessage: null,
      };
    }

    if (monitor.type === "TCP") {
      const net = await import("net");
      const { URL } = await import("url");
      const url = new URL(monitor.url);
      const hostname = url.hostname;
      const port = parseInt(url.port) || 80;

      return new Promise((resolve) => {
        const socket = new net.Socket();
        const timeout = setTimeout(() => {
          socket.destroy();
          resolve({
            status: "TIMEOUT",
            responseTime: monitor.timeout * 1000,
            statusCode: null,
            errorMessage: `Connection timeout after ${monitor.timeout}s`,
          });
        }, monitor.timeout * 1000);

        socket.connect(port, hostname, () => {
          clearTimeout(timeout);
          const responseTime = Date.now() - startTime;
          socket.destroy();
          resolve({
            status: "UP",
            responseTime,
            statusCode: null,
            errorMessage: null,
          });
        });

        socket.on("error", (err) => {
          clearTimeout(timeout);
          resolve({
            status: "DOWN",
            responseTime: Date.now() - startTime,
            statusCode: null,
            errorMessage: err.message,
          });
        });
      });
    }

    return {
      status: "UP",
      responseTime: Date.now() - startTime,
      statusCode: null,
      errorMessage: null,
    };
  } catch (error) {
    return {
      status: "ERROR",
      responseTime: null,
      statusCode: null,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

