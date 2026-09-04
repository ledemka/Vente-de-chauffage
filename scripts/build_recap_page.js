const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const newMainContent = `<div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16">
    <div class="flex items-center gap-2 mb-8">
        <a href="LINK_PANIER" class="text-on-surface-variant hover:text-primary transition-colors flex items-center">
            <span class="material-symbols-outlined text-[20px]">arrow_back</span>
            <span class="ml-1" data-i18n="cart.title">Panier</span>
        </a>
        <span class="text-outline-variant">/</span>
        <span class="text-on-surface font-bold" data-i18n="checkout.title">Récapitulatif de commande</span>
    </div>

    <h1 class="text-headline-xl text-on-surface mb-8" data-i18n="checkout.title">Récapitulatif de commande</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div class="lg:col-span-7">
            <form id="checkout-form" class="bg-surface-container rounded-xl p-8 shadow-sm flex flex-col gap-8">
                <div id="checkout-error" class="hidden bg-error-container text-on-error-container p-4 rounded-md text-body-sm font-medium shadow-sm"></div>

                <!-- Delivery Section -->
                <div>
                    <h2 class="text-headline-md font-headline-md text-on-surface mb-6 flex items-center gap-2 border-b border-outline/20 pb-4">
                        <span class="material-symbols-outlined text-primary">local_shipping</span>
                        <span data-i18n="checkout.delivery_details">Détails de livraison</span>
                    </h2>
                    
                    <div class="flex flex-col gap-5">
                        <div class="flex flex-col gap-2">
                            <label for="company" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.company">Société *</label>
                            <input type="text" id="company" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        </div>
                        
                        <div class="flex flex-col gap-2">
                            <label for="address" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="checkout.address">Adresse de livraison *</label>
                            <input type="text" id="address" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="flex flex-col gap-2">
                                <label for="zip_code" class="text-label-md font-label-md text-on-surface uppercase">Code Postal *</label>
                                <input type="text" id="zip_code" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="city" class="text-label-md font-label-md text-on-surface uppercase">Ville *</label>
                                <input type="text" id="city" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                            </div>
                        </div>

                        <label class="flex items-start gap-3 mt-2 cursor-pointer group">
                            <div class="relative flex items-center justify-center">
                                <input type="checkbox" id="truck_access" class="peer appearance-none w-6 h-6 border-2 border-outline-variant rounded-md checked:bg-primary checked:border-primary transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface-container">
                                <span class="material-symbols-outlined absolute text-on-primary text-[18px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                            </div>
                            <div class="flex flex-col pt-0.5">
                                <span class="text-label-md font-label-md text-on-surface group-hover:text-primary transition-colors" data-i18n="checkout.truck_access">Accès Poids Lourd garanti (Semi-remorque)</span>
                                <span class="text-body-sm text-on-surface-variant mt-1">Cochez cette case si le site de livraison permet l'accès, le demi-tour et le déchargement d'un camion 44T.</span>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Payment Section -->
                <div>
                    <h2 class="text-headline-md font-headline-md text-on-surface mb-6 flex items-center gap-2 border-b border-outline/20 pb-4">
                        <span class="material-symbols-outlined text-primary">account_balance</span>
                        <span data-i18n="checkout.payment_method">Mode de paiement</span>
                    </h2>
                    
                    <div class="bg-surface-container-highest border-l-4 border-primary rounded-r-md p-5 flex flex-col gap-2 shadow-sm">
                        <div class="flex items-center gap-2 text-on-surface font-bold">
                            <span class="material-symbols-outlined text-primary">verified</span>
                            <span data-i18n="checkout.bank_transfer_only">Virement bancaire uniquement</span>
                        </div>
                        <p class="text-body-sm text-on-surface-variant ml-8" data-i18n="checkout.bank_transfer_desc">
                            Nos coordonnées bancaires vous seront transmises après validation de la commande. Votre commande sera expédiée dès réception des fonds.
                        </p>
                    </div>
                </div>
            </form>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-5">
            <div class="bg-surface-container-highest rounded-xl p-8 shadow-md h-fit border border-outline/10">
                <h3 class="text-headline-md font-headline-md text-on-surface mb-6" data-i18n="cart.title">Votre Commande</h3>
                
                <div id="checkout-items" class="mb-6">
                    <!-- Loaded dynamically via CartUI -->
                    <div class="animate-pulse flex flex-col gap-4">
                        <div class="h-12 bg-surface-dim rounded-md"></div>
                        <div class="h-12 bg-surface-dim rounded-md"></div>
                    </div>
                </div>

                <div class="flex justify-between mb-4">
                    <span class="text-body-md text-on-surface-variant" data-i18n="cart.subtotal">Sous-total HT</span>
                    <span class="font-data-mono font-medium text-on-surface" id="checkout-subtotal">0.00€</span>
                </div>
                <div class="flex justify-between mb-4 text-primary">
                    <span class="text-body-md" data-i18n="cart.discount">Remise Volume</span>
                    <span class="font-data-mono font-bold" id="checkout-discount">-0.00€</span>
                </div>
                <div class="flex justify-between mb-8 text-headline-md text-on-surface border-t border-outline/30 pt-4">
                    <span data-i18n="cart.total">Total HT</span>
                    <span class="font-data-mono font-bold" id="checkout-total">0.00€</span>
                </div>

                <button form="checkout-form" type="submit" id="submit-order-btn" class="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider py-4 px-6 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <span data-i18n="checkout.confirm_btn">Confirmer la commande</span>
                    <span class="material-symbols-outlined text-[20px]">check_circle</span>
                </button>
            </div>
        </div>
    </div>
</div>`;

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const filePath = path.join(fullPath, 'recapitulatif-commande.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;
        
        const relPath = dir === '.' ? '.' : '..';
        let customContent = newMainContent.replace(/LINK_PANIER/g, `${relPath}/panier.html`);

        content = content.replace(mainRegex, (match, p1) => {
            return match.replace(p1, customContent);
        });

        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${path.join(dir, 'recapitulatif-commande.html')}`);
    }
}

console.log(`Updated ${modifiedCount} files.`);
