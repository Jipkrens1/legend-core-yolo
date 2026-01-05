#!/bin/bash
# LEGEND: Connect a project to LEGEND
# Usage: ./connect-project.sh /path/to/your/project

set -e

LEGEND_ROOT="${LEGEND_ROOT:-$HOME/LEGEND}"
PROJECT_PATH="${1:-.}"

# Check if path exists before resolving
if [ ! -d "$PROJECT_PATH" ]; then
    echo "Error: Directory does not exist: $PROJECT_PATH"
    exit 1
fi

# Resolve to absolute path
PROJECT_PATH="$(cd "$PROJECT_PATH" && pwd)"

echo "Connecting project: $PROJECT_PATH"
echo "LEGEND root: $LEGEND_ROOT"

# Check LEGEND exists
if [ ! -d "$LEGEND_ROOT/.cursor" ]; then
    echo "Error: LEGEND not found at $LEGEND_ROOT"
    echo "Set LEGEND_ROOT environment variable or clone LEGEND first"
    exit 1
fi

cd "$PROJECT_PATH"

# Remove existing .cursor if it's a directory (not symlink)
if [ -d ".cursor" ] && [ ! -L ".cursor" ]; then
    echo "Warning: .cursor directory exists. Backing up to .cursor.backup"
    mv .cursor .cursor.backup
fi

# Remove existing symlink
if [ -L ".cursor" ]; then
    rm .cursor
fi

# Create symlink
ln -s "$LEGEND_ROOT/.cursor" .cursor
echo "Created symlink: .cursor -> $LEGEND_ROOT/.cursor"

# Add to .gitignore if not already there
if [ -f ".gitignore" ]; then
    if ! grep -q "^\.cursor$" .gitignore; then
        echo ".cursor" >> .gitignore
        echo "Added .cursor to .gitignore"
    fi
else
    echo ".cursor" > .gitignore
    echo "Created .gitignore with .cursor"
fi

# Create legend folder structure
mkdir -p legend/features

# Create project config if it doesn't exist
if [ ! -f "legend/project.config.json" ]; then
    PROJECT_NAME=$(basename "$PROJECT_PATH")
    cat > legend/project.config.json << EOF
{
  "name": "$PROJECT_NAME",
  "stack": {
    "frontend": "",
    "backend": "",
    "db": "",
    "deploy": "",
    "language": ""
  },
  "testing": {
    "unit": "",
    "e2e": ""
  },
  "constraints": {
    "prefer_small_diffs": true,
    "no_direct_prod_commands": true
  }
}
EOF
    echo "Created legend/project.config.json - please fill in the stack details"
else
    echo "legend/project.config.json already exists"
fi

echo ""
echo "Project connected to LEGEND!"
echo "Next steps:"
echo "  1. Edit legend/project.config.json with your stack details"
echo "  2. Open the project in Cursor"
echo "  3. Try: /legend scope my-feature"
