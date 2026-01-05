#!/bin/bash
# LEGEND: Check and install LEGEND commands and rules
# Usage: ./check-legend.sh [--install] [--verbose]
#
# Options:
#   --install   Install missing components (default: check only)
#   --verbose   Show detailed output

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
INSTALL_MODE=false
VERBOSE=false
for arg in "$@"; do
    case $arg in
        --install) INSTALL_MODE=true ;;
        --verbose) VERBOSE=true ;;
        -h|--help)
            echo "Usage: ./check-legend.sh [--install] [--verbose]"
            echo ""
            echo "Options:"
            echo "  --install   Install missing components (default: check only)"
            echo "  --verbose   Show detailed output"
            exit 0
            ;;
    esac
done

# Determine LEGEND source location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LEGEND_SOURCE="$(dirname "$SCRIPT_DIR")"

# Target location (current directory or specified)
TARGET_DIR="${TARGET_DIR:-$(pwd)}"

echo -e "${BLUE}LEGEND Component Check${NC}"
echo "======================================"
echo "LEGEND source: $LEGEND_SOURCE"
echo "Target directory: $TARGET_DIR"
echo ""

# Define expected components
CURSORRULES=".cursor/.cursorrules"

COMMANDS=(
    "legend.md"
    "legend-branch.md"
    "legend-build.md"
    "legend-deploy.md"
    "legend-design.md"
    "legend-docs.md"
    "legend-migrate.md"
    "legend-refactor.md"
    "legend-review.md"
    "legend-scope.md"
    "legend-security.md"
    "legend-setup-ci.md"
    "legend-setup-git.md"
    "legend-setup-supabase.md"
    "legend-setup-vercel.md"
    "legend-status.md"
    "legend-test.md"
    "legend-validate.md"
)

RULES=(
    "legend-branch.mdc"
    "legend-build.mdc"
    "legend-deploy.mdc"
    "legend-design.mdc"
    "legend-docs.mdc"
    "legend-migrate.mdc"
    "legend-refactor.mdc"
    "legend-review.mdc"
    "legend-scope.mdc"
    "legend-security.mdc"
    "legend-setup-ci.mdc"
    "legend-setup-git.mdc"
    "legend-setup-supabase.mdc"
    "legend-setup-vercel.mdc"
    "legend-test.mdc"
    "legend-validate.mdc"
)

# Track status
MISSING_COUNT=0
INSTALLED_COUNT=0
OK_COUNT=0

# Function to check and optionally install a file
check_file() {
    local source_path="$1"
    local target_path="$2"
    local component_name="$3"

    if [ -f "$target_path" ]; then
        if [ "$VERBOSE" = true ]; then
            echo -e "  ${GREEN}[OK]${NC} $component_name"
        fi
        ((OK_COUNT++))
        return 0
    else
        if [ "$INSTALL_MODE" = true ]; then
            if [ -f "$source_path" ]; then
                # Ensure target directory exists
                mkdir -p "$(dirname "$target_path")"
                cp "$source_path" "$target_path"
                echo -e "  ${GREEN}[INSTALLED]${NC} $component_name"
                ((INSTALLED_COUNT++))
                return 0
            else
                echo -e "  ${RED}[ERROR]${NC} $component_name - source not found: $source_path"
                ((MISSING_COUNT++))
                return 1
            fi
        else
            echo -e "  ${YELLOW}[MISSING]${NC} $component_name"
            ((MISSING_COUNT++))
            return 1
        fi
    fi
}

# Check .cursorrules
echo -e "${BLUE}Checking orchestrator...${NC}"
check_file "$LEGEND_SOURCE/$CURSORRULES" "$TARGET_DIR/$CURSORRULES" ".cursorrules"
echo ""

# Check commands
echo -e "${BLUE}Checking commands...${NC}"
for cmd in "${COMMANDS[@]}"; do
    check_file "$LEGEND_SOURCE/.cursor/commands/$cmd" "$TARGET_DIR/.cursor/commands/$cmd" "commands/$cmd"
done
echo ""

# Check rules
echo -e "${BLUE}Checking rules...${NC}"
for rule in "${RULES[@]}"; do
    check_file "$LEGEND_SOURCE/.cursor/rules/$rule" "$TARGET_DIR/.cursor/rules/$rule" "rules/$rule"
done
echo ""

# Summary
echo "======================================"
echo -e "${BLUE}Summary${NC}"
echo "--------------------------------------"

if [ "$VERBOSE" = true ] || [ $OK_COUNT -gt 0 ]; then
    echo -e "  ${GREEN}OK:${NC}        $OK_COUNT components"
fi

if [ $INSTALLED_COUNT -gt 0 ]; then
    echo -e "  ${GREEN}Installed:${NC} $INSTALLED_COUNT components"
fi

if [ $MISSING_COUNT -gt 0 ]; then
    echo -e "  ${YELLOW}Missing:${NC}   $MISSING_COUNT components"
fi

echo ""

# Final status
if [ $MISSING_COUNT -eq 0 ]; then
    echo -e "${GREEN}All LEGEND components are installed.${NC}"
    exit 0
else
    if [ "$INSTALL_MODE" = true ]; then
        echo -e "${RED}Some components could not be installed.${NC}"
        exit 1
    else
        echo -e "${YELLOW}Run with --install to install missing components:${NC}"
        echo "  ./scripts/check-legend.sh --install"
        exit 1
    fi
fi
