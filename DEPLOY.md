# Deployment

The React frontend is deployed on Vercel (https://lifedrop-frontend.vercel.app).
Its `vercel.json` proxies `/api/*` to the backend, so the browser only ever
talks to one origin and session cookies stay first-party. Where the backend
actually runs is set by the first rewrite in `lifedrop-frontend/vercel.json`.

The Docker image builds the React app and serves it from the Spring Boot
jar as an alternative single-origin setup with no proxy needed.

## Option 1: Vercel frontend + tunneled or hosted backend

Current setup. The `/api` rewrite points at a Cloudflare quick tunnel to a
locally running jar, so the public site is up as long as the local server
and tunnel are.

- Redeploy the frontend after changing the proxy target:
  `cd lifedrop-frontend && npx vercel deploy --prod`
- Pointing the rewrite at a permanently hosted backend (Option 2) makes
  the whole stack 24/7.

## Option 2: Free permanent hosting (Render)

The Dockerfile below is what makes this work on any container host.

1. Create a free MySQL database (for example on
   [Aiven](https://aiven.io) free tier, or any MySQL host) and note the
   connection URL, user, and password.
2. Push this repository to GitHub, then on [Render](https://render.com)
   create a **Web Service** from the repo. Render detects the
   `Dockerfile` at the root and builds it (~5 minutes).
3. On the free plan the service sleeps after 15 minutes of inactivity;
   the first request afterwards takes about a minute while it boots.
4. Set these environment variables on the service:

   | Variable | Example |
   |---|---|
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://<host>:<port>/<db>?sslMode=REQUIRED&serverTimezone=UTC` |
   | `DB_USERNAME` | database user |
   | `DB_PASSWORD` | database password |
   | `SERVER_SERVLET_SESSION_COOKIE_SECURE` | `true` (required over HTTPS) |
   | `APP_CORS_ALLOWED_ORIGINS` | `https://lifedrop-frontend.vercel.app` |

   Hibernate creates the tables on startup (`ddl-auto=update`).

5. Update the `/api` rewrite in `lifedrop-frontend/vercel.json` to the
   Render URL and redeploy the frontend. The Vercel link is then
   permanent and fully cloud-hosted.

Koyeb and Railway work the same way with this Dockerfile.

## Option 2: Local demo with a public URL (no account needed)

Uses your machine as the server and a free Cloudflare quick tunnel for
the public HTTPS URL. The link works until you stop the script or the
machine sleeps.

```powershell
powershell -ExecutionPolicy Bypass -File scripts/live-demo.ps1
```

The script builds the frontend, packages the jar, starts the server,
starts the tunnel, and prints the `trycloudflare.com` URL. Requires
[cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)
on PATH.

## Rebuilding after code changes

```bash
cd lifedrop-frontend && npm run build
rm -rf ../BloodDonationManagement/src/main/resources/static
cp -r dist ../BloodDonationManagement/src/main/resources/static
cd ../BloodDonationManagement && ./mvnw -DskipTests package
java -jar target/BloodDonationManagement-0.0.1-SNAPSHOT.jar
```
