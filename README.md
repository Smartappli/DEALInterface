# DEALInterface

DEALInterface is the unified management console for the DEAL suite.

It is designed as a modular control plane:

- `DEALHost` keeps hosting, gateway and runtime operations isolated.
- `DEALIot` keeps device, telemetry and edge operations isolated.
- `DEALData` keeps ingestion, catalog and lineage operations isolated.
- `DEALInterface` centralizes IAM, RBAC, audit, billing, support and operator workflows.

## Stack

- Vite
- React
- TypeScript
- CSS modules through a single global stylesheet for the first UI foundation

## Local development

```bash
npm install
npm run dev
```

The app starts on `http://127.0.0.1:5173`.

## API configuration

Create `.env.local` when real module APIs are available:

```bash
VITE_DEALHOST_API_URL=http://127.0.0.1:9080
VITE_DEALIOT_API_URL=http://127.0.0.1:9081
VITE_DEALDATA_API_URL=http://127.0.0.1:9082
```

Default values are defined in `src/config/moduleRegistry.ts`.

## Current scope

This first version provides:

- a responsive management shell;
- global platform metrics;
- module navigation for `DEALHost`, `DEALIot` and `DEALData`;
- active module detail panels;
- control-plane topology;
- shared workflow and activity sections;
- runtime endpoint configuration ready for API integration.

The operational data is intentionally mocked until the backend contracts are finalized.
