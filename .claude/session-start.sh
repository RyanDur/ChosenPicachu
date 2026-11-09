#!/usr/bin/env bash
# GitHub Actions sets CI, and its runners, where claude-code-action runs this hook, have no direnv.
[ -n "$CLAUDE_ENV_FILE" ] && [ -z "$CI" ] || exit 0
tell() {
  jq -n --arg m "$1" '{systemMessage: $m, hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $m}}'
  exit 0
}
command -v direnv >/dev/null || tell "direnv not found, so Node is not pinned to .nvmrc. Install direnv, or run commands as direnv exec . <command>."
# direnv writes no export when the inherited DIRENV_* say this .envrc is already loaded, as they do in a terminal with its hook.
error=$(env -u DIRENV_DIR -u DIRENV_DIFF -u DIRENV_WATCHES -u DIRENV_FILE direnv export bash 2>&1 >"$CLAUDE_ENV_FILE.direnv") \
  || { rm -f "$CLAUDE_ENV_FILE.direnv"; tell "direnv could not load .envrc, so Node is not pinned to .nvmrc: $(printf %s "$error" | sed $'s/\x1b\[[0-9;]*m//g')"; }
cat "$CLAUDE_ENV_FILE.direnv" >>"$CLAUDE_ENV_FILE"
rm -f "$CLAUDE_ENV_FILE.direnv"
