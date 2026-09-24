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
    const nameEl = document.getElementById('view-identity-name');
    if (nameEl) nameEl.textContent = name;
    
    if (user.company && user.company.trim() !== '') {
        const companyEl = document.getElementById('view-identity-company');
        if (companyEl) {
            companyEl.textContent = user.company;
            companyEl.classList.remove('hidden');
        }
    } else {
        const companyEl = document.getElementById('view-identity-company');
        if (companyEl) companyEl.classList.add('hidden');
    }

    const emailEl = document.getElementById('view-contact-email');
    if (emailEl) emailEl.textContent = user.email || '-';
    
    const phoneEl = document.getElementById('view-contact-phone');
    if (phoneEl) phoneEl.textContent = user.phone || '-';

    const addressEl = document.getElementById('view-address-line1');
    if (addressEl) addressEl.textContent = user.address || '-';
    
    if (user.address_complement && user.address_complement.trim() !== '') {
        const compEl = document.getElementById('view-address-complement');
        if (compEl) {
            compEl.textContent = user.address_complement;
            compEl.classList.remove('hidden');
        }
    } else {
        const compEl = document.getElementById('view-address-complement');
        if (compEl) compEl.classList.add('hidden');
    }

    const cityEl = document.getElementById('view-address-city');
    if (cityEl) cityEl.textContent = ((user.postal_code || '') + ' ' + (user.city || '')).trim() || '-';

    let hasProInfo = false;
    
    if (user.siret && user.siret.trim() !== '') {
        const siretEl = document.getElementById('view-pro-siret');
        if (siretEl) {
            siretEl.textContent = 'SIRET: ' + user.siret;
            siretEl.classList.remove('hidden');
        }
        hasProInfo = true;
    } else {
        const siretEl = document.getElementById('view-pro-siret');
        if (siretEl) siretEl.classList.add('hidden');
    }

    if (user.fonction && user.fonction.trim() !== '') {
        const fonctionEl = document.getElementById('view-pro-fonction');
        if (fonctionEl) {
            fonctionEl.textContent = 'Fonction: ' + user.fonction;
            fonctionEl.classList.remove('hidden');
        }
        hasProInfo = true;
    } else {
        const fonctionEl = document.getElementById('view-pro-fonction');
        if (fonctionEl) fonctionEl.classList.add('hidden');
    }

    if (user.tva_intra && user.tva_intra.trim() !== '') {
        const tvaEl = document.getElementById('view-pro-tva');
        if (tvaEl) {
            tvaEl.textContent = 'TVA Intracommunautaire: ' + user.tva_intra;
            tvaEl.classList.remove('hidden');
        }
        hasProInfo = true;
    } else {
        const tvaEl = document.getElementById('view-pro-tva');
        if (tvaEl) tvaEl.classList.add('hidden');
    }

    const sectionPro = document.getElementById('section-pro');
    if (sectionPro) {
        if (hasProInfo) {
            sectionPro.classList.remove('hidden');
        } else {
            sectionPro.classList.add('hidden');
        }
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
  const startStr = 'function fillProfileForm(user) {';
  const endStr = "document.getElementById('btn-edit-profile')?.addEventListener";
  const startIdx = content.indexOf(startStr);
  const endIdx = content.indexOf(endStr);
  
  if (startIdx !== -1 && endIdx !== -1) {
      content = content.substring(0, startIdx) + jsReplacement + '\n\n' + content.substring(endIdx);
      fs.writeFileSync(f, content);
      console.log('Updated ' + f);
  } else {
      console.log('Failed to find JS in ' + f);
  }
});
