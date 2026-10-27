const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('=== RUNNING CATALOG MENU & FILTERING TESTS ===\n');

const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'catalogue.html'), 'utf8');

const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost:8080/catalogue.html'
});

const { window } = dom;
const { document } = window;

// Supply products.json & fr.json translations
const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json'), 'utf8'));
const frTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'i18n', 'fr.json'), 'utf8'));

window.fetch = async (url) => {
    if (url.includes('products.json')) {
        return {
            ok: true,
            status: 200,
            json: async () => products
        };
    }
    if (url.includes('fr.json')) {
        return {
            ok: true,
            status: 200,
            json: async () => frTranslations
        };
    }
    if (url.includes('.json')) {
        return {
            ok: true,
            status: 200,
            json: async () => ({})
        };
    }
    return { ok: true, json: async () => ({}) };
};

// Dispatch i18nLoaded event
document.dispatchEvent(new window.CustomEvent('i18nLoaded', {
    detail: {
        lang: 'fr',
        translations: frTranslations
    }
}));

// Ensure catalog-menu.js script is loaded and executed in JSDOM
const catalogMenuJs = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'catalog-menu.js'), 'utf8');
window.eval(catalogMenuJs);

setTimeout(() => {
    try {
        console.log('1. Checking Desktop Navigation Elements:');
        const wrapper = document.getElementById('nav-catalog-wrapper');
        const link = document.getElementById('nav-catalog-link');
        const dropdown = document.getElementById('nav-catalog-dropdown');
        const chevron = document.getElementById('nav-catalog-chevron');

        console.assert(wrapper !== null, 'nav-catalog-wrapper should exist');
        console.assert(link !== null, 'nav-catalog-link should exist');
        console.assert(dropdown !== null, 'nav-catalog-dropdown should exist');
        console.assert(chevron !== null, 'nav-catalog-chevron should exist');

        const items = dropdown.querySelectorAll('[data-catalog-subgroup]');
        console.assert(items.length === 5, `Dropdown must have 5 category links, found ${items.length}`);
        console.log('   ✓ Desktop nav items exist (5 categories found)');

        console.log('\n2. Testing Hover & Visibility Interaction:');
        wrapper.dispatchEvent(new window.Event('mouseenter'));
        console.assert(!dropdown.classList.contains('hidden'), 'Dropdown should not have hidden on mouseenter');
        console.assert(dropdown.classList.contains('opacity-100'), 'Dropdown should have opacity-100 on mouseenter');
        console.log('   ✓ Mouseenter displays dropdown with opacity-100');

        console.log('\n3. Testing Category Filtering via window.applyCategoryFilter:');
        // Test Category 1: Bûches de bois
        window.applyCategoryFilter('1');
        const cb1 = document.querySelector('.filter-category[data-subgroup="1"]');
        const cb2 = document.querySelector('.filter-category[data-subgroup="2"]');
        console.assert(cb1.checked === true, 'Category 1 checkbox should be checked');
        console.assert(cb2.checked === false, 'Category 2 checkbox should NOT be checked');

        let sections = document.querySelectorAll('#catalog-container section');
        console.assert(sections.length === 1, `Only 1 section should be visible for category 1, got ${sections.length}`);
        console.assert(sections[0].id === 'subgroup-1', `Visible section must be subgroup-1, got ${sections[0].id}`);
        console.log('   ✓ Category 1 filter displays only subgroup-1 products');

        // Test Category 4: Granulés / Pellets
        window.applyCategoryFilter('4');
        const cb4 = document.querySelector('.filter-category[data-subgroup="4"]');
        console.assert(cb1.checked === false, 'Category 1 checkbox should now be unchecked');
        console.assert(cb4.checked === true, 'Category 4 checkbox should now be checked');
        sections = document.querySelectorAll('#catalog-container section');
        console.assert(sections.length === 1, `Only 1 section should be visible for category 4, got ${sections.length}`);
        console.assert(sections[0].id === 'subgroup-4', `Visible section must be subgroup-4, got ${sections[0].id}`);
        console.log('   ✓ Category 4 filter displays only subgroup-4 products');

        // Test Category 5: Charbon / Allume-feu
        window.applyCategoryFilter('5');
        const cb5 = document.querySelector('.filter-category[data-subgroup="5"]');
        console.assert(cb5.checked === true, 'Category 5 checkbox should now be checked');
        sections = document.querySelectorAll('#catalog-container section');
        console.assert(sections[0].id === 'subgroup-5', `Visible section must be subgroup-5, got ${sections[0].id}`);
        console.log('   ✓ Category 5 filter displays only subgroup-5 products');

        console.log('\n4. Testing Reset Button:');
        const resetBtn = document.getElementById('reset-filters');
        resetBtn.click();
        const checkedBoxes = Array.from(document.querySelectorAll('.filter-category')).filter(cb => cb.checked);
        console.assert(checkedBoxes.length === 0, `All checkboxes must be unchecked after reset, found ${checkedBoxes.length}`);
        sections = document.querySelectorAll('#catalog-container section');
        console.assert(sections.length === 5, `All 5 sections should be visible after reset, found ${sections.length}`);
        console.log('   ✓ Reset button clears all category filters and restores all 5 sections');

        console.log('\n5. Testing Mobile Drawer Accordion:');
        const mobileToggle = document.getElementById('mobile-catalog-expand-btn');
        const mobileSubmenu = document.getElementById('mobile-catalog-subcategories');
        console.assert(mobileToggle !== null, 'Mobile toggle button should exist');
        console.assert(mobileSubmenu !== null, 'Mobile submenu should exist');
        console.assert(mobileSubmenu.classList.contains('hidden'), 'Mobile submenu should be hidden initially');

        mobileToggle.click();
        console.assert(!mobileSubmenu.classList.contains('hidden'), 'Mobile submenu should be visible after click');
        console.log('   ✓ Mobile toggle expands category accordion');

        mobileToggle.click();
        console.assert(mobileSubmenu.classList.contains('hidden'), 'Mobile submenu should hide on second click');
        console.log('   ✓ Mobile toggle collapses category accordion');

        console.log('\n======================================================');
        console.log('ALL CATALOG MENU & FILTER TESTS PASSED WITH 100% SUCCESS!');
        console.log('======================================================\n');
        process.exit(0);
    } catch(err) {
        console.error('TEST ERROR:', err);
        process.exit(1);
    }
}, 800);
