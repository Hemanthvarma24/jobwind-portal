# JobFlow — Premium Job Portal

Jobwind is a high-performance, aesthetically driven job portal built with Next.js 15, Tailwind CSS 4, and Framer Motion. It features a fully dynamic API-driven architecture, elite responsive design, and a seamless user experience.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 (OKLCH Color System)
- **Icons**: Lucide React
- **Animations**: Framer Motion 12
- **Typography**: Geist Sans & Geist Mono
- **Data Source**: jsonfakery.com (Public API)

## Setup Instructions

First, install the dependencies using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


## Architectural Decisions

### Centralized API Layer

All data fetching and transformation logic is encapsulated within `lib/api.ts`. This layer implements a custom caching utility to minimize redundant network requests and provides standardized helper functions (e.g., salary formatting, qualification parsing) used across the application.

### Dynamic Filter Derivation

Unlike traditional portals with hardcoded filters, JobFlow extracts unique categories, employment types, and locations directly from the job inventory. This "zero-maintenance" approach ensures that the UI always reflects the current state of the backend data without manual updates.

### Performance-First Client Logic

Heavy filtering and sorting operations are offloaded to React's `useMemo` hook. This provides an instantaneous, "no-refresh" experience for users while keeping the main thread responsive, even with large datasets.

### Design System (Tailwind 4)

The application utilizes Tailwind 4's advanced `@theme` block and OKLCH color space. This allows for mathematically precise color scales that maintain consistent perceptual brightness across light and dark modes, reducing eye strain and improving overall premium feel.

### Component Portability

Components like `JobCard` and `JobFilters` are built using a pattern that decouples data fetching from presentation. This makes the UI highly reusable and easier to test or migrate to different data providers in the future.

## Build & Deploy

To create a production build:

```bash
npm run build
npm run start
```





