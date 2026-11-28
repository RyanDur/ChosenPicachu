#!/usr/bin/env bash
# Lints the one file Claude just wrote or edited, with the linters CI runs, so a broken house rule shows while the code
# is being written. A failure exits 2, which hands the linter's report back to Claude to fix.
cd "$CLAUDE_PROJECT_DIR" || exit 0
[ -d node_modules ] || exit 0
file=$(jq -r '.tool_input.file_path // empty')
[ -n "$file" ] && [ -f "$file" ] || exit 0
case "$file" in
  "$CLAUDE_PROJECT_DIR"/*) file=${file#"$CLAUDE_PROJECT_DIR"/} ;;
  /*) exit 0 ;;
esac
case "$file" in
  node_modules/* | dist/*) exit 0 ;;
  *.css) report=$(npx stylelint --max-warnings 0 "$file" 2>&1) ;;
  *.ts | *.tsx | *.js | *.mjs | *.cjs)
    report=$(npx oxlint --type-aware --deny-warnings "$file" 2>&1) || failed=1
    report="$report"$'\n'$(npx eslint --max-warnings 0 "$file" 2>&1) || failed=1
    [ -z "$failed" ] ;;
  *) exit 0 ;;
esac || { printf 'The linters CI runs refuse %s:\n%s\n' "$file" "$report" >&2; exit 2; }
exit 0
