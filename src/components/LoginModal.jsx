import { useState } from 'react'
import { X, ShieldCheck, UserCheck, KeyRound, LogIn, Sparkles, Building, BookOpen, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ isOpen, onClose, onOpenAdminPanel, onOpenRegistration }) {
  const { login, loginAsDemo } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('demo') // 'demo' | 'manual'

  if (!isOpen) return null

  const handleManualSubmit = (e) => {
    e.preventDefault()
    setError('')
    const result = login(identifier, password)
    if (result.success) {
      onClose()
      if (result.user.role === 'admin' && onOpenAdminPanel) {
        onOpenAdminPanel()
      } else if (result.user.role === 'student' && onOpenRegistration) {
        onOpenRegistration()
      }
    } else {
      setError(result.message)
    }
  }

  const handleQuickDemo = (roleKey) => {
    loginAsDemo(roleKey)
    onClose()
    if (roleKey === 'admin' && onOpenAdminPanel) {
      onOpenAdminPanel()
    } else if (onOpenRegistration) {
      onOpenRegistration()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-up">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full border border-border shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cic-red flex items-center justify-center font-bold text-white shadow-md text-lg">
                🍁
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold block">
                  CIC Unified Authentication Portal
                </span>
                <h2 id="login-modal-title" className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Sign in to CIC Egypt
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close login modal"
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="mt-5 grid grid-cols-2 bg-navy-900/80 p-1 rounded-xl text-xs font-semibold border border-white/10">
            <button
              onClick={() => setActiveTab('demo')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'demo'
                  ? 'bg-cic-red text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              ⚡ 1-Click Demo Accounts
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'manual'
                  ? 'bg-white text-navy-950 shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Manual Credentials
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'demo' ? (
            /* 1-Click Demo Accounts */
            <div className="space-y-3.5">
              <p className="text-xs text-text-secondary">
                Select an authorized account role below to immediately test the platform features:
              </p>

              {/* Admin / Registrar Card */}
              <button
                onClick={() => handleQuickDemo('admin')}
                className="w-full group p-4 rounded-2xl border-2 border-navy-900/10 hover:border-navy-900 bg-navy-50/50 hover:bg-navy-50 text-left transition-all duration-200 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <ShieldCheck size={22} />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-navy-950">University Registrar / Admin</span>
                    <span className="text-[10px] bg-navy-950 text-white font-mono font-bold px-2 py-0.5 rounded-md">
                      ADMIN ROLE
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Email: <code className="text-navy-900 font-semibold">admin@cic-cairo.com</code>
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1">
                    Manage student records, create new student accounts, and review Fall 2026 admissions applications.
                  </p>
                </div>
              </button>

              {/* Student CS Card */}
              <button
                onClick={() => handleQuickDemo('studentCS')}
                className="w-full group p-4 rounded-2xl border-2 border-cic-red/20 hover:border-cic-red bg-cic-red/5 text-left transition-all duration-200 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-cic-red text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <UserCheck size={22} />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-navy-950">Karim Mostafa (CS & AI Student)</span>
                    <span className="text-[10px] bg-cic-red text-white font-mono font-bold px-2 py-0.5 rounded-md">
                      LEVEL 3
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Student ID: <code className="text-navy-900 font-semibold">20230849</code> (New Cairo Campus)
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1">
                    Try the interactive Course Registration System, Add/Drop algorithms & ML courses, and calculate EGP tuition.
                  </p>
                </div>
              </button>

              {/* Student Engineering Card */}
              <button
                onClick={() => handleQuickDemo('studentEng')}
                className="w-full group p-4 rounded-2xl border-2 border-border hover:border-navy-500 bg-white hover:bg-navy-50/50 text-left transition-all duration-200 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-navy-800 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <BookOpen size={20} />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-navy-950">Nour Zaki (Mechatronics Engineering)</span>
                    <span className="text-[10px] bg-navy-100 text-navy-800 font-mono font-bold px-2 py-0.5 rounded-md">
                      LEVEL 4
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Student ID: <code className="text-navy-900 font-semibold">20220194</code> (Sheikh Zayed Campus)
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1">
                    Try Engineering 5-year syndicate track course registration & Cape Breton core courses.
                  </p>
                </div>
              </button>
            </div>
          ) : (
            /* Manual Login Form */
            <form onSubmit={handleManualSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-crimson-50 border border-crimson-200 text-crimson-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  CIC Email or Student ID Number
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. admin@cic-cairo.com or 20230849"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none"
                />
                <span className="text-[10px] text-text-muted mt-1 block">
                  Tip: Any password is accepted for demo accounts created by admins.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cic-red hover:bg-cic-red-dark text-white font-bold text-sm transition-all shadow-md shadow-cic-red/20 flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                <span>Sign In to Portal</span>
              </button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Need assistance? Call <strong>16242</strong></span>
            <span className="text-[11px] font-medium text-cic-red">IT Support Helpdesk</span>
          </div>
        </div>
      </div>
    </div>
  )
}
