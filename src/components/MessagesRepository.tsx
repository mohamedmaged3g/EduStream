import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  StudentMessage, 
  MessageRecipientType, 
  Resource,
  UserRole
} from '../types';
import { 
  Mail, 
  Inbox, 
  Send, 
  Radio, 
  FileText, 
  Video, 
  Paperclip, 
  Search, 
  PlusCircle, 
  CheckCheck, 
  Sparkles, 
  Trash2, 
  ChevronLeft, 
  ArrowRight, 
  Users, 
  BookOpen, 
  Eye, 
  Download, 
  Clock, 
  AlertCircle,
  X,
  UploadCloud,
  MessageSquare
} from 'lucide-react';
import { DocumentViewerModal } from './DocumentViewerModal';

interface MessagesRepositoryProps {
  onBackToCatalog?: () => void;
  initialCourseFilterId?: string;
}

export const MessagesRepository: React.FC<MessagesRepositoryProps> = ({
  onBackToCatalog,
  initialCourseFilterId,
}) => {
  const { 
    user, 
    messages, 
    courses, 
    sendMessage, 
    replyToMessage, 
    markMessageAsRead, 
    deleteMessage 
  } = useAuth();

  const [activeFolder, setActiveFolder] = useState<'inbox' | 'direct' | 'broadcast' | 'sent'>('inbox');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(messages[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>(initialCourseFilterId || 'all');
  
  // Compose modal state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [recipientType, setRecipientType] = useState<MessageRecipientType>('individual');
  const [recipientStudentName, setRecipientStudentName] = useState('محمد ماجد');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [attachments, setAttachments] = useState<Resource[]>([]);
  const [newAttachmentTitle, setNewAttachmentTitle] = useState('');
  const [newAttachmentType, setNewAttachmentType] = useState<'pdf' | 'video'>('pdf');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [showAddAttachment, setShowAddAttachment] = useState(false);

  // Reply state
  const [replyText, setReplyText] = useState('');

  // Active document for modal
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  const isInstructorOrAdmin = user?.role === 'instructor' || user?.role === 'admin';

  // Filter messages
  const filteredMessages = messages.filter(m => {
    // Role & recipient matching
    const isSentByMe = m.senderId === user?.id;
    const isForMe = 
      m.recipientType === 'all_students' ||
      (m.recipientType === 'individual' && (m.recipientId === user?.id || isSentByMe)) ||
      (m.recipientType === 'course_broadcast' && (!m.courseId || user?.enrolledCourseIds.includes(m.courseId) || isSentByMe));

    if (!isForMe && !isSentByMe && !isInstructorOrAdmin) return false;

    // Folder matching
    if (activeFolder === 'sent') {
      if (!isSentByMe) return false;
    } else if (activeFolder === 'direct') {
      if (m.recipientType !== 'individual') return false;
    } else if (activeFolder === 'broadcast') {
      if (m.recipientType === 'individual') return false;
    }

    // Course filter
    if (courseFilter !== 'all' && m.courseId && m.courseId !== courseFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchContent = m.content.toLowerCase().includes(q);
      const matchSender = m.senderName.toLowerCase().includes(q);
      if (!matchSubject && !matchContent && !matchSender) return false;
    }

    return true;
  });

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || filteredMessages[0] || null;

  // Handle viewing a message
  const handleSelectMessage = (msg: StudentMessage) => {
    setSelectedMessageId(msg.id);
    if (!msg.isRead && msg.senderId !== user?.id) {
      markMessageAsRead(msg.id);
    }
  };

  // Handle sending a new message
  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeContent.trim()) return;

    const courseObj = courses.find(c => c.id === selectedCourseId);

    sendMessage({
      recipientType,
      recipientId: recipientType === 'individual' ? 'usr-google-1' : undefined,
      recipientName: recipientType === 'individual' ? recipientStudentName : undefined,
      courseId: recipientType === 'course_broadcast' ? selectedCourseId : undefined,
      courseTitle: recipientType === 'course_broadcast' ? courseObj?.title : undefined,
      subject: composeSubject,
      content: composeContent,
      attachments,
      isImportant
    });

    setIsComposeOpen(false);
    setComposeSubject('');
    setComposeContent('');
    setAttachments([]);
    setShowAddAttachment(false);
  };

  // Handle adding an attachment
  const handleAddAttachment = () => {
    if (!newAttachmentTitle.trim()) return;

    const newRes: Resource = {
      id: `att-${Date.now()}`,
      title: newAttachmentTitle.trim().endsWith('.pdf') || newAttachmentType !== 'pdf' ? newAttachmentTitle.trim() : `${newAttachmentTitle.trim()}.pdf`,
      type: newAttachmentType,
      size: newAttachmentType === 'pdf' ? '2.5 MB' : '15 دقيقة',
      url: newAttachmentUrl.trim() || (newAttachmentType === 'pdf' ? 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf' : 'https://www.youtube.com/embed/aircAruvnKk'),
      pageCount: newAttachmentType === 'pdf' ? 10 : undefined,
      description: 'مرفق تعليمي من المعلم'
    };

    setAttachments(prev => [...prev, newRes]);
    setNewAttachmentTitle('');
    setNewAttachmentUrl('');
    setShowAddAttachment(false);
  };

  // Handle uploading local file for attachment
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdfFile = file.name.endsWith('.pdf') || file.type.includes('pdf');
    const isVidFile = file.type.includes('video') || file.name.endsWith('.mp4');

    const fileUrl = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    const newRes: Resource = {
      id: `att-file-${Date.now()}`,
      title: file.name,
      type: isPdfFile ? 'pdf' : isVidFile ? 'video' : 'pdf',
      size: sizeMb,
      url: fileUrl,
      pageCount: isPdfFile ? 12 : undefined,
      description: 'ملف مرفق تم رفعه بواسطة المعلم'
    };

    setAttachments(prev => [...prev, newRes]);
  };

  // Handle reply submit
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    replyToMessage(selectedMessage.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-800/40 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Mail className="w-3.5 h-3.5" />
            <span>مستودع الرسائل والتواصل الأكاديمي</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">
            صندوق الرسائل والإعلانات التفاعلية
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            تواصل مباشر مع المعلمين، واستقبل ملفات الشرح PDF والفيديوهات والإعلانات الجماعية لكل دورة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBackToCatalog && (
            <button
              onClick={onBackToCatalog}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>العودة للدورات</span>
            </button>
          )}

          <button
            onClick={() => setIsComposeOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isInstructorOrAdmin ? 'إرسال رسالة أو إعلان جديد' : 'مراسلة المعلم'}</span>
          </button>
        </div>
      </div>

      {/* Main Mail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Folder Navigation (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 shadow-sm space-y-1">
            <button
              onClick={() => setActiveFolder('inbox')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFolder === 'inbox'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-emerald-600" />
                <span>صندوق الوارد (الكل)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px]">
                {messages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveFolder('direct')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFolder === 'direct'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>رسائل فردية مباشرة</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-[10px]">
                {messages.filter(m => m.recipientType === 'individual').length}
              </span>
            </button>

            <button
              onClick={() => setActiveFolder('broadcast')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFolder === 'broadcast'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-amber-600" />
                <span>إعلانات الدورات والتنبيهات</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-[10px]">
                {messages.filter(m => m.recipientType !== 'individual').length}
              </span>
            </button>

            <button
              onClick={() => setActiveFolder('sent')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFolder === 'sent'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-slate-500" />
                <span>الرسائل المرسلة</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-[10px]">
                {messages.filter(m => m.senderId === user?.id).length}
              </span>
            </button>
          </div>

          {/* Filter by Course */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              تصفية حسب الدورة:
            </label>
            <select
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            >
              <option value="all">جميع الدورات والمسارات</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Middle/Messages List (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col h-[700px]">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
            <div className="relative">
              <input
                type="text"
                placeholder="بحث في الرسائل والمرفقات..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* List Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Mail className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-bold">لا توجد رسائل مطابقة في هذا القسم</p>
              </div>
            ) : (
              filteredMessages.map(msg => {
                const isSelected = msg.id === selectedMessage?.id;
                const hasPdf = msg.attachments?.some(a => a.type === 'pdf');
                const hasVideo = msg.attachments?.some(a => a.type === 'video');

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-r-4 border-emerald-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <span className={`text-xs truncate ${!msg.isRead && msg.senderId !== user?.id ? 'font-black text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                          {msg.senderName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {msg.date}
                      </span>
                    </div>

                    <h4 className={`text-xs line-clamp-1 mb-1 ${!msg.isRead && msg.senderId !== user?.id ? 'font-black text-emerald-700 dark:text-emerald-300' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
                      {msg.subject}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {msg.content}
                    </p>

                    {/* Scope & Attachment Tags */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        msg.recipientType === 'individual'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {msg.recipientType === 'individual' ? 'رسالة خاصة' : 'إعلان دورة'}
                      </span>

                      {hasPdf && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-0.5">
                          <FileText className="w-2.5 h-2.5" />
                          <span>PDF</span>
                        </span>
                      )}

                      {hasVideo && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 flex items-center gap-0.5">
                          <Video className="w-2.5 h-2.5" />
                          <span>فيديو</span>
                        </span>
                      )}

                      {(msg.replies?.length || 0) > 0 && (
                        <span className="text-[9px] text-slate-400 flex items-center gap-0.5 mr-auto">
                          <MessageSquare className="w-2.5 h-2.5" />
                          <span>{msg.replies?.length}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right/Message Content & Thread (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col h-[700px]">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 shrink-0 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedMessage.senderAvatar}
                      alt={selectedMessage.senderName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {selectedMessage.senderName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          selectedMessage.senderRole === 'instructor'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {selectedMessage.senderRole === 'instructor' ? 'معلم الدورة' : 'طالب'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{selectedMessage.date}</span>
                        {selectedMessage.courseTitle && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[180px]">
                              {selectedMessage.courseTitle}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    title="حذف الرسالة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                  {selectedMessage.subject}
                </h2>
              </div>

              {/* Message Body & Attachments */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>

                {/* Attached Files & Direct Previews */}
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-emerald-500" />
                      <span>المرفقات وملفات الشرح المباشرة ({selectedMessage.attachments.length}):</span>
                    </h4>

                    <div className="grid grid-cols-1 gap-2.5">
                      {selectedMessage.attachments.map(att => {
                        const isAttPdf = att.type === 'pdf';
                        const isAttVid = att.type === 'video';

                        return (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isAttPdf 
                                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' 
                                  : isAttVid
                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                                    : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                              }`}>
                                {isAttPdf ? <FileText className="w-4 h-4" /> : isAttVid ? <Video className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {att.title}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {att.size || 'ملف رقمي'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => setPreviewResource(att)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>عرض مباشر</span>
                              </button>

                              <a
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={att.title}
                                className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                title="تحميل الملف"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Reply Thread List */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      الردود والمحادثة ({selectedMessage.replies.length}):
                    </h4>

                    {selectedMessage.replies.map(reply => (
                      <div
                        key={reply.id}
                        className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={reply.senderAvatar}
                              alt={reply.senderName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {reply.senderName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({reply.senderRole === 'instructor' ? 'معلم' : 'طالب'})
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{reply.date}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed pr-7">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Box at bottom */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="اكتب رداً على هذه الرسالة..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow transition-colors"
                  title="إرسال الرد"
                >
                  <Send className="w-4 h-4 transform -rotate-90" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <Mail className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                اختر رسالة من القائمة لعرض التفاصيل والمرفقات
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Message Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span>{isInstructorOrAdmin ? 'إنشاء رسالة / إعلان جديد' : 'مراسلة المعلم'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  حدد المستهدفين والمحتوى، وأرفق ملفات PDF وفيديوهات الشرح
                </p>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCompose} className="space-y-4">
              {/* Recipient Type */}
              {isInstructorOrAdmin && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نطاق الاستهداف:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRecipientType('individual')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        recipientType === 'individual'
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>طالب محدد</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecipientType('course_broadcast')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        recipientType === 'course_broadcast'
                          ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>طلاب دورة معينة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecipientType('all_students')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        recipientType === 'all_students'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>كافة الطلاب (عام)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Conditional Recipient Inputs */}
              {recipientType === 'individual' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسم الطالب / البريد الإلكتروني:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمد ماجد (mohamedmaged3g@gmail.com)..."
                    value={recipientStudentName}
                    onChange={e => setRecipientStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              )}

              {recipientType === 'course_broadcast' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اختر الدورة التدريبية:
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={e => setSelectedCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  موضوع الرسالة:
                </label>
                <input
                  type="text"
                  required
                  placeholder="عنوان مختصر ومباشر..."
                  value={composeSubject}
                  onChange={e => setComposeSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نص الرسالة والتفاصيل:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="اكتب التوجيهات، الملاحظات، أو تفاصيل الإعلان..."
                  value={composeContent}
                  onChange={e => setComposeContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>

              {/* Attachments Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>مرفقات الشرح (ملفات PDF أو فيديوهات):</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1">
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-500" />
                      <span>رفع ملف من جهازك</span>
                      <input
                        type="file"
                        accept=".pdf,video/mp4,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowAddAttachment(!showAddAttachment)}
                      className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold hover:bg-indigo-100 flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>إضافة رابط مرفق</span>
                    </button>
                  </div>
                </div>

                {/* Attachments List */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300"
                      >
                        {att.type === 'pdf' ? <FileText className="w-3.5 h-3.5 text-rose-500" /> : <Video className="w-3.5 h-3.5 text-teal-500" />}
                        <span className="font-bold truncate max-w-[150px]">{att.title}</span>
                        <button
                          type="button"
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                          className="hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Add Attachment Sub-Form */}
                {showAddAttachment && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="اسم الملف (مثال: ملخص الدرس.pdf)..."
                          value={newAttachmentTitle}
                          onChange={e => setNewAttachmentTitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <select
                          value={newAttachmentType}
                          onChange={e => setNewAttachmentType(e.target.value as 'pdf' | 'video')}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        >
                          <option value="pdf">مستند PDF</option>
                          <option value="video">فيديو شرح</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="رابط الملف أو الفيديو (اختياري)..."
                        value={newAttachmentUrl}
                        onChange={e => setNewAttachmentUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddAttachment}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={e => setIsImportant(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>تمييز كإعلان مهم وبارز ⚡</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 transform -rotate-90" />
                    <span>إرسال الرسالة الآن</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Viewer Modal for Live PDF / Video playback */}
      <DocumentViewerModal
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
      />
    </div>
  );
};
