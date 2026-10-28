import { useState } from 'react'
import { X, UserPlus, Users, FileCheck, CheckCircle2, ShieldCheck, Search, Filter, Sparkles, Building, ChevronRight, AlertCircle, ArrowUpRight, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminPanel({ isOpen, onClose, onSwitchToStudent }) {
  const { currentUser, students, applications, createStudentAccount, updateApplicationStatus, loginAsDemo } = useAuth()
  const [activeTab, setActiveTab] = useState('students') // 'students' | 'create' | 'applications'

  // New Student Form State
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    email: '',
    faculty: 'School of Computer Science & IT',
    major: 'Artificial Intelligence & Data Science',
    level: 'Level 1 (Freshman)',
    campus: 'New Cairo Campus',
    gpa: '3.60 / 4.00',
    advisor: 'Dr. Tarek Mansour',
    dualDegree: true
  })
  const [createdStudentSuccess, setCreatedStudentSuccess] = useState(null)

  if (!isOpen) return null

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    if (!newStudentData.name.trim()) return

    const student = createStudentAccount(newStudentData)
    setCreatedStudentSuccess(student)
    setNewStudentData({
      name: '',
      email: '',
      faculty: 'School of Computer Science & IT',
      major: 'Artificial Intelligence & Data Science',
      level: 'Level 1 (Freshman)',
      campus: 'New Cairo Campus',
      gpa: '3.60 / 4.00',
      advisor: 'Dr. Tarek Mansour',
      dualDegree: true
    })
  }

  const handleConvertApplicantToStudent = (app) => {
    const student = createStudentAccount({
      name: app.fullName,
      email: app.email,
      faculty: app.faculty,
      major: app.major,
      level: 'Level 1 (Freshman)',
      campus: app.campus,
      gpa: '3.50 / 4.00',
      advisor: 'Dr. Tarek Mansour',
      dualDegree: app.dualDegree
    })
    updateApplicationStatus(app.id, 'Enrolled as Student')
    alert(`Success! ${app.fullName} has been officially converted into an enrolled student with Student ID: ${student.studentId}.`)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-up">
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-panel-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-600 text-navy-950 flex items-center justify-center font-bold text-xl shadow-lg">
                <ShieldCheck size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="admin-panel-title" className="text-xl sm:text-2xl font-serif font-bold text-white">
                    Registrar & Admin Control Center
                  </h2>
                  <span className="text-[10px] bg-gold-500/20 text-gold-300 border border-gold-500/30 px-2 py-0.5 rounded-full font-bold">
                    OFFICIAL ACCESS
                  </span>
                </div>
                <p className="text-xs text-white/75 mt-0.5">
                  Logged in as: <strong>{currentUser?.name || 'CIC Registrar'}</strong> · Canadian International College (Egypt)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close admin control panel"
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            <button
              onClick={() => { setActiveTab('students'); setCreatedStudentSuccess(null) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'students'
                  ? 'bg-white text-navy-950 shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users size={16} />
              <span>Student Directory ({students.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('create'); setCreatedStudentSuccess(null) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'create'
                  ? 'bg-cic-red text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus size={16} />
              <span>+ Create Student Account</span>
            </button>

            <button
              onClick={() => { setActiveTab('applications'); setCreatedStudentSuccess(null) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'applications'
                  ? 'bg-gold-600 text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileCheck size={16} />
              <span>Admissions Applications ({applications.length})</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-grow">
          {/* Tab 1: Student Directory */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <h3 className="font-bold text-navy-950 text-base">Authorized Student Accounts</h3>
                  <p className="text-xs text-text-secondary">
                    All accounts created and vetted by university administration. You can switch to any student account below to test their registration portal.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('create')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cic-red text-white text-xs font-bold shadow-sm"
                >
                  <UserPlus size={14} />
                  <span>Create Account</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.map((student) => (
                  <div
                    key={student.studentId}
                    className="p-5 rounded-2xl border border-border bg-white hover:border-navy-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-navy-900 text-white font-bold flex items-center justify-center text-xs">
                            {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-navy-950">{student.name}</h4>
                            <span className="text-xs text-text-muted font-mono">ID: {student.studentId}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-navy-50 text-navy-700 text-[10px] font-bold">
                          {student.level}
                        </span>
                      </div>

                      <div className="mt-3.5 pt-3 border-t border-border/70 space-y-1.5 text-xs text-text-secondary">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Faculty:</span>
                          <span className="font-semibold text-navy-950 truncate max-w-[200px]">{student.faculty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Major:</span>
                          <span className="font-semibold text-navy-950 truncate max-w-[200px]">{student.major}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Campus:</span>
                          <span className="font-medium text-navy-900">{student.campus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Cumulative GPA:</span>
                          <span className="font-mono font-bold text-emerald-700">{student.gpa}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-[11px] text-cic-red font-semibold flex items-center gap-1">
                        <span>🍁</span>
                        <span>CBU Canadian Track</span>
                      </span>

                      <button
                        onClick={() => {
                          if (student.studentId === '20230849') loginAsDemo('studentCS')
                          else if (student.studentId === '20220194') loginAsDemo('studentEng')
                          else {
                            // Custom newly created student login
                            onSwitchToStudent(student)
                          }
                          onClose()
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-800 text-white text-xs font-bold transition-colors"
                      >
                        <LogIn size={13} />
                        <span>Try As This Student</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Create Student Account Form */}
          {activeTab === 'create' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-navy-950 text-base flex items-center gap-2">
                  <UserPlus size={18} className="text-cic-red" />
                  <span>Admin Creation of Official Student Credentials</span>
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  University policy mandates that all matriculated student accounts are provisioned directly by the Registrar Office upon document verification.
                </p>
              </div>

              {createdStudentSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 animate-fade-up">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span>Account Created Successfully!</span>
                  </div>
                  <p className="text-xs">
                    New Student: <strong>{createdStudentSuccess.name}</strong> · Assigned Student ID:{' '}
                    <strong className="font-mono">{createdStudentSuccess.studentId}</strong> · Campus:{' '}
                    <strong>{createdStudentSuccess.campus}</strong>
                  </p>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        onSwitchToStudent(createdStudentSuccess)
                        onClose()
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      ⚡ Switch & Try Website as {createdStudentSuccess.name.split(' ')[0]}
                    </button>
                    <button
                      onClick={() => setActiveTab('students')}
                      className="px-4 py-2 rounded-xl border border-emerald-300 bg-white text-emerald-800 text-xs font-semibold"
                    >
                      View in Student Directory
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-4 bg-navy-50/50 p-5 rounded-2xl border border-navy-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      value={newStudentData.name}
                      onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                      placeholder="e.g. Marwan Hany Soliman"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-navy-900 outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      University Email (Optional, auto-generated)
                    </label>
                    <input
                      type="email"
                      value={newStudentData.email}
                      onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                      placeholder="e.g. marwan.hany@cic.edu.eg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-navy-900 outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Campus *
                    </label>
                    <select
                      value={newStudentData.campus}
                      onChange={(e) => setNewStudentData({ ...newStudentData, campus: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-navy-900 outline-none bg-white"
                    >
                      <option value="New Cairo Campus">New Cairo Campus (Fifth Settlement)</option>
                      <option value="Sheikh Zayed Campus">Sheikh Zayed Campus (6th of October)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Academic Level *
                    </label>
                    <select
                      value={newStudentData.level}
                      onChange={(e) => setNewStudentData({ ...newStudentData, level: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-navy-900 outline-none bg-white"
                    >
                      <option value="Level 1 (Freshman)">Level 1 (Freshman)</option>
                      <option value="Level 2 (Sophomore)">Level 2 (Sophomore)</option>
                      <option value="Level 3 (Junior)">Level 3 (Junior)</option>
                      <option value="Level 4 (Senior)">Level 4 (Senior)</option>
                      <option value="Level 5 (Engineering Final)">Level 5 (Engineering Final)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Faculty / School *
                    </label>
                    <select
                      value={newStudentData.faculty}
                      onChange={(e) => {
                        const newFac = e.target.value
                        let defaultMajor = 'Artificial Intelligence & Data Science'
                        if (newFac.includes('Engineering')) defaultMajor = 'Mechatronics Engineering (5 Years)'
                        else if (newFac.includes('Business')) defaultMajor = 'Finance & Banking'
                        else if (newFac.includes('Mass')) defaultMajor = 'Public Relations & Advertising'
                        setNewStudentData({ ...newStudentData, faculty: newFac, major: defaultMajor })
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-navy-900 outline-none bg-white"
                    >
                      <option value="School of Computer Science & IT">School of Computer Science & IT</option>
                      <option value="School of Engineering">School of Engineering (5 Years)</option>
                      <option value="School of Business Administration">School of Business Administration</option>
                      <option value="School of Mass Communication">School of Mass Communication</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Major *
                    </label>
                    <input
                      type="text"
                      value={newStudentData.major}
                      onChange={(e) => setNewStudentData({ ...newStudentData, major: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:border-navy-900 outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-gold-500/30 bg-gold-500/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🍁</span>
                    <span className="font-semibold text-navy-950">Enroll in Cape Breton University (CBU, Canada) Dual Degree</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newStudentData.dualDegree}
                    onChange={(e) => setNewStudentData({ ...newStudentData, dualDegree: e.target.checked })}
                    className="h-4 w-4 text-cic-red rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} />
                  <span>Issue Student ID & Create Credentials</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 3: Admissions Applications Review */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-navy-950 text-base flex items-center gap-2">
                  <FileCheck size={18} className="text-gold-600" />
                  <span>Incoming Admissions Applications (Fall 2026/2027)</span>
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Review applicant certificates, approve placement tests, or convert accepted applicants directly into enrolled student accounts.
                </p>
              </div>

              <div className="space-y-3.5">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl border border-border bg-white hover:border-navy-300 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-navy-950">{app.fullName}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            app.status === 'Enrolled as Student'
                              ? 'bg-purple-100 text-purple-800'
                              : app.status.includes('Accepted')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <span className="text-xs text-text-muted font-mono">{app.id}</span>
                      </div>

                      <div className="text-xs text-right">
                        <span className="font-semibold text-navy-950 block">{app.campus}</span>
                        <span className="text-text-muted">Submitted: {app.submittedAt}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-y border-border/70 text-xs">
                      <div>
                        <span className="text-text-muted block text-[11px]">Certificate:</span>
                        <span className="font-medium text-navy-950 truncate block">{app.certificateType}</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[11px]">High School Score:</span>
                        <span className="font-mono font-bold text-emerald-700">{app.highSchoolScore}%</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[11px]">Chosen Faculty:</span>
                        <span className="font-medium text-navy-950 truncate block">{app.faculty}</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[11px]">Merit Scholarship:</span>
                        <span className="font-bold text-gold-700">{app.scholarship || 'Standard'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="text-xs text-text-muted">
                        National ID: <code className="font-mono text-navy-900">{app.nationalId}</code> · Phone: <code className="font-mono">{app.phone}</code>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.status !== 'Enrolled as Student' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'Conditionally Accepted')}
                              className="px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-colors"
                            >
                              Approve / Accept
                            </button>
                            <button
                              onClick={() => handleConvertApplicantToStudent(app)}
                              className="px-3 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold transition-colors shadow-sm"
                            >
                              + Convert to Student Account
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
