# from-mm.dev

Free subdomains for Myanmar developers. Get `yourname.from-mm.dev` pointing to your GitHub Pages or Vercel project in minutes.

## Features

- 🔐 Sign in with GitHub — your username is suggested as your subdomain
- 🌐 Supports **GitHub Pages**, **Vercel**, and **Netlify** as deploy targets
- ⚡ Instant DNS via Cloudflare API — CNAME created automatically on registration
- 📋 Up to 5 subdomains per account
- 🚨 Public abuse reporting
- 📖 Built-in setup guides for GitHub Pages and Vercel

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Auth.js v5 (GitHub OAuth) |
| Database | PostgreSQL (Neon) via Drizzle ORM |
| DNS | Cloudflare API |

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/thetmyoekhaing/from-mm.dev
cd from-mm.dev
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | [GitHub OAuth Apps](https://github.com/settings/developers) |
| `AUTH_GITHUB_SECRET` | Same OAuth App |
| `DATABASE_URL` | [neon.tech](https://neon.tech) → create project → connection string |
| `CLOUDFLARE_API_TOKEN` | [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) with Zone:DNS:Edit |
| `CLOUDFLARE_ZONE_ID` | Cloudflare → from-mm.dev → Overview → Zone ID |
| `NEXT_PUBLIC_BASE_DOMAIN` | `from-mm.dev` |

**GitHub OAuth callback URL** (for localhost):
```
http://localhost:3000/api/auth/callback/github
```

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Scripts

```bash
npm run db:push      # Push schema to database (dev / first-time setup)
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio (visual DB browser)
```

## Project Structure

```
app/
├── page.tsx                        # Landing page
├── layout.tsx                      # Root layout + SessionProvider
├── register/page.tsx               # Claim a subdomain
├── dashboard/
│   ├── page.tsx                    # Server component — fetches subdomains
│   └── client.tsx                  # Interactive subdomain list
├── docs/
│   ├── page.tsx                    # Docs index + FAQ
│   ├── github-pages/page.tsx       # GitHub Pages setup guide
│   ├── vercel/page.tsx             # Vercel setup guide
│   └── netlify/page.tsx            # Netlify setup guide
├── report/[subdomain]/page.tsx     # Abuse report form
└── api/
    ├── auth/[...nextauth]/route.ts # Auth.js handler
    ├── subdomains/
    │   ├── route.ts                # GET (availability) + POST (register)
    │   └── [id]/route.ts           # DELETE
    └── report/route.ts             # POST abuse report
src/
├── auth.ts                         # Auth.js config + GitHub OAuth + DB upsert
├── db/
│   ├── schema.ts                   # Drizzle schema (users, subdomains, abuse_reports)
│   └── index.ts                    # Neon + Drizzle client
└── lib/
    ├── subdomain.ts                # Validation + reserved list + buildTarget
    └── cloudflare.ts               # Cloudflare DNS API (create/delete CNAME)
```

## Deploying to Production

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example` in Vercel → Settings → Environment Variables
4. Update your GitHub OAuth App callback URL to `https://from-mm.dev/api/auth/callback/github`
5. In Cloudflare DNS, add a record pointing `from-mm.dev` to Vercel (grey cloud — proxy disabled)

> The database schema only needs to be pushed once. Do **not** add `db:push` to the build command.

## Subdomain Rules

- 3–63 characters
- Lowercase letters, numbers, and hyphens only
- Cannot start or end with a hyphen
- Reserved names (`www`, `api`, `admin`, etc.) are blocked
- Max 5 subdomains per account

## License

MIT

---

Created by [tomari](https://github.com/thetmyoekhaing)
