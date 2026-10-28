import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, GraduationCap, BookOpen, Sparkles, Phone, ShieldCheck, User, LogOut, KeyRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Academic Programs', href: '#programs' },
  { label: 'Course Registration', href: '#registration', highlight: true },
  { label: 'Canadian Dual Degree', href: '#programs' },
  { label: 'Campus Life', href: '#campus-life' },
  { label: 'News & Events', href: '#news' },
]

export default function Header({ onOpenApplyModal, onOpenLoginModal, onOpenAdminPanel }) {
  const { currentUser, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-md shadow-navy-950/5'
          : 'bg-white'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* CIC College Logo / Crest */}
          <a href="/" className="flex items-center gap-3 group" aria-label="CIC Canadian International College Home">
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-cic-red to-cic-red-dark flex items-center justify-center shadow-lg shadow-cic-red/25 group-hover:shadow-cic-red/40 transition-all transform group-hover:scale-105">
              <span className="text-xl">🍁</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg lg:text-xl font-extrabold text-navy-950 leading-tight tracking-tight">
                  CIC
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cic-red/10 text-cic-red uppercase tracking-wider">
                  Egypt
                </span>
              </div>
              <span className="text-[10px] lg:text-[11px] font-semibold text-text-muted tracking-[0.1em] uppercase">
                Canadian International College
              </span>
              <span className="text-[9px] text-text-muted hidden sm:inline">
                New Cairo · Sheikh Zayed · Cape Breton Univ. Partner
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href, highlight }) => (
              <a
                key={label}
                href={href}
                className={`relative px-3.5 py-2 text-sm font-semibold transition-colors duration-200 group ${
                  highlight
                    ? 'text-cic-red hover:text-cic-red-dark bg-cic-red/5 rounded-xl border border-cic-red/20'
                    : 'text-text-secondary hover:text-navy-900'
                }`}
              >
                {label}
                {!highlight && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cic-red rounded-full transition-all duration-300 group-hover:w-3/4" />
                )}
              </a>
            ))}
          </nav>

          {/* User Session & Actions */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              /* Logged In Status */
              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={onOpenAdminPanel}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-800 text-xs font-bold hover:bg-gold-500/20 transition-colors"
                  >
                    <ShieldCheck size={16} className="text-gold-700" />
                    <span className="hidden sm:inline">Registrar Admin Panel</span>
                    <span className="sm:hidden">Admin</span>
                  </button>
                ) : (
                  <a
                    href="#registration"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-50 border border-navy-200 text-navy-900 text-xs font-bold hover:bg-navy-100 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-navy-950 text-white flex items-center justify-center text-[10px] font-bold">
                      {currentUser.name.split(' ')[0][0]}
                    </div>
                    <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-text-muted font-mono hidden md:inline">({currentUser.studentId})</span>
                  </a>
                )}

                <button
                  onClick={logout}
                  title="Sign out"
                  aria-label="Sign out of current account"
                  className="p-2 rounded-xl text-text-muted hover:text-crimson-600 hover:bg-crimson-50 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              /* Portal Login Button */
              <button
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-navy-900 bg-navy-50 hover:bg-navy-100 rounded-xl transition-colors border border-border"
              >
                <KeyRound size={14} className="text-gold-600" />
                <span>Portal Login</span>
              </button>
            )}

            <button
              onClick={onOpenApplyModal}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-cic-red to-cic-red-dark text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-cic-red/25 hover:shadow-cic-red/40 hover:from-cic-red-dark hover:to-cic-red transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Apply Now</span>
              <span className="text-xs">🍁</span>
            </button>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-navy-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={`lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-40 bg-white transform transition-transform duration-300 ease-out border-t border-border overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col p-6 gap-2">
          {currentUser ? (
            <div className="p-4 rounded-2xl bg-navy-50 border border-navy-100 mb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted block">Signed In As</span>
                <span className="font-bold text-sm text-navy-950">{currentUser.name}</span>
                <span className="text-xs text-text-muted block capitalize">{currentUser.role} account</span>
              </div>
              <button
                onClick={() => { logout(); setMobileOpen(false) }}
                className="px-3 py-1.5 rounded-lg bg-crimson-50 text-crimson-700 text-xs font-bold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setMobileOpen(false); onOpenLoginModal() }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-800 text-xs font-bold mb-2"
            >
              <KeyRound size={15} />
              <span>Sign in with Demo Accounts (Admin / Student)</span>
            </button>
          )}

          {NAV_LINKS.map(({ label, href, highlight }) => (
            <a
              key={label}
              href={href}
              className={`px-4 py-3 text-base font-semibold rounded-xl transition-all ${
                highlight
                  ? 'bg-cic-red text-white'
                  : 'text-text-secondary hover:text-navy-900 hover:bg-navy-50'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}

          <hr className="my-3 border-border" />

          <button
            onClick={() => {
              setMobileOpen(false)
              onOpenApplyModal()
            }}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-cic-red to-cic-red-dark text-white text-base font-bold rounded-xl shadow-lg shadow-cic-red/25"
          >
            <span>Apply Now (Online Admission)</span>
            <span>🍁</span>
          </button>

          <a
            href="tel:16242"
            className="flex items-center justify-center gap-2 text-xs font-semibold text-text-muted mt-2"
          >
            <Phone size={13} />
            <span>Admissions Hotline: <strong>16242</strong></span>
          </a>
        </nav>
      </div>
    </header>
  )
}
