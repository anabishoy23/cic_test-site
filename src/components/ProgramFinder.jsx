import { useState, useMemo } from 'react'
import { Search, Clock, ArrowUpRight, GraduationCap, Laptop, Cog, Briefcase, Radio, Check, Sparkles } from 'lucide-react'

const FACULTIES = [
  { key: 'all', label: 'All Programs', icon: GraduationCap },
  { key: 'cs', label: 'Computer Science & AI', icon: Laptop },
  { key: 'engineering', label: 'Engineering (5 Yrs)', icon: Cog },
  { key: 'business', label: 'Business Administration', icon: Briefcase },
  { key: 'masscomm', label: 'Mass Communication', icon: Radio },
]

const PROGRAMS = [
  // Computer Science
  {
    name: 'Artificial Intelligence & Data Science',
    faculty: 'cs',
    facultyName: 'School of Computer Science',
    degree: 'B.Sc. (Dual Canadian & Egyptian)',
    duration: '4 Years',
    campuses: 'New Cairo & Sheikh Zayed',
    popular: true,
    highlights: 'Deep Learning, NLP, Big Data with CBU Canada exchange option',
    cbuAccredited: true
  },
  {
    name: 'Software Engineering & Cloud Architecture',
    faculty: 'cs',
    facultyName: 'School of Computer Science',
    degree: 'B.Sc. (Dual Canadian & Egyptian)',
    duration: '4 Years',
    campuses: 'New Cairo & Sheikh Zayed',
    popular: true,
    highlights: 'Full-Stack, Microservices, DevOps, AWS & Azure pipelines',
    cbuAccredited: true
  },
  {
    name: 'Game Development & Virtual Reality',
    faculty: 'cs',
    facultyName: 'School of Computer Science',
    degree: 'B.Sc. (Dual Canadian & Egyptian)',
    duration: '4 Years',
    campuses: 'New Cairo Campus',
    popular: false,
    highlights: 'Unity 3D, Unreal Engine, Physics simulations, XR lab access',
    cbuAccredited: true
  },
  {
    name: 'Cybersecurity & Defense Systems',
    faculty: 'cs',
    facultyName: 'School of Computer Science',
    degree: 'B.Sc. (Dual Canadian & Egyptian)',
    duration: '4 Years',
    campuses: 'New Cairo & Sheikh Zayed',
    popular: true,
    highlights: 'Ethical Hacking, Cryptography, SOC operations, Network forensics',
    cbuAccredited: true
  },

  // Engineering (5 Years - Syndicate Accredited)
  {
    name: 'Mechatronics Engineering',
    faculty: 'engineering',
    facultyName: 'School of Engineering',
    degree: 'B.Sc. (Syndicate Accredited)',
    duration: '5 Years',
    campuses: 'New Cairo & Sheikh Zayed',
    popular: true,
    highlights: 'Industrial Robotics, PLC Automation, Embedded IoT, EV systems',
    cbuAccredited: true
  },
  {
    name: 'Architectural Engineering',
    faculty: 'engineering',
    facultyName: 'School of Engineering',
    degree: 'B.Sc. (Syndicate Accredited)',
    duration: '5 Years',
    campuses: 'New Cairo Campus',
    popular: true,
    highlights: 'Sustainable Smart Cities, BIM, Parametric Design, Heritage restoration',
    cbuAccredited: true
  },
  {
    name: 'Civil & Construction Engineering',
    faculty: 'engineering',
    facultyName: 'School of Engineering',
    degree: 'B.Sc. (Syndicate Accredited)',
    duration: '5 Years',
    campuses: 'New Cairo & Sheikh Zayed',
    popular: false,
    highlights: 'Mega-Infrastructure projects, Geotechnical analysis, Project management',
    cbuAccredited: true
  },
  {
    name: 'Communications & Electronics Engineering',
    faculty: 'engineering',
    facultyName: 'School of Engineering',
    degree: 'B.Sc. (Syndicate Accredited)',
    duration: '5 Years',
    campuses: 'New Cairo Campus',
    popular: false,
    highlights: '5G Wireless Networks, VLSI design, Satellite and RF engineering',
    cbuAccredited: true
  },

  // Business Administration
  {
    name: 'Finance & Banking',
    faculty: 'business',
    facultyName: 'School of Business',
    degree: 'B.B.A. (Dual Canadian & Egyptian)',
    duration: '4 Years',
    campuses: 'New Cairo & Sheikh Zayed',
    popular: true,
    highlights: 'Fintech, Portfolio management, Egyptian Stock Exchange simulation',
    cbuAccredited: true
  },
  {
    name: 'Marketing & Digital Advertising',
    faculty: 'business',
    facultyName: 'School of Business',
    degree: 'B.B.A. (Dual Canadian & Egyptian)',
    duration: '4 Years',
    campuses: 'New Cairo & Sheikh Zayed',
    popular: true,
    highlights: 'Performance Marketing, Brand strategy, Consumer Analytics',
    cbuAccredited: true
  },
  {
    name: 'Accounting & Auditing',
    faculty: 'business',
    facultyName: 'School of Business',
    degree: 'B.B.A. (Dual Canadian & Egyptian)',
    duration: '4 Years',
    campuses: 'New Cairo & Sheikh Zayed',
    popular: false,
    highlights: 'CPA/ACCA alignment, Forensic accounting, International tax standards',
    cbuAccredited: true
  },
  {
    name: 'Human Resource Management',
    faculty: 'business',
    facultyName: 'School of Business',
    degree: 'B.B.A. (Dual Canadian & Egyptian)',
    duration: '4 Years',
    campuses: 'New Cairo & Sheikh Zayed',
    popular: false,
    highlights: 'Talent Acquisition, Organizational leadership, Egyptian labor law',
    cbuAccredited: true
  },

  // Mass Communication
  {
    name: 'Public Relations & Advertising',
    faculty: 'masscomm',
    facultyName: 'School of Mass Comm',
    degree: 'B.A. (Dual Canadian & Egyptian)',
    duration: '4 Years',
    campuses: 'New Cairo Campus',
    popular: true,
    highlights: 'Crisis communications, Corporate branding, Integrated digital PR campaigns',
    cbuAccredited: true
  },
  {
    name: 'Broadcasting & Electronic Media',
    faculty: 'masscomm',
    facultyName: 'School of Mass Comm',
    degree: 'B.A. (Dual Canadian & Egyptian)',
    duration: '4 Years',
    campuses: 'New Cairo Campus',
    popular: false,
    highlights: 'High-definition TV studio production, Podcasting, Live news broadcast',
    cbuAccredited: true
  }
]

export default function ProgramFinder({ onOpenApplyModal }) {
  const [activeFaculty, setActiveFaculty] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return PROGRAMS.filter((p) => {
      const matchesFaculty = activeFaculty === 'all' || p.faculty === activeFaculty
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.facultyName.toLowerCase().includes(search.toLowerCase()) ||
        p.highlights.toLowerCase().includes(search.toLowerCase())
      return matchesFaculty && matchesSearch
    })
  }, [activeFaculty, search])

  return (
    <section id="programs" className="py-20 sm:py-28 bg-background" aria-labelledby="programs-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cic-red/10 text-cic-red text-xs font-semibold uppercase tracking-wider mb-2">
            🍁 Canadian Degree Programs in Egypt
          </div>
          <h2
            id="programs-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy-950 tracking-tight"
          >
            Explore Academic Programs
          </h2>
          <p className="mt-3 text-text-secondary max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Choose from industry-aligned degrees across our 4 distinguished faculties. Dual-accredited by the <strong>Egyptian Ministry of Higher Education</strong> and <strong>Cape Breton University (CBU), Nova Scotia, Canada</strong>.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mt-10 reveal">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Faculty Tabs */}
            <div className="flex flex-wrap bg-white p-1.5 rounded-2xl border border-border shadow-sm" role="tablist">
              {FACULTIES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeFaculty === key}
                  onClick={() => { setActiveFaculty(key); setSearch('') }}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeFaculty === key
                      ? 'bg-navy-950 text-white shadow-md'
                      : 'text-text-muted hover:text-navy-900 hover:bg-navy-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search majors, e.g. AI, Mechatronics, Finance…"
                aria-label="Search academic programs"
                className="pl-10 pr-4 py-2.5 w-full lg:w-80 rounded-2xl border border-border bg-white text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-border text-text-muted text-sm">
              No academic programs found matching "{search}".
            </div>
          ) : (
            filtered.map((program) => (
              <div
                key={program.name}
                className="group relative bg-white rounded-3xl border border-border/80 p-6 hover:shadow-2xl hover:shadow-navy-950/8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                      {program.facultyName}
                    </span>
                    {program.popular && (
                      <span className="px-2.5 py-0.5 bg-cic-red/10 text-cic-red text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
                        <span>🍁</span>
                        <span>High Demand</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-navy-950 leading-snug group-hover:text-cic-red transition-colors">
                    {program.name}
                  </h3>

                  <p className="mt-2 text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {program.highlights}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/70 space-y-1.5 text-xs text-text-muted">
                    <div className="flex items-center justify-between">
                      <span className="text-navy-900 font-semibold">{program.degree}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock size={12} />
                        {program.duration}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-muted">
                      Campuses: <strong>{program.campuses}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <Check size={13} />
                    CBU Canada Partner
                  </span>

                  <button
                    onClick={onOpenApplyModal}
                    className="inline-flex items-center gap-1 text-xs font-bold text-navy-950 group-hover:text-cic-red transition-colors"
                  >
                    <span>Apply for Major</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
