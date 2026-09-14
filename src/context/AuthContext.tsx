import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Course, Note, Certificate, Discussion, Reply, ForumCategory, StudentMessage, MessageRecipientType, MessageReply, Resource, RoleRequest } from '../types';
import { INITIAL_COURSES, INITIAL_DISCUSSIONS, INITIAL_MESSAGES } from '../data/coursesData';
import { auth, googleProvider, db, SUPER_ADMIN_EMAIL } from '../lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, query, getDocFromServer } from 'firebase/firestore';
import confetti from 'canvas-confetti';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  registeredUsers: User[];
  roleRequests: RoleRequest[];
  courses: Course[];
  discussions: Discussion[];
  messages: StudentMessage[];
  unreadMessagesCount: number;
  theme: 'light' | 'dark';
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  adminPasscode: string;
  setAdminPasscode: (code: string) => void;
  loginWithGoogle: (
    customEmail?: string,
    customName?: string,
    role?: UserRole,
    options?: { adminPasscode?: string; isVerifiedByOAuth?: boolean }
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGooglePopup: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  requestInstructorUpgrade: (reason: string) => void;
  approveRoleRequest: (requestId: string) => void;
  rejectRoleRequest: (requestId: string) => void;
  deletePlatformUser: (userId: string) => void;
  toggleTheme: () => void;
  enrollInCourse: (courseId: string) => boolean;
  markLessonCompleted: (lessonId: string, courseId: string) => void;
  recordQuizPassed: (quizId: string, xpEarned?: number) => void;
  recordExamPassed: (examId: string, course: Course, scorePercentage: number) => Certificate;
  saveNote: (courseId: string, lessonId: string, lessonTitle: string, timestampSeconds: number, content: string) => void;
  deleteNote: (noteId: string) => void;
  claimCertificate: (course: Course, scorePercentage?: number) => Certificate;
  createNewCourse: (newCourse: Course) => void;
  deleteCourse: (courseId: string) => void;
  clearAllCourses: () => void;
  addDiscussion: (
    category: ForumCategory,
    categoryNameAr: string,
    title: string,
    content: string,
    tags?: string[],
    codeSnippet?: { language: string; code: string },
    courseId?: string,
    lessonId?: string
  ) => void;
  addReply: (discussionId: string, content: string, codeSnippet?: string) => void;
  upvoteDiscussion: (discussionId: string) => void;
  upvoteReply: (discussionId: string, replyId: string) => void;
  // Moderation Methods
  pinDiscussion: (discussionId: string) => void;
  lockDiscussion: (discussionId: string) => void;
  deleteDiscussion: (discussionId: string) => void;
  markAcceptedSolution: (discussionId: string, replyId: string) => void;
  reportDiscussion: (discussionId: string, reason: string) => void;
  dismissReport: (discussionId: string) => void;
  getCourseProgress: (courseId: string) => { completedCount: number; totalCount: number; percentage: number };
  // Messages and Instructor-Student Communication
  sendMessage: (msg: {
    recipientType: MessageRecipientType;
    recipientId?: string;
    recipientName?: string;
    courseId?: string;
    courseTitle?: string;
    subject: string;
    content: string;
    attachments?: Resource[];
    isImportant?: boolean;
  }) => void;
  replyToMessage: (messageId: string, content: string, attachments?: Resource[]) => void;
  markMessageAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
}

const DEFAULT_SUPER_ADMIN: User = {
  id: 'usr-superadmin',
  name: 'محمد ماجد',
  email: 'mohamedmaged3g@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'admin',
  isSuperAdmin: true,
  xp: 1500,
  streakDays: 7,
  enrolledCourseIds: [],
  completedLessonIds: [],
  passedQuizIds: [],
  passedExamIds: [],
  certificates: [],
  headline: 'المدير العام والمسؤول الرئيسي عن منصة تعلّم',
  createdAt: '2026-01-01',
};

const INITIAL_USERS: User[] = [
  DEFAULT_SUPER_ADMIN,
  {
    id: 'usr-student-1',
    name: 'أحمد محمود',
    email: 'ahmed.mahmoud@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ahmed',
    role: 'student',
    xp: 420,
    streakDays: 3,
    enrolledCourseIds: [],
    completedLessonIds: [],
    passedQuizIds: [],
    passedExamIds: [],
    certificates: [],
    headline: 'طالب شغوف بتعلم الذكاء الاصطناعي وهندسة البرمجيات',
    createdAt: '2026-01-15',
  },
  {
    id: 'usr-student-2',
    name: 'سارة خالد',
    email: 'sara.khaled@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sara',
    role: 'student',
    xp: 680,
    streakDays: 5,
    enrolledCourseIds: [],
    completedLessonIds: [],
    passedQuizIds: [],
    passedExamIds: [],
    certificates: [],
    headline: 'مهندسة واجهات ومطورة React',
    createdAt: '2026-01-20',
  },
  {
    id: 'usr-instructor-1',
    name: 'د. خالد عبد الرحمن',
    email: 'khaled.instructor@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=khaled_prof',
    role: 'instructor',
    xp: 1200,
    streakDays: 12,
    enrolledCourseIds: [],
    completedLessonIds: [],
    passedQuizIds: [],
    passedExamIds: [],
    certificates: [],
    headline: 'أستاذ علوم الحاسوب ومحاضر في النظم القديمة COBOL والذكاء الاصطناعي',
    createdAt: '2026-01-05',
  }
];

const INITIAL_ROLE_REQUESTS: RoleRequest[] = [
  {
    id: 'req-1',
    userId: 'usr-student-1',
    userName: 'أحمد محمود',
    userEmail: 'ahmed.mahmoud@gmail.com',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ahmed',
    currentRole: 'student',
    requestedRole: 'instructor',
    reason: 'أود تقديم دورة متكاملة في لغة بايثون وتطبيقات تعلم الآلة وتطوير الويب.',
    status: 'pending',
    createdAt: '2026-02-01',
  },
  {
    id: 'req-2',
    userId: 'usr-student-2',
    userName: 'سارة خالد',
    userEmail: 'sara.khaled@gmail.com',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sara',
    currentRole: 'student',
    requestedRole: 'instructor',
    reason: 'لدي خبرة 4 سنوات في تطوير واجهات React و Tailwind CSS وأريد إعداد دورات عملية مع مشاريع حية.',
    status: 'pending',
    createdAt: '2026-02-05',
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      // Clear previous auto-seeded storage keys
      localStorage.removeItem('taallam_user_v2');
      localStorage.removeItem('taallam_user');

      // Only restore session if the user explicitly signed in in this active session
      const saved = sessionStorage.getItem('taallam_active_user_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          if (parsed.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
            parsed.isSuperAdmin = true;
            parsed.role = 'admin';
          }
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('taallam_platform_users_v2');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>(() => {
    try {
      const saved = localStorage.getItem('taallam_role_requests_v2');
      return saved ? JSON.parse(saved) : INITIAL_ROLE_REQUESTS;
    } catch {
      return INITIAL_ROLE_REQUESTS;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('taallam_courses_v2');
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [discussions, setDiscussions] = useState<Discussion[]>(() => {
    try {
      const saved = localStorage.getItem('taallam_discussions');
      return saved ? JSON.parse(saved) : INITIAL_DISCUSSIONS;
    } catch {
      return INITIAL_DISCUSSIONS;
    }
  });

  const [messages, setMessages] = useState<StudentMessage[]>(() => {
    try {
      const saved = localStorage.getItem('taallam_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('taallam_theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Admin security passcode for protecting Mohamed Maged's super admin account
  const DEFAULT_ADMIN_PASSCODE = 'Admin@2026';
  const [adminPasscode, setAdminPasscodeState] = useState<string>(() => {
    try {
      return localStorage.getItem('taallam_admin_passcode_v2') || DEFAULT_ADMIN_PASSCODE;
    } catch {
      return DEFAULT_ADMIN_PASSCODE;
    }
  });

  const setAdminPasscode = (code: string) => {
    setAdminPasscodeState(code);
    try {
      localStorage.setItem('taallam_admin_passcode_v2', code);
    } catch (e) {
      console.error(e);
    }
  };

  // Sync users & requests to localStorage
  useEffect(() => {
    localStorage.setItem('taallam_platform_users_v2', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('taallam_role_requests_v2', JSON.stringify(roleRequests));
  }, [roleRequests]);

  // Sync active user to sessionStorage only
  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem('taallam_active_user_v3', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('taallam_active_user_v3');
      }
      localStorage.removeItem('taallam_user_v2');
      localStorage.removeItem('taallam_user');
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('taallam_courses_v2', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('taallam_discussions_v2', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('taallam_messages_v2', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('taallam_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const isSuperAdmin = Boolean(
    user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() || user?.isSuperAdmin
  );

  const loginWithGoogle = async (
    customEmail = 'student@example.com',
    customName = 'طالب جديد',
    role: UserRole = 'student',
    options?: { adminPasscode?: string; isVerifiedByOAuth?: boolean }
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = customEmail.trim().toLowerCase();
    const isTargetSuperAdmin = trimmedEmail === SUPER_ADMIN_EMAIL.toLowerCase();

    // Security Check: Super Admin impersonation guard
    if (isTargetSuperAdmin) {
      const isOAuthVerified = options?.isVerifiedByOAuth === true;
      const isPasscodeValid = options?.adminPasscode && options.adminPasscode.trim() === adminPasscode.trim();

      if (!isOAuthVerified && !isPasscodeValid) {
        return {
          success: false,
          error: 'حساب المدير العام محمي ومخصص فقط للمالك (الأستاذ محمد ماجد). يرجى إدخال رمز الأمان السري الصحيح أو تسجيل الدخول عبر نافذة Google الرسمية المعتمدة.',
        };
      }
    }

    // Role safety: non-admin users cannot claim 'admin' role
    let finalRole: UserRole = role;
    if (!isTargetSuperAdmin && finalRole === 'admin') {
      finalRole = 'student';
    }
    if (isTargetSuperAdmin) {
      finalRole = 'admin';
    }

    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`;
    
    // Check if user already exists in registeredUsers
    const existing = registeredUsers.find(u => u.email.toLowerCase() === trimmedEmail);

    const newUser: User = {
      id: existing?.id || (isTargetSuperAdmin ? DEFAULT_SUPER_ADMIN.id : `usr-${Date.now()}`),
      name: isTargetSuperAdmin ? (existing?.name || 'محمد ماجد') : (customName.trim() || existing?.name || trimmedEmail.split('@')[0]),
      email: trimmedEmail,
      avatar: isTargetSuperAdmin ? DEFAULT_SUPER_ADMIN.avatar : (existing?.avatar || avatarUrl),
      role: isTargetSuperAdmin ? 'admin' : (existing?.role || finalRole),
      isSuperAdmin: isTargetSuperAdmin,
      xp: existing?.xp || 500,
      streakDays: existing?.streakDays || 1,
      enrolledCourseIds: existing?.enrolledCourseIds || ['cobol-legacy-systems', 'ai-masterclass'],
      completedLessonIds: existing?.completedLessonIds || [],
      passedQuizIds: existing?.passedQuizIds || [],
      passedExamIds: existing?.passedExamIds || [],
      certificates: existing?.certificates || [],
      headline: isTargetSuperAdmin
        ? 'المدير العام والمسؤول الرئيسي عن منصة تعلّم'
        : (finalRole === 'instructor' ? 'معلّم ومصمم دورات تكنولوجية' : 'طالب متخصص في التقنية ولغات البرمجة'),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };

    // Update registered users list
    setRegisteredUsers(prev => {
      const idx = prev.findIndex(u => u.email.toLowerCase() === trimmedEmail);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...newUser };
        return copy;
      }
      return [...prev, newUser];
    });

    setUser(newUser);
    closeAuthModal();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    return { success: true };
  };

  const signInWithGooglePopup = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      if (fbUser && fbUser.email) {
        const isTargetSuperAdmin = fbUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
        return await loginWithGoogle(
          fbUser.email, 
          fbUser.displayName || fbUser.email.split('@')[0], 
          isTargetSuperAdmin ? 'admin' : 'student',
          { isVerifiedByOAuth: true }
        );
      }
      return { success: false, error: 'لم يتم العثور على بريد إلكتروني في حساب Google' };
    } catch (error: any) {
      console.warn('Firebase popup closed or not configured:', error);
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'تم إلغاء نافذة تسجيل الدخول' };
      }
      return {
        success: false,
        error: error?.message || 'تعذر تسجيل الدخول بنافذة Google. إذا كنت تستخدم متصفحاً يقيد النوافذ، يمكنك الدخول برمز الأمان المخصص.',
      };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error(e);
    }
    try {
      sessionStorage.removeItem('taallam_active_user_v3');
      localStorage.removeItem('taallam_user_v2');
      localStorage.removeItem('taallam_user');
    } catch {
      // ignore
    }
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    // Super admin can switch for previewing perspectives
    const updated = { ...user, role: newRole };
    setUser(updated);
    setRegisteredUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
  };

  // Super Admin Action: Change any user's role directly
  const updateUserRole = (userId: string, newRole: UserRole) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        // Protected super admin check
        if (u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
          return { ...u, role: 'admin', isSuperAdmin: true };
        }
        return { 
          ...u, 
          role: newRole,
          headline: newRole === 'instructor' 
            ? 'معلّم ومصمم دورات معتمد' 
            : newRole === 'admin' 
              ? 'مدير المنصة ومشرف' 
              : 'طالب في منصة تعلّم'
        };
      }
      return u;
    }));

    // If current user modified themselves
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  // Student Action: Request promotion to instructor
  const requestInstructorUpgrade = (reason: string) => {
    if (!user) return;
    const newReq: RoleRequest = {
      id: `req-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      currentRole: user.role,
      requestedRole: 'instructor',
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setRoleRequests(prev => [newReq, ...prev]);
  };

  // Super Admin Action: Approve promotion
  const approveRoleRequest = (requestId: string) => {
    const req = roleRequests.find(r => r.id === requestId);
    if (!req) return;

    // 1. Mark request approved
    setRoleRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));

    // 2. Upgrade user in registeredUsers
    updateUserRole(req.userId, 'instructor');

    // 3. Send system message to user celebrating promotion
    sendMessage({
      recipientType: 'student',
      recipientId: req.userId,
      recipientName: req.userName,
      subject: '🎉 تهانينا! تمت الموافقة على طلب انضمامك كمعلّم في منصة تعلّم',
      content: `مرحباً ${req.userName}، يسعدنا إخبارك بأن المدير العام (${SUPER_ADMIN_EMAIL}) قد وافق على طلب ترقيتك إلى رتبة "معلّم / مدرّس". يمكنك الآن الانتقال إلى "استوديو المعلم" للبدء في إنشاء دوراتك ونشر مقاطع الفيديو والدروس التعليمية.`,
      isImportant: true
    });
  };

  // Super Admin Action: Reject promotion
  const rejectRoleRequest = (requestId: string) => {
    setRoleRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
  };

  // Super Admin Action: Delete platform user
  const deletePlatformUser = (userId: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
    setRoleRequests(prev => prev.filter(r => r.userId !== userId));
  };

  const enrollInCourse = (courseId: string): boolean => {
    if (!user) {
      openAuthModal();
      return false;
    }
    if (user.enrolledCourseIds.includes(courseId)) {
      return true;
    }

    const updated = {
      ...user,
      enrolledCourseIds: [...user.enrolledCourseIds, courseId],
      xp: user.xp + 60,
    };
    setUser(updated);

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });

    return true;
  };

  const markLessonCompleted = (lessonId: string, courseId: string) => {
    if (!user) return;
    if (user.completedLessonIds.includes(lessonId)) return;

    const updated = {
      ...user,
      completedLessonIds: [...user.completedLessonIds, lessonId],
      xp: user.xp + 35,
    };
    setUser(updated);
  };

  const recordQuizPassed = (quizId: string, xpEarned = 100) => {
    if (!user) return;
    if (user.passedQuizIds.includes(quizId)) return;

    setUser({
      ...user,
      passedQuizIds: [...user.passedQuizIds, quizId],
      xp: user.xp + xpEarned,
    });

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const recordExamPassed = (examId: string, course: Course, scorePercentage: number): Certificate => {
    if (!user) throw new Error('يجب تسجيل الدخول');

    const passedExams = user.passedExamIds || [];
    const updatedExamIds = passedExams.includes(examId) ? passedExams : [...passedExams, examId];

    // Issue certificate
    const certId = `CERT-TECH-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const grade = scorePercentage >= 90 
      ? 'امتياز مع مرتبة الشرف (High Distinction)' 
      : scorePercentage >= 80 
        ? 'جيد جداً مرتفع (Very Good)' 
        : 'ناجح معتمد (Pass)';

    const newCert: Certificate = {
      id: certId,
      courseId: course.id,
      courseTitle: course.title,
      courseTitleEn: course.titleEn,
      studentName: user.name,
      studentEmail: user.email,
      issueDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      grade,
      scorePercentage,
      verificationCode: certId,
      instructorName: course.instructor.name,
      instructorTitle: course.instructor.title,
      durationHours: course.durationHours,
    };

    // Remove any older cert for same course and append new
    const filteredCerts = user.certificates.filter(c => c.courseId !== course.id);

    setUser({
      ...user,
      passedExamIds: updatedExamIds,
      certificates: [...filteredCerts, newCert],
      xp: user.xp + 300,
    });

    confetti({
      particleCount: 160,
      spread: 120,
      origin: { y: 0.4 },
    });

    return newCert;
  };

  const saveNote = (
    courseId: string,
    lessonId: string,
    lessonTitle: string,
    timestampSeconds: number,
    content: string
  ) => {
    const existingNotes = JSON.parse(localStorage.getItem('taallam_notes') || '[]');
    const newNote: Note = {
      id: `note-${Date.now()}`,
      courseId,
      lessonId,
      lessonTitle,
      timestampSeconds,
      content,
      createdAt: new Date().toLocaleDateString('ar-EG'),
    };
    const updated = [newNote, ...existingNotes];
    localStorage.setItem('taallam_notes', JSON.stringify(updated));
  };

  const deleteNote = (noteId: string) => {
    const existingNotes = JSON.parse(localStorage.getItem('taallam_notes') || '[]');
    const updated = existingNotes.filter((n: Note) => n.id !== noteId);
    localStorage.setItem('taallam_notes', JSON.stringify(updated));
  };

  const claimCertificate = (course: Course, scorePercentage = 95): Certificate => {
    if (!user) throw new Error('يجب تسجيل الدخول لاستلام الشهادة');

    const existingCert = user.certificates.find(c => c.courseId === course.id);
    if (existingCert) return existingCert;

    const certId = `CERT-LMS-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newCert: Certificate = {
      id: certId,
      courseId: course.id,
      courseTitle: course.title,
      courseTitleEn: course.titleEn,
      studentName: user.name,
      studentEmail: user.email,
      issueDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      grade: 'امتياز (Excellence)',
      scorePercentage,
      verificationCode: certId,
      instructorName: course.instructor.name,
      instructorTitle: course.instructor.title,
      durationHours: course.durationHours,
    };

    const updatedUser = {
      ...user,
      certificates: [...user.certificates, newCert],
      xp: user.xp + 250,
    };
    setUser(updatedUser);

    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.4 },
    });

    return newCert;
  };

  const createNewCourse = (newCourse: Course) => {
    const updated = [newCourse, ...courses];
    setCourses(updated);
    if (user) {
      setUser({
        ...user,
        xp: user.xp + 200,
      });
    }
    confetti({
      particleCount: 90,
      spread: 70,
    });
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    if (user) {
      setUser({
        ...user,
        enrolledCourseIds: user.enrolledCourseIds.filter(id => id !== courseId),
      });
    }
  };

  const clearAllCourses = () => {
    setCourses([]);
    if (user) {
      setUser({
        ...user,
        enrolledCourseIds: [],
        completedLessonIds: [],
        passedQuizIds: [],
        passedExamIds: [],
      });
    }
  };

  const addDiscussion = (
    category: ForumCategory,
    categoryNameAr: string,
    title: string,
    content: string,
    tags: string[] = [],
    codeSnippet?: { language: string; code: string },
    courseId?: string,
    lessonId?: string
  ) => {
    if (!user) {
      openAuthModal();
      return;
    }

    const newDisc: Discussion = {
      id: `disc-${Date.now()}`,
      category,
      categoryNameAr,
      courseId,
      lessonId,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: user.role,
      title,
      content,
      tags,
      codeSnippet,
      date: 'الآن',
      upvotes: 0,
      replies: [],
      isPinned: false,
      isLocked: false,
    };

    setDiscussions([newDisc, ...discussions]);
    setUser({ ...user, xp: user.xp + 40 });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  const addReply = (discussionId: string, content: string, codeSnippet?: string) => {
    if (!user) {
      openAuthModal();
      return;
    }

    const newReply: Reply = {
      id: `rep-${Date.now()}`,
      discussionId,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: user.role,
      content,
      codeSnippet,
      date: 'الآن',
      isInstructor: user.role === 'instructor' || user.role === 'admin',
      isAcceptedSolution: false,
      upvotes: 0
    };

    setDiscussions(
      discussions.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            replies: [...d.replies, newReply],
          };
        }
        return d;
      })
    );

    setUser({ ...user, xp: user.xp + 25 });
  };

  const upvoteDiscussion = (discussionId: string) => {
    setDiscussions(
      discussions.map(d => {
        if (d.id === discussionId) {
          return { ...d, upvotes: d.upvotes + 1 };
        }
        return d;
      })
    );
  };

  const upvoteReply = (discussionId: string, replyId: string) => {
    setDiscussions(
      discussions.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            replies: d.replies.map(r => r.id === replyId ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r)
          };
        }
        return d;
      })
    );
  };

  // Moderation Handlers
  const pinDiscussion = (discussionId: string) => {
    setDiscussions(
      discussions.map(d => {
        if (d.id === discussionId) {
          return { ...d, isPinned: !d.isPinned };
        }
        return d;
      })
    );
  };

  const lockDiscussion = (discussionId: string) => {
    setDiscussions(
      discussions.map(d => {
        if (d.id === discussionId) {
          return { ...d, isLocked: !d.isLocked };
        }
        return d;
      })
    );
  };

  const deleteDiscussion = (discussionId: string) => {
    setDiscussions(discussions.filter(d => d.id !== discussionId));
  };

  const markAcceptedSolution = (discussionId: string, replyId: string) => {
    setDiscussions(
      discussions.map(d => {
        if (d.id === discussionId) {
          const isAlreadyAccepted = d.acceptedReplyId === replyId;
          return {
            ...d,
            acceptedReplyId: isAlreadyAccepted ? undefined : replyId,
            replies: d.replies.map(r => ({
              ...r,
              isAcceptedSolution: r.id === replyId ? !isAlreadyAccepted : false
            }))
          };
        }
        return d;
      })
    );
  };

  const reportDiscussion = (discussionId: string, reason: string) => {
    setDiscussions(
      discussions.map(d => {
        if (d.id === discussionId) {
          return { ...d, isReported: true, reportReason: reason };
        }
        return d;
      })
    );
  };

  const dismissReport = (discussionId: string) => {
    setDiscussions(
      discussions.map(d => {
        if (d.id === discussionId) {
          return { ...d, isReported: false, reportReason: undefined };
        }
        return d;
      })
    );
  };

  const getCourseProgress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return { completedCount: 0, totalCount: 0, percentage: 0 };

    const allLessonIds = course.sections.flatMap(s => s.lessons.map(l => l.id));
    const totalCount = allLessonIds.length;
    if (totalCount === 0) return { completedCount: 0, totalCount: 0, percentage: 0 };

    const completedCount = user
      ? allLessonIds.filter(id => user.completedLessonIds.includes(id)).length
      : 0;

    const percentage = Math.round((completedCount / totalCount) * 100);
    return { completedCount, totalCount, percentage };
  };

  // Messaging System Handlers
  const sendMessage = (msgData: {
    recipientType: MessageRecipientType;
    recipientId?: string;
    recipientName?: string;
    courseId?: string;
    courseTitle?: string;
    subject: string;
    content: string;
    attachments?: Resource[];
    isImportant?: boolean;
  }) => {
    if (!user) return;

    const newMessage: StudentMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      senderRole: user.role,
      recipientType: msgData.recipientType,
      recipientId: msgData.recipientId,
      recipientName: msgData.recipientName,
      courseId: msgData.courseId,
      courseTitle: msgData.courseTitle,
      subject: msgData.subject,
      content: msgData.content,
      attachments: msgData.attachments || [],
      date: 'الآن',
      isRead: true, // sender has read it
      isImportant: !!msgData.isImportant,
      replies: []
    };

    setMessages(prev => [newMessage, ...prev]);
  };

  const replyToMessage = (messageId: string, content: string, attachments?: Resource[]) => {
    if (!user || !content.trim()) return;

    const newReply: MessageReply = {
      id: `rep-msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      senderRole: user.role,
      content: content.trim(),
      date: 'الآن',
      attachments: attachments || []
    };

    setMessages(prev =>
      prev.map(m => {
        if (m.id === messageId) {
          return {
            ...m,
            replies: [...(m.replies || []), newReply]
          };
        }
        return m;
      })
    );
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, isRead: true } : m))
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const unreadMessagesCount = messages.filter(m => {
    // If sent to current user directly, or broadcast to course enrolled, or broadcast all
    const isForMe = 
      m.recipientType === 'all_students' ||
      (m.recipientType === 'individual' && m.recipientId === user?.id) ||
      (m.recipientType === 'course_broadcast' && (!m.courseId || user?.enrolledCourseIds.includes(m.courseId)));
    return isForMe && !m.isRead && m.senderId !== user?.id;
  }).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isSuperAdmin,
        registeredUsers,
        roleRequests,
        courses,
        discussions,
        messages,
        unreadMessagesCount,
        theme,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        adminPasscode,
        setAdminPasscode,
        loginWithGoogle,
        signInWithGooglePopup,
        logout,
        switchRole,
        updateUserRole,
        requestInstructorUpgrade,
        approveRoleRequest,
        rejectRoleRequest,
        deletePlatformUser,
        toggleTheme,
        enrollInCourse,
        markLessonCompleted,
        recordQuizPassed,
        recordExamPassed,
        saveNote,
        deleteNote,
        claimCertificate,
        createNewCourse,
        deleteCourse,
        clearAllCourses,
        addDiscussion,
        addReply,
        upvoteDiscussion,
        upvoteReply,
        pinDiscussion,
        lockDiscussion,
        deleteDiscussion,
        markAcceptedSolution,
        reportDiscussion,
        dismissReport,
        getCourseProgress,
        sendMessage,
        replyToMessage,
        markMessageAsRead,
        deleteMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
