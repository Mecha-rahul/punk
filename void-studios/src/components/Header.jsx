import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Logo from './Logo'
import SearchOverlay from './SearchOverlay'
import {
  SearchIcon, UserIcon, HeartIcon, BagIcon, MenuIcon, CloseIcon, ChevronDownIcon,
} from './Icons'
import { NAV_LINKS } from '../content/content'
import { useStore } from '../context/StoreContext'

const iconBtn =
  'relative inline-flex h-10 w-10 items-center justify-center text-ink transition-opacity hover:opacity-60'

function CountBadge({ count }) {
  if (!count) return null
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[9px] font-bold leading-none text-white">
      {count}
    </span>
  )
}

export default function Header() {
  const { user, cartCount, wishlist, setCartOpen } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null) // mobile accordion: which dropdown is expanded
  const navigate = useNavigate()
  const headerRef = useRef(null)

  // close overlays on navigation
  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setOpenGroup(null)
  }, [navigate])

  // lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header ref={headerRef} className="sticky top-0 z-50">
      <AnnouncementBar />

      {/* ---- main bar ---- */}
      <div className="border-b border-line-soft bg-bg-primary">
        <div className="ak-shell flex h-16 items-center justify-between gap-4">
          {/* LEFT: desktop nav / hamburger */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((item) =>
                item.children ? (
                  <li key={item.label} className="group relative">
                    <button
                      type="button"
                      className="flex items-center gap-1 py-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors group-hover:text-accent"
                    >
                      {item.label}
                      <ChevronDownIcon size={13} className="transition-transform group-hover:rotate-180" />
                    </button>
                    {/* dropdown panel */}
                    <div className="invisible absolute left-0 top-full z-50 w-56 border border-line-soft bg-bg-primary opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
                      <ul className="py-2">
                        {item.children.map((child) => (
                          <li key={child.to}>
                            <Link
                              to={child.to}
                              className="block px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink hover:bg-bg-secondary hover:underline hover:decoration-accent hover:underline-offset-4"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:text-accent ${
                          item.accent
                            ? 'text-accent'
                            : isActive
                              ? 'underline decoration-accent underline-offset-8'
                              : 'text-ink'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <button
            type="button"
            className={iconBtn + ' lg:hidden'}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

          {/* CENTER: wordmark */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Logo />
          </div>

          {/* RIGHT: icon group */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button type="button" className={iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search">
              <SearchIcon />
            </button>
            <Link
              to={user ? '/account' : '/login'}
              className={iconBtn}
              aria-label={user ? 'Account' : 'Login'}
              title={user ? `Hi, ${user.name}` : 'Login'}
            >
              <UserIcon />
            </Link>
            <Link to="/wishlist" className={iconBtn} aria-label="Wishlist">
              <HeartIcon />
              <CountBadge count={wishlist.length} />
            </Link>
            <button type="button" className={iconBtn} onClick={() => setCartOpen(true)} aria-label="Bag">
              <BagIcon />
              <CountBadge count={cartCount} />
            </button>
          </div>
        </div>
      </div>

      {/* ---- mobile drawer ---- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-bg-primary shadow-2xl">
            <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
              <Logo />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-1">
                <CloseIcon />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="divide-y divide-line-soft">
                {NAV_LINKS.map((item) =>
                  item.children ? (
                    <li key={item.label} className="py-1">
                      <button
                        type="button"
                        onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                        className="flex w-full items-center justify-between py-3 text-[12px] font-semibold uppercase tracking-[0.2em]"
                        aria-expanded={openGroup === item.label}
                      >
                        {item.label}
                        <ChevronDownIcon
                          size={15}
                          className={`transition-transform ${openGroup === item.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openGroup === item.label && (
                        <ul className="pb-3 pl-3">
                          {item.children.map((child) => (
                            <li key={child.to}>
                              <Link
                                to={child.to}
                                className="block py-2 text-[12px] uppercase tracking-[0.14em] text-ink-soft"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={item.label} className="py-1">
                      <Link
                        to={item.to}
                        className={`block py-3 text-[12px] font-semibold uppercase tracking-[0.2em] ${
                          item.accent ? 'text-accent' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div className="border-t border-line-soft px-5 py-4 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              {user ? (
                <Link to="/account" className="block py-1">
                  Hi, {user.name} — Account
                </Link>
              ) : (
                <div className="flex gap-5">
                  <Link to="/login" className="py-1">Sign In</Link>
                  <Link to="/register" className="py-1">Create Account</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
