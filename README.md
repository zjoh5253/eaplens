# EAPLens

Initial repository scaffold for EAPLens MVP.

## CI pipeline

GitHub Actions validates on pull requests and pushes to `main`:

- TypeScript typecheck
- ESLint lint
- Vitest unit tests
- `npm audit` with high-severity threshold

## Deployment hooks

`Deploy Hooks` workflow can trigger Vercel and Supabase webhooks using repo secrets:

- `VERCEL_DEPLOY_HOOK_URL`
- `SUPABASE_DEPLOY_HOOK_URL`

## Branch protection

Run `scripts/apply-branch-protection.sh` with `GITHUB_TOKEN` to enforce required checks/reviews.
