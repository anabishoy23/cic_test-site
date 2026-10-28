import { PhoneCall, MapPin, Mail, ShieldAlert, ArrowRight } from 'lucide-react'

export default function Footer({ onOpenApplyModal }) {
  return (
    <footer className="bg-navy-950 text-white border-t border-navy-800" role="contentinfo" aria-label="Campus footer">
      {/* Newsletter / Pre-footer CTA */}
      <div className="border-b border-navy-800/80 bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-gold-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                <span>🍁</span>
                <span>Admissions 2026/2027 Open</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Start your Canadian higher education journey in Egypt today.
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenApplyModal}
                className="px-6 py-3.5 rounded-xl bg-cic-red hover:bg-cic-red-dark text-white font-bold text-sm transition-all shadow-lg shadow-cic-red/25 flex items-center justify-center gap-2"
              >
                <span>Apply Online for Admission</span>
                <ArrowRight size={15} />
              </button>
              <a
                href="#registration"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors text-center"
              >
                Course Registration Portal
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Crest, address, hotline, social (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cic-red to-cic-red-dark flex items-center justify-center text-white text-xl shadow-lg shadow-cic-red/25">
                🍁
              </div>
              <div>
                <span className="font-serif text-xl font-extrabold tracking-tight text-white block">
                  CIC Egypt
                </span>
                <span className="text-[10px] font-semibold text-gold-400 tracking-[0.15em] uppercase block">
                  Canadian International College
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed pr-2">
              Established in 2004. Egypt's premier Canadian higher education institution providing dual Egyptian and Canadian degrees in partnership with Cape Breton University (Nova Scotia, Canada).
            </p>

            <div className="space-y-3 text-xs text-white/80 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-cic-red flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">New Cairo Campus:</strong>
                  <span>Land #6, Center Services, South of Police Academy, Fifth Settlement, New Cairo, Egypt</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-cic-red flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Sheikh Zayed Campus:</strong>
                  <span>District 12, Continental Gardens, Sheikh Zayed City, 6th of October, Egypt</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <PhoneCall size={16} className="text-gold-400 flex-shrink-0" />
                <span className="text-sm font-bold text-white">Admissions & Student Hotline: 16242</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-gold-400 flex-shrink-0" />
                <a href="mailto:admissions@cic-cairo.com" className="hover:text-gold-400 transition-colors">
                  admissions@cic-cairo.com
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-2.5">
              {['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube'].map((network) => (
                <a
                  key={network}
                  href={`#${network.toLowerCase()}`}
                  className="w-8 h-8 rounded-lg bg-navy-900 hover:bg-cic-red text-white flex items-center justify-center text-xs font-bold transition-all"
                  aria-label={`Visit CIC Egypt on ${network}`}
                >
                  {network[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Faculties (2-3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gold-400 font-mono">
              Academic Schools
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
              {[
                'School of Computer Science & AI',
                'School of Engineering (5 Years)',
                'School of Business Administration',
                'School of Mass Communication',
                'Cape Breton University Dual Track',
                'Course Registration System',
                'Academic Registrar Calendar',
                'Faculty & Dean Directory'
              ].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Admissions & Aid (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gold-400 font-mono">
              Admissions & Scholarships
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
              {[
                'Online Application Form',
                'Thanaweya Amma Admission Rules',
                'IGCSE & American Diploma Guidelines',
                'Canadian Academic Merit Scholarships',
                'Tuition Fees & Installment Plans',
                'Placement Exam (English & Math)',
                'Transfer Students from Egyptian Universities',
                'Campus Visits & Guided Labs Tour'
              ].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Accreditation & Canadian Partner (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gold-400 font-mono">
              Accreditation
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <strong className="text-white block">Cape Breton University</strong>
                <span>Sydney, Nova Scotia, Canada</span>
              </li>
              <li>
                <strong className="text-white block">Egyptian Ministry</strong>
                <span>Ministry of Higher Education & Scientific Research</span>
              </li>
              <li>
                <strong className="text-white block">Supreme Council</strong>
                <span>Supreme Council of Universities (Egypt)</span>
              </li>
              <li>
                <strong className="text-white block">Engineers Syndicate</strong>
                <span>Egyptian Syndicate of Engineers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-800/80 bg-navy-950/90 text-white/60 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Canadian International College (CIC Egypt). All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-5">
            <a href="#privacy" className="hover:text-gold-400 transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#terms" className="hover:text-gold-400 transition-colors">
              Student Code of Conduct
            </a>
            <span>·</span>
            <a href="#accessibility" className="hover:text-gold-400 transition-colors">
              Accessibility
            </a>
            <span>·</span>
            <a href="#sitemap" className="hover:text-gold-400 transition-colors">
              Campus Map
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
