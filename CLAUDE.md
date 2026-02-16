# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start development server (Next.js with Turbopack)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint (flat config, ESLint 9)

## Tech Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript 5**
- **Tailwind CSS 4** — configured via `@import "tailwindcss"` and `@theme inline` in `app/globals.css` (no separate tailwind.config file)
- **Motion 12** (`motion/react`) — animation library
- **Fonts**: Geist Sans + Geist Mono via `next/font/google`

## Architecture

**App Router structure** — all pages under `app/`, components under `components/main/`.

- `app/page.tsx` — Server component, renders the Hero landing page
- `app/search/page.tsx` — Server component with async `searchParams`, handles `/search?q=` queries
- `components/main/` — Client components (`"use client"`) for interactive UI (Hero, SearchBar, FreshIcon)

**Client/server boundary**: Page files (`app/**/page.tsx`) are server components. Interactive components in `components/main/` use the `"use client"` directive and are imported into server pages.

## Styling

Custom color tokens defined in `app/globals.css` under `@theme inline`:
- `fresh-50` through `fresh-700` — green palette (brand primary)
- `warm-100` through `warm-500` — orange palette (accents, CTA)
- `neutral-50` through `neutral-800` — stone-based neutrals

Light mode only. Use these tokens as Tailwind classes (e.g., `bg-fresh-500`, `text-warm-400`).

Path alias: `@/*` maps to project root (e.g., `import Hero from "@/components/main/Hero"`).

## Language

All user-facing text is in **Korean**. HTML lang is set to `"ko"`.
