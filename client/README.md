# WMS frontend

React + TypeScript client for the Warehouse Management System.

See the [root README](../README.md) for the application workflow, local API and database setup, role permissions, testing, deployment, and portfolio information.

```powershell
npm ci
npm run dev
```

Configure `VITE_API_BASE_URL` in `.env.development.local` as `http://localhost:5081/api` and run the backend separately. The development CORS configuration expects this frontend at `http://localhost:5173`.

Other scripts: `npm run lint`, `npm run build`, and `npm run preview`.
