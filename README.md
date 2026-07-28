# PROTOFORM — Next.js + Supabase

3D-modeling / prototyping studio site. The public pages render from a built-in
seed **until Supabase is connected**, then automatically switch to the database.
Projects and blog posts are managed from a built-in `/admin` panel.

## Run locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

The scroll-scrubbed drone hero needs HTTP Range support — Next's dev server and
all real hosts provide it, so it just works (no custom server needed).

## Connect Supabase (one time)

1. **Create the tables.** In the Supabase dashboard → **SQL Editor**, paste and
   run [`supabase/schema.sql`](supabase/schema.sql). It creates the `projects`
   and `posts` tables, RLS policies, and the public `media` storage bucket.

2. **Add credentials.** Copy `.env.example` → `.env.local` and fill in from
   **Project Settings → API**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...            # anon / publishable
   SUPABASE_SERVICE_ROLE_KEY=eyJ...                # service_role (secret)
   ```

3. **Seed data + admin user + images.**

   ```bash
   node scripts/setup.mjs you@email.com "a-strong-password"
   ```

   This creates the admin login, uploads the 37 project images to Storage, and
   inserts all 37 projects + the starter blog posts. Save the password it prints.

4. **Lock down sign-ups.** In **Authentication → Sign In / Providers → Email**,
   turn **off** "Allow new users to sign up" (only your admin account should
   exist — any signed-in user can edit content).

5. Restart `pnpm dev`. The site now reads from Supabase and `/admin` works.

## Managing content

- Go to **`/admin`**, sign in with the account from step 3.
- **Projects** and **Blog posts**: create, edit, delete. Upload images directly
  (they go to Supabase Storage) or paste an image URL. Toggle **Published** to
  show/hide on the site. Blog bodies are written in **Markdown**.

## Structure

```
src/app/(site)/      public pages (home, projects, blog, services, about, contact)
src/app/admin/       auth-guarded CRUD panel
src/components/       Nav, Footer, DroneHero, ProjectsGrid, admin forms…
src/lib/             types, seed data, Supabase clients, queries (with fallback)
supabase/schema.sql  database + storage setup
scripts/setup.mjs    one-time seeder
public/              drone video + project images
```
