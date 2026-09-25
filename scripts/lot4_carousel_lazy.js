const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

// Replace background-image with data-bg for slides 2-5
index = index.replace(/<div class="hero-slide absolute([^>]*)style="background-image: (url\('[^']+'\))">/g, '<div class="hero-slide absolute$1data-bg="$2">');

// Add the JS logic right after `const slides = ...`
const insertionTarget = "const slides = document.querySelectorAll('#hero-carousel-slides .hero-slide');";
const lazyLogic = `
                // Defer background image load for non-active slides
                window.addEventListener('load', () => {
                    slides.forEach(slide => {
                        if (slide.hasAttribute('data-bg')) {
                            slide.style.backgroundImage = slide.getAttribute('data-bg');
                            slide.removeAttribute('data-bg');
                        }
                    });
                });
`;

if (index.includes(insertionTarget)) {
    index = index.replace(insertionTarget, insertionTarget + '\n' + lazyLogic);
    fs.writeFileSync('index.html', index, 'utf8');
    console.log('Fixed hero carousel lazy loading.');
} else {
    console.log('Could not find insertion target in index.html');
}
