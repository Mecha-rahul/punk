/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        nav: '920px', // full nav row fits from here up (compact spacing below lg)
        lg: '1024px',
        xl: '1280px',
      },
      colors: {
        // Palette is mirrored from CSS variables in src/index.css — keep both in sync.
        // ── Earth palette roles ────────────────────────────────────────────
        // base (cream, ~60%): page bg, cards, default sections
        'bg-primary': '#F5EFE3',
        // secondary (tan, ~25%): alt sections, borders, inputs, dividers
        'bg-secondary': '#D8C9A8',
        'bg-alt': '#D8C9A8',
        // primary (olive, ~10-15%): headings, nav text, buttons, footer bg
        olive: {
          DEFAULT: '#4F5B2A',
          deep: '#3E4822', // WCAG: olive as text on tan (4.18:1 fails for DEFAULT)
          darkest: '#2F3619', // deepest — scrims/text over tan surfaces
        },
        // highlight (mustard, ~5%): sale badges, new tags, active states ONLY.
        // NEVER olive-text-on-mustard or mustard-text-on-olive (value clash).
        highlight: {
          DEFAULT: '#B8892D',
          deep: '#8A6318', // WCAG: gold as TEXT on cream (DEFAULT is 2.76:1 — decorative only)
        },
        // ── Semantic aliases (historic names, now earth-mapped) ───────────
        ink: '#3E4822', // deep olive — the "text ink" of the palette
        'ink-soft': '#55492F', // warm umber ≥4.5:1 on cream AND tan — safe body text everywhere
        accent: '#8A6318', // sale price/error text — gold deep
        graphite: '#2F3619', // deepest olive, kept as alias
        'line-soft': '#C3B48F',
        // one-off decorative tint (mega-menu arrow on light headers) — not for text
      },
      fontFamily: {
        // Wordmark font — swap here (and in index.css) when the final logo font arrives.
        wordmark: ['Anton', 'Archivo Black', 'Impact', 'sans-serif'],
        body: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '80rem',
      },
    },
  },
  plugins: [],
}
