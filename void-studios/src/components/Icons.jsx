// Minimal inline icon set — stroke follows currentColor.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Svg = ({ children, size = 20, viewBox = '0 0 24 24', ...rest }) => (
  <svg width={size} height={size} viewBox={viewBox} aria-hidden="true" {...base} {...rest}>
    {children}
  </svg>
)

export const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
)

export const UserIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c1.2-3.2 3.9-5 7-5s5.8 1.8 7 5" />
  </Svg>
)

export const HeartIcon = ({ filled, ...p }) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7.5-4.6-9.3-9.2C1.5 7.6 3.6 4.5 6.9 4.5c2 0 3.7 1.1 5.1 3 1.4-1.9 3-3 5.1-3 3.3 0 5.4 3.1 4.2 6.3C19.5 15.4 12 20 12 20Z" />
  </Svg>
)

export const BagIcon = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </Svg>
)

export const MenuIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
)

export const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)

export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" />
  </Svg>
)

export const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const MinusIcon = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
)

export const ChevronDownIcon = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)

export const ChevronLeftIcon = (p) => (
  <Svg {...p}>
    <path d="m14 6-6 6 6 6" />
  </Svg>
)

export const ChevronRightIcon = (p) => (
  <Svg {...p}>
    <path d="m10 6 6 6-6 6" />
  </Svg>
)

export const ArrowLeftIcon = (p) => (
  <Svg {...p}>
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
  </Svg>
)

export const ArrowRightIcon = (p) => (
  <Svg {...p}>
    <path d="M5 12h14m0 0-6-6m6 6-6 6" />
  </Svg>
)

export const InstagramIcon = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="17" cy="7" r="0.5" fill="currentColor" />
  </Svg>
)

export const PinterestIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.5 20c.8-2.4 1.6-5.6 1.9-7M11 10.5c-.6-1.9 3-2.7 3.4-.4.4 2.3-1.6 4.4-3.2 3.9" />
  </Svg>
)

export const WhatsAppIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 19.5 6 16a7.5 7.5 0 1 1 3 2.6l-4.5.9Z" />
    <path d="M9.5 9.8c.5 2.6 2.1 4.2 4.7 4.7" />
  </Svg>
)
