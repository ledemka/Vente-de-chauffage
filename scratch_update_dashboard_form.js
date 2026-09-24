const fs = require('fs');

const htmlReplacement = `                    <form id="profile-form" class="hidden flex-col gap-6">
                        <div id="profile-msg" class="text-body-sm font-bold hidden px-4 py-2 rounded mb-2"></div>
                        
                        <!-- IDENTITÉ -->
                        <div class="flex flex-col gap-4">
                            <h3 class="text-label-md font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline/20 pb-1" data-i18n="dashboard.profile.identity">Identité</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.first_name">Prénom</label>
                                    <input type="text" id="info-first_name" name="first_name" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.last_name">Nom</label>
                                    <input type="text" id="info-contact" name="contact_name" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                                </div>
                            </div>
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.company">Société (facultatif)</label>
                                <input type="text" id="info-company" name="company" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                            </div>
                        </div>

                        <!-- COORDONNÉES -->
                        <div class="flex flex-col gap-4">
                            <h3 class="text-label-md font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline/20 pb-1" data-i18n="dashboard.profile.contact_info">Coordonnées</h3>
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.email">Email <span class="text-error">*</span></label>
                                <input type="email" id="info-email" name="email" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.phone">Téléphone <span class="text-error">*</span></label>
                                <input type="text" id="info-phone" name="phone" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                            </div>
                        </div>

                        <!-- ADRESSE DE FACTURATION -->
                        <div class="flex flex-col gap-4">
                            <h3 class="text-label-md font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline/20 pb-1" data-i18n="dashboard.profile.billing_address">Adresse de facturation</h3>
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.address">Adresse <span class="text-error">*</span></label>
                                <input type="text" id="info-address" name="address" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.address_complement">Complément d'adresse (facultatif)</label>
                                <input type="text" id="info-address_complement" name="address_complement" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.postal_code">Code Postal <span class="text-error">*</span></label>
                                    <input type="text" id="info-postal" name="postal_code" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.city">Ville <span class="text-error">*</span></label>
                                    <input type="text" id="info-city" name="city" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                                </div>
                            </div>
                        </div>

                        <!-- INFORMATIONS PROFESSIONNELLES -->
                        <div class="flex flex-col gap-4">
                            <h3 class="text-label-md font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline/20 pb-1" data-i18n="dashboard.profile.pro_info">Informations professionnelles (facultatif)</h3>
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.siret">SIRET</label>
                                <input type="text" id="info-siret" name="siret" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.function">Fonction</label>
                                <input type="text" id="info-fonction" name="fonction" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.profile.tva">TVA Intracommunautaire</label>
                                <input type="text" id="info-tva_intra" name="tva_intra" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
                            </div>
                        </div>

                        <div class="flex gap-4 mt-2 pt-2 border-t border-outline/20">
                            <button type="button" id="btn-cancel-edit" class="flex-1 border border-outline text-on-surface hover:bg-surface-container py-2 rounded-lg font-label-md transition-colors" data-i18n="dashboard.profile.cancel_btn">
                                Annuler
                            </button>
                            <button type="submit" class="flex-1 bg-primary hover:bg-primary/90 text-on-primary py-2 rounded-lg font-label-md transition-colors" data-i18n="dashboard.profile.save_btn">
                                Enregistrer
                            </button>
                        </div>
                    </form>`;

['tableau-de-bord.html', 'en/tableau-de-bord.html', 'de/tableau-de-bord.html', 'nl/tableau-de-bord.html'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<form id="profile-form"[\s\S]*?<\/form>/, htmlReplacement);
  fs.writeFileSync(f, content);
  console.log('Updated ' + f);
});
