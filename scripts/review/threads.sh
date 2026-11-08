#!/usr/bin/env bash
set -euo pipefail
pull=$1
gh api graphql --paginate -F pull="$pull" -f owner="${GITHUB_REPOSITORY%/*}" -f name="${GITHUB_REPOSITORY#*/}" -f query='
  query($owner: String!, $name: String!, $pull: Int!, $endCursor: String) {
    repository(owner: $owner, name: $name) { pullRequest(number: $pull) {
      reviewThreads(first: 100, after: $endCursor) {
        nodes {
          id isResolved path line
          first: comments(first: 1) { nodes { databaseId author { __typename login } } }
          latest: comments(last: 20) { nodes { databaseId authorAssociation author { __typename login } body } }
        }
        pageInfo { hasNextPage endCursor } } } }
  }' | jq -s '[.[].data.repository.pullRequest.reviewThreads.nodes[]]'
