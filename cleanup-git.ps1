# ========================================
# GIT CLEANUP SCRIPT
# Remove node_modules/ and dist/ from Git tracking
# ========================================

Write-Host "🧹 CodeShark Academy - Git Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Safety check
Write-Host "⚠️  WARNING: This will remove node_modules/ and dist/ from Git index" -ForegroundColor Yellow
Write-Host "    (Local files will NOT be deleted)`n" -ForegroundColor Yellow

$confirmation = Read-Host "Continue? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "❌ Aborted." -ForegroundColor Red
    exit
}

Write-Host "`n📊 Checking current status..." -ForegroundColor Green

# Count tracked files from node_modules and dist
$trackedCount = (git ls-files | Select-String "node_modules/|dist/").Count
Write-Host "   Found $trackedCount tracked files in node_modules/ and dist/`n" -ForegroundColor Yellow

if ($trackedCount -eq 0) {
    Write-Host "✅ Already clean! No files to remove." -ForegroundColor Green
    exit
}

Write-Host "🗑️  Removing from Git index (keeping local files)..." -ForegroundColor Green

# Remove from Git index (--cached keeps local files)
try {
    git rm -r --cached node_modules/ 2>$null
    Write-Host "   ✓ Removed node_modules/ from index" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ node_modules/ already clean or not found" -ForegroundColor Yellow
}

try {
    git rm -r --cached dist/ 2>$null
    Write-Host "   ✓ Removed dist/ from index" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ dist/ already clean or not found" -ForegroundColor Yellow
}

Write-Host "`n📝 Staging .gitignore changes..." -ForegroundColor Green
git add .gitignore
git add .gitignore-README.md

Write-Host "`n📊 New status:" -ForegroundColor Green
git status --short

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Review the changes: git status" -ForegroundColor White
Write-Host "2. Commit: git commit -m 'chore: fix .gitignore - untrack node_modules and dist'" -ForegroundColor White
Write-Host "3. Push: git push" -ForegroundColor White
Write-Host "`n💡 Tip: Run 'git status --ignored' to see all ignored files" -ForegroundColor Yellow
