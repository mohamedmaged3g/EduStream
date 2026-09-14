import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Certificate } from '../types';
import { Award, GraduationCap, Printer, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface CertificatesGalleryProps {
  onViewCertificate: (cert: Certificate) => void;
  onExploreCourses: () => void;
}

export const CertificatesGallery: React.FC<CertificatesGalleryProps> = ({
  onViewCertificate,
  onExploreCourses,
}) => {
  const { user } = useAuth();
  const certificates = user?.certificates || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 text-white rounded-3xl border border-amber-700/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Award className="w-4 h-4 text-amber-400" />
            <span>الشهادات المعتمدة والموثقة رقمياً</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">
            سجل إنجازاتك وشهادات التخرج الأكاديمية
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            جميع الشهادات الصادرة من منصة تعلّم تحمل كود تحقق معتمد ورمز استجابة سريع QR يثبت إتمامك لكافة متطلبات الدورة والمشاريع.
          </p>
        </div>

        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center shrink-0">
          <div className="text-xs text-amber-300 font-bold mb-1">الشهادات المكتسبة</div>
          <div className="text-3xl font-black text-white">{certificates.length}</div>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            لم تحصل على شهادات معتمدة حتى الآن
          </h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            أكمل جميع دروس واختبارات أي دورة بنسبة 100% لتحصل على شهادتك الذهبية المعتمدة فوراً وتشاركها مع شبكتك المهنية.
          </p>
          <button
            onClick={onExploreCourses}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            تصفح الدورات وابدأ التعلم الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="p-6 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 dark:from-slate-800 dark:to-slate-900 rounded-3xl border-2 border-amber-500/30 dark:border-slate-700 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>شهادة معتمدة موثقة</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                    {cert.verificationCode}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    الطالب: <strong className="text-emerald-700 dark:text-emerald-400">{cert.studentName}</strong> • التقدير: {cert.grade}
                  </p>
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-amber-200/50 dark:border-slate-700">
                  <span>المدرب: {cert.instructorName}</span>
                  <span>تاريخ الإصدار: {cert.issueDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onViewCertificate(cert)}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>عرض وطباعة الشهادة PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
