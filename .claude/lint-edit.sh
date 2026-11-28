#!/usr/bin/env bash
# Exit 2 hands the report back to Claude; exit 1 shows the note to the person without stopping the session.
[ -n "$CI" ] && exit 0
cd "$CLAUDE_PROJECT_DIR" || exit 0
command -v jq >/dev/null || { echo 'The lint-on-edit hook needs jq; install it to lint each file as it is written.' >&2; exit 1; }
[ -d node_modules ] || { echo 'The lint-on-edit hook needs node_modules; run npm ci to lint each file as it is written.' >&2; exit 1; }
file=$(jq -r '.tool_input.file_path // empty')
[ -n "$file" ] && [ -f "$file" ] || exit 0
case "$file" in
  "$CLAUDE_PROJECT_DIR"/*) file=${file#"$CLAUDE_PROJECT_DIR"/} ;;
  /*) exit 0 ;;
esac
git check-ignore -q "$file" && exit 0
failed=
case "$file" in
  coverage/*) exit 0 ;;
  src/*.css) report=$(npx stylelint --max-warnings 0 "$file" 2>&1) || failed=1 ;;
  *.ts | *.tsx | *.js | *.mjs | *.cjs)
    report=$(npx oxlint --type-aware --deny-warnings "$file" 2>&1) || failed=1
    report="$report"$'\n'$(npx eslint --no-warn-ignored --max-warnings 0 "$file" 2>&1) || failed=1 ;;
  *) exit 0 ;;
esac
[ -z "$failed" ] && exit 0
printf 'The linters CI runs refuse %s:\n%s\n' "$file" "$report" >&2
exit 2
