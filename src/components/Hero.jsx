import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Award, CheckCircle, MapPin, Sparkles } from 'lucide-react'

function AnimatedStat({ value, label, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-3 sm:py-0">
      <div className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight flex items-center gap-1">
        <span>{value}</span>
      </div>
      <div className="text-xs text-white/90 mt-0.5 font-semibold">{label}</div>
      {subtitle && <div className="text-[10px] text-white/60 mt-0.5">{subtitle}</div>}
    </div>
  )
}

export default function Hero({ onOpenApplyModal }) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* Background image of CIC Egypt Campus */}
      <div className="absolute inset-0">
        <img
          src="/images/cic-egypt-campus.jpg"
          alt="Canadian International College CIC campus in New Cairo, Egypt with modern architectural building and student walkways"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/75 to-navy-950/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-28 sm:pb-36">
        <div className="max-w-3xl animate-fade-up">
          {/* Canadian & Egyptian Flag / Partner Badge */}
          <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full glass text-xs text-white font-medium mb-6">
            <span className="text-sm">🍁</span>
            <span className="font-bold text-gold-400">Canadian International College (CIC)</span>
            <span className="text-white/40">·</span>
            <span className="text-white/90">Dual Degree Partner with Cape Breton University (CBU, Canada)</span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.12] tracking-tight"
          >
            Canadian Higher Education in Egypt.{' '}
            <span className="bg-gradient-to-r from-cic-red to-gold-400 bg-clip-text text-transparent">
              Dual Degrees, Limitless Futures.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
            Established in 2004 as Egypt's first Canadian higher education provider. Study under Canadian academic standards across our <strong>New Cairo</strong> and <strong>Sheikh Zayed</strong> campuses, graduate with dual Canadian and Egyptian degrees, and access global career opportunities.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onOpenApplyModal}
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-r from-cic-red to-cic-red-dark text-white font-bold rounded-2xl shadow-xl shadow-cic-red/30 hover:shadow-cic-red/50 transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
            >
              <span>Apply for Fall 2026/2027</span>
              <span className="group-hover:translate-x-1 transition-transform">🍁</span>
            </button>

            <a
              href="#registration"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-200 text-sm sm:text-base backdrop-blur-sm"
            >
              <BookOpen size={18} className="text-gold-400" />
              <span>Course Registration Portal</span>
            </a>
          </div>

          {/* Quick Accreditation Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-400" />
              Accredited by Egyptian Ministry of Higher Education
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-400" />
              Cape Breton University (Nova Scotia, Canada) Degree
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-400" />
              Egyptian Syndicate of Engineers Approved
            </span>
          </div>
        </div>
      </div>

      {/* Live Stat Counter Strip */}
      <div className="relative z-10 -mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-dark rounded-3xl py-6 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 shadow-2xl border border-white/10">
            <AnimatedStat value="1st in Egypt" label="Canadian Education Provider" subtitle="Est. 2004 in Cairo" />
            <AnimatedStat value="Dual Degree" label="Canada (CBU) & Egypt" subtitle="2 Accredited Diplomas" />
            <AnimatedStat value="16,000+" label="Successful Graduates" subtitle="Working in Egypt & Abroad" />
            <AnimatedStat value="2 Campuses" label="New Cairo & Sheikh Zayed" subtitle="Modern Facilities" />
          </div>
        </div>
      </div>

      <div className="h-12 sm:h-16 bg-gradient-to-b from-transparent to-background relative z-10" />
    </section>
  )
}
