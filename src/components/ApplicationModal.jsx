import { useState } from 'react'
import { X, CheckCircle2, ChevronRight, ChevronLeft, Upload, FileText, Sparkles, Building, Award, User, GraduationCap, MapPin, Phone, Mail, ShieldCheck, Printer } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ApplicationModal({ isOpen, onClose }) {
  const { addApplication } = useAuth()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    email: '',
    phone: '',
    governorate: 'Cairo',
    certificateType: 'Thanaweya Amma (Egyptian General Secondary)',
    highSchoolScore: '',
    graduationYear: '2026',
    campus: 'New Cairo Campus',
    faculty: 'School of Computer Science',
    major: 'Artificial Intelligence & Data Science',
    dualDegree: true,
  })

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const prefix = formData.campus.includes('Zayed') ? 'CIC-ZYD' : 'CIC-CAI'
    const newId = `${prefix}-2026-${randomNum}`
    setApplicationId(newId)
    setSubmitted(true)

    // Save to AuthContext applications list for Admin review
    if (addApplication) {
      addApplication({
        id: newId,
        fullName: formData.fullName,
        nationalId: formData.nationalId,
        email: formData.email,
        phone: formData.phone,
        governorate: formData.governorate,
        certificateType: formData.certificateType,
        highSchoolScore: formData.highSchoolScore,
        campus: formData.campus,
        faculty: formData.faculty,
        major: formData.major,
        dualDegree: formData.dualDegree,
        status: 'Under Review',
        scholarship: parseFloat(formData.highSchoolScore) >= 90 ? '20% Canadian Merit Scholarship' : 'Standard',
        submittedAt: 'Just now'
      })
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setStep(1)
    onClose()
  }

  // Calculate scholarship estimate based on high school percentage
  const scoreNum = parseFloat(formData.highSchoolScore) || 0
  let scholarshipPct = 0
  if (scoreNum >= 95) scholarshipPct = 30
  else if (scoreNum >= 90) scholarshipPct = 20
  else if (scoreNum >= 85) scholarshipPct = 10

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-up">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full border border-border shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cic-red flex items-center justify-center font-bold text-white shadow-md">
                🍁
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold block">
                  CIC Admissions Portal · Fall 2026/2027
                </span>
                <h2 id="apply-modal-title" className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Apply to Canadian International College (Egypt)
                </h2>
              </div>
            </div>

            <button
              onClick={resetForm}
              aria-label="Close application modal"
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Stepper (Only visible during form filling) */}
          {!submitted && (
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-medium">
              {[
                { num: 1, label: 'Applicant Info' },
                { num: 2, label: 'High School' },
                { num: 3, label: 'Program Choice' },
                { num: 4, label: 'Review & Submit' },
              ].map(({ num, label }) => (
                <div key={num} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step === num
                        ? 'bg-cic-red text-white ring-2 ring-white/50'
                        : step > num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {step > num ? '✓' : num}
                  </div>
                  <span className={`hidden sm:inline ${step === num ? 'text-white font-semibold' : 'text-white/60'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            /* Success View */
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-2">
                  Application Successfully Received
                </span>
                <h3 className="text-2xl font-serif font-bold text-navy-950">
                  Welcome to CIC Egypt, {formData.fullName.split(' ')[0]}!
                </h3>
                <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">
                  Your formal admissions file has been created. A verification email has been dispatched with login credentials.
                </p>
              </div>

              {/* Application Details Card */}
              <div className="bg-navy-50/70 border border-navy-100 rounded-2xl p-5 text-left text-xs sm:text-sm space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-text-muted font-medium">Application Reference:</span>
                  <span className="font-mono font-bold text-navy-950 text-base">{applicationId}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-text-muted block text-xs">Selected Campus:</span>
                    <span className="font-semibold text-navy-950">{formData.campus}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-xs">Degree Track:</span>
                    <span className="font-semibold text-cic-red">
                      {formData.dualDegree ? 'Dual Canadian (CBU) & Egyptian' : 'Egyptian Ministry Degree'}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-xs">Faculty:</span>
                    <span className="font-semibold text-navy-950">{formData.faculty}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-xs">Major:</span>
                    <span className="font-semibold text-navy-950">{formData.major}</span>
                  </div>
                </div>

                {scholarshipPct > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-700 flex items-center gap-2">
                    <Sparkles size={16} className="text-gold-600 flex-shrink-0" />
                    <span className="text-xs font-medium">
                      <strong>Congratulations!</strong> Based on your {formData.highSchoolScore}%, you pre-qualify for a{' '}
                      <strong>{scholarshipPct}% Canadian Academic Merit Scholarship</strong>!
                    </span>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              <div className="bg-white border border-border rounded-xl p-4 text-left text-xs space-y-2">
                <div className="font-bold text-navy-950 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-navy-700" />
                  Next Mandatory Steps:
                </div>
                <ul className="list-disc list-inside space-y-1 text-text-secondary pl-1">
                  <li>Visit the chosen campus ({formData.campus}) within 7 working days to sit for the English & Computer Placement Exam.</li>
                  <li>Bring your original High School Certificate, Birth Certificate, 6 personal photos, and Military Form 2 Gond (for Egyptian male students).</li>
                  <li>Admissions Office Working Hours: Saturday to Thursday, 9:00 AM – 4:00 PM.</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border text-navy-900 font-semibold text-xs hover:bg-navy-50 transition-colors"
                >
                  <Printer size={15} />
                  Print Application Slip
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 px-5 py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-semibold text-xs transition-colors shadow-md"
                >
                  Done / Return to Portal
                </button>
              </div>
            </div>
          ) : (
            /* Multi-Step Form */
            <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1) }}>
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                    <User size={18} className="text-cic-red" />
                    Step 1: Personal & Contact Information
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Full Legal Name (as in Egyptian National ID or Passport) *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Omar Ahmed El-Sayed"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Egyptian National ID (14 Digits) or Passport *
                      </label>
                      <input
                        type="text"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                        placeholder="29801010104829"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Governorate in Egypt *
                      </label>
                      <select
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none bg-white"
                      >
                        {['Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia', 'Dakahlia', 'Gharbia', 'Red Sea', 'Other Governorate'].map((gov) => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="applicant@gmail.com"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Mobile Phone / WhatsApp (+20) *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="01012345678"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: High School Info */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                    <GraduationCap size={18} className="text-cic-red" />
                    Step 2: High School Secondary Education
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Secondary Certificate Type in Egypt *
                    </label>
                    <select
                      name="certificateType"
                      value={formData.certificateType}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none bg-white"
                    >
                      <option value="Thanaweya Amma (Egyptian General Secondary)">Thanaweya Amma (Egyptian General Secondary Certificate)</option>
                      <option value="IGCSE (British Curriculum)">IGCSE / British International Certificate</option>
                      <option value="American High School Diploma (SAT/ACT/EST)">American High School Diploma (EST / SAT)</option>
                      <option value="STEM High School Certificate">STEM Egyptian High School Certificate</option>
                      <option value="Arab Secondary Certificate">Arab General Secondary Certificate (Saudi, UAE, Kuwait, etc.)</option>
                      <option value="International Baccalaureate (IB)">International Baccalaureate (IB)</option>
                      <option value="Canadian High School Diploma">Canadian High School Diploma</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        High School Total Percentage / GPA (%) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="50"
                        max="100"
                        name="highSchoolScore"
                        value={formData.highSchoolScore}
                        onChange={handleInputChange}
                        placeholder="e.g. 88.5"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Graduation Year *
                      </label>
                      <select
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none bg-white"
                      >
                        <option value="2026">2026 (Current Academic Year)</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023 or Earlier">2023 or Earlier</option>
                      </select>
                    </div>
                  </div>

                  {scoreNum > 0 && (
                    <div className="p-3.5 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-navy-950 block">Scholarship Eligibility Status:</span>
                        <span className="text-text-muted">
                          {scholarshipPct > 0 ? `Eligible for ${scholarshipPct}% Canadian Merit Scholarship` : 'Regular Admission Track'}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${scholarshipPct > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-navy-200 text-navy-800'}`}>
                        {scholarshipPct > 0 ? `${scholarshipPct}% Off` : 'Standard'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Program & Campus Choice */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                    <Building size={18} className="text-cic-red" />
                    Step 3: Campus & Academic Program
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Choose CIC Campus in Egypt *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { name: 'New Cairo Campus', loc: 'Fifth Settlement (Near Police Academy)', badge: 'Main Campus' },
                        { name: 'Sheikh Zayed Campus', loc: '6th of October / Sheikh Zayed City', badge: 'West Cairo' }
                      ].map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, campus: c.name })}
                          className={`p-3.5 rounded-xl text-left border transition-all ${
                            formData.campus === c.name
                              ? 'border-cic-red bg-cic-red/5 ring-2 ring-cic-red/20'
                              : 'border-border hover:border-navy-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-navy-950">{c.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-navy-100 text-navy-800 font-medium">
                              {c.badge}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mt-1">{c.loc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      School / Faculty *
                    </label>
                    <select
                      name="faculty"
                      value={formData.faculty}
                      onChange={(e) => {
                        const newFac = e.target.value
                        let defaultMajor = 'Artificial Intelligence & Data Science'
                        if (newFac.includes('Engineering')) defaultMajor = 'Mechatronics Engineering'
                        else if (newFac.includes('Business')) defaultMajor = 'Finance & Banking'
                        else if (newFac.includes('Mass')) defaultMajor = 'Public Relations & Advertising'
                        setFormData({ ...formData, faculty: newFac, major: defaultMajor })
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none bg-white"
                    >
                      <option value="School of Computer Science">School of Computer Science & Information Technology (4 Years)</option>
                      <option value="School of Engineering">School of Engineering (5 Years - Syndicate Accredited)</option>
                      <option value="School of Business Administration">School of Business Administration (4 Years)</option>
                      <option value="School of Mass Communication">School of Mass Communication (4 Years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Specific Major / Specialization *
                    </label>
                    <select
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-cic-red focus:ring-2 focus:ring-cic-red/20 outline-none bg-white"
                    >
                      {formData.faculty.includes('Computer Science') && [
                        'Artificial Intelligence & Data Science',
                        'Software Engineering & Cloud Architecture',
                        'Game Development & Virtual Reality',
                        'Cybersecurity & Network Defense'
                      ].map((m) => <option key={m} value={m}>{m}</option>)}

                      {formData.faculty.includes('Engineering') && [
                        'Mechatronics Engineering',
                        'Architectural Engineering',
                        'Civil & Construction Engineering',
                        'Communications & Electronics Engineering'
                      ].map((m) => <option key={m} value={m}>{m}</option>)}

                      {formData.faculty.includes('Business') && [
                        'Finance & Banking',
                        'Marketing & Digital Strategies',
                        'Accounting & Auditing',
                        'Human Resource Management'
                      ].map((m) => <option key={m} value={m}>{m}</option>)}

                      {formData.faculty.includes('Mass') && [
                        'Public Relations & Advertising',
                        'Broadcasting & Electronic Media',
                        'Digital Journalism'
                      ].map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  {/* Dual Degree CBU Canada Checkbox */}
                  <div className="p-4 rounded-xl border border-gold-500/30 bg-gradient-to-r from-gold-500/10 to-transparent flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="dualDegree"
                      name="dualDegree"
                      checked={formData.dualDegree}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded text-cic-red focus:ring-cic-red border-border"
                    />
                    <label htmlFor="dualDegree" className="text-xs text-navy-950 cursor-pointer">
                      <strong className="block text-navy-950">Enroll in Canadian Dual Degree (Cape Breton University - Canada)</strong>
                      <span className="text-text-secondary">
                        Graduate with two bachelor degrees: one accredited by the Egyptian Ministry of Higher Education and one direct Canadian Bachelor degree from CBU in Nova Scotia, Canada.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                    <FileText size={18} className="text-cic-red" />
                    Step 4: Review Your Application Details
                  </h3>

                  <div className="bg-background rounded-2xl p-4 border border-border space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between border-b border-border/80 pb-2">
                      <span className="text-text-muted">Applicant:</span>
                      <span className="font-semibold text-navy-950">{formData.fullName || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/80 pb-2">
                      <span className="text-text-muted">National ID / Passport:</span>
                      <span className="font-mono font-medium text-navy-950">{formData.nationalId || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/80 pb-2">
                      <span className="text-text-muted">High School Certificate:</span>
                      <span className="font-medium text-navy-950">{formData.certificateType} ({formData.highSchoolScore || '0'}%)</span>
                    </div>
                    <div className="flex justify-between border-b border-border/80 pb-2">
                      <span className="text-text-muted">Campus:</span>
                      <span className="font-semibold text-cic-red">{formData.campus}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/80 pb-2">
                      <span className="text-text-muted">Program & Major:</span>
                      <span className="font-semibold text-navy-950">{formData.major} ({formData.faculty})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Degree Dual Accreditation:</span>
                      <span className="font-semibold text-emerald-700">
                        {formData.dualDegree ? 'Canadian (CBU) + Egyptian Degree' : 'Egyptian Ministry Only'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-50 text-xs text-text-secondary flex items-start gap-2">
                    <ShieldCheck size={16} className="text-navy-700 flex-shrink-0 mt-0.5" />
                    <span>
                      By submitting this form, you acknowledge that all information is truthful according to Egyptian Supreme Council of Universities regulations. There are no fees to submit your initial application.
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-navy-900 hover:bg-navy-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-cic-red hover:bg-cic-red-dark text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-cic-red/20"
                >
                  {step === 4 ? (
                    <>
                      <span>Submit Official Application</span>
                      <CheckCircle2 size={16} />
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
