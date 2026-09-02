import os
import re

directories = ['.', 'en', 'de', 'nl']

def modify_index_file(filepath, is_subfolder):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Categories Grid Links
    # The cards are ordered 1 to 5. We'll find them in order and replace href="#"
    cat_prefix = "../catalogue.html" if is_subfolder else "./catalogue.html"
    
    # We replace href="#" with href="<cat_prefix>?subgroup=X" 5 times
    for i in range(1, 6):
        content = content.replace('href="#"', f'href="{cat_prefix}?subgroup={i}"', 1)

    # 2. Footer links
    # Search for footer links
    devis_path = "../devis.html" if is_subfolder else "./devis.html"
    
    # The links are grouped in the footer
    # They have <span data-i18n="footer.service_1">...
    # Let's replace by finding the href="#" near them
    # Actually, they might be the ONLY href="#" left if we replace all carefully, 
    # but let's be more precise:
    
    # "Bûches de bois franc" -> subgroup 1
    content = re.sub(
        r'href="#"(>\s*<span[^>]*data-i18n="footer\.service_1")',
        f'href="{cat_prefix}?subgroup=1"\\1',
        content
    )
    # "Granulés (Pellets)" -> subgroup 4
    content = re.sub(
        r'href="#"(>\s*<span[^>]*data-i18n="footer\.service_2")',
        f'href="{cat_prefix}?subgroup=4"\\1',
        content
    )
    # "Bois de cuisson pro" -> no subgroup
    content = re.sub(
        r'href="#"(>\s*<span[^>]*data-i18n="footer\.service_3")',
        f'href="{cat_prefix}"\\1',
        content
    )
    # "Tarifs Gros & B2B" -> devis.html
    content = re.sub(
        r'href="#"(>\s*<span[^>]*data-i18n="footer\.service_4")',
        f'href="{devis_path}"\\1',
        content
    )
    
    # 3. Hero Carousel Arrows
    # We need to extract the buttons and place them as direct children of #hero-carousel-section
    
    # Original block looks like:
    # <div class="flex items-center gap-3 bg-[#201a17]/60 backdrop-blur-md p-2 rounded-full border border-outline/20 shadow-lg">
    #   <button id="hero-prev-btn" ...> ... </button>
    #   <div class="flex items-center gap-2 px-1" id="hero-carousel-dots"> ... </div>
    #   <button id="hero-next-btn" ...> ... </button>
    # </div>
    
    # Let's extract prev button and next button HTML
    prev_btn_match = re.search(r'<button id="hero-prev-btn"[^>]*>[\s\S]*?</button>', content)
    next_btn_match = re.search(r'<button id="hero-next-btn"[^>]*>[\s\S]*?</button>', content)
    
    if prev_btn_match and next_btn_match:
        prev_btn = prev_btn_match.group(0)
        next_btn = next_btn_match.group(0)
        
        # Modify the classes of the buttons to position them absolutely
        # "positionner les deux boutons en absolute, centrés verticalement (top-1/2 -translate-y-1/2), sur les bords gauche et droit... z-30 minimum"
        
        new_prev_btn = re.sub(
            r'class="([^"]*)"',
            r'class="\1 absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-30"',
            prev_btn,
            count=1
        )
        
        new_next_btn = re.sub(
            r'class="([^"]*)"',
            r'class="\1 absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-30"',
            next_btn,
            count=1
        )
        
        # Remove them from the dots container
        content = content.replace(prev_btn, "")
        content = content.replace(next_btn, "")
        
        # Insert them into #hero-carousel-section just before the closing tag, or just after the opening tag
        # The section opens with <section id="hero-carousel-section" ...>
        # Let's insert right after the opening tag
        content = re.sub(
            r'(<section id="hero-carousel-section"[^>]*>)',
            f'\\1\n{new_prev_btn}\n{new_next_btn}',
            content,
            count=1
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for d in directories:
    filepath = os.path.join(d, 'index.html')
    if os.path.exists(filepath):
        print(f"Modifying {filepath}...")
        modify_index_file(filepath, d != '.')

print("Done.")
