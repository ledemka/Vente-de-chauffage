const fs = require('fs');

function replaceInFile(file, replacements) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
}

replaceInFile('connexion.html', [
    ["errorDiv.textContent = res.message || 'Erreur de connexion';", "errorDiv.textContent = res.message || (window.i18n ? window.i18n.t('auth.login_error', 'Erreur de connexion') : 'Erreur de connexion');"],
    ["errorDiv.textContent = 'Erreur réseau. Veuillez réessayer.';", "errorDiv.textContent = window.i18n ? window.i18n.t('auth.network_error', 'Erreur réseau. Veuillez réessayer.') : 'Erreur réseau. Veuillez réessayer.';"]
]);

replaceInFile('inscription.html', [
    ["errorDiv.textContent = 'Les mots de passe ne correspondent pas.';", "errorDiv.textContent = window.i18n ? window.i18n.t('auth.pwd_mismatch', 'Les mots de passe ne correspondent pas.') : 'Les mots de passe ne correspondent pas.';"],
    ["errorDiv.textContent = res.message || 'Erreur lors de la création';", "errorDiv.textContent = res.message || (window.i18n ? window.i18n.t('auth.register_error', 'Erreur lors de la création') : 'Erreur lors de la création');"],
    ["errorDiv.textContent = 'Erreur réseau. Veuillez réessayer.';", "errorDiv.textContent = window.i18n ? window.i18n.t('auth.network_error', 'Erreur réseau. Veuillez réessayer.') : 'Erreur réseau. Veuillez réessayer.';"]
]);

replaceInFile('activation.html', [
    ['document.getElementById(\'error-msg\').textContent = "Jeton manquant.";', 'document.getElementById(\'error-msg\').textContent = window.i18n ? window.i18n.t(\'auth.token_missing\', \'Jeton manquant.\') : "Jeton manquant.";'],
    ['document.getElementById(\'error-msg\').textContent = "Ce lien d\'activation a expiré.";', 'document.getElementById(\'error-msg\').textContent = window.i18n ? window.i18n.t(\'auth.token_expired\', "Ce lien d\'activation a expiré.") : "Ce lien d\'activation a expiré.";'],
    ['document.getElementById(\'error-msg\').textContent = "Erreur réseau. Veuillez réessayer.";', 'document.getElementById(\'error-msg\').textContent = window.i18n ? window.i18n.t(\'auth.network_error\', \'Erreur réseau. Veuillez réessayer.\') : "Erreur réseau. Veuillez réessayer.";'],
    ['alert("Erreur réseau");', 'alert(window.i18n ? window.i18n.t(\'auth.network_error_short\', \'Erreur réseau\') : "Erreur réseau");']
]);

replaceInFile('tableau-de-bord.html', [
    ["msg.textContent = data.message || 'Erreur lors de la mise à jour.';", "msg.textContent = data.message || (window.i18n ? window.i18n.t('dashboard.update_error', 'Erreur lors de la mise à jour.') : 'Erreur lors de la mise à jour.');"],
    ["msg.textContent = 'Erreur réseau.';", "msg.textContent = window.i18n ? window.i18n.t('dashboard.network_error', 'Erreur réseau.') : 'Erreur réseau.';"],
    ["document.getElementById('modal-address').textContent = data.delivery_address || 'Non spécifiée';", "document.getElementById('modal-address').textContent = data.delivery_address || (window.i18n ? window.i18n.t('dashboard.not_specified', 'Non spécifiée') : 'Non spécifiée');"]
]);

// Wait, admin-commandes already uses t('...', '...') but without window.i18n prefix! It has a local `t` variable maybe? Or it fails. Let's fix it to window.i18n.t
replaceInFile('admin-commandes.html', [
    ["t('admin-commandes.error', 'Erreur')", "(window.i18n ? window.i18n.t('admin-commandes.error', 'Erreur') : 'Erreur')"],
    ["t('admin.no_orders', 'Aucune commande trouvée.')", "(window.i18n ? window.i18n.t('admin.no_orders', 'Aucune commande trouvée.') : 'Aucune commande trouvée.')"],
    ["t('admin.update_error', 'Erreur lors de la mise à jour')", "(window.i18n ? window.i18n.t('admin.update_error', 'Erreur lors de la mise à jour') : 'Erreur lors de la mise à jour')"],
    ["t('admin.network_error', 'Erreur réseau')", "(window.i18n ? window.i18n.t('admin.network_error', 'Erreur réseau') : 'Erreur réseau')"],
    ["t('admin-commandes.not_specified', 'Non spécifiée')", "(window.i18n ? window.i18n.t('admin-commandes.not_specified', 'Non spécifiée') : 'Non spécifiée')"]
]);

replaceInFile('devis.html', [
    ["? 'Longueur à choisir' :", "? (window.i18n ? window.i18n.t('quote.length_to_choose', 'Longueur à choisir') : 'Longueur à choisir') :"],
    ["+ ' unités de ' +", "+ ' ' + (window.i18n ? window.i18n.t('quote.units_of', 'unités de') : 'unités de') + ' ' +"]
]);

console.log('All targeted JS strings wrapped with i18n.');
