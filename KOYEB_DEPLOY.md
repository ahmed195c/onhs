# Deploying to Koyeb (Updated: Jan 31, 2026)

Koyeb’s **Hobby** plan provides one free web service (512 MB RAM, 0.1 vCPU, 2 GB SSD) plus a free Postgres instance; you can sign up without a card in most regions (some regions may require a card for fraud prevention).citeturn0search0turn0search2

## Quick Path (recommended)
1. **Push code to GitHub** (root of this repo contains `Dockerfile` and `Procfile`).
2. Sign in at https://app.koyeb.com → **Create Service → GitHub Repo** → pick this repo/branch.
3. **Builder**: select *Dockerfile* (path: `Dockerfile` at repo root).  
4. **Service settings**
   - **Port**: 8000 (HTTP).
   - **Init command** (run once per deployment):  
     `cd /app/backend && python manage.py migrate --noinput && python manage.py collectstatic --noinput`
   - **Run command**: `cd /app/backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --timeout 120`
   - **Instance type**: Hobby / Free.
5. **Database**: add the free Postgres add‑on; copy its connection string into an env var `DATABASE_URL`.
6. **Environment variables** (under *Secrets/Env*):
   - `SECRET_KEY` = long random string
   - `DEBUG` = `False`
   - `ALLOWED_HOSTS` = `<your-service>.koyeb.app`
   - `CORS_ALLOWED_ORIGINS` = `https://<your-service>.koyeb.app` (or your custom domain)
   - `DATABASE_URL` = Postgres URL from step 5
   - `KOYEB_PUBLIC_DOMAIN` = `<your-service>.koyeb.app` (helps auto‑allow host)
7. Click **Deploy**. First deploy may take ~2–3 minutes. Koyeb will show the public URL; open it to verify.

## Notes
- Static files are served via WhiteNoise; `collectstatic` is run in the init command.
- Uploaded media lives on the instance’s ephemeral disk. For persistence, switch to S3-compatible storage later.
- Procfile remains compatible for Heroku/Railway; Dockerfile is used for Koyeb.

## Verification checklist
- Visit `/admin` to confirm migrations ran and static files load.
- Upload a file to ensure media writes succeed.
- If you see 400 “Bad Request”, ensure `ALLOWED_HOSTS` includes the exact domain and redeploy.
