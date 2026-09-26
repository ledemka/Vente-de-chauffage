document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('.material-symbols-outlined');
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = 'visibility_off'; 
                btn.setAttribute('aria-label', window.i18n ? window.i18n.t('auth.hide_password', 'Masquer le mot de passe') : 'Masquer le mot de passe'); 
            } else {
                input.type = 'password';
                icon.textContent = 'visibility'; 
                btn.setAttribute('aria-label', window.i18n ? window.i18n.t('auth.show_password', 'Afficher le mot de passe') : 'Afficher le mot de passe');
            }
        });
    });

    const form = document.getElementById('reset-password-form');
    const errorDiv = document.getElementById('reset-error');
    const successDiv = document.getElementById('reset-success');
    const loginButtonContainer = document.getElementById('login-button-container');

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token && errorDiv) {
        errorDiv.textContent = window.i18n ? window.i18n.t('reset_password.no_token', 'Le lien de réinitialisation est invalide ou manquant.') : 'Le lien de réinitialisation est invalide ou manquant.';
        errorDiv.classList.remove('hidden');
        if (form) form.querySelector('button').disabled = true;
    }

    if (form && token) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('hidden');
            successDiv.classList.add('hidden');
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            if (password !== confirmPassword) {
                errorDiv.textContent = window.i18n ? window.i18n.t('reset_password.mismatch', 'Les mots de passe ne correspondent pas.') : 'Les mots de passe ne correspondent pas.';
                errorDiv.classList.remove('hidden');
                return;
            }

            if (password.length < 8) {
                errorDiv.textContent = window.i18n ? window.i18n.t('reset_password.too_short', 'Le mot de passe doit contenir au moins 8 caractères.') : 'Le mot de passe doit contenir au moins 8 caractères.';
                errorDiv.classList.remove('hidden');
                return;
            }
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span>';
            btn.disabled = true;

            try {
                const apiPath = typeof window.resolveDataPath === 'function' ? window.resolveDataPath('api/reset-password.php') : './api/reset-password.php';
                
                const formData = new URLSearchParams();
                formData.append('token', token);
                formData.append('password', password);
                
                const res = await fetch(apiPath, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString()
                });
                
                const data = await res.json();
                
                if (data.success) {
                    successDiv.textContent = data.message;
                    successDiv.classList.remove('hidden');
                    form.reset();
                    form.style.display = 'none';
                    if (loginButtonContainer) loginButtonContainer.classList.remove('hidden');
                } else {
                    errorDiv.textContent = data.message || (window.i18n ? window.i18n.t('reset_password.error', 'Une erreur est survenue.') : 'Une erreur est survenue.');
                    errorDiv.classList.remove('hidden');
                    btn.disabled = false;
                }
            } catch (err) {
                errorDiv.textContent = window.i18n ? window.i18n.t('auth.network_error', 'Erreur réseau. Veuillez réessayer.') : 'Erreur réseau. Veuillez réessayer.';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
            } finally {
                btn.innerHTML = originalText;
            }
        });
    }
});
