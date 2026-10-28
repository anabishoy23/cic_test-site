# 🎓 Apex Institute / CIC Egypt - University Course Registration System & Live Schedule Builder

An interactive, modern, full-stack University Course Registration and Management Platform built with **React**, **Tailwind CSS**, and **Lucide Icons**, paired with a **Normalized (3NF) PostgreSQL Relational Database Schema**.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql&logoColor=white)

---

## 🚀 Key Features

### 1. Split-Screen Live Schedule Builder (Workspace UX)
- **Top Sticky Status Bar:**
  - Student identity badge: Name, Student ID, Major (Computer Science & AI), Level, and CGPA (`3.42`).
  - **Dynamic Credit Hour Meter:** Visual progress bar tracking registered credits against CGPA-derived limits ($12$ to $18$ Cr; capped at $12$ Cr if CGPA $< 2.00$).
  - **Academic Workflow Status:** Real-time state badge (`Draft` $\rightarrow$ `Pending Advisor Approval` $\rightarrow$ `Confirmed`).
- **Left Panel (55%): Smart Course Catalog & Section Picker:**
  - **Prerequisite Lock Badges:** Clear lock indicators explaining unmet dependencies (e.g., *Requires CS340 with grade $\ge$ C*).
  - **Paired Lecture & Lab/Tutorial Sections:** Expandable accordions with designated physical rooms (Hall B2, Software Lab 4) and professors.
  - **Live Seat Capacity:** Real-time capacity indicators (Emerald $\le 85\%$, Amber $> 85\%$, Rose $100\%$ full $\rightarrow$ replaced with **"Join Waitlist (#3)"**).
- **Right Panel (45%): Live Timetable Grid & Cart:**
  - **Real-Time Timetable Clash Detection:** On hovering over an unselected section, displays a semi-transparent ghost preview on the calendar. Overlaps are highlighted in red with an explicit collision alert (*Time Clash with CS301 (Sun 10:00 AM)*) and the registration button is disabled.
  - **Egyptian University Schedule Matrix:** Saturday through Thursday, 8:00 AM to 6:00 PM.
  - **One-Click Direct Drop:** Fast drop (`×`) button directly on calendar event cards.
  - **Multi-View Tabs:** Switch between **Weekly Calendar**, **Enrolled List View**, and **Tuition Fee Breakdown (EGP)**.
  - **Advisor Approval Flow:** Generates an official printable Registration Slip modal with an academic reference code (`CIC-REG-2026-XXXXXX`).

---

### 2. Normalized (3NF) PostgreSQL Database Architecture (`database_schema.sql`)
The backend database is normalized to Third Normal Form (3NF) and includes production PL/pgSQL validation routines:

1. **`students`**: Matriculation ID, academic level, CGPA, and stored generated column `max_allowed_credits`.
2. **`courses`**: Course catalog, contact hours, lecture/lab split, and course classifications.
3. **`prerequisites`**: Dependency hierarchy mapping with required grade point thresholds.
4. **`completed_courses`**: Historical student transcript entries with stored generated `passed` boolean.
5. **`course_sections`**: Section offerings, instructor assignment, and atomic capacity counters.
6. **`section_schedules`**: Time blocks with validated `end_time > start_time` constraints.
7. **`registrations`**: Registration cart, enrolled status, and advisor sign-off.

#### PL/pgSQL Stored Procedures & Concurrency Triggers:
* `fn_check_prerequisites(student_id, course_code)`: Evaluates transcript against prerequisite requirements.
* `fn_detect_time_conflicts(student_id, section_id)`: Mathematical overlap detection `(StartA < EndB) AND (EndA > StartB)` across matching days.
* `fn_check_credit_limits(student_id, section_id)`: Enforces credit ceilings based on student standing (regular vs probation).
* `trg_atomic_seat_capacity()`: Concurrency trigger with `SELECT ... FOR UPDATE` row-level locks that manages capacity and auto-routes overflow to waitlists.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Tailwind CSS v4, Lucide React, Vite
- **Styling:** Custom CSS design system with HSL variables, smooth transitions, and high-contrast accessibility (WCAG AA)
- **Database:** PostgreSQL 14+ (PL/pgSQL)

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [PostgreSQL](https://www.postgresql.org/) (optional, for running the SQL schema)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/university-course-registration.git
cd university-course-registration
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 🗄️ Database Setup (PostgreSQL)

To deploy the schema and seed data into a local or remote PostgreSQL instance:
```bash
psql -U postgres -d your_database_name -f database_schema.sql
```

This will automatically create all tables, indexes, PL/pgSQL validation functions, triggers, and test scenarios.

---

## 📁 Project Structure

```
├── database_schema.sql        # Complete 3NF PostgreSQL DDL, Triggers & Test Cases
├── index.html                 # HTML Entry point
├── package.json               # Node.js dependencies & scripts
├── vite.config.js             # Vite configuration
├── src/
│   ├── App.jsx                # Main Application container
│   ├── index.css              # Tailwind CSS imports & global design tokens
│   ├── main.jsx               # React entry point
│   ├── context/
│   │   └── AuthContext.jsx    # Student & Admin demo authentication provider
│   └── components/
│       ├── CourseRegistration.jsx # Split-Screen Schedule Builder & Catalog
│       ├── AdminPanel.jsx         # Administrative Course & Student Management
│       ├── ProgramFinder.jsx      # Academic Majors & Programs Directory
│       ├── ApplicationModal.jsx   # Online Admissions application form
│       ├── Header.jsx             # Navigation header
│       ├── Hero.jsx               # Campus hero banner
│       ├── CampusLife.jsx         # Facilities & student activities
│       ├── NewsEvents.jsx         # Academic calendar & news
│       ├── AlumniSpotlight.jsx    # Alumni success stories
│       ├── UtilityBar.jsx         # Portal quick-links
│       └── Footer.jsx             # Campus contact & accreditation links
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
