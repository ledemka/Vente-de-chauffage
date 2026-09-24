const fs = require('fs');

// tableau-de-bord.html
let dash = fs.readFileSync('tableau-de-bord.html', 'utf8');
dash = dash.replace(
  /<label([^>]*)data-i18n="dashboard\.profile\.company"([^>]*)>([^<]*)<span class="text-error">\*<\/span><\/label>/g,
  '<label$1$2><span data-i18n="dashboard.profile.company">$3</span> <span class="text-error">*</span></label>'
);
dash = dash.replace(
  /<label([^>]*)data-i18n="dashboard\.profile\.contact_name"([^>]*)>([^<]*)<span class="text-error">\*<\/span><\/label>/g,
  '<label$1$2><span data-i18n="dashboard.profile.contact_name">$3</span> <span class="text-error">*</span></label>'
);
dash = dash.replace(
  /<label([^>]*)data-i18n="dashboard\.profile\.email"([^>]*)>([^<]*)<span class="text-error">\*<\/span><\/label>/g,
  '<label$1$2><span data-i18n="dashboard.profile.email">$3</span> <span class="text-error">*</span></label>'
);
dash = dash.replace(
  /<label([^>]*)data-i18n="dashboard\.profile\.phone"([^>]*)>([^<]*)<span class="text-error">\*<\/span><\/label>/g,
  '<label$1$2><span data-i18n="dashboard.profile.phone">$3</span> <span class="text-error">*</span></label>'
);
dash = dash.replace(
  /<label([^>]*)data-i18n="dashboard\.profile\.address"([^>]*)>([^<]*)<span class="text-error">\*<\/span><\/label>/g,
  '<label$1$2><span data-i18n="dashboard.profile.address">$3</span> <span class="text-error">*</span></label>'
);
// Also for dashboard.profile.new_password and password? The prompt said 5 libellés.
fs.writeFileSync('tableau-de-bord.html', dash);

// index.html - categories.pellets
let idx = fs.readFileSync('index.html', 'utf8');
// categories.pellets
idx = idx.replace(
  /<span([^>]*)data-i18n="categories\.pellets"([^>]*)>([^<]*)<span([^>]*)>\*<\/span><\/span>/g,
  '<span$1$2><span data-i18n="categories.pellets">$3</span><span$4>*</span></span>'
);
idx = idx.replace(
    /data-i18n="categories\.pellets"([^>]*)>([^<]+)<sup/g,
    '>\n<span data-i18n="categories.pellets">$2</span><sup'
);
fs.writeFileSync('index.html', idx);

// blog.html - blog.article_1_title
let blog = fs.readFileSync('blog.html', 'utf8');
blog = blog.replace(
  /data-i18n="blog\.article_1_title">([^<]*)<br>([^<]*)/g,
  '><span data-i18n="blog.article_1_title">$1 $2</span>'
);
fs.writeFileSync('blog.html', blog);

// cgv.html - cgv.payment_method_desc
if (fs.existsSync('cgv.html')) {
  let cgv = fs.readFileSync('cgv.html', 'utf8');
  cgv = cgv.replace(
    /data-i18n="cgv\.payment_method_desc">([^<]*)<ul>/g,
    '><span data-i18n="cgv.payment_method_desc">$1</span><ul>'
  );
  fs.writeFileSync('cgv.html', cgv);
}
console.log('Fixed asterisks and tags');
