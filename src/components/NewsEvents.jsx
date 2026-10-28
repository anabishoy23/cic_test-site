import { useState } from 'react'
import { Calendar, Clock, MapPin, ArrowUpRight, ArrowRight, Check, CalendarPlus } from 'lucide-react'

const EVENTS = [
  {
    id: 1,
    month: 'NOV',
    day: '15',
    title: 'Fall 2026 Admissions Open House & English Placement Exam',
    time: '10:00 AM – 3:00 PM CLT',
    location: 'CIC New Cairo Campus (Fifth Settlement)',
    type: 'Prospective Students',
    description: 'Tour computer engineering labs, meet Canadian academic deans, and complete your on-spot placement evaluation.'
  },
  {
    id: 2,
    month: 'NOV',
    day: '28',
    title: 'Egyptian-Canadian AI & Sustainable Tech Hackathon',
    time: '9:00 AM – 6:00 PM CLT',
    location: 'Auditorium 1, Sheikh Zayed Campus',
    type: 'Tech Competition',
    description: 'In partnership with ITIDA and Canadian tech mentors. Cash prizes and venture incubation for winning student prototypes.'
  },
  {
    id: 3,
    month: 'DEC',
    day: '20',
    title: '20th Annual Dual Commencement at the Grand Egyptian Museum',
    time: '4:00 PM – 8:00 PM CLT',
    location: 'Grand Egyptian Museum (GEM) & Live Broadcast',
    type: 'Official Graduation',
    description: 'Honoring 1,200 graduates receiving both their Egyptian and Cape Breton University (CBU, Canada) bachelor diplomas.'
  },
  {
    id: 4,
    month: 'JAN',
    day: '18',
    title: 'Cape Breton University (Canada) Semester Transfer Workshop',
    time: '1:00 PM – 3:30 PM CLT',
    location: 'Executive Seminar Room, New Cairo',
    type: 'International Mobility',
    description: 'Guidance on visa processing, post-graduation Canadian work permits (PGWP), and course equivalencies.'
  }
]

export default function NewsEvents() {
  const [calendarToast, setCalendarToast] = useState(null)

  const handleAddToCalendar = (eventTitle) => {
    setCalendarToast(`Added "${eventTitle}" to your calendar`)
    setTimeout(() => {
      setCalendarToast(null)
    }, 3500)
  }

  return (
    <section id="news" className="py-20 sm:py-28 bg-white border-y border-border" aria-labelledby="news-events-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-12 border-b border-border/70 reveal">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cic-red/10 text-cic-red text-xs font-semibold uppercase tracking-wider mb-2">
              🍁 CIC Egypt Announcements
            </div>
            <h2 id="news-events-heading" className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy-950 tracking-tight">
              News & Campus Events
            </h2>
          </div>
          <p className="text-text-secondary text-sm sm:text-base max-w-md">
            Stay informed about high-profile Canadian diplomatic visits, student hackathons, and registrar timelines in Egypt.
          </p>
        </div>

        {/* Split Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Featured News (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between reveal">
            <article className="group bg-background rounded-3xl border border-border/80 overflow-hidden hover:shadow-2xl hover:shadow-navy-950/10 transition-all duration-300">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="/images/news-featured.jpg"
                  alt="CIC Egypt researchers and engineering fellows demonstrating advanced robotics in the New Cairo laboratory"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-cic-red text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
                    <span>🍁</span>
                    <span>Diplomatic Milestone</span>
                  </span>
                  <span className="px-3 py-1 glass text-white text-xs font-medium rounded-full">
                    New Cairo Campus
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 text-xs">
                  <span>October 20, 2026</span>
                  <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
                    <Clock size={13} />
                    4 min read
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 group-hover:text-cic-red transition-colors leading-snug">
                  Canadian Ambassador & Higher Education Delegation Inaugurate Advanced AI & Robotics Hub at CIC
                </h3>
                <p className="mt-4 text-text-secondary leading-relaxed text-sm sm:text-base">
                  The state-of-the-art facility, established in partnership with Cape Breton University and leading Canadian tech enterprises, equips Egyptian undergraduate engineers with hands-on industrial automation tools and high-performance computing clusters.
                </p>

                <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cic-red text-white font-bold flex items-center justify-center text-sm shadow-md">
                      🍁
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-navy-950">CIC Office of Academic Affairs</div>
                      <div className="text-xs text-text-muted">In liaison with Embassy of Canada to Egypt</div>
                    </div>
                  </div>

                  <a
                    href="#story"
                    className="inline-flex items-center gap-1 text-sm font-bold text-navy-900 hover:text-cic-red transition-colors"
                  >
                    <span>Read Press Release</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </article>

            {/* Secondary News */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-5 bg-navy-50/50 rounded-2xl border border-navy-100 hover:border-navy-200 transition-colors">
                <span className="text-xs font-bold text-cic-red uppercase tracking-wider">Campus Expansion</span>
                <h4 className="mt-1.5 font-bold text-sm text-navy-950 line-clamp-2">
                  Sheikh Zayed Campus Unveils New High-Definition Media Broadcasting Studio
                </h4>
                <p className="text-xs text-text-muted mt-1">Oct 16 · 3 min read</p>
              </div>
              <div className="p-5 bg-navy-50/50 rounded-2xl border border-navy-100 hover:border-navy-200 transition-colors">
                <span className="text-xs font-bold text-cic-red uppercase tracking-wider">Student Glory</span>
                <h4 className="mt-1.5 font-bold text-sm text-navy-950 line-clamp-2">
                  Enactus CIC Egypt Wins 2nd Place in National Social Entrepreneurship Cup
                </h4>
                <p className="text-xs text-text-muted mt-1">Oct 12 · 4 min read</p>
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Events (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between reveal">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-bold text-navy-950 flex items-center gap-2">
                  <Calendar size={20} className="text-cic-red" />
                  Upcoming Campus Events
                </h3>
                <a href="#events" className="text-xs font-bold text-navy-700 hover:text-cic-red flex items-center gap-1">
                  Full Calendar
                  <ArrowRight size={13} />
                </a>
              </div>

              <div className="space-y-4">
                {EVENTS.map((event) => (
                  <div
                    key={event.id}
                    className="group bg-white p-4 sm:p-5 rounded-2xl border border-border hover:border-cic-red/40 hover:shadow-lg hover:shadow-navy-950/5 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Date Box with Canadian Red Accent */}
                      <div className="flex-shrink-0 w-14 h-16 rounded-xl bg-navy-950 text-white flex flex-col items-center justify-center border-t-2 border-cic-red shadow-sm group-hover:scale-105 transition-transform">
                        <span className="text-[10px] font-bold text-gold-400 tracking-wider uppercase">
                          {event.month}
                        </span>
                        <span className="text-2xl font-serif font-extrabold leading-none mt-0.5">
                          {event.day}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-grow min-w-0">
                        <span className="inline-block px-2 py-0.5 bg-navy-50 text-navy-800 text-[11px] font-semibold rounded-md mb-1.5">
                          {event.type}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-navy-950 leading-snug group-hover:text-cic-red transition-colors">
                          {event.title}
                        </h4>

                        <div className="mt-2 space-y-1 text-xs text-text-muted">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-gold-600" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-navy-600" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
                          <span className="text-xs text-text-secondary line-clamp-1">
                            {event.description}
                          </span>
                          <button
                            onClick={() => handleAddToCalendar(event.title)}
                            aria-label={`Add ${event.title} to calendar`}
                            className="flex-shrink-0 ml-3 inline-flex items-center gap-1 text-xs font-bold text-navy-900 hover:text-cic-red px-2.5 py-1 rounded-md hover:bg-navy-50 transition-colors"
                          >
                            <CalendarPlus size={13} />
                            <span>+ Calendar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registrar Hotline Banner */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-navy-950 to-navy-900 text-white flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Have Questions Regarding Fall 2026?</div>
                <div className="text-xs text-white/70 mt-0.5">Call CIC Admissions & Registration Hotline: 16242</div>
              </div>
              <a
                href="tel:16242"
                className="px-4 py-2 bg-cic-red hover:bg-cic-red-dark text-white text-xs font-bold rounded-lg transition-colors shadow-md flex-shrink-0"
              >
                Call 16242
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Toast */}
      {calendarToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-navy-950 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-cic-red/40 animate-fade-up">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check size={14} />
          </div>
          <span className="text-xs sm:text-sm font-medium">{calendarToast}</span>
        </div>
      )}
    </section>
  )
}
