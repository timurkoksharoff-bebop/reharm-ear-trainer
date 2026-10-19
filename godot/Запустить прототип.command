#!/bin/zsh
set -eu
cd "${0:A:h}/.."
node_bin="$(command -v node || true)"
if [[ -z "$node_bin" && -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
  node_bin="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
godot_bin="${GODOT_BIN:-$(command -v godot || command -v godot4 || true)}"
if [[ -z "$godot_bin" && -x godot/.tools/Godot.app/Contents/MacOS/Godot ]]; then
  godot_bin="$PWD/godot/.tools/Godot.app/Contents/MacOS/Godot"
fi
if [[ -z "$godot_bin" && -x /Applications/Godot.app/Contents/MacOS/Godot ]]; then
  godot_bin=/Applications/Godot.app/Contents/MacOS/Godot
fi
if [[ -z "$node_bin" || -z "$godot_bin" ]]; then
  print 'Нужны Node.js 22+ и Godot 4.5.2. Инструкция: godot/README.md'
  read '?Нажмите Enter для закрытия.'
  exit 1
fi
"$node_bin" godot/tools/prepare.mjs
"$godot_bin" --headless --editor --path godot --import --quit
exec "$godot_bin" --path godot
