import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Video, 
  Download, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Resource } from '../types';

interface DocumentViewerModalProps {
  resource: Resource | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  resource,
  onClose,
}) => {
  if (!resource) return null;

  const isPdf = resource.type === 'pdf' || resource.url.endsWith('.pdf') || resource.title.toLowerCase().endsWith('.pdf');
  const isVideo = resource.type === 'video' || resource.url.includes('youtube') || resource.url.includes('embed') || resource.url.endsWith('.mp4');

  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = resource.pageCount || 12;
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`relative w-full ${isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-5xl h-[88vh] rounded-3xl'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-200`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isPdf 
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' 
                : isVideo 
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                  : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
            }`}>
              {isPdf ? <FileText className="w-5 h-5" /> : isVideo ? <Video className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {resource.title}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono uppercase font-semibold">{resource.type}</span>
                {resource.size && (
                  <>
                    <span>•</span>
                    <span>{resource.size}</span>
                  </>
                )}
                {isPdf && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">عرض تفاعلي مباشر</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isPdf && (
              <>
                <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setZoom(prev => Math.max(50, prev - 15))}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="تصغير"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom(prev => Math.min(200, prev + 15))}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="تكبير"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handlePrint}
                  className="hidden md:flex p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  title="طباعة المستند"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              download={resource.title}
              className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
              title="تنزيل الملف"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">تحميل</span>
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors ml-1"
              title="إغلاق المعاينة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-auto bg-slate-900/90 flex flex-col items-center justify-center p-3 sm:p-6 relative">
          {isPdf ? (
            <div 
              className="w-full h-full max-w-4xl bg-white text-slate-900 shadow-2xl rounded-xl overflow-hidden flex flex-col transition-transform origin-top"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              {/* PDF Header / Page Reader */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-600">PDF Reader</span>
                  <span>|</span>
                  <span className="text-slate-500 font-mono">صفحة {currentPage} من {totalPages}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                    title="الصفحة السابقة"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                    title="الصفحة التالية"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Embedded Document Frame / Interactive Page Content */}
              <div className="flex-1 overflow-auto p-6 sm:p-8 bg-slate-50 relative font-sans leading-relaxed">
                <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 shadow-sm rounded-xl border border-slate-200 space-y-6">
                  <div className="border-b-2 border-emerald-600 pb-4">
                    <div className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
                      منصة تَعَلَّمْ التعليمية • وثيقة دراسية رسمية
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mt-2">
                      {resource.title}
                    </h1>
                    {resource.description && (
                      <p className="text-sm text-slate-600 mt-2 italic">
                        {resource.description}
                      </p>
                    )}
                  </div>

                  {/* Sample Rich Rendered Educational Content */}
                  <div className="space-y-4 text-sm text-slate-800 leading-relaxed text-right">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>أهم المرتكزات البرمجية والعملية</span>
                    </h3>
                    <p>
                      تهدف هذه الوثيقة إلى تزويد المتعلم بالخلفية الهندسية المتعمقة والأمثلة التطبيقية المباشرة التي تضمن استيعاب المفاهيم البرمجية بجودة عالية.
                    </p>

                    <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs dir-ltr text-left overflow-x-auto">
                      <div className="text-emerald-400">// Practical Snippet Example</div>
                      <div>struct RecordProcessor {'{'}</div>
                      <div className="pl-4">buffer: Vec&lt;u8&gt;,</div>
                      <div className="pl-4">is_active: bool,</div>
                      <div>{'}'}</div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pt-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                      <span>تعليمات التنفيذ ومراجعة الأداء</span>
                    </h3>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 pr-2">
                      <li>التأكد من مطابقة الأنواع والمحددات الحسابية قبل التشغيل.</li>
                      <li>اتباع إرشادات المعلم وتجربة التمارين في محرر الأكواد الحي.</li>
                      <li>إتمام الاختبار القصير بنهاية الوحدة للتأكد من استيعاب المفاهيم.</li>
                    </ul>
                  </div>

                  {/* Document Footer */}
                  <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                    <span>منصة تعلّم للتقنية والبرمجة</span>
                    <span>صفحة {currentPage} من {totalPages}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : isVideo ? (
            <div className="w-full h-full max-w-4xl flex items-center justify-center">
              {resource.url.includes('youtube') || resource.url.includes('embed') ? (
                <iframe
                  src={resource.url}
                  title={resource.title}
                  className="w-full aspect-video rounded-2xl shadow-2xl border border-slate-800"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={resource.url}
                  controls
                  autoPlay
                  className="w-full aspect-video rounded-2xl shadow-2xl bg-black border border-slate-800 object-contain"
                >
                  متصفحك لا يدعم تشغيل الفيديو المباشر.
                </video>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center max-w-md shadow-2xl space-y-4">
              <BookOpen className="w-16 h-16 text-indigo-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {resource.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {resource.description || 'ملف مورد تعليمي جاهز للتنزيل والمعاينة.'}
              </p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>فتح الملف في علامة تبويب جديدة</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
