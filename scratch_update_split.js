const fs = require('fs');

const jsReplacement = `function fillProfileForm(user) {
    if (!user) return;
    
    let firstName = (user.first_name || '').trim();
    let lastName = (user.contact_name || '').trim();

    // Auto-split si le prénom est vide et le nom contient un espace
    if (!firstName && lastName.includes(' ')) {
        const parts = lastName.split(' ');
        firstName = parts.shift();
        lastName = parts.join(' ');
    }

    // View fields mapping (Dynamic)
    const name = (firstName + ' ' + lastName).trim() || '-';
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
        'info-contact': lastName,
        'info-email': user.email,
        'info-phone': user.phone,
        'info-address': user.address,
        'info-postal': user.postal_code,
        'info-city': user.city,
        'info-first_name': firstName,
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
  content = content.replace(/function fillProfileForm\(user\) \{[\s\S]*?    \}\n\}/g, jsReplacement);
  fs.writeFileSync(f, content);
  console.log('Updated ' + f);
});
