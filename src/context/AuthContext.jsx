import { createContext, useContext, useState, useEffect } from 'react'

// Demo Accounts setup by Admin
export const DEMO_ACCOUNTS = {
  admin: {
    id: 'ADM-001',
    name: 'Dr. Magdy Abdel-Rahman',
    title: 'Dean of Admissions & University Registrar',
    email: 'admin@cic-cairo.com',
    role: 'admin',
    campus: 'New Cairo & Sheikh Zayed (All Campuses)',
    department: 'Registrar & Academic Affairs Office'
  },
  studentCS: {
    id: 'STU-20230849',
    studentId: '20230849',
    name: 'Karim Mostafa Hassan',
    email: 'karim.mostafa@cic.edu.eg',
    role: 'student',
    faculty: 'School of Computer Science & IT',
    major: 'Artificial Intelligence & Data Science',
    level: 'Level 3 (Junior)',
    campus: 'New Cairo Campus',
    gpa: '3.48 / 4.00',
    advisor: 'Dr. Tarek Mansour',
    dualDegree: true,
    enrolledCourses: ['CS301', 'CBU101']
  },
  studentEng: {
    id: 'STU-20220194',
    studentId: '20220194',
    name: 'Nour Zaki Mansour',
    email: 'nour.zaki@cic.edu.eg',
    role: 'student',
    faculty: 'School of Engineering',
    major: 'Mechatronics Engineering (5 Years)',
    level: 'Level 4 (Senior 1)',
    campus: 'Sheikh Zayed Campus',
    gpa: '3.71 / 4.00',
    advisor: 'Dr. Hesham Kamel',
    dualDegree: true,
    enrolledCourses: ['ENG210', 'CBU101']
  }
}

// Initial Applications submitted to Admin
export const INITIAL_APPLICATIONS = [
  {
    id: 'CIC-CAI-2026-948102',
    fullName: 'Youssef Ahmed El-Gamal',
    nationalId: '30509180102948',
    email: 'youssef.gamal@gmail.com',
    phone: '01098765432',
    governorate: 'Cairo',
    certificateType: 'Thanaweya Amma (Egyptian General Secondary)',
    highSchoolScore: '92.4',
    campus: 'New Cairo Campus',
    faculty: 'School of Computer Science',
    major: 'Artificial Intelligence & Data Science',
    dualDegree: true,
    status: 'Conditionally Accepted',
    scholarship: '20% Canadian Merit Scholarship',
    submittedAt: 'Oct 22, 2026'
  },
  {
    id: 'CIC-ZYD-2026-481920',
    fullName: 'Farida Tarek Soliman',
    nationalId: '30602120108392',
    email: 'farida.soliman@hotmail.com',
    phone: '01123456789',
    governorate: 'Giza',
    certificateType: 'IGCSE (British International Certificate)',
    highSchoolScore: '96.8',
    campus: 'Sheikh Zayed Campus',
    faculty: 'School of Engineering',
    major: 'Mechatronics Engineering',
    dualDegree: true,
    status: 'Under Review',
    scholarship: '30% Canadian Merit Scholarship',
    submittedAt: 'Oct 23, 2026'
  }
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Current logged in user (default null, or can be set to any demo account)
  const [currentUser, setCurrentUser] = useState(null)
  
  // Student roster created/managed by Admin
  const [students, setStudents] = useState([
    DEMO_ACCOUNTS.studentCS,
    DEMO_ACCOUNTS.studentEng
  ])

  // Applications list reviewed by Admin
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS)

  // Login with email or student ID
  const login = (identifier, password) => {
    const trimmed = identifier.trim().toLowerCase()
    
    // Check admin
    if (trimmed === 'admin@cic-cairo.com' || trimmed === 'admin') {
      setCurrentUser(DEMO_ACCOUNTS.admin)
      return { success: true, user: DEMO_ACCOUNTS.admin }
    }

    // Check students
    const found = students.find(
      (s) => s.email.toLowerCase() === trimmed || s.studentId === identifier.trim()
    )

    if (found) {
      setCurrentUser(found)
      return { success: true, user: found }
    }

    // Fallback: if user enters demo keywords
    if (trimmed.includes('karim') || trimmed.includes('cs')) {
      setCurrentUser(DEMO_ACCOUNTS.studentCS)
      return { success: true, user: DEMO_ACCOUNTS.studentCS }
    }
    if (trimmed.includes('nour') || trimmed.includes('eng')) {
      setCurrentUser(DEMO_ACCOUNTS.studentEng)
      return { success: true, user: DEMO_ACCOUNTS.studentEng }
    }

    return { success: false, message: 'Invalid credentials. Please use the quick demo accounts below.' }
  }

  // Quick 1-click Demo Login
  const loginAsDemo = (roleKey) => {
    if (roleKey === 'admin') setCurrentUser(DEMO_ACCOUNTS.admin)
    else if (roleKey === 'studentCS') setCurrentUser(DEMO_ACCOUNTS.studentCS)
    else if (roleKey === 'studentEng') setCurrentUser(DEMO_ACCOUNTS.studentEng)
  }

  const logout = () => {
    setCurrentUser(null)
  }

  // Admin function: Create a new student account
  const createStudentAccount = (studentData) => {
    const newIdNum = Math.floor(20260000 + Math.random() * 9999)
    const newStudent = {
      id: `STU-${newIdNum}`,
      studentId: `${newIdNum}`,
      name: studentData.name,
      email: studentData.email || `${studentData.name.toLowerCase().replace(/\s+/g, '.')}@cic.edu.eg`,
      role: 'student',
      faculty: studentData.faculty,
      major: studentData.major,
      level: studentData.level || 'Level 1 (Freshman)',
      campus: studentData.campus || 'New Cairo Campus',
      gpa: studentData.gpa || '3.50 / 4.00',
      advisor: studentData.advisor || 'Dr. Tarek Mansour',
      dualDegree: studentData.dualDegree !== false,
      enrolledCourses: studentData.enrolledCourses || ['CBU101']
    }

    setStudents((prev) => [newStudent, ...prev])
    return newStudent
  }

  // Add new applicant submission from ApplicationModal
  const addApplication = (appData) => {
    setApplications((prev) => [appData, ...prev])
  }

  // Admin function: Update application status (Approve / Reject / Conditional)
  const updateApplicationStatus = (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    )
  }

  // Student function: Update enrolled courses
  const updateStudentCourses = (courseIds) => {
    if (!currentUser || currentUser.role !== 'student') return
    const updated = { ...currentUser, enrolledCourses: courseIds }
    setCurrentUser(updated)
    setStudents((prev) =>
      prev.map((s) => (s.studentId === updated.studentId ? updated : s))
    )
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginAsDemo,
        logout,
        students,
        applications,
        createStudentAccount,
        addApplication,
        updateApplicationStatus,
        updateStudentCourses
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
