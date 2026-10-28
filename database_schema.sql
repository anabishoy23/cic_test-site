-- ==============================================================================
-- UNIVERSITY COURSE REGISTRATION SYSTEM (CREDIT-HOUR MODEL)
-- Normalized (3NF) Relational Database Schema & Concurrency Validation Logic
-- Target DBMS: PostgreSQL 14+
-- Institution: Canadian International College (CIC Egypt) & Cape Breton University
-- ==============================================================================

-- 0. CLEANUP & EXTENSIONS
DROP TRIGGER IF EXISTS trg_atomic_seat_capacity ON registrations;
DROP TRIGGER IF EXISTS trg_enforce_registration_rules ON registrations;
DROP FUNCTION IF EXISTS trg_manage_seat_capacity();
DROP FUNCTION IF EXISTS fn_register_student_atomic(VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS fn_check_prerequisites(VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS fn_detect_time_conflicts(VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS fn_check_credit_limits(VARCHAR, VARCHAR);

DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS section_schedules CASCADE;
DROP TABLE IF EXISTS course_sections CASCADE;
DROP TABLE IF EXISTS completed_courses CASCADE;
DROP TABLE IF EXISTS prerequisites CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- ==============================================================================
-- 1. CORE RELATIONAL TABLES (NORMALIZED TO 3NF)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Table 1: students
-- Represents registered university students with academic standing & credit caps
-- ------------------------------------------------------------------------------
CREATE TABLE students (
    student_id          VARCHAR(20) PRIMARY KEY,
    full_name           VARCHAR(150) NOT NULL,
    major               VARCHAR(100) NOT NULL DEFAULT 'Computer Science',
    level               VARCHAR(30) NOT NULL DEFAULT 'Level 3',
    cgpa                NUMERIC(3, 2) NOT NULL CHECK (cgpa >= 0.00 AND cgpa <= 4.00),
    academic_status     VARCHAR(30) NOT NULL DEFAULT 'Regular' 
                        CHECK (academic_status IN ('Regular', 'Probation', 'Suspended', 'Honors')),
    -- Dynamic Credit Cap Rule: If CGPA < 2.00, cap at 12 Cr (Probation); otherwise regular 18 Cr
    max_allowed_credits SMALLINT GENERATED ALWAYS AS (
                            CASE 
                                WHEN cgpa < 2.00 THEN 12 
                                ELSE 18 
                            END
                        ) STORED,
    advisor_id          VARCHAR(50),
    advisor_name        VARCHAR(150),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- Table 2: courses
-- Master catalog of academic courses with lecture/lab contact hours
-- ------------------------------------------------------------------------------
CREATE TABLE courses (
    course_code         VARCHAR(15) PRIMARY KEY,
    title               VARCHAR(200) NOT NULL,
    credit_hours        SMALLINT NOT NULL CHECK (credit_hours > 0 AND credit_hours <= 6),
    lecture_hours       SMALLINT NOT NULL DEFAULT 3 CHECK (lecture_hours >= 0),
    lab_hours           SMALLINT NOT NULL DEFAULT 0 CHECK (lab_hours >= 0),
    course_type         VARCHAR(40) NOT NULL 
                        CHECK (course_type IN ('Core Mandatory', 'Major Elective', 'University Elective')),
    department          VARCHAR(100) NOT NULL DEFAULT 'Computer Science',
    description         TEXT
);

-- ------------------------------------------------------------------------------
-- Table 3: prerequisites
-- Junction table mapping course dependency hierarchies and minimum grade thresholds
-- ------------------------------------------------------------------------------
CREATE TABLE prerequisites (
    course_code         VARCHAR(15) NOT NULL REFERENCES courses(course_code) ON DELETE CASCADE,
    prereq_course_code  VARCHAR(15) NOT NULL REFERENCES courses(course_code) ON DELETE RESTRICT,
    min_passing_grade   VARCHAR(5) NOT NULL DEFAULT 'C',
    min_grade_points    NUMERIC(3, 2) NOT NULL DEFAULT 2.00 CHECK (min_grade_points >= 0.00 AND min_grade_points <= 4.00),
    PRIMARY KEY (course_code, prereq_course_code),
    CHECK (course_code <> prereq_course_code)
);

-- ------------------------------------------------------------------------------
-- Table 4: completed_courses
-- Historical transcript of completed courses and official letter grades
-- ------------------------------------------------------------------------------
CREATE TABLE completed_courses (
    transcript_id       BIGSERIAL PRIMARY KEY,
    student_id          VARCHAR(20) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    course_code         VARCHAR(15) NOT NULL REFERENCES courses(course_code) ON DELETE RESTRICT,
    semester_id         VARCHAR(20) NOT NULL, -- e.g., 'Fall 2024', 'Spring 2025'
    grade               VARCHAR(5) NOT NULL,  -- e.g., 'A', 'B+', 'C', 'D', 'F'
    grade_points        NUMERIC(3, 2) NOT NULL CHECK (grade_points >= 0.00 AND grade_points <= 4.00),
    passed              BOOLEAN GENERATED ALWAYS AS (grade_points >= 2.00) STORED,
    completed_at        DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT uq_student_course_completion UNIQUE (student_id, course_code, semester_id)
);

-- ------------------------------------------------------------------------------
-- Table 5: course_sections
-- Specific semester class offerings with instructor and seat capacity limits
-- ------------------------------------------------------------------------------
CREATE TABLE course_sections (
    section_id          VARCHAR(30) PRIMARY KEY, -- e.g., 'CS301-S01-F26'
    course_code         VARCHAR(15) NOT NULL REFERENCES courses(course_code) ON DELETE RESTRICT,
    semester_id         VARCHAR(20) NOT NULL,    -- e.g., 'Fall 2026'
    section_number      VARCHAR(10) NOT NULL,    -- e.g., '01', '02'
    instructor_name     VARCHAR(150) NOT NULL,
    max_capacity        INTEGER NOT NULL CHECK (max_capacity > 0),
    enrolled_count      INTEGER NOT NULL DEFAULT 0 CHECK (enrolled_count >= 0 AND enrolled_count <= max_capacity),
    waitlist_count      INTEGER NOT NULL DEFAULT 0 CHECK (waitlist_count >= 0),
    CONSTRAINT uq_course_semester_section UNIQUE (course_code, semester_id, section_number)
);

-- ------------------------------------------------------------------------------
-- Table 6: section_schedules
-- Physical meeting times (Lectures, Labs, Tutorials) within the academic week
-- ------------------------------------------------------------------------------
CREATE TABLE section_schedules (
    schedule_id         BIGSERIAL PRIMARY KEY,
    section_id          VARCHAR(30) NOT NULL REFERENCES course_sections(section_id) ON DELETE CASCADE,
    session_type        VARCHAR(20) NOT NULL CHECK (session_type IN ('Lecture', 'Lab', 'Tutorial')),
    day_of_week         VARCHAR(10) NOT NULL CHECK (day_of_week IN ('Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri')),
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    room_code           VARCHAR(50) NOT NULL,
    CONSTRAINT chk_valid_time_interval CHECK (end_time > start_time)
);

-- ------------------------------------------------------------------------------
-- Table 7: registrations
-- Student course enrollment cart, active enrollments, and advisor approval workflow
-- ------------------------------------------------------------------------------
CREATE TABLE registrations (
    registration_id     BIGSERIAL PRIMARY KEY,
    student_id          VARCHAR(20) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    section_id          VARCHAR(30) NOT NULL REFERENCES course_sections(section_id) ON DELETE RESTRICT,
    status              VARCHAR(20) NOT NULL DEFAULT 'Cart' 
                        CHECK (status IN ('Cart', 'Registered', 'Waitlisted', 'Dropped')),
    advisor_approved    BOOLEAN NOT NULL DEFAULT FALSE,
    registered_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_section UNIQUE (student_id, section_id)
);

-- Performance & Conflict Lookup Indexes
CREATE INDEX idx_section_schedules_lookup ON section_schedules (section_id, day_of_week, start_time, end_time);
CREATE INDEX idx_registrations_active ON registrations (student_id, status);
CREATE INDEX idx_completed_courses_lookup ON completed_courses (student_id, course_code, passed);


-- ==============================================================================
-- 2. PRODUCTION PL/pgSQL VALIDATION FUNCTIONS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Function 1: Prerequisite Check
-- Verifies if student has satisfied all required prerequisites with min grade
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_check_prerequisites(
    p_student_id VARCHAR(20),
    p_course_code VARCHAR(15)
)
RETURNS TABLE (
    is_eligible       BOOLEAN,
    missing_prereq    VARCHAR(15),
    required_grade    VARCHAR(5),
    required_points   NUMERIC(3, 2),
    actual_grade      VARCHAR(5),
    actual_points     NUMERIC(3, 2)
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE WHEN cc.grade_points >= p.min_grade_points THEN TRUE ELSE FALSE END AS is_eligible,
        p.prereq_course_code AS missing_prereq,
        p.min_passing_grade AS required_grade,
        p.min_grade_points AS required_points,
        COALESCE(cc.grade, 'NOT_TAKEN') AS actual_grade,
        COALESCE(cc.grade_points, 0.00) AS actual_points
    FROM prerequisites p
    LEFT JOIN LATERAL (
        -- Take highest grade points if course was repeated
        SELECT c.grade, c.grade_points, c.passed
        FROM completed_courses c
        WHERE c.student_id = p_student_id
          AND c.course_code = p.prereq_course_code
        ORDER BY c.grade_points DESC
        LIMIT 1
    ) cc ON TRUE
    WHERE p.course_code = p_course_code
      AND (cc.grade_points IS NULL OR cc.grade_points < p.min_grade_points);
END;
$$;

-- ------------------------------------------------------------------------------
-- Function 2: Real-Time Timetable Conflict Detection
-- Checks if any session (Lecture/Lab) of the target section overlaps with the
-- student's currently registered or cart sections
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_detect_time_conflicts(
    p_student_id VARCHAR(20),
    p_target_section_id VARCHAR(30)
)
RETURNS TABLE (
    conflict_detected    BOOLEAN,
    clash_section_id     VARCHAR(30),
    clash_course_code    VARCHAR(15),
    day_of_week          VARCHAR(10),
    target_session_type  VARCHAR(20),
    target_start         TIME,
    target_end           TIME,
    clash_session_type   VARCHAR(20),
    clash_start          TIME,
    clash_end            TIME,
    clash_room           VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TRUE AS conflict_detected,
        r.section_id AS clash_section_id,
        cs_existing.course_code AS clash_course_code,
        target_sched.day_of_week,
        target_sched.session_type AS target_session_type,
        target_sched.start_time AS target_start,
        target_sched.end_time AS target_end,
        existing_sched.session_type AS clash_session_type,
        existing_sched.start_time AS clash_start,
        existing_sched.end_time AS clash_end,
        existing_sched.room_code AS clash_room
    FROM section_schedules target_sched
    CROSS JOIN registrations r
    JOIN course_sections cs_existing ON r.section_id = cs_existing.section_id
    JOIN section_schedules existing_sched ON r.section_id = existing_sched.section_id
    WHERE target_sched.section_id = p_target_section_id
      AND r.student_id = p_student_id
      AND r.status IN ('Registered', 'Cart')
      -- Prevent matching the same section if student is re-validating
      AND r.section_id <> p_target_section_id
      -- Day match
      AND target_sched.day_of_week = existing_sched.day_of_week
      -- Time Overlap Formula: (StartA < EndB) AND (EndA > StartB)
      AND target_sched.start_time < existing_sched.end_time
      AND target_sched.end_time > existing_sched.start_time;
END;
$$;

-- ------------------------------------------------------------------------------
-- Function 3: Credit-Hour Limit Check
-- Enforces 18 Cr max for regular students (CGPA >= 2.0) and 12 Cr for probation
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_check_credit_limits(
    p_student_id VARCHAR(20),
    p_new_section_id VARCHAR(30)
)
RETURNS TABLE (
    allowed              BOOLEAN,
    current_credits      INTEGER,
    additional_credits   INTEGER,
    projected_credits    INTEGER,
    max_credits          INTEGER,
    student_cgpa         NUMERIC(3, 2),
    academic_status      VARCHAR(30)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_cgpa NUMERIC(3, 2);
    v_max_credits INTEGER;
    v_status VARCHAR(30);
    v_current_credits INTEGER;
    v_add_credits INTEGER;
    v_target_course VARCHAR(15);
BEGIN
    -- 1. Fetch student info
    SELECT s.cgpa, s.max_allowed_credits, s.academic_status 
    INTO v_cgpa, v_max_credits, v_status
    FROM students s
    WHERE s.student_id = p_student_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Student ID % does not exist in the system.', p_student_id;
    END IF;

    -- 2. Fetch new course credit hours
    SELECT cs.course_code, c.credit_hours 
    INTO v_target_course, v_add_credits
    FROM course_sections cs
    JOIN courses c ON cs.course_code = c.course_code
    WHERE cs.section_id = p_new_section_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Section ID % does not exist in course offerings.', p_new_section_id;
    END IF;

    -- 3. Calculate currently registered/cart credits (excluding duplicate course code if switching sections)
    SELECT COALESCE(SUM(c.credit_hours), 0)
    INTO v_current_credits
    FROM registrations r
    JOIN course_sections cs ON r.section_id = cs.section_id
    JOIN courses c ON cs.course_code = c.course_code
    WHERE r.student_id = p_student_id
      AND r.status IN ('Registered', 'Cart')
      AND cs.course_code <> v_target_course;

    -- 4. Return calculation
    RETURN QUERY
    SELECT 
        (v_current_credits + v_add_credits <= v_max_credits) AS allowed,
        v_current_credits,
        v_add_credits,
        (v_current_credits + v_add_credits) AS projected_credits,
        v_max_credits,
        v_cgpa,
        v_status;
END;
$$;

-- ------------------------------------------------------------------------------
-- Function 4 & Trigger: Atomic Registration & Seat Capacity Allocation
-- Uses pessimistic row locking (FOR UPDATE) to guarantee zero race conditions
-- Automatically moves student to 'Waitlisted' if the section is full (100% capacity)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_manage_seat_capacity()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
DECLARE
    v_enrolled INTEGER;
    v_capacity INTEGER;
    v_waitlist INTEGER;
BEGIN
    -- Case A: New Registration or Re-registration
    IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND OLD.status <> 'Registered' AND NEW.status = 'Registered') THEN
        
        -- Lock the target course_section row to prevent concurrent race conditions
        SELECT enrolled_count, max_capacity, waitlist_count
        INTO v_enrolled, v_capacity, v_waitlist
        FROM course_sections
        WHERE section_id = NEW.section_id
        FOR UPDATE;

        -- If capacity is reached, automatically downgrade status to 'Waitlisted'
        IF v_enrolled >= v_capacity THEN
            NEW.status := 'Waitlisted';
            
            UPDATE course_sections
            SET waitlist_count = waitlist_count + 1
            WHERE section_id = NEW.section_id;
            
            RAISE NOTICE 'Section % is at maximum capacity (%/%). Student % routed to Waitlist (Position #%).',
                NEW.section_id, v_capacity, v_capacity, NEW.student_id, (v_waitlist + 1);
        ELSE
            -- Increment enrolled count atomically
            UPDATE course_sections
            SET enrolled_count = enrolled_count + 1
            WHERE section_id = NEW.section_id;
        END IF;

    -- Case B: Student drops or changes status from Registered
    ELSIF (TG_OP = 'UPDATE' AND OLD.status = 'Registered' AND NEW.status IN ('Dropped', 'Cart')) 
       OR (TG_OP = 'DELETE' AND OLD.status = 'Registered') THEN
        
        -- Decrement enrolled count
        UPDATE course_sections
        SET enrolled_count = GREATEST(0, enrolled_count - 1)
        WHERE section_id = OLD.section_id;

        -- Optional promotion: Auto-promote the earliest waitlisted student
        DECLARE
            v_waitlisted_reg_id BIGINT;
        BEGIN
            SELECT registration_id INTO v_waitlisted_reg_id
            FROM registrations
            WHERE section_id = OLD.section_id AND status = 'Waitlisted'
            ORDER BY registered_at ASC
            LIMIT 1
            FOR UPDATE SKIP LOCKED;

            IF v_waitlisted_reg_id IS NOT NULL THEN
                UPDATE registrations
                SET status = 'Registered', updated_at = CURRENT_TIMESTAMP
                WHERE registration_id = v_waitlisted_reg_id;

                UPDATE course_sections
                SET enrolled_count = enrolled_count + 1,
                    waitlist_count = GREATEST(0, waitlist_count - 1)
                WHERE section_id = OLD.section_id;

                RAISE NOTICE 'Auto-promoted waitlisted student (Registration ID %) into available seat in Section %.',
                    v_waitlisted_reg_id, OLD.section_id;
            END IF;
        END;

    -- Case C: Dropped from waitlist
    ELSIF (TG_OP = 'UPDATE' AND OLD.status = 'Waitlisted' AND NEW.status IN ('Dropped', 'Cart'))
       OR (TG_OP = 'DELETE' AND OLD.status = 'Waitlisted') THEN
       
        UPDATE course_sections
        SET waitlist_count = GREATEST(0, waitlist_count - 1)
        WHERE section_id = OLD.section_id;

    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_atomic_seat_capacity
BEFORE INSERT OR UPDATE OR DELETE ON registrations
FOR EACH ROW
EXECUTE FUNCTION trg_manage_seat_capacity();


-- ------------------------------------------------------------------------------
-- Comprehensive High-Level Stored Procedure: fn_register_student_atomic
-- Orchestrates the entire validation pipeline (Prereqs -> Conflicts -> Credits -> Register)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_register_student_atomic(
    p_student_id VARCHAR(20),
    p_section_id VARCHAR(30)
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_course_code VARCHAR(15);
    v_unmet_prereq RECORD;
    v_conflict RECORD;
    v_credit_check RECORD;
    v_reg_id BIGINT;
    v_final_status VARCHAR(20);
BEGIN
    -- 1. Identify course code
    SELECT course_code INTO v_course_code
    FROM course_sections
    WHERE section_id = p_section_id;

    IF v_course_code IS NULL THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'code', 'SECTION_NOT_FOUND',
            'message', format('Section %s does not exist.', p_section_id)
        );
    END IF;

    -- 2. Validate Prerequisites
    SELECT * INTO v_unmet_prereq
    FROM fn_check_prerequisites(p_student_id, v_course_code)
    LIMIT 1;

    IF v_unmet_prereq.missing_prereq IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'code', 'PREREQUISITE_FAILED',
            'message', format('Locked: Requires %s (Min Grade %s, %s pts). Actual: %s (%s pts).',
                v_unmet_prereq.missing_prereq, v_unmet_prereq.required_grade,
                v_unmet_prereq.required_points, v_unmet_prereq.actual_grade, v_unmet_prereq.actual_points)
        );
    END IF;

    -- 3. Validate Time Conflicts
    SELECT * INTO v_conflict
    FROM fn_detect_time_conflicts(p_student_id, p_section_id)
    LIMIT 1;

    IF v_conflict.conflict_detected IS TRUE THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'code', 'TIME_CONFLICT',
            'message', format('Time Clash: Section overlaps with %s on %s between %s and %s (Room %s).',
                v_conflict.clash_course_code, v_conflict.day_of_week,
                v_conflict.clash_start, v_conflict.clash_end, v_conflict.clash_room)
        );
    END IF;

    -- 4. Validate Credit-Hour Limits
    SELECT * INTO v_credit_check
    FROM fn_check_credit_limits(p_student_id, p_section_id);

    IF v_credit_check.allowed IS FALSE THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'code', 'CREDIT_LIMIT_EXCEEDED',
            'message', format('Credit limit exceeded: Adding this course results in %s Cr (Allowed Max: %s Cr, Status: %s, CGPA: %s).',
                v_credit_check.projected_credits, v_credit_check.max_credits,
                v_credit_check.academic_status, v_credit_check.student_cgpa)
        );
    END IF;

    -- 5. Perform Registration (Seat Trigger handles capacity & waitlist atomically)
    INSERT INTO registrations (student_id, section_id, status)
    VALUES (p_student_id, p_section_id, 'Registered')
    ON CONFLICT (student_id, section_id) 
    DO UPDATE SET status = 'Registered', updated_at = CURRENT_TIMESTAMP
    RETURNING registration_id, status INTO v_reg_id, v_final_status;

    RETURN jsonb_build_object(
        'success', TRUE,
        'code', 'REGISTRATION_SUCCESS',
        'registration_id', v_reg_id,
        'status', v_final_status,
        'message', format('Student %s registered in %s (Status: %s).', p_student_id, p_section_id, v_final_status)
    );
END;
$$;


-- ==============================================================================
-- 3. SEED TEST DATA FOR ALL EDGE CASES
-- ==============================================================================

-- Seed Students:
-- 1. Regular Standing (CGPA 3.42 -> 18 Cr max)
-- 2. Academic Probation (CGPA 1.85 -> 12 Cr max)
INSERT INTO students (student_id, full_name, major, level, cgpa, academic_status, advisor_id, advisor_name) VALUES
('20230849', 'Karim Mostafa Hassan', 'Computer Science & AI', 'Level 3', 3.42, 'Regular', 'FAC-019', 'Dr. Tarek Mansour'),
('20230912', 'Youssef Adel Ibrahim', 'Computer Science & AI', 'Level 2', 1.85, 'Probation', 'FAC-019', 'Dr. Tarek Mansour');

-- Seed Courses
INSERT INTO courses (course_code, title, credit_hours, lecture_hours, lab_hours, course_type, department) VALUES
('CS101', 'Intro to Computer Science & Python', 3, 3, 2, 'Core Mandatory', 'Computer Science'),
('CS201', 'Data Structures & Algorithms I', 3, 3, 2, 'Core Mandatory', 'Computer Science'),
('MATH101', 'Calculus I & Analytical Geometry', 3, 3, 0, 'Core Mandatory', 'Mathematics'),
('MATH202', 'Linear Algebra & Differential Equations', 3, 3, 0, 'Core Mandatory', 'Mathematics'),
('CS301', 'Advanced Data Structures & Algorithms', 3, 3, 2, 'Core Mandatory', 'Computer Science'),
('CS302', 'Relational Database Management Systems', 3, 3, 2, 'Core Mandatory', 'Computer Science'),
('CS305', 'Operating Systems & Concurrency', 3, 3, 2, 'Core Mandatory', 'Computer Science'),
('CS340', 'Computer Networks & Protocols', 3, 3, 2, 'Major Elective', 'Computer Science'),
('AI310', 'Machine Learning & Deep Neural Nets', 3, 3, 2, 'Major Elective', 'Computer Science'),
('CBU101', 'Canadian Culture & Global Governance', 3, 2, 1, 'University Elective', 'General Education'),
('CS450', 'Distributed Consensus & Blockchain', 3, 3, 2, 'Major Elective', 'Computer Science'),
('AI420', 'Natural Language Processing & LLMs', 3, 3, 2, 'Major Elective', 'Computer Science');

-- Seed Prerequisites
INSERT INTO prerequisites (course_code, prereq_course_code, min_passing_grade, min_grade_points) VALUES
('CS201', 'CS101', 'C', 2.00),
('CS301', 'CS201', 'C', 2.00),
('CS302', 'CS201', 'C', 2.00),
('CS305', 'CS201', 'C', 2.00),
('CS340', 'CS201', 'C', 2.00),
('AI310', 'MATH202', 'C', 2.00),
('CS450', 'CS340', 'C', 2.00),   -- Karim has NOT completed CS340 -> Will trigger Prereq Lock!
('AI420', 'AI310', 'B', 3.00);   -- Requires AI310 with grade >= B -> Will trigger Prereq Lock!

-- Seed Completed Courses (Karim Mostafa's Academic Transcript)
INSERT INTO completed_courses (student_id, course_code, semester_id, grade, grade_points) VALUES
('20230849', 'CS101', 'Fall 2024', 'A', 4.00),
('20230849', 'MATH101', 'Fall 2024', 'B+', 3.30),
('20230849', 'CS201', 'Spring 2025', 'A-', 3.70),
('20230849', 'MATH202', 'Spring 2025', 'B', 3.00);

-- Seed Completed Courses for Probation Student Youssef (Failed CS201)
INSERT INTO completed_courses (student_id, course_code, semester_id, grade, grade_points) VALUES
('20230912', 'CS101', 'Fall 2024', 'C', 2.00),
('20230912', 'CS201', 'Spring 2025', 'F', 0.00);

-- Seed Course Sections (Fall 2026)
-- Notice CS302-S02 has max_capacity = 2 and will be filled to test waitlist logic!
INSERT INTO course_sections (section_id, course_code, semester_id, section_number, instructor_name, max_capacity, enrolled_count) VALUES
('CS301-S01-F26', 'CS301', 'Fall 2026', '01', 'Dr. Tarek Mansour', 30, 0),
('CS301-S02-F26', 'CS301', 'Fall 2026', '02', 'Dr. Sarah El-Banna', 30, 0),
('CS302-S01-F26', 'CS302', 'Fall 2026', '01', 'Dr. Yasser Fouad', 30, 0),
('CS302-S02-F26', 'CS302', 'Fall 2026', '02', 'Dr. Mohamed Rashed', 2, 2), -- ALREADY FULL! (2/2)
('CS305-S01-F26', 'CS305', 'Fall 2026', '01', 'Dr. Khaled Mostafa', 30, 0),
('AI310-S01-F26', 'AI310', 'Fall 2026', '01', 'Prof. Amira El-Gohary', 30, 0),
('CBU101-S01-F26', 'CBU101', 'Fall 2026', '01', 'Dr. Patrick MacLeod', 50, 0),
('CS450-S01-F26', 'CS450', 'Fall 2026', '01', 'Eng. Ramy Nabil', 25, 0);

-- Seed Section Schedules (Saturday to Thursday, 8:00 AM to 6:00 PM)
INSERT INTO section_schedules (section_id, session_type, day_of_week, start_time, end_time, room_code) VALUES
-- CS301 Section 01: Sun 10:00-11:30 (Lec) & Tue 12:00-14:00 (Lab)
('CS301-S01-F26', 'Lecture', 'Sun', '10:00', '11:30', 'Hall B2'),
('CS301-S01-F26', 'Lab', 'Tue', '12:00', '14:00', 'Software Lab 4'),

-- CS301 Section 02: Mon 08:30-10:00 (Lec) & Wed 14:00-16:00 (Lab)
('CS301-S02-F26', 'Lecture', 'Mon', '08:30', '10:00', 'Auditorium C'),
('CS301-S02-F26', 'Lab', 'Wed', '14:00', '16:00', 'Tech Lab 2'),

-- CS302 Section 01: Mon 10:00-11:30 (Lec) & Wed 10:00-12:00 (Lab)
('CS302-S01-F26', 'Lecture', 'Mon', '10:00', '11:30', 'Hall A1'),
('CS302-S01-F26', 'Lab', 'Wed', '10:00', '12:00', 'Database Lab 108'),

-- CS302 Section 02 (FULL): Sun 13:00-14:30 (Lec) & Tue 08:30-10:30 (Lab)
('CS302-S02-F26', 'Lecture', 'Sun', '13:00', '14:30', 'Hall 201'),
('CS302-S02-F26', 'Lab', 'Tue', '08:30', '10:30', 'Lab 3'),

-- CS305 Section 01: Mon 10:30-12:00 (Lec) -> CLASHES WITH CS302-S01 on Monday!
('CS305-S01-F26', 'Lecture', 'Mon', '10:30', '12:00', 'Hall B1'),
('CS305-S01-F26', 'Lab', 'Wed', '08:30', '10:30', 'Systems Lab 3'),

-- AI310 Section 01: Tue 10:00-11:30 (Lec) & Thu 12:00-14:00 (Lab)
('AI310-S01-F26', 'Lecture', 'Tue', '10:00', '11:30', 'Auditorium B'),
('AI310-S01-F26', 'Lab', 'Thu', '12:00', '14:00', 'GPU Lab 1'),

-- CBU101 Section 01: Thu 09:00-11:00 (Lec)
('CBU101-S01-F26', 'Lecture', 'Thu', '09:00', '11:00', 'Sydney Theater'),

-- CS450 Section 01: Sun 10:00-11:30 (Lec)
('CS450-S01-F26', 'Lecture', 'Sun', '10:00', '11:30', 'Hall 305');


-- ==============================================================================
-- 4. VERIFICATION SCRIPTS TESTING THE 4 CRITICAL REGISTRATION EDGE CASES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- TEST CASE 1: Valid Registration (Happy Path)
-- Student Karim registers for CS301 Section 01 (Prereq CS201 satisfied, no clash)
-- ------------------------------------------------------------------------------
SELECT '--- TEST CASE 1: Valid Registration ---' AS test_name;
SELECT fn_register_student_atomic('20230849', 'CS301-S01-F26');

-- ------------------------------------------------------------------------------
-- TEST CASE 2: Prerequisite Failure
-- Karim attempts to register for CS450 (Requires CS340 which is not completed)
-- ------------------------------------------------------------------------------
SELECT '--- TEST CASE 2: Prerequisite Failure ---' AS test_name;
SELECT fn_register_student_atomic('20230849', 'CS450-S01-F26');

-- Direct query version:
SELECT * FROM fn_check_prerequisites('20230849', 'CS450');

-- ------------------------------------------------------------------------------
-- TEST CASE 3: Timetable Clash Detection
-- Karim registers CS302-S01 (Mon 10:00-11:30), then attempts to register CS305-S01 (Mon 10:30-12:00)
-- ------------------------------------------------------------------------------
SELECT '--- TEST CASE 3: Timetable Clash Detection ---' AS test_name;
-- Step 3a: Successfully register CS302-S01
SELECT fn_register_student_atomic('20230849', 'CS302-S01-F26');

-- Step 3b: Attempt to register CS305-S01 (Overlaps on Monday 10:30-11:30)
SELECT fn_register_student_atomic('20230849', 'CS305-S01-F26');

-- Direct query version:
SELECT * FROM fn_detect_time_conflicts('20230849', 'CS305-S01-F26');

-- ------------------------------------------------------------------------------
-- TEST CASE 4: Credit Limit Violation
-- Probation Student Youssef (CGPA 1.85, max 12 Cr) attempts to overload
-- ------------------------------------------------------------------------------
SELECT '--- TEST CASE 4: Credit Limit Check ---' AS test_name;
SELECT * FROM fn_check_credit_limits('20230912', 'CS301-S01-F26');

-- ------------------------------------------------------------------------------
-- TEST CASE 5: Atomic Seat Allocation & Waitlist Routing
-- Attempting to register for CS302-S02 which is already at 2/2 capacity
-- ------------------------------------------------------------------------------
SELECT '--- TEST CASE 5: Atomic Waitlist Overflow ---' AS test_name;
SELECT fn_register_student_atomic('20230849', 'CS302-S02-F26');

-- Inspect Registrations Table and Course Sections Table to verify final state
SELECT 
    r.registration_id,
    r.student_id,
    r.section_id,
    cs.course_code,
    r.status,
    r.advisor_approved,
    r.registered_at
FROM registrations r
JOIN course_sections cs ON r.section_id = cs.section_id
ORDER BY r.registration_id;

SELECT 
    section_id,
    course_code,
    instructor_name,
    max_capacity,
    enrolled_count,
    waitlist_count
FROM course_sections;
