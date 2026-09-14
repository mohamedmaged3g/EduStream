import React from 'react';
import { Certificate } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certificate.verificationCode);
    alert('تم نسخ رمز التحقق المعتمد للشهادة!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between p-4 px-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>شهادة إتمام معتمدة وموثقة</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>نسخ كود التوثيق</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 md:p-12 certificate-print-area bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 text-slate-900 select-none">
          {/* Ornate Gold Border Frame */}
          <div className="relative p-8 md:p-12 border-8 border-double border-amber-600/40 rounded-2xl bg-white shadow-xl">
            
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

            {/* Certificate Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-lg mb-2">
                <GraduationCap className="w-10 h-10" />
              </div>

              <h2 className="text-2xl md:text-4xl font-black tracking-wide text-slate-900 font-serif">
                شَهَادَةُ إِتْمَامٍ وَإِجَادَةٍ مِعْيَارِيَّة
              </h2>

              <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-amber-700">
                Official Certificate of Course Completion & Mastery
              </p>

              <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4" />
            </div>

            {/* Certificate Body */}
            <div className="text-center my-8 md:my-12 space-y-6">
              <p className="text-sm md:text-base text-slate-600">
                تَشْهَدُ إِدَارَةُ <strong className="text-emerald-700">مَنَصَّةِ تَعَلَّمَ الأَكَادِيمِيَّةِ</strong> بِأَنَّ الطَّالِبَ / الطَّالِبَة:
              </p>

              {/* Student Name */}
              <div className="py-2">
                <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-serif text-emerald-800">
                  {certificate.studentName}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  ({certificate.studentEmail})
                </p>
              </div>

              <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                قَدْ أَتَمَّ بِنَجَاحٍ وَتَفَوُّقٍ كَافَّةَ مُتَطَلَّبَاتِ وَمَشَارِيعِ وَاخْتِبَارَاتِ الدَّوْرَةِ التَّدْرِيبِيَّةِ المُتَخَصِّصَة:
              </p>

              {/* Course Title */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl max-w-xl mx-auto shadow-inner">
                <h4 className="text-xl md:text-2xl font-bold text-slate-900">
                  {certificate.courseTitle}
                </h4>
                {certificate.courseTitleEn && (
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {certificate.courseTitleEn}
                  </p>
                )}
                <div className="text-xs font-bold text-amber-800 mt-2">
                  التقدير العام: {certificate.grade} • معدل النجاح: {certificate.scorePercentage}%
                </div>
              </div>
            </div>

            {/* Certificate Footer with Signatures and QR Code */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-right">
              
              {/* Instructor Signature */}
              <div className="space-y-1">
                <div className="text-xs text-slate-500">مُدَرِّبُ وَمُعْتَمِدُ الدَّوْرَة:</div>
                <div className="text-sm font-bold text-slate-900">{certificate.instructorName}</div>
                <div className="text-[11px] text-slate-500">{certificate.instructorTitle}</div>
                <div className="font-serif italic text-emerald-700 font-bold text-sm pt-1">
                  ✍️ Signed & Verified
                </div>
              </div>

              {/* Gold Seal / Badge Stamp */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-double border-amber-600 bg-gradient-to-tr from-amber-400 to-yellow-200 text-amber-900 flex flex-col items-center justify-center shadow-lg transform rotate-3">
                  <ShieldCheck className="w-7 h-7" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">معتمد رسمي</span>
                </div>
              </div>

              {/* Verification & QR Code */}
              <div className="text-center md:text-left space-y-1">
                <div className="text-xs text-slate-500">تاريخ الإصدار والتوثيق:</div>
                <div className="text-xs font-bold text-slate-800">{certificate.issueDate}</div>
                <div className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                  كود التوثيق: {certificate.verificationCode}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
