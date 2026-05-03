#!/usr/bin/env bash
set -euo pipefail

REPO_OWNER="${1:-zjoh5253}"
REPO_NAME="${2:-eaplens}"

: "${GITHUB_TOKEN:?GITHUB_TOKEN is required}"

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${REPO_OWNER}/${REPO_NAME}/branches/main/protection" \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["validate"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true
}
JSON

echo "Branch protection applied to ${REPO_OWNER}/${REPO_NAME}:main"
