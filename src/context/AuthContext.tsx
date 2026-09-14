import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Course, Note, Certificate, Discussion, Reply, ForumCategory, StudentMessage, MessageRecipientType, MessageReply, Resource } from '../types';
import { INITIAL_COURSES, INITIAL_DISCUSSIONS, INITIAL_MESSAGES } from '../data/coursesData';
import confetti from 'canvas-confetti';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  courses: Course[];
  discussions: Discussion[];
  messages: StudentMessage[];
  unreadMessagesCount: number;
  theme: 'light' | 'dark';
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: (customEmail?: string, customName?: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  toggleTheme: () => void;
  enrollInCourse: (courseId: string) => boolean;
  markLessonCompleted: (lessonId: string, courseId: string) => void;
  recordQuizPassed: (quizId: string, xpEarned?: number) => void;
  recordExamPassed: (examId: string, course: Course, scorePercentage: number) => Certificate;
  saveNote: (courseId: string, lessonId: string, lessonTitle: string, timestampSeconds: number, content: string) => void;
  deleteNote: (noteId: string) => void;
  claimCertificate: (course: Course, scorePercentage?: number) => Certificate;
  createNewCourse: (newCourse: Course) => void;
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

const DEFAULT_USER: User = {
  id: 'usr-google-1',
  name: 'محمد ماجد',
  email: 'mohamedmaged3g@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'student',
  xp: 1450,
  streakDays: 6,
  enrolledCourseIds: ['cobol-legacy-systems', 'rust-systems-concurrency', 'ai-masterclass'],
  completedLessonIds: ['cob-l1', 'ai-l1'],
  passedQuizIds: ['q-cob-1', 'q-ai-1'],
  passedExamIds: [],
  certificates: [],
  headline: 'طالب شغوف بلغات البرمجة القديمة والحديثة وهندسة الذكاء الاصطناعي',
  createdAt: '2026-01-10',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('taallam_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('taallam_courses');
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

  // Sync state to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('taallam_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('taallam_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('taallam_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('taallam_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('taallam_messages', JSON.stringify(messages));
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

  const loginWithGoogle = (
    customEmail = 'mohamedmaged3g@gmail.com',
    customName = 'محمد ماجد',
    role: UserRole = 'student'
  ) => {
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customEmail)}`;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: customName,
      email: customEmail,
      avatar: customEmail === 'mohamedmaged3g@gmail.com' ? DEFAULT_USER.avatar : avatarUrl,
      role: role,
      xp: 500,
      streakDays: 1,
      enrolledCourseIds: ['cobol-legacy-systems', 'ai-masterclass'],
      completedLessonIds: [],
      passedQuizIds: [],
      passedExamIds: [],
      certificates: [],
      headline: role === 'instructor' ? 'معلّم ومصمم دورات تكنولوجية' : (role === 'admin' ? 'مدير المنصة ومشرف المجتمع' : 'طالب متخصص في التقنية ولغات البرمجة'),
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    closeAuthModal();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    setUser({ ...user, role: newRole });
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
        courses,
        discussions,
        messages,
        unreadMessagesCount,
        theme,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        logout,
        switchRole,
        toggleTheme,
        enrollInCourse,
        markLessonCompleted,
        recordQuizPassed,
        recordExamPassed,
        saveNote,
        deleteNote,
        claimCertificate,
        createNewCourse,
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
