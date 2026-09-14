import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Course, FinalExam, Certificate } from '../types';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  ShieldCheck,
  FileCheck2,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalExamModalProps {
  course: Course;
  onClose: () => void;
  onViewCertificate: (cert: Certificate) => void;
}

export const FinalExamModal: React.FC<FinalExamModalProps> = ({
  course,
  onClose,
  onViewCertificate,
}) => {
  const { user, recordExamPassed } = useAuth();
  const exam = course.finalExam;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercentage, setScorePercentage] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [generatedCertificate, setGeneratedCertificate] = useState<Certificate | null>(null);

  // Countdown timer in seconds
  const totalSeconds = (exam?.durationMinutes || 25) * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  if (!exam || exam.questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full text-center space-y-4">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            الاختبار النهائي قيد الإعداد لهذه الدورة
          </h3>
          <p className="text-xs text-slate-500">
            يقوم المعلم حالياً بوضع بنك الأسئلة الشاملة. يمكنك مراجعة الوحدات والاختبارات القصيرة.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            العودة لمشاهدة الدروس
          </button>
        </div>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / exam.questions.length) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmitExam = () => {
    let correct = 0;
    exam.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    const percent = Math.round((correct / exam.questions.length) * 100);
    setCorrectCount(correct);
    setScorePercentage(percent);
    setIsSubmitted(true);

    if (percent >= exam.passingScore) {
      const cert = recordExamPassed(exam.id, course, percent);
      setGeneratedCertificate(cert);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScorePercentage(0);
    setCorrectCount(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(totalSeconds);
  };

  const isPassed = scorePercentage >= exam.passingScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                الاختبار النهائي الشامل للتخرج
              </span>
              <h2 className="text-sm sm:text-base font-black line-clamp-1">
                {course.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs text-amber-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Exam Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {!isSubmitted ? (
            /* Live Exam Mode */
            <div className="space-y-6">
              
              {/* Progress & Question Navigation Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>السؤال {currentQuestionIndex + 1} من {exam.questions.length}</span>
                  <span>تمت الإجابة: {answeredCount}/{exam.questions.length} ({progressPercent}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Quick question pill bar */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exam.questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isCurrent = currentQuestionIndex === idx;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-emerald-600 text-white shadow'
                            : isAnswered
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Question Box */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {currentQuestionIndex + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentQ.question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentQ.id] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }))}
                        className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between text-xs sm:text-sm font-medium ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-sm font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        <span className="leading-relaxed">{option}</span>
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mr-3 ${
                          isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigator Bottom Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السؤال السابق</span>
                </button>

                {currentQuestionIndex < exam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                  >
                    <span>السؤال التالي</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    disabled={answeredCount < exam.questions.length}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg animate-pulse"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>إنهاء الاختبار وتسليم الإجابات</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results & Review Mode */
            <div className="space-y-6 animate-fadeIn">
              
              {/* Score Header Card */}
              <div className={`p-6 rounded-3xl text-center space-y-3 border shadow-lg ${
                isPassed 
                  ? 'bg-gradient-to-b from-emerald-500/10 to-teal-500/5 border-emerald-500/40 text-emerald-950 dark:text-emerald-100'
                  : 'bg-gradient-to-b from-rose-500/10 to-rose-500/5 border-rose-500/40 text-rose-950 dark:text-rose-100'
              }`}>
                <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
                  isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {isPassed ? <Award className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isPassed ? '🎉 ألف مبروك! لقد اجتزت الاختبار بنجاح' : 'للأسف لم تحقق درجة النجاح المطلوبة'}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  {isPassed 
                    ? `حققت ${scorePercentage}% في الاختبار الشامل (أعلى من حد النجاح ${exam.passingScore}%). تم إصدار شهادتك الرقمية المعتمدة رسمياً.`
                    : `حققت ${scorePercentage}% بينما درجة النجاح المطلوبة هي ${exam.passingScore}%. يمكنك مراجعة الأسئلة وإعادة المحاولة مجدداً.`}
                </p>

                <div className="inline-flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  <div>
                    <span className="text-slate-400">النتيجة: </span>
                    <span className={isPassed ? 'text-emerald-600 dark:text-emerald-400 text-base font-black' : 'text-rose-600 text-base font-black'}>
                      {scorePercentage}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">الإجابات الصحيحة: </span>
                    <span className="text-slate-900 dark:text-white font-black">{correctCount} / {exam.questions.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">الحالة: </span>
                    <span className={isPassed ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {isPassed ? 'مؤهل للشهادة' : 'إعادة'}
                    </span>
                  </div>
                </div>

                {isPassed && generatedCertificate && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onViewCertificate(generatedCertificate);
                      }}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95"
                    >
                      <Award className="w-5 h-5" />
                      <span>عرض وطباعة الشهادة الرقمية المعتمدة 🎓</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Review All Questions with Explanations */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>مراجعة الإجابات والتفسيرات الأكاديمية:</span>
                </h4>

                {exam.questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border space-y-3 ${
                        isCorrect
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5 ${
                            isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <span>{q.question}</span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                        }`}>
                          {isCorrect ? 'صحيحة ✓' : 'خاطئة ✗'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {q.options.map((opt, optIdx) => {
                          const isUserChoice = userAnswer === optIdx;
                          const isCorrectChoice = q.correctIndex === optIdx;

                          let style = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300';
                          if (isCorrectChoice) {
                            style = 'bg-emerald-100/80 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                          } else if (isUserChoice && !isCorrect) {
                            style = 'bg-rose-100/80 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-200';
                          }

                          return (
                            <div key={optIdx} className={`p-2.5 rounded-xl border flex items-center justify-between ${style}`}>
                              <span>{opt}</span>
                              {isCorrectChoice && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 leading-relaxed">
                        💡 <strong>التفسير والشرح:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Retake Button */}
              {!isPassed && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleRetake}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة الاختبار الشامل الآن</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
