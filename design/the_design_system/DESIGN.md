---
name: the design system
colors:
  surface: '#fff8f6'
  surface-dim: '#e7d6d4'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ee'
  surface-container: '#fbeae7'
  surface-container-high: '#f6e4e2'
  surface-container-highest: '#f0dfdc'
  on-surface: '#221a18'
  on-surface-variant: '#55423f'
  inverse-surface: '#382e2c'
  inverse-on-surface: '#feedea'
  outline: '#88726f'
  outline-variant: '#dbc1bc'
  surface-tint: '#984538'
  primary: '#954336'
  on-primary: '#ffffff'
  primary-container: '#b45a4c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a7'
  secondary: '#625a7a'
  on-secondary: '#ffffff'
  secondary-container: '#e3d7fe'
  on-secondary-container: '#645c7d'
  tertiary: '#7b5500'
  on-tertiary: '#ffffff'
  tertiary-container: '#996c10'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a7'
  on-primary-fixed: '#3f0301'
  on-primary-fixed-variant: '#7a2e23'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#ccc1e7'
  on-secondary-fixed: '#1e1733'
  on-secondary-fixed-variant: '#4a4261'
  tertiary-fixed: '#ffdeac'
  tertiary-fixed-dim: '#f5bd5e'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#5f4100'
  background: '#fff8f6'
  on-background: '#221a18'
  surface-variant: '#f0dfdc'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 44px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.5rem
  space-lg: 2.5rem
  space-xl: 4rem
---

## Brand & Style

This design system is built for an intimate, thoughtful lifestyle blog and digital journal. The brand personality is cozy, warm, and deeply inviting, evoking the feeling of a sunlit morning with a hot cup of coffee and a favorite notebook. 

The visual style combines minimalist restraint with tactile warmth—relying on generous whitespace, soft editorial serifs, and friendly rounded geometry. The emotional response is one of calm, comfort, and quiet inspiration, stripping away digital coldness in favor of organic textures and human warmth.

## Colors

The palette is anchored by a warm cream canvas (`#FBF6EF`) supporting pure white cards (`#FFFFFF`). Text is set in a deep, organic brown-ink (`#2B2320`) for optimal legibility without the harshness of pure black. 

The primary accent is a dusty rose terracotta (`#C96B5C`), utilized for primary actions and active states. Secondary accents include soft lavender (`#CFC4EA`), warm amber (`#F0B95A`), and muted peach (`#F6D5C4`) to create subtle hierarchy and delightful editorial warmth. Green is strictly reserved for tiny success indicators and checkmarks.

## Typography

Typography balances literary elegance with modern approachable warmth. Headlines use `Playfair Display`, bringing an authoritative yet graceful editorial voice to titles and section headers. Body text and interactive labels use `Plus Jakarta Sans`, offering a soft, rounded geometric skeleton that reads effortlessly across devices. 

Ensure generous line heights to preserve the airy, unhurried reading experience characteristic of long-form thought pieces and essays.

## Layout & Spacing

The layout philosophy relies on a fluid grid system paired with generous whitespace to create a calm, uncluttered reading canvas. Margins scale up gracefully on wider viewports to keep content neatly centered in an optimal reading measure.

Spacing increments are intentionally generous (`space-md` is 1.5rem, `space-lg` is 2.5rem) to ensure components never feel cramped. Elements breathe within their containers, reinforcing the cozy, unhurried atmosphere.

## Elevation & Depth

Depth is conveyed through soft, low-opacity ambient shadows rather than stark borders. Surfaces float delicately off the warm cream background using diffused shadow stacks tinted with warm brown undertones. 

Cards (`#FFFFFF`) cast gentle, multi-layered shadows that suggest physical paper laid across a desktop. Hover states subtly lift elements closer to the user with a slight increase in shadow blur and vertical offset.

## Shapes

With a roundedness setting of `2`, UI elements feature friendly, generous radii. Standard containers, cards, and input fields use 16px to 24px border-radius values, softening every digital edge. 

Buttons and pills lean into friendly curves, completely avoiding sharp 90-degree corners to maintain a warm, approachable tactile language.

## Components

### Buttons
Primary buttons feature the dusty rose terracotta (`#C96B5C`) background with white text, pill-shaped or heavily rounded (16px+), and a soft shadow on hover. Secondary buttons use transparent or warm cream fills with deep brown-ink text and gentle borders.

### Cards
Cards use a pure white surface (`#FFFFFF`) against the warm cream background, styled with generous internal padding, 20px rounded corners, and soft ambient drop shadows. They serve as the primary vessel for articles, thought notes, and featured collections.

### Input Fields
Inputs feature a subtle warm border, soft rounded corners, and generous touch targets. Focus states transition smoothly to the terracotta accent color with an accompanying soft glow.

### Chips & Tags
Compact tags utilize the secondary accent colors (soft lavender, warm amber, muted peach) with dark brown text, perfect for categorizing thoughts and article topics.

### Checkboxes & Radios
Custom inputs use rounded geometry with deep brown borders, filling with the terracotta accent upon selection and housing a tiny, crisp success tick when complete.