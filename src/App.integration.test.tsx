import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const healthyPayloads: Record<string, unknown> = {
  "/dealhost/api/gateway/health/": {
    status: "ok",
    service: "dealhost-gateway",
  },
  "/dealiot/healthz": {
    status: "ok",
    service: "dealiot-management",
  },
  "/dealiot/api/health": {
    summary: {
      healthy: 3,
    },
  },
  "/dealdata/core/health/ready/": {
    status: "ok",
    service: "dealdata-core",
  },
  "/dealdata/gps/health/ready/": {
    status: "ok",
    service: "dealdata-gps",
  },
  "/dealdata/sensor/health/ready/": {
    status: "ok",
    service: "dealdata-sensor",
  },
};

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json",
    },
  });
}

function mockModuleFetch(overrides: Record<string, unknown | Error> = {}) {
  const fetchMock = vi.fn<typeof fetch>(async (input) => {
    const url = String(input);
    const payload = overrides[url] ?? healthyPayloads[url] ?? { status: "ok" };

    if (payload instanceof Error) {
      throw payload;
    }

    return jsonResponse(payload);
  });

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("App live module integrations", () => {
  it("probes DEALHost, DEALIoT and DEALData endpoints on initial render", async () => {
    const fetchMock = mockModuleFetch();

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /Manage DEALHost, DEALIot and DEALData from one deliberate interface/i,
      }),
    ).toBeInTheDocument();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(6));

    expect(fetchMock).toHaveBeenCalledWith("/dealhost/api/gateway/health/", expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith("/dealiot/healthz", expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith("/dealiot/api/health", expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith("/dealdata/core/health/ready/", expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith("/dealdata/gps/health/ready/", expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith("/dealdata/sensor/health/ready/", expect.any(Object));

    expect(await screen.findByText("/dealhost/api/gateway/health/")).toBeInTheDocument();
    expect(screen.getByText("1/1 live probes healthy")).toBeInTheDocument();
  });

  it("keeps the console usable and surfaces a failed module probe", async () => {
    const user = userEvent.setup();
    const fetchMock = mockModuleFetch({
      "/dealiot/api/health": new Error("dealiot API offline"),
    });

    render(<App />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(6));

    await user.click(within(screen.getByLabelText("Module navigation")).getByRole("button", { name: "DEALIot" }));

    expect(await screen.findByText("/dealiot/api/health")).toBeInTheDocument();
    expect(screen.getByText("dealiot API offline")).toBeInTheDocument();
    expect(screen.getByText("1/2 live probes healthy")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Connected module APIs" })).toBeInTheDocument();
  });
});
