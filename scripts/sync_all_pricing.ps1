$ErrorActionPreference = 'Stop'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$rootDir = "c:\Users\User\Documents\Antigravity\VENTE DE CHAUFFAGE"

# 1. Load products.json
$productsJsonPath = Join-Path $rootDir "data\products.json"
$rawJson = [System.IO.File]::ReadAllText($productsJsonPath, $utf8NoBom)
$rawJson = $rawJson.Replace('"humidity_bucket":  "non spécifié"', '"humidity_bucket":  "15 à 20%"')
$rawJson = $rawJson.Replace('"humidity_bucket": "non spécifié"', '"humidity_bucket": "15 à 20%"')
$rawJson = [regex]::Replace($rawJson, '(?s)("id"\s*:\s*"pini-kay-compressbee".*?"wholesale_price"\s*:\s*)479', '${1}270')
$rawJson = [regex]::Replace($rawJson, '(?s)("id"\s*:\s*"pini-kay-compressbee".*?"humidity_bucket"\s*:\s*\{\s*"fr"\s*:\s*")Inférieur à 8 %"', '${1}inférieur à 8 %"')
$rawJson = $rawJson.Replace('"fr":  "Octogonale (Pini Kay)"', '"fr":  "octogonale (Pini Kay)"')
$rawJson = $rawJson.Replace('"fr": "Octogonale (Pini Kay)"', '"fr": "octogonale (Pini Kay)"')
if ($rawJson -notmatch '(?s)"id"\s*:\s*"buches-torche-suedoise".*?"humidity_bucket"') {
    $torcheHumidityJson = @'
        "volume_m3":  2.16,
        "humidity_bucket":  {
                                "fr":  "15 à 20 %",
                                "en":  "15 to 20%",
                                "de":  "15 bis 20 %",
                                "nl":  "15 tot 20 %"
                            },
        "packaging":  {
                          "fr":  "160 pièces par palette",
'@
    $rawJson = [regex]::Replace($rawJson, '(?s)"volume_m3"\s*:\s*2\.16,\s*"packaging"\s*:\s*\{\s*"fr"\s*:\s*"160 pièces par palette",', $torcheHumidityJson.Replace("`r`n", "`n"))
}
$rawJson = $rawJson.Replace("`r`n", "`n")
$rawJson = $rawJson.Replace('"fr":  "environ 15 cm"', '"fr":  "environ 15 à 25 cm"').Replace('"fr": "environ 15 cm"', '"fr": "environ 15 à 25 cm"')
$rawJson = $rawJson.Replace('"en":  "approx. 15 cm"', '"en":  "approx. 15 to 25 cm"').Replace('"en": "approx. 15 cm"', '"en": "approx. 15 to 25 cm"')
$rawJson = $rawJson.Replace('"de":  "ca. 15 cm"', '"de":  "ca. 15 bis 25 cm"').Replace('"de": "ca. 15 cm"', '"de": "ca. 15 bis 25 cm"')
$rawJson = $rawJson.Replace('"nl":  "ongeveer 15 cm"', '"nl":  "ongeveer 15 tot 25 cm"').Replace('"nl": "ongeveer 15 cm"', '"nl": "ongeveer 15 tot 25 cm"')

# Update Briquettes d'écorce: humidity_bucket "Inférieur à 12 %", packaging "100 unités par palette"
$ecorceOldPattern = '(?s)"id"\s*:\s*"briquettes-ecorce".*?"volume_m3"\s*:\s*2\.16(\s*,\s*"humidity_bucket"\s*:\s*\{[^}]*\})?,\s*"packaging"\s*:\s*\{[^}]*\}'
$ecorceNewBlock = @'
"id":  "briquettes-ecorce",
        "subgroup_id":  3,
        "subgroup_name":  "Briquettes",
        "name":  {
                     "fr":  "Briquettes d\u0027écorce",
                     "en":  "Bark Briquettes",
                     "de":  "Rindenbriketts",
                     "nl":  "Schorsbriketten"
                 },
        "format":  "Rectangulaire écorce",
        "unit_weight":  "10 kg",
        "units_per_palette":  100,
        "palette_weight":  "1000 kg",
        "wholesale_price":  198,
        "recommended_price":  245,
        "positioning":  {
                            "fr":  "Très bon prix",
                            "en":  "Excellent value",
                            "de":  "Sehr guter Preis",
                            "nl":  "Zeer goede prijs"
                        },
        "species_material":  {
                                 "fr":  "100% Écorces naturelles compressées",
                                 "en":  "100% compressed natural bark",
                                 "de":  "100% verdichtete Naturrinde",
                                 "nl":  "100% geperste natuurlijke schors"
                             },
        "image_product":  "/assets/images/products/briquettes-ecorce-product.jpg",
        "image_packaging":  "/assets/images/products/briquettes-ecorce-packaging.jpg",
        "available":  true,
        "volume_m3":  2.16,
        "humidity_bucket":  {
                                "fr":  "Inférieur à 12 %",
                                "en":  "Less than 12%",
                                "de":  "Unter 12%",
                                "nl":  "Minder dan 12%"
                            },
        "packaging":  {
                          "fr":  "100 unités par palette",
                          "en":  "100 units per pallet",
                          "de":  "100 Einheiten pro Palette",
                          "nl":  "100 stuks per pallet"
                      }
'@.Replace("`r`n", "`n").TrimEnd()
$rawJson = [regex]::Replace($rawJson, $ecorceOldPattern, $ecorceNewBlock)

# Restore Charbon de bois en morceaux: humidity_bucket "Inférieur à 8 %", packaging "2 grands sacs de 400 kg par palette"
$charbonOldPattern = '(?s)"id"\s*:\s*"charbon-bois-morceaux".*?"volume_m3"\s*:\s*2\.16(\s*,\s*"humidity_bucket"\s*:\s*\{[^}]*\})?,\s*"packaging"\s*:\s*\{[^}]*\}'
$charbonNewBlock = @'
"id":  "charbon-bois-morceaux",
        "subgroup_id":  5,
        "subgroup_name":  "Charbon / Allume-feu / Bûches de torche",
        "name":  {
                     "fr":  "Charbon de bois en morceaux",
                     "en":  "Lump Wood Charcoal",
                     "de":  "Holzkohle (stückig)",
                     "nl":  "Houtskool (in stukken)"
                 },
        "format":  "Gros morceaux qualité restaurant",
        "unit_weight":  "10 kg",
        "units_per_palette":  80,
        "palette_weight":  "800 kg",
        "wholesale_price":  200,
        "recommended_price":  212.5,
        "positioning":  {
                            "fr":  "Bon prix – sous marché",
                            "en":  "Great value – below market",
                            "de":  "Guter Preis – unter Marktniveau",
                            "nl":  "Goede prijs – onder marktniveau"
                        },
        "species_material":  {
                                 "fr":  "Charbon de bois dépoussiéré",
                                 "en":  "Dedusted lump charcoal",
                                 "de":  "Entstaubte Holzkohle",
                                 "nl":  "Ontstofte houtskool"
                             },
        "image_product":  "/assets/images/products/charbon-bois-morceaux-product.jpg",
        "image_packaging":  "/assets/images/products/charbon-bois-morceaux-packaging.jpg",
        "available":  true,
        "volume_m3":  2.16,
        "humidity_bucket":  {
                                "fr":  "Inférieur à 8 %",
                                "en":  "Under 8%",
                                "de":  "Unter 8 %",
                                "nl":  "Minder dan 8 %"
                            },
        "packaging":  {
                          "fr":  "2 grands sacs de 400 kg par palette",
                          "en":  "2 big bags of 400 kg per pallet",
                          "de":  "2 Big Bags à 400 kg pro Palette",
                          "nl":  "2 big bags van 400 kg per pallet"
                      }
'@.Replace("`r`n", "`n").TrimEnd()
$rawJson = [regex]::Replace($rawJson, $charbonOldPattern, $charbonNewBlock)

# Restore Bûches de torche suédoise: humidity_bucket "15 à 20 %", packaging "160 pièces par palette", height "25 cm", diameter "environ 15 à 25 cm"
$torcheOldPattern = '(?s)"id"\s*:\s*"buches-torche-suedoise".*?"diameter"\s*:\s*\{[^}]*\}'
$torcheNewBlock = @'
"id":  "buches-torche-suedoise",
        "subgroup_id":  5,
        "subgroup_name":  "Charbon / Allume-feu / Bûches de torche",
        "name":  {
                     "fr":  "Bûches de torche suédoise",
                     "en":  "Swedish Torch Log",
                     "de":  "Schwedenfackel",
                     "nl":  "Zweedse Fakkel"
                 },
        "format":  "Bûche fendue avec mèche intégrée",
        "unit_weight":  "5 kg",
        "units_per_palette":  160,
        "palette_weight":  "800 kg",
        "wholesale_price":  224,
        "recommended_price":  280,
        "positioning":  {
                            "fr":  "Bon prix – sous marché",
                            "en":  "Great value – below market",
                            "de":  "Guter Preis – unter Marktniveau",
                            "nl":  "Goede prijs – onder marktniveau"
                        },
        "species_material":  {
                                 "fr":  "Bois naturel résineux",
                                 "en":  "Natural softwood",
                                 "de":  "Naturbelassenes Nadelholz",
                                 "nl":  "Natuurlijk naaldhout"
                             },
        "image_product":  "/assets/images/products/buches-torche-suedoise-product.jpg",
        "image_packaging":  "/assets/images/products/buches-torche-suedoise-packaging.jpg",
        "available":  true,
        "volume_m3":  2.16,
        "humidity_bucket":  {
                                "fr":  "15 à 20 %",
                                "en":  "15 to 20%",
                                "de":  "15 bis 20 %",
                                "nl":  "15 tot 20 %"
                            },
        "packaging":  {
                          "fr":  "160 pièces par palette",
                          "en":  "160 pieces per pallet",
                          "de":  "160 Stück pro Palette",
                          "nl":  "160 stuks per pallet"
                      },
        "height":  "25 cm",
        "diameter":  {
                         "fr":  "environ 15 à 25 cm",
                         "en":  "approx. 15 to 25 cm",
                         "de":  "ca. 15 bis 25 cm",
                         "nl":  "ongeveer 15 tot 25 cm"
                     }
'@.Replace("`r`n", "`n").TrimEnd()
$rawJson = [regex]::Replace($rawJson, $torcheOldPattern, $torcheNewBlock)

# Update JOUR ECO - Cylindrique: price 200, format "20 à 30 cm", humidity_bucket "≤ 10 %", diameter "6 à 9 cm", length "20 à 30 cm"
$jourEcoOldPattern = '(?s)"id"\s*:\s*"jour-eco-cylindrique".*?"volume_m3"\s*:\s*2\.16(\s*,\s*"humidity_bucket".*?"packaging"\s*:\s*\{[^}]*\})?'
$jourEcoNewBlock = @'
"id":  "jour-eco-cylindrique",
        "subgroup_id":  2,
        "subgroup_name":  "Bûches compressées / briquettes de bois",
        "name":  {
                     "fr":  "JOUR ECO – Cylindrique",
                     "en":  "DAY ECO – Cylindrical Briquette",
                     "de":  "TAG ECO – Zylindrisch",
                     "nl":  "DAG ECO – Cilindrisch"
                 },
        "format":  "20 à 30 cm",
        "unit_weight":  "10 kg",
        "units_per_palette":  100,
        "palette_weight":  "1000 kg",
        "wholesale_price":  200,
        "recommended_price":  312.5,
        "positioning":  {
                            "fr":  "Très bon prix",
                            "en":  "Excellent value",
                            "de":  "Sehr guter Preis",
                            "nl":  "Zeer goede prijs"
                        },
        "species_material":  {
                                 "fr":  "Mélange copeaux \u0026 sciures compressés",
                                 "en":  "Compressed wood shavings \u0026 sawdust blend",
                                 "de":  "Mischung aus verdichteten Holzspänen und Sägemehl",
                                 "nl":  "Mix van geperste houtkrullen en zaagsel"
                             },
        "image_product":  "/assets/images/products/jour-eco-cylindrique-product.jpg",
        "image_packaging":  "/assets/images/products/jour-eco-cylindrique-packaging.jpg",
        "available":  true,
        "volume_m3":  2.16,
        "humidity_bucket":  {
                                "fr":  "≤ 10 %",
                                "en":  "≤ 10%",
                                "de":  "≤ 10 %",
                                "nl":  "≤ 10 %"
                            },
        "diameter":  {
                         "fr":  "6 à 9 cm",
                         "en":  "6 to 9 cm",
                         "de":  "6 bis 9 cm",
                         "nl":  "6 tot 9 cm"
                     },
        "length":  {
                       "fr":  "20 à 30 cm",
                       "en":  "20 to 30 cm",
                       "de":  "20 bis 30 cm",
                       "nl":  "20 tot 30 cm"
                   },
        "packaging":  {
                          "fr":  "100 unités par palette",
                          "en":  "100 units per pallet",
                          "de":  "100 Einheiten pro Palette",
                          "nl":  "100 stuks per pallet"
                      }
'@.Replace("`r`n", "`n").TrimEnd()
$rawJson = [regex]::Replace($rawJson, $jourEcoOldPattern, $jourEcoNewBlock)

[System.IO.File]::WriteAllText($productsJsonPath, $rawJson, $utf8NoBom)
$products = $rawJson | ConvertFrom-Json

$calorificMap = @{
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

$productMap = @{}
foreach ($p in $products) {
    if ($calorificMap.ContainsKey($p.id)) {
        $p | Add-Member -NotePropertyName "calorific_value" -NotePropertyValue $calorificMap[$p.id] -Force
    }
    $productMap[$p.id] = $p
}

$rawJson = $products | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($productsJsonPath, $rawJson, $utf8NoBom)

function Format-FrPrice([double]$val) {
    return $val.ToString("0.00", [System.Globalization.CultureInfo]::InvariantCulture).Replace('.', ',') + " €"
}

function Format-DotPrice([double]$val) {
    return $val.ToString("0.00", [System.Globalization.CultureInfo]::InvariantCulture)
}

# 2. Update all product pages (produits/*.html, {en,de,nl}/produits/*.html, produit.html, {en,de,nl}/produit.html)
$langDirs = @(
    @{ Lang = 'fr'; Prefix = '' },
    @{ Lang = 'en'; Prefix = 'en\' },
    @{ Lang = 'de'; Prefix = 'de\' },
    @{ Lang = 'nl'; Prefix = 'nl\' }
)

$subtotalLabels = @{
    'fr' = 'Sous-total'
    'en' = 'Subtotal'
    'de' = 'Zwischensumme'
    'nl' = 'Subtotaal'
}
$totalLabels = @{
    'fr' = 'Total'
    'en' = 'Total'
    'de' = 'Gesamtbetrag'
    'nl' = 'Totaal'
}

$updatedProductFiles = 0

foreach ($ld in $langDirs) {
    $lang = $ld.Lang
    $prefix = $ld.Prefix

    # Gather files: {prefix}produit.html and {prefix}produits\*.html
    $filesToProcess = @()
    $mainProdFile = Join-Path $rootDir ($prefix + "produit.html")
    if (Test-Path $mainProdFile) {
        $filesToProcess += Get-Item $mainProdFile
    }
    $prodSubDir = Join-Path $rootDir ($prefix + "produits")
    if (Test-Path $prodSubDir) {
        $filesToProcess += Get-ChildItem -Path $prodSubDir -Filter "*.html"
    }

    foreach ($file in $filesToProcess) {
        $content = [System.IO.File]::ReadAllText($file.FullName, $utf8NoBom)
        $content = $content.Replace("`r`n", "`n")

        # Determine product ID (from filename or default hetre-etuve)
        $prodId = if ($file.Name -eq "produit.html") { "hetre-etuve" } else { [System.IO.Path]::GetFileNameWithoutExtension($file.Name) }
        $prod = $productMap[$prodId]

        if ($null -ne $prod) {
            $isBuche = ($prod.subgroup_id -eq 1 -and $null -ne $prod.prices_by_length)
            $refPrice = if ($isBuche) { [double]$prod.prices_by_length.'20' } else { [double]$prod.wholesale_price }

            # A. Update static JSON-LD offers price(s) in <script type="application/ld+json">
            if ($isBuche) {
                foreach ($len in @('20', '30', '33', '40', '50')) {
                    $lenPrice = Format-DotPrice ([double]$prod.prices_by_length.$len)
                    # Match offer block for this length
                    $pattern = '(?s)("url"\s*:\s*"[^"]*\?length=' + $len + '"\s*,\s*"price"\s*:\s*")[0-9.]+(")'
                    $content = [regex]::Replace($content, $pattern, "`${1}$lenPrice`${2}")
                }
            } else {
                $fixedPriceDot = Format-DotPrice $refPrice
                $pattern = '(?s)("offers"\s*:\s*\{\s*"@type"\s*:\s*"Offer"\s*,\s*"url"\s*:\s*"[^"]*"\s*,\s*"price"\s*:\s*")[0-9.]+(")'
                $content = [regex]::Replace($content, $pattern, "`${1}$fixedPriceDot`${2}")
            }

            # B. Update static HTML initial values (#unit-price-ttc, #subtotal, #total, #spec-longueur, #spec-conditionnement)
            $refPriceFr = Format-FrPrice $refPrice
            $fivePalettesFr = Format-FrPrice ($refPrice * 5)

            $content = [regex]::Replace($content, '(<span[^>]*id="unit-price-ttc"[^>]*>)[^<]*(</span>)', "`${1}$refPriceFr`${2}")
            $content = [regex]::Replace($content, '(<span[^>]*id="subtotal"[^>]*>)[^<]*(</span>)', "`${1}$fivePalettesFr`${2}")
            $content = [regex]::Replace($content, '(<span[^>]*id="total"[^>]*>)[^<]*(</span>)', "`${1}$fivePalettesFr`${2}")
            if ($prod.calorific_value) {
                $content = [regex]::Replace($content, '(<span[^>]*id="spec-pouvoir"[^>]*>)[^<]*(</span>)', "`${1}$($prod.calorific_value)`${2}")
            }

            if ($isBuche) {
                $content = [regex]::Replace($content, '(<span[^>]*id="spec-longueur"[^>]*>)[^<]*(</span>)', "`${1}20 cm`${2}")
                $pack20 = $prod.packaging_by_length.'20'.$lang
                if (-not $pack20) { $pack20 = $prod.packaging_by_length.'20'.fr }
                $content = [regex]::Replace($content, '(<span[^>]*id="spec-conditionnement"[^>]*>)[^<]*(</span>)', "`${1}$pack20`${2}")
                if ($prodId -eq "chene-sec-air") {
                    $content = [regex]::Replace($content, '(<span[^>]*id="spec-humidite"[^>]*>)[^<]*(</span>)', "`${1}15 à 20%`${2}")
                    $content = $content.Replace("Humidité: non spécifié", "Humidité: 15 à 20%")
                }
            } elseif ($null -ne $prod.packaging) {
                $packFixed = $prod.packaging.$lang
                if (-not $packFixed) { $packFixed = $prod.packaging.fr }
                if ($packFixed) {
                    $content = [regex]::Replace($content, '(<span[^>]*id="spec-conditionnement"[^>]*>)[^<]*(</span>)', "`${1}$packFixed`${2}")
                }
                if ($prodId -eq "pini-kay-compressbee") {
                    if ($lang -eq "fr") {
                        $content = [regex]::Replace($content, '(<span[^>]*id="spec-essence"[^>]*>)[^<]*(</span>)', '${1}100 % bois dur — mélange de chêne et de hêtre${2}')
                        $content = [regex]::Replace($content, '(<span[^>]*id="spec-forme"[^>]*>)[^<]*(</span>)', '${1}octogonale (Pini Kay)${2}')
                        $content = [regex]::Replace($content, '(<span[^>]*id="spec-diametre"[^>]*>)[^<]*(</span>)', '${1}6 à 7 cm${2}')
                        $content = [regex]::Replace($content, '(<span[^>]*id="spec-longueur"[^>]*>)[^<]*(</span>)', '${1}environ 20 à 25 cm${2}')
                        $content = [regex]::Replace($content, '(<span[^>]*id="spec-humidite"[^>]*>)[^<]*(</span>)', '${1}inférieur à 8 %${2}')
                    }
                    # Prevent any overlap in the 2-column specs grid by ensuring gap-4 items-baseline and shrink-0 on labels
                    $content = $content.Replace('<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-essence">', '<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-essence">')
                    $content = $content.Replace('<span class="text-label-md font-label-md text-on-surface-variant" data-i18n="product.species">', '<span class="text-label-md font-label-md text-on-surface-variant shrink-0" data-i18n="product.species">')
                    $content = $content.Replace('<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-forme">', '<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-forme">')
                    $content = $content.Replace('<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-diametre">', '<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-diametre">')
                    $content = $content.Replace('<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-longueur">', '<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-longueur">')
                    $content = $content.Replace('<span class="text-label-md font-label-md text-on-surface-variant" data-i18n="product.length">', '<span class="text-label-md font-label-md text-on-surface-variant shrink-0" data-i18n="product.length">')
                }
                if ($prodId -eq "buches-torche-suedoise") {
                    $humLabels = @{ 'fr' = "TAUX D'HUMIDITÉ"; 'en' = "MOISTURE CONTENT"; 'de' = "FEUCHTIGKEITSGEHALT"; 'nl' = "VOCHTGEHALTE" }
                    $humVals   = @{ 'fr' = "15 à 20 %"; 'en' = "15 to 20%"; 'de' = "15 bis 20 %"; 'nl' = "15 tot 20 %" }
                    $diamVals  = @{ 'fr' = "environ 15 à 25 cm"; 'en' = "approx. 15 to 25 cm"; 'de' = "ca. 15 bis 25 cm"; 'nl' = "ongeveer 15 tot 25 cm" }
                    $descVals  = @{
                        'fr' = "Bois naturel résineux - Humidité: 15 à 20 %"
                        'en' = "Natural softwood - Humidité: 15 to 20%"
                        'de' = "Naturbelassenes Nadelholz - Humidité: 15 bis 20 %"
                        'nl' = "Natuurlijk naaldhout - Humidité: 15 tot 20 %"
                    }
                    $hLbl = $humLabels[$lang]
                    $hVal = $humVals[$lang]
                    $diamVal = $diamVals[$lang]
                    $dVal = $descVals[$lang]

                    $content = [regex]::Replace($content, '(<span[^>]*id="product-desc"[^>]*>)[^<]*(</span>)', "`${1}$dVal`${2}")
                    $content = [regex]::Replace($content, '(<span[^>]*id="spec-diametre"[^>]*>)[^<]*(</span>)', "`${1}$diamVal`${2}")

                    # Insert #spec-row-humidite right after #spec-row-diametre if not present, or update #spec-humidite
                    if ($content -notmatch 'id="spec-row-humidite"') {
                        $humRowHtml = @"
<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-humidite">
<span class="text-label-md font-label-md text-on-surface-variant shrink-0" data-i18n="specs.humidity">$hLbl</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-humidite">$hVal</span>
</div>
"@.Replace("`r`n", "`n").TrimEnd()
                        $content = [regex]::Replace($content, '(<div[^>]*id="spec-row-diametre"[^>]*>.*?</div>)', "`${1}`n$humRowHtml", [System.Text.RegularExpressions.RegexOptions]::Singleline)
                    } else {
                        $content = [regex]::Replace($content, '(<span[^>]*id="spec-humidite"[^>]*>)[^<]*(</span>)', "`${1}$hVal`${2}")
                    }

                    # Remove md:col-span-2 from #spec-row-conditionnement so all 10 items align in 5 balanced 2-column rows
                    $content = $content.Replace('id="spec-row-conditionnement"', 'id="spec-row-conditionnement"').Replace('gap-4 items-baseline md:col-span-2" id="spec-row-conditionnement"', 'gap-4 items-baseline" id="spec-row-conditionnement"')

                    # Ensure gap-4 items-baseline and shrink-0 on labels so long values never overlap or misalign
                    $content = $content.Replace('<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-essence">', '<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-essence">')
                    $content = $content.Replace('<span class="text-label-md font-label-md text-on-surface-variant" data-i18n="product.species">', '<span class="text-label-md font-label-md text-on-surface-variant shrink-0" data-i18n="product.species">')
                    $content = $content.Replace('<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-longueur">', '<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-longueur">')
                    $content = $content.Replace('<span class="text-label-md font-label-md text-on-surface-variant" data-i18n="product.length">', '<span class="text-label-md font-label-md text-on-surface-variant shrink-0" data-i18n="product.length">')
                    $content = $content.Replace('<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-hauteur">', '<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-hauteur">')
                    $content = $content.Replace('<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-diametre">', '<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-diametre">')
                }
                if ($prodId -eq "briquettes-ruf") {
                    # Remove #spec-row-humidite from static HTML of briquettes-ruf.html
                    $content = [regex]::Replace($content, '\s*<div[^>]*id="spec-row-humidite"[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
                    $content = $content.Replace('gap-4 items-baseline" id="spec-row-conditionnement"', 'gap-4 items-baseline md:col-span-2" id="spec-row-conditionnement"')
                }
                if ($prodId -eq "briquettes-ecorce") {
                    $humValsEcorce = @{ 'fr' = "Inférieur à 12 %"; 'en' = "Less than 12%"; 'de' = "Unter 12%"; 'nl' = "Minder dan 12%" }
                    $hValEc = $humValsEcorce[$lang]
                    $content = [regex]::Replace($content, '(<span[^>]*id="spec-humidite"[^>]*>)[^<]*(</span>)', "`${1}$hValEc`${2}")
                }
                if ($prodId -eq "jour-eco-cylindrique") {
                    $lenVals  = @{ 'fr' = "20 à 30 cm"; 'en' = "20 to 30 cm"; 'de' = "20 bis 30 cm"; 'nl' = "20 tot 30 cm" }
                    $diamLbls = @{ 'fr' = "DIAMÈTRE"; 'en' = "DIAMETER"; 'de' = "DURCHMESSER"; 'nl' = "DIAMETER" }
                    $diamVals = @{ 'fr' = "6 à 9 cm"; 'en' = "6 to 9 cm"; 'de' = "6 bis 9 cm"; 'nl' = "6 tot 9 cm" }
                    $humLbls  = @{ 'fr' = "TAUX D'HUMIDITÉ"; 'en' = "MOISTURE CONTENT"; 'de' = "FEUCHTIGKEITSGEHALT"; 'nl' = "VOCHTGEHALTE" }
                    $humVals  = @{ 'fr' = "≤ 10 %"; 'en' = "≤ 10%"; 'de' = "≤ 10 %"; 'nl' = "≤ 10 %" }

                    $lVal = $lenVals[$lang]
                    $dLbl = $diamLbls[$lang]
                    $dVal = $diamVals[$lang]
                    $hLbl = $humLbls[$lang]
                    $hVal = $humVals[$lang]

                    $content = [regex]::Replace($content, '(<span[^>]*id="spec-longueur"[^>]*>)[^<]*(</span>)', "`${1}$lVal`${2}")

                    # Remove any existing #spec-row-diametre or #spec-row-humidite and insert both cleanly after #spec-row-longueur
                    $content = [regex]::Replace($content, '\s*<div[^>]*id="spec-row-diametre"[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
                    $content = [regex]::Replace($content, '\s*<div[^>]*id="spec-row-humidite"[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)

                    $diamAndHumHtml = @"
<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-diametre">
<span class="text-label-md font-label-md text-on-surface-variant shrink-0">$dLbl</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-diametre">$dVal</span>
</div>
<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-humidite">
<span class="text-label-md font-label-md text-on-surface-variant shrink-0" data-i18n="specs.humidity">$hLbl</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-humidite">$hVal</span>
</div>
"@.Replace("`r`n", "`n").TrimEnd()
                    $content = [regex]::Replace($content, '(<div[^>]*id="spec-row-longueur"[^>]*>.*?</div>)', "`${1}`n$diamAndHumHtml", [System.Text.RegularExpressions.RegexOptions]::Singleline)

                    # Ensure gap-4 items-baseline and shrink-0 on labels so long composition text never overlaps
                    $content = $content.Replace('<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-essence">', '<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-essence">')
                    $content = $content.Replace('<span class="text-label-md font-label-md text-on-surface-variant" data-i18n="product.species">', '<span class="text-label-md font-label-md text-on-surface-variant shrink-0" data-i18n="product.species">')
                    $content = $content.Replace('<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-longueur">', '<div class="flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline" id="spec-row-longueur">')
                    $content = $content.Replace('<span class="text-label-md font-label-md text-on-surface-variant" data-i18n="product.length">', '<span class="text-label-md font-label-md text-on-surface-variant shrink-0" data-i18n="product.length">')
                }
            }
        }

        # Keep exact composition in #product-desc for jour-eco-cylindrique and fix accidental match on else if (product.id === 'jour-forte-chaleur-cubique')
        $content = $content.Replace("document.getElementById('spec-pouvoir').textContent = '~ 4.8 kWh/kg';", "document.getElementById('spec-pouvoir').textContent = product.calorific_value || '4,8 kWh/kg';")
        $content = $content.Replace("} else if (product.id === 'jour-forte-chaleur-cubique' || product.id === 'jour-eco-cylindrique') {", "} else if (product.id === 'jour-forte-chaleur-cubique') {")
        $content = $content.Replace("} else if (product.id === 'briquettes-ruf' || product.id === 'briquettes-ecorce' || product.id === 'jour-premium-cylindrique' || product.id === 'jour-forte-chaleur-cubique') {", "} else if (product.id === 'briquettes-ruf' || product.id === 'briquettes-ecorce' || product.id === 'jour-premium-cylindrique' || product.id === 'jour-forte-chaleur-cubique' || product.id === 'jour-eco-cylindrique') {")

        if ($content -notmatch "product\.id === 'jour-eco-cylindrique'\)\s*\{\s*const diameterLabels") {
            $oldNotHasHum = @'
                                } else if (!hasHumidity) {
                                    if (specRowHumidite) specRowHumidite.remove();
                                    if (specRowConditionnement) specRowConditionnement.classList.add('md:col-span-2');
                                }
'@.Replace("`r`n", "`n")
            $newJourEcoAndNotHasHum = @'
                                } else if (product.id === 'jour-eco-cylindrique') {
                                    const diameterLabels = { fr: 'DIAMÈTRE', en: 'DIAMETER', de: 'DURCHMESSER', nl: 'DIAMETER' };
                                    const diameterValues = { fr: '6 à 9 cm', en: '6 to 9 cm', de: '6 bis 9 cm', nl: '6 tot 9 cm' };
                                    const lengthValues = { fr: '20 à 30 cm', en: '20 to 30 cm', de: '20 bis 30 cm', nl: '20 tot 30 cm' };

                                    const dLabel = diameterLabels[lang] || 'DIAMÈTRE';
                                    const dVal = diameterValues[lang] || '6 à 9 cm';
                                    const lVal = lengthValues[lang] || '20 à 30 cm';

                                    const specLong = document.getElementById('spec-longueur');
                                    if (specLong) specLong.textContent = lVal;

                                    let rowDiametre = document.getElementById('spec-row-diametre');
                                    if (!rowDiametre) {
                                        rowDiametre = document.createElement('div');
                                        rowDiametre.className = 'flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline';
                                        rowDiametre.id = 'spec-row-diametre';
                                        rowDiametre.innerHTML = '<span class="text-label-md font-label-md text-on-surface-variant shrink-0">' + dLabel + '</span><span class="text-body-md font-data-mono text-on-surface text-right" id="spec-diametre">' + dVal + '</span>';
                                        if (specRowHumidite) specRowHumidite.before(rowDiametre);
                                    } else {
                                        const dValEl = document.getElementById('spec-diametre');
                                        if (dValEl) dValEl.textContent = dVal;
                                    }

                                    if (specRowConditionnement) specRowConditionnement.classList.add('md:col-span-2');
                                } else if (!hasHumidity) {
                                    if (specRowHumidite) specRowHumidite.remove();
                                    if (specRowConditionnement) specRowConditionnement.classList.add('md:col-span-2');
                                }
'@.Replace("`r`n", "`n")
            $content = $content.Replace($oldNotHasHum, $newJourEcoAndNotHasHum)
        }

        # Update buches-torche-suedoise JS spec handling in all product pages so spec-row-humidite is preserved and aligned
        $oldTorcheJs = @'
                                if (product.id === 'buches-torche-suedoise') {
                                    if (specRowHumidite && !document.getElementById('spec-row-hauteur')) {
                                        const heightLabels = { fr: 'HAUTEUR', en: 'HEIGHT', de: 'HÖHE', nl: 'HOOGTE' };
                                        const diameterLabels = { fr: 'DIAMÈTRE', en: 'DIAMETER', de: 'DURCHMESSER', nl: 'DIAMETER' };
                                        const heightValues = { fr: '25 cm', en: '25 cm', de: '25 cm', nl: '25 cm' };
                                        const diameterValues = { fr: 'environ 15 cm', en: 'approx. 15 cm', de: 'ca. 15 cm', nl: 'ongeveer 15 cm' };

                                        const hLabel = heightLabels[lang] || 'HAUTEUR';
                                        const dLabel = diameterLabels[lang] || 'DIAMÈTRE';
                                        const hVal = heightValues[lang] || '25 cm';
                                        const dVal = diameterValues[lang] || 'environ 15 cm';

                                        const rowHauteur = document.createElement('div');
                                        rowHauteur.className = "flex justify-between py-3 border-b border-outline/30";
                                        rowHauteur.id = "spec-row-hauteur";
                                        rowHauteur.innerHTML = `<span class="text-label-md font-label-md text-on-surface-variant">${hLabel}</span><span class="text-body-md font-data-mono text-on-surface text-right" id="spec-hauteur">${hVal}</span>`;

                                        const rowDiametre = document.createElement('div');
                                        rowDiametre.className = "flex justify-between py-3 border-b border-outline/30";
                                        rowDiametre.id = "spec-row-diametre";
                                        rowDiametre.innerHTML = `<span class="text-label-md font-label-md text-on-surface-variant">${dLabel}</span><span class="text-body-md font-data-mono text-on-surface text-right" id="spec-diametre">${dVal}</span>`;

                                        specRowHumidite.replaceWith(rowHauteur, rowDiametre);
                                    }
                                    if (specRowConditionnement) specRowConditionnement.classList.add('md:col-span-2');
                                }
'@.Replace("`r`n", "`n")
        $newTorcheJs = @'
                                if (product.id === 'buches-torche-suedoise') {
                                    const heightLabels = { fr: 'HAUTEUR', en: 'HEIGHT', de: 'HÖHE', nl: 'HOOGTE' };
                                    const diameterLabels = { fr: 'DIAMÈTRE', en: 'DIAMETER', de: 'DURCHMESSER', nl: 'DIAMETER' };
                                    const heightValues = { fr: '25 cm', en: '25 cm', de: '25 cm', nl: '25 cm' };
                                    const diameterValues = { fr: 'environ 15 cm', en: 'approx. 15 cm', de: 'ca. 15 cm', nl: 'ongeveer 15 cm' };

                                    const hLabel = heightLabels[lang] || 'HAUTEUR';
                                    const dLabel = diameterLabels[lang] || 'DIAMÈTRE';
                                    const hVal = heightValues[lang] || '25 cm';
                                    const dVal = diameterValues[lang] || 'environ 15 cm';

                                    let rowHauteur = document.getElementById('spec-row-hauteur');
                                    if (!rowHauteur) {
                                        rowHauteur = document.createElement('div');
                                        rowHauteur.className = "flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline";
                                        rowHauteur.id = "spec-row-hauteur";
                                        rowHauteur.innerHTML = `<span class="text-label-md font-label-md text-on-surface-variant shrink-0">${hLabel}</span><span class="text-body-md font-data-mono text-on-surface text-right" id="spec-hauteur">${hVal}</span>`;
                                        if (specRowHumidite) specRowHumidite.before(rowHauteur);
                                    } else {
                                        const hValEl = document.getElementById('spec-hauteur');
                                        if (hValEl) hValEl.textContent = hVal;
                                    }

                                    let rowDiametre = document.getElementById('spec-row-diametre');
                                    if (!rowDiametre) {
                                        rowDiametre = document.createElement('div');
                                        rowDiametre.className = "flex justify-between py-3 border-b border-outline/30 gap-4 items-baseline";
                                        rowDiametre.id = "spec-row-diametre";
                                        rowDiametre.innerHTML = `<span class="text-label-md font-label-md text-on-surface-variant shrink-0">${dLabel}</span><span class="text-body-md font-data-mono text-on-surface text-right" id="spec-diametre">${dVal}</span>`;
                                        if (specRowHumidite) specRowHumidite.before(rowDiametre);
                                    } else {
                                        const dValEl = document.getElementById('spec-diametre');
                                        if (dValEl) dValEl.textContent = dVal;
                                    }
                                    if (specRowConditionnement) specRowConditionnement.classList.remove('md:col-span-2');
                                }
'@.Replace("`r`n", "`n")
        if ($content.Contains($oldTorcheJs)) {
            $content = $content.Replace($oldTorcheJs, $newTorcheJs)
        }
        $content = $content.Replace("const diameterValues = { fr: 'environ 15 cm', en: 'approx. 15 cm', de: 'ca. 15 cm', nl: 'ongeveer 15 cm' };", "const diameterValues = { fr: 'environ 15 à 25 cm', en: 'approx. 15 to 25 cm', de: 'ca. 15 bis 25 cm', nl: 'ongeveer 15 tot 25 cm' };")
        $content = $content.Replace("const dVal = diameterValues[lang] || 'environ 15 cm';", "const dVal = diameterValues[lang] || 'environ 15 à 25 cm';")

        # Update Pini Kay JS shape value in all product pages
        $content = $content.Replace("const shapeValues = { fr: 'Octogonale (Pini Kay)', en: 'Octagonal (Pini Kay)', de: 'Achteckig (Pini Kay)', nl: 'Achthoekig (Pini Kay)' };", "const shapeValues = { fr: 'octogonale (Pini Kay)', en: 'Octagonal (Pini Kay)', de: 'Achteckig (Pini Kay)', nl: 'Achthoekig (Pini Kay)' };")
        $content = $content.Replace("const sVal = shapeValues[lang] || 'Octogonale (Pini Kay)';", "const sVal = shapeValues[lang] || 'octogonale (Pini Kay)';")

        # C. Remove TVA included span and TTC from static labels
        $subLbl = $subtotalLabels[$lang]
        $totLbl = $totalLabels[$lang]
        $content = [regex]::Replace($content, '(<span[^>]*data-i18n="product\.subtotal"[^>]*>)[^<]*(</span>)', "`${1}$subLbl`${2}")
        $content = [regex]::Replace($content, '(<span[^>]*data-i18n="product\.total_ttc"[^>]*>)[^<]*(</span>)', "`${1}$totLbl`${2}")
        $content = [regex]::Replace($content, '\s*<span[^>]*data-i18n="product\.tva_included"[^>]*>[^<]*</span>', '')

        # D. Update JS default length from '' / '50' to '20'
        $content = $content.Replace("let selectedLength = lengthFromUrl || '';", "let selectedLength = lengthFromUrl || '20';")
        $content = $content.Replace("const defaultDisplayLength = '50';", "const defaultDisplayLength = '20';")

        # Ensure window._userSelectedLength and window.currentProductLength are initialized to selectedLength for Bûches
        $oldLenInit = @'
                                let lengthFromUrl = (isBuche && urlLength && product.prices_by_length[urlLength]) ? urlLength : null;
                                // If the user came from catalogue with a valid ?length=XX, treat it as an explicit selection
                                if (lengthFromUrl) {
                                    window._userSelectedLength = lengthFromUrl;
                                    window.currentProductLength = lengthFromUrl;
                                }
'@
        $newLenInit = @'
                                let lengthFromUrl = (isBuche && urlLength && product.prices_by_length[urlLength]) ? urlLength : (isBuche ? '20' : null);
                                if (lengthFromUrl) {
                                    window._userSelectedLength = lengthFromUrl;
                                    window.currentProductLength = lengthFromUrl;
                                }
'@
        if ($content.Contains($oldLenInit)) {
            $content = $content.Replace($oldLenInit, $newLenInit)
        }

        # E. Update updatePricing() in product page JS:
        # 1) Add dynamic packaging_by_length update inside if (product.prices_by_length)
        $oldSpecLongBlock = @'
                                    if (product.prices_by_length) {
                                        const priceLength = selectedLength || defaultDisplayLength;
                                        basePrice = product.prices_by_length[priceLength];
                                        const specLong = document.getElementById('spec-longueur');
                                        if (specLong) {
                                            specLong.textContent = priceLength + ' cm';
                                        }
                                    }
'@
        $newSpecLongBlock = @'
                                    if (product.prices_by_length) {
                                        const priceLength = selectedLength || defaultDisplayLength;
                                        basePrice = product.prices_by_length[priceLength];
                                        const specLong = document.getElementById('spec-longueur');
                                        if (specLong) {
                                            specLong.textContent = priceLength + ' cm';
                                        }
                                        if (product.packaging_by_length && product.packaging_by_length[priceLength]) {
                                            const specCond = document.getElementById('spec-conditionnement');
                                            if (specCond) {
                                                const packObj = product.packaging_by_length[priceLength];
                                                specCond.textContent = (typeof packObj === 'object') ? (packObj[lang] || packObj['fr'] || '') : packObj;
                                            }
                                        }
                                    }
'@
        if ($content.Contains($oldSpecLongBlock)) {
            $content = $content.Replace($oldSpecLongBlock, $newSpecLongBlock)
        }

        # 2) Remove * 1.20 in updatePricing()
        $content = $content.Replace("const subtotalTtc = (basePrice * qty) * 1.20;", "const subtotalTtc = basePrice * qty;")
        $content = $content.Replace("const totalTtc = totalPrice * 1.20;", "const totalTtc = totalPrice;")
        $content = $content.Replace("if (unitPriceTtcEl) unitPriceTtcEl.textContent = formatCurrency(discountedUnitPrice * 1.20);", "if (unitPriceTtcEl) unitPriceTtcEl.textContent = formatCurrency(discountedUnitPrice);")
        $content = $content.Replace("discountAmtEl.textContent = '-' + formatCurrency(basePrice * qty * (discountPercentage / 100) * 1.20);", "discountAmtEl.textContent = '-' + formatCurrency(basePrice * qty * (discountPercentage / 100));")

        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
        $updatedProductFiles++
    }
}
Write-Host "Updated $updatedProductFiles product files."

# 3. Update {en,de,nl}/catalogue.html
foreach ($sub in @('en', 'de', 'nl')) {
    $catFile = Join-Path $rootDir "$sub\catalogue.html"
    if (Test-Path $catFile) {
        # Copy the exact script block from root catalogue.html or update in place
        $rootCat = [System.IO.File]::ReadAllText((Join-Path $rootDir "catalogue.html"), $utf8NoBom).Replace("`r`n", "`n")
        $c = [System.IO.File]::ReadAllText($catFile, $utf8NoBom).Replace("`r`n", "`n")

        # Extract the <script> block containing renderCatalog from root catalogue.html and apply to $sub\catalogue.html
        $scriptPattern = '(?s)// ----+\s*// STATE: two separate variables for Bûches format.*?resetButton\.addEventListener\(''click'', \(\) => \{.*?\}\);'
        $rootMatch = [regex]::Match($rootCat, $scriptPattern)
        if ($rootMatch.Success) {
            $c = [regex]::Replace($c, '(?s)// ----+\s*// STATE:.*?resetButton\.addEventListener\(''click'', \(\) => \{.*?\}\);', $rootMatch.Value)
        }

        [System.IO.File]::WriteAllText($catFile, $c, $utf8NoBom)
        Write-Host "Updated $sub\catalogue.html"
    }

    # 4. Update {en,de,nl}/recapitulatif-commande.html
    $recapFile = Join-Path $rootDir "$sub\recapitulatif-commande.html"
    if (Test-Path $recapFile) {
        $r = [System.IO.File]::ReadAllText($recapFile, $utf8NoBom).Replace("`r`n", "`n")
        $subLbl = $subtotalLabels[$sub]
        $totLbl = $totalLabels[$sub]
        $r = [regex]::Replace($r, '(<span[^>]*data-i18n="cart\.subtotal"[^>]*>)[^<]*(</span>)', "`${1}$subLbl`${2}")
        $r = [regex]::Replace($r, '(<span[^>]*data-i18n="checkout\.total_ttc"[^>]*>)[^<]*(</span>)', "`${1}$totLbl`${2}")
        [System.IO.File]::WriteAllText($recapFile, $r, $utf8NoBom)
        Write-Host "Updated $sub\recapitulatif-commande.html"
    }

    # 5. Update {en,de,nl}/devis.html
    $devisFile = Join-Path $rootDir "$sub\devis.html"
    if (Test-Path $devisFile) {
        $d = [System.IO.File]::ReadAllText($devisFile, $utf8NoBom).Replace("`r`n", "`n")
        $oldDevisChange = @'
        selectFmt.addEventListener('change', () => {
            const pid = selectProd.value;
            const product = allProducts.find(p => p.id === pid);
            if (!product) return;
            recapFormat.textContent = selectFmt.value || (product.prices_by_length ? (window.i18n ? window.i18n.t('quote.length_to_choose', 'Longueur à choisir') : 'Longueur à choisir') : (window.i18n ? window.i18n.t('quote.format_standard', 'Standard') : (product.format || 'Standard')));
        });
'@
        $newDevisChange = @'
        selectFmt.addEventListener('change', () => {
            const pid = selectProd.value;
            const product = allProducts.find(p => p.id === pid);
            if (!product) return;
            recapFormat.textContent = selectFmt.value || (product.prices_by_length ? '20 cm' : (window.i18n ? window.i18n.t('quote.format_standard', 'Standard') : (product.format || 'Standard')));
            if (product.packaging_by_length && selectFmt.value) {
                const lenKey = selectFmt.value.replace(' cm', '').trim();
                const packObj = product.packaging_by_length[lenKey];
                if (packObj && recapUnitsVal) {
                    recapUnitsVal.textContent = (typeof packObj === 'object') ? (packObj[lang] || packObj['fr'] || '') : packObj;
                }
            }
        });
'@
        $d = $d.Replace($oldDevisChange, $newDevisChange)

        $oldDevisFmt = @'
                if (urlLength && product.prices_by_length[urlLength]) {
                    selectFmt.value = urlLength + ' cm';
                } else {
                    selectFmt.selectedIndex = 0;
                }
'@
        $newDevisFmt = @'
                const defaultBucheLen = (urlLength && product.prices_by_length[urlLength]) ? urlLength : '20';
                selectFmt.value = defaultBucheLen + ' cm';
'@
        $d = $d.Replace($oldDevisFmt, $newDevisFmt)

        $oldDevisUnits = @'
            if (product.units_per_palette && product.unit_weight) {
                recapUnitsVal.textContent = product.units_per_palette + ' ' + (window.i18n ? window.i18n.t('quote.units_of', 'unités de') : 'unités de') + ' ' + product.unit_weight;
            } else {
                recapUnitsVal.textContent = '-';
            }
'@
        $newDevisUnits = @'
            if (product.packaging_by_length && selectFmt.value) {
                const lenKey = selectFmt.value.replace(' cm', '').trim();
                const packObj = product.packaging_by_length[lenKey] || product.packaging_by_length['20'];
                recapUnitsVal.textContent = (typeof packObj === 'object') ? (packObj[lang] || packObj['fr'] || '-') : (packObj || '-');
            } else if (product.units_per_palette && product.unit_weight) {
                recapUnitsVal.textContent = product.units_per_palette + ' ' + (window.i18n ? window.i18n.t('quote.units_of', 'unités de') : 'unités de') + ' ' + product.unit_weight;
            } else {
                recapUnitsVal.textContent = '-';
            }
'@
        $d = $d.Replace($oldDevisUnits, $newDevisUnits)
        [System.IO.File]::WriteAllText($devisFile, $d, $utf8NoBom)
        Write-Host "Updated $sub\devis.html"
    }

    # 6. Update {en,de,nl}/tableau-de-bord.html
    $tdbFile = Join-Path $rootDir "$sub\tableau-de-bord.html"
    if (Test-Path $tdbFile) {
        $tdb = [System.IO.File]::ReadAllText($tdbFile, $utf8NoBom).Replace("`r`n", "`n")
        $totLbl = $totalLabels[$sub]
        $tdb = [regex]::Replace($tdb, '(<span[^>]*data-i18n="modal\.total_ttc"[^>]*>)[^<]*(</span>)', "`${1}$totLbl`${2}")
        $tdb = $tdb.Replace("t('order.table.total', 'Total TTC')", "t('order.table.total', 'Total')")
        $tdb = $tdb.Replace("const puTTC = puHT * 1.20;", "const puTTC = puHT;")
        [System.IO.File]::WriteAllText($tdbFile, $tdb, $utf8NoBom)
        Write-Host "Updated $sub\tableau-de-bord.html"
    }

    # 7. Update {en,de,nl}/admin-commandes.html
    $admFile = Join-Path $rootDir "$sub\admin-commandes.html"
    if (Test-Path $admFile) {
        $adm = [System.IO.File]::ReadAllText($admFile, $utf8NoBom).Replace("`r`n", "`n")
        $totLbl = $totalLabels[$sub]
        $adm = [regex]::Replace($adm, '(<span[^>]*data-i18n="modal\.total_ttc"[^>]*>)[^<]*(</span>)', "`${1}$totLbl`${2}")
        $adm = $adm.Replace("t('admin.table.total', 'Total TTC')", "t('admin.table.total', 'Total')")
        $adm = $adm.Replace("const puTTC = puHT * 1.20;", "const puTTC = puHT;")
        [System.IO.File]::WriteAllText($admFile, $adm, $utf8NoBom)
        Write-Host "Updated $sub\admin-commandes.html"
    }
}

# 8. Sync all updated files to dist-production/
$distDir = Join-Path $rootDir "dist-production"
if (Test-Path $distDir) {
    # Copy data/
    Copy-Item -Path (Join-Path $rootDir "data\*") -Destination (Join-Path $distDir "data") -Recurse -Force
    # Copy assets/js/cart.js
    Copy-Item -Path (Join-Path $rootDir "assets\js\cart.js") -Destination (Join-Path $distDir "assets\js\cart.js") -Force
    # Copy api/
    Copy-Item -Path (Join-Path $rootDir "api\pricing.php") -Destination (Join-Path $distDir "api\pricing.php") -Force
    Copy-Item -Path (Join-Path $rootDir "api\order.php") -Destination (Join-Path $distDir "api\order.php") -Force
    Copy-Item -Path (Join-Path $rootDir "api\merchant-feed.php") -Destination (Join-Path $distDir "api\merchant-feed.php") -Force
    # Copy root HTML pages
    foreach ($htmlName in @('catalogue.html', 'produit.html', 'panier.html', 'recapitulatif-commande.html', 'devis.html', 'tableau-de-bord.html', 'admin-commandes.html')) {
        $src = Join-Path $rootDir $htmlName
        if (Test-Path $src) {
            Copy-Item -Path $src -Destination (Join-Path $distDir $htmlName) -Force
        }
    }
    # Copy produits/
    Copy-Item -Path (Join-Path $rootDir "produits\*.html") -Destination (Join-Path $distDir "produits") -Force
    # Copy en/, de/, nl/
    foreach ($sub in @('en', 'de', 'nl')) {
        foreach ($htmlName in @('catalogue.html', 'produit.html', 'panier.html', 'recapitulatif-commande.html', 'devis.html', 'tableau-de-bord.html', 'admin-commandes.html')) {
            $src = Join-Path $rootDir "$sub\$htmlName"
            $dst = Join-Path $distDir "$sub\$htmlName"
            if (Test-Path $src) {
                Copy-Item -Path $src -Destination $dst -Force
            }
        }
        $srcProdDir = Join-Path $rootDir "$sub\produits\*.html"
        $dstProdDir = Join-Path $distDir "$sub\produits"
        if (Test-Path $dstProdDir) {
            Copy-Item -Path $srcProdDir -Destination $dstProdDir -Force
        }
    }
    Write-Host "Synced all updated files to dist-production/"
}
