const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const tbPath = path.join(ROOT_DIR, 'tableau-de-bord.html');

let content = fs.readFileSync(tbPath, 'utf8');

// 1. Replace the existing form with the new View + Form structure
const formRegex = /<form id="profile-form" class="flex flex-col gap-4">[\s\S]*?<\/form>/;
const newProfileMarkup = `<div id="profile-view" class="flex flex-col gap-4">
                        <div>
                            <span class="text-label-md font-label-md text-outline-variant block mb-1">Société</span>
                            <span id="view-company" class="text-body-md text-on-surface font-bold">-</span>
                        </div>
                        <div>
                            <span class="text-label-md font-label-md text-outline-variant block mb-1">Contact</span>
                            <span id="view-contact" class="text-body-md text-on-surface">-</span>
                        </div>
                        <div>
                            <span class="text-label-md font-label-md text-outline-variant block mb-1">Email</span>
                            <span id="view-email" class="text-body-md text-on-surface">-</span>
                        </div>
                        <div>
                            <span class="text-label-md font-label-md text-outline-variant block mb-1">Téléphone</span>
                            <span id="view-phone" class="text-body-md text-on-surface">-</span>
                        </div>
                        <div>
                            <span class="text-label-md font-label-md text-outline-variant block mb-1">Adresse</span>
                            <span id="view-address" class="text-body-md text-on-surface">-</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="text-label-md font-label-md text-outline-variant block mb-1">Code Postal</span>
                                <span id="view-postal" class="text-body-md text-on-surface">-</span>
                            </div>
                            <div>
                                <span class="text-label-md font-label-md text-outline-variant block mb-1">Ville</span>
                                <span id="view-city" class="text-body-md text-on-surface">-</span>
                            </div>
                        </div>
                        <button type="button" id="btn-edit-profile" class="mt-2 w-full border border-primary text-primary hover:bg-primary/5 py-2 rounded-lg font-label-md transition-colors">
                            Modifier mes informations
                        </button>
                    </div>

                    <form id="profile-form" class="hidden flex-col gap-4">
                        <div id="profile-msg" class="text-body-sm font-bold hidden px-4 py-2 rounded"></div>
                        <div>
                            <label class="text-label-md font-label-md text-outline-variant block mb-1">Société</label>
                            <input type="text" id="info-company" name="company" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="text-label-md font-label-md text-outline-variant block mb-1">Contact</label>
                            <input type="text" id="info-contact" name="contact_name" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="text-label-md font-label-md text-outline-variant block mb-1">Email</label>
                            <input type="email" id="info-email" name="email" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="text-label-md font-label-md text-outline-variant block mb-1">Téléphone</label>
                            <input type="text" id="info-phone" name="phone" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="text-label-md font-label-md text-outline-variant block mb-1">Adresse <span class="text-error">*</span></label>
                            <input type="text" id="info-address" name="address" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1">Code Postal <span class="text-error">*</span></label>
                                <input type="text" id="info-postal" name="postal_code" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1">Ville <span class="text-error">*</span></label>
                                <input type="text" id="info-city" name="city" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                            </div>
                        </div>
                        <div class="flex gap-4 mt-2">
                            <button type="button" id="btn-cancel-edit" class="flex-1 border border-outline text-on-surface hover:bg-surface-container py-2 rounded-lg font-label-md transition-colors">
                                Annuler
                            </button>
                            <button type="submit" class="flex-1 bg-primary hover:bg-primary/90 text-on-primary py-2 rounded-lg font-label-md transition-colors">
                                Enregistrer
                            </button>
                        </div>
                    </form>`;
content = content.replace(formRegex, newProfileMarkup);


// 2. Replace JS logic for order rows (remove onclick strings, add data-order)
const trRegex = /<tr class="border-b border-outline\/10 cursor-pointer hover:bg-surface-container-highest\/20 transition-colors" onclick="openOrderModal\('[\s\S]*?`\$\{itemsJson\.replace\(\/"\/g, '&quot;'\)\}`\)">/;

content = content.replace(trRegex, `
                const orderData = {
                    ref: order.order_reference,
                    date: dateStr,
                    status: statusTxt,
                    total: totalFmt,
                    items: typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || [])
                };
                // Proper HTML escaping for double quotes
                const orderDataStr = JSON.stringify(orderData).replace(/"/g, '&quot;');
                
                html += \`<tr class="order-row border-b border-outline/10 cursor-pointer hover:bg-surface-container-highest/20 transition-colors" data-order="\${orderDataStr}">\``);

// 3. Fix the leftover of the old string logic if any
content = content.replace(/const itemsJson = \(order\.items \|\| '\[\]'\);\s*/, '');

// 4. Update window.openOrderModal and add delegate listener
const oldModalRegex = /window\.openOrderModal = \(ref, date, status, total, itemsJson\) => \{[\s\S]*?items = JSON\.parse\(itemsJson\);/m;
content = content.replace(oldModalRegex, `
// Delegate order row clicks
document.getElementById('orders-container').addEventListener('click', (e) => {
    const tr = e.target.closest('.order-row');
    if (tr && tr.dataset.order) {
        try {
            const data = JSON.parse(tr.dataset.order);
            window.openOrderModal(data);
        } catch(err) { console.error('Error parsing order dataset', err); }
    }
});

window.openOrderModal = (data) => {
    document.getElementById('modal-ref').textContent = data.ref;
    document.getElementById('modal-date').textContent = data.date;
    document.getElementById('modal-status').textContent = data.status;
    document.getElementById('modal-total').textContent = data.total;
    
    const container = document.getElementById('modal-items-container');
    container.innerHTML = '';
    
    try {
        const items = data.items;
`);

// 5. Update fillProfileForm logic to handle both view and edit mode and toggle edit mode
const oldFillRegex = /function fillProfileForm\(data\) \{[\s\S]*?\}/m;
content = content.replace(oldFillRegex, `
let currentProfileData = {};

function fillProfileForm(data) {
    currentProfileData = { ...currentProfileData, ...data };
    // Remplissage Vue
    if(data.company) document.getElementById('view-company').textContent = data.company;
    if(data.contact_name) document.getElementById('view-contact').textContent = data.contact_name;
    if(data.email) document.getElementById('view-email').textContent = data.email;
    if(data.phone) document.getElementById('view-phone').textContent = data.phone;
    if(data.address) document.getElementById('view-address').textContent = data.address;
    if(data.city) document.getElementById('view-city').textContent = data.city;
    if(data.postal_code) document.getElementById('view-postal').textContent = data.postal_code;
    
    // Remplissage Formulaire
    if(data.company) document.getElementById('info-company').value = data.company;
    if(data.contact_name) document.getElementById('info-contact').value = data.contact_name;
    if(data.email) document.getElementById('info-email').value = data.email;
    if(data.phone) document.getElementById('info-phone').value = data.phone;
    if(data.address) document.getElementById('info-address').value = data.address;
    if(data.city) document.getElementById('info-city').value = data.city;
    if(data.postal_code) document.getElementById('info-postal').value = data.postal_code;
}

document.getElementById('btn-edit-profile').addEventListener('click', () => {
    document.getElementById('profile-view').classList.remove('flex');
    document.getElementById('profile-view').classList.add('hidden');
    document.getElementById('profile-form').classList.remove('hidden');
    document.getElementById('profile-form').classList.add('flex');
});

document.getElementById('btn-cancel-edit').addEventListener('click', () => {
    // Reset form to currentProfileData
    fillProfileForm(currentProfileData);
    document.getElementById('profile-msg').classList.add('hidden');
    
    document.getElementById('profile-form').classList.remove('flex');
    document.getElementById('profile-form').classList.add('hidden');
    document.getElementById('profile-view').classList.remove('hidden');
    document.getElementById('profile-view').classList.add('flex');
});
`);

// 6. Update the form submit to toggle back to view on success
const oldSubmitSuccessRegex = /user = \{ \.\.\.user, \.\.\.data\.client \};\s*localStorage\.setItem\('user', JSON\.stringify\(user\)\);/m;
content = content.replace(oldSubmitSuccessRegex, `
            user = { ...user, ...data.client };
            localStorage.setItem('user', JSON.stringify(user));
            fillProfileForm(user);
            
            // Revenir au mode vue après délai
            setTimeout(() => {
                document.getElementById('btn-cancel-edit').click();
            }, 1000);
`);


fs.writeFileSync(tbPath, content, 'utf8');
console.log('Fixed tableau-de-bord UI');
