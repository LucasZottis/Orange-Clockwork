# Design System Document: Late Night Vitality

## 1. Overview & Creative North Star: "The Neon Nocturne"
This design system is built for the high-achiever working when the rest of the world is asleep. The Creative North Star is **"The Neon Nocturne"**—a philosophy that balances the restorative silence of deep charcoal spaces with the electric energy of vibrant orange pulses. 

To break the "template" look, we move away from rigid, boxy grids. We utilize **intentional asymmetry**, where large display type creates a heavy anchor on one side, balanced by ethereal, floating functional elements on the other. We reject the "flat" dark mode in favor of **tonal depth**, creating a UI that feels like a sophisticated digital physical space rather than a flat screen.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in `#0e0e0e`, but its soul lies in the `Primary` orange (#FF8C00) and its various containers.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined through:
*   **Background Shifting:** A `surface-container-low` section sitting on a `surface` background.
*   **Tonal Transitions:** Using subtle shifts between `surface-dim` and `surface-bright` to imply edge without a stroke.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of tinted obsidian. 
*   **Base:** `surface-container-lowest` (#000000) for the deepest background layers.
*   **Primary Content Area:** `surface` (#0e0e0e).
*   **Nested Components:** Use `surface-container` (#1a1a1a) or `surface-container-high` (#20201f) for cards.
*   **The "Glass & Gradient" Rule:** Floating modals or navigation bars should use `surface-variant` at 60% opacity with a `24px` backdrop blur. Use a subtle linear gradient (Top-Left: `primary` to Bottom-Right: `primary-container`) for high-impact CTAs to provide a "glow" that feels liquid, not static.

---

## 3. Typography: The Editorial Edge
We use **Plus Jakarta Sans** for its geometric clarity and modern warmth. 

*   **Display (lg/md/sm):** These are your "vibe setters." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create an editorial feel. In the 'Late Night' context, these should be `on-surface` but can occasionally use a `primary` highlight for a single word.
*   **Headlines & Titles:** Use `headline-md` for clear section starts. Always pair a `headline` with a `label-md` uppercase sub-header to create a "Professional Journal" hierarchy.
*   **Body (lg/md/sm):** Set `body-lg` at 1.0rem with a generous line-height (1.6) to reduce eye strain during long focus sessions.
*   **The Brand Identity:** The juxtaposition of massive `Display` type against tiny, precise `Labels` creates an expensive, bespoke feel that standard "16px everywhere" layouts lack.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "dirty" for this clean dark aesthetic. We use **Atmospheric Depth**.

*   **The Layering Principle:** To lift an element, move it up the surface scale. A card doesn't get a shadow; it moves from `surface` to `surface-container-high`.
*   **Ambient Shadows:** If a floating element (like a FAB) requires a shadow, it must be an "Orange Glow." Use `primary` at 10% opacity with a `32px` blur and `0px` offset. This mimics the way a neon sign casts light on a dark street.
*   **The "Ghost Border" Fallback:** If a border is essential for accessibility, use `outline-variant` (#484847) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use backdrop-blur on all elevated surfaces (like Top App Bars) to allow the "Late Night" orange accents to bleed through the dark containers as the user scrolls.

---

## 5. Components: Fluidity & Impact

### Buttons
*   **Primary:** Solid `primary` (#ff9f4a). No border. White text (`on-primary`). 8px radius. 
*   **Secondary:** `surface-container-highest` background with `primary` text. This creates a "submerged" look that doesn't compete with the main action.
*   **Tertiary:** No background. `primary` text with a subtle underline on hover.

### Input Fields
*   **Style:** No outer border. Use `surface-container-high` as the fill. 
*   **Focus State:** The background remains the same, but the `label` transitions to `primary` color and a 1px `primary` bottom-border (the only exception to the No-Line rule) appears to "underline" the user's intent.

### Cards & Lists
*   **Forbid Dividers:** Use `24px` of vertical whitespace to separate list items. 
*   **Active State:** When a list item is selected, do not use a border. Change the background to `surface-bright` and add a `primary` vertical "accent pill" (4px wide, 16px high) to the left of the item.

### Focus Timer (Signature Component)
*   A large, thin-weight `display-lg` countdown. 
*   Surround the timer with a "Breath Ring"—a semi-transparent gradient stroke that pulses slowly using the `primary_dim` to `primary` tokens.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use "Negative Space" as a design element. Let the charcoal breathe.
*   **DO** use the `primary` orange sparingly. It is a laser, not a paint bucket.
*   **DO** use `tertiary` (#ffe393) for "Success" or "Completion" states to provide a warm, rewarding contrast to the energetic orange.

### Don’t
*   **DON'T** use pure `#ffffff` for long-form body text. Use `on-surface-variant` (#adaaaa) to prevent "halo-ing" and eye strain in dark environments.
*   **DON'T** use 100% opaque black for backgrounds. Always use the specified `surface` tokens to maintain the "charcoal" depth.
*   **DON'T** use sharp 90-degree corners. The `Medium (Round 8)` scale must be consistent to maintain the approachable, high-end feel.