import { Phone, LogIn, Search, MapPin, Globe, ShieldCheck, UserCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function UtilityBar({ onOpenApplyModal, onOpenLoginModal, onOpenAdminPanel }) {
  const { currentUser } = useAuth()

  return (
    <div className="bg-navy-950 text-white/80 text-xs border-b border-navy-900" role="navigation" aria-label="Utility navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
        {/* Left: Campuses & Hotline */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gold-400 font-semibold">
            <Phone size={12} />
            <span>Hotline: <strong className="text-white">16242</strong></span>
          </div>
          <span className="text-white/20 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-white/70">
            <MapPin size={12} className="text-cic-red" />
            <span>New Cairo & Sheikh Zayed Campuses (Egypt)</span>
          </div>
        </div>

        {/* Right side links */}
        <div className="flex items-center gap-4 text-[11px] sm:text-xs">
          {currentUser ? (
            currentUser.role === 'admin' ? (
              <button
                onClick={onOpenAdminPanel}
                className="text-gold-400 hover:text-white font-bold transition-colors flex items-center gap-1"
              >
                <ShieldCheck size={13} />
                <span>Registrar Admin Control</span>
              </button>
            ) : (
              <a
                href="#registration"
                className="text-emerald-400 hover:text-white font-semibold transition-colors flex items-center gap-1"
              >
                <UserCheck size={13} />
                <span>My Student Portal ({currentUser.name.split(' ')[0]})</span>
              </a>
            )
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="text-white/90 hover:text-gold-400 font-semibold transition-colors flex items-center gap-1"
            >
              <LogIn size={12} />
              <span>Campus Portal Login</span>
            </button>
          )}

          <span className="text-white/20">|</span>
          <button
            onClick={onOpenApplyModal}
            className="text-gold-400 hover:text-white font-semibold transition-colors"
          >
            Admissions 2026/27
          </button>
          <span className="text-white/20 hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <Globe size={12} />
            <span>العربية (Egypt)</span>
          </span>
        </div>
      </div>
    </div>
  )
}
