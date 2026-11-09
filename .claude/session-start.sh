#!/usr/bin/env bash
[ -n "$CLAUDE_ENV_FILE" ] || exit 0
command -v direnv >/dev/null || { echo "direnv not found, so Node is not pinned to .nvmrc; run commands as direnv exec . <command> once direnv is installed"; exit 0; }
# direnv writes no export when the inherited DIRENV_* say this .envrc is already loaded, as they do in a terminal with its hook.
env -u DIRENV_DIR -u DIRENV_DIFF -u DIRENV_WATCHES -u DIRENV_FILE direnv export bash >>"$CLAUDE_ENV_FILE"
