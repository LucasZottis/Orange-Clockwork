# Design System Documentation: The Midnight Editorial

## 1. Overview & Creative North Star
**The Creative North Star: "The Obsidian Gallery"**

This design system moves away from the utilitarian "SaaS dashboard" aesthetic toward a high-end, editorial experience. By shifting from a restrictive sidebar navigation to an expansive top-tier layout, we embrace a "wide-screen" philosophy that prioritizes breathing room and focus.

The "Obsidian Gallery" approach treats the dark mode not as a simple color inversion, but as a prestigious, low-light environment. We utilize intentional asymmetry, serif-driven typography scales, and tonal depth to create an interface that feels less like software and more like a curated digital publication.

---

## 2. Colors & Tonal Depth
Our palette is rooted in a deep, atmospheric red (#AF4949), balanced by sophisticated "near-black" neutrals.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Layout boundaries must be defined strictly through background color shifts or negative space. 
*   *Implementation:* A `surface-container-low` section sitting on a `surface` background is the only way to define a structural block.

### Surface Hierarchy & Nesting
We treat the UI as a series of physical layers. Use the hierarchy below to define "elevation":
*   **Background (`#1a1111`):** The foundational canvas.
*   **Surface-Container-Lowest (`#150c0c`):** Used for "sunken" utility areas or secondary backgrounds.
*   **Surface-Container-High (`#322727`):** Reserved for active interaction states or modal overlays.

### The "Glass & Gradient" Rule
To avoid a flat, "boxed-in" look, floating elements (menus, dropdowns) must use **Glassmorphism**:
*   **Token:** `surface-variant` with a `backdrop-filter: blur(12px)` and 60% opacity.
*   **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (#ffb3b0) to `primary_container` (#af4949) at a 135-degree angle. This adds "soul" and prevents the UI from feeling static.

---

## 3. Typography
The system uses a high-contrast pairing of **Newsreader** (Serif) and **Manrope** (Sans-Serif).

*   **Display & Headline (Newsreader):** These are our "Editorial Voices." Use `display-lg` (3.5rem) with tight letter-spacing for hero sections. Headlines should feel authoritative and slightly asymmetrical in placement.
*   **Title & Body (Manrope):** Our "Functional Voices." Manrope provides high legibility at smaller scales. `title-lg` (1.375rem) should be used for section headers to provide a modern, clean anchor to the serif headlines.
*   **The Contrast Principle:** Always pair a `headline-lg` in Newsreader with a `body-md` in Manrope to create the "magazine" feel. Avoid using the serif font for functional UI labels or buttons.

---

## 4. Elevation & Depth
We eschew traditional shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A card (`surface-container-low`) should sit on a section (`surface`). The contrast is subtle, mimicking fine paper layered on a dark desk.
*   **Ambient Shadows:** If an element must float (e.g., a primary action button), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow color should never be pure black, but a tinted version of `surface_container_lowest`.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use a "Ghost Border": `outline-variant` at **15% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components & Layout Transition

### Wide-Screen Top Navigation
The sidebar has been deprecated in favor of a **Top Navigation Bar**. 
*   **Layout:** The Nav Bar should be `surface-container-lowest` with a height of 80px, utilizing a `title-sm` font for links. 
*   **Spacing:** Items must be center-aligned with significant horizontal padding to emphasize the "wide-screen" feel.

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), `md` (0.375rem) roundedness. No border.
*   **Secondary:** `outline` token at 20% opacity. Text in `primary`.
*   **Tertiary:** Pure text with `label-md` styling, using `primary` color.

### Cards & Lists
*   **Forbid Dividers:** Do not use horizontal lines between list items. Use 16px or 24px of vertical white space to separate content blocks.
*   **Interactive Cards:** Use `surface-container-low`. On hover, transition to `surface-container-high` with a 200ms ease-in-out.

### Input Fields
*   **Styling:** Inputs should be "Underlined" style or "Ghost" style (background of `surface-container-highest` with no border).
*   **Focus State:** The bottom border or glow should utilize the `tertiary` (#7ad9ac) color to provide a high-contrast functional cue.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins. For example, a header might be indented 15% more than the body text to create editorial rhythm.
*   **Do** leverage the `tertiary` green (#7ad9ac) for success states and accent callouts—it vibrates beautifully against the deep red background.
*   **Do** prioritize "white space" (or rather, "dark space"). If you think a section needs more room, double the padding.

### Don't
*   **Don't** use pure white (#FFFFFF) for text. Always use `on_surface` (#f1dedd) to reduce eye strain and maintain the "Obsidian" tone.
*   **Don't** use standard 1px borders to separate the navigation from the content. Use a subtle `surface-container` shift.
*   **Don't** use sharp corners. Always use at least the `DEFAULT` (0.25rem) or `md` (0.375rem) roundedness to keep the editorial feel soft and premium.