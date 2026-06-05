# EAPLens

**Know your EAP ROI. Finally.**

EAPLens is a B2B SaaS dashboard for HR teams to track Employee Assistance Program (EAP) utilization and ROI. Built for HR Directors at 200–2,000 employee companies.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Prisma ORM** + PostgreSQL
- **NextAuth.js** — email/password + magic link
- **Tailwind CSS** + custom shadcn-style components
- **Recharts** for data visualization
- **Stripe** integration skeleton (not activated)

## Local Development

### Prerequisites

- Node.js ≥ 20
- Docker + Docker Compose (for local Postgres)

### 1. Start Postgres

```bash
docker-compose up -d
```

This starts a Postgres 16 container on port 5432 with:
- User: `eaplens`
- Password: `eaplens_dev`
- Database: `eaplens`

### 2. Set up environment

```bash
cp .env.example .env.local
```

The defaults in `.env.example` work out of the box with the docker-compose Postgres. You'll need to generate a `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Install dependencies

```bash
npm install
```

### 4. Push the schema and seed data

```bash
npm run db:push   # apply schema to the database
npm run db:seed   # load 12 months of realistic mock data
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo credentials (after seeding):**
- Email: `admin@acme-corp.com`
- Password: `password123`

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Sign in (email/password or magic link) |
| `/register` | Create account + organization |
| `/dashboard` | EAP utilization dashboard (protected) |
| `/upload` | CSV data upload (protected) |

## CSV Upload Format

The upload page accepts CSV files with these columns:

```
department,benefit_category,utilization_count,month
Engineering,Mental Health,23,2024-01-01
Sales,Financial Counseling,8,2024-01-01
```

A downloadable sample template is available from the upload page.

## CI Pipeline

GitHub Actions validates on PRs and pushes to `main`:

- TypeScript typecheck (`npm run typecheck`)
- ESLint lint (`npm run lint`)
- Vitest unit tests (`npm test`)
- `npm audit` at high-severity threshold

## Deployment Hooks

`Deploy Hooks` workflow triggers Vercel and Supabase webhooks via repo secrets:

- `VERCEL_DEPLOY_HOOK_URL`
- `SUPABASE_DEPLOY_HOOK_URL`

## Branch Protection

Run `scripts/apply-branch-protection.sh` with `GITHUB_TOKEN` to enforce required status checks.
