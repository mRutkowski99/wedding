---
name: Eucalyptus & Grace
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#424845'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#727875'
  outline-variant: '#c2c8c4'
  surface-tint: '#4c635b'
  primary: '#4c635b'
  on-primary: '#ffffff'
  primary-container: '#8aa399'
  on-primary-container: '#233932'
  inverse-primary: '#b2ccc1'
  secondary: '#4d6359'
  on-secondary: '#ffffff'
  secondary-container: '#cde5d9'
  on-secondary-container: '#51675d'
  tertiary: '#59605e'
  on-tertiary: '#ffffff'
  tertiary-container: '#989f9d'
  on-tertiary-container: '#2f3635'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cee8dd'
  primary-fixed-dim: '#b2ccc1'
  on-primary-fixed: '#081f19'
  on-primary-fixed-variant: '#344b43'
  secondary-fixed: '#d0e8db'
  secondary-fixed-dim: '#b4ccc0'
  on-secondary-fixed: '#0a1f18'
  on-secondary-fixed-variant: '#364b42'
  tertiary-fixed: '#dde4e1'
  tertiary-fixed-dim: '#c1c8c5'
  on-tertiary-fixed: '#161d1b'
  on-tertiary-fixed-variant: '#414846'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '300'
    lineHeight: 56px
  headline-md:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-lg:
    fontFamily: Noto Serif
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Noto Serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Noto Serif
    fontSize: 12px
    fontWeight: '600'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  section-gap: 80px
  container-max: 1100px
  gutter: 24px
  margin-page: 48px
---

## Brand & Style

This design system is anchored in the concept of "Botanical Elegance." It translates the tactile, organic quality of high-end wedding stationery into a digital experience. The brand personality is romantic, timeless, and sophisticated, targeting an audience that values understated luxury and natural beauty.

The visual style is a blend of **Minimalism** and **Tactile** design. By prioritizing immense whitespace (breathability) and delicate botanical-inspired accents, the UI evokes the "airy" feel of a garden celebration. The interface should feel like a physical invitation: crisp, intentional, and commemorative.

## Colors

The palette is derived directly from the silver-green tones of dried eucalyptus leaves and the deep shadows of an evergreen forest. 

- **Primary (Sage):** Used for decorative elements, icon fills, and subtle dividers. It represents the "soft" side of the botanical theme.
- **Secondary (Forest Green):** Reserved for high-priority actions like buttons and active states. It provides the necessary contrast against the white background.
- **Tertiary (Mist):** A very faint green-grey used for surface containers and background sections to break up the "crisp white" without losing the airy feel.
- **Neutral (Charcoal):** Used for all primary legibility. It is softer than pure black, ensuring the typography feels integrated rather than harsh.

## Typography

This design system utilizes a traditional, literary typographic pairing to mirror the look of printed wedding invitations.

- **Headlines (Newsreader):** Selected for its high-contrast strokes and elegant italics. Use the italic variant for names and primary headings to simulate the "sophisticated script" aesthetic requested, providing a sense of celebration and ceremony.
- **Body & Labels (Noto Serif):** Provides a timeless, legible foundation. The serif ensures that long-form content (stories, schedules) feels classic rather than corporate. 
- **Hierarchy:** Maintain large vertical spacing between heading levels to preserve the airy, botanical mood.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model to ensure the content feels curated and centered, much like a printed page. 

- **Generous Margins:** A minimum of 48px page margins ensures the content is never "cramped" against the edge of the viewport.
- **Vertical Rhythm:** Utilize large gaps (80px+) between major sections to encourage a slow, intentional browsing pace.
- **Alignment:** Central alignment is preferred for hero sections and invitations to reinforce the celebratory, formal nature of the content.

## Elevation & Depth

To maintain the "airy" and "botanical" aesthetic, depth is achieved through **Low-contrast Outlines** and **Tonal Layers** rather than heavy shadows.

- **Surfaces:** Use the Tertiary (Mist) color for cards and containers. This creates a subtle visual lift from the crisp white background.
- **Borders:** When necessary, use 1px solid lines in the Primary (Sage) color at 30% opacity.
- **Shadows:** If a shadow is required for interaction (e.g., a hovering card), use a very diffused, low-opacity shadow tinted with the Primary color (`rgba(138, 163, 153, 0.15)`) to maintain the organic feel.

## Shapes

The shape language is **Soft**. While wedding stationery often uses sharp corners, a digital environment benefits from a slight radius to feel approachable and celebratory.

- **Elements:** Buttons and input fields should use a 0.25rem (4px) radius. This provides a "softened" corner that feels organic without becoming overly "bubbly" or playful.
- **Imagery:** Photography of florals or the couple should utilize a larger `rounded-lg` (8px) radius or be masked in organic, leaf-like oval shapes to reinforce the botanical theme.

## Components

- **Buttons:** Primary buttons use the Secondary (Forest Green) background with white Noto Serif text. They should have generous horizontal padding (32px+) to feel significant.
- **Input Fields:** Use a thin (1px) charcoal border with high Noto Serif labels. Focus states should transition the border color to Primary (Sage).
- **Cards:** White or Mist background with a very subtle Sage border. Titles within cards should be Newsreader Italic.
- **Chips/Tags:** Use Sage background at 20% opacity with dark charcoal text for "Save the Date" or status indicators.
- **Botanical Dividers:** Instead of simple lines, use SVG eucalyptus leaf motifs or thin Sage lines with a small floral icon in the center to separate sections.
- **Checkboxes:** Square with a 2px radius, filling with Forest Green when selected.