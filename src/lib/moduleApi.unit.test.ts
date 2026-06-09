import { afterEach, describe, expect, it, vi } from "vitest";
import type { ModuleRuntimeConfig } from "../config/moduleRegistry";
import { fetchModuleConnection } from "./moduleApi";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function runtimeConfig(overrides: Partial<ModuleRuntimeConfig> = {}): ModuleRuntimeConfig {
  return {
    key: "dealiot",
    apiBaseUrl: "/dealiot",
    healthPath: "/healthz",
    docsPath: "/docs/dealiot",
    authToken: "local-management-token",
    probes: [
      {
        id: "management-console",
        label: "Management console",
        path: "/healthz",
      },
      {
        id: "platform-components",
        label: "Platform components",
        path: "/api/health",
      },
    ],
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchModuleConnection", () => {
  it("classifies probe payloads and only sends DEALIoT auth to /api probes", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ status: "ok", service: "management" }))
      .mockResolvedValueOnce(jsonResponse({ summary: { healthy: 2, unhealthy: 1 } }));

    vi.stubGlobal("fetch", fetchMock);

    const connection = await fetchModuleConnection(runtimeConfig());

    expect(connection.status).toBe("degraded");
    expect(connection.probes).toMatchObject([
      {
        id: "management-console",
        url: "/dealiot/healthz",
        status: "online",
        httpStatus: 200,
        detail: "ok / management",
      },
      {
        id: "platform-components",
        url: "/dealiot/api/health",
        status: "degraded",
        httpStatus: 200,
        detail: "2 healthy, 1 unhealthy",
      },
    ]);

    const firstHeaders = fetchMock.mock.calls[0][1]?.headers as Headers;
    const secondHeaders = fetchMock.mock.calls[1][1]?.headers as Headers;

    expect(firstHeaders.get("Authorization")).toBeNull();
    expect(secondHeaders.get("Authorization")).toBe("Bearer local-management-token");
  });

  it("marks non-OK HTTP responses as attention", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(jsonResponse({ status: "down" }, 503));
    vi.stubGlobal("fetch", fetchMock);

    const connection = await fetchModuleConnection(
      runtimeConfig({
        key: "dealhost",
        apiBaseUrl: "/dealhost",
        authToken: undefined,
        probes: [
          {
            id: "gateway",
            label: "Gateway API",
            path: "/api/gateway/health/",
          },
        ],
      }),
    );

    expect(connection.status).toBe("attention");
    expect(connection.probes[0]).toMatchObject({
      url: "/dealhost/api/gateway/health/",
      status: "attention",
      httpStatus: 503,
      detail: "down",
    });
  });

  it("returns an offline probe result when the network request fails", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValueOnce(new Error("connection refused"));
    vi.stubGlobal("fetch", fetchMock);

    const connection = await fetchModuleConnection(
      runtimeConfig({
        probes: [
          {
            id: "management-console",
            label: "Management console",
            path: "/healthz",
          },
        ],
      }),
    );

    expect(connection.status).toBe("attention");
    expect(connection.probes[0]).toMatchObject({
      status: "attention",
      detail: "connection refused",
    });
  });
});
