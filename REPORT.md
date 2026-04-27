# CityResolve — Project Report

**Platform:** Civic Issue Reporting & Resolution Web Application  
**Build Type:** Single-Page Application (SPA)  
**Status:** Frontend Prototype / UI Complete  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Design System](#3-design-system)
4. [Application Architecture](#4-application-architecture)
5. [Routing Structure](#5-routing-structure)
6. [Pages & Features](#6-pages--features)
7. [Component Library](#7-component-library)
8. [Animations & Visual Effects](#8-animations--visual-effects)
9. [File & Folder Structure](#9-file--folder-structure)
10. [Setup & Running the Project](#10-setup--running-the-project)
11. [Future Enhancements](#11-future-enhancements)

---

## 1. Project Overview

CityResolve is a civic-tech web platform that empowers citizens to identify, report, and track urban infrastructure issues in their city. Citizens can report problems like potholes, broken streetlights, water leaks, and garbage overflow directly from their browser or mobile device. Each report is geotagged, categorized, and assigned a severity level, enabling municipal authorities to prioritize and resolve issues efficiently.

The platform also includes a gamification layer: users earn **Civic Points** for reporting issues, upvoting existing reports, and contributing comments. Accumulated points unlock achievement badges and a public leaderboard, increasing community participation.

### Core Goals

| Goal | Description |
|------|-------------|
| **Accessibility** | Any citizen should be able to file a report within 60 seconds |
| **Transparency** | Every report's status (Pending → In Progress → Resolved) is publicly visible |
| **Engagement** | A rewards system motivates repeated civic participation |
| **Situational Awareness** | A live map lets citizens see all active issues in their area |

---

## 2. Tech Stack & Dependencies

### Runtime / Build

| Technology | Version | Role |
|------------|---------|------|
| React | 18.2.0 | UI component library |
| TypeScript | 5.2.2 | Static type checking |
| Vite | 5.2.0 | Dev server & bundler |
| React Router DOM | 6.23.0 | Client-side routing |

### Styling

| Technology | Version | Role |
|------------|---------|------|
| Tailwind CSS | 3.4.3 | Utility-first CSS framework |
| PostCSS | 8.4.38 | CSS transformation pipeline |
| Autoprefixer | — | Cross-browser CSS compatibility |

### UI & Icons

| Technology | Version | Role |
|------------|---------|------|
| Lucide React | 0.378.0 | Consistent SVG icon set |

### Developer Tools

| Tool | Version | Role |
|------|---------|------|
| ESLint | 8.57.0 | Code linting |
| eslint-plugin-react-hooks | — | Hooks rule enforcement |
| eslint-plugin-react-refresh | — | HMR compatibility checks |
| @vitejs/plugin-react | — | React fast-refresh in Vite |

### Scripts

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # TypeScript check + production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint across src/
```

---

## 3. Design System

### Color Palette

The platform uses a custom dark green theme defined in `tailwind.config.mjs`.

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `background` | `#0A0F0A` | Page background (deep near-black with green tint) |
| `surface` | `#0D1F0D` | Card/panel surfaces |
| `primary.green` | `#22C55E` | Primary buttons, active states, highlights |
| `primary.secondary` | `#16A34A` | Hover states, secondary actions |
| `accent.teal` | `#2DD4BF` | Secondary accent, map elements |
| `accent.lime` | `#A3E635` | Tertiary highlights, badges |
| `text.primary` | `#F0FDF4` | Body text |
| `text.secondary` | `#86EFAC` | Subtext, metadata |
| `text.muted` | `rgba(74,222,128,0.5)` | Placeholders, disabled states |
| `status.pending` | `#F59E0B` | Pending/awaiting status |
| `status.progress` | `#3B82F6` | In-progress status |
| `status.resolved` | `#22C55E` | Resolved/complete status |
| `status.rejected` | `#EF4444` | Rejected/invalid reports |

### Typography

| Font | Usage |
|------|-------|
| **Plus Jakarta Sans** | Primary sans-serif — headings and UI labels |
| **Inter** | Body text and interface copy |
| **JetBrains Mono** | Report IDs, code references, mono data |

### Glass-Morphism Utility Classes

Defined in `src/index.css` as reusable Tailwind layer utilities:

```css
.glass-card
  background: rgba(255, 255, 255, 0.04)
  backdrop-filter: blur(24px)
  border: 1px solid rgba(255, 255, 255, 0.07)
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4)

.glass-card-elevated
  background: rgba(255, 255, 255, 0.08)
  backdrop-filter: blur(32px)
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6)

.glass-hover
  on hover: green tint border + translateY(-2px) lift + green glow shadow
```

---

## 4. Application Architecture

### Top-Level Structure

```
App.tsx
├── Route "/"            → <Landing />           (standalone, no layout)
└── Route "/*"           → <Layout />
    ├── <Navbar />       (fixed top bar, 72px)
    ├── <Sidebar />      (fixed left nav, 260px)
    ├── <NotificationDrawer />  (right slide-in panel)
    └── <Outlet />       (page content)
        ├── /dashboard   → <Dashboard />
        ├── /report      → <ReportIssue />
        ├── /issues      → <OpenIssues />
        ├── /map         → <MapPage />
        └── /rewards     → <Rewards />
```

### Layout Component Breakdown

`Layout.tsx` provides the shared shell for all authenticated pages:

- **Navbar** — Fixed top bar (72px). Contains the CityResolve logo, hambuger menu toggle (mobile), notification bell with unread badge, and user profile button.
- **Sidebar** — Fixed left panel (260px on desktop, overlay drawer on mobile). Contains main nav links and a footer area for Settings/Logout.
- **NotificationDrawer** — Off-canvas drawer sliding from the right. Displays recent notifications filterable by type (resolved, pending, in-progress, rejected, info).
- **Main content area** — Has `pt-[72px]` (navbar offset) and `lg:ml-[260px]` (sidebar offset). Contains animated background orbs, a subtle grid overlay, and renders the page via React Router's `<Outlet />`.

---

## 5. Routing Structure

| Route | Component | Layout | Description |
|-------|-----------|--------|-------------|
| `/` | `Landing` | None | Public marketing page |
| `/dashboard` | `Dashboard` | Yes | KPI overview + activity feed |
| `/report` | `ReportIssue` | Yes | 4-step report submission wizard |
| `/issues` | `OpenIssues` | Yes | Issue browser with search & filters |
| `/map` | `MapPage` | Yes | Interactive map with issue pins |
| `/rewards` | `Rewards` | Yes | Civic points, badges, leaderboard |

---

## 6. Pages & Features

### 6.1 Landing Page (`/`)

The public-facing marketing page. No Navbar/Sidebar rendered here.

**Sections:**
- **Floating Navbar** — Logo + nav links + CTA button. Becomes opaque on scroll.
- **Hero Section** — Headline: *"Report City Issues. Get Them Fixed."* with gradient text. Three floating status pills (Pothole Reported, Water Leak Fixed, Streetlight Repaired) with pulse animations. Two CTAs: *Get Started* and *Open Dashboard*.
- **Trust Stats Band** — Three numbers: Issues Resolved (12,400+), Active Cities (48), Avg. Resolution Time (72 hrs).
- **Issue Categories Grid** — 5 category chips (Roads, Water, Lights, Waste, Parks) each showing report count.
- **Features Grid** — 6 feature cards: Live Map Tracking, Instant Notifications, Analytics Dashboard, Verified Reports, Community Points, Fast Resolution.
- **How It Works** — 4-step horizontal flow: Report Issue → Location Tag → Track Progress → Get Resolved. Includes a styled dashboard mockup preview.
- **Testimonials** — Three user testimonials with avatar initials, name, role, and star rating.
- **CTA Banner** — Full-width gradient section: *"Join thousands improving their city."*
- **Footer** — Logo, tagline, copyright.

---

### 6.2 Dashboard (`/dashboard`)

The main app hub for logged-in users.

**Features:**
- **KPI Stats Grid** — 4 `StatCard` components:
  - Total Issues Reported: 2,451 (↑ 12% vs last month)
  - Pending Review: 432 (↑ 8%)
  - In Progress: 89 (↑ 3%)
  - Resolved This Month: 1,204 (↑ 18%)
- **Recent Reports** — 2-column grid of `IssueCard` components showing recent submissions with title, category, location, status badge, upvote count, and comment count.
- **Live Activity Feed** — Real-time event stream with 9 typed events:
  - `resolved` — Issue marked resolved
  - `reported` — New issue submitted
  - `assigned` — Issue assigned to crew
  - `upvoted` — User upvoted a report
  - `commented` — New comment added
  - `escalated` — Report escalated
  - `badge` — Badge earned by user

  Each event shows: avatar (initials), color-coded action badge, action text with highlighted location, timestamp, and a pulsing "new" dot.

---

### 6.3 Report Issue (`/report`)

A 4-step form wizard for submitting a new civic issue.

**Step 1 — Issue Details:**
- Category selection grid (6 cards with Lucide icons):
  - Roads & Infrastructure (`Construction`)
  - Water & Drainage (`Droplets`)
  - Street Lighting (`Lightbulb`)
  - Waste & Sanitation (`Trash2`)
  - Parks & Green Spaces (`Trees`)
  - Other (`HelpCircle`)
- Issue title input
- Severity selector: Low / Medium / High / Critical — each with color configuration
- Description textarea

**Step 2 — Location:**
- Address input field
- Styled map area for location pinning

**Step 3 — Photos:**
- Drag-and-drop upload zone
- Photo preview grid (up to 4 slots)

**Step 4 — Review & Submit:**
- Summary of all entered details
- Final submit button

**Success Screen:**
- Animated green checkmark with concentric ping rings
- Auto-generated report ID (e.g. `CR-2025-4821`)
- "Track Your Report" and "Report Another" CTAs

**Progress Indicator:** Visual step bar at the top showing current step with connector lines.

---

### 6.4 Open Issues (`/issues`)

A browsable list of all submitted reports with advanced filtering.

**Features:**
- **Search bar** — Full-text filter on title and description
- **Category Tabs** — All / Roads / Water / Lights / Waste / Parks / Other
- **Sort Options** — Newest First / Most Upvoted / Most Comments
- **Status Filter** — Dropdown: All / Pending / In Progress / Resolved / Rejected
- **Issue Cards** — Each card shows:
  - Category icon + label (from `CATEGORY_META` map)
  - Severity pill (color-coded)
  - `StatusBadge` component
  - Title, location, time-ago
  - Description excerpt
  - Upvote and comment counts
- **Empty State** — Friendly message when no issues match filters
- **Mock Data** — 8 pre-seeded issues covering all categories and statuses

---

### 6.5 Map Page (`/map`)

A split-panel interactive map showing all geolocated issues.

**Left Sidebar:**
- Category filter dropdown
- Status filter dropdown
- Collapsible legend (status color guide)
- Scrollable list of recent issues

**Map Area (Right):**
- SVG road network overlay (streets, intersections)
- Colored issue pins with pulse ring animations:
  - Color-coded by status (yellow = pending, blue = in progress, green = resolved, red = rejected)
- Hover tooltips showing issue title
- Click-to-select: opens a floating detail card showing title, category, location, status, and upvote count
- Zoom controls (+/−)
- Real-time coordinate display (bottom bar)

**Header Stats Band:**
- Total Issues / Pending / In Progress / Resolved counts

---

### 6.6 Rewards (`/rewards`)

Civic engagement and gamification hub.

**Left Panel:**
- **CivicPointsCard** — Displays current point total (e.g. 9,200 pts), current level (Level 4), and an animated progress bar to the next level.
- **BadgeShelf** — Grid of 6 earned/locked achievement badges with names and icons.

**Right Panel:**
- **Leaderboard Table** — Ranked list of top citizens with:
  - Rank number
  - Username + avatar
  - Points total
  - Issues resolved count
  - Special styling for Top 3 (gold / silver / bronze)
  - Highlighted row for the current user

- **Toggle** — Switch between Monthly and All-Time leaderboard views.

---

## 7. Component Library

### Domain Components (`src/components/domain/`)

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `StatCard` | KPI metric tile with icon and trend indicator | `title`, `value`, `icon`, `iconBgColor`, `trend?` |
| `IssueCard` | Compact issue display card | `id`, `title`, `category`, `location`, `description`, `status`, `upvotes`, `comments`, `timeAgo` |
| `CivicPointsCard` | User points + level progress bar | `points`, `level`, `pointsToNextLevel`, `progressPercent` |
| `BadgeShelf` | Badge grid with earned/locked states | `badges[]` with `id`, `name`, `icon`, `earned` |

### Layout Components (`src/components/layout/`)

| Component | Description |
|-----------|-------------|
| `Navbar` | Fixed top bar: logo, mobile menu toggle, notification bell (with unread count), user avatar button |
| `Sidebar` | Left navigation: 5 main links (Dashboard, Report, Issues, Map, Leaderboard), Settings/Logout footer, mobile overlay mode, active link highlighting via `NavLink` |
| `NotificationDrawer` | Right slide-in panel: notification list filterable by type, unread indicators, timestamps, "Mark all as read" action |

### UI Primitives (`src/components/ui/`)

| Component | Description |
|-----------|-------------|
| `GlassCard` | Reusable glass-morphism wrapper. Props: `elevated` (stronger effect), `hoverEffect` (lift on hover) |
| `StatusBadge` | Inline status chip for issues. Supports `pending`, `inprogress`, `resolved`, `rejected` — each with distinct color and icon |

---

## 8. Animations & Visual Effects

### Keyframe Animations

| Class | Animation | Duration | Effect |
|-------|-----------|----------|--------|
| `.animate-float` | `float` | 10s, infinite | Vertical oscillation: `translateY(0 → -20px → 0)` |
| `.animate-float-delayed` | `float` | 12s, 2s delay | Slower variant for background orbs |
| `animate-spin` (Tailwind) | Rotation | Varies | Loading spinners |
| `animate-pulse` (Tailwind) | Opacity pulse | 2s | Status indicators |
| `animate-ping` (Tailwind) | Scale + fade | 1s | Pin pulse rings on map |

### Background Composition

Each layout page renders two decorative background layers:

1. **Floating orbs** — Two large blurred circle divs (96×96 and 64×64 rem equivalent) positioned top-right and bottom-left. Color: `primary-green` with low opacity. Use `animate-float` and `animate-float-delayed`.
2. **Grid overlay** — Fixed `background-image` using a `linear-gradient` crosshatch pattern at 50×50px spacing, with `rgba(34,197,94,0.03)` opacity.

### Custom Scrollbar (Global)

```css
::-webkit-scrollbar        { width: 4px; height: 4px; }
::-webkit-scrollbar-track  { background: transparent; }
::-webkit-scrollbar-thumb  { background: rgba(34, 197, 94, 0.25); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(34, 197, 94, 0.5); }
```

### Text Effects

```css
.text-glow { text-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
```

---

## 9. File & Folder Structure

```
CityResolve/
│
├── index.html                    # HTML entry point (<title>City Resolve</title>)
├── package.json                  # Dependencies and scripts
├── vite.config.ts                # Vite build configuration
├── tailwind.config.mjs           # Custom Tailwind theme (colors, fonts, animations)
├── postcss.config.mjs            # PostCSS pipeline (Tailwind + Autoprefixer)
├── tsconfig.json                 # TypeScript compiler options
├── tsconfig.node.json            # TypeScript config for Vite/Node context
│
└── src/
    ├── main.tsx                  # ReactDOM.createRoot entry point
    ├── App.tsx                   # Root router (<Routes> configuration)
    ├── Layout.tsx                # Persistent app shell (Navbar + Sidebar + Outlet)
    ├── index.css                 # Global styles, glass utilities, animations, scrollbar
    │
    ├── pages/
    │   ├── Landing.tsx           # Public marketing landing page (/)
    │   ├── Dashboard.tsx         # KPI overview + activity feed (/dashboard)
    │   ├── ReportIssue.tsx       # 4-step report wizard (/report)
    │   ├── OpenIssues.tsx        # Issue browser with search/filter (/issues)
    │   ├── MapPage.tsx           # Interactive split-panel map (/map)
    │   └── Rewards.tsx           # Points, badges, leaderboard (/rewards)
    │
    └── components/
        ├── domain/
        │   ├── StatCard.tsx      # KPI metric tile
        │   ├── IssueCard.tsx     # Compact issue display card
        │   ├── CivicPointsCard.tsx  # User level + points progress
        │   └── BadgeShelf.tsx    # Achievement badge grid
        │
        ├── layout/
        │   ├── Navbar.tsx        # Fixed top navigation bar
        │   ├── Sidebar.tsx       # Fixed left navigation panel
        │   └── NotificationDrawer.tsx  # Right slide-in notification panel
        │
        └── ui/
            ├── GlassCard.tsx     # Glass-morphism card wrapper
            └── StatusBadge.tsx   # Issue status indicator chip
```

---

## 10. Setup & Running the Project

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher (or yarn/pnpm equivalent)

### Installation

```bash
# Clone or navigate to project directory
cd CityResolve

# Install all dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Starts a hot-reload dev server at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Outputs optimised static files to `dist/`. TypeScript is compiled and checked before bundling.

### Preview Production Build

```bash
npm run preview
```

Serves the `dist/` folder locally for pre-deployment testing.

### Lint

```bash
npm run lint
```

Runs ESLint across all `src/` files. Reports any React hooks violations or unused imports.

---

## 11. Future Enhancements

### Backend Integration

| Feature | Notes |
|---------|-------|
| REST / GraphQL API | Replace mock data with live endpoints |
| Authentication | JWT-based login/signup, protected routes |
| Database | PostgreSQL or Firebase for issues, users, points |
| File Uploads | S3 or Cloudinary integration for issue photos |
| Real-time Updates | WebSockets / SSE for live activity feed |

### Feature Roadmap

| Feature | Priority |
|---------|----------|
| Real map integration (Mapbox / Leaflet) | High |
| Push notifications (browser + mobile) | High |
| Issue upvote persistence | Medium |
| Comment threads on issues | Medium |
| Admin/moderator panel | Medium |
| Offline support (PWA) | Low |
| Native mobile app (React Native) | Low |
| Annual civic impact reports | Low |

### Performance & Quality

- Implement code-splitting per route with `React.lazy` + `Suspense`
- Add unit tests (Vitest + React Testing Library)
- E2E tests (Playwright)
- Accessibility audit (WCAG 2.1 AA compliance)
- SEO metadata and Open Graph tags on Landing page
- Error boundary components for graceful failure handling

---

*Report generated for CityResolve Frontend Prototype — All pages and components are client-side only with static/mock data.*
