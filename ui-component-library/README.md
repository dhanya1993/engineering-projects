# @dhanya/ui-kit

A reusable React component library — extracted from patterns used across production e-learning (web + mobile) and IoT device-fleet platforms. Built to make the same core UI decisions once (spacing, states, validation, empty/offline handling) and reuse them everywhere instead of re-solving them per screen.

**[View the live Storybook →](#)** *(publish with `npm run build-storybook` + deploy `storybook-static/` to Vercel/Netlify/GitHub Pages, then drop the link here)*

## Why this exists

Across every project I've shipped — an e-learning platform, its teacher dashboard, a companion mobile app, and an IoT fleet-management admin console — the same handful of UI problems kept showing up: a header row, a tab switcher, paginated tables, empty/offline states, a confirm-delete modal, a validated form field. This library is those components pulled out into a standalone, documented, testable package, so the design language stays consistent by construction rather than by convention.

## Components

| Component | What it solves |
|---|---|
| `Button` | Single source of truth for interactive styling (variants, sizes, loading state) — every other component composes this. |
| `Header` | App/section header with title, subtitle, and a flexible actions slot. |
| `TabBar` | One data shape, two renderings: underline (web) and pill/segmented (mobile). |
| `Pagination` | Numbered pagination with collapsing ellipses for long result sets. |
| `EmptyState` | Consistent "nothing here yet" treatment with a clear next action. |
| `NetworkBanner` | Offline / reconnecting / restored connectivity banner for offline-first apps. |
| `StatusBadge` | Small status pill (pending/evaluated, online/offline, etc.) with tone mapping. |
| `Modal` | Accessible dialog with focus handling, Escape-to-close, and backdrop click. |
| `FormInput` | Labeled input with a single consistent hint/error validation treatment. |
| `FilterBar` | Combined search + chip filters used above lists and tables. |
| `Card` | Generic content container with optional header/footer rows. |

Every component is documented and interactively demoed in Storybook via its `.stories.tsx` file.

## Getting started

```bash
npm install
npm run dev          # launches Storybook at http://localhost:6006
```

Other scripts:

```bash
npm run build             # bundles the library to dist/ (ESM + CJS + types)
npm run build-storybook   # builds a static Storybook site to storybook-static/
npm run typecheck         # tsc --noEmit
```

## Using it in another project

```bash
npm install @dhanya/ui-kit
```

```tsx
import { Button, Header, EmptyState } from "@dhanya/ui-kit";
import "@dhanya/ui-kit/dist/index.css"; // Tailwind-generated component styles
import "@dhanya/ui-kit/dist/tokens.css"; // design tokens (colors, type, radii)

function App() {
  return (
    <>
      <Header title="Teacher Dashboard" actions={<Button>New assignment</Button>} />
      <EmptyState
        title="No assignments yet"
        description="Create your first assignment to start tracking learner progress."
        action={<Button size="sm">Create assignment</Button>}
      />
    </>
  );
}
```

## Design tokens

All colors, type, radii, and shadows live in `src/styles/tokens.css` as CSS custom properties, mirrored into `tailwind.config.js` for utility-class use inside the library itself. Re-theme the whole kit by editing the token values in one file — no component code changes needed.

## Tech stack

- React 18 + TypeScript (strict mode)
- Tailwind CSS for styling
- Storybook 8 (Vite builder) for documentation and visual QA
- `tsup` for building dual ESM/CJS output with generated `.d.ts` types

## Project structure

```
src/
  components/
    Button/
      Button.tsx
      Button.stories.tsx
      index.ts
    Header/
    TabBar/
    Pagination/
    EmptyState/
    NetworkBanner/
    StatusBadge/
    Modal/
    FormInput/
    FilterBar/
    Card/
  styles/
    tokens.css
  index.ts
.storybook/
  main.ts
  preview.ts
```

Each component folder is self-contained: implementation, stories, and a barrel `index.ts`, so components can be copied individually into another project if a full package install isn't wanted.

## Roadmap

- [ ] Add a React Native variant of `TabBar`, `EmptyState`, and `NetworkBanner` (same props API, native primitives underneath)
- [ ] Add unit tests with React Testing Library
- [ ] Add dark-mode token set
- [ ] Publish to npm under a scoped package name

## Author

**Dhanyashree H P** — Senior Software Engineer (React.js, React Native, Mobile)
[linkedin.com/in/dhanya-chinivar-773b37115](https://linkedin.com/in/dhanya-chinivar-773b37115)
