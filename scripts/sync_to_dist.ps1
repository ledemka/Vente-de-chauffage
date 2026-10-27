$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
$distDir = Join-Path $rootDir "dist-production"

Write-Host "Syncing to dist-production..."

# 1. API
Copy-Item -Path "$rootDir\api\*" -Destination "$distDir\api\" -Recurse -Force
Write-Host "Synced api/"

# 2. Assets JS
Copy-Item -Path "$rootDir\assets\js\*" -Destination "$distDir\assets\js\" -Recurse -Force
Write-Host "Synced assets/js/"

# 3. Main HTMLs
Copy-Item -Path "$rootDir\produit.html" -Destination "$distDir\produit.html" -Force
Copy-Item -Path "$rootDir\panier.html" -Destination "$distDir\panier.html" -Force
Copy-Item -Path "$rootDir\recapitulatif-commande.html" -Destination "$distDir\recapitulatif-commande.html" -Force
Copy-Item -Path "$rootDir\produits\*" -Destination "$distDir\produits\" -Recurse -Force
Write-Host "Synced root produit, panier, recap, produits/"

# 4. Languages
foreach ($lang in @('en', 'de', 'nl')) {
    if (Test-Path "$distDir\$lang") {
        Copy-Item -Path "$rootDir\$lang\produit.html" -Destination "$distDir\$lang\produit.html" -Force
        Copy-Item -Path "$rootDir\$lang\panier.html" -Destination "$distDir\$lang\panier.html" -Force
        Copy-Item -Path "$rootDir\$lang\recapitulatif-commande.html" -Destination "$distDir\$lang\recapitulatif-commande.html" -Force
        Copy-Item -Path "$rootDir\$lang\produits\*" -Destination "$distDir\$lang\produits\" -Recurse -Force
        Write-Host "Synced $lang/"
    }
}

Write-Host "dist-production sync complete!"
