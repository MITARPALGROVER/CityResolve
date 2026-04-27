# CityResolve
### Project Documentation

---

|  |  |
|--|--|
| **Project Name** | CityResolve |
| **Type** | Civic Issue Reporting & Resolution Platform |
| **Platform** | Web Application |
| **Version** | 1.0.0 |
| **Date** | March 2026 |

---

## Abstract

CityResolve is a web-based civic platform designed to bridge the communication gap between citizens and municipal authorities regarding urban infrastructure problems. The platform allows residents to report issues such as potholes, broken streetlights, water leaks, and waste management problems through an intuitive multi-step form. Each submission is geotagged, categorized, and assigned a severity level, enabling city officials to prioritize and act on issues efficiently. Citizens can monitor the real-time status of their reports, interact with the community through upvotes and comments, and earn rewards for their civic contributions. The goal of CityResolve is to make cities more responsive, transparent, and community-driven through technology.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Project Overview](#4-project-overview)
5. [Key Features](#5-key-features)
6. [Technology Stack](#6-technology-stack)
7. [System Architecture](#7-system-architecture)
8. [System Workflow](#8-system-workflow)
9. [Module Descriptions](#9-module-descriptions)
10. [User Interface Walkthrough](#10-user-interface-walkthrough)
11. [Conclusion](#11-conclusion)
12. [Future Scope](#12-future-scope)

---

## 1. Introduction

Urban infrastructure is the backbone of any functional city. Roads, drainage systems, street lighting, public parks, and waste management facilities are used by millions of people every day. When these systems fail or deteriorate, the quality of life for citizens declines significantly. A pothole left unattended for weeks can damage vehicles, cause accidents, and signal a broader breakdown in civic governance. A broken streetlight in a residential area becomes a safety hazard. Overflowing garbage bins create health concerns for the entire neighbourhood.

Despite these realities, the mechanism through which citizens can report such issues has traditionally been slow, inconvenient, and opaque. Phone hotlines, physical complaint offices, and basic web forms have been the standard tools — none of which offer citizens any real-time visibility into whether their complaint was received, assigned, or acting upon.

CityResolve addresses this gap by providing a modern, accessible, and transparent digital platform. Through CityResolve, any citizen can report an infrastructure issue in under a minute, track its resolution journey, engage with fellow residents, and be rewarded for their contribution to improving the city. The platform is designed not just as a tool for reporting problems, but as a community-driven system that encourages long-term civic participation.

---

## 2. Problem Statement

The relationship between citizens and city administration around infrastructure maintenance is characterised by three core failures:

**Lack of Accessible Reporting Channels**
Most cities either lack a unified platform for reporting issues or rely on outdated methods such as phone hotlines and email addresses. These channels are inaccessible to a large segment of the population, especially younger, mobile-first citizens. The process is often tedious, unclear, and discouraging.

**No Transparency After Reporting**
When a citizen does manage to file a complaint, there is typically no follow-up. They receive no confirmation, no status updates, and no estimated timeline for resolution. This creates frustration and erodes trust in civic institutions. Citizens feel unheard, and many stop reporting altogether.

**Inefficient Prioritisation by Authorities**
Without a structured digital system, municipal departments rely on manual tracking, phone logs, or fragmented spreadsheets. There is no way to visualise the density of issues across the city, identify recurring problem areas, or prioritise based on severity or public impact. This leads to delayed responses and poor allocation of maintenance resources.

**Low Civic Participation**
Because reporting feels futile and unrewarding, overall civic participation remains low. Issues that affect entire neighbourhoods go unreported because individual citizens assume someone else will handle it, or because the effort-to-outcome ratio feels too unfavourable.

CityResolve is built to solve all four of these problems: by making reporting easy, providing full transparency, enabling smarter prioritisation, and incentivising participation through a rewards system.

---

## 3. Project Objectives

The following objectives guided the design and development of CityResolve:

1. **Simplify Reporting** — Provide a clean, fast, step-by-step form that any citizen can complete in under 60 seconds, without need for registration training or technical knowledge.

2. **Enable Real-Time Tracking** — Allow citizens to see the status of every report (Pending, In Progress, Resolved, Rejected) with clear visual indicators and timeline updates.

3. **Improve Geographic Awareness** — Visualise all active issues on an interactive city map so both citizens and administrators can understand the spatial distribution of problems.

4. **Encourage Civic Engagement** — Use gamification mechanics (Civic Points, badges, leaderboard) to reward users for their contributions and build a habit of participation.

5. **Provide Administrative Oversight** — Give a dashboard with key performance indicators that shows the volume, distribution, and resolution rate of reported issues across the city.

6. **Build for Accessibility** — Ensure the platform is responsive across devices, visually clear, and easy to navigate for users of all technical backgrounds.

---

## 4. Project Overview

CityResolve is a frontend web application built as a Single-Page Application (SPA) using the React framework. The platform is structured as a public-facing marketing site combined with a full-featured citizen dashboard.

**Public Section:** Citizens who visit the site land on a professional marketing page that explains the platform, showcases features, and provides clear calls-to-action to get started.

**Citizen Dashboard:** Once inside the app, users have access to six core modules:

| Module | Path | Purpose |
|--------|------|---------|
| Dashboard | `/dashboard` | Overview of stats, recent reports, and live activity feed |
| Report Issue | `/report` | Submit a new civic issue through a guided 4-step form |
| Open Issues | `/issues` | Browse, search, and filter all submitted reports |
| Map View | `/map` | Interactive map showing all geotagged issues across the city |
| Rewards | `/rewards` | View Civic Points, earned badges, and the city leaderboard |
| Landing Page | `/` | Public marketing and onboarding page |

The platform uses a persistent layout shell (top navigation bar + left sidebar) that gives users consistent access to all sections of the app. A notification drawer can be opened from the top bar to review recent updates on followed issues.

---

## 5. Key Features

### 5.1 Four-Step Issue Reporting Wizard

The report submission process is broken into four clearly defined steps, reducing cognitive load and improving completion rates:

- **Step 1 — Issue Details:** The user selects an issue category (Roads, Water, Lights, Waste, Parks, Other), writes a brief title, chooses a severity level (Low, Medium, High, Critical), and provides a description.
- **Step 2 — Location:** The user enters the address and pins the issue location on the map.
- **Step 3 — Photos:** The user can upload up to four photographs of the issue to provide visual context.
- **Step 4 — Review & Submit:** A summary of all provided information is shown before final submission. On successful submission, a unique Report ID (e.g. `CR-2026-4821`) is generated for tracking.

### 5.2 Live Interactive Map

The Map page offers a full split-panel view of all reported issues across the city. Issue pins are colour-coded by status (yellow for pending, blue for in progress, green for resolved, red for rejected). Clicking any pin brings up a detail card. The map supports category and status filtering, zoom controls, and shows coordinate information in real time.

### 5.3 Issue Browser with Advanced Filtering

The Open Issues page lets citizens explore all submitted reports. Users can filter by category, status, and severity, sort by newest, most upvoted, or most commented, and use a live search bar to find specific issues. Each issue card clearly displays all relevant details at a glance.

### 5.4 Real-Time Activity Feed

The Dashboard includes a live activity feed that shows recent events across the platform — new reports, resolved issues, assignments, user comments, upvotes, escalations, and badge awards. This creates a sense of a living, active community platform.

### 5.5 Civic Points and Rewards System

To encourage sustained participation, CityResolve includes a gamified reward system. Citizens earn Civic Points for submitting reports, upvoting issues, and engaging with the community. Points contribute to the user's level and unlock achievement badges. A leaderboard shows the top contributors for the current month and all time.

### 5.6 Notification System

A sliding notification drawer in the top bar aggregates all updates relevant to the user — status changes on their reports, community interactions, and badge awards. Notifications can be filtered by type and marked as read.

### 5.7 Responsive and Accessible Design

The platform is fully responsive. The sidebar collapses on smaller screens and is replaced with a mobile-friendly overlay menu. All typography, spacing, and colour choices meet readability standards across different screen sizes and devices.

---

## 6. Technology Stack

CityResolve is built using a modern, component-based frontend technology stack.

### Frontend Framework

**React 18** was chosen as the primary UI library due to its component reusability, large ecosystem, and excellent developer tooling. React's declarative model makes it straightforward to build complex interactive pages such as the multi-step form wizard and the interactive map view.

**TypeScript** adds static type checking on top of JavaScript, catching errors at development time rather than at runtime. This is particularly valuable when handling structured data such as issue objects, user profiles, and notification types across multiple components.

### Build Tooling

**Vite** serves as the build tool and development server. It offers near-instant startup times and fast Hot Module Replacement (HMR), which significantly improves the development experience compared to older bundlers.

### Routing

**React Router DOM v6** handles all client-side navigation. The app uses a nested route structure, allowing the Layout shell (Navbar + Sidebar) to persist across all authenticated pages while swapping only the main content area.

### Styling

**Tailwind CSS** provides a utility-first approach to styling, with a fully customised theme that defines the platform's dark green colour palette, typography scale, and spacing system. Custom CSS utilities for glass-morphism effects, animations, and scrollbar styling are defined globally in `index.css`.

### Icons

**Lucide React** provides a comprehensive set of clean, consistent SVG icons used throughout the platform — in category selectors, navigation menus, status badges, and feature cards.

---

## 7. System Architecture

CityResolve follows a component-based architecture structured in three primary layers:

### Routing Layer

React Router DOM defines the top-level route structure. The root `/` route renders the standalone Landing page with no shared layout. All other routes (`/dashboard`, `/report`, `/issues`, `/map`, `/rewards`) are wrapped inside the Layout component, which provides the persistent Navbar, Sidebar, and Notification Drawer.

### Layout Layer

The Layout component acts as the app shell. It renders:
- A fixed **Navbar** at the top (containing the brand logo, mobile menu toggle, notification bell, and user avatar)
- A fixed **Sidebar** on the left (containing navigation links to all main sections)
- A **Notification Drawer** that slides in from the right
- A main content area where page components are rendered via React Router's `<Outlet>`

The main content area includes two purely decorative background layers: animated floating orbs and a faint grid overlay, creating depth without visual clutter.

### Page and Component Layer

Each route renders a self-contained page component. Pages are composed of smaller reusable components stored in three sub-directories:

- **`domain/`** — Components that represent core business concepts (StatCard, IssueCard, CivicPointsCard, BadgeShelf)
- **`layout/`** — Components that form the app shell (Navbar, Sidebar, NotificationDrawer)
- **`ui/`** — Generic, style-only interface primitives (GlassCard wrapper, StatusBadge)

---

## 8. System Workflow

### Issue Reporting Flow

```
Citizen visits CityResolve
        │
        ▼
Clicks "Report an Issue"
        │
        ▼
Step 1: Selects Category + Severity + Writes Description
        │
        ▼
Step 2: Pins Location on Map
        │
        ▼
Step 3: Uploads Photos (optional)
        │
        ▼
Step 4: Reviews All Details
        │
        ▼
Submits Report → Report ID Generated (e.g. CR-2026-4821)
        │
        ├──▶ Report appears on Open Issues page
        ├──▶ Pin added to Map with PENDING status
        └──▶ Activity Feed shows "New report submitted"
```

### Issue Resolution Lifecycle

```
Status: PENDING
    │
    ▼ (Authority reviews)
Status: IN PROGRESS  ──────────────────────────────────┐
    │                                                   │
    ▼ (Work completed)                   ▼ (Invalid or duplicate)
Status: RESOLVED ✓                   Status: REJECTED ✗
    │
    ▼
Reporter earns Civic Points
    │
    ▼
Notification sent to reporter
    │
    ▼
Activity Feed updated
```

### Community Engagement Flow

At any stage in the issue lifecycle, other citizens can:
- **Upvote** the report to signal that it affects them too (increases priority visibility)
- **Comment** to provide additional context or updates
- **Follow** an issue to receive notifications on status changes

Every interaction earns the participating citizen Civic Points, which accumulate towards badges and leaderboard ranking.

---

## 9. Module Descriptions

### Landing Page

The public entry point of CityResolve. It is designed to communicate the platform's purpose clearly and convert visitors into active users. It contains a hero section with the platform headline and call-to-action buttons, a breakdown of issue categories, a six-feature showcase, a visual "How It Works" flow, user testimonials, and a footer.

### Dashboard

The central hub of the citizen experience. It displays four key performance indicators at a glance: total reports, pending reports, in-progress reports, and resolved reports this month. Below the stats, a grid of recent issue cards gives users a quick snapshot of the most recent activity. The right side of the screen shows the live activity feed, streaming platform events in real time.

### Report Issue

A guided four-step form wizard. It is designed to reduce friction at every step — each screen asks only what is needed and provides clear visual feedback on progress. Issue categories are presented as large clickable icon cards rather than a dropdown, making selection faster and more intuitive. Severity is chosen from a colour-coded row of options. After submission, a full-screen success state shows the report ID and options to track the report or submit another.

### Open Issues

A comprehensive browser for all submitted reports. The page opens with a category tab bar across the top, followed by a search bar and sort/filter controls. Issues are displayed as cards in a clean grid. Each card shows the issue's category, title, location, time of submission, severity, status, and community engagement metrics (upvotes and comments). If no issues match the active filters, an empty state message is shown.

### Map Page

A split-panel interactive map view. The left panel contains filter controls (by category and status) and a scrollable list of nearby issues. The right panel renders the city map with SVG road overlays and coloured issue pins. Pins animate with a pulsing ring to draw attention. Clicking a pin opens a detail card anchored near the pin. The map header displays an aggregated count across all statuses.

### Rewards

The gamification hub. The left column shows the user's current Civic Points total, their level, and a progress bar to the next level, alongside a grid of earned and locked achievement badges. The right column displays the community leaderboard with rank, username, total points, and issues resolved. The top three positions are highlighted with gold, silver, and bronze styling. A tab toggle switches between Monthly and All-Time views.

---

## 10. User Interface Walkthrough

### Design Language

CityResolve uses a dark green visual identity that communicates civic authority, environmental responsibility, and modern professionalism. The primary background is a near-black tone with a subtle green tint. Cards and panels use glass-morphism — a semi-transparent frosted-glass effect with a soft backdrop blur — creating a layered, atmospheric feel.

### Color System

The interface uses a carefully restricted colour palette:
- **Primary Green (`#22C55E`)** — Used for active states, confirmed actions, positive indicators, and primary buttons
- **Teal (`#2DD4BF`)** — Used for secondary accents and interactive map elements
- **Amber (`#F59E0B`)** — Pending status indicators
- **Blue (`#3B82F6`)** — In-progress status indicators
- **Red (`#EF4444`)** — Rejected or error states

### Typography

Three typefaces are used with clear hierarchy:
- **Plus Jakarta Sans** for headings and labels
- **Inter** for body text and descriptions
- **JetBrains Mono** for report IDs, codes, and data fields

### Animations

Subtle animations throughout the interface reinforce status and draw attention without being distracting. Background orbs float slowly, map pins pulse with concentric rings, success states use animated checkmarks, and status indicators use smooth transitions.

---

## 11. Conclusion

CityResolve demonstrates how a well-designed digital platform can meaningfully improve the relationship between citizens and their city. By making the reporting process fast and accessible, providing complete transparency through status tracking, visualising issues geographically, and incentivising participation through rewards, the platform addresses the core failures in traditional civic complaint systems.

The platform was designed with real-world usability in mind — clean navigation, clear visual hierarchy, and minimal friction at every step. The codebase is structured to be scalable and maintainable, with clear separation between routing, layout, page, and component layers.

CityResolve presents a strong foundation for a production-ready civic-tech platform. With backend integration, real map data, user authentication, and push notifications, it has the potential to serve as a genuine tool for improving urban life in any modern city.

---

## 12. Future Scope

### Short-Term Enhancements

| Enhancement | Description |
|-------------|-------------|
| User Authentication | Login and registration with JWT-based secure sessions |
| Live Backend API | Replace mock data with a real REST or GraphQL backend |
| Database Integration | Persistent storage for issues, users, and points |
| Real Map Integration | Replace SVG mockup with Mapbox or Leaflet for live geo-data |
| Photo Uploads | Cloud storage integration (AWS S3 or Cloudinary) for issue photos |

### Medium-Term Enhancements

| Enhancement | Description |
|-------------|-------------|
| Push Notifications | Browser and mobile notifications for issue status changes |
| Comment Threads | Full threaded comment system on each issue report |
| Admin Panel | Dedicated interface for municipal admins to manage and resolve reports |
| Issue Clustering | Automatic detection and grouping of duplicate or nearby reports |
| Analytics Reports | Monthly civic impact summaries for both citizens and administrators |

### Long-Term Vision

| Enhancement | Description |
|-------------|-------------|
| Progressive Web App (PWA) | Offline support and installable mobile experience |
| Native Mobile Application | React Native application for iOS and Android |
| Multi-City Support | Platform scaled to support multiple municipalities under one system |
| AI-Assisted Categorisation | Automatic category and severity suggestion based on photo or description input |
| Open Data API | Public API for researchers and developers to access non-personal issue data |

---

*CityResolve — Connecting citizens. Resolving cities.*
