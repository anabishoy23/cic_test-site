import { useState } from 'react'
import { Quote, Building2, Briefcase, GraduationCap, ChevronLeft, ChevronRight, Award, ExternalLink } from 'lucide-react'

const SPOTLIGHTS = [
  {
    id: 1,
    name: 'Nouran El-Shazly',
    degree: 'B.Sc. in Computer Science & Artificial Intelligence',
    classYear: 'CIC Class of 2023 · Dual CBU Canada Degree',
    role: 'Senior Machine Learning Engineer',
    employer: 'Vodafone Intelligent Solutions (_VOIS) Egypt & UK',
    image: '/images/alumni-portrait.jpg',
    imageAlt: 'Nouran El-Shazly, CIC Egypt alumna in a navy blazer smiling in a modern office atrium',
    quote: 'The dual Canadian accreditation from Cape Breton University was an absolute game changer. In technical interviews with multinational tech hubs in Smart Village and abroad, recruiters immediately recognized the Canadian curriculum standards. The hands-on project labs at the New Cairo campus taught me to build production-grade AI systems, not just theoretical models.',
    keyAchievement: 'Led the deployment of predictive customer analytics models serving over 20 million telecom subscribers across Europe and Egypt.'
  },
  {
    id: 2,
    name: 'Eng. Ahmed Zaky',
    degree: 'B.Sc. in Mechatronics Engineering (5 Years)',
    classYear: 'CIC Class of 2021 · Dual Canadian Degree',
    role: 'Autonomous Driving Systems Architect',
    employer: 'Valeo Egypt (Smart Village Cairo)',
    image: '/images/news-featured.jpg',
    imageAlt: 'Eng. Ahmed Zaky working in advanced robotics engineering lab',
    quote: 'CIC\'s School of Engineering isn\'t just accredited by the Egyptian Syndicate of Engineers; the joint curriculum with CBU Canada granted me direct eligibility to work on international automotive safety projects. Professor Hesham\'s guidance in our graduation thesis pushed us to file an international patent before we even wore our graduation caps.',
    keyAchievement: 'Contributed to radar perception algorithms currently integrated into production European electric vehicles.'
  }
]

export default function AlumniSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const current = SPOTLIGHTS[currentIndex]

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-navy-50/50 via-background to-white relative overflow-hidden" aria-labelledby="alumni-spotlight-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cic-red/10 text-cic-red text-xs font-semibold uppercase tracking-wider mb-2">
            <Award size={14} />
            CIC Alumni Success Stories
          </div>
          <h2 id="alumni-spotlight-heading" className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy-950 tracking-tight">
            From CIC Cairo to Global Industry Leaders
          </h2>
          <p className="mt-3 text-text-secondary text-sm sm:text-base leading-relaxed">
            Over 16,000 CIC graduates hold leadership positions across Egypt, the Middle East, Canada, and Europe. Here is how their Canadian degree journey began.
          </p>
        </div>

        {/* Featured Card */}
        <div className="mt-12 max-w-5xl mx-auto reveal">
          <div className="bg-white rounded-3xl border border-border/80 shadow-2xl shadow-navy-950/5 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Image side (5 cols) */}
              <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full">
                <img
                  src={current.image}
                  alt={current.imageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent lg:hidden" />
                
                {/* Mobile Info Tag */}
                <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
                  <div className="text-lg font-bold">{current.name}</div>
                  <div className="text-xs text-gold-400 font-medium">{current.role}</div>
                </div>

                {/* Canadian Alumni Badge */}
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full flex items-center gap-1.5 text-white text-xs font-medium">
                  <span className="text-sm">🍁</span>
                  <span>{current.classYear}</span>
                </div>
              </div>

              {/* Quote & details side (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="text-cic-red mb-4 opacity-90">
                    <Quote size={40} className="stroke-[1.5]" />
                  </div>

                  <blockquote className="text-navy-950 font-serif text-lg sm:text-xl lg:text-2xl leading-relaxed italic">
                    "{current.quote}"
                  </blockquote>

                  {/* Highlights Pill */}
                  <div className="mt-6 p-4 rounded-xl bg-navy-50/70 border border-navy-100 flex items-start gap-3">
                    <Award size={18} className="text-cic-red flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-text-secondary leading-snug">
                      <strong className="text-navy-950">Career Impact:</strong> {current.keyAchievement}
                    </p>
                  </div>
                </div>

                {/* Profile Footer */}
                <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-navy-950">{current.name}</h3>
                    <p className="text-xs sm:text-sm font-semibold text-cic-red flex items-center gap-1.5 mt-0.5">
                      <Briefcase size={14} />
                      {current.role}
                    </p>
                    <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                      <Building2 size={13} />
                      {current.employer}
                    </p>
                  </div>

                  {/* Switcher */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev === 0 ? SPOTLIGHTS.length - 1 : prev - 1))}
                      aria-label="Previous alumni spotlight"
                      className="p-2.5 rounded-xl border border-border hover:bg-navy-50 hover:text-navy-900 transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-xs text-text-muted font-medium px-1">
                      {currentIndex + 1} / {SPOTLIGHTS.length}
                    </span>
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev === SPOTLIGHTS.length - 1 ? 0 : prev + 1))}
                      aria-label="Next alumni spotlight"
                      className="p-2.5 rounded-xl border border-border hover:bg-navy-50 hover:text-navy-900 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employability Metric Banner */}
        <div className="mt-12 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center reveal">
          <div className="bg-white p-5 rounded-2xl border border-border/70 shadow-sm">
            <div className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-950">16,000+</div>
            <div className="text-xs text-text-muted mt-1">Alumni Across Egypt & Globe</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border/70 shadow-sm">
            <div className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-950">96%</div>
            <div className="text-xs text-text-muted mt-1">Employment Rate Within 6 Months</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border/70 shadow-sm">
            <div className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-950">20+ Yrs</div>
            <div className="text-xs text-text-muted mt-1">Of Academic Excellence in Cairo</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border/70 shadow-sm">
            <div className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-950">Dual</div>
            <div className="text-xs text-text-muted mt-1">Egyptian & Canadian Degrees</div>
          </div>
        </div>
      </div>
    </section>
  )
}
