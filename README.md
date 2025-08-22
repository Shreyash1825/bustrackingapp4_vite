# Converted to React + Vite (JSX)

This project was converted from Next.js to **React + Vite + JSX**.

## Scripts
- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run preview` — preview production build

## Notes
- Next.js APIs (`next/link`, `next/image`, `next/navigation`, `next/head`) are replaced with lightweight shims under `src/_compat/`.
- Files were converted from TS/TSX to JS/JSX using a naive pass; please review any remaining type-specific code.
- Routes were generated from `app/**/page.tsx` into React Router `<Route>`s.