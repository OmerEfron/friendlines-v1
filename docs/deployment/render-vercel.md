# FriendLines V1 Deployment (Render + Vercel)

Backend runs on Render (Web Service + Postgres). Frontend is a static SPA on Vercel.

## Prerequisites

- GitHub repo connected to Render and Vercel
- Telegram Bot Token, OpenAI API Key
- `TELEGRAM_WEBHOOK_SECRET` (random string for webhook validation)

## 1. Render Backend Provisioning

1. Push `render.yaml` to your repo.
2. In [Render Dashboard](https://dashboard.render.com): **Blueprints** > **New Blueprint Instance**.
3. Select your repository and branch; Render will detect `render.yaml`.
4. Name the blueprint (e.g. `friendlines-v1`) and click **Apply**.
5. When prompted, provide:
   - `TELEGRAM_BOT_TOKEN` – from @BotFather
   - `TELEGRAM_WEBHOOK_SECRET` – any secure random string
   - `OPENAI_API_KEY` – your OpenAI key
   - `FRONTEND_URL` – your Vercel production URL (e.g. `https://friendlines.vercel.app`)
   - `FRIENDLINES_USER_NAME` – subject of coverage (e.g. `Omer Efron`)
6. Wait for the Postgres DB and Web Service to deploy.

## 2. Run Database Migrations

After the backend service is created:

```bash
cd backend
DATABASE_URL="<copy from Render Postgres service: Internal Database URL>" npm run migrate up
```

Or use Render **Shell** for the Web Service and run `npm run migrate up` there (DATABASE_URL is already set).

### Verify backend after deploy

```bash
# Health check
curl -s https://<your-render-backend>.onrender.com/api/health
# Expected: {"status":"ok"}

# Editions (may be empty initially)
curl -s https://<your-render-backend>.onrender.com/api/editions/today
curl -s https://<your-render-backend>.onrender.com/api/editions
```

## 3. Vercel Frontend Deployment

1. In [Vercel Dashboard](https://vercel.com): **Add New Project** > import your repo.
2. **Root Directory**: `frontend`
3. **Framework Preset**: Vite (auto-detected)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   - `VITE_API_BASE` = `https://<your-render-backend>.onrender.com` (production)
7. Deploy.

## 4. Telegram Webhook Cutover

After the backend is live and healthy:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://<your-render-backend>.onrender.com/webhook/telegram", "secret_token": "<TELEGRAM_WEBHOOK_SECRET>"}'
```

Verify with a test message in Telegram.

**Bot flows after webhook is set:**
- Daily session starts at 9:00, 14:00, 20:00 UTC. Each session runs 4–5 questions; user can tap "End now" to publish early.
- Weekly interview: Sundays 10:00 UTC or `/weekly_interview` command.

## 5. Render Auto-Deploy and CI

- **Auto-Deploy**: Render deploys when you push to the linked branch.
- **Gate deploys with CI**: In Render Service **Settings** > **Auto-Deploy**, set to **After CI Checks Pass**. Add your GitHub repo as the build environment and ensure the CI workflow name matches (e.g. `CI` / `test`).
- **Health Check**: `GET /api/health` is used as the health check path.

## 6. Vercel Preview and Production

- **Production**: Merges to `main` trigger a production deploy (set Production branch in Vercel project settings).
- **Preview**: Pull requests get a preview URL (e.g. `https://friendlines-xxx-org.vercel.app`).
- **Environments**: Set `VITE_API_BASE` in Vercel for both **Production** and **Preview**. For Preview, point to your Render backend (same API for V1) or a staging backend if you have one.

## URLs After Deployment

| Service         | URL                                 |
|----------------|-------------------------------------|
| Backend API    | `https://<service>.onrender.com`     |
| Frontend SPA   | `https://<project>.vercel.app`      |
| Postgres (int) | From Render Postgres service panel  |
