# FindInChina

Vetted Chinese brands for global buyers. Editorial-style single-page Next.js app backed by Supabase.

## Stack
- Next.js 15 (App Router, TypeScript)
- Supabase (Postgres + Storage)
- Tailwind CSS
- DeepSeek API (translation & analysis)
- Zeabur (deployment)

## Local development
```bash
npm install
npm run dev
```

## Environment variables
Set in Zeabur dashboard → Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `DEEPSEEK_API_KEY` (server-only)

## Database
Schema lives in `db/*.sql`. Run `create-findin-table.sql` first, then seed files.

## Deployment
This repo is wired to Zeabur. Push to `main` triggers a redeploy.
