# Alex: The Next Move

Farewell prediction board — vote on what Alex does next, add your own
prediction, and leave him a signed note. No login required for visitors:
identity is just the name they type.

Stack: Vite + React frontend (deploys to Vercel), Supabase (Postgres) storage.

## 1. Set up Supabase (~3 minutes)

1. Go to https://supabase.com → New project (free tier is plenty).
2. Once the project is ready, open **SQL Editor → New query**, paste the whole
   contents of `supabase-setup.sql`, and click **Run**. This creates the
   `tiles`, `votes`, and `notes` tables with Row Level Security policies:
   visitors can read everything, add tiles/notes, and add/remove their own
   votes — but can never edit or delete tiles or notes.
3. Go to **Settings → API** and copy two values:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (long string under "Project API keys")

The anon key is designed to be public — it ships in the browser bundle.
Never put the `service_role` key anywhere near this app.

## 2. Deploy to Vercel

1. Push this folder to a GitHub repo (private is fine).
2. Go to https://vercel.com → **Add New… → Project** → import the repo.
   Vercel auto-detects Vite; keep the defaults (build `vite build`,
   output `dist`).
3. **Before clicking Deploy**, expand **Environment Variables** and add:

   | Name                     | Value                        |
   |--------------------------|------------------------------|
   | `VITE_SUPABASE_URL`      | your Project URL             |
   | `VITE_SUPABASE_ANON_KEY` | your anon public key         |

   Leave them enabled for Production, Preview, and Development.
4. Click **Deploy**. Your board is live at `https://<project>.vercel.app`.

Added the variables *after* deploying, or changed them later? Vite bakes env
vars in at build time, so trigger a redeploy: **Deployments → ⋯ on the latest
→ Redeploy**. (The app shows a yellow "Not connected to the database" banner
whenever the variables are missing.)

Alternative without GitHub: `npm i -g vercel`, then in this folder run
`vercel`, add the two variables with `vercel env add VITE_SUPABASE_URL` and
`vercel env add VITE_SUPABASE_ANON_KEY`, then `vercel --prod`.

## 3. Local development

```bash
cp .env.example .env.local   # fill in your two values
npm install
npm run dev
```

## Notes

- The board seeds its 16 starter predictions on first load; seeding is
  idempotent and safe under concurrent first visitors.
- Votes are one row per (tile, voter) with a composite primary key, so
  simultaneous votes can never overwrite each other.
- Duplicate predictions are blocked by a unique index on tile text.
- "Copy final results" exports the ranked board + all notes as plain text.
