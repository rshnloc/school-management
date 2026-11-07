export interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade_level: string;
  section: string;
  date_of_birth: string;
  gender: string;
  address: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  enrollment_date: string;
  status: string;
  gpa: number;
  attendance_rate: number;
  ai_risk_level: 'Low' | 'Medium' | 'High';
  ai_risk_score: number;
  ai_risk_factors: string;
  ai_recommendation: string;
}

export interface Teacher {
  id: number;
  teacher_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  subject_specialty: string;
  phone: string;
  office_room: string;
  qualification: string;
  status: string;
}

export interface Course {
  id: number;
  course_code: string;
  course_name: string;
  department: string;
  grade_level: string;
  credits: number;
  teacher_id?: number;
  teacher_name?: string;
  room: string;
  syllabus: string;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name?: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
}

export interface Grade {
  id: number;
  student_id: number;
  student_name?: string;
  course_id: number;
  course_name?: string;
  assessment_name: string;
  assessment_type: string;
  max_score: number;
  score: number;
  date: string;
  remarks?: string;
}

export interface TimetableSlot {
  id: number;
  day_of_week: string;
  period: number;
  start_time: string;
  end_time: string;
  course_id: number;
  course_name?: string;
  teacher_id: number;
  teacher_name?: string;
  grade_section: string;
  room_name: string;
}

export interface FeeInvoice {
  id: number;
  invoice_number: string;
  student_id: number;
  student_name?: string;
  title: string;
  amount: number;
  due_date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paid_date?: string;
  payment_method?: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: 'Academic' | 'Event' | 'Urgent' | 'General' | 'AI-Alert';
  target_audience: 'All' | 'Students' | 'Teachers' | 'Parents';
  author: string;
  created_at: string;
  pinned: boolean;
}

export interface AnalyticsOverview {
  total_students: number;
  average_gpa: number;
  average_attendance: number;
  risk_breakdown: {
    high: number;
    medium: number;
    low: number;
  };
  intervention_roster: Array<{
    id: number;
    student_id: string;
    name: string;
    grade_level: string;
    risk_score: number;
    risk_level: 'High' | 'Medium' | 'Low';
    attendance_rate: number;
    gpa: number;
    recommendation: string;
  }>;
}

export interface AutoGradeResult {
  submission_id: number;
  student_name: string;
  course_name: string;
  title: string;
  score: number;
  letter_grade: string;
  metrics: {
    word_count: number;
    sentence_count: number;
    paragraph_count: number;
    lexical_diversity: number;
  };
  rubric_breakdown: Record<string, {
    score: number;
    max: number;
    feedback: string;
  }>;
  strengths: string[];
  improvements: string[];
  feedback_summary: string;
}

export interface LessonPlanResult {
  title: string;
  subject: string;
  grade_level: string;
  duration: string;
  essential_question: string;
  learning_objectives: string[];
  materials_needed: string[];
  timeline: Array<{
    phase: string;
    duration: string;
    activity: string;
  }>;
  differentiation: {
    scaffolding_for_support: string;
    extension_for_advanced: string;
  };
  homework_assignment: string;
  quiz?: Array<{
    question: string;
    options: string[];
    correct_option_index: number;
    explanation: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggested_actions?: string[];
}
