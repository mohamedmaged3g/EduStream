import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Course, Lesson, Quiz, Certificate, Resource } from '../types';
import { FinalExamModal } from './FinalExamModal';
import { DocumentViewerModal } from './DocumentViewerModal';
import { 
  ArrowRight, 
  PlayCircle, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Download, 
  Code, 
  Award, 
  Send, 
  Share2, 
  ThumbsUp, 
  RotateCcw, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Maximize2,
  Trash2,
  Bookmark,
  GraduationCap,
  Eye,
  Video,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
  onViewCertificate: (cert: Certificate) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  onBack,
  onViewCertificate,
}) => {
  const { 
    user, 
    markLessonCompleted, 
    recordQuizPassed, 
    saveNote, 
    deleteNote, 
    claimCertificate, 
    discussions, 
    addDiscussion, 
    addReply, 
    upvoteDiscussion,
    getCourseProgress 
  } = useAuth();

  const [isFinalExamOpen, setIsFinalExamOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  // Find first uncompleted lesson or first lesson
  const allLessons = course.sections.flatMap(s => s.lessons);
  const [activeLesson, setActiveLesson] = useState<Lesson>(() => {
    if (user) {
      const uncompleted = allLessons.find(l => !user.completedLessonIds.includes(l.id));
      if (uncompleted) return uncompleted;
    }
    return allLessons[0] || null;
  });

  const [activeTab, setActiveTab] = useState<'tutor' | 'overview' | 'quiz' | 'discussion' | 'code' | 'resources'>('tutor');
  
  // Gemini AI Tutor Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; time: string }[]>([
    {
      role: 'assistant',
      text: `مرحباً بك! أنا رفيقك التعليمي الذكي بالذكاء الاصطناعي (Gemini 3) لدرس "${activeLesson?.title}". كيف يمكنني مساعدتك في توضيح المفاهيم أو حل التمارين اليوم؟`,
      time: 'الآن'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Notes state
  const [currentNoteText, setCurrentNoteText] = useState('');
  const [savedNotes, setSavedNotes] = useState<any[]>([]);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Discussion state
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [replyTextMap, setReplyTextMap] = useState<{ [discId: string]: string }>({});

  // Code Playground State
  const [codeEditorText, setCodeEditorText] = useState<string>(activeLesson?.codeSnippet?.code || `// جرب تشغيل كود TypeScript / JavaScript هنا\nconsole.log("أهلاً بك في منصة تعلّم!");`);
  const [codeOutput, setCodeOutput] = useState<string>('');

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load notes on mount / lesson switch
  useEffect(() => {
    try {
      const allNotes = JSON.parse(localStorage.getItem('taallam_notes') || '[]');
      const filtered = allNotes.filter((n: any) => n.courseId === course.id && n.lessonId === activeLesson?.id);
      setSavedNotes(filtered);
    } catch {
      setSavedNotes([]);
    }
    // Update default code snippet
    if (activeLesson?.codeSnippet?.code) {
      setCodeEditorText(activeLesson.codeSnippet.code);
    }
    // Reset quiz state on lesson change
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [activeLesson, course.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputMessage;
    if (!promptToSend.trim() || isAiLoading) return;

    const userMsg = {
      role: 'user' as const,
      text: promptToSend,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: course.title,
          lessonTitle: activeLesson.title,
          message: promptToSend
        })
      });
      const data = await res.json();
      const assistantMsg = {
        role: 'assistant' as const,
        text: data.text || (data.error ? `عذراً، الضغط مرتفع حالياً على خوادم الذكاء الاصطناعي. يمكنك إعادة المحاولة بعد لحظات.\n\nبخصوص درس "${activeLesson.title}"، يركز هذا الدرس على التطبيق المباشر للأكواد والتمارين.` : 'أهلاً بك! يمكنك متابعة الشرح والتطبيق العملي.'),
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `أهلاً بك في درس "${activeLesson.title}".\n\nيركز هذا الجزء على البنية البرمجية والمفاهيم الأساسية، يمكنك كتابة وتجربة الكود مباشرة في محرر الدروس.`,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSummarizeWithAi = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: course.title,
          lessonTitle: activeLesson.title,
          lessonContent: activeLesson.description
        })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.summary || `📌 **ملخص درس: ${activeLesson.title}**\n\n1. **المفهوم العام**: استيعاب المفاهيم الجوهرية للدرس وتطبيقاتها.\n2. **الخطوات العملية**: اتباع أفضل الممارسات وكتابة الأكواد بوضوح.\n3. **نصيحة المراجعة**: تجربة الأمثلة وإتمام التقييم القصير.`,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setActiveTab('tutor');
    } catch {
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `📌 **ملخص درس: ${activeLesson.title}**\n\n1. **المفاهيم الأساسية والتعريفات**: التعرف على العناصر البرمجية وأهميتها.\n2. **التطبيق العملي**: تنفيذ التمارين البرمجية وتجربة الأوامر.\n3. **أفضل الممارسات**: مراجعة النقاط الإرشادية وتثبيت المعرفة.`,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setActiveTab('tutor');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveCurrentNote = () => {
    if (!currentNoteText.trim()) return;
    saveNote(course.id, activeLesson.id, activeLesson.title, 0, currentNoteText);
    setCurrentNoteText('');
    const allNotes = JSON.parse(localStorage.getItem('taallam_notes') || '[]');
    const filtered = allNotes.filter((n: any) => n.courseId === course.id && n.lessonId === activeLesson?.id);
    setSavedNotes(filtered);
  };

  const handleDeleteCurrentNote = (noteId: string) => {
    deleteNote(noteId);
    setSavedNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleCompleteAndNext = () => {
    markLessonCompleted(activeLesson.id, course.id);
    
    // Find next lesson
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      setActiveLesson(allLessons[currentIndex + 1]);
    }
  };

  const handleQuizSubmit = (quiz: Quiz) => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);

    if (percentage >= quiz.passingScore) {
      recordQuizPassed(quiz.id, 100);
    }
  };

  const runCodeInPlayground = () => {
    try {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
        error: (...args: any[]) => logs.push('❌ Error: ' + args.join(' ')),
        warn: (...args: any[]) => logs.push('⚠️ Warn: ' + args.join(' ')),
      };

      const runFn = new Function('console', codeEditorText);
      runFn(customConsole);
      setCodeOutput(logs.length > 0 ? logs.join('\n') : 'تم تنفيذ الكود بنجاح (لا توجد مخرجات console).');
    } catch (err: any) {
      setCodeOutput(`❌ خطأ أثناء التشغيل:\n${err.message}`);
    }
  };

  const courseProgress = getCourseProgress(course.id);
  const isAllCompleted = courseProgress.percentage === 100;
  const existingCert = user?.certificates.find(c => c.courseId === course.id);

  const lessonDiscussions = discussions.filter(d => d.courseId === course.id && d.lessonId === activeLesson.id);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
            title="العودة للدورات"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {course.categoryNameAr} • {course.level}
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Progress & Certificate & Exam Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
              إنجاز الدورة: {courseProgress.percentage}%
            </div>
            <div className="w-28 sm:w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${courseProgress.percentage}%` }}
              />
            </div>
          </div>

          {course.finalExam && (
            <button
              onClick={() => setIsFinalExamOpen(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>الاختبار النهائي للدورة</span>
            </button>
          )}

          {isAllCompleted && (
            <button
              onClick={() => {
                const cert = existingCert || claimCertificate(course);
                onViewCertificate(cert);
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 animate-bounce"
            >
              <Award className="w-4 h-4" />
              <span>{existingCert ? 'عرض الشهادة المعتمدة' : 'استلام الشهادة 🎓'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Video Player + Interactive Panel (Right/Left) + Curriculum Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Center 2 Cols: Video Player & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-800">
            {activeLesson?.videoUrl ? (
              activeLesson.videoType === 'mp4' || activeLesson.videoUrl.endsWith('.mp4') || activeLesson.videoUrl.startsWith('blob:') ? (
                <video
                  src={activeLesson.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                >
                  متصفحك لا يدعم تشغيل الفيديو المباشر.
                </video>
              ) : (
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <PlayCircle className="w-16 h-16 text-emerald-500 mb-2 animate-pulse" />
                <p className="font-bold text-white">الدرس التعليمي جاهز للعرض</p>
              </div>
            )}
          </div>

          {/* Lesson Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                الدرس الحالي
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeLesson?.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSummarizeWithAi}
                className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>لخّص بالذكاء الاصطناعي</span>
              </button>

              <button
                onClick={handleCompleteAndNext}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  user?.completedLessonIds.includes(activeLesson?.id)
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {user?.completedLessonIds.includes(activeLesson?.id) ? 'تم إكمال الدرس' : 'إكمال والتالي'}
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Lesson Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
              <button
                onClick={() => setActiveTab('tutor')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'tutor'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>المساعد الذكي (Gemini AI)</span>
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>الشرح والملاحظات</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'quiz'
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>اختبار تفاعلي {activeLesson?.quiz ? `(${activeLesson.quiz.questions.length})` : ''}</span>
              </button>

              {activeLesson?.codeSnippet && (
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'code'
                      ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Code className="w-4 h-4 text-teal-500" />
                  <span>محرر الكود الحي</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'discussion'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>نقاشات الدرس ({lessonDiscussions.length})</span>
              </button>

              {activeLesson?.resources && activeLesson.resources.length > 0 && (
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'resources'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Download className="w-4 h-4 text-blue-500" />
                  <span>المصادر ({activeLesson.resources.length})</span>
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="p-5">
              
              {/* 1. Gemini AI Tutor Tab */}
              {activeTab === 'tutor' && (
                <div className="space-y-4">
                  {/* Quick Prompts */}
                  <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500">أسئلة مقترحة:</span>
                    <button
                      onClick={() => handleSendMessage('اشرح لي الفكرة الرئيسية في هذا الدرس بمثال عملي بسيط')}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      💡 اشرح لي بمثال عملي
                    </button>
                    <button
                      onClick={() => handleSendMessage('ما هي أكثر الأخطاء الشائعة التي يقع فيها المبتدئون في هذا الدرس؟')}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      ⚠️ تجنب الأخطاء الشائعة
                    </button>
                    <button
                      onClick={() => handleSendMessage('أعطني تمرين عملي أو تحدي برمجي أطبقه الآن')}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      🎯 تحدي تدريبي فوري
                    </button>
                  </div>

                  {/* Messages Feed */}
                  <div className="h-80 overflow-y-auto space-y-3 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          msg.role === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user'
                              ? 'bg-emerald-600 text-white rounded-br-none'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-sm rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 px-1 mt-1 font-mono">
                          {msg.time}
                        </span>
                      </div>
                    ))}

                    {isAiLoading && (
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 p-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>جاري صياغة الإجابة التعليمية بالذكاء الاصطناعي...</span>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Chat Input */}
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="اسأل المعلم الذكي أي سؤال بخصوص هذا الدرس..."
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={isAiLoading || !inputMessage.trim()}
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-colors"
                      title="إرسال"
                    >
                      <Send className="w-4 h-4 transform -rotate-90" />
                    </button>
                  </form>
                </div>
              )}

              {/* 2. Overview & Notes Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Lesson Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      وصف الدرس وأهدافه:
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      {activeLesson?.description}
                    </p>
                  </div>

                  {/* Interactive Note Taking */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-emerald-500" />
                      <span>تدوين الملاحظات الخاصة بك</span>
                    </h3>

                    <div className="flex gap-2">
                      <textarea
                        rows={2}
                        placeholder="اكتب ملاحظة أو فكرة مهمة ترغب في تذكرها لاحقاً..."
                        value={currentNoteText}
                        onChange={e => setCurrentNoteText(e.target.value)}
                        className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white resize-none"
                      />
                      <button
                        onClick={handleSaveCurrentNote}
                        disabled={!currentNoteText.trim()}
                        className="px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center"
                      >
                        حفظ
                      </button>
                    </div>

                    {/* Saved Notes List */}
                    {savedNotes.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <div className="text-xs font-bold text-slate-500">
                          ملاحظاتك السابقة على هذا الدرس ({savedNotes.length}):
                        </div>
                        {savedNotes.map((note: any) => (
                          <div
                            key={note.id}
                            className="flex items-start justify-between p-3 bg-amber-50/50 dark:bg-slate-900 rounded-xl border border-amber-200/50 dark:border-slate-700 text-xs"
                          >
                            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                              {note.content}
                            </p>
                            <button
                              onClick={() => handleDeleteCurrentNote(note.id)}
                              className="text-slate-400 hover:text-rose-500 mr-2 p-1"
                              title="حذف الملاحظة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Quiz Tab */}
              {activeTab === 'quiz' && (
                <div>
                  {activeLesson?.quiz ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {activeLesson.quiz.title}
                          </h3>
                          <span className="text-xs text-slate-500">
                            درجة النجاح: {activeLesson.quiz.passingScore}%
                          </span>
                        </div>
                        {quizSubmitted && (
                          <div className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            quizScore >= activeLesson.quiz.passingScore
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            درجتك: {quizScore}% {quizScore >= activeLesson.quiz.passingScore ? '🎉 ناجح' : 'حاول ثانية'}
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        {activeLesson.quiz.questions.map((q, qIndex) => {
                          const userAnswer = selectedAnswers[q.id];
                          const isCorrect = userAnswer === q.correctIndex;

                          return (
                            <div
                              key={q.id}
                              className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
                            >
                              <div className="font-bold text-xs md:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs flex items-center justify-center shrink-0">
                                  {qIndex + 1}
                                </span>
                                <span>{q.question}</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options.map((opt, optIndex) => {
                                  const isSelected = userAnswer === optIndex;
                                  let optionStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';

                                  if (quizSubmitted) {
                                    if (optIndex === q.correctIndex) {
                                      optionStyle = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                                    } else if (isSelected && !isCorrect) {
                                      optionStyle = 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-700 dark:text-rose-300';
                                    }
                                  } else if (isSelected) {
                                    optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                                  }

                                  return (
                                    <button
                                      key={optIndex}
                                      disabled={quizSubmitted}
                                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: optIndex }))}
                                      className={`p-3 rounded-xl border text-xs text-right transition-all flex items-center justify-between ${optionStyle}`}
                                    >
                                      <span>{opt}</span>
                                      {isSelected && <Check className="w-4 h-4 shrink-0 text-emerald-500" />}
                                    </button>
                                  );
                                })}
                              </div>

                              {quizSubmitted && (
                                <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                                  💡 <span className="font-bold">التفسير:</span> {q.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        {!quizSubmitted ? (
                          <button
                            onClick={() => handleQuizSubmit(activeLesson.quiz!)}
                            disabled={Object.keys(selectedAnswers).length < activeLesson.quiz.questions.length}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                          >
                            تصحيح الإجابات وحساب النتيجة
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedAnswers({});
                              setQuizSubmitted(false);
                            }}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>إعادة الاختبار</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-bold">لا يوجد اختبار مسجل لهذا الدرس حالياً.</p>
                      <button
                        onClick={() => handleSendMessage('أنشئ لي اختباراً قصيراً لتقييم فهمي لهذا الدرس')}
                        className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                      >
                        توليد اختبار تلقائي عبر Gemini AI ✨
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Live Code Playground Tab */}
              {activeTab === 'code' && activeLesson?.codeSnippet && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        محرر الكود التفاعلي ({activeLesson.codeSnippet.language})
                      </h3>
                      <p className="text-xs text-slate-500">{activeLesson.codeSnippet.explanation}</p>
                    </div>
                    <button
                      onClick={runCodeInPlayground}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>تشغيل الكود الآن</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">
                        محرر الأكواد:
                      </label>
                      <textarea
                        rows={10}
                        value={codeEditorText}
                        onChange={e => setCodeEditorText(e.target.value)}
                        className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">
                        نافذة المخرجات (Console Output):
                      </label>
                      <div
                        className="w-full h-[200px] p-3 font-mono text-xs bg-slate-950 text-slate-200 rounded-xl border border-slate-800 overflow-y-auto whitespace-pre-wrap"
                        dir="ltr"
                      >
                        {codeOutput || 'انقر على "تشغيل الكود الآن" لرؤية النتيجة هنا...'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Discussions Tab */}
              {activeTab === 'discussion' && (
                <div className="space-y-6">
                  {/* Ask Question Form */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      طرح سؤال جديد في هذا الدرس:
                    </h4>
                    <input
                      type="text"
                      placeholder="عنوان السؤال بإيجاز..."
                      value={newQuestionTitle}
                      onChange={e => setNewQuestionTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <textarea
                      rows={2}
                      placeholder="تفاصيل السؤال أو الاستفسار..."
                      value={newQuestionContent}
                      onChange={e => setNewQuestionContent(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                    <button
                      onClick={() => {
                        if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;
                        addDiscussion(course.id, activeLesson.id, newQuestionTitle, newQuestionContent, 'general');
                        setNewQuestionTitle('');
                        setNewQuestionContent('');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      نشر السؤال في المجتمع
                    </button>
                  </div>

                  {/* Discussions List */}
                  <div className="space-y-4">
                    {lessonDiscussions.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        لا توجد أسئلة بعد لهذا الدرس. كن أول من يسأل!
                      </div>
                    ) : (
                      lessonDiscussions.map(disc => (
                        <div
                          key={disc.id}
                          className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={disc.userAvatar}
                                alt={disc.userName}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {disc.userName}
                                </span>
                                <span className="text-[10px] text-slate-400 mr-2">
                                  {disc.date}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => upvoteDiscussion(disc.id)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors"
                            >
                              <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{disc.upvotes}</span>
                            </button>
                          </div>

                          <div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                              {disc.title}
                            </h5>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                              {disc.content}
                            </p>
                          </div>

                          {/* Replies */}
                          {disc.replies.length > 0 && (
                            <div className="space-y-2 pr-4 border-r-2 border-slate-100 dark:border-slate-700">
                              {disc.replies.map(rep => (
                                <div
                                  key={rep.id}
                                  className={`p-3 rounded-xl text-xs ${
                                    rep.isInstructor
                                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-900'
                                      : 'bg-slate-50 dark:bg-slate-900'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 font-bold mb-1">
                                    <span className={rep.isInstructor ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}>
                                      {rep.userName}
                                    </span>
                                    {rep.isInstructor && (
                                      <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                                        معلّم الدورة
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-700 dark:text-slate-300">{rep.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input */}
                          <div className="flex gap-2 pt-2">
                            <input
                              type="text"
                              placeholder="أضف رداً على هذا الاستفسار..."
                              value={replyTextMap[disc.id] || ''}
                              onChange={e => setReplyTextMap({ ...replyTextMap, [disc.id]: e.target.value })}
                              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                              onClick={() => {
                                const text = replyTextMap[disc.id];
                                if (!text?.trim()) return;
                                addReply(disc.id, text);
                                setReplyTextMap({ ...replyTextMap, [disc.id]: '' });
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow"
                            >
                              رد
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 6. Resources Tab */}
              {activeTab === 'resources' && activeLesson?.resources && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      الملفات والمصادر المرفقة بهذا الدرس ({activeLesson.resources.length}):
                    </h4>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      عرض مباشر تفاعلي وتنزيل
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.resources.map(res => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                            {res.type === 'pdf' ? <FileText className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {res.title}
                            </div>
                            {res.size && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                {res.size}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setPreviewResource(res)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                            title="عرض المستند مباشرة"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>عرض مباشر</span>
                          </button>

                          <a
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            download={res.title}
                            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="تحميل الملف"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right 1 Col: Curriculum Playlist Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                محتوى الدورة والدروس
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {courseProgress.completedCount} / {courseProgress.totalCount} مكتمل
              </span>
            </h3>

            {/* Sections List */}
            <div className="space-y-4 mt-4 max-h-[600px] overflow-y-auto">
              {course.sections.map((section, sIdx) => (
                <div key={section.id} className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1 flex items-center justify-between">
                    <span>{section.title}</span>
                    <span>{section.lessons.length} دروس</span>
                  </div>

                  <div className="space-y-1">
                    {section.lessons.map(lesson => {
                      const isActive = activeLesson?.id === lesson.id;
                      const isCompleted = user?.completedLessonIds.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl text-right text-xs transition-all ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700'
                              : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                            )}
                            <span className="line-clamp-1">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.durationMinutes} د</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Final Exam Box in Playlist */}
              {course.finalExam && (
                <div className="p-3.5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl space-y-2 border border-indigo-700/50 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-indigo-300">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      الاختبار النهائي الشامل
                    </span>
                    <span className="text-[10px] bg-indigo-500/30 px-2 py-0.5 rounded text-indigo-200">
                      {course.finalExam.questions.length} سؤال
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    اجتياز الاختبار بدرجة {course.finalExam.passingScore}% يمنحك الشهادة الرقمية المعتمدة فوراً.
                  </p>
                  <button
                    onClick={() => setIsFinalExamOpen(true)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>بدء الاختبار النهائي ⏱️</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Instructor Bio Card */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-400">عن مدرب الدورة</span>
            <div className="flex items-center gap-3">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/50"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {course.instructor.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {course.instructor.title}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.instructor.bio}
            </p>
          </div>
        </div>

      </div>
      {/* Final Exam Modal */}
      {isFinalExamOpen && (
        <FinalExamModal
          course={course}
          onClose={() => setIsFinalExamOpen(false)}
          onViewCertificate={cert => {
            setIsFinalExamOpen(false);
            onViewCertificate(cert);
          }}
        />
      )}

      {/* Document & Video Viewer Modal */}
      <DocumentViewerModal
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
      />
    </div>
  );
};
