export type UserRole = 'student' | 'instructor' | 'admin';

export interface RoleRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  currentRole?: UserRole;
  requestedRole: 'instructor';
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isSuperAdmin?: boolean;
  xp: number;
  streakDays: number;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  passedQuizIds: string[];
  passedExamIds?: string[];
  certificates: Certificate[];
  bio?: string;
  headline?: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface FinalExamQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic?: string;
}

export interface FinalExam {
  id: string;
  title: string;
  durationMinutes: number;
  passingScore: number; // e.g. 75
  questions: FinalExamQuestion[];
  instructions?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'zip' | 'code' | 'link';
  size?: string;
  url: string;
  description?: string;
  pageCount?: number;
  uploadedAt?: string;
}

export type MessageRecipientType = 'individual' | 'student' | 'course_broadcast' | 'all_students';

export interface MessageReply {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  content: string;
  date: string;
  attachments?: Resource[];
}

export interface StudentMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  recipientType: MessageRecipientType;
  recipientId?: string; // student id or email if individual
  recipientName?: string;
  courseId?: string; // if course_broadcast
  courseTitle?: string;
  subject: string;
  content: string;
  attachments?: Resource[];
  date: string;
  isRead: boolean;
  isImportant?: boolean;
  replies?: MessageReply[];
}

export interface Lesson {
  id: string;
  title: string;
  titleEn?: string;
  durationMinutes: number;
  videoUrl: string;
  videoType: 'youtube' | 'mp4';
  description: string;
  transcript?: string;
  quiz?: Quiz;
  resources?: Resource[];
  codeSnippet?: {
    language: string;
    code: string;
    explanation: string;
  };
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Instructor {
  id: string;
  name: string;
  nameEn?: string;
  title: string;
  avatar: string;
  rating: number;
  studentsCount: number;
  bio: string;
}

export interface Review {
  id: string;
  courseId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Reply {
  id: string;
  discussionId?: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  codeSnippet?: string;
  date: string;
  isInstructor?: boolean;
  isAcceptedSolution?: boolean;
  upvotes?: number;
}

export type ForumCategory = 
  | 'legacy-lang'   // لغات البرمجة القديمة والعتيقة
  | 'modern-lang'   // لغات البرمجة والتقنيات الحديثة
  | 'ai-gen'        // الذكاء الاصطناعي وهندسة الأوامر
  | 'questions'     // أسئلة واستفسارات برمجية
  | 'projects'      // مشاريع وتجارب الطلاب
  | 'announcements';// إعلانات المشرفين والمعلمين

export interface Discussion {
  id: string;
  courseId?: string;
  lessonId?: string;
  category: ForumCategory;
  categoryNameAr: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  title: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  tags: string[];
  date: string;
  upvotes: number;
  replies: Reply[];
  isPinned?: boolean;
  isLocked?: boolean;
  isReported?: boolean;
  reportReason?: string;
  acceptedReplyId?: string;
  viewsCount?: number;
}

export interface Note {
  id: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  timestampSeconds: number;
  content: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  courseTitleEn?: string;
  studentName: string;
  studentEmail: string;
  issueDate: string;
  grade: string;
  scorePercentage: number;
  verificationCode: string;
  instructorName: string;
  instructorTitle: string;
  durationHours: number;
}

export type CourseCategory = 
  | 'legacy-programming' // لغات البرمجة القديمة (COBOL, Fortran, C, Assembly, Pascal)
  | 'modern-programming' // لغات البرمجة الحديثة (Rust, TypeScript, Python, Go)
  | 'ai'                 // الذكاء الاصطناعي و Gemini
  | 'web'                // تطوير الويب
  | 'data'               // علم البيانات
  | 'cybersecurity'      // الأمن السيبراني
  | 'business'           // التقنية والأعمال
  | 'all';

export type CourseLevel = 'مبتدئ' | 'متوسط' | 'متقدم' | 'جميع المستويات';

export interface Course {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  category: CourseCategory;
  categoryNameAr: string;
  level: CourseLevel;
  price: number; // 0 for free, > 0 for paid
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  durationHours: number;
  lessonsCount: number;
  thumbnail: string;
  instructor: Instructor;
  tags: string[];
  outcomes: string[];
  requirements: string[];
  sections: Section[];
  finalExam?: FinalExam;
  isFeatured?: boolean;
  isPopular?: boolean;
  isFree?: boolean;
  badge?: string;
  updatedAt: string;
}

