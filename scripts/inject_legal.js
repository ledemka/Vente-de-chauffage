const fs = require('fs');
const path = require('path');

const userHtml = `<!-- Confidentialité — Terre & Feu -->
<html lang="fr"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Chivo:wght@100..900&family=Inter:wght@100..900&display=swap" rel="stylesheet"/><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={theme:{extend:{"colors":{"on-tertiary-fixed":"#271813","on-surface":"#201a17","secondary-container":"#f0dfd6","on-tertiary-fixed-variant":"#56423d","outline-variant":"#ddc0ba","inverse-primary":"#ffb4a3","surface-container-lowest":"#ffffff","on-secondary-fixed-variant":"#4f453e","primary":"#802813","primary-fixed":"#ffdad2","secondary-fixed":"#f0dfd6","surface-container-low":"#fef1eb","surface-bright":"#fff8f5","surface-container-highest":"#ece0da","tertiary-fixed":"#fadcd5","on-surface-variant":"#56423d","outline":"#8a726c","surface-container":"#f8ece5","background":"#fff8f5","on-secondary-fixed":"#221a15","surface-dim":"#e3d8d1","secondary-fixed-dim":"#d3c3bb","tertiary-container":"#6f5953","on-primary-fixed":"#3d0700","on-error":"#ffffff","on-secondary":"#ffffff","tertiary-fixed-dim":"#ddc0b9","on-tertiary-container":"#efd1ca","on-background":"#201a17","on-secondary-container":"#6e625b","on-error-container":"#93000a","error-container":"#ffdad6","primary-fixed-dim":"#ffb4a3","on-primary-fixed-variant":"#812813","error":"#ba1a1a","primary-container":"#a03f28","tertiary":"#56423d","surface":"#fff8f5","inverse-surface":"#362f2b","surface-container-high":"#f2e6df","on-tertiary":"#ffffff","surface-tint":"#a03f28","on-primary":"#ffffff","inverse-on-surface":"#fbeee8","secondary":"#685c55","on-primary-container":"#ffcdc1","surface-variant":"#ece0da"},"borderRadius":{"DEFAULT":"0.125rem","lg":"0.25rem","xl":"0.5rem","full":"0.75rem"},"spacing":{"max-width":"1440px","margin-desktop":"64px","margin-mobile":"16px","gutter":"24px","base":"8px"},"fontFamily":{"body-sm":["Inter"],"body-lg":["Inter"],"headline-lg-mobile":["Chivo"],"headline-lg":["Chivo"],"headline-md":["Chivo"],"body-md":["Inter"],"headline-xl":["Chivo"],"data-mono":["Inter"],"label-md":["Inter"]},"fontSize":{"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"headline-lg-mobile":["24px",{"lineHeight":"32px","fontWeight":"700"}],"headline-lg":["32px",{"lineHeight":"40px","fontWeight":"700"}],"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],"headline-xl":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"700"}],"data-mono":["14px",{"lineHeight":"20px","letterSpacing":"-0.01em","fontWeight":"500"}],"label-md":["14px",{"lineHeight":"16px","letterSpacing":"0.05em","fontWeight":"600"}]}}}}</script></head><body class="bg-surface font-body-md text-on-surface"><header class="fixed top-0 w-full z-50 bg-inverse-surface shadow-[0_1px_8px_rgba(0,0,0,0.1)]"><div class="h-20 max-w-[1440px] mx-auto px-margin-desktop flex items-center justify-between gap-gutter"><div class="flex items-center gap-4"><img alt="Terre & Feu Logo" class="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7OXXyntij-EFVxQcdqShWloKz-YZH-mWVXL5zCZK6pkYH9IH2uMF1Zj8pQTpcbX3AXRvNU_UNv-XoQXY7SE1oL2z4sI01kJh6n3vbPYrwCVSmZRgsSAZi3nyeTYzn90Yhtsogo-HlxL48cmzM3APxWe8a0Y7X2BBdG22oEJaS3uvbkjwSncgY8I7Fax69Njdvkn8nWsrLNf7A64bwhHyhXnFU460bIObtvBewkIYsYbsA7Dj2C2ZW"/><span class="text-headline-md font-headline-md text-inverse-on-surface">Terre & Feu</span></div><div class="flex-1 max-w-md px-gutter"><div class="relative"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span><input class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 pl-10 pr-4 text-body-sm text-inverse-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary" placeholder="Rechercher un produit..." type="text"/></div></div><div class="flex items-center gap-6"><div class="flex gap-2 text-label-md text-outline-variant font-label-md"><span class="text-inverse-on-surface cursor-pointer">FR</span><span>/</span><span class="hover:text-inverse-on-surface cursor-pointer">EN</span><span>/</span><span class="hover:text-inverse-on-surface cursor-pointer">DE</span></div><div class="flex items-center gap-4"><span class="material-symbols-outlined text-inverse-on-surface cursor-pointer">shopping_cart</span><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div><nav class="bg-surface-container border-t border-outline-variant/20"><div class="max-w-[1440px] mx-auto px-margin-desktop h-12 flex items-center gap-10" data-active-classes="text-primary font-bold border-b-2 border-primary"><a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-3" data-path="accueil" href="#">ACCUEIL</a><a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-3" data-path="catalogue" href="#">CATALOGUE</a><a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-3" data-path="livraison" href="#">LIVRAISON</a><a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-3" data-path="guide-de-choix" href="#">GUIDE DE CHOIX</a><a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-3" data-path="blog" href="#">BLOG</a><a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-3" data-path="contact" href="#">CONTACT</a></div></nav></header><main class="w-full pt-[128px] bg-background"><div class="flex flex-col w-full">
<!-- Header Section -->
<section class="w-full bg-surface-container py-16 px-margin-desktop mb-12 relative overflow-hidden">
<div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
<div class="max-w-max-width mx-auto flex flex-col gap-6 relative z-10">
<div class="flex items-center gap-4 text-outline mb-2">
<span class="material-symbols-outlined text-[24px]">shield_lock</span>
<span class="font-label-md text-label-md uppercase tracking-wider">Protection des données</span>
</div>
<h1 class="font-headline-xl text-headline-xl text-on-surface">Politique de Confidentialité</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                Chez Terre & Feu, nous accordons une importance primordiale à la protection de vos données personnelles. Cette politique détaille la manière dont nous collectons, utilisons et protégeons vos informations dans le cadre de nos activités commerciales et logistiques.
            </p>
<div class="flex items-center gap-6 mt-4">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-outline">DERNIÈRE MISE À JOUR</span>
<span class="font-data-mono text-data-mono text-on-surface">15 Octobre 2024</span>
</div>
<div class="h-8 w-px bg-outline/30"></div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-outline">CONFORMITÉ</span>
<span class="font-data-mono text-data-mono text-on-surface">RGPD / EU 2016/679</span>
</div>
</div>
</div>
</section>
<!-- Main Content Layout -->
<section class="max-w-max-width mx-auto px-margin-desktop w-full grid grid-cols-1 md:grid-cols-12 gap-gutter pb-24">
<!-- Sticky Navigation Sidebar -->
<aside class="md:col-span-3 hidden md:block relative">
<div class="sticky top-32 flex flex-col gap-2 p-6 bg-surface-container-low rounded-xl">
<h3 class="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-wider">Sommaire</h3>
<nav class="flex flex-col gap-1" id="privacy-nav">
<a class="py-2 px-3 rounded-lg text-body-sm font-body-sm text-on-surface hover:bg-surface-container transition-colors active-nav-item" href="#collecte">1. Collecte des données</a>
<a class="py-2 px-3 rounded-lg text-body-sm font-body-sm text-on-surface-variant hover:bg-surface-container transition-colors" href="#utilisation">2. Utilisation des données</a>
<a class="py-2 px-3 rounded-lg text-body-sm font-body-sm text-on-surface-variant hover:bg-surface-container transition-colors" href="#partage">3. Partage & Logistique</a>
<a class="py-2 px-3 rounded-lg text-body-sm font-body-sm text-on-surface-variant hover:bg-surface-container transition-colors" href="#cookies">4. Gestion des Cookies</a>
<a class="py-2 px-3 rounded-lg text-body-sm font-body-sm text-on-surface-variant hover:bg-surface-container transition-colors" href="#droits">5. Vos droits (RGPD)</a>
</nav>
<div class="mt-8 pt-6 border-t border-outline/20">
<div class="flex items-center gap-3 text-primary mb-2">
<span class="material-symbols-outlined text-[20px]">contact_support</span>
<span class="font-label-md text-label-md">Une question ?</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-4">Notre Délégué à la Protection des Données est à votre disposition.</p>
<a class="inline-flex items-center gap-2 text-primary hover:text-primary-container font-label-md text-label-md transition-colors" href="mailto:dpo@terreetfeu.pro">
                        dpo@terreetfeu.pro
                        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
</aside>
<!-- Content Area -->
<div class="md:col-span-9 flex flex-col gap-12">
<!-- Section 1 -->
<article class="scroll-mt-32" id="collecte">
<div class="flex items-center gap-4 mb-6">
<div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-headline-md text-headline-md">1</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface">Collecte des données</h2>
</div>
<div class="prose prose-p:font-body-md prose-p:text-body-md prose-p:text-on-surface-variant prose-p:leading-relaxed max-w-none">
<p class="mb-4">
                        Dans le cadre de nos relations commerciales B2B et de la gestion de vos commandes de biomasse, nous collectons des données strictement nécessaires à l'exécution de nos services. Ces données sont recueillies lorsque vous créez un compte professionnel, demandez un devis, ou interagissez avec notre service client.
                    </p>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
<div class="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary">
<div class="flex items-center gap-3 mb-4">
<span class="material-symbols-outlined text-primary">domain</span>
<h4 class="font-headline-md text-headline-md text-on-surface text-[18px]">Données professionnelles</h4>
</div>
<ul class="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant list-none p-0">
<li class="flex items-start gap-2"><span class="material-symbols-outlined text-[16px] text-outline mt-1">check</span> Raison sociale et SIRET</li>
<li class="flex items-start gap-2"><span class="material-symbols-outlined text-[16px] text-outline mt-1">check</span> Nom, prénom et fonction du contact</li>
<li class="flex items-start gap-2"><span class="material-symbols-outlined text-[16px] text-outline mt-1">check</span> Adresses de facturation et de livraison</li>
<li class="flex items-start gap-2"><span class="material-symbols-outlined text-[16px] text-outline mt-1">check</span> Coordonnées téléphoniques et email</li>
</ul>
</div>
<div class="bg-surface-container-low p-6 rounded-xl border-l-4 border-tertiary">
<div class="flex items-center gap-3 mb-4">
<span class="material-symbols-outlined text-tertiary">analytics</span>
<h4 class="font-headline-md text-headline-md text-on-surface text-[18px]">Données de navigation</h4>
</div>
<ul class="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant list-none p-0">
<li class="flex items-start gap-2"><span class="material-symbols-outlined text-[16px] text-outline mt-1">check</span> Adresse IP et type de navigateur</li>
<li class="flex items-start gap-2"><span class="material-symbols-outlined text-[16px] text-outline mt-1">check</span> Historique des recherches de produits</li>
<li class="flex items-start gap-2"><span class="material-symbols-outlined text-[16px] text-outline mt-1">check</span> Préférences de navigation</li>
<li class="flex items-start gap-2"><span class="material-symbols-outlined text-[16px] text-outline mt-1">check</span> Logs de connexion à l'espace pro</li>
</ul>
</div>
</div>
</div>
</article>
<!-- Section 2 -->
<article class="scroll-mt-32" id="utilisation">
<div class="flex items-center gap-4 mb-6">
<div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-headline-md text-headline-md">2</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface">Utilisation des données</h2>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-6">
                    Chaque traitement de données est justifié par une base légale définie (exécution d'un contrat, obligation légale, ou intérêt légitime). Nous n'utilisons vos données que pour des finalités explicites et déterminées.
                </p>
<div class="overflow-x-auto rounded-xl shadow-sm">
<table class="w-full text-left bg-surface-container-low">
<thead>
<tr class="border-b-2 border-outline/50">
<th class="py-4 px-6 font-label-md text-label-md text-on-surface uppercase tracking-wider">Finalité du traitement</th>
<th class="py-4 px-6 font-label-md text-label-md text-on-surface uppercase tracking-wider">Base Légale</th>
<th class="py-4 px-6 font-label-md text-label-md text-on-surface uppercase tracking-wider">Durée de conservation</th>
</tr>
</thead>
<tbody class="font-body-sm text-body-sm text-on-surface-variant divide-y divide-outline/20">
<tr class="hover:bg-surface-container transition-colors">
<td class="py-4 px-6 font-medium text-on-surface">Gestion des commandes et livraisons de bois</td>
<td class="py-4 px-6"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-primary/10 text-primary">Exécution du contrat</span></td>
<td class="py-4 px-6 font-data-mono">10 ans (obligation légale comptable)</td>
</tr>
<tr class="hover:bg-surface-container transition-colors">
<td class="py-4 px-6 font-medium text-on-surface">Service client et support B2B</td>
<td class="py-4 px-6"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-primary/10 text-primary">Exécution du contrat</span></td>
<td class="py-4 px-6 font-data-mono">3 ans après le dernier contact</td>
</tr>
<tr class="hover:bg-surface-container transition-colors">
<td class="py-4 px-6 font-medium text-on-surface">Envoi de la newsletter technique et offres</td>
<td class="py-4 px-6"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-secondary/10 text-secondary">Consentement</span></td>
<td class="py-4 px-6 font-data-mono">Jusqu'au désabonnement</td>
</tr>
<tr class="hover:bg-surface-container transition-colors">
<td class="py-4 px-6 font-medium text-on-surface">Sécurité du site web et lutte anti-fraude</td>
<td class="py-4 px-6"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-tertiary/10 text-tertiary">Intérêt légitime</span></td>
<td class="py-4 px-6 font-data-mono">6 mois (logs de sécurité)</td>
</tr>
</tbody>
</table>
</div>
</article>
<!-- Image Break / Visual Interest -->
<div class="w-full h-64 rounded-2xl overflow-hidden relative shadow-md my-4">
<div class="w-full h-full bg-cover bg-center" data-alt="Abstract macro photography of stacked firewood logs in a modern industrial setting, warm ambient lighting highlighting the wood texture, shallow depth of field, premium quality, color palette aligned with #A03F28 and #F8ECE5, conveying security and structured reliability." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbvhlVx29HYne3cmGPV8VIVxL0ruUlbv9BeuegFnlwE-UACO18sONFjr-U75IxZ_uiauir7FLQLshOS_HO4mL6ittgmXO5ismr8PD9JuAZvRDkF20jiM4y2h35GeZnFK0PwKhgkOilEayixtg4DPu_V5n0Kv5ugDUF_joXn_GCHIQ_pv8mi3pIK8kaAu6q5lr_BgssoLGl9jqx6MPwelSVxeWHSiRy1OK2qQ23xQHVOC5pQoqoRYmM')"></div>
<div class="absolute inset-0 bg-inverse-surface/60 mix-blend-multiply"></div>
<div class="absolute inset-0 flex items-center justify-center p-8 text-center">
<p class="font-headline-md text-headline-md text-on-primary max-w-2xl leading-tight">
                        "La sécurité de vos données logistiques est aussi cruciale que la qualité de notre biomasse."
                    </p>
</div>
</div>
<!-- Section 3 -->
<article class="scroll-mt-32" id="cookies">
<div class="flex items-center gap-4 mb-6">
<div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-headline-md text-headline-md">4</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface">Gestion des Cookies</h2>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-6">
                    Nous utilisons des cookies pour assurer le bon fonctionnement de notre portail B2B, analyser le trafic et optimiser votre expérience utilisateur. Vous gardez le contrôle total sur les cookies non essentiels.
                </p>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Cookie Type 1 -->
<div class="bg-surface-container p-6 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
<div class="absolute top-0 right-0 p-4 opacity-10 text-primary">
<span class="material-symbols-outlined text-6xl">cookie</span>
</div>
<h4 class="font-headline-md text-headline-md text-on-surface text-[18px] mb-2">Strictement nécessaires</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-4 h-16">
                            Indispensables au fonctionnement de l'espace client et au panier de commande.
                        </p>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-green-600">lock</span>
<span class="font-label-md text-label-md text-on-surface-variant">Toujours actifs</span>
</div>
</div>
<!-- Cookie Type 2 -->
<div class="bg-surface-container p-6 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
<div class="absolute top-0 right-0 p-4 opacity-10 text-primary">
<span class="material-symbols-outlined text-6xl">query_stats</span>
</div>
<h4 class="font-headline-md text-headline-md text-on-surface text-[18px] mb-2">Performance & Analytique</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-4 h-16">
                            Nous permettent de mesurer l'audience et d'améliorer la structure du site.
                        </p>
<button class="font-label-md text-label-md text-primary hover:text-primary-container transition-colors inline-flex items-center gap-1">
                            Gérer les préférences
                            <span class="material-symbols-outlined text-[16px]">tune</span>
</button>
</div>
<!-- Cookie Type 3 -->
<div class="bg-surface-container p-6 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
<div class="absolute top-0 right-0 p-4 opacity-10 text-primary">
<span class="material-symbols-outlined text-6xl">campaign</span>
</div>
<h4 class="font-headline-md text-headline-md text-on-surface text-[18px] mb-2">Ciblage & Publicité</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-4 h-16">
                            Utilisés pour vous proposer des offres B2B pertinentes sur d'autres plateformes.
                        </p>
<button class="font-label-md text-label-md text-primary hover:text-primary-container transition-colors inline-flex items-center gap-1">
                            Gérer les préférences
                            <span class="material-symbols-outlined text-[16px]">tune</span>
</button>
</div>
</div>
</article>
<!-- Section 4 -->
<article class="scroll-mt-32" id="droits">
<div class="flex items-center gap-4 mb-6">
<div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-headline-md text-headline-md">5</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface">Vos droits (RGPD)</h2>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-8">
                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez de droits stricts concernant le traitement de vos informations professionnelles et personnelles.
                </p>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div class="flex gap-4 p-4 rounded-lg bg-surface-container-low border border-outline/10 hover:border-primary/30 transition-colors">
<span class="material-symbols-outlined text-primary mt-1">visibility</span>
<div>
<h4 class="font-headline-md text-headline-md text-on-surface text-[16px]">Droit d'accès</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">Obtenir la confirmation que vos données sont traitées et en recevoir une copie.</p>
</div>
</div>
<div class="flex gap-4 p-4 rounded-lg bg-surface-container-low border border-outline/10 hover:border-primary/30 transition-colors">
<span class="material-symbols-outlined text-primary mt-1">edit_square</span>
<div>
<h4 class="font-headline-md text-headline-md text-on-surface text-[16px]">Droit de rectification</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">Demander la correction d'informations inexactes ou incomplètes.</p>
</div>
</div>
<div class="flex gap-4 p-4 rounded-lg bg-surface-container-low border border-outline/10 hover:border-primary/30 transition-colors">
<span class="material-symbols-outlined text-primary mt-1">delete_sweep</span>
<div>
<h4 class="font-headline-md text-headline-md text-on-surface text-[16px]">Droit à l'effacement</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">Exiger la suppression de vos données ("droit à l'oubli") dans les limites légales.</p>
</div>
</div>
<div class="flex gap-4 p-4 rounded-lg bg-surface-container-low border border-outline/10 hover:border-primary/30 transition-colors">
<span class="material-symbols-outlined text-primary mt-1">swap_horiz</span>
<div>
<h4 class="font-headline-md text-headline-md text-on-surface text-[16px]">Droit à la portabilité</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">Recevoir vos données dans un format structuré et lisible par machine.</p>
</div>
</div>
</div>
<div class="mt-8 p-6 bg-surface-dim rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
<div>
<h4 class="font-headline-md text-headline-md text-on-surface mb-2">Exercer vos droits</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                            Pour toute demande relative à vos données, nous nous engageons à vous répondre dans un délai maximum de 30 jours.
                        </p>
</div>
<button class="whitespace-nowrap px-6 py-3 bg-primary text-on-primary font-label-md text-label-md rounded shadow-sm hover:bg-primary-container transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
                        Contacter le DPO
                    </button>
</div>
</article>
</div>
</section>
</div>
<script>
    // Simple intersection observer for the sticky navigation
    document.addEventListener('DOMContentLoaded', () => {
        const sections = document.querySelectorAll('article[id]');
        const navItems = document.querySelectorAll('#privacy-nav a');

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.id;
                    navItems.forEach(item => {
                        if (item.getAttribute('href') === \`#\${currentId}\`) {
                            item.classList.add('text-primary', 'font-bold', 'bg-surface-container');
                            item.classList.remove('text-on-surface-variant');
                        } else {
                            item.classList.remove('text-primary', 'font-bold', 'bg-surface-container');
                            item.classList.add('text-on-surface-variant');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    });
</script></main><footer class="w-full bg-inverse-surface text-inverse-on-surface py-16 mt-20"></footer></body></html>`;

const cgvHtml = `<!-- CGV — Terre & Feu -->
<html lang="fr"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Chivo:wght@100..900&family=Inter:wght@100..900&display=swap" rel="stylesheet"/><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-surface font-body-md text-on-surface"><header></header><main class="w-full pt-[128px] bg-background"><div class="flex flex-col w-full">
<!-- Header Section with Typographic Texture and Abstract Visual -->
<div class="relative w-full bg-surface-container-low shadow-sm overflow-hidden flex flex-col justify-end pt-24 pb-16 px-margin-mobile md:px-margin-desktop">
<!-- Abstract B2B Logistics SVG Background -->
<svg class="absolute top-0 right-0 w-3/4 h-full text-surface-container-highest opacity-40 mix-blend-multiply" fill="none" viewbox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
<path d="M100 350 L300 250 L500 300 L800 150" fill="none" stroke="currentColor" stroke-width="4"></path>
<circle cx="100" cy="350" fill="currentColor" r="8"></circle>
<circle cx="300" cy="250" fill="currentColor" r="12"></circle>
<circle cx="500" cy="300" fill="currentColor" r="16"></circle>
<circle cx="800" cy="150" fill="currentColor" r="24"></circle>
<rect fill="currentColor" height="400" opacity="0.1" transform="rotate(45 250 50)" width="100" x="250" y="50"></rect>
<rect fill="currentColor" height="500" opacity="0.15" transform="rotate(45 450 100)" width="80" x="450" y="100"></rect>
</svg>
<div class="relative max-w-max-width mx-auto w-full flex items-end justify-between z-10">
<div class="flex flex-col gap-6 max-w-3xl">
<div class="flex items-center gap-4">
<span class="w-12 h-1 bg-primary shadow-sm rounded-full"></span>
<span class="font-label-md text-label-md text-primary uppercase tracking-widest">Juridique & Conformité</span>
</div>
<h1 class="font-headline-xl text-headline-xl text-on-surface">Conditions Générales de Vente</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Applicables aux transactions entre professionnels. Dernière mise à jour : Octobre 2023. Ces conditions régissent les standards de qualité, de logistique et de tarification de la biomasse Terre & Feu.
        </p>
</div>
<!-- Decorative vertical text -->
<div class="hidden lg:block text-outline-variant font-headline-xl text-headline-xl opacity-20 transform -rotate-180" style="writing-mode: vertical-rl;">
        LÉGAL
      </div>
</div>
</div>
<!-- Main Content Layout -->
<div class="max-w-max-width mx-auto w-full px-margin-mobile md:px-margin-desktop py-16 flex flex-col lg:flex-row gap-gutter relative">
<!-- Sticky Table of Contents -->
<aside class="hidden lg:flex w-1/4 flex-col gap-8 sticky top-32 h-fit">
<div class="bg-surface-container shadow-sm p-8 rounded-xl flex flex-col gap-6">
<h3 class="font-headline-md text-headline-md text-on-surface">Sommaire</h3>
<nav class="flex flex-col gap-4" id="toc">
<a class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex gap-3 items-center group" href="#article-1">
<span class="text-primary-container bg-primary-fixed-dim px-2 py-1 rounded-md text-xs group-hover:bg-primary group-hover:text-on-primary transition-colors">01</span> Objet
          </a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex gap-3 items-center group" href="#article-2">
<span class="text-primary-container bg-primary-fixed-dim px-2 py-1 rounded-md text-xs group-hover:bg-primary group-hover:text-on-primary transition-colors">02</span> Produits
          </a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex gap-3 items-center group" href="#article-3">
<span class="text-primary-container bg-primary-fixed-dim px-2 py-1 rounded-md text-xs group-hover:bg-primary group-hover:text-on-primary transition-colors">03</span> Prix et Commande
          </a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex gap-3 items-center group" href="#article-4">
<span class="text-primary-container bg-primary-fixed-dim px-2 py-1 rounded-md text-xs group-hover:bg-primary group-hover:text-on-primary transition-colors">04</span> Livraison
          </a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex gap-3 items-center group" href="#article-5">
<span class="text-primary-container bg-primary-fixed-dim px-2 py-1 rounded-md text-xs group-hover:bg-primary group-hover:text-on-primary transition-colors">05</span> Paiement
          </a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex gap-3 items-center group" href="#article-6">
<span class="text-primary-container bg-primary-fixed-dim px-2 py-1 rounded-md text-xs group-hover:bg-primary group-hover:text-on-primary transition-colors">06</span> Rétractation
          </a>
</nav>
</div>
<!-- Support Card -->
<div class="bg-primary text-on-primary shadow-md p-8 rounded-xl flex flex-col gap-4 relative overflow-hidden">
<div class="absolute -right-6 -bottom-6 w-32 h-32 bg-on-primary opacity-10 rounded-full blur-2xl"></div>
<span class="material-symbols-outlined text-[32px]">support_agent</span>
<h4 class="font-headline-md text-headline-md">Service B2B</h4>
<p class="font-body-sm text-body-sm opacity-90">Pour toute question concernant nos conditions de vente en gros, contactez votre chargé de compte.</p>
<button class="bg-on-primary text-primary font-label-md text-label-md py-3 px-4 rounded shadow-sm hover:shadow-md transition-shadow w-fit mt-2">
          NOUS CONTACTER
        </button>
</div>
</aside>
<!-- Articles Content -->
<div class="w-full lg:w-3/4 flex flex-col gap-8">
<!-- Article 1 -->
<section class="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl p-8 md:p-12 relative overflow-hidden group" id="article-1">
<span class="absolute -right-4 -top-4 font-headline-xl text-[160px] leading-none text-surface-container-highest opacity-30 group-hover:text-secondary-fixed transition-colors duration-500 pointer-events-none select-none">01</span>
<div class="relative z-10 flex flex-col gap-6">
<h2 class="font-headline-lg text-headline-lg text-on-surface">Article 1 - Objet et Champ d'Application</h2>
<div class="flex flex-col gap-4 font-body-md text-body-md text-on-surface-variant">
<p>Les présentes Conditions Générales de Vente (CGV) constituent le socle de la négociation commerciale et sont systématiquement adressées ou remises à chaque acheteur pour lui permettre de passer commande.</p>
<p>Elles régissent exclusivement les ventes de bois de chauffage, granulés, et autres produits de biomasse par <strong>Terre & Feu</strong> aux acheteurs professionnels (B2B). Toute commande implique l'acceptation sans réserve de ces conditions par l'acheteur, nonobstant toute stipulation contraire figurant dans ses propres conditions générales d'achat.</p>
<div class="bg-surface-container p-6 rounded-lg shadow-sm mt-2 flex items-start gap-4">
<span class="material-symbols-outlined text-primary mt-1">info</span>
<p class="font-body-sm text-body-sm text-on-surface">Terre & Feu se réserve le droit de déroger à certaines clauses des présentes CGV, en fonction des négociations menées avec l'acheteur, par l'établissement de Conditions Particulières de Vente.</p>
</div>
</div>
</div>
</section>
<!-- Article 2 -->
<section class="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl p-8 md:p-12 relative overflow-hidden group" id="article-2">
<span class="absolute -right-4 -top-4 font-headline-xl text-[160px] leading-none text-surface-container-highest opacity-30 group-hover:text-secondary-fixed transition-colors duration-500 pointer-events-none select-none">02</span>
<div class="relative z-10 flex flex-col gap-6">
<h2 class="font-headline-lg text-headline-lg text-on-surface">Article 2 - Caractéristiques des Produits</h2>
<div class="flex flex-col gap-4 font-body-md text-body-md text-on-surface-variant">
<p>Les produits proposés à la vente sont ceux figurant sur le catalogue B2B de Terre & Feu au jour de la consultation. Les caractéristiques thermiques et dimensionnelles sont garanties dans les limites des tolérances industrielles.</p>
<!-- Technical Specs Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
<div class="bg-surface p-5 rounded-lg shadow-sm flex flex-col gap-2">
<span class="font-label-md text-label-md text-outline">TAUX D'HUMIDITÉ GARANTI</span>
<span class="font-data-mono text-data-mono text-on-surface text-lg">< 20% (Classe H1)</span>
</div>
<div class="bg-surface p-5 rounded-lg shadow-sm flex flex-col gap-2">
<span class="font-label-md text-label-md text-outline">ESSENCES</span>
<span class="font-data-mono text-data-mono text-on-surface text-lg">Chêne, Hêtre, Charme (Bois Dur 100%)</span>
</div>
</div>
<p class="mt-4">Les photographies d'illustration du catalogue n'ont qu'une valeur indicative et ne constituent pas un document contractuel. Le bois étant un matériau naturel, des variations d'aspect, de couleur ou de fente sont normales et n'affectent en rien le pouvoir calorifique certifié.</p>
</div>
</div>
</section>
<!-- Article 3 -->
<section class="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl p-8 md:p-12 relative overflow-hidden group" id="article-3">
<span class="absolute -right-4 -top-4 font-headline-xl text-[160px] leading-none text-surface-container-highest opacity-30 group-hover:text-secondary-fixed transition-colors duration-500 pointer-events-none select-none">03</span>
<div class="relative z-10 flex flex-col gap-6">
<h2 class="font-headline-lg text-headline-lg text-on-surface">Article 3 - Prix et Commande</h2>
<div class="flex flex-col gap-4 font-body-md text-body-md text-on-surface-variant">
<p>Les prix sont stipulés Hors Taxes (HT) et hors frais de livraison (Départ Entrepôt ou FCA), sauf accord spécifique (DAP). La TVA applicable est celle en vigueur au jour de la commande.</p>
<ul class="flex flex-col gap-3 mt-2 pl-4">
<li class="flex items-center gap-3">
<span class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
<span><strong>Minimum de commande (MOQ) :</strong> Fixé à 5 palettes ou 10 stères pour bénéficier des tarifs grossistes.</span>
</li>
<li class="flex items-center gap-3">
<span class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
<span><strong>Validité des devis :</strong> Les offres de prix sont valables 15 jours calendaires à compter de leur émission.</span>
</li>
<li class="flex items-center gap-3">
<span class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
<span><strong>Validation :</strong> La commande n'est définitive qu'après réception de l'acompte (si stipulé) et de l'accusé de réception de commande signé.</span>
</li>
</ul>
</div>
</div>
</section>
<!-- Article 4 (Logistics Focus with Visual) -->
<section class="bg-surface-container shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl p-8 md:p-12 relative overflow-hidden group" id="article-4">
<span class="absolute -right-4 -top-4 font-headline-xl text-[160px] leading-none text-surface-highest opacity-20 group-hover:text-surface-highest transition-colors duration-500 pointer-events-none select-none">04</span>
<div class="relative z-10 flex flex-col gap-8">
<h2 class="font-headline-lg text-headline-lg text-on-surface">Article 4 - Logistique et Livraison</h2>
<div class="font-body-md text-body-md text-on-surface-variant">
<p>Compte tenu de la nature pondéreuse des produits, la logistique obéit à des règles strictes pour garantir la sécurité et le respect des délais. Les délais de livraison sont donnés à titre indicatif et un retard ne saurait justifier l'annulation de la commande ou des pénalités.</p>
</div>
<!-- Process Visual -->
<div class="bg-surface rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between mt-4">
<div class="flex flex-col items-center text-center gap-3 w-full md:w-1/3">
<div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-outline text-[28px]">inventory_2</span>
</div>
<span class="font-label-md text-label-md text-on-surface">1. CONDITIONNEMENT</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Palettes filmées anti-UV</span>
</div>
<div class="hidden md:block flex-1 h-0.5 bg-outline-variant relative">
<span class="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rounded-full bg-outline-variant"></span>
</div>
<div class="flex flex-col items-center text-center gap-3 w-full md:w-1/3">
<div class="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-secondary text-[28px]">local_shipping</span>
</div>
<span class="font-label-md text-label-md text-on-surface">2. EXPÉDITION</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Camion 19T ou Semi-remorque</span>
</div>
<div class="hidden md:block flex-1 h-0.5 bg-outline-variant relative">
<span class="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rounded-full bg-outline-variant"></span>
</div>
<div class="flex flex-col items-center text-center gap-3 w-full md:w-1/3">
<div class="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center shadow-sm text-on-primary-container">
<span class="material-symbols-outlined text-[28px]">forklift</span>
</div>
<span class="font-label-md text-label-md text-on-surface">3. DÉCHARGEMENT</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Chariot embarqué requis</span>
</div>
</div>
<div class="bg-error-container text-on-error-container p-6 rounded-lg shadow-sm flex items-start gap-4">
<span class="material-symbols-outlined mt-1">warning</span>
<div>
<h5 class="font-label-md text-label-md mb-2">CONDITIONS D'ACCÈS OBLIGATOIRES</h5>
<p class="font-body-sm text-body-sm">L'acheteur doit garantir l'accessibilité du site de livraison aux véhicules lourds (jusqu'à 44 tonnes). En cas d'impossibilité de livraison due à un défaut d'accès non signalé, les frais de souffrance et de retour seront intégralement facturés à l'acheteur.</p>
</div>
</div>
</div>
</section>
<!-- Article 5 -->
<section class="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl p-8 md:p-12 relative overflow-hidden group" id="article-5">
<span class="absolute -right-4 -top-4 font-headline-xl text-[160px] leading-none text-surface-container-highest opacity-30 group-hover:text-secondary-fixed transition-colors duration-500 pointer-events-none select-none">05</span>
<div class="relative z-10 flex flex-col gap-6">
<h2 class="font-headline-lg text-headline-lg text-on-surface">Article 5 - Modalités de Paiement</h2>
<div class="flex flex-col gap-4 font-body-md text-body-md text-on-surface-variant">
<p>Sauf accord spécifique consigné dans les conditions particulières, le règlement s'effectue dans les conditions suivantes :</p>
<div class="flex flex-col gap-4 mt-4">
<div class="flex flex-col md:flex-row gap-4">
<div class="flex-1 bg-surface-container p-5 rounded-lg shadow-sm">
<h6 class="font-label-md text-label-md text-on-surface mb-2">NOUVEAUX CLIENTS</h6>
<p class="font-body-sm text-body-sm">Paiement comptant à la commande par virement bancaire pour les trois premières opérations commerciales.</p>
</div>
<div class="flex-1 bg-surface-container p-5 rounded-lg shadow-sm">
<h6 class="font-label-md text-label-md text-on-surface mb-2">COMPTES EN COURS</h6>
<p class="font-body-sm text-body-sm">30 jours nets date de facture, par virement bancaire ou prélèvement SEPA, sous réserve d'encours garanti.</p>
</div>
</div>
</div>
<p class="mt-4"><strong>Retards de paiement :</strong> Tout retard de paiement entraîne de plein droit l'exigibilité d'une pénalité de retard calculée au taux de refinancement de la BCE majoré de 10 points, ainsi que l'indemnité forfaitaire de 40€ pour frais de recouvrement prévue par le Code de commerce.</p>
</div>
</div>
</section>
<!-- Article 6 -->
<section class="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl p-8 md:p-12 relative overflow-hidden group mb-16" id="article-6">
<span class="absolute -right-4 -top-4 font-headline-xl text-[160px] leading-none text-surface-container-highest opacity-30 group-hover:text-secondary-fixed transition-colors duration-500 pointer-events-none select-none">06</span>
<div class="relative z-10 flex flex-col gap-6">
<h2 class="font-headline-lg text-headline-lg text-on-surface">Article 6 - Absence de Droit de Rétractation</h2>
<div class="flex flex-col gap-4 font-body-md text-body-md text-on-surface-variant">
<p>Conformément aux dispositions du Code de la consommation, le droit de rétractation n'est pas applicable aux contrats conclus entre professionnels (B2B) agissant dans le cadre de leur activité commerciale, industrielle, artisanale ou libérale.</p>
<p>Les produits livrés et conformes au bon de livraison ne sont ni repris ni échangés. En cas de non-conformité avérée lors de la livraison (vices apparents), l'acheteur doit émettre des réserves claires et précises sur le bordereau de transport et les confirmer par lettre recommandée avec AR au transporteur dans les 3 jours ouvrables suivant la réception, avec copie à Terre & Feu.</p>
</div>
</div>
</section>
</div>
</div>
<!-- Micro-interaction Script for TOC Highlighting -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('#toc a').forEach(link => {
              link.classList.remove('text-primary', 'font-bold');
              link.classList.add('text-on-surface-variant');
              const numSpan = link.querySelector('span');
              numSpan.classList.remove('bg-primary', 'text-on-primary');
              numSpan.classList.add('bg-primary-fixed-dim');
            });
            const activeLink = document.querySelector(\`#toc a[href="#\${id}"]\`);
            if(activeLink) {
              activeLink.classList.remove('text-on-surface-variant');
              activeLink.classList.add('text-primary', 'font-bold');
              const activeSpan = activeLink.querySelector('span');
              activeSpan.classList.remove('bg-primary-fixed-dim');
              activeSpan.classList.add('bg-primary', 'text-on-primary');
            }
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });

      document.querySelectorAll('section[id^="article-"]').forEach(section => {
        observer.observe(section);
      });
    });
  </script>
</div></main><footer></footer></body></html>`;

const mentionsHtml = `<!-- Mentions Légales — Terre & Feu -->
<html lang="fr"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Chivo:wght@100..900&family=Inter:wght@100..900&display=swap" rel="stylesheet"/><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-surface font-body-md text-on-surface"><header></header><main class="w-full pt-[128px] bg-background"><div class="flex flex-col w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
<div class="mb-16 md:mb-24 flex flex-col md:flex-row gap-8 md:gap-16 items-start">
<div class="flex-1">
<h1 class="text-headline-xl font-headline-xl text-on-surface mb-6">Mentions Légales</h1>
<p class="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
                Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique, dite L.C.E.N., nous portons à la connaissance des utilisateurs et visiteurs du site Terre & Feu les informations suivantes :
            </p>
</div>
<div class="w-full md:w-1/3">
<div class="bg-surface-container rounded-lg p-6 md:p-8 shadow-sm relative overflow-hidden">
<div class="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
<h2 class="text-label-md font-label-md text-primary mb-4 tracking-wider uppercase">Dernière mise à jour</h2>
<div class="text-data-mono font-data-mono text-on-surface-variant">15 Octobre 2024</div>
<div class="mt-6 pt-6 border-t border-outline/20">
<h3 class="text-label-md font-label-md text-on-surface mb-2">Version du document</h3>
<div class="text-data-mono font-data-mono text-on-surface-variant">v2.4.1-FR</div>
</div>
</div>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter relative">
<div class="hidden md:block md:col-span-3">
<div class="sticky top-32 flex flex-col gap-4 border-l-2 border-outline-variant/30 pl-6">
<a class="text-label-md font-label-md text-on-surface hover:text-primary transition-colors py-1" href="#editeur">1. Informations Éditeur</a>
<a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-1" href="#hebergement">2. Hébergement</a>
<a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-1" href="#propriete">3. Propriété Intellectuelle</a>
<a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-1" href="#donnees">4. Données Personnelles</a>
<a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-1" href="#cookies">5. Gestion des Cookies</a>
<a class="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors py-1" href="#responsabilite">6. Limitation de Responsabilité</a>
</div>
</div>
<div class="md:col-span-9 flex flex-col gap-16 md:gap-24">
<section class="scroll-mt-32" id="editeur">
<div class="flex items-center gap-4 mb-8">
<span class="text-headline-lg font-headline-lg text-outline-variant/50">01</span>
<h2 class="text-headline-lg font-headline-lg text-on-surface">Informations Éditeur</h2>
</div>
<div class="bg-surface-container-low rounded-xl p-8 md:p-12 shadow-md relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
<div class="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
<span class="material-symbols-outlined text-[120px] -mr-8 -mb-8">domain</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<div class="flex flex-col gap-2">
<span class="text-label-md font-label-md text-outline">RAISON SOCIALE</span>
<span class="text-body-md font-body-md text-on-surface font-semibold">Terre & Feu SAS</span>
</div>
<div class="flex flex-col gap-2">
<span class="text-label-md font-label-md text-outline">CAPITAL SOCIAL</span>
<span class="text-body-md font-body-md text-on-surface">500 000 €</span>
</div>
<div class="flex flex-col gap-2">
<span class="text-label-md font-label-md text-outline">SIÈGE SOCIAL</span>
<span class="text-body-md font-body-md text-on-surface">12 Rue de l'Industrie, 67000 Strasbourg, France</span>
</div>
<div class="flex flex-col gap-2">
<span class="text-label-md font-label-md text-outline">RCS</span>
<span class="text-body-md font-body-md text-on-surface">Strasbourg B 823 456 789</span>
</div>
<div class="flex flex-col gap-2">
<span class="text-label-md font-label-md text-outline">TVA INTRACOMMUNAUTAIRE</span>
<span class="text-body-md font-body-md text-on-surface">FR 12 823456789</span>
</div>
<div class="flex flex-col gap-2">
<span class="text-label-md font-label-md text-outline">DIRECTEUR DE LA PUBLICATION</span>
<span class="text-body-md font-body-md text-on-surface">Jean-Marc Dubois</span>
</div>
<div class="flex flex-col gap-2 md:col-span-2 mt-4 pt-4 border-t border-outline/20">
<span class="text-label-md font-label-md text-outline">CONTACT</span>
<div class="flex flex-col sm:flex-row gap-4 mt-2">
<a class="inline-flex items-center gap-2 text-primary font-label-md text-label-md hover:text-primary-container transition-colors" href="mailto:contact@terreetfeu.pro">
<span class="material-symbols-outlined text-[20px]">mail</span>
                                    contact@terreetfeu.pro
                                </a>
<a class="inline-flex items-center gap-2 text-primary font-label-md text-label-md hover:text-primary-container transition-colors" href="tel:+33388000000">
<span class="material-symbols-outlined text-[20px]">phone</span>
                                    +33 (0)3 88 00 00 00
                                </a>
</div>
</div>
</div>
</div>
</section>
<section class="scroll-mt-32" id="hebergement">
<div class="flex items-center gap-4 mb-8">
<span class="text-headline-lg font-headline-lg text-outline-variant/50">02</span>
<h2 class="text-headline-lg font-headline-lg text-on-surface">Hébergement</h2>
</div>
<div class="prose max-w-none">
<p class="text-body-md font-body-md text-on-surface-variant mb-6 leading-relaxed">
                        Le site Terre & Feu est hébergé de manière sécurisée et éco-responsable. Les serveurs sont localisés sur le territoire européen, garantissant le respect strict du RGPD.
                    </p>
<div class="bg-surface-container rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start shadow-sm">
<div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-on-secondary-container">dns</span>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 w-full">
<div class="flex flex-col gap-1">
<span class="text-label-md font-label-md text-outline">HÉBERGEUR</span>
<span class="text-body-md font-body-md text-on-surface font-semibold">OVH Groupe SAS</span>
</div>
<div class="flex flex-col gap-1">
<span class="text-label-md font-label-md text-outline">ADRESSE</span>
<span class="text-body-md font-body-md text-on-surface">2 rue Kellermann, 59100 Roubaix</span>
</div>
<div class="flex flex-col gap-1">
<span class="text-label-md font-label-md text-outline">PAYS</span>
<span class="text-body-md font-body-md text-on-surface">France</span>
</div>
<div class="flex flex-col gap-1">
<span class="text-label-md font-label-md text-outline">CONTACT</span>
<span class="text-body-md font-body-md text-on-surface">1007 (Numéro gratuit depuis la France)</span>
</div>
</div>
</div>
</div>
</section>
<section class="scroll-mt-32" id="propriete">
<div class="flex items-center gap-4 mb-8">
<span class="text-headline-lg font-headline-lg text-outline-variant/50">03</span>
<h2 class="text-headline-lg font-headline-lg text-on-surface">Propriété Intellectuelle</h2>
</div>
<div class="space-y-6 text-body-md font-body-md text-on-surface-variant leading-relaxed">
<p>
                        L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                    </p>
<p>
                        La reproduction de tout ou partie de ce site sur un support électronique ou papier quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
                    </p>
<div class="bg-surface-container-high border-l-4 border-primary p-6 rounded-r-lg mt-8">
<h4 class="text-label-md font-label-md text-on-surface mb-2 uppercase tracking-wide">Marques et Logos</h4>
<p class="text-body-sm font-body-sm text-on-surface-variant">
                            Les marques citées sur ce site sont déposées par les sociétés qui en sont propriétaires. La marque "Terre & Feu" ainsi que le logo associé figurant sur le site sont des marques déposées. Toute reproduction totale ou partielle de ces marques ou de ces logos effectuée à partir des éléments du site sans l'autorisation expresse de l'éditeur est donc prohibée.
                        </p>
</div>
</div>
</section>
<section class="scroll-mt-32" id="donnees">
<div class="flex items-center gap-4 mb-8">
<span class="text-headline-lg font-headline-lg text-outline-variant/50">04</span>
<h2 class="text-headline-lg font-headline-lg text-on-surface">Données Personnelles & RGPD</h2>
</div>
<div class="space-y-8">
<p class="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                        Terre & Feu s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site, soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
                    </p>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
<div class="bg-surface p-6 rounded-xl border border-outline/30 shadow-sm hover:border-primary/50 transition-colors duration-300">
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-primary">policy</span>
</div>
<h3 class="text-headline-md font-headline-md text-on-surface mb-3 text-lg">Finalité des données</h3>
<p class="text-body-sm font-body-sm text-on-surface-variant">
                                Les données personnelles collectées via nos formulaires (contact, demande de devis) sont strictement nécessaires au traitement de votre demande et à la gestion commerciale de la relation client B2B.
                            </p>
</div>
<div class="bg-surface p-6 rounded-xl border border-outline/30 shadow-sm hover:border-primary/50 transition-colors duration-300">
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-primary">update</span>
</div>
<h3 class="text-headline-md font-headline-md text-on-surface mb-3 text-lg">Durée de conservation</h3>
<p class="text-body-sm font-body-sm text-on-surface-variant">
                                Les données sont conservées pendant une durée de 3 ans à compter du dernier contact émanant de votre part, ou pendant la durée de la relation commerciale augmentée des prescriptions légales.
                            </p>
</div>
</div>
<div class="bg-surface-container rounded-xl p-8 shadow-inner mt-8">
<h3 class="text-headline-md font-headline-md text-on-surface mb-4">Vos droits</h3>
<p class="text-body-md font-body-md text-on-surface-variant mb-6">
                            Conformément à la réglementation applicable, vous disposez des droits suivants :
                        </p>
<ul class="space-y-3 mb-6">
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary shrink-0 mt-0.5">check_circle</span>
<span class="text-body-sm font-body-sm text-on-surface">Droit d'accès et de rectification de vos données.</span>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary shrink-0 mt-0.5">check_circle</span>
<span class="text-body-sm font-body-sm text-on-surface">Droit à l'effacement (« droit à l'oubli ») et à la limitation du traitement.</span>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary shrink-0 mt-0.5">check_circle</span>
<span class="text-body-sm font-body-sm text-on-surface">Droit à la portabilité de vos données.</span>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary shrink-0 mt-0.5">check_circle</span>
<span class="text-body-sm font-body-sm text-on-surface">Droit d'opposition au traitement de vos données pour des motifs légitimes.</span>
</li>
</ul>
<p class="text-body-sm font-body-sm text-on-surface-variant p-4 bg-background rounded-lg border border-outline/10">
                            Pour exercer ces droits, vous pouvez contacter notre Délégué à la Protection des Données (DPO) par email à <a class="text-primary hover:underline font-medium" href="mailto:dpo@terreetfeu.pro">dpo@terreetfeu.pro</a> ou par courrier à l'adresse du siège social en joignant une copie d'un titre d'identité.
                        </p>
</div>
</div>
</section>
</div>
</div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.sticky a');

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('text-primary', 'font-bold', 'border-l-4', 'border-primary', '-ml-[2px]');
                        link.classList.add('text-on-surface-variant');
                        
                        if (link.getAttribute('href') === \`#\${id}\`) {
                            link.classList.add('text-primary', 'font-bold', 'border-l-4', 'border-primary', '-ml-[2px]');
                            link.classList.remove('text-on-surface-variant');
                        }
                    });
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
        
        // Smooth scrolling for sidebar links
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 120, // offset for fixed header
                        behavior: 'smooth'
                    });
                }
            });
        });
    });
</script></main><footer></footer></body></html>`;

function extractMain(htmlString) {
    const startIdx = htmlString.indexOf('<main');
    if (startIdx === -1) return '';
    const endIdx = htmlString.indexOf('</main>');
    return htmlString.substring(startIdx, endIdx + 7);
}

const mains = {
    'politique-confidentialite.html': extractMain(userHtml),
    'cgv.html': extractMain(cgvHtml),
    'mentions-legales.html': extractMain(mentionsHtml)
};

const directories = ['.', 'en', 'de', 'nl'];

directories.forEach(dir => {
    Object.keys(mains).forEach(filename => {
        const filepath = path.join(__dirname, '..', dir, filename);
        if (fs.existsSync(filepath)) {
            let currentContent = fs.readFileSync(filepath, 'utf8');
            const startIdx = currentContent.indexOf('<main');
            const endIdx = currentContent.indexOf('</main>');
            if (startIdx !== -1 && endIdx !== -1) {
                const newContent = currentContent.substring(0, startIdx) + mains[filename] + currentContent.substring(endIdx + 7);
                fs.writeFileSync(filepath, newContent, 'utf8');
                console.log("Updated " + filepath);
            }
        }
    });
});

console.log("Done injecting new main contents.");
