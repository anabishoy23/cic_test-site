import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import UtilityBar from './components/UtilityBar'
import Header from './components/Header'
import Hero from './components/Hero'
import ProgramFinder from './components/ProgramFinder'
import CourseRegistration from './components/CourseRegistration'
import CampusLife from './components/CampusLife'
import NewsEvents from './components/NewsEvents'
import AlumniSpotlight from './components/AlumniSpotlight'
import Footer from './components/Footer'
import ApplicationModal from './components/ApplicationModal'
import LoginModal from './components/LoginModal'
import AdminPanel from './components/AdminPanel'

/* ─── Scroll-reveal hook ─────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function MainApp() {
  const { login } = useAuth()
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)

  useReveal()

  const openApplyModal = () => setIsApplyModalOpen(true)
  const closeApplyModal = () => setIsApplyModalOpen(false)

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  const openAdminPanel = () => setIsAdminPanelOpen(true)
  const closeAdminPanel = () => setIsAdminPanelOpen(false)

  const handleSwitchToStudent = (student) => {
    login(student.studentId, 'demo')
    // Smooth scroll down to course registration
    setTimeout(() => {
      const el = document.getElementById('registration')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-cic-red selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-cic-red focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm font-bold"
      >
        Skip to main content
      </a>

      {/* Top Utility Bar */}
      <UtilityBar
        onOpenApplyModal={openApplyModal}
        onOpenLoginModal={openLoginModal}
        onOpenAdminPanel={openAdminPanel}
      />

      {/* Main Sticky Header */}
      <Header
        onOpenApplyModal={openApplyModal}
        onOpenLoginModal={openLoginModal}
        onOpenAdminPanel={openAdminPanel}
      />

      <main id="main-content">
        {/* Hero Section */}
        <Hero onOpenApplyModal={openApplyModal} />

        {/* Academic Program Finder */}
        <ProgramFinder onOpenApplyModal={openApplyModal} />

        {/* Interactive Course Registration Portal (Student Self-Service) */}
        <CourseRegistration onOpenLoginModal={openLoginModal} />

        {/* Campus Life & Facilities (New Cairo & Sheikh Zayed) */}
        <CampusLife />

        {/* News & Upcoming Events */}
        <NewsEvents />

        {/* Alumni & Student Spotlight */}
        <AlumniSpotlight />
      </main>

      {/* Footer & Compliance */}
      <Footer onOpenApplyModal={openApplyModal} />

      {/* Online Admissions Application Modal */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={closeApplyModal}
      />

      {/* Unified Portal Login Modal with 1-Click Demo Accounts */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onOpenAdminPanel={openAdminPanel}
        onOpenRegistration={() => {
          const el = document.getElementById('registration')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {/* University Registrar & Admin Control Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={closeAdminPanel}
        onSwitchToStudent={handleSwitchToStudent}
      />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
