---
color:
  primary:
    green: "#10B981"
    secondary: "#059669"
    light: "#D1FAE5"
    dark: "#064E3B"
  background:
    default: "#F4F7F6"
    surface: "#FFFFFF"
    surface_alt: "#F9FAFB"
  text:
    primary: "#111827"
    secondary: "#4B5563"
    muted: "#9CA3AF"
  status:
    pending: "#F59E0B"
    progress: "#3B82F6"
    resolved: "#10B981"
    rejected: "#EF4444"
  pastel:
    green: "#D1FAE5"
    orange: "#FFEDD5"
    blue: "#DBEAFE"
    purple: "#EDE9FE"
  accent:
    teal: "#14B8A6"
    lime: "#84CC16"
    yellow: "#FACC15"
  border:
    light: "#F3F4F6"
    default: "#E5E7EB"
    medium: "#D1D5DB"
  functional:
    success: "#10B981"
    warning: "#F59E0B"
    error: "#EF4444"
    info: "#3B82F6"

typography:
  font_family:
    sans: "Plus Jakarta Sans, Inter, sans-serif"
    mono: "JetBrains Mono, monospace"
  scale:
    xs: "0.75rem"
    sm: "0.875rem"
    base: "1rem"
    lg: "1.125rem"
    xl: "1.25rem"
    "2xl": "1.5rem"
    "3xl": "1.875rem"
    "4xl": "2.25rem"
    "5xl": "3rem"
    "6xl": "3.75rem"
    "7xl": "4.5rem"
  weight:
    normal: 400
    medium: 500
    semibold: 600
    bold: 700
  line_height:
    tight: 1.08
    normal: 1.5
    relaxed: 1.75
  letter_spacing:
    tight: "-0.025em"
    normal: "0"
    wide: "0.025em"
    wider: "0.05em"
    widest: "0.1em"

spacing:
  scale:
    "0": "0"
    "1": "0.25rem"
    "2": "0.5rem"
    "3": "0.75rem"
    "4": "1rem"
    "5": "1.25rem"
    "6": "1.5rem"
    "8": "2rem"
    "10": "2.5rem"
    "12": "3rem"
    "16": "4rem"
    "20": "5rem"
    "24": "6rem"
  container:
    sm: "640px"
    md: "768px"
    lg: "1024px"
    xl: "1280px"
    "2xl": "1536px"

border_radius:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  "2xl": "1.5rem"
  "3xl": "2rem"
  full: "9999px"

shadow:
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
  custom:
    glass: "0 4px 12px rgba(0, 0, 0, 0.03)"
    glass_elevated: "0 10px 30px rgba(0, 0, 0, 0.05)"
    glass_hover: "0 8px 24px rgba(0, 0, 0, 0.06)"
    green_glow: "0 0 15px rgba(34, 197, 94, 0.1)"
    green_glow_strong: "0 0 15px rgba(34, 197, 94, 0.15)"
    button: "0 4px 14px rgba(34, 197, 94, 0.2)"
    button_hover: "0 6px 20px rgba(34, 197, 94, 0.3)"

elevation:
  level_0: "none"
  level_1: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"
  level_2: "0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)"
  level_3: "0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)"
  level_4: "0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)"

motion:
  duration:
    fast: "150ms"
    normal: "300ms"
    slow: "500ms"
    slower: "700ms"
  easing:
    ease: "ease"
    ease_in: "ease-in"
    ease_out: "ease-out"
    ease_in_out: "ease-in-out"
  animation:
    float: "float 10s ease-in-out infinite"
    float_delayed: "float 12s ease-in-out infinite 2s"
    shimmer: "shimmer 2s infinite"
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
    fade_in: "fade-in 500ms ease-out"
    slide_up: "slide-in-from-bottom-4 500ms ease-out"

opacity:
  transparent: 0
  low: 0.25
  medium: 0.5
  high: 0.75
  full: 1

blur:
  sm: "4px"
  md: "8px"
  lg: "16px"
  xl: "24px"
  "2xl": "40px"
  "3xl": "64px"

backdrop:
  blur_sm: "backdrop-blur-sm"
  blur_md: "backdrop-blur-md"
  blur_lg: "backdrop-blur-lg"
  blur_xl: "backdrop-blur-xl"

z_index:
  dropdown: 10
  sticky: 20
  fixed: 30
  modal_backdrop: 40
  modal: 50
  popover: 60
  tooltip: 70

component:
  button:
    padding_x:
      sm: "0.75rem"
      md: "1rem"
      lg: "1.5rem"
    padding_y:
      sm: "0.5rem"
      md: "0.75rem"
      lg: "1rem"
    border_radius:
      sm: "0.5rem"
      md: "0.75rem"
      lg: "1rem"
    font_size:
      sm: "0.875rem"
      md: "1rem"
      lg: "1.125rem"
  card:
    padding:
      sm: "1rem"
      md: "1.5rem"
      lg: "2rem"
    border_radius:
      sm: "0.75rem"
      md: "1rem"
      lg: "1.5rem"
      xl: "2rem"
  input:
    padding_x: "0.75rem"
    padding_y: "0.5rem"
    border_radius: "0.625rem"
    font_size: "0.875rem"
  badge:
    padding_x: "0.5rem"
    padding_y: "0.25rem"
    border_radius: "0.5rem"
    font_size: "0.75rem"
  avatar:
    size:
      sm: "2rem"
      md: "2.5rem"
      lg: "3rem"
      xl: "4rem"
  icon:
    size:
      xs: "0.75rem"
      sm: "1rem"
      md: "1.25rem"
      lg: "1.5rem"
      xl: "2rem"

layout:
  sidebar:
    width: "260px"
    collapsed_width: "80px"
  navbar:
    height: "60px"
    scrolled_height: "52px"
  container:
    max_width: "80rem"
    padding_x:
      mobile: "1rem"
      tablet: "1.5rem"
      desktop: "2rem"

scrollbar:
  width: "4px"
  height: "4px"
  track_background: "transparent"
  thumb_background: "rgba(34, 197, 94, 0.25)"
  thumb_hover_background: "rgba(34, 197, 94, 0.5)"
  border_radius: "9999px"

gradient:
  primary:
    start: "#10B981"
    end: "#14B8A6"
  accent:
    start: "#10B981"
    end: "#84CC16"
  subtle:
    start: "rgba(34, 197, 94, 0.1)"
    end: "rgba(20, 184, 166, 0.1)"
  hero:
    start: "rgba(34, 197, 94, 0.1)"
    middle: "transparent"
    end: "rgba(20, 184, 166, 0.1)"

grid:
  pattern_size: "60px"
  line_color: "rgba(34, 197, 94, 0.04)"
  line_width: "1px"

breakpoint:
  mobile: "640px"
  tablet: "768px"
  desktop: "1024px"
  wide: "1280px"
  ultrawide: "1536px"
---

# CityResolve Design System

## Design Philosophy

CityResolve embodies a modern, approachable civic technology aesthetic that balances professionalism with community warmth. The design system prioritizes clarity, trust, and engagement while maintaining a clean, contemporary visual language that feels both governmental and citizen-friendly.

## Visual Identity

### Core Aesthetic

The design language centers on a fresh, optimistic green palette that symbolizes growth, community, and environmental stewardship. The aesthetic is deliberately clean and modern, avoiding bureaucratic heaviness while maintaining the credibility expected of civic platforms. Soft pastel accents and generous whitespace create an approachable, user-friendly experience that encourages participation.

### Color Psychology

The primary green (#10B981) serves as the brand's heartbeat—representing progress, resolution, and positive civic action. This is complemented by a sophisticated neutral palette that provides visual breathing room and ensures content remains the focus. Status colors use intuitive associations (amber for pending, blue for in-progress, emerald for resolved) to create immediate visual understanding without requiring cognitive processing.

### Typography Strategy

Typography prioritizes readability and hierarchy through the Plus Jakarta Sans font family—a modern, geometric sans-serif that conveys trustworthiness and clarity. The type scale is generous, with large, bold headlines that create impact and smaller, refined body text that ensures comfortable reading. Monospace fonts are reserved for data displays and technical elements, creating clear semantic distinction.

## Component Design Language

### Card Architecture

Cards form the foundation of the UI, featuring generous border-radius (up to 24px) that creates a soft, approachable feel. The glass-card pattern uses subtle borders and delicate shadows to create depth without heaviness. Cards employ a consistent internal padding hierarchy and maintain visual coherence through shared border treatments and shadow behaviors.

### Interactive Elements

Buttons and interactive elements use the primary green as their anchor, with hover states that introduce subtle elevation changes and shadow intensification. The interaction model favors direct manipulation—buttons scale slightly on hover, cards lift gently, and transitions use smooth 300ms easings that feel responsive but not hurried.

### Status Communication

Status badges and indicators use color-coded systems that are both accessible and intuitive. The four-state status system (pending, in-progress, resolved, rejected) maps to warm-to-cool color progression that creates visual narrative flow. Status indicators often incorporate subtle animations (pulsing dots, floating elements) to draw attention without being distracting.

## Spatial Design

### Layout Principles

The layout system uses a mobile-first approach with generous container padding that creates breathing room. The sidebar navigation (260px) provides persistent access to core functionality while the main content area maximizes available space. Grid systems employ consistent gutters and maintain alignment across breakpoints.

### Whitespace Strategy

Whitespace is used deliberately as a design element, not just as empty space. Generous vertical spacing between sections creates visual rhythm and prevents cognitive overload. Horizontal spacing within components follows a consistent scale that creates harmony across the interface. The background color (#F4F7F6) provides subtle warmth that reduces eye strain compared to pure white.

### Depth and Elevation

The elevation system uses subtle shadows and backdrop blur to create hierarchy without visual clutter. Glass morphism effects (backdrop-blur with semi-transparent backgrounds) create modern depth while maintaining content legibility. Shadow values are carefully tuned to provide clear elevation signals without appearing heavy or dated.

## Motion and Animation

### Animation Philosophy

Motion serves functional purposes—guiding attention, communicating state changes, and providing feedback. Animations use smooth easings and moderate durations (300-500ms) that feel natural rather than jarring. The system avoids gratuitous motion; every animation has a clear purpose.

### Key Animations

- **Float animation**: Gentle vertical movement (10-12s duration) for decorative elements
- **Shimmer effect**: Subtle light movement across progress bars and loading states
- **Pulse**: Soft attention-grabbing for live indicators and notifications
- **Hover states**: 300ms transitions with subtle elevation and scale changes
- **Page transitions**: Fade-in with slight upward slide for smooth content loading

### Performance Considerations

Animations use CSS transforms and opacity changes to maintain 60fps performance. Complex animations are hardware-accelerated where possible. The system provides reduced-motion preferences for accessibility.

## Accessibility and Inclusivity

### Color Contrast

All text and interactive elements meet WCAG AA contrast requirements. The primary green provides sufficient contrast against both light and dark backgrounds. Status colors are paired with text labels to ensure colorblind users can understand state information.

### Touch Targets

Interactive elements maintain minimum 44px touch targets for mobile usability. Buttons and cards have generous padding that accommodates various finger sizes and input methods.

### Semantic Structure

The design system supports semantic HTML structure with clear visual hierarchy. Typography scales create logical heading relationships, and component patterns reinforce content relationships through consistent visual treatment.

## Brand Expression

### Logo and Identity

The logo uses a leaf icon combined with the CityResolve wordmark, emphasizing the civic-environmental connection. The leaf icon appears in navigation and branding elements, creating consistent brand recognition. The wordmark uses bold typography with the "Resolve" portion highlighted in the primary green.

### Voice and Tone

The visual design supports a brand voice that is empowering, transparent, and community-focused. The clean, modern aesthetic conveys efficiency and trustworthiness, while the warm color palette and soft shapes approachability and civic pride.

### Photography and Imagery

When imagery is used, it follows the brand's optimistic, community-focused aesthetic. User avatars use circular containers with subtle borders that maintain visual consistency. Category icons use the Lucide icon set with consistent sizing and color treatment.

## Responsive Behavior

### Mobile Adaptation

The design gracefully adapts to mobile contexts through collapsible navigation, stacked layouts, and touch-optimized interactions. The sidebar transforms into a drawer on mobile, and grid layouts collapse to single columns while maintaining content hierarchy.

### Tablet Enhancement

Tablet layouts introduce two-column grids and expanded navigation options while maintaining the mobile-first content hierarchy. Touch targets remain generous, and spacing scales appropriately for the larger screen.

### Desktop Expansion

Desktop layouts maximize horizontal space with multi-column grids, persistent navigation, and expanded content areas. The design maintains visual coherence through consistent spacing and component treatment across all breakpoints.

## Implementation Guidelines

### Component Consistency

All components share common design tokens for spacing, typography, color, and border-radius. This creates visual harmony and makes the system maintainable. Components are designed to be composable, with clear patterns for nesting and combination.

### State Management

Components have clear visual states for default, hover, active, focus, and disabled conditions. Focus states use the primary green with subtle rings to maintain accessibility while providing clear feedback. Loading states use skeleton patterns and subtle animations to communicate progress.

### Error and Feedback

Error states use the functional red color (#EF4444) with clear messaging and actionable next steps. Success states use the primary green with celebratory micro-interactions. Warning states use amber with clear guidance for resolution.

## Design System Evolution

The design system is built to evolve while maintaining consistency. New components should reference existing patterns and tokens before introducing novel approaches. The color palette, typography scale, and spacing system provide foundations that support future growth while maintaining brand coherence.

This design system serves as both a reference and a guide—ensuring that CityResolve continues to deliver a cohesive, accessible, and delightful experience as it grows and evolves.