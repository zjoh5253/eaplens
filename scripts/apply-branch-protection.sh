#!/usr/bin/env bash
set -euo pipefail

REPO_OWNER="${1:-zjoh5253}"
REPO_NAME="${2:-eaplens}"

: "${GITHUB_TOKEN:?GITHUB_TOKEN is required}"

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${REPO_OWNER}/${REPO_NAME}/branches/main/protection" \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]="validate" \
  -f enforce_admins=true \
  -F required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  -f restrictions= \
  -f required_linear_history=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false \
  -f block_creations=false \
  -f required_conversation_resolution=true

echo "Branch protection applied to ${REPO_OWNER}/${REPO_NAME}:main"
