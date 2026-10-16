# ========================================
# FIX NODE_MODULES SCRIPT
# Reinstall dependencies untuk fix Error -4058
# ========================================

Write-Host "🔧 CodeShark Academy - Fix Node Modules" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📊 Diagnosing issue..." -ForegroundColor Yellow
Write-Host "   Error: ENOENT -4058 (file not found)" -ForegroundColor Red
Write-Host "   Cause: node_modules/vite/package.json missing`n" -ForegroundColor Red

Write-Host "🗑️  Step 1: Remove corrupted node_modules..." -ForegroundColor Green
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Write-Host "   ✓ Removed node_modules/" -ForegroundColor Green
} else {
    Write-Host "   ⚠ node_modules/ not found (already clean)" -ForegroundColor Yellow
}

Write-Host "`n📦 Step 2: Clean npm cache..." -ForegroundColor Green
npm cache clean --force 2>&1 | Out-Null
Write-Host "   ✓ Cache cleaned" -ForegroundColor Green

Write-Host "`n⬇️  Step 3: Reinstall dependencies..." -ForegroundColor Green
Write-Host "   This may take 2-5 minutes...`n" -ForegroundColor Yellow

npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Installation successful!" -ForegroundColor Green
    
    Write-Host "`n🧪 Verifying installation..." -ForegroundColor Green
    
    # Check critical packages
    $checks = @(
        @{Name="vite"; Path="node_modules\vite\package.json"},
        @{Name="react"; Path="node_modules\react\package.json"},
        @{Name="typescript"; Path="node_modules\typescript\package.json"}
    )
    
    $allOk = $true
    foreach ($check in $checks) {
        if (Test-Path $check.Path) {
            Write-Host "   ✓ $($check.Name) installed" -ForegroundColor Green
        } else {
            Write-Host "   ✗ $($check.Name) MISSING" -ForegroundColor Red
            $allOk = $false
        }
    }
    
    if ($allOk) {
        Write-Host "`n🎉 All dependencies installed correctly!" -ForegroundColor Green
        Write-Host "`nNext steps:" -ForegroundColor Cyan
        Write-Host "1. Run: npm run dev" -ForegroundColor White
        Write-Host "2. Test: npm run build" -ForegroundColor White
    } else {
        Write-Host "`n⚠️  Some packages missing. Try:" -ForegroundColor Yellow
        Write-Host "   npm install --legacy-peer-deps" -ForegroundColor White
    }
} else {
    Write-Host "`n❌ Installation failed!" -ForegroundColor Red
    Write-Host "`nTroubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check internet connection" -ForegroundColor White
    Write-Host "2. Try: npm install --legacy-peer-deps" -ForegroundColor White
    Write-Host "3. Try: npm install --force" -ForegroundColor White
    Write-Host "4. Delete package-lock.json and retry" -ForegroundColor White
}
