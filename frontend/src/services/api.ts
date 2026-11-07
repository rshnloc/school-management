import {
  Student,
  Teacher,
  Course,
  AttendanceRecord,
  Grade,
  TimetableSlot,
  FeeInvoice,
  Announcement,
  AnalyticsOverview,
  AutoGradeResult,
  LessonPlanResult
} from '../types';

const API_BASE = '/api';

export const api = {
  // Students
  getStudents: async (params?: { search?: string; grade_level?: string; risk_level?: string }): Promise<Student[]> => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.grade_level) q.append('grade_level', params.grade_level);
    if (params?.risk_level) q.append('risk_level', params.risk_level);
    const res = await fetch(`${API_BASE}/students?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  getStudent: async (id: number): Promise<Student> => {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Failed to fetch student profile');
    return res.json();
  },

  createStudent: async (data: Partial<Student>): Promise<Student> => {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create student');
    return res.json();
  },

  getStudentReportCard: async (id: number) => {
    const res = await fetch(`${API_BASE}/students/${id}/report-card`);
    if (!res.ok) throw new Error('Failed to fetch student report card');
    return res.json();
  },

  deleteStudent: async (id: number) => {
    const res = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete student');
    return res.json();
  },

  // Teachers
  getTeachers: async (): Promise<Teacher[]> => {
    const res = await fetch(`${API_BASE}/teachers`);
    if (!res.ok) throw new Error('Failed to fetch teachers');
    return res.json();
  },

  createTeacher: async (data: Partial<Teacher>): Promise<Teacher> => {
    const res = await fetch(`${API_BASE}/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add teacher');
    return res.json();
  },

  // Courses
  getCourses: async (): Promise<Course[]> => {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },

  createCourse: async (data: Partial<Course>): Promise<Course> => {
    const res = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add course');
    return res.json();
  },

  // Attendance
  getAttendance: async (params?: { date?: string; student_id?: number }): Promise<AttendanceRecord[]> => {
    const q = new URLSearchParams();
    if (params?.date) q.append('date', params.date);
    if (params?.student_id) q.append('student_id', params.student_id.toString());
    const res = await fetch(`${API_BASE}/attendance?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch attendance');
    return res.json();
  },

  recordAttendanceBatch: async (records: Array<{ student_id: number; date: string; status: string; remarks?: string }>) => {
    const res = await fetch(`${API_BASE}/attendance/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records }),
    });
    if (!res.ok) throw new Error('Failed to record batch attendance');
    return res.json();
  },

  getAttendanceSummary: async () => {
    const res = await fetch(`${API_BASE}/attendance/summary`);
    if (!res.ok) throw new Error('Failed to fetch attendance summary');
    return res.json();
  },

  // Grades
  getGrades: async (params?: { student_id?: number; course_id?: number }): Promise<Grade[]> => {
    const q = new URLSearchParams();
    if (params?.student_id) q.append('student_id', params.student_id.toString());
    if (params?.course_id) q.append('course_id', params.course_id.toString());
    const res = await fetch(`${API_BASE}/grades?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch grades');
    return res.json();
  },

  addGrade: async (data: { student_id: number; course_id: number; assessment_name: string; assessment_type: string; score: number; max_score: number; remarks?: string }): Promise<Grade> => {
    const res = await fetch(`${API_BASE}/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record grade');
    return res.json();
  },

  // Timetable
  getTimetable: async (grade_section?: string): Promise<TimetableSlot[]> => {
    const q = new URLSearchParams();
    if (grade_section) q.append('grade_section', grade_section);
    const res = await fetch(`${API_BASE}/timetable?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch timetable');
    return res.json();
  },

  checkTimetableConflicts: async () => {
    const res = await fetch(`${API_BASE}/timetable/conflicts`);
    if (!res.ok) throw new Error('Failed to check timetable conflicts');
    return res.json();
  },

  autoOptimizeTimetable: async () => {
    const res = await fetch(`${API_BASE}/timetable/auto-optimize`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to optimize timetable');
    return res.json();
  },

  // Fees
  getFees: async (student_id?: number, status?: string): Promise<FeeInvoice[]> => {
    const q = new URLSearchParams();
    if (student_id) q.append('student_id', student_id.toString());
    if (status) q.append('status', status);
    const res = await fetch(`${API_BASE}/fees?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch fee invoices');
    return res.json();
  },

  payFee: async (invoice_id: number, payment_method: string = 'Demo Electronic Payment'): Promise<FeeInvoice> => {
    const res = await fetch(`${API_BASE}/fees/${invoice_id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_method }),
    });
    if (!res.ok) throw new Error('Payment processing failed');
    return res.json();
  },

  // Announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    const res = await fetch(`${API_BASE}/announcements`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },

  createAnnouncement: async (data: { title: string; content: string; category: string; target_audience: string; pinned?: boolean }): Promise<Announcement> => {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to post announcement');
    return res.json();
  },

  // AI Endpoints
  getAiAnalyticsOverview: async (): Promise<AnalyticsOverview> => {
    const res = await fetch(`${API_BASE}/ai/analytics-overview`);
    if (!res.ok) throw new Error('Failed to fetch AI analytics');
    return res.json();
  },

  batchEvaluateRisk: async () => {
    const res = await fetch(`${API_BASE}/ai/batch-evaluate-risk`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to run batch risk analysis');
    return res.json();
  },

  predictStudentRisk: async (student_id: number) => {
    const res = await fetch(`${API_BASE}/ai/predict-risk/${student_id}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to predict risk for student');
    return res.json();
  },

  autoGradeSubmission: async (data: { student_id: number; course_id: number; assignment_title: string; submission_text: string; rubric_guidelines?: string }): Promise<AutoGradeResult> => {
    const res = await fetch(`${API_BASE}/ai/auto-grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to auto-grade submission');
    return res.json();
  },

  generateLessonPlan: async (data: { subject: string; topic: string; grade_level: string; duration_minutes: number; objectives?: string; include_quiz?: boolean }): Promise<LessonPlanResult> => {
    const res = await fetch(`${API_BASE}/ai/generate-lesson-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to generate lesson plan');
    return res.json();
  },

  chatWithEduBot: async (data: { message: string; user_role?: string; chat_history?: Array<{ role: string; content: string }> }) => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('EduBot service unavailable');
    return res.json();
  }
};

