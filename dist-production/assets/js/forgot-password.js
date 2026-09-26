document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-password-form');
    const errorDiv = document.getElementById('forgot-error');
    const successDiv = document.getElementById('forgot-success');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('hidden');
            successDiv.classList.add('hidden');
            
            const email = document.getElementById('email').value;
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span>';
            btn.disabled = true;

            try {
                const apiPath = typeof window.resolveDataPath === 'function' ? window.resolveDataPath('api/forgot-password.php') : './api/forgot-password.php';
                
                const formData = new URLSearchParams();
                formData.append('email', email);
                
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
                } else {
                    errorDiv.textContent = data.message || (window.i18n ? window.i18n.t('forgot_password.error', 'Une erreur est survenue.') : 'Une erreur est survenue.');
                    errorDiv.classList.remove('hidden');
                }
            } catch (err) {
                errorDiv.textContent = window.i18n ? window.i18n.t('auth.network_error', 'Erreur réseau. Veuillez réessayer.') : 'Erreur réseau. Veuillez réessayer.';
                errorDiv.classList.remove('hidden');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }
});
