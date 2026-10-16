#!/bin/bash

# ========================================
# GIT CLEANUP SCRIPT (Bash version)
# Remove node_modules/ and dist/ from Git tracking
# ========================================

echo "🧹 CodeShark Academy - Git Cleanup Script"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Safety check
echo -e "${YELLOW}⚠️  WARNING: This will remove node_modules/ and dist/ from Git index${NC}"
echo -e "${YELLOW}    (Local files will NOT be deleted)${NC}"
echo ""
read -p "Continue? (yes/no): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo -e "${RED}❌ Aborted.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}📊 Checking current status...${NC}"

# Count tracked files from node_modules and dist
trackedCount=$(git ls-files | grep -E "node_modules/|dist/" | wc -l)
echo -e "${YELLOW}   Found $trackedCount tracked files in node_modules/ and dist/${NC}"
echo ""

if [ "$trackedCount" -eq 0 ]; then
    echo -e "${GREEN}✅ Already clean! No files to remove.${NC}"
    exit 0
fi

echo -e "${GREEN}🗑️  Removing from Git index (keeping local files)...${NC}"

# Remove from Git index (--cached keeps local files)
if git ls-files | grep -q "node_modules/"; then
    git rm -r --cached node_modules/ 2>/dev/null
    echo -e "${GREEN}   ✓ Removed node_modules/ from index${NC}"
else
    echo -e "${YELLOW}   ⚠ node_modules/ already clean or not found${NC}"
fi

if git ls-files | grep -q "dist/"; then
    git rm -r --cached dist/ 2>/dev/null
    echo -e "${GREEN}   ✓ Removed dist/ from index${NC}"
else
    echo -e "${YELLOW}   ⚠ dist/ already clean or not found${NC}"
fi

echo ""
echo -e "${GREEN}📝 Staging .gitignore changes...${NC}"
git add .gitignore
git add .gitignore-README.md 2>/dev/null

echo ""
echo -e "${GREEN}📊 New status:${NC}"
git status --short

echo ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo -e "${NC}1. Review the changes: git status${NC}"
echo -e "${NC}2. Commit: git commit -m 'chore: fix .gitignore - untrack node_modules and dist'${NC}"
echo -e "${NC}3. Push: git push${NC}"
echo ""
echo -e "${YELLOW}💡 Tip: Run 'git status --ignored' to see all ignored files${NC}"
