import { Home, Trophy, Globe, ArrowUpRight } from 'lucide-react'

const FEATURES = [
  {
    icon: Home,
    title: 'Dual Modern Campuses: New Cairo & Sheikh Zayed',
    description: 'State-of-the-art engineering workshops, TV production studios, and high-performance computing labs strategically located in East and West Cairo.',
    image: '/images/campus-housing.jpg',
    imageAlt: 'Modern university facilities at Canadian International College in Egypt',
    stats: '2 Campuses · 40+ Advanced Labs',
    link: '#',
  },
  {
    icon: Globe,
    title: 'Cape Breton University (Canada) Exchange & Summer Semesters',
    description: 'Travel to Sydney, Nova Scotia, Canada for a summer program or complete an exchange semester on CBU\'s picturesque campus while earning credit toward your degree.',
    image: '/images/study-abroad.jpg',
    imageAlt: 'CIC students participating in international exchange and study abroad programs in Canada',
    stats: 'Nova Scotia, Canada · CBU Transfer Options',
    link: '#',
  },
  {
    icon: Trophy,
    title: 'Student Activities, Enactus CIC & Athletics',
    description: 'Join award-winning student chapters including Enactus CIC Egypt, IEEE Student Branch, Google Developer Student Clubs, and annual inter-university football leagues.',
    image: '/images/student-athletics.jpg',
    imageAlt: 'CIC Egypt student tournaments, athletic teams, and university clubs in action',
    stats: '30+ Student Clubs · Annual Hackathons',
    link: '#',
  },
]

export default function CampusLife() {
  return (
    <section
      id="campus-life"
      className="py-20 sm:py-28 bg-gradient-to-b from-background to-navy-50/50"
      aria-labelledby="campus-life-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cic-red/10 text-cic-red text-xs font-semibold uppercase tracking-wider mb-2">
            Student Community & Growth
          </div>
          <h2
            id="campus-life-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy-950 tracking-tight"
          >
            Campus Life at CIC Egypt
          </h2>
          <p className="mt-3 text-text-secondary max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Experience an energetic collegiate environment blending Egyptian cultural warmth with Canadian innovation, collaborative leadership, and active student societies.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 reveal">
          {FEATURES.map(({ icon: Icon, title, description, image, imageAlt, stats, link }) => (
            <div
              key={title}
              className="group relative bg-white rounded-3xl overflow-hidden border border-border/80 hover:shadow-2xl hover:shadow-navy-950/8 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 px-3 py-1 glass rounded-xl text-xs font-bold text-white shadow-sm">
                    {stats}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="w-11 h-11 rounded-2xl bg-cic-red/10 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-cic-red" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-950 leading-snug">{title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">{description}</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <a
                  href={link}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-navy-950 hover:text-cic-red transition-colors group/link"
                >
                  <span>Explore Facilities & Activities</span>
                  <ArrowUpRight size={15} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
