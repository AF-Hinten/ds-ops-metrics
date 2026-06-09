# DS Ops Metrics - Online Vercel Version

This folder is now the online-saving version of DS Ops Metrics.

## What Changed

- Users must log in before they can see metrics.
- Shared metrics save online through a private Vercel Blob store.
- The main screen is `Add Entries` for settlement attempts and daily metrics.
- `Negotiation Attempts` and `SUCCESSFUL Negotiation` are calculated from settlement attempts.
- The import-team-data workflow was removed.
- The current workbook data from `DS Ops team Metrics (2).xlsx` is seeded server-side.

## Required Vercel Setup

Before redeploying, add these to your Vercel project:

1. Create a private Vercel Blob store:
   - Open your Vercel project.
   - Go to `Storage`.
   - Choose `Create Database`.
   - Choose `Blob`.
   - Choose `Private`.
   - Connect it to this project.
   - Vercel should add `BLOB_READ_WRITE_TOKEN` automatically.

2. Add environment variables:
   - `APP_EMAIL`
   - `APP_PASSWORD`
   - `SESSION_SECRET`

Use your shared team login for `APP_EMAIL` and `APP_PASSWORD`. Use a long random value for `SESSION_SECRET`.

## Deploy Settings

Use the same project/repository you already deployed.

- Framework Preset: `Other`
- Build Command: leave blank
- Output Directory: leave blank
- Install Command: leave blank

After the files are pushed or uploaded, redeploy the project.

## Important

This stores the shared app data as one private JSON file in Vercel Blob. It is a good simple version for a small team. If the team grows or you need audit logs, individual user accounts, or high-volume editing, the next upgrade should move the data into a database such as Supabase or Neon Postgres.
