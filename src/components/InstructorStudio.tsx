import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Course, 
  CourseCategory, 
  CourseLevel, 
  Section, 
  Lesson, 
  Resource, 
  Quiz, 
  QuizQuestion,
  FinalExam,
  FinalExamQuestion
} from '../types';
import { 
  Presentation, 
  PlusCircle, 
  Users, 
  Star, 
  BookOpen, 
  DollarSign, 
  Check, 
  Trash2, 
  Video, 
  HelpCircle, 
  Sparkles, 
  UploadCloud, 
  Layers,
  ArrowRight,
  FileText,
  Paperclip,
  Eye,
  Mail,
  Award,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { DocumentViewerModal } from './DocumentViewerModal';

interface InstructorStudioProps {
  onBack: () => void;
  onCourseCreated: (course: Course) => void;
  onOpenMessages?: () => void;
}

export const InstructorStudio: React.FC<InstructorStudioProps> = ({
  onBack,
  onCourseCreated,
  onOpenMessages,
}) => {
  const { user, courses, createNewCourse } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [activeStudioTab, setActiveStudioTab] = useState<'courses' | 'quick_upload' | 'exam_builder'>('courses');

  // Preview resource modal
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<CourseCategory>('web');
  const [level, setLevel] = useState<CourseLevel>('مبتدئ');
  const [durationHours, setDurationHours] = useState(8);
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80');
  const [outcomesText, setOutcomesText] = useState('إتقان المفاهيم الأساسية\nبناء مشاريع تطبيقية واقعية\nالحصول على شهادة إتمام معتمدة');
  const [requirementsText, setRequirementsText] = useState('معرفة مبدئية باستخدام الحاسوب');

  // Final Exam State
  const [hasFinalExam, setHasFinalExam] = useState(true);
  const [examTitle, setExamTitle] = useState('الاختبار النهائي الشامل للمسار التدريبي');
  const [examDuration, setExamDuration] = useState(30);
  const [examPassingScore, setExamPassingScore] = useState(75);
  const [examQuestions, setExamQuestions] = useState<FinalExamQuestion[]>([
    {
      id: 1,
      question: 'ما هي القاعدة الأساسية لكتابة برمجيات آمنة وعالية الكفاءة؟',
      options: [
        'إدارة الموارد والذاكرة وتفادي سباقات البيانات',
        'تجاهل معالجة الأخطاء الاستثنائية',
        'دمج جميع الأكواد في دالة واحدة',
        'عدم إجراء اختبارات وحدات'
      ],
      correctIndex: 0,
      explanation: 'إدارة الذاكرة والتعامل السليم مع المتزامنات يضمنان استقرار النظام وأمانه.',
      topic: 'هندسة النظم'
    },
    {
      id: 2,
      question: 'كيف يتم التحقق من صحة المدخلات قبل معالجتها برمجياً؟',
      options: [
        'الثقة العمياء بجميع المدخلات',
        'استخدام Schema Validation والتحقق من الأنواع والحدود',
        'تعطيل جدران الحماية وقواعد البيانات',
        'حذف ملفات التوثيق'
      ],
      correctIndex: 1,
      explanation: 'التحقق الصارم من صحة المدخلات يحمي التطبيق من ثغرات الحقن والأخطاء المنطقية.',
      topic: 'الأمان والتحقق'
    }
  ]);

  // Lessons builder state
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'sec-new-1',
      title: 'الوحدة الأولى: الأساسيات والمدخل النظري والتطبيقي',
      lessons: [
        {
          id: 'l-new-1',
          title: 'الدرس الأول: مقدمة ونظرة عامة على المنهج',
          titleEn: 'Lesson 1: Course Overview',
          durationMinutes: 12,
          videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
          videoType: 'youtube',
          description: 'مقدمة شاملة لأهم المفاهيم في هذا المسار التدريبي ومخرجات التعلم.',
          resources: [
            {
              id: 'res-init-1',
              title: 'الملف التمهيدي ودليل البداية السريعة.pdf',
              type: 'pdf',
              size: '2.1 MB',
              url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
              description: 'شرح أهداف الوحدة والأدوات اللازمة'
            }
          ],
          quiz: {
            id: 'q-new-1',
            title: 'اختبار الدرس الأول',
            passingScore: 70,
            questions: [
              {
                id: 1,
                question: 'ما هي أهم ميزة في اتباع أفضل الممارسات البرمجية؟',
                options: ['بناء كود قابل للصيانة والتوسع بجودة عالية', 'إضاعة الوقت', 'تعقيد المنظومة بدون سبب', 'إلغاء مراحل الاختبار'],
                correctIndex: 0,
                explanation: 'التنظيم المعياري يسهل صيانة وتطوير البرمجيات للفرق والمؤسسات.'
              }
            ]
          }
        }
      ]
    }
  ]);

  // Expanded section / lesson state for rich editing
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>('l-new-1');

  // Handle adding section
  const handleAddSection = () => {
    const newSec: Section = {
      id: `sec-new-${Date.now()}`,
      title: `الوحدة ${sections.length + 1}: تطبيقات متقدمة ومشاريع`,
      lessons: []
    };
    setSections([...sections, newSec]);
  };

  // Handle adding lesson
  const handleAddLesson = (sectionIndex: number) => {
    const newLessonId = `l-new-${Date.now()}`;
    const newLesson: Lesson = {
      id: newLessonId,
      title: `درس جديد ${sections[sectionIndex].lessons.length + 1}`,
      durationMinutes: 15,
      videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
      videoType: 'youtube',
      description: 'شرح تطبيقي للمفاهيم المتقدمة مع أمثلة وملفات تدريبية.',
      resources: [],
      quiz: {
        id: `q-${Date.now()}`,
        title: `اختبار الدرس`,
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: 'ما الهدف الأساسي من تطبيق هذا المفهوم؟',
            options: ['بناء مهارات عملية عالية الجودة', 'تعطيل النظام', 'كتابة أكواد غير مفهومة', 'لا يوجد هدف'],
            correctIndex: 0,
            explanation: 'التطبيق العملي يرسخ المعرفة ويوفر حلولاً فعالة.'
          }
        ]
      }
    };

    const updated = [...sections];
    updated[sectionIndex].lessons.push(newLesson);
    setSections(updated);
    setExpandedLessonId(newLessonId);
  };

  // Handle Video file upload for a lesson
  const handleLessonVideoUpload = (sIdx: number, lIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    const updated = [...sections];
    updated[sIdx].lessons[lIdx].videoUrl = blobUrl;
    updated[sIdx].lessons[lIdx].videoType = 'mp4';
    setSections(updated);
  };

  // Handle PDF file upload for a lesson
  const handleLessonPdfUpload = (sIdx: number, lIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    const newRes: Resource = {
      id: `res-${Date.now()}`,
      title: file.name,
      type: 'pdf',
      size: sizeMb,
      url: blobUrl,
      pageCount: 10,
      description: 'ملف شرح PDF تم رفعه بواسطة المعلم'
    };

    const updated = [...sections];
    if (!updated[sIdx].lessons[lIdx].resources) {
      updated[sIdx].lessons[lIdx].resources = [];
    }
    updated[sIdx].lessons[lIdx].resources!.push(newRes);
    setSections(updated);
  };

  // Handle Adding Quiz Question to Lesson
  const handleAddQuizQuestion = (sIdx: number, lIdx: number) => {
    const updated = [...sections];
    const lesson = updated[sIdx].lessons[lIdx];
    if (!lesson.quiz) {
      lesson.quiz = {
        id: `q-${Date.now()}`,
        title: `اختبار ${lesson.title}`,
        passingScore: 70,
        questions: []
      };
    }

    const newQ: QuizQuestion = {
      id: Date.now(),
      question: 'اكتب نص السؤال هنا...',
      options: ['الخيار الأول (الصحيح)', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
      correctIndex: 0,
      explanation: 'شرح توضيحي لسبب صحة هذا الخيار.'
    };

    lesson.quiz.questions.push(newQ);
    setSections(updated);
  };

  // Handle Adding Exam Question
  const handleAddExamQuestion = () => {
    const newQ: FinalExamQuestion = {
      id: Date.now(),
      question: 'اكتب نص سؤال الاختبار النهائي هنا...',
      options: ['الخيار الأول (الصحيح)', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
      correctIndex: 0,
      explanation: 'شرح علمي وإرشادي للإجابة الصحيحة.',
      topic: 'مفاهيم عامة'
    };
    setExamQuestions([...examQuestions, newQ]);
  };

  // Handle Publishing Course
  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);

    const categoryNames: { [k in CourseCategory]: string } = {
      'legacy-programming': 'لغات البرمجة العريقة',
      'modern-programming': 'لغات البرمجة الحديثة',
      ai: 'الذكاء الاصطناعي',
      web: 'تطوير الويب',
      data: 'علم البيانات',
      cybersecurity: 'الأمن السيبراني',
      business: 'الأعمال والتقنية',
      all: 'جميع المسارات'
    };

    const finalExamObj: FinalExam | undefined = hasFinalExam ? {
      id: `exam-${Date.now()}`,
      title: examTitle,
      durationMinutes: Number(examDuration) || 30,
      passingScore: Number(examPassingScore) || 75,
      questions: examQuestions,
      instructions: 'اقرأ الأسئلة بعناية وتأكد من مراجعة إجاباتك قبل التسليم النهائي للحصول على الشهادة المعتمدة.'
    } : undefined;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title,
      titleEn: titleEn || title,
      subtitle: subtitle || 'دورة تدريبية متكاملة مدعمة بالشرح والفيديوهات وملفات PDF والاختبارات',
      category,
      categoryNameAr: categoryNames[category] || 'تطوير تقني',
      level,
      price: 0,
      rating: 5.0,
      reviewsCount: 1,
      studentsCount: 1,
      durationHours: Number(durationHours) || 10,
      lessonsCount: totalLessons,
      thumbnail: thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      badge: 'جديد 🌟',
      isFeatured: true,
      updatedAt: new Date().toISOString().split('T')[0],
      instructor: {
        id: user.id,
        name: user.name,
        title: user.headline || 'معلم معتمد في منصة تعلّم',
        avatar: user.avatar,
        rating: 5.0,
        studentsCount: 100,
        bio: user.bio || 'مدرب شغوف بمشاركة الخبرات العملية والتعليم التفاعلي.',
      },
      tags: [category, 'فيديوهات شرح', 'ملفات PDF', 'اختبارات تفاعلية'],
      outcomes: outcomesText.split('\n').filter(t => t.trim()),
      requirements: requirementsText.split('\n').filter(t => t.trim()),
      sections,
      finalExam: finalExamObj,
    };

    createNewCourse(newCourse);
    setIsCreating(false);
    onCourseCreated(newCourse);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 md:p-8 rounded-3xl border border-indigo-700/40 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Presentation className="w-3.5 h-3.5" />
            <span>استوديو المعلم المتقدم</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">
            إدارة ورفع المناهج، الفيديوهات، ملفات PDF، والاختبارات
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            ارفع فيديوهات الشرح وملفات PDF مع العرض المباشر، أنشئ الاختبارات القصيرة والشاملة، وتواصل مع طلابك فردياً وجماعياً.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenMessages && (
            <button
              onClick={onOpenMessages}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs md:text-sm rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>مستودع الرسائل والتواصل</span>
            </button>
          )}

          <button
            onClick={() => setIsCreating(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء دورة تدريبية جديدة</span>
          </button>
        </div>
      </div>

      {/* Instructor Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">إجمالي الطلاب</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">12,450</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">تفاعل نشط</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">الدورات المنشورة</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{courses.length}</div>
          <div className="text-[10px] text-indigo-600 font-bold mt-1">مدعمة بالفيديو والـ PDF</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">ملفات الشرح PDF</span>
            <FileText className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">48 ملف</div>
          <div className="text-[10px] text-rose-600 font-bold mt-1">عرض وتنزيل مباشر</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">الاختبارات التفاعلية</span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">64 اختبار</div>
          <div className="text-[10px] text-amber-600 font-bold mt-1">تقييم تلقائي فوري</div>
        </div>
      </div>

      {/* Creation Modal / Inline Form */}
      {isCreating ? (
        <form onSubmit={handlePublishCourse} className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Presentation className="w-5 h-5 text-indigo-600" />
                <span>نموذج بناء ونشر دورة متكاملة</span>
              </h2>
              <p className="text-xs text-slate-500">
                أدخل تفاصيل الدورة، ارفع ملفات الفيديو ومستندات PDF، وأنشئ الاختبارات القصيرة والنهائية
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200"
            >
              إلغاء
            </button>
          </div>

          {/* Basic Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                عنوان الدورة بالعربية:
              </label>
              <input
                type="text"
                required
                placeholder="مثال: هندسة النظم السحابية والبرمجة المتزامنة..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                العنوان بالإنجليزية (اختياري):
              </label>
              <input
                type="text"
                placeholder="Advanced Systems Engineering..."
                value={titleEn}
                onChange={e => setTitleEn(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                المسار والتصنيف:
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CourseCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                <option value="legacy-programming">لغات البرمجة العريقة (COBOL, C, Fortran, Pascal)</option>
                <option value="modern-programming">لغات البرمجة الحديثة (Rust, Go, TypeScript, Python)</option>
                <option value="ai">الذكاء الاصطناعي وهندسة الأوامر (AI)</option>
                <option value="web">تطوير الويب والنظم (Web Dev)</option>
                <option value="data">علم البيانات وتحليل النظم (Data Science)</option>
                <option value="cybersecurity">الأمن السيبراني وحماية البنى التحتية (Cybersecurity)</option>
                <option value="business">ريادة الأعمال والتقنية (Business)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                المستوى:
              </label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as CourseLevel)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                <option value="مبتدئ">مبتدئ</option>
                <option value="متوسط">متوسط</option>
                <option value="متقدم">متقدم</option>
                <option value="جميع المستويات">جميع المستويات</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الوصف المختصر (Subtitle):
              </label>
              <input
                type="text"
                placeholder="سطر يشرح ما سيكتسبه الطالب وأهمية المنهج..."
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Curriculum, Videos & PDF Attachments Builder */}
          <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span>منهج الدروس، الفيديوهات ومستندات PDF ({sections.length} وحدات):</span>
                </h3>
                <p className="text-xs text-slate-500">
                  يمكنك رفع ملف فيديو MP4 أو وضع رابط يوتيوب، ورفع ملفات PDF مع ميزة العرض المباشر للطلاب
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة وحدة جديدة</span>
              </button>
            </div>

            {sections.map((section, sIdx) => (
              <div key={section.id} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={section.title}
                    onChange={e => {
                      const updated = [...sections];
                      updated[sIdx].title = e.target.value;
                      setSections(updated);
                    }}
                    className="font-bold text-sm text-indigo-700 dark:text-indigo-300 bg-transparent border-b border-dashed border-indigo-300 dark:border-indigo-700 focus:outline-none px-1"
                  />

                  <button
                    type="button"
                    onClick={() => handleAddLesson(sIdx)}
                    className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>إضافة درس</span>
                  </button>
                </div>

                {/* Lessons in Section */}
                <div className="space-y-3">
                  {section.lessons.map((lesson, lIdx) => {
                    const isExpanded = expandedLessonId === lesson.id;

                    return (
                      <div key={lesson.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        {/* Lesson Header */}
                        <div 
                          onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                          className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                              {lIdx + 1}
                            </div>
                            <div>
                              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                {lesson.title}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                <span>{lesson.durationMinutes} دقيقة</span>
                                {lesson.resources && lesson.resources.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-0.5">
                                      <FileText className="w-3 h-3" />
                                      <span>{lesson.resources.length} ملف PDF</span>
                                    </span>
                                  </>
                                )}
                                {lesson.quiz && (
                                  <>
                                    <span>•</span>
                                    <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                                      <HelpCircle className="w-3 h-3" />
                                      <span>اختبار ({lesson.quiz.questions.length})</span>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = [...sections];
                                updated[sIdx].lessons = updated[sIdx].lessons.filter(l => l.id !== lesson.id);
                                setSections(updated);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                              title="حذف الدرس"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>
                        </div>

                        {/* Expanded Lesson Editor */}
                        {isExpanded && (
                          <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  عنوان الدرس:
                                </label>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={e => {
                                    const updated = [...sections];
                                    updated[sIdx].lessons[lIdx].title = e.target.value;
                                    setSections(updated);
                                  }}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  مدة الدرس (بالدقائق):
                                </label>
                                <input
                                  type="number"
                                  value={lesson.durationMinutes}
                                  onChange={e => {
                                    const updated = [...sections];
                                    updated[sIdx].lessons[lIdx].durationMinutes = Number(e.target.value);
                                    setSections(updated);
                                  }}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                                />
                              </div>
                            </div>

                            {/* Video Source: Upload or URL */}
                            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                  <Video className="w-4 h-4 text-emerald-500" />
                                  <span>فيديو الشرح (رابط أو رفع ملف MP4):</span>
                                </span>

                                <label className="cursor-pointer px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1">
                                  <UploadCloud className="w-3.5 h-3.5" />
                                  <span>رفع فيديو من الجهاز</span>
                                  <input
                                    type="file"
                                    accept="video/mp4,video/*"
                                    onChange={e => handleLessonVideoUpload(sIdx, lIdx, e)}
                                    className="hidden"
                                  />
                                </label>
                              </label>

                              <div className="flex items-center gap-2">
                                <input
                                  type="url"
                                  value={lesson.videoUrl}
                                  onChange={e => {
                                    const updated = [...sections];
                                    updated[sIdx].lessons[lIdx].videoUrl = e.target.value;
                                    setSections(updated);
                                  }}
                                  placeholder="رابط يوتيوب أو فيديو مباشر..."
                                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                                />

                                {lesson.videoUrl && (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewResource({
                                      id: 'preview-vid',
                                      title: `معاينة فيديو: ${lesson.title}`,
                                      type: 'video',
                                      url: lesson.videoUrl
                                    })}
                                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>معاينة فورية</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* PDF Resources Section for this lesson */}
                            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                  <FileText className="w-4 h-4 text-rose-500" />
                                  <span>ملفات ومستندات الشرح PDF:</span>
                                </span>

                                <label className="cursor-pointer px-2.5 py-1 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-lg text-xs font-bold hover:bg-rose-100 flex items-center gap-1">
                                  <UploadCloud className="w-3.5 h-3.5" />
                                  <span>رفع مستند PDF</span>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={e => handleLessonPdfUpload(sIdx, lIdx, e)}
                                    className="hidden"
                                  />
                                </label>
                              </div>

                              {lesson.resources && lesson.resources.length > 0 ? (
                                <div className="space-y-1.5">
                                  {lesson.resources.map((res, rIdx) => (
                                    <div
                                      key={res.id}
                                      className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                                        <span className="font-bold truncate">{res.title}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">({res.size || 'PDF'})</span>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => setPreviewResource(res)}
                                          className="px-2 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg text-[11px] font-bold flex items-center gap-1"
                                        >
                                          <Eye className="w-3 h-3" />
                                          <span>عرض مباشر</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...sections];
                                            updated[sIdx].lessons[lIdx].resources = updated[sIdx].lessons[lIdx].resources?.filter((_, i) => i !== rIdx);
                                            setSections(updated);
                                          }}
                                          className="p-1 text-slate-400 hover:text-rose-500"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400">
                                  لم يتم إرفاق ملفات PDF لهذا الدرس بعد. اضغط "رفع مستند PDF" بالأعلى لإرفاق المذكرات والشروحات.
                                </p>
                              )}
                            </div>

                            {/* Quiz Builder for this lesson */}
                            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                  <HelpCircle className="w-4 h-4 text-amber-500" />
                                  <span>اختبار الدرس التفاعلي (Quiz):</span>
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleAddQuizQuestion(sIdx, lIdx)}
                                  className="px-2.5 py-1 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded-lg text-xs font-bold hover:bg-amber-100 flex items-center gap-1"
                                >
                                  <PlusCircle className="w-3.5 h-3.5" />
                                  <span>إضافة سؤال للاختبار</span>
                                </button>
                              </div>

                              {lesson.quiz && lesson.quiz.questions.length > 0 && (
                                <div className="space-y-3">
                                  {lesson.quiz.questions.map((q, qIdx) => (
                                    <div key={q.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-emerald-600">سؤال {qIdx + 1}:</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...sections];
                                            updated[sIdx].lessons[lIdx].quiz!.questions = updated[sIdx].lessons[lIdx].quiz!.questions.filter((_, i) => i !== qIdx);
                                            setSections(updated);
                                          }}
                                          className="text-slate-400 hover:text-rose-500 p-1"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>

                                      <input
                                        type="text"
                                        value={q.question}
                                        onChange={e => {
                                          const updated = [...sections];
                                          updated[sIdx].lessons[lIdx].quiz!.questions[qIdx].question = e.target.value;
                                          setSections(updated);
                                        }}
                                        placeholder="نص السؤال..."
                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                      />

                                      <div className="grid grid-cols-2 gap-2">
                                        {q.options.map((opt, optIdx) => (
                                          <div key={optIdx} className="flex items-center gap-1.5">
                                            <input
                                              type="radio"
                                              name={`correct-${lesson.id}-${q.id}`}
                                              checked={q.correctIndex === optIdx}
                                              onChange={() => {
                                                const updated = [...sections];
                                                updated[sIdx].lessons[lIdx].quiz!.questions[qIdx].correctIndex = optIdx;
                                                setSections(updated);
                                              }}
                                              title="حدد الإجابة الصحيحة"
                                            />
                                            <input
                                              type="text"
                                              value={opt}
                                              onChange={e => {
                                                const updated = [...sections];
                                                updated[sIdx].lessons[lIdx].quiz!.questions[qIdx].options[optIdx] = e.target.value;
                                                setSections(updated);
                                              }}
                                              className="flex-1 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Final Comprehensive Exam Builder */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    الاختبار النهائي الشامل للدورة التدريبية (Final Exam & Certification)
                  </h3>
                  <p className="text-xs text-slate-500">
                    اجتياز هذا الاختبار يمنح الطالب الشهادة المعتمدة مباشرة
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-indigo-700 dark:text-indigo-300">
                <input
                  type="checkbox"
                  checked={hasFinalExam}
                  onChange={e => setHasFinalExam(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span>تفعيل الاختبار النهائي</span>
              </label>
            </div>

            {hasFinalExam && (
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      عنوان الاختبار النهائي:
                    </label>
                    <input
                      type="text"
                      value={examTitle}
                      onChange={e => setExamTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      المدة الزمنية (بالدقائق):
                    </label>
                    <input
                      type="number"
                      value={examDuration}
                      onChange={e => setExamDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      نسبة النجاح المطلوبة (%):
                    </label>
                    <input
                      type="number"
                      value={examPassingScore}
                      onChange={e => setExamPassingScore(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Exam Questions List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      أسئلة الاختبار النهائي ({examQuestions.length}):
                    </span>
                    <button
                      type="button"
                      onClick={handleAddExamQuestion}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold hover:bg-indigo-100 flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>إضافة سؤال للاختبار النهائي</span>
                    </button>
                  </div>

                  {examQuestions.map((eq, eqIdx) => (
                    <div key={eq.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-600">سؤال {eqIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setExamQuestions(examQuestions.filter((_, i) => i !== eqIdx))}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={eq.question}
                        onChange={e => {
                          const updated = [...examQuestions];
                          updated[eqIdx].question = e.target.value;
                          setExamQuestions(updated);
                        }}
                        placeholder="نص سؤال الاختبار النهائي..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        {eq.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name={`exam-correct-${eq.id}`}
                              checked={eq.correctIndex === oIdx}
                              onChange={() => {
                                const updated = [...examQuestions];
                                updated[eqIdx].correctIndex = oIdx;
                                setExamQuestions(updated);
                              }}
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={e => {
                                const updated = [...examQuestions];
                                updated[eqIdx].options[oIdx] = e.target.value;
                                setExamQuestions(updated);
                              }}
                              className="flex-1 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              type="submit"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>نشر الدورة فوراً وإتاحتها للطلاب 🚀</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-200"
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        /* Instructor Courses List */
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                الدورات التدريبية المتاحة تحت إشرافك ({courses.length})
              </h3>
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>إضافة دورة</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {courses.map(course => (
                <div key={course.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-12 object-cover rounded-xl shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {course.title}
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                        <span>{course.categoryNameAr}</span>
                        <span>•</span>
                        <span>{course.durationHours} ساعة</span>
                        <span>•</span>
                        <span>{course.lessonsCount} درس</span>
                        <span>•</span>
                        <span>{course.studentsCount} طالب</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {course.finalExam && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>اختبار نهائي وشهادة</span>
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
                      منشورة ومتاحة
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal for Video or PDF */}
      <DocumentViewerModal
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
      />
    </div>
  );
};
