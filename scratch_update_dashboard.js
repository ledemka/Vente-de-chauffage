const fs = require('fs');

const htmlReplacement = `                    <div id="profile-view" class="flex flex-col gap-6">
                        <!-- IDENTITÉ -->
                        <div id="section-identite">
                            <h3 class="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline/20 pb-1" data-i18n="dashboard.profile.identity">Identité</h3>
                            <div class="flex flex-col gap-1">
                                <span id="view-identity-name" class="text-body-md text-on-surface font-bold"></span>
                                <span id="view-identity-company" class="text-body-sm text-outline-variant hidden"></span>
                            </div>
                        </div>

                        <!-- COORDONNÉES -->
                        <div id="section-coordonnees">
                            <h3 class="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline/20 pb-1" data-i18n="dashboard.profile.contact_info">Coordonnées</h3>
                            <div class="flex flex-col gap-1">
                                <span id="view-contact-email" class="text-body-md text-on-surface"></span>
                                <span id="view-contact-phone" class="text-body-md text-on-surface"></span>
                            </div>
                        </div>

                        <!-- ADRESSE DE FACTURATION -->
                        <div id="section-adresse">
                            <h3 class="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline/20 pb-1" data-i18n="dashboard.profile.billing_address">Adresse de facturation</h3>
                            <div class="flex flex-col gap-1">
                                <span id="view-address-line1" class="text-body-md text-on-surface"></span>
                                <span id="view-address-complement" class="text-body-md text-on-surface hidden"></span>
                                <span id="view-address-city" class="text-body-md text-on-surface"></span>
                            </div>
                        </div>

                        <!-- INFORMATIONS PROFESSIONNELLES -->
                        <div id="section-pro" class="hidden">
                            <h3 class="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline/20 pb-1" data-i18n="dashboard.profile.pro_info">Informations professionnelles</h3>
                            <div class="flex flex-col gap-1">
                                <span id="view-pro-siret" class="text-body-md text-on-surface hidden"></span>
                                <span id="view-pro-fonction" class="text-body-md text-on-surface hidden"></span>
                                <span id="view-pro-tva" class="text-body-md text-on-surface hidden"></span>
                            </div>
                        </div>

                        <button type="button" id="btn-edit-profile" class="mt-2 w-full border border-primary text-primary hover:bg-primary/5 py-2 rounded-lg font-label-md transition-colors" data-i18n="dashboard.profile.edit_btn">
                            Modifier mes informations
                        </button>
                    </div>`;

const jsReplacement = `function fillProfileForm(user) {
    if (!user) return;
    
    // View fields mapping (Dynamic)
    const name = ((user.first_name || '') + ' ' + (user.contact_name || '')).trim() || '-';
    document.getElementById('view-identity-name').textContent = name;
    
    if (user.company && user.company.trim() !== '') {
        const companyEl = document.getElementById('view-identity-company');
        companyEl.textContent = user.company;
        companyEl.classList.remove('hidden');
    } else {
        document.getElementById('view-identity-company').classList.add('hidden');
    }

    document.getElementById('view-contact-email').textContent = user.email || '-';
    document.getElementById('view-contact-phone').textContent = user.phone || '-';

    document.getElementById('view-address-line1').textContent = user.address || '-';
    
    if (user.address_complement && user.address_complement.trim() !== '') {
        const compEl = document.getElementById('view-address-complement');
        compEl.textContent = user.address_complement;
        compEl.classList.remove('hidden');
    } else {
        document.getElementById('view-address-complement').classList.add('hidden');
    }

    document.getElementById('view-address-city').textContent = ((user.postal_code || '') + ' ' + (user.city || '')).trim() || '-';

    let hasProInfo = false;
    
    if (user.siret && user.siret.trim() !== '') {
        const siretEl = document.getElementById('view-pro-siret');
        siretEl.textContent = 'SIRET: ' + user.siret;
        siretEl.classList.remove('hidden');
        hasProInfo = true;
    } else {
        document.getElementById('view-pro-siret').classList.add('hidden');
    }

    if (user.fonction && user.fonction.trim() !== '') {
        const fonctionEl = document.getElementById('view-pro-fonction');
        fonctionEl.textContent = 'Fonction: ' + user.fonction;
        fonctionEl.classList.remove('hidden');
        hasProInfo = true;
    } else {
        document.getElementById('view-pro-fonction').classList.add('hidden');
    }

    if (user.tva_intra && user.tva_intra.trim() !== '') {
        const tvaEl = document.getElementById('view-pro-tva');
        tvaEl.textContent = 'TVA Intracommunautaire: ' + user.tva_intra;
        tvaEl.classList.remove('hidden');
        hasProInfo = true;
    } else {
        document.getElementById('view-pro-tva').classList.add('hidden');
    }

    if (hasProInfo) {
        document.getElementById('section-pro').classList.remove('hidden');
    } else {
        document.getElementById('section-pro').classList.add('hidden');
    }

    // Input fields
    const inputFields = {
        'info-company': user.company,
        'info-contact': user.contact_name,
        'info-email': user.email,
        'info-phone': user.phone,
        'info-address': user.address,
        'info-postal': user.postal_code,
        'info-city': user.city,
        'info-first_name': user.first_name,
        'info-siret': user.siret,
        'info-fonction': user.fonction,
        'info-tva_intra': user.tva_intra,
        'info-address_complement': user.address_complement
    };
    for (const [id, val] of Object.entries(inputFields)) {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    }
}`;

['tableau-de-bord.html', 'en/tableau-de-bord.html', 'de/tableau-de-bord.html', 'nl/tableau-de-bord.html'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace HTML part
  content = content.replace(/<div id="profile-view" class="flex flex-col gap-4">[\s\S]*?<form id="profile-form"/g, htmlReplacement + '\n\n                    <form id="profile-form"');
  
  // Replace JS part
  content = content.replace(/function fillProfileForm\(user\) \{[\s\S]*?    \}\n\}/g, jsReplacement);
  
  fs.writeFileSync(f, content);
  console.log('Updated ' + f);
});
