import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { X, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, GraduationCap, Presentation } from 'lucide-react';

export const GoogleAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleQuickLogin = (email: string, name: string) => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle(email, name, selectedRole);
      setIsLoading(false);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) return;
    setIsLoading(true);
    setTimeout(() => {
      const name = customName.trim() || customEmail.split('@')[0];
      loginWithGoogle(customEmail, name, selectedRole);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-3 shadow-inner">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              تسجيل الدخول إلى منصة تعلّم
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              سجل دخولك بنقرة واحدة باستخدام حساب Google / Gmail الخاص بك
            </p>
          </div>

          {/* Role Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              نوع الحساب:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedRole === 'student'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>حساب طالب</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('instructor')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedRole === 'instructor'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Presentation className="w-4 h-4" />
                <span>حساب معلّم / مدرب</span>
              </button>
            </div>
          </div>

          {!isCustomMode ? (
            <div className="space-y-3">
              {/* Primary Google Login Button (mohamedmaged3g@gmail.com) */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin('mohamedmaged3g@gmail.com', 'محمد ماجد')}
                className="w-full flex items-center justify-between p-3.5 bg-rose-50/60 dark:bg-rose-950/30 border-2 border-rose-200 dark:border-rose-900/60 hover:border-rose-500 rounded-xl shadow-sm hover:shadow-md transition-all group text-right"
              >
                <div className="flex items-center gap-3">
                  {/* Google Icon SVG */}
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800 shadow-sm">
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
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors flex items-center gap-1.5">
                      <span>دخول المدير العام والمالك</span>
                      <span className="px-1.5 py-0.2 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[10px] font-black">
                        المدير الرئيسي
                      </span>
                    </div>
                    <div className="text-xs text-rose-700 dark:text-rose-300 font-mono font-semibold">
                      mohamedmaged3g@gmail.com
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transform -rotate-180 group-hover:-translate-x-1 transition-all" />
              </button>

              {/* Enter Custom Gmail Option */}
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="w-full py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl transition-colors text-center"
              >
                + استخدام حساب Gmail أو Google آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم الكامل:
                </label>
                <input
                  type="text"
                  placeholder="مثال: أحمد مصطفى"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  بريد Google / Gmail:
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isLoading ? 'جاري التحقق والاتصال...' : 'تسجيل الدخول الفوري'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-colors"
                >
                  رجوع
                </button>
              </div>
            </form>
          )}

          {/* Perks list */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>مساعد تعليمي ذكي مدمج مع Gemini AI لشرح كل درس</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>شهادات إتمام رسمية موثقة برقم كود فريد وQR قابل للمشاركة</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>حفظ تلقائي للتقدم والملاحظات ونقاط الخبرة XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
