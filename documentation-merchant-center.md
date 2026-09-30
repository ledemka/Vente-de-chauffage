# Configuration Livraison - Google Merchant Center

Le site Sotrams Bois utilise un algorithme de calcul de livraison B2B extrêmement spécifique basé sur :
1. La quantité de palettes commandée
2. La distance kilométrique réelle (calculée via l'API HERE Routing) entre l'adresse du client et le dépôt le plus proche
3. Le seuil kilométrique (70€ pour les 50 premiers km, +20€ par tranche de 50km supplémentaires)

## Problématique Merchant Center
Google Merchant Center (GMC) **ne permet pas** d'exécuter un script externe ou une API dynamique (comme HERE) pour calculer les frais de port lors de l'affichage d'une annonce. GMC exige des règles statiques pré-établies.

De plus, Google exige que les frais de livraison affichés dans Shopping soient **égaux ou supérieurs** aux frais réels payés par le client final. Si Google détecte que le client paie plus cher à la caisse que ce qui était affiché dans Merchant Center, le compte risque la suspension.

## Solution recommandée pour la configuration GMC

Puisque les produits envoyés au flux sont par défaut calculés pour **1 palette** (quantité minimale), le prix de base de livraison pour 1 palette est de **70 € HT** (soit **84 € TTC**).

Voici comment configurer la livraison directement dans le back-office Google Merchant Center (Outils et paramètres > Livraison et retours) :

### Option 1 : Forfait fixe "Pire scénario" (Le plus sûr vis-à-vis de Google)
Si vous livrez principalement dans un rayon restreint autour de vos dépôts, vous pouvez établir un forfait maximum moyen.
- **Nom du service :** Livraison Palette
- **Zone de livraison :** France
- **Tarif de livraison :** Forfait unique de `84,00 EUR` (TTC). 
- *Remarque :* Si un client est situé à 200km, le coût réel sera de 70€ + (3 * 20€) = 130€ HT (156€ TTC). Dans ce cas, si Google teste cette adresse, le compte peut être averti. 

### Option 2 : Grille tarifaire par Code Postal (Recommandé pour la précision)
C'est la méthode la plus précise mais elle demande un peu de paramétrage dans GMC.
1. Créez un service de livraison pour la France.
2. Choisissez la méthode **"Tarifs basés sur la destination" (Codes postaux)**.
3. Puisque vous connaissez l'emplacement de vos dépôts, créez 3 ou 4 groupes de codes postaux (par ex: Zone 1 = moins de 50km des dépôts, Zone 2 = 50-100km, etc.).
4. Appliquez le tarif correspondant :
   - Zone 1 : `84,00 EUR`
   - Zone 2 : `108,00 EUR` (90€ HT + TVA)
   - Zone 3 : `132,00 EUR` (110€ HT + TVA)

### Option 3 : Configuration "Livraison à calculer" via Attribut
Dans le flux XML, nous ne renseignons VOLONTAIREMENT PAS la balise `<g:shipping>` au niveau du produit, forçant ainsi Merchant Center à utiliser les paramètres globaux du compte (Configurés aux Options 1 ou 2 ci-dessus). Ne renseignez jamais 0 EUR (gratuit) dans GMC, sous peine de suspension immédiate pour "Frais de livraison trompeurs".

## Actions requises de votre part
**Connectez-vous à votre Google Merchant Center** et allez dans `Outils (icône engrenage) > Livraison et retours`.
Ajoutez un service de livraison pour la France en utilisant la grille par codes postaux (Option 2) pour vous rapprocher le plus possible de l'algorithme réel du site.
