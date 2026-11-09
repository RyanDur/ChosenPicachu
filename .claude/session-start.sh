#!/usr/bin/env bash
[ -n "$CLAUDE_ENV_FILE" ] || exit 0
tell() {
  jq -n --arg m "$1" '{systemMessage: $m, hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $m}}'
  exit 0
}
command -v direnv >/dev/null || tell "direnv not found, so Node is not pinned to .nvmrc. Install direnv, or run commands as direnv exec . <command>."
export DIRENV_LOG_FORMAT='%s'
# direnv writes no export when the inherited DIRENV_* say this .envrc is already loaded, as they do in a terminal with its hook.
error=$(env -u DIRENV_DIR -u DIRENV_DIFF -u DIRENV_WATCHES -u DIRENV_FILE direnv export bash 2>&1 >"$CLAUDE_ENV_FILE.direnv") \
  || { rm -f "$CLAUDE_ENV_FILE.direnv"; tell "direnv could not load .envrc, so Node is not pinned to .nvmrc: $error"; }
cat "$CLAUDE_ENV_FILE.direnv" >>"$CLAUDE_ENV_FILE"
rm -f "$CLAUDE_ENV_FILE.direnv"
