import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { SUPER_ADMIN_EMAIL } from '../lib/firebase';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  GraduationCap, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Crown
} from 'lucide-react';

export const GoogleAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    loginWithGoogle, 
    signInWithGooglePopup 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  
  // Student email mode states
  const [isStudentEmailFormOpen, setIsStudentEmailFormOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentName, setStudentName] = useState('');

  // Admin passcode login states
  const [adminPasscodeInput, setAdminPasscodeInput] = useState('');
  const [showAdminPasscode, setShowAdminPasscode] = useState(false);

  // Status and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handlePopupGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await signInWithGooglePopup();
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage('حدث خطأ أثناء الاتصال بخدمة Google. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = studentEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setErrorMessage('يرجى إدخال عنوان بريد إلكتروني صحيح');
      return;
    }

    // Impersonation protection
    if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
      setErrorMessage(
        'هذا البريد الإلكتروني مخصص للمدير العام فقط (الأستاذ محمد ماجد). يرجى التبديل إلى تبويب "بوابة المدير" وإدخال رمز الأمان السري للدخول.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const name = studentName.trim() || email.split('@')[0];
      const res = await loginWithGoogle(email, name, 'student');
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      setErrorMessage('تعذر تسجيل الدخول، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminPasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!adminPasscodeInput.trim()) {
      setErrorMessage('يرجى كتابة رمز الأمان السري للمدير العام');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithGoogle(
        SUPER_ADMIN_EMAIL,
        'محمد ماجد',
        'admin',
        { adminPasscode: adminPasscodeInput.trim() }
      );

      if (!res.success && res.error) {
        setErrorMessage(res.error);
      } else {
        setAdminPasscodeInput('');
      }
    } catch (err) {
      setErrorMessage('رمز الأمان غير صحيح أو حدث خطأ أثناء التحقق.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top Accent bar */}
        <div className={`h-2 transition-colors duration-300 ${
          activeTab === 'admin' 
            ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600' 
            : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500'
        }`} />
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-inner transition-colors duration-300 ${
              activeTab === 'admin'
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 ring-4 ring-rose-50 dark:ring-rose-950/30'
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-50 dark:ring-emerald-950/30'
            }`}>
              {activeTab === 'admin' ? (
                <Crown className="w-8 h-8" />
              ) : (
                <GraduationCap className="w-8 h-8" />
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {activeTab === 'admin' ? 'بوابة دخول المدير العام' : 'تسجيل الدخول إلى تعلّم'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {activeTab === 'admin'
                ? 'منطقة محمية برمز الأمان السري والتحقق الثنائي للمسؤول الرئيسي فقط'
                : 'سجل دخولك بنقرة واحدة بحسابك في Google واستمتع بتجربة التعلم الذكي'}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'student'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>دخول الطلاب والمتعلمين</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>بوابة المدير العام</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* TAB 1: STUDENT & PUBLIC LOGIN */}
          {activeTab === 'student' && (
            <div className="space-y-4">
              {/* Primary Official Google Auth Popup */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handlePopupGoogleLogin}
                className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl shadow-sm hover:shadow-md active:scale-98 transition-all group text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      المتابعة باستخدام حساب Google
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      دخول رسمي وآمن بحسابك المفتوح في المتصفح
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transform -rotate-180 group-hover:-translate-x-1 transition-all" />
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-medium">أو</span>
              </div>

              {!isStudentEmailFormOpen ? (
                <button
                  type="button"
                  onClick={() => setIsStudentEmailFormOpen(true)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl transition-colors text-center"
                >
                  تسجيل بالبريد الإلكتروني للطلاب (بدون Google)
                </button>
              ) : (
                <form onSubmit={handleStudentEmailSubmit} className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    بيانات حساب الطالب:
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="اسمك الكامل (مثال: أحمد مصطفى)"
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      placeholder="بريدك الإلكتروني (student@gmail.com)"
                      value={studentEmail}
                      onChange={e => setStudentEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isLoading ? 'جاري الدخول...' : 'دخول الطالب'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsStudentEmailFormOpen(false)}
                      className="py-2 px-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl font-medium"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: SUPER ADMIN SECURED PORTAL */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <p className="leading-relaxed font-medium">
                  حساب الإدارة مخصص حصرياً للمدير العام (<span className="font-mono font-bold">mohamedmaged3g@gmail.com</span>). يتطلب الدخول إدخال رمز الأمان السري أو الدخول عبر حساب Google الرسمي الخاص بك.
                </p>
              </div>

              {/* Method A: Google Auth Popup for the owner */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handlePopupGoogleLogin}
                className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-500 rounded-2xl shadow-sm hover:shadow-md transition-all group text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-rose-600 transition-colors">
                      تحقق عبر حساب Google المعتمد للمدير
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      يتحقق تلقائياً من ملكيتك للبريد الرسمي
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transform -rotate-180 group-hover:-translate-x-1 transition-all" />
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-medium">أو عبر رمز الأمان السري</span>
              </div>

              {/* Method B: Admin Passcode Form */}
              <form onSubmit={handleAdminPasscodeSubmit} className="space-y-3.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    بريد المدير العام (ثابت ومحدد):
                  </label>
                  <input
                    type="text"
                    disabled
                    value={SUPER_ADMIN_EMAIL}
                    className="w-full px-3.5 py-2 bg-slate-200/70 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 cursor-not-allowed font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رمز الأمان السري للمدير (Passcode):
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPasscode ? 'text' : 'password'}
                      required
                      placeholder="أدخل رمز الأمان الخاص بك"
                      value={adminPasscodeInput}
                      onChange={e => setAdminPasscodeInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 pl-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPasscode(!showAdminPasscode)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showAdminPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    * الرمز المبدئي الافتراضي: <span className="font-mono font-bold text-rose-500">Admin@2026</span> (ويمكنك تغييره في أي وقت من لوحة التحكم)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'جاري التحقق من رمز الأمان...' : 'الدخول إلى لوحة المدير العام'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Benefits Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>نظام حماية ضد انتحال الشخصية والوصول غير المصرح به</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>مساعد تعليمي ذكي مدمج مع Gemini AI لشرح كل درس</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
