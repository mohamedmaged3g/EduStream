import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Discussion, ForumCategory, UserRole } from '../types';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  ThumbsUp, 
  Pin, 
  Lock, 
  CheckCircle2, 
  ShieldAlert, 
  Trash2, 
  Filter, 
  Tag, 
  Code2, 
  Send, 
  Sparkles, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  Flag,
  UserCheck,
  BookOpen,
  Award,
  Flame
} from 'lucide-react';

const CATEGORIES: { id: ForumCategory | 'all'; label: string; icon: string; desc: string; color: string }[] = [
  { id: 'all', label: 'جميع النقاشات', icon: '🌐', desc: 'كل المواضيع والتساؤلات', color: 'slate' },
  { id: 'legacy-lang', label: 'لغات البرمجة القديمة والعتيدة', icon: '📜', desc: 'COBOL, Assembly, Fortran, C, Pascal', color: 'amber' },
  { id: 'modern-lang', label: 'لغات البرمجة والتقنيات الحديثة', icon: '⚡', desc: 'Rust, TypeScript, Python, Go, Cloud', color: 'emerald' },
  { id: 'ai-gen', label: 'الذكاء الاصطناعي وهندسة الأوامر', icon: '🤖', desc: 'Gemini 3, LLMs, Agents, Vector Search', color: 'indigo' },
  { id: 'questions', label: 'أسئلة واستفسارات برمجية', icon: '💬', desc: 'تصحيح الأخطاء واستشارات تقنية', color: 'blue' },
  { id: 'projects', label: 'مشاريع وتجارب الطلاب', icon: '💡', desc: 'مشاركة الأكواد والأفكار المتميزة', color: 'purple' },
  { id: 'announcements', label: 'إعلانات وإرشادات المشرفين', icon: '📢', desc: 'تحديثات المنصة والتوجيهات', color: 'rose' },
];

export const ForumView: React.FC = () => {
  const { 
    user, 
    discussions, 
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
    openAuthModal,
    isAuthenticated 
  } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'solved' | 'unsolved' | 'reported'>('all');
  
  // Expanded discussion state
  const [expandedDiscussionId, setExpandedDiscussionId] = useState<string | null>(null);
  const [replyInputMap, setReplyInputMap] = useState<{ [id: string]: string }>({});
  const [replyCodeMap, setReplyCodeMap] = useState<{ [id: string]: string }>({});
  const [showCodeInputMap, setShowCodeInputMap] = useState<{ [id: string]: boolean }>({});

  // New topic modal state
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumCategory>('legacy-lang');
  const [newContent, setNewContent] = useState('');
  const [newCodeSnippet, setNewCodeSnippet] = useState('');
  const [newCodeLanguage, setNewCodeLanguage] = useState('cobol');
  const [newTags, setNewTags] = useState('');
  const [showNewCodeField, setShowNewCodeField] = useState(false);

  // Reporting modal state
  const [reportingDiscussionId, setReportingDiscussionId] = useState<string | null>(null);
  const [reportReasonText, setReportReasonText] = useState('');

  const isInstructorOrAdmin = user?.role === 'instructor' || user?.role === 'admin';

  // Filter discussions
  const filteredDiscussions = discussions.filter(disc => {
    // Category match
    if (selectedCategory !== 'all' && disc.category !== selectedCategory) {
      return false;
    }

    // Filter type match
    if (filterType === 'solved' && !disc.acceptedReplyId) return false;
    if (filterType === 'unsolved' && disc.acceptedReplyId) return false;
    if (filterType === 'reported' && !disc.isReported) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = disc.title.toLowerCase().includes(q);
      const matchContent = disc.content.toLowerCase().includes(q);
      const matchTags = disc.tags?.some(t => t.toLowerCase().includes(q));
      const matchUser = disc.userName.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchTags && !matchUser) return false;
    }

    return true;
  }).sort((a, b) => {
    // Pinned always on top
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const catObj = CATEGORIES.find(c => c.id === newCategory);
    const catName = catObj ? catObj.label : 'نقاش عام';

    const tagsArray = newTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const codeObj = showNewCodeField && newCodeSnippet.trim() ? {
      language: newCodeLanguage,
      code: newCodeSnippet.trim()
    } : undefined;

    addDiscussion(
      newCategory,
      catName,
      newTitle.trim(),
      newContent.trim(),
      tagsArray,
      codeObj
    );

    // Reset & close
    setNewTitle('');
    setNewContent('');
    setNewCodeSnippet('');
    setNewTags('');
    setShowNewCodeField(false);
    setIsNewTopicModalOpen(false);
  };

  const handleSendReply = (discussionId: string) => {
    const text = replyInputMap[discussionId] || '';
    const code = replyCodeMap[discussionId] || '';
    if (!text.trim() && !code.trim()) return;

    addReply(discussionId, text.trim(), code.trim() ? code.trim() : undefined);
    
    // Clear inputs
    setReplyInputMap(prev => ({ ...prev, [discussionId]: '' }));
    setReplyCodeMap(prev => ({ ...prev, [discussionId]: '' }));
    setShowCodeInputMap(prev => ({ ...prev, [discussionId]: false }));
  };

  const handleConfirmReport = () => {
    if (!reportingDiscussionId || !reportReasonText.trim()) return;
    reportDiscussion(reportingDiscussionId, reportReasonText.trim());
    setReportingDiscussionId(null);
    setReportReasonText('');
  };

  const reportedCount = discussions.filter(d => d.isReported).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Forum Hero & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مجتمع منصة تَعَلَّمْ المتخصص للغات البرمجة والتقنية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              منتديات النقاش البرمجي وتبادل الخبرات
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              مكانك المفتوح لمناقشة لغات البرمجة العتيدة مثل COBOL و Assembly و Fortran ولغات المستقبل الحديثة مثل Rust و Python و AI Agents مع نخبة من المعلمين والخبراء.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                if (!isAuthenticated) openAuthModal();
                else setIsNewTopicModalOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>طرح موضوع أو سؤال جديد</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-emerald-400 font-bold">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-white text-sm">{discussions.length}</div>
              <div className="text-slate-400 text-[11px]">موضوع ونقاش فعال</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-amber-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-white text-sm">
                {discussions.filter(d => d.acceptedReplyId).length}
              </div>
              <div className="text-slate-400 text-[11px]">حل نموذجي معتمد</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-indigo-400 font-bold">
              <UserCheck className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-white text-sm">إشراف أكاديمي حي</div>
              <div className="text-slate-400 text-[11px]">معلمون معتمدون 24/7</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-rose-400 font-bold">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-white text-sm">بيئة تعليمية منضبطة</div>
              <div className="text-slate-400 text-[11px]">إشراف ومراقبة مستمرة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all' 
            ? discussions.length 
            : discussions.filter(d => d.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="ابحث في عناوين المواضيع، الأكواد، أو أسماء المبرمجين..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterType === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            الكل ({discussions.length})
          </button>

          <button
            onClick={() => setFilterType('solved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              filterType === 'solved'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>تم الحل</span>
          </button>

          <button
            onClick={() => setFilterType('unsolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterType === 'unsolved'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            بانتظار إجابة
          </button>

          {/* Moderation Queue filter (Visible to Teachers/Admins) */}
          {isInstructorOrAdmin && (
            <button
              onClick={() => setFilterType('reported')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                filterType === 'reported'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>بلاغات الإشراف ({reportedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Moderation Notice if Admin/Instructor */}
      {isInstructorOrAdmin && (
        <div className="flex items-center justify-between p-3.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>
              <strong>وضع الإشراف الأكاديمي نشط:</strong> لديك صلاحية تثبيت المواضيع (Pin)، قفل الردود (Lock)، حذف المنشورات المخالفة، واعتماد الإجابات النموذجية.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px]">
            {user?.role === 'admin' ? 'مدير المنصة' : 'معلّم ومشرف'}
          </span>
        </div>
      )}

      {/* Discussions Feed List */}
      <div className="space-y-4">
        {filteredDiscussions.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              لا توجد مواضيع مطابقة لخيارات البحث
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              كن أول من يبدأ النقاش ويطرح موضوعاً جديداً في هذا القسم!
            </p>
            <button
              onClick={() => setIsNewTopicModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow"
            >
              طرح موضوع جديد الآن
            </button>
          </div>
        ) : (
          filteredDiscussions.map(disc => {
            const isExpanded = expandedDiscussionId === disc.id;
            const hasAcceptedSol = !!disc.acceptedReplyId;

            return (
              <div
                key={disc.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  disc.isPinned
                    ? 'border-emerald-500/60 dark:border-emerald-500/50 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent'
                    : disc.isReported
                      ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {/* Reported Bar (if flagged) */}
                {disc.isReported && (
                  <div className="px-4 py-2 bg-rose-600 text-white text-xs font-bold flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>بلاغ إشرافي: {disc.reportReason || 'تم الإبلاغ عن محتوى غير لائق'}</span>
                    </div>
                    {isInstructorOrAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => dismissReport(disc.id)}
                          className="px-2 py-0.5 bg-white text-rose-700 rounded-lg text-[10px] font-bold"
                        >
                          تجاهل وتبرئة
                        </button>
                        <button
                          onClick={() => deleteDiscussion(disc.id)}
                          className="px-2 py-0.5 bg-rose-950 text-white rounded-lg text-[10px] font-bold"
                        >
                          حذف المنشور
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Header & Summary */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    
                    {/* Author & Meta */}
                    <div className="flex items-center gap-3">
                      <img
                        src={disc.userAvatar}
                        alt={disc.userName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {disc.userName}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            disc.userRole === 'admin'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : disc.userRole === 'instructor'
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {disc.userRole === 'admin' ? 'مدير' : disc.userRole === 'instructor' ? 'معلّم' : 'طالب'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{disc.date}</span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {disc.categoryNameAr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badges & Controls */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {disc.isPinned && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          <Pin className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                          <span>مثبت</span>
                        </span>
                      )}

                      {disc.isLocked && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                          <Lock className="w-3 h-3" />
                          <span>مغلق</span>
                        </span>
                      )}

                      {hasAcceptedSol && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>حل معتمد</span>
                        </span>
                      )}

                      {/* Instructor/Admin Moderation Actions */}
                      {isInstructorOrAdmin && (
                        <div className="flex items-center gap-1 mr-2 border-r border-slate-200 dark:border-slate-700 pr-2">
                          <button
                            onClick={() => pinDiscussion(disc.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                            title={disc.isPinned ? 'إلغاء التثبيت' : 'تثبيت في الأعلى'}
                          >
                            <Pin className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => lockDiscussion(disc.id)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                            title={disc.isLocked ? 'فتح الموضوع' : 'إغلاق الموضوع'}
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteDiscussion(disc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="حذف الموضوع"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div className="mt-3">
                    <h3 
                      onClick={() => setExpandedDiscussionId(isExpanded ? null : disc.id)}
                      className="text-base sm:text-lg font-bold text-slate-900 dark:text-white cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {disc.title}
                    </h3>
                    <p className={`text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed ${
                      isExpanded ? '' : 'line-clamp-2'
                    }`}>
                      {disc.content}
                    </p>

                    {/* Code Snippet in main post */}
                    {disc.codeSnippet && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs text-emerald-400">
                        <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                          <span>لغة الكود: {disc.codeSnippet.language}</span>
                          <Code2 className="w-3.5 h-3.5" />
                        </div>
                        <pre className="p-3 overflow-x-auto whitespace-pre leading-relaxed" dir="ltr">
                          {disc.codeSnippet.code}
                        </pre>
                      </div>
                    )}

                    {/* Tags */}
                    {disc.tags && disc.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        {disc.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Bottom Bar: Upvote, Replies Count, Expand Button, Report */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => upvoteDiscussion(disc.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-200 font-bold transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{disc.upvotes} تأييد</span>
                      </button>

                      <button
                        onClick={() => setExpandedDiscussionId(isExpanded ? null : disc.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{disc.replies.length} ردود</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Report button for students */}
                      {!disc.isReported && (
                        <button
                          onClick={() => setReportingDiscussionId(disc.id)}
                          className="text-slate-400 hover:text-rose-500 text-[11px] flex items-center gap-1 p-1 rounded transition-colors"
                          title="الإبلاغ عن محتوى غير لائق"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">إبلاغ</span>
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedDiscussionId(isExpanded ? null : disc.id)}
                        className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 hover:underline"
                      >
                        <span>{isExpanded ? 'إخفاء الردود' : 'عرض النقاش والردود'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Thread: Replies & Reply Box */}
                {isExpanded && (
                  <div className="bg-slate-50/80 dark:bg-slate-900/60 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      <span>الردود والمشاركات ({disc.replies.length}):</span>
                    </h4>

                    {/* Replies Feed */}
                    {disc.replies.length === 0 ? (
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl text-center text-xs text-slate-400 border border-slate-200 dark:border-slate-700">
                        لا توجد ردود بعد. شارك برأيك أو حلك البرمجي!
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {disc.replies.map(rep => {
                          const isAccepted = rep.isAcceptedSolution || disc.acceptedReplyId === rep.id;

                          return (
                            <div
                              key={rep.id}
                              className={`p-4 rounded-2xl border transition-all ${
                                isAccepted
                                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                                  : rep.isInstructor
                                    ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={rep.userAvatar}
                                    alt={rep.userName}
                                    className="w-7 h-7 rounded-full object-cover"
                                  />
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {rep.userName}
                                  </span>
                                  {rep.isInstructor && (
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold">
                                      معلّم معتمد
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-400">
                                    {rep.date}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isAccepted && (
                                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      <span>حل نموذجي معتمد</span>
                                    </span>
                                  )}

                                  {/* Instructor action to mark solution */}
                                  {isInstructorOrAdmin && (
                                    <button
                                      onClick={() => markAcceptedSolution(disc.id, rep.id)}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                        isAccepted
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-100'
                                      }`}
                                      title="اعتماد كحل نموذجي"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>{isAccepted ? 'إلغاء الاعتماد' : 'اعتماد كحل'}</span>
                                    </button>
                                  )}

                                  {/* Upvote Reply */}
                                  <button
                                    onClick={() => upvoteReply(disc.id, rep.id)}
                                    className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
                                  >
                                    <ThumbsUp className="w-3 h-3 text-emerald-500" />
                                    <span>{rep.upvotes || 0}</span>
                                  </button>
                                </div>
                              </div>

                              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                                {rep.content}
                              </p>

                              {/* Code in reply */}
                              {rep.codeSnippet && (
                                <div className="mt-2.5 p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed" dir="ltr">
                                  {rep.codeSnippet}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Reply Input Box */}
                    {disc.isLocked ? (
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>هذا الموضوع مغلق من قِبل المشرفين ولا يقبل ردوداً جديدة حالياً.</span>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                        <textarea
                          rows={2}
                          placeholder="اكتب ردك أو إجابتك التوضيحية هنا..."
                          value={replyInputMap[disc.id] || ''}
                          onChange={e => setReplyInputMap(prev => ({ ...prev, [disc.id]: e.target.value }))}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white resize-none"
                        />

                        {showCodeInputMap[disc.id] && (
                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-500">
                              إرفاق شفرة برمجية في الرد:
                            </label>
                            <textarea
                              rows={4}
                              placeholder="// الصق كود الحل هنا..."
                              value={replyCodeMap[disc.id] || ''}
                              onChange={e => setReplyCodeMap(prev => ({ ...prev, [disc.id]: e.target.value }))}
                              className="w-full p-2.5 font-mono text-xs bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              dir="ltr"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowCodeInputMap(prev => ({ ...prev, [disc.id]: !prev[disc.id] }))}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 rounded-xl text-xs font-bold transition-colors"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>{showCodeInputMap[disc.id] ? 'إلغاء الكود' : 'إرفاق شفرة كود'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (!isAuthenticated) openAuthModal();
                              else handleSendReply(disc.id);
                            }}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow transition-all flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5 transform -rotate-90" />
                            <span>نشر الرد</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create New Discussion Topic */}
      {isNewTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  طرح موضوع أو استفسار جديد
                </h3>
              </div>
              <button
                onClick={() => setIsNewTopicModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  القسم والتخصص البرمجي:
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as ForumCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="legacy-lang">📜 لغات البرمجة القديمة والعتيدة (COBOL, Fortran, Assembly, C)</option>
                  <option value="modern-lang">⚡ لغات البرمجة والتقنيات الحديثة (Rust, TypeScript, Python, Go)</option>
                  <option value="ai-gen">🤖 الذكاء الاصطناعي وهندسة الأوامر (Gemini 3, LLMs, Agents)</option>
                  <option value="questions">💬 أسئلة واستفسارات برمجية عامة</option>
                  <option value="projects">💡 مشاريع وتجارب الطلاب البرمجية</option>
                  {isInstructorOrAdmin && (
                    <option value="announcements">📢 إعلانات وتوجيهات المشرفين</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان الموضوع:
                </label>
                <input
                  type="text"
                  placeholder="مثال: كيف يتم التعامل مع سجلات Indexed Files في لغة COBOL؟"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نص الموضوع والشرح:
                </label>
                <textarea
                  rows={4}
                  placeholder="اشرح تساؤلك أو الفكرة البرمجية بالتفصيل ليتسنى للمعلمين والطلاب مساعدتك..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    هل ترغب بإرفاق كود برمجي توضيحي؟
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewCodeField(!showNewCodeField)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    {showNewCodeField ? 'إلغاء إرفاق الكود' : '+ إضافة كود'}
                  </button>
                </div>

                {showNewCodeField && (
                  <div className="space-y-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">لغة الشفرة البرمجية:</span>
                      <select
                        value={newCodeLanguage}
                        onChange={e => setNewCodeLanguage(e.target.value)}
                        className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                      >
                        <option value="cobol">COBOL</option>
                        <option value="assembly">Assembly x86</option>
                        <option value="rust">Rust</option>
                        <option value="fortran">FORTRAN</option>
                        <option value="c">C / C++</option>
                        <option value="typescript">TypeScript / JS</option>
                        <option value="python">Python</option>
                        <option value="sql">SQL</option>
                      </select>
                    </div>
                    <textarea
                      rows={5}
                      placeholder="// اكتب أو الصق الكود هنا..."
                      value={newCodeSnippet}
                      onChange={e => setNewCodeSnippet(e.target.value)}
                      className="w-full p-2.5 font-mono text-xs bg-slate-950 text-emerald-400 rounded-lg border border-slate-800 focus:outline-none"
                      dir="ltr"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الوسوم والكلمات الدلالية (مفصولة بفواصل):
                </label>
                <input
                  type="text"
                  placeholder="مثال: COBOL, Mainframe, Data Division, Banking"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTopicModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newContent.trim()}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg"
                >
                  نشر الموضوع في المجتمع 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Report Post */}
      {reportingDiscussionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold">إبلاغ عن محتوى للمشرفين</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              نلتزم ببيئة تعليمية إيجابية ومحترمة. يُرجى توضيح سبب الإبلاغ لمراجعته فوراً من قِبل إدارة الأكاديمية:
            </p>
            <textarea
              rows={3}
              placeholder="مثال: لغة غير لائقة، ترويج إعلاني، محتوى مضلل..."
              value={reportReasonText}
              onChange={e => setReportReasonText(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setReportingDiscussionId(null);
                  setReportReasonText('');
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmReport}
                disabled={!reportReasonText.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow"
              >
                إرسال البلاغ للإشراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
