import React, { useState, useMemo, useEffect } from 'react'
import {
  BookOpen, Calendar, Clock, Plus, Trash2, CheckCircle2, AlertCircle, Printer, Search,
  User, Filter, CreditCard, ChevronRight, ChevronDown, ChevronUp, Download, Sparkles,
  Lock, AlertTriangle, ShieldCheck, Check, RotateCcw, Eye, LayoutGrid, ListFilter,
  Users, Layers, ArrowRight, X, ExternalLink, Send, FileCheck, BookmarkPlus, HelpCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ─── Saturday to Thursday 8:00 AM to 6:00 PM Definition ───────────────────────────
export const TIMETABLE_DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']
export const TIMETABLE_DAY_LABELS = {
  Sat: 'Saturday (السبت)',
  Sun: 'Sunday (الأحد)',
  Mon: 'Monday (الإثنين)',
  Tue: 'Tuesday (الثلاثاء)',
  Wed: 'Wednesday (الأربعاء)',
  Thu: 'Thursday (الخميس)'
}

// 1-hour time rows from 08:00 to 18:00
export const TIME_ROWS = [
  { start: '08:00', end: '09:00', label: '08:00 AM' },
  { start: '09:00', end: '10:00', label: '09:00 AM' },
  { start: '10:00', end: '11:00', label: '10:00 AM' },
  { start: '11:00', end: '12:00', label: '11:00 AM' },
  { start: '12:00', end: '13:00', label: '12:00 PM' },
  { start: '13:00', end: '14:00', label: '01:00 PM' },
  { start: '14:00', end: '15:00', label: '02:00 PM' },
  { start: '15:00', end: '16:00', label: '03:00 PM' },
  { start: '16:00', end: '17:00', label: '04:00 PM' },
  { start: '17:00', end: '18:00', label: '05:00 PM' },
]

// Convert 'HH:MM' string to decimal hours (e.g. '08:30' -> 8.5)
const timeToDecimal = (t) => {
  const [h, m] = t.split(':').map(Number)
  return h + m / 60
}

// ─── Comprehensive Course Catalog with Sections (11 Realistic Courses) ────────────
export const CATALOG_COURSES = [
  {
    code: 'CS301',
    title: 'Advanced Data Structures & Algorithms',
    credits: 3,
    type: 'Core Mandatory',
    department: 'Computer Science',
    prereq: 'CS201 - Data Structures',
    prereqMet: true,
    description: 'Design and complexity analysis of graph algorithms, balanced trees, amortized analysis, and dynamic programming.',
    color: '#4F46E5', // Indigo
    sections: [
      {
        id: 'CS301-S01',
        sectionNum: '01',
        instructor: 'Dr. Tarek Mansour (Ph.D. McGill)',
        capacity: 30,
        enrolled: 24,
        waitlist: 0,
        lecture: { day: 'Sun', start: '10:00', end: '11:30', room: 'Hall B2, New Cairo' },
        lab: { day: 'Tue', start: '12:00', end: '14:00', room: 'Lab 4, Software Center' }
      },
      {
        id: 'CS301-S02',
        sectionNum: '02',
        instructor: 'Dr. Sarah El-Banna (Ph.D. Alberta)',
        capacity: 30,
        enrolled: 29,
        waitlist: 2,
        lecture: { day: 'Mon', start: '08:30', end: '10:00', room: 'Auditorium C' },
        lab: { day: 'Wed', start: '14:00', end: '16:00', room: 'Lab 2, Tech Wing' }
      }
    ]
  },
  {
    code: 'CS302',
    title: 'Relational Database Management Systems',
    credits: 3,
    type: 'Core Mandatory',
    department: 'Computer Science',
    prereq: 'CS201 - Data Structures',
    prereqMet: true,
    description: 'Relational algebra, SQL query optimization, indexing, ACID transactions, and distributed database sharding.',
    color: '#0891B2', // Cyan
    sections: [
      {
        id: 'CS302-S01',
        sectionNum: '01',
        instructor: 'Dr. Yasser Fouad',
        capacity: 30,
        enrolled: 22,
        waitlist: 0,
        lecture: { day: 'Mon', start: '10:00', end: '11:30', room: 'Hall A1' },
        lab: { day: 'Wed', start: '10:00', end: '12:00', room: 'Database Lab 108' }
      },
      {
        id: 'CS302-S02',
        sectionNum: '02',
        instructor: 'Dr. Mohamed Rashed',
        capacity: 25,
        enrolled: 25, // Full
        waitlist: 3,
        lecture: { day: 'Sun', start: '13:00', end: '14:30', room: 'Hall 201' },
        lab: { day: 'Tue', start: '08:30', end: '10:30', room: 'Lab 3' }
      }
    ]
  },
  {
    code: 'AI310',
    title: 'Machine Learning & Deep Neural Architectures',
    credits: 3,
    type: 'Major Elective',
    department: 'Computer Science',
    prereq: 'MATH202 & CS301',
    prereqMet: true,
    description: 'Supervised/unsupervised models, gradient descent, PyTorch, convolutional networks, and transformer attention mechanisms.',
    color: '#10B981', // Emerald
    sections: [
      {
        id: 'AI310-S01',
        sectionNum: '01',
        instructor: 'Prof. Amira El-Gohary (Ph.D. Toronto)',
        capacity: 35,
        enrolled: 31,
        waitlist: 0,
        lecture: { day: 'Tue', start: '10:00', end: '11:30', room: 'Auditorium B' },
        lab: { day: 'Thu', start: '12:00', end: '14:00', room: 'GPU Innovation Lab' }
      },
      {
        id: 'AI310-S02',
        sectionNum: '02',
        instructor: 'Dr. Hesham Kamal',
        capacity: 30,
        enrolled: 30, // Full
        waitlist: 5,
        lecture: { day: 'Sat', start: '11:00', end: '12:30', room: 'Hall 104' },
        lab: { day: 'Mon', start: '14:00', end: '16:00', room: 'Lab 5' }
      }
    ]
  },
  {
    code: 'SE320',
    title: 'Cloud Native Systems & DevOps Microservices',
    credits: 3,
    type: 'Major Elective',
    department: 'Computer Science',
    prereq: 'CS201 - Data Structures',
    prereqMet: true,
    description: 'Container orchestration with Kubernetes, Docker, CI/CD pipelines, gRPC services, and AWS/GCP cloud architectures.',
    color: '#8B5CF6', // Purple
    sections: [
      {
        id: 'SE320-S01',
        sectionNum: '01',
        instructor: 'Eng. Ramy Nabil (AWS Certified Principal)',
        capacity: 30,
        enrolled: 18,
        waitlist: 0,
        lecture: { day: 'Sun', start: '14:30', end: '16:00', room: 'Cloud Lab 1' },
        lab: { day: 'Tue', start: '14:30', end: '16:30', room: 'Cloud Lab 1' }
      }
    ]
  },
  {
    code: 'CS305',
    title: 'Operating Systems & Concurrency Architecture',
    credits: 3,
    type: 'Core Mandatory',
    department: 'Computer Science',
    prereq: 'CS201 - Data Structures',
    prereqMet: true,
    description: 'Process scheduling, POSIX threads, synchronization primitives, virtual memory management, and file system internals.',
    color: '#EA580C', // Orange
    sections: [
      {
        id: 'CS305-S01',
        sectionNum: '01',
        instructor: 'Dr. Khaled Mostafa',
        capacity: 30,
        enrolled: 26,
        waitlist: 0,
        lecture: { day: 'Mon', start: '12:00', end: '13:30', room: 'Hall B1' },
        lab: { day: 'Wed', start: '08:30', end: '10:30', room: 'Systems Lab 3' }
      }
    ]
  },
  {
    code: 'CBU101',
    title: 'Canadian Culture, Governance & Global Society',
    credits: 3,
    type: 'University Elective',
    department: 'Canadian CBU Partner Core',
    prereq: 'None',
    prereqMet: true,
    description: 'Canadian constitutional law, indigenous heritage, multicultural public policies, and dual degree global citizenship.',
    color: '#C8102E', // Canadian Red
    sections: [
      {
        id: 'CBU101-S01',
        sectionNum: '01',
        instructor: 'Dr. Patrick MacLeod (Cape Breton University Visiting Faculty)',
        capacity: 50,
        enrolled: 42,
        waitlist: 0,
        lecture: { day: 'Thu', start: '09:00', end: '11:00', room: 'Virtual CBU Sydney Theater' },
        lab: { day: 'Thu', start: '11:00', end: '12:00', room: 'Interactive Seminar A' }
      }
    ]
  },
  {
    code: 'ENG104',
    title: 'Advanced Technical Writing & Engineering Ethics',
    credits: 2,
    type: 'University Elective',
    department: 'General Studies',
    prereq: 'None',
    prereqMet: true,
    description: 'Research synthesis, white paper drafting, peer review standards, IEEE citation norms, and professional engineering ethics.',
    color: '#475569', // Slate
    sections: [
      {
        id: 'ENG104-S01',
        sectionNum: '01',
        instructor: 'Dr. Mona Fathi',
        capacity: 30,
        enrolled: 15,
        waitlist: 0,
        lecture: { day: 'Sat', start: '09:00', end: '11:00', room: 'Room 208' },
        lab: null
      }
    ]
  },
  {
    code: 'MATH202',
    title: 'Linear Algebra & Differential Equations',
    credits: 3,
    type: 'Core Mandatory',
    department: 'Mathematics',
    prereq: 'MATH101 - Calculus I',
    prereqMet: true,
    description: 'Vector spaces, matrix decompositions (SVD, Eigendecomposition), first/second order ODEs, and Laplace transforms.',
    color: '#0284C7', // Sky
    sections: [
      {
        id: 'MATH202-S01',
        sectionNum: '01',
        instructor: 'Prof. Raouf El-Menshawy',
        capacity: 40,
        enrolled: 34,
        waitlist: 0,
        lecture: { day: 'Sun', start: '08:30', end: '10:00', room: 'Math Hall 1' },
        lab: { day: 'Wed', start: '12:30', end: '14:00', room: 'Math Tutorial 4' }
      }
    ]
  },
  {
    code: 'CS340',
    title: 'Computer Networks & Distributed Protocols',
    credits: 3,
    type: 'Major Elective',
    department: 'Computer Science',
    prereq: 'CS201 - Data Structures',
    prereqMet: true,
    description: 'OSI layers, TCP/IP congestion control, BGP routing, socket programming, HTTP/3, and network security cryptography.',
    color: '#0D9488', // Teal
    sections: [
      {
        id: 'CS340-S01',
        sectionNum: '01',
        instructor: 'Dr. Nader Safwat',
        capacity: 30,
        enrolled: 20,
        waitlist: 0,
        lecture: { day: 'Mon', start: '14:00', end: '15:30', room: 'Hall A2' },
        lab: { day: 'Wed', start: '16:00', end: '18:00', room: 'Cisco Networking Lab' }
      }
    ]
  },
  // ─── 2 LOCKED COURSES (Requires Prerequisite) ─────────────────
  {
    code: 'CS450',
    title: 'Distributed Consensus & Blockchain Systems',
    credits: 3,
    type: 'Major Elective',
    department: 'Computer Science',
    prereq: 'CS340 - Computer Networks & Protocols',
    prereqMet: false, // LOCKED
    lockReason: 'Requires CS340 (Networks & Distributed Protocols) with grade >= C',
    description: 'Byzantine fault tolerance, Raft consensus, cryptographic hash chains, Ethereum EVM execution, and decentralized ledger design.',
    color: '#64748B',
    sections: []
  },
  {
    code: 'AI420',
    title: 'Natural Language Processing & Large Language Models',
    credits: 3,
    type: 'Major Elective',
    department: 'Computer Science',
    prereq: 'AI310 - Machine Learning & Deep Neural Networks',
    prereqMet: false, // LOCKED
    lockReason: 'Requires AI310 (Machine Learning) with grade >= C',
    description: 'Self-attention, Transformer decoders (GPT), instruction fine-tuning, RLHF alignment, and efficient inference quantization.',
    color: '#64748B',
    sections: []
  }
]

export default function CourseRegistration() {
  const { currentUser, loginAsDemo } = useAuth()

  // ─── Student Profile & Dynamic Credit Limits ─────────────────────────
  const student = useAuth()?.currentUser || {
    name: 'Karim Mostafa Hassan',
    studentId: '20230849',
    major: 'Computer Science & AI',
    faculty: 'School of Computer Science & IT',
    level: 'Level 3 (Junior)',
    cgpa: 3.42,
    campus: 'New Cairo Campus',
    advisor: 'Dr. Tarek Mansour'
  }

  // CGPA-based Credit Limit Rule:
  // CGPA >= 2.0 -> Max 18 Credits; CGPA < 2.0 (Probation) -> Max 12 Credits. Min allowed full-time is 12 Cr.
  const isProbation = (student.cgpa || 3.42) < 2.0
  const maxAllowedCredits = isProbation ? 12 : 18
  const minRequiredCredits = 12

  // ─── Component State ────────────────────────────────────────────────
  // Selected Sections Cart: Array of { course, section }
  const [selectedItems, setSelectedItems] = useState([
    {
      course: CATALOG_COURSES[0], // CS301
      section: CATALOG_COURSES[0].sections[0] // Sun 10:00-11:30 | Tue 12:00-14:00
    },
    {
      course: CATALOG_COURSES[1], // CS302
      section: CATALOG_COURSES[1].sections[0] // Mon 10:00-11:30 | Wed 10:00-12:00
    },
    {
      course: CATALOG_COURSES[5], // CBU101
      section: CATALOG_COURSES[5].sections[0] // Thu 09:00-11:00
    }
  ])

  // Registration Workflow Status
  const [registrationStatus, setRegistrationStatus] = useState('Draft') // 'Draft' | 'Pending Advisor Approval' | 'Confirmed'
  const [activeTab, setActiveTab] = useState('calendar') // 'calendar' | 'list' | 'tuition'
  const [expandedCourseCode, setExpandedCourseCode] = useState('CS301')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All') // 'All' | 'Available' | 'Core' | 'Electives'
  const [hideConflicts, setHideConflicts] = useState(false)

  // Hovered section for Real-Time Ghost Timetable Preview
  const [hoveredSection, setHoveredSection] = useState(null) // { course, section } or null

  // UI Feedback
  const [toast, setToast] = useState(null)
  const [showSlipModal, setShowSlipModal] = useState(false)
  const [submissionReceipt, setSubmissionReceipt] = useState(null)

  const showToast = (text, type = 'success') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ─── Time Conflict Detection Engine ─────────────────────────────────
  // Helper: check if two sessions on the same day overlap
  const doesSessionOverlap = (s1, s2) => {
    if (!s1 || !s2 || s1.day !== s2.day) return false
    const start1 = timeToDecimal(s1.start)
    const end1 = timeToDecimal(s1.end)
    const start2 = timeToDecimal(s2.start)
    const end2 = timeToDecimal(s2.end)
    return start1 < end2 && end1 > start2
  }

  // Check if a candidate section clashes with any already selected section
  const checkSectionConflict = (candidateSection, candidateCourseCode) => {
    for (const item of selectedItems) {
      if (item.course.code === candidateCourseCode) continue // Ignore same course

      // Check lecture vs existing lecture
      if (doesSessionOverlap(candidateSection.lecture, item.section.lecture)) {
        return {
          clashCourse: item.course.code,
          day: candidateSection.lecture.day,
          time: `${candidateSection.lecture.start} – ${candidateSection.lecture.end}`,
          type: 'Lecture'
        }
      }
      // Check lecture vs existing lab
      if (doesSessionOverlap(candidateSection.lecture, item.section.lab)) {
        return {
          clashCourse: item.course.code,
          day: candidateSection.lecture.day,
          time: `${candidateSection.lecture.start} – ${candidateSection.lecture.end}`,
          type: 'Lab Conflict'
        }
      }
      // Check lab vs existing lecture
      if (candidateSection.lab && doesSessionOverlap(candidateSection.lab, item.section.lecture)) {
        return {
          clashCourse: item.course.code,
          day: candidateSection.lab.day,
          time: `${candidateSection.lab.start} – ${candidateSection.lab.end}`,
          type: 'Lab Conflict'
        }
      }
      // Check lab vs existing lab
      if (candidateSection.lab && doesSessionOverlap(candidateSection.lab, item.section.lab)) {
        return {
          clashCourse: item.course.code,
          day: candidateSection.lab.day,
          time: `${candidateSection.lab.start} – ${candidateSection.lab.end}`,
          type: 'Lab Overlap'
        }
      }
    }
    return null
  }

  // ─── Registered Credits & Tuition Calculation ───────────────────────
  const totalRegisteredCredits = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.course.credits, 0)
  }, [selectedItems])

  const creditPercentage = Math.min((totalRegisteredCredits / maxAllowedCredits) * 100, 100)

  // Tuition in Egyptian Pounds (EGP): 4,600 EGP per credit + Canadian accreditation
  const costPerCredit = 4600
  const tuitionTotal = totalRegisteredCredits * costPerCredit
  const cbuDualFee = 8500
  const techLabFee = 3200
  const grandTotalFees = tuitionTotal + cbuDualFee + techLabFee

  // ─── Catalog Filtering ──────────────────────────────────────────────
  const filteredCatalog = useMemo(() => {
    return CATALOG_COURSES.filter((course) => {
      // Search
      const matchesSearch =
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.department.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false

      // Filter tabs
      if (filterType === 'Available' && !course.prereqMet) return false
      if (filterType === 'Core' && !course.type.includes('Core')) return false
      if (filterType === 'Electives' && !course.type.includes('Elective')) return false

      // Hide Time Conflicts Toggle
      if (hideConflicts && course.prereqMet) {
        // If all sections have conflicts, hide this course
        const hasAnyViableSection = course.sections.some(
          (sec) => !checkSectionConflict(sec, course.code)
        )
        if (!hasAnyViableSection) return false
      }

      return true
    })
  }, [searchQuery, filterType, hideConflicts, selectedItems])

  // ─── User Actions ───────────────────────────────────────────────────
  const handleAddSection = (course, section) => {
    // Check if course already added
    const existingIndex = selectedItems.findIndex((it) => it.course.code === course.code)

    // Check credits
    const additionalCredits = existingIndex !== -1 ? 0 : course.credits
    if (totalRegisteredCredits + additionalCredits > maxAllowedCredits) {
      showToast(`Credit limit reached! You cannot exceed ${maxAllowedCredits} credits this term.`, 'error')
      return
    }

    // Check conflict
    const conflict = checkSectionConflict(section, course.code)
    if (conflict) {
      showToast(`Cannot register: Time clash with ${conflict.clashCourse} on ${TIMETABLE_DAY_LABELS[conflict.day]}!`, 'error')
      return
    }

    if (existingIndex !== -1) {
      // Replace section
      const updated = [...selectedItems]
      updated[existingIndex] = { course, section }
      setSelectedItems(updated)
      showToast(`Switched ${course.code} to Section ${section.sectionNum}`)
    } else {
      setSelectedItems([...selectedItems, { course, section }])
      showToast(`Added ${course.code} (Section ${section.sectionNum}) to schedule!`)
    }
  }

  const handleDropCourse = (courseCode) => {
    setSelectedItems(selectedItems.filter((it) => it.course.code !== courseCode))
    showToast(`Removed ${courseCode} from registered schedule`, 'info')
  }

  const handleClearSchedule = () => {
    if (window.confirm('Are you sure you want to drop all courses from your draft schedule?')) {
      setSelectedItems([])
      showToast('Cleared all courses from schedule', 'info')
    }
  }

  const handleSubmitForApproval = () => {
    if (totalRegisteredCredits < minRequiredCredits) {
      showToast(`Underload Warning: You must register at least ${minRequiredCredits} credits before submission. Currently: ${totalRegisteredCredits} Cr.`, 'error')
      return
    }

    const receipt = {
      refNumber: `CIC-REG-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      studentName: student.name,
      studentId: student.studentId,
      advisorName: student.advisor || 'Dr. Tarek Mansour',
      credits: totalRegisteredCredits,
      courses: selectedItems.map(it => ({
        code: it.course.code,
        title: it.course.title,
        credits: it.course.credits,
        section: it.section.sectionNum,
        instructor: it.section.instructor,
        lecture: `${it.section.lecture.day} ${it.section.lecture.start}–${it.section.lecture.end} (${it.section.lecture.room})`,
        lab: it.section.lab ? `${it.section.lab.day} ${it.section.lab.start}–${it.section.lab.end} (${it.section.lab.room})` : 'None'
      })),
      tuition: grandTotalFees
    }

    setSubmissionReceipt(receipt)
    setRegistrationStatus('Pending Advisor Approval')
    setShowSlipModal(true)
    showToast('Schedule successfully submitted to Academic Advisor for formal approval!')
  }

  return (
    <section id="registration" className="py-12 sm:py-16 bg-[#F8FAFC] text-[#0F172A] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── 1. TOP STICKY STATUS BAR ────────────────────────────────────── */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md p-4 mb-6 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Student Info Badge */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-600/20 flex-shrink-0">
                {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 leading-tight">{student.name}</h3>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    ID: {student.studentId}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {student.major} · {student.level}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  <span>Cumulative GPA: <strong className="text-emerald-600 font-bold">{student.cgpa}</strong> / 4.00</span>
                  <span>Campus: <strong>{student.campus}</strong></span>
                  <span>Advisor: <strong>{student.advisor}</strong></span>
                </div>
              </div>
            </div>

            {/* Dynamic Credit Hour Meter & Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              
              {/* Credit Meter */}
              <div className="w-full sm:w-64">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <BookOpen size={13} className="text-indigo-600" />
                    Registered Credits
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {totalRegisteredCredits} / {maxAllowedCredits} Cr
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      totalRegisteredCredits < minRequiredCredits
                        ? 'bg-amber-500'
                        : totalRegisteredCredits > maxAllowedCredits
                        ? 'bg-rose-500'
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${creditPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Min: {minRequiredCredits} Cr</span>
                  {isProbation && <span className="text-rose-500 font-bold">Probation Cap: 12 Cr</span>}
                  <span>Max: {maxAllowedCredits} Cr</span>
                </div>
              </div>

              {/* Status Badge & Primary Action */}
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-sm ${
                  registrationStatus === 'Confirmed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : registrationStatus === 'Pending Advisor Approval'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    registrationStatus === 'Confirmed' ? 'bg-emerald-500' : registrationStatus === 'Pending Advisor Approval' ? 'bg-amber-500' : 'bg-slate-400'
                  }`} />
                  <span>Status: {registrationStatus}</span>
                </div>

                <button
                  onClick={handleSubmitForApproval}
                  disabled={registrationStatus === 'Pending Advisor Approval'}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={15} />
                  <span>Submit to Advisor</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ─── 2. SPLIT-SCREEN WORKSPACE (55% Left Catalog / 45% Right Timetable) ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ═══════════════════════════════════════════════════════════════════
              LEFT PANEL (55% / 7 cols): Smart Course Catalog & Section Picker
             ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Catalog Controls & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                
                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Available', 'Core', 'Electives'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterType(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        filterType === f
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f === 'All' ? 'All Courses' : f === 'Available' ? 'Available to Register' : f}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search code, title, instructor…"
                    className="w-full sm:w-56 pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 bg-slate-50"
                  />
                </div>
              </div>

              {/* Conflict Filter Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span>Showing <strong>{filteredCatalog.length}</strong> academic courses</span>
                </span>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={hideConflicts}
                    onChange={(e) => setHideConflicts(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span>Hide Time Conflicts</span>
                </label>
              </div>
            </div>

            {/* Courses List */}
            <div className="space-y-3.5">
              {filteredCatalog.map((course) => {
                const isSelected = selectedItems.some((it) => it.course.code === course.code)
                const selectedSection = selectedItems.find((it) => it.course.code === course.code)?.section
                const isExpanded = expandedCourseCode === course.code

                return (
                  <div
                    key={course.code}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                      !course.prereqMet
                        ? 'border-slate-200/80 bg-slate-50/70'
                        : isSelected
                        ? 'border-indigo-500 ring-1 ring-indigo-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Course Card Summary Header */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-900 px-2 py-0.5 rounded-md">
                              {course.code}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              course.type.includes('Core')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {course.type}
                            </span>
                            
                            {/* Prerequisite Status Badge */}
                            {course.prereqMet ? (
                              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                                <Check size={11} />
                                Prereq: {course.prereq}
                              </span>
                            ) : (
                              <span className="text-[10px] text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                <Lock size={11} />
                                {course.lockReason}
                              </span>
                            )}
                          </div>

                          <h4 className={`text-base font-bold leading-snug ${course.prereqMet ? 'text-slate-900' : 'text-slate-500'}`}>
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        {/* Credits & Action Trigger */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="text-sm font-bold text-slate-900">
                            {course.credits} Cr
                          </span>

                          {isSelected ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                Sec {selectedSection.sectionNum} Added
                              </span>
                              <button
                                onClick={() => handleDropCourse(course.code)}
                                title="Drop Course"
                                className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ) : course.prereqMet ? (
                            <button
                              onClick={() => setExpandedCourseCode(isExpanded ? null : course.code)}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                              <span>{course.sections.length} Sections</span>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 bg-slate-200/80 px-2.5 py-1 rounded-md">
                              <Lock size={12} />
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Sections Picker */}
                    {course.prereqMet && isExpanded && (
                      <div className="px-4 pb-4 pt-1 bg-slate-50/80 border-t border-slate-100 space-y-2.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Select Lecture + Lab Section:
                        </div>

                        {course.sections.map((section) => {
                          const isSecSelected = selectedSection?.id === section.id
                          const conflict = checkSectionConflict(section, course.code)
                          const isFull = section.enrolled >= section.capacity
                          const capacityPct = (section.enrolled / section.capacity) * 100

                          return (
                            <div
                              key={section.id}
                              onMouseEnter={() => setHoveredSection({ course, section })}
                              onMouseLeave={() => setHoveredSection(null)}
                              className={`p-3.5 rounded-xl border transition-all ${
                                isSecSelected
                                  ? 'bg-indigo-50/80 border-indigo-400 ring-1 ring-indigo-400/40'
                                  : conflict
                                  ? 'bg-rose-50/60 border-rose-200'
                                  : 'bg-white border-slate-200 hover:border-indigo-300'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                
                                {/* Section & Instructor */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                      Section {section.sectionNum}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700">
                                      {section.instructor}
                                    </span>
                                  </div>

                                  {/* Lecture & Lab Schedules */}
                                  <div className="text-xs text-slate-600 space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <Clock size={12} className="text-indigo-600" />
                                      <span>
                                        <strong>Lecture:</strong> {TIMETABLE_DAY_LABELS[section.lecture.day].split(' ')[0]} {section.lecture.start}–{section.lecture.end} ({section.lecture.room})
                                      </span>
                                    </div>
                                    {section.lab && (
                                      <div className="flex items-center gap-1.5 text-slate-500">
                                        <Layers size={12} className="text-cyan-600" />
                                        <span>
                                          <strong>Lab:</strong> {TIMETABLE_DAY_LABELS[section.lab.day].split(' ')[0]} {section.lab.start}–{section.lab.end} ({section.lab.room})
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Seat Capacity Meter & Button */}
                                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 flex-shrink-0">
                                  
                                  {/* Capacity Indicator */}
                                  <div className="text-right">
                                    <span className={`text-xs font-bold ${
                                      isFull
                                        ? 'text-rose-600'
                                        : capacityPct > 85
                                        ? 'text-amber-600'
                                        : 'text-emerald-700'
                                    }`}>
                                      {section.enrolled} / {section.capacity} Seats
                                    </span>
                                    <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                                      <div
                                        className={`h-full rounded-full ${
                                          isFull ? 'bg-rose-500' : capacityPct > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${Math.min(capacityPct, 100)}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Action Button: Register, Swapped, or Waitlist */}
                                  {isSecSelected ? (
                                    <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                                      <CheckCircle2 size={13} />
                                      Enrolled
                                    </span>
                                  ) : conflict ? (
                                    <div className="text-right">
                                      <span className="text-[10px] font-bold text-rose-700 block">
                                        Clash with {conflict.clashCourse}
                                      </span>
                                      <button
                                        disabled
                                        className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed"
                                      >
                                        Time Conflict
                                      </button>
                                    </div>
                                  ) : isFull ? (
                                    <button
                                      onClick={() => showToast(`Joined Waitlist for ${course.code} (Position #${section.waitlist + 1})`)}
                                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-colors"
                                    >
                                      Join Waitlist (#{section.waitlist + 1})
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleAddSection(course, section)}
                                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                                    >
                                      <Plus size={13} />
                                      <span>Add Section</span>
                                    </button>
                                  )}

                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              RIGHT PANEL (45% / 5 cols): Live Weekly Timetable Grid & Cart
             ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-4 sticky top-28">
            
            {/* View Selector Tabs */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex gap-1">
                {[
                  { id: 'calendar', label: 'Weekly Calendar', icon: Calendar },
                  { id: 'list', label: 'Enrolled List', icon: BookOpen },
                  { id: 'tuition', label: 'EGP Tuition', icon: CreditCard },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {selectedItems.length > 0 && (
                <button
                  onClick={handleClearSchedule}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* ─── TAB 1: LIVE WEEKLY TIMETABLE GRID (Sat - Thu, 08:00 - 18:00) ─── */}
            {activeTab === 'calendar' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-600" />
                    <h4 className="font-bold text-sm text-slate-900">
                      Live Weekly Schedule (Sat – Thu)
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    8:00 AM – 6:00 PM
                  </span>
                </div>

                {/* Timetable Grid Container */}
                <div className="mt-3 overflow-x-auto">
                  <div className="min-w-[480px]">
                    
                    {/* Day Headers (6 Days: Sat, Sun, Mon, Tue, Wed, Thu) */}
                    <div className="grid grid-cols-7 gap-1 text-center pb-1 text-[11px] font-bold text-slate-700">
                      <div className="py-1 text-slate-400 font-mono text-[10px]">Time</div>
                      {TIMETABLE_DAYS.map((day) => (
                        <div key={day} className="py-1 bg-slate-100 rounded-lg text-slate-800">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* 10 Hourly Rows (08:00 to 18:00) */}
                    <div className="space-y-1">
                      {TIME_ROWS.map((row) => (
                        <div key={row.start} className="grid grid-cols-7 gap-1 min-h-[38px]">
                          {/* Time Label */}
                          <div className="flex items-center justify-center text-[10px] font-mono font-medium text-slate-400 bg-slate-50 rounded">
                            {row.start}
                          </div>

                          {/* Day Columns */}
                          {TIMETABLE_DAYS.map((day) => {
                            // Find any enrolled class occupying this hour
                            const currentHourDec = timeToDecimal(row.start)

                            // 1. Enrolled Items
                            const matchingEnrolled = []
                            selectedItems.forEach((it) => {
                              // Lecture check
                              if (it.section.lecture.day === day) {
                                const lStart = timeToDecimal(it.section.lecture.start)
                                const lEnd = timeToDecimal(it.section.lecture.end)
                                if (currentHourDec >= Math.floor(lStart) && currentHourDec < Math.ceil(lEnd)) {
                                  matchingEnrolled.push({ course: it.course, section: it.section, session: it.section.lecture, type: 'Lecture' })
                                }
                              }
                              // Lab check
                              if (it.section.lab && it.section.lab.day === day) {
                                const lbStart = timeToDecimal(it.section.lab.start)
                                const lbEnd = timeToDecimal(it.section.lab.end)
                                if (currentHourDec >= Math.floor(lbStart) && currentHourDec < Math.ceil(lbEnd)) {
                                  matchingEnrolled.push({ course: it.course, section: it.section, session: it.section.lab, type: 'Lab' })
                                }
                              }
                            })

                            // 2. Ghost Preview Item (from Hovered Section)
                            let isGhost = false
                            let ghostItem = null
                            if (hoveredSection && matchingEnrolled.length === 0) {
                              const { course, section } = hoveredSection
                              // Lecture ghost
                              if (section.lecture.day === day) {
                                const gStart = timeToDecimal(section.lecture.start)
                                const gEnd = timeToDecimal(section.lecture.end)
                                if (currentHourDec >= Math.floor(gStart) && currentHourDec < Math.ceil(gEnd)) {
                                  isGhost = true
                                  ghostItem = { course, section, session: section.lecture, type: 'Lecture' }
                                }
                              }
                              // Lab ghost
                              if (section.lab && section.lab.day === day) {
                                const gLbStart = timeToDecimal(section.lab.start)
                                const gLbEnd = timeToDecimal(section.lab.end)
                                if (currentHourDec >= Math.floor(gLbStart) && currentHourDec < Math.ceil(gLbEnd)) {
                                  isGhost = true
                                  ghostItem = { course, section, session: section.lab, type: 'Lab' }
                                }
                              }
                            }

                            return (
                              <div
                                key={day}
                                className={`rounded-md transition-all flex flex-col justify-center p-1 text-[10px] leading-tight ${
                                  matchingEnrolled.length > 0
                                    ? 'shadow-sm text-white'
                                    : isGhost
                                    ? 'border-2 border-dashed border-indigo-400 bg-indigo-50/80 animate-pulse text-indigo-700'
                                    : 'border border-slate-100 bg-slate-50/30'
                                }`}
                                style={{
                                  backgroundColor: matchingEnrolled.length > 0 ? (matchingEnrolled[0].course.color || '#4F46E5') : undefined
                                }}
                              >
                                {matchingEnrolled.length > 0 ? (
                                  <div className="flex items-center justify-between">
                                    <div className="truncate">
                                      <strong className="block truncate">{matchingEnrolled[0].course.code}</strong>
                                      <span className="text-[9px] opacity-80 block truncate">{matchingEnrolled[0].session.room}</span>
                                    </div>
                                    <button
                                      onClick={() => handleDropCourse(matchingEnrolled[0].course.code)}
                                      className="p-0.5 hover:text-rose-200 text-white font-bold ml-1"
                                      title={`Drop ${matchingEnrolled[0].course.code}`}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : isGhost ? (
                                  <div className="truncate text-center">
                                    <strong className="block truncate">{ghostItem.course.code}</strong>
                                    <span className="text-[9px] block">(Preview)</span>
                                  </div>
                                ) : null}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Timetable Legend */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block" />
                      Enrolled Block
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded border border-dashed border-indigo-500 bg-indigo-100 inline-block" />
                      Hover Ghost Preview
                    </span>
                  </div>
                  <span>Click ✕ on any block to drop</span>
                </div>
              </div>
            )}

            {/* ─── TAB 2: ENROLLED SUBJECTS LIST ───────────────────────────────── */}
            {activeTab === 'list' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">
                    Registered Subjects ({selectedItems.length})
                  </h4>
                  <span className="font-mono font-bold text-xs text-indigo-600">
                    {totalRegisteredCredits} Credits Total
                  </span>
                </div>

                {selectedItems.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center italic">
                    No courses registered. Add sections from the left catalog.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedItems.map(({ course, section }) => (
                      <div
                        key={course.code}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900">{course.code}</span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                              Sec {section.sectionNum}
                            </span>
                            <span className="text-slate-500 font-semibold">{course.credits} Cr</span>
                          </div>
                          <div className="font-bold text-slate-800 mt-0.5">{course.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Lec: {TIMETABLE_DAY_LABELS[section.lecture.day].split(' ')[0]} {section.lecture.start}–{section.lecture.end} ({section.lecture.room})
                          </div>
                        </div>

                        <button
                          onClick={() => handleDropCourse(course.code)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white font-bold text-xs transition-colors flex items-center gap-1 flex-shrink-0"
                        >
                          <Trash2 size={12} />
                          <span>Drop</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 3: TUITION FEE BREAKDOWN IN EGP ─────────────────────────── */}
            {activeTab === 'tuition' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">
                    Tuition & Fee Breakdown (EGP)
                  </h4>
                  <span className="text-xs text-slate-500">Fall 2026/2027</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Course Tuition ({totalRegisteredCredits} Cr × 4,600 EGP):</span>
                    <span className="font-mono font-bold text-slate-900">{tuitionTotal.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Cape Breton University (Canada) Dual Fee:</span>
                    <span className="font-mono font-bold text-slate-900">{cbuDualFee.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Advanced Engineering & Computing Lab Fee:</span>
                    <span className="font-mono font-bold text-slate-900">{techLabFee.toLocaleString()} EGP</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                    <span>Total Term Dues:</span>
                    <span className="text-indigo-600 font-serif font-extrabold text-base">
                      {grandTotalFees.toLocaleString()} EGP
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 text-center">
                  Payment plans available in 3 installments via National Bank of Egypt (NBE) & Banque Misr.
                </p>
              </div>
            )}

            {/* Bottom Quick Cart Summary & Advisor CTA */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div>
                  <span className="text-slate-500">Selected Schedule:</span>
                  <div className="font-bold text-slate-900">
                    {selectedItems.length} Courses ({totalRegisteredCredits} Credits)
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Total Tuition:</span>
                  <div className="font-bold font-serif text-indigo-600">
                    {grandTotalFees.toLocaleString()} EGP
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitForApproval}
                disabled={registrationStatus === 'Pending Advisor Approval'}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCheck size={16} />
                <span>Submit Schedule for Advisor Approval</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ─── CONFIRMATION & REGISTRATION SLIP MODAL ───────────────────────── */}
      {showSlipModal && submissionReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                  🍁
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider block">
                    Canadian International College (Egypt) · Registrar Office
                  </span>
                  <h3 className="text-xl font-bold font-serif text-white">
                    Official Course Registration Slip
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowSlipModal(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Slip Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Reference Number:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{submissionReceipt.refNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Date & Time:</span>
                  <span className="font-medium text-slate-700">{submissionReceipt.submittedAt}</span>
                </div>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Student Name:</span>
                  <span className="font-bold text-slate-900">{submissionReceipt.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Student ID:</span>
                  <span className="font-mono font-bold text-slate-900">{submissionReceipt.studentId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Faculty Advisor:</span>
                  <span className="font-semibold text-slate-800">{submissionReceipt.advisorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Total Registered:</span>
                  <span className="font-bold text-emerald-700">{submissionReceipt.credits} Credit Hours</span>
                </div>
              </div>

              {/* Registered Courses Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="py-2 px-3">Code</th>
                      <th className="py-2 px-3">Course Title</th>
                      <th className="py-2 px-3">Sec</th>
                      <th className="py-2 px-3">Cr</th>
                      <th className="py-2 px-3">Timings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {submissionReceipt.courses.map((c) => (
                      <tr key={c.code} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{c.code}</td>
                        <td className="py-2 px-3 font-medium text-slate-800">{c.title}</td>
                        <td className="py-2 px-3 font-mono">{c.section}</td>
                        <td className="py-2 px-3 font-bold">{c.credits}</td>
                        <td className="py-2 px-3 text-[10px] text-slate-500">{c.lecture}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Stamped Status */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600" />
                  <span>Submitted to Advisor ({submissionReceipt.advisorName}). Approval pending review.</span>
                </div>
                <span className="font-bold text-[10px] uppercase bg-amber-200 px-2 py-0.5 rounded">
                  Pending Sign-off
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer size={15} />
                  <span>Print Official Slip (PDF)</span>
                </button>
                <button
                  onClick={() => setShowSlipModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
                >
                  Close & Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold animate-fade-up border ${
          toast.type === 'error'
            ? 'bg-rose-900 text-white border-rose-700'
            : toast.type === 'info'
            ? 'bg-slate-900 text-white border-slate-700'
            : 'bg-emerald-900 text-white border-emerald-700'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={15} className="text-rose-400" /> : <CheckCircle2 size={15} className="text-emerald-400" />}
          <span>{toast.text}</span>
        </div>
      )}
    </section>
  )
}
