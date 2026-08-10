# Culture Peptides

Premium storefront for **Culture Peptides** (Culture Peps) — research-grade
peptides, verified to the molecule. Built as a fast, animated single-page site
with a lab-terminal aesthetic in red / black / grey / white.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (custom `culture` red palette + Space Grotesk / Inter / JetBrains Mono)
- **Framer Motion** (scroll-linked hero, reveal animations, command-palette search)

## Develop

```bash
npm install
npm run dev      # http://localhost:5185
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview
```

## Deploy

Zero-config for both hosts:

| Host | Build command | Output dir |
| --- | --- | --- |
| **Vercel** | `npm run build` (auto-detected) | `dist` |
| **Cloudflare Pages** | `npm run build` | `dist` |

Import this repo in the Vercel or Cloudflare Pages dashboard and it deploys on
every push.

## Features

- Scroll-reactive hero with an animated molecular lattice + amino-acid sequence readout
- ⌘K lab-terminal command-palette search with live filtering across 18 compounds
- Category-filtered catalog with per-product spec cards (sequence, MW, purity, CAS)
- Certificate-of-analysis verification panel with the peptide backbone signature
- Full compliance framing — "Research use only" throughout, disclaimer in footer

> **Compliance:** All products are presented strictly for in-vitro laboratory
> research use only — not for human or veterinary use.
