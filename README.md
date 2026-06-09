# DS Ops Metrics - Vercel Static Deploy

This folder is ready to deploy to Vercel as a static website.

## What Is Included

- `index.html`: the DS Ops Metrics app.
- `vercel.json`: Vercel settings for clean URLs and basic browser safety headers.

## How To Deploy

Vercel deploys projects from Git providers or from the Vercel CLI. Because this computer does not currently have a usable Node/npm/Vercel CLI setup, the simplest path is GitHub:

1. Create a new GitHub repository.
2. Upload the files from this `vercel-deploy` folder into that repository.
3. In Vercel, choose `Add New` then `Project`.
4. Import the GitHub repository.
5. Use these project settings:
   - Framework Preset: `Other`
   - Build Command: leave blank
   - Output Directory: leave blank
   - Install Command: leave blank
6. Click `Deploy`.

## Important Data Note

This static version saves data in each person's browser. That means:

- The website can be accessed without your computer being on.
- Each team member can enter their own data.
- Data is not automatically shared back to you unless you add a shared database later.
- For now, team members can still use `Export My Data`, and you can use `Import Team Data`.

For the true time-saving version, the next upgrade should connect this app to Google Sheets or a small database so everyone writes to the same source automatically.

## Optional CLI Path

If Node.js and the Vercel CLI are installed later, this folder can also be deployed from a terminal:

```powershell
vercel login
vercel --cwd "C:\Users\Hinten\Documents\Codex\2026-05-07\files-mentioned-by-the-user-ds\vercel-deploy"
vercel --prod --cwd "C:\Users\Hinten\Documents\Codex\2026-05-07\files-mentioned-by-the-user-ds\vercel-deploy"
```
