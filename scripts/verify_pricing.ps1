$ErrorActionPreference = 'Stop'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$rootDir = "c:\Users\User\Documents\Antigravity\VENTE DE CHAUFFAGE"
$failures = @()

function Assert-Equal($actual, $expected, $label) {
    if ("$actual" -ne "$expected") {
        $script:failures += "FAIL [$label]: expected '$expected', got '$actual'"
    } else {
        Write-Host "PASS [$label]: $actual"
    }
}

$products = [System.IO.File]::ReadAllText((Join-Path $rootDir "data\products.json"), $utf8NoBom) | ConvertFrom-Json
$pmap = @{}
foreach ($p in $products) { $pmap[$p.id] = $p }

# 1. Fixed prices (Section 2)
$expectedFixed = @{
    'charbon-bois-morceaux'      = 200
    'allume-feu-laine-bois'      = 180
    'granules-pellets-premium'   = 185
    'buches-torche-suedoise'     = 224
    'briquettes-ruf'             = 188
    'briquettes-ecorce'          = 198
    'nuit-longue-duree'          = 260
    'jour-premium-cylindrique'   = 270
    'jour-forte-chaleur-cubique' = 260
    'pini-kay-compressbee'       = 270
    'jour-eco-cylindrique'       = 200
}
foreach ($k in $expectedFixed.Keys) {
    Assert-Equal ([double]$pmap[$k].wholesale_price) ([double]$expectedFixed[$k]) "Fixed price $k"
}

# 2. Length-dependent prices (Section 3)
$expectedBuches = @{
    'hetre-etuve'      = @{ '20'=220; '30'=212; '33'=204; '40'=196; '50'=190 }
    'hetre-demi-sec'   = @{ '20'=170; '30'=165; '33'=160; '40'=155; '50'=150 }
    'chene-etuve'      = @{ '20'=224; '30'=218; '33'=208; '40'=200; '50'=194 }
    'chene-sec-air'    = @{ '20'=218; '30'=212; '33'=202; '40'=198; '50'=186 }
    'melange-essences' = @{ '20'=222; '30'=216; '33'=206; '40'=202; '50'=190 }
}
$expectedPackagingFr = @{
    '20' = '1 700 à 2 000 bûches'
    '30' = '1 350 à 1 600 bûches'
    '33' = '1 250 à 1 400 bûches'
    '40' = '1 050 à 1 200 bûches'
    '50' = '900 à 1 000 bûches'
}

foreach ($bId in $expectedBuches.Keys) {
    $b = $pmap[$bId]
    foreach ($len in @('20','30','33','40','50')) {
        Assert-Equal ([double]$b.prices_by_length.$len) ([double]$expectedBuches[$bId][$len]) "$bId $len cm price"
        Assert-Equal $b.packaging_by_length.$len.fr $expectedPackagingFr[$len] "$bId $len cm packaging FR"
    }
}

# 3. Check static HTML pages for key products in Section 8
$hetreHtml = [System.IO.File]::ReadAllText((Join-Path $rootDir "produits\hetre-etuve.html"), $utf8NoBom)
Assert-Equal ($hetreHtml.Contains('id="unit-price-ttc">220,00 €</span>')) $true "produits/hetre-etuve.html initial unit price 220,00 €"
Assert-Equal ($hetreHtml.Contains('id="spec-longueur">20 cm</span>')) $true "produits/hetre-etuve.html initial length 20 cm"
Assert-Equal ($hetreHtml.Contains('id="spec-conditionnement">1 700 à 2 000 bûches</span>')) $true "produits/hetre-etuve.html initial conditionnement"
Assert-Equal ($hetreHtml.Contains('"price": "220.00"')) $true "produits/hetre-etuve.html JSON-LD 20cm price 220.00"
Assert-Equal ($hetreHtml.Contains('Camion complet : 24 palettes. Vous b\u00e9n\u00e9ficiez de 10 % de remise !')) $true "produits/hetre-etuve.html 24 palettes message"

$charbonHtml = [System.IO.File]::ReadAllText((Join-Path $rootDir "produits\charbon-bois-morceaux.html"), $utf8NoBom)
Assert-Equal ($charbonHtml.Contains('id="unit-price-ttc">200,00 €</span>')) $true "produits/charbon-bois-morceaux.html initial unit price 200,00 €"
Assert-Equal ($charbonHtml.Contains('"price": "200.00"')) $true "produits/charbon-bois-morceaux.html JSON-LD price 200.00"

$piniHtml = [System.IO.File]::ReadAllText((Join-Path $rootDir "produits\pini-kay-compressbee.html"), $utf8NoBom)
Assert-Equal ($piniHtml.Contains('id="unit-price-ttc">270,00 €</span>')) $true "produits/pini-kay-compressbee.html initial unit price 270,00 €"
Assert-Equal ($piniHtml.Contains('"price": "270.00"')) $true "produits/pini-kay-compressbee.html JSON-LD price 270.00"
Assert-Equal ($piniHtml.Contains('id="spec-essence">100 % bois dur — mélange de chêne et de hêtre</span>')) $true "produits/pini-kay-compressbee.html spec-essence"
Assert-Equal ($piniHtml.Contains('id="spec-humidite">inférieur à 8 %</span>')) $true "produits/pini-kay-compressbee.html spec-humidite"
Assert-Equal ($piniHtml.Contains('id="spec-diametre">6 à 7 cm</span>')) $true "produits/pini-kay-compressbee.html spec-diametre"
Assert-Equal ($piniHtml.Contains('id="spec-longueur">environ 20 à 25 cm</span>')) $true "produits/pini-kay-compressbee.html spec-longueur"
Assert-Equal ($piniHtml.Contains('id="spec-forme">octogonale (Pini Kay)</span>')) $true "produits/pini-kay-compressbee.html spec-forme"

$torcheHtml = [System.IO.File]::ReadAllText((Join-Path $rootDir "produits\buches-torche-suedoise.html"), $utf8NoBom)
Assert-Equal ($torcheHtml.Contains('id="unit-price-ttc">224,00 €</span>')) $true "produits/buches-torche-suedoise.html initial unit price 224,00 €"
Assert-Equal ($torcheHtml.Contains('id="spec-humidite">15 à 20 %</span>')) $true "produits/buches-torche-suedoise.html spec-humidite 15 à 20 %"
Assert-Equal ($torcheHtml.Contains('id="spec-diametre">environ 15 à 25 cm</span>')) $true "produits/buches-torche-suedoise.html spec-diametre environ 15 à 25 cm"
Assert-Equal ($torcheHtml.Contains('Bois naturel résineux - Humidité: 15 à 20 %')) $true "produits/buches-torche-suedoise.html product-desc humidity"
Assert-Equal ($torcheHtml.Contains('md:col-span-2" id="spec-row-conditionnement"')) $false "produits/buches-torche-suedoise.html spec-row-conditionnement aligned (no md:col-span-2)"

$rufHtml = [System.IO.File]::ReadAllText((Join-Path $rootDir "produits\briquettes-ruf.html"), $utf8NoBom)
Assert-Equal ($rufHtml.Contains('id="spec-row-humidite"')) $false "produits/briquettes-ruf.html no spec-row-humidite"
Assert-Equal ($rufHtml.Contains('id="spec-conditionnement">96 sacs de 10 kg</span>')) $true "produits/briquettes-ruf.html spec-conditionnement 96 sacs de 10 kg"
Assert-Equal ($null -eq $pmap['briquettes-ruf'].humidity_bucket) $true "products.json briquettes-ruf has no humidity_bucket"
Assert-Equal $pmap['briquettes-ruf'].packaging.fr "96 sacs de 10 kg" "products.json briquettes-ruf packaging FR"

$jourEcoHtml = [System.IO.File]::ReadAllText((Join-Path $rootDir "produits\jour-eco-cylindrique.html"), $utf8NoBom)
Assert-Equal ($jourEcoHtml.Contains('id="unit-price-ttc">200,00 €</span>')) $true "produits/jour-eco-cylindrique.html initial unit price 200,00 €"
Assert-Equal ($jourEcoHtml.Contains('"price": "200.00"')) $true "produits/jour-eco-cylindrique.html JSON-LD price 200.00"
Assert-Equal ($jourEcoHtml.Contains('id="spec-humidite">≤ 10 %</span>')) $true "produits/jour-eco-cylindrique.html spec-humidite ≤ 10 %"
Assert-Equal ($jourEcoHtml.Contains('id="spec-longueur">20 à 30 cm</span>')) $true "produits/jour-eco-cylindrique.html spec-longueur 20 à 30 cm"
Assert-Equal ($jourEcoHtml.Contains('id="spec-diametre">6 à 9 cm</span>')) $true "produits/jour-eco-cylindrique.html spec-diametre 6 à 9 cm"
Assert-Equal ($jourEcoHtml.Contains('id="spec-essence">Mélange copeaux &amp; sciures compressés</span>')) $true "produits/jour-eco-cylindrique.html spec-essence unchanged"

$expectedCalorific = @{
    "jour-premium-cylindrique"   = "5,0 kWh/kg"
    "jour-forte-chaleur-cubique" = "4,9 kWh/kg"
    "pini-kay-compressbee"       = "4,9 kWh/kg"
    "jour-eco-cylindrique"       = "4,7 kWh/kg"
    "hetre-etuve"                = "4,1 kWh/kg"
    "chene-etuve"                = "4,1 kWh/kg"
    "melange-essences"           = "4,0 kWh/kg"
    "chene-sec-air"              = "4,0 kWh/kg"
    "buches-torche-suedoise"     = "3,9 kWh/kg"
    "allume-feu-laine-bois"      = "7,0 kWh/kg"
    "charbon-bois-morceaux"      = "7,5 kWh/kg"
    "granules-pellets-premium"   = "4,8 kWh/kg"
    "briquettes-ruf"             = "4,9 kWh/kg"
    "briquettes-ecorce"          = "4,6 kWh/kg"
    "nuit-longue-duree"          = "5,1 kWh/kg"
    "hetre-demi-sec"             = "3,8 kWh/kg"
}
foreach ($prodKey in $expectedCalorific.Keys) {
    $expCal = $expectedCalorific[$prodKey]
    Assert-Equal $pmap[$prodKey].calorific_value $expCal "products.json $prodKey calorific_value"
    $pHtml = [System.IO.File]::ReadAllText((Join-Path $rootDir "produits\$prodKey.html"), $utf8NoBom)
    Assert-Equal ($pHtml.Contains('id="spec-pouvoir">' + $expCal + '</span>')) $true "produits/$prodKey.html spec-pouvoir ($expCal)"
    Assert-Equal ($pHtml.Contains("document.getElementById('spec-pouvoir').textContent = product.calorific_value")) $true "produits/$prodKey.html dynamic spec-pouvoir JS"
}

# 4. Check that NO active front-end / cart / order files contain * 1.2 or * 1.20
$filesToScan = @(
    "catalogue.html", "produit.html", "panier.html", "recapitulatif-commande.html", "devis.html", "tableau-de-bord.html", "admin-commandes.html",
    "en\catalogue.html", "en\produit.html", "en\recapitulatif-commande.html", "en\devis.html", "en\tableau-de-bord.html", "en\admin-commandes.html",
    "de\catalogue.html", "de\produit.html", "de\recapitulatif-commande.html", "de\devis.html", "de\tableau-de-bord.html", "de\admin-commandes.html",
    "nl\catalogue.html", "nl\produit.html", "nl\recapitulatif-commande.html", "nl\devis.html", "nl\tableau-de-bord.html", "nl\admin-commandes.html",
    "assets\js\cart.js", "assets\js\pricing-engine.js", "api\pricing.php", "api\order.php", "api\merchant-feed.php"
)
foreach ($rel in $filesToScan) {
    $fp = Join-Path $rootDir $rel
    $txt = [System.IO.File]::ReadAllText($fp, $utf8NoBom)
    if ($txt -match '\*\s*1\.20?\b') {
        $failures += "FAIL [$rel]: still contains * 1.2 / * 1.20 VAT calculation!"
    }
}
foreach ($sub in @('', 'en\', 'de\', 'nl\')) {
    $pfiles = Get-ChildItem -Path (Join-Path $rootDir ($sub + "produits")) -Filter "*.html"
    foreach ($pf in $pfiles) {
        $txt = [System.IO.File]::ReadAllText($pf.FullName, $utf8NoBom)
        if ($txt -match '\*\s*1\.20?\b') {
            $failures += "FAIL [$($pf.FullName)]: still contains * 1.2 / * 1.20 VAT calculation!"
        }
        if ($txt -match 'data-i18n="product\.tva_included"') {
            $failures += "FAIL [$($pf.FullName)]: still contains product.tva_included span!"
        }
    }
}

if ($failures.Count -gt 0) {
    Write-Host "=== FAILURES ==="
    $failures | ForEach-Object { Write-Host $_ }
    exit 1
} else {
    Write-Host "=== ALL VERIFICATION CHECKS PASSED SUCCESSFULLY ==="
}

