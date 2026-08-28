---
name: Terre & Feu
colors:
  surface: '#fff8f5'
  surface-dim: '#e3d8d1'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fef1eb'
  surface-container: '#f8ece5'
  surface-container-high: '#f2e6df'
  surface-container-highest: '#ece0da'
  on-surface: '#201a17'
  on-surface-variant: '#56423d'
  inverse-surface: '#362f2b'
  inverse-on-surface: '#fbeee8'
  outline: '#8a726c'
  outline-variant: '#ddc0ba'
  surface-tint: '#a03f28'
  primary: '#802813'
  on-primary: '#ffffff'
  primary-container: '#a03f28'
  on-primary-container: '#ffcdc1'
  inverse-primary: '#ffb4a3'
  secondary: '#685c55'
  on-secondary: '#ffffff'
  secondary-container: '#f0dfd6'
  on-secondary-container: '#6e625b'
  tertiary: '#56423d'
  on-tertiary: '#ffffff'
  tertiary-container: '#6f5953'
  on-tertiary-container: '#efd1ca'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a3'
  on-primary-fixed: '#3d0700'
  on-primary-fixed-variant: '#812813'
  secondary-fixed: '#f0dfd6'
  secondary-fixed-dim: '#d3c3bb'
  on-secondary-fixed: '#221a15'
  on-secondary-fixed-variant: '#4f453e'
  tertiary-fixed: '#fadcd5'
  tertiary-fixed-dim: '#ddc0b9'
  on-tertiary-fixed: '#271813'
  on-tertiary-fixed-variant: '#56423d'
  background: '#fff8f5'
  on-background: '#201a17'
  surface-variant: '#ece0da'
typography:
  headline-xl:
    fontFamily: Chivo
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Chivo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1440px
---

## Brand & Style
The design system is built for a B2B wholesale environment, balancing industrial efficiency with a premium, material-focused aesthetic. The brand personality is grounded, authoritative, and logistically precise. 

The visual style follows a **Modern Industrial** aesthetic: clean lines, structured data, and high-contrast focal points. It rejects the "rustic" aesthetic in favor of a "premium commodity" approach—focusing on the volume, quality, and thermal efficiency of the product. The interface must feel as sturdy and reliable as the firewood it sells, utilizing heavy whitespace and a strictly warm color temperature to evoke heat and earth without relying on cliches.

## Colors
The palette is strictly warm, intentionally excluding all blue or cool-grey tones to maintain the "Earth & Fire" narrative. 

- **Primary (#A03F28):** Used exclusively for primary actions, critical alerts, and brand highlights. 
- **Surface & Background:** The background uses a warm cream (#FAF3EA) to reduce eye strain during long procurement sessions. Container surfaces (#F1E4D8) provide subtle tonal separation for cards and sections.
- **Typography & Neutrals:** All text and UI chrome use warm-based darks (#2A2420) and taupes (#6B5F58). Avoid pure black; use the warm charcoal for all "dark" requirements to maintain a premium feel.
- **Borders:** Use #8A726C for all structural outlines to ensure a cohesive, industrial-ink look.

## Typography
The system uses **Chivo** for headings to provide a confident, industrial-strength presence. Its sharp terminals and robust weight reflect the wholesale nature of the business. 

For all functional and data-heavy content, **Inter** is utilized for its exceptional legibility and neutral character. 
- **Data Tables:** Use `data-mono` or `body-sm` with medium weights for numeric density.
- **Labels:** Small labels and "Overlines" should use `label-md` with uppercase styling to denote technical categories or specifications.

## Layout & Spacing
This design system employs a **Fixed-Fluid Hybrid Grid**. 
- **Desktop:** 12-column grid with a 24px gutter. Maximum content width is capped at 1440px to ensure data tables remain readable and don't stretch excessively.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px margins.

Spacing follows an 8px rhythmic scale. Use generous padding in product cards (24px+) to maintain a premium feel, but keep data table rows tight (12px vertical padding) for high information density.

## Elevation & Depth
In alignment with the industrial-premium style, this system avoids traditional drop shadows. Instead, it uses **Tonal Layering** and **Low-Contrast Outlines**.

- **Level 0:** Main Background (#FAF3EA).
- **Level 1:** Secondary Containers/Cards (#F1E4D8) with a 1px solid border (#8A726C).
- **Level 2 (Interactive):** When a card or element is hovered, use a subtle 2px solid border in the Primary color (#A03F28) rather than a shadow.
- **Modals:** Use a dark, warm-tinted overlay (#2A2420 at 40% opacity) with a hard-edged container to maintain the structured look.

## Shapes
Shapes are disciplined and functional. 
- **Standard UI (Buttons, Inputs, Cards):** 4px (Soft) corner radius. This provides just enough refinement to feel modern without losing the "hard" industrial edge.
- **Data Tags/Chips:** May use 2px radius for a more technical, "stamped" appearance.
- **Icons:** Use *Material Symbols Outlined* with a stroke weight of 200 or 400 to match the clean typography.

## Components
- **Buttons:** 
  - *Primary:* Solid #A03F28 with White text. Bold, 4px radius, no shadow.
  - *Secondary:* Outline #8A726C with #2A2420 text. 
- **Product Cards:** Must feature a "Technical Specs" section using `label-md` for headers (e.g., MOISTURE CONTENT, WOOD TYPE). Use the Container Surface color (#F1E4D8) for the card background.
- **Data Tables:** High-density. Headers use `label-md` with #6B5F58 text and a solid 2px bottom border in #8A726C. Alternate row striping is not required; use thin 1px horizontal dividers instead.
- **Inputs:** 1px border (#8A726C) that thickens to 2px Primary (#A03F28) on focus. Labels sit outside the field in #2A2420.
- **Quantity Selector:** A prominent industrial-style component. Buttons are large and tactile, flanking the numeric input to facilitate bulk ordering.
- **Logistics Status Chips:** Use tonal variations of the primary/secondary colors—avoiding green/red/blue standards where possible to keep the warm palette intact (e.g., use #8A726C for "Processing" and #A03F28 for "Shipped").