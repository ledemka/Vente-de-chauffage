const fs = require('fs');

// 2. Titles devis.html & contact.html
let d = fs.readFileSync('devis.html', 'utf8');
d = d.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, `<h1 class="text-4xl md:text-5xl font-bold text-on-surface mb-4" data-i18n-html="quote.title">
    <span class="text-primary italic font-serif pr-2">Demande de</span> devis B2B
</h1>`);
fs.writeFileSync('devis.html', d);

let c = fs.readFileSync('contact.html', 'utf8');
c = c.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, `<h1 class="text-4xl md:text-5xl font-bold text-on-surface mb-6" data-i18n-html="contact.title">
    <span class="text-primary italic font-serif pr-2">Contactez</span> notre équipe
</h1>`);
fs.writeFileSync('contact.html', c);

// 3. api/devis.php
let devisPhp = fs.readFileSync('api/devis.php', 'utf8');
devisPhp = devisPhp.replace(/Quantité demandée : \$quantity unité\(s\)/g, 'Quantité demandée : $quantity palette(s)');
fs.writeFileSync('api/devis.php', devisPhp);

// 4. produit.html #spec-origine
let prodHtml = fs.readFileSync('produit.html', 'utf8');
if (!prodHtml.includes(`origin === 'À préciser'`)) {
    prodHtml = prodHtml.replace(
        /document\.getElementById\('spec-origine'\)\.textContent\s*=\s*product\.origin;/,
        `if (product.origin === 'À préciser') {
            document.getElementById('spec-origine').setAttribute('data-i18n', 'product.origin_tbd');
            document.getElementById('spec-origine').textContent = window.i18n ? window.i18n.t('product.origin_tbd', 'À préciser') : 'À préciser';
        } else {
            document.getElementById('spec-origine').textContent = product.origin;
        }`
    );
    fs.writeFileSync('produit.html', prodHtml);
}

// 6. alt du blog
let blogHtml = fs.readFileSync('blog.html', 'utf8');
blogHtml = blogHtml.replace(/data-i18n-alt="blog\.alt_a_macro_shot_of_stacked_premiu"/g, 'data-i18n-alt="blog.alt_stacked_logs"');
blogHtml = blogHtml.replace(/data-i18n-alt="blog\.alt_a_sleek_modern_industrial_pell"/g, 'data-i18n-alt="blog.alt_pellet_plant"');
fs.writeFileSync('blog.html', blogHtml);

// 7. aria-label
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/aria-label="Précédent"/g, 'aria-label="Précédent" data-i18n-aria-label="nav.prev"');
indexHtml = indexHtml.replace(/aria-label="Suivant"/g, 'aria-label="Suivant" data-i18n-aria-label="nav.next"');
fs.writeFileSync('index.html', indexHtml);

let connHtml = fs.readFileSync('connexion.html', 'utf8');
connHtml = connHtml.replace(/aria-label="Afficher le mot de passe"/g, 'aria-label="Afficher le mot de passe" data-i18n-aria-label="auth.show_password"');
// JS fix for 'Masquer'
connHtml = connHtml.replace(/icon.textContent = 'visibility';/g, "icon.textContent = 'visibility'; btn.setAttribute('aria-label', window.i18n ? window.i18n.t('auth.show_password', 'Afficher le mot de passe') : 'Afficher le mot de passe'); btn.setAttribute('data-i18n-aria-label', 'auth.show_password');");
connHtml = connHtml.replace(/icon.textContent = 'visibility_off';/g, "icon.textContent = 'visibility_off'; btn.setAttribute('aria-label', window.i18n ? window.i18n.t('auth.hide_password', 'Masquer le mot de passe') : 'Masquer le mot de passe'); btn.setAttribute('data-i18n-aria-label', 'auth.hide_password');");
fs.writeFileSync('connexion.html', connHtml);

let inscHtml = fs.readFileSync('inscription.html', 'utf8');
inscHtml = inscHtml.replace(/aria-label="Afficher le mot de passe"/g, 'aria-label="Afficher le mot de passe" data-i18n-aria-label="auth.show_password"');
// JS fix for 'Masquer'
inscHtml = inscHtml.replace(/icon.textContent = 'visibility';/g, "icon.textContent = 'visibility'; this.setAttribute('aria-label', window.i18n ? window.i18n.t('auth.show_password', 'Afficher le mot de passe') : 'Afficher le mot de passe'); this.setAttribute('data-i18n-aria-label', 'auth.show_password');");
inscHtml = inscHtml.replace(/icon.textContent = 'visibility_off';/g, "icon.textContent = 'visibility_off'; this.setAttribute('aria-label', window.i18n ? window.i18n.t('auth.hide_password', 'Masquer le mot de passe') : 'Masquer le mot de passe'); this.setAttribute('data-i18n-aria-label', 'auth.hide_password');");
fs.writeFileSync('inscription.html', inscHtml);

// 8. Éléments dont l'astérisque ou le balisage disparaît
let tbHtml = fs.readFileSync('tableau-de-bord.html', 'utf8');
// Fix <span data-i18n="dashboard.profile.xxx">Text<span class="text-error">*</span></span>
// to <div><span data-i18n="...">Text</span><span class="text-error">*</span></div>
tbHtml = tbHtml.replace(/<span data-i18n="dashboard\.profile\.([a-z_]+)">([^<]+)<span class="text-error">\*<\/span><\/span>/g,
    '<span data-i18n="dashboard.profile.$1">$2</span><span class="text-error">*</span>');
fs.writeFileSync('tableau-de-bord.html', tbHtml);

// Also blog.article_1_title, categories.pellets, cgv.payment_method_desc
// wait, let's fix them manually since regex might break.
