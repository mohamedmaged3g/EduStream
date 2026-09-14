import { Course, Discussion, Review, StudentMessage } from '../types';

// Courses are initially empty so instructors can add their own courses, videos, PDFs and quizzes
export const INITIAL_COURSES: Course[] = [];

export const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: 'disc-pinned-1',
    category: 'announcements',
    categoryNameAr: 'إعلانات وإرشادات المنصة',
    userName: 'إدارة الأكاديمية',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    userRole: 'admin',
    title: '📌 مرحباً بكم في منصة تَعَلَّمْ: المنصة مهيأة للمعلمين والمدربين لنشر دوراتهم',
    content: 'أهلاً بجميع المعلمين والطلاب! المنصة الآن جاهزة وفارغة تماماً لإتاحة المجال للمعلمين لرفع دوراتهم التدريبية وفيديوهات الشرح ومستندات الـ PDF مع العرض المباشر وتنسيق الاختبارات وإصدار الشهادات. نرحب بكم جميعاً!',
    tags: ['إرشادات', 'المجتمع', 'ترحيب'],
    date: 'مثبت في الأعلى',
    upvotes: 12,
    isPinned: true,
    isLocked: false,
    replies: []
  }
];

export const INITIAL_MESSAGES: StudentMessage[] = [];
