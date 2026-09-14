import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  Award, 
  Sun, 
  Moon, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  Flame,
  LayoutDashboard,
  Presentation,
  MessageSquare,
  Mail,
  ShieldAlert,
  Crown
} from 'lucide-react';

interface NavbarProps {
  currentView: 'catalog' | 'dashboard' | 'studio' | 'player' | 'certificates' | 'forum' | 'messages' | 'admin';
  setCurrentView: (view: 'catalog' | 'dashboard' | 'studio' | 'certificates' | 'forum' | 'messages' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
}) => {
  const { user, isAuthenticated, isSuperAdmin, logout, openAuthModal, theme, toggleTheme, switchRole, discussions, unreadMessagesCount, messages, roleRequests } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pendingRoleRequests = roleRequests.filter(r => r.status === 'pending');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              onClick={() => setCurrentView('catalog')}
              className="flex items-center gap-2.5 group text-right focus:outline-none shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  منصة تَعَلَّم
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold">
                    LMS
                  </span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  التقنية ولغات البرمجة العريقة والحديثة
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setCurrentView('catalog')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  currentView === 'catalog'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>استكشاف الدورات</span>
              </button>

              <button
                onClick={() => setCurrentView('messages')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
                  currentView === 'messages'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>الرسائل والإعلانات</span>
                {unreadMessagesCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('forum')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
                  currentView === 'forum'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>منتديات النقاش</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-full text-[10px] font-bold">
                  {discussions.length}
                </span>
              </button>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal();
                  } else {
                    setCurrentView('dashboard');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>دوراتي ومساري</span>
              </button>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal();
                  } else {
                    setCurrentView('studio');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  currentView === 'studio'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Presentation className="w-4 h-4 text-indigo-500" />
                <span>استوديو المعلم</span>
              </button>

              {isSuperAdmin && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    currentView === 'admin'
                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/40'
                      : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                  }`}
                  title="لوحة المدير الرئيسي وإدارة الصلاحيات"
                >
                  <Crown className="w-4 h-4 text-rose-500" />
                  <span>لوحة المدير</span>
                  {pendingRoleRequests.length > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                      {pendingRoleRequests.length}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal();
                  } else {
                    setCurrentView('certificates');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  currentView === 'certificates'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>شهاداتي</span>
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-sm mx-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن دورة، لغة برمجة، أو موضوع..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Right Actions: Theme Toggle & Google User Menu */}
          <div className="flex items-center gap-2">
            {/* Mobile Forum Shortcut */}
            <button
              onClick={() => setCurrentView('forum')}
              className={`md:hidden p-2 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                currentView === 'forum' 
                  ? 'bg-emerald-600 text-white border-emerald-500' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="تبديل المظهر"
              title="تبديل المظهر النهاري/الليلي"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                {/* User Profile Pill */}
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-1.5 hidden sm:flex text-right">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{user.xp} XP</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                      {user.name}
                    </span>
                  </div>
                  
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-40 py-2 animate-fadeIn text-right">
                      {/* User Header */}
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            user.role === 'admin'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : user.role === 'instructor'
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {user.role === 'admin' ? 'مدير المنصة ومشرف' : user.role === 'instructor' ? 'معلّم / مدرب' : 'طالب'}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <Flame className="w-3 h-3 text-orange-500" />
                            {user.streakDays} أيام متتالية
                          </span>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setCurrentView('messages');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold"
                        >
                          <div className="flex items-center gap-2.5">
                            <Mail className="w-4 h-4 text-emerald-500" />
                            <span>مستودع الرسائل والتواصل</span>
                          </div>
                          {unreadMessagesCount > 0 && (
                            <span className="px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                              {unreadMessagesCount} جديد
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('forum');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-500" />
                          <span>منتديات ومجتمع النقاش</span>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('dashboard');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-emerald-500" />
                          <span>دوراتي وسجل المشاهدة</span>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('certificates');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>شهاداتي المعتمدة ({user.certificates.length})</span>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('studio');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Presentation className="w-4 h-4 text-indigo-500" />
                          <span>استوديو إنشاء الدورات</span>
                        </button>

                        {isSuperAdmin && (
                          <button
                            onClick={() => {
                              setCurrentView('admin');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <Crown className="w-4 h-4 text-rose-500" />
                              <span>لوحة تحكم المدير العام</span>
                            </div>
                            {pendingRoleRequests.length > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                                {pendingRoleRequests.length} طلبات
                              </span>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Switch Role */}
                      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-[11px] text-slate-400 mb-1">تبديل الدور التفاعلي:</div>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => switchRole('student')}
                            className={`px-2 py-1 text-xs font-bold rounded-lg ${
                              user.role === 'student'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            طالب
                          </button>
                          <button
                            onClick={() => switchRole('instructor')}
                            className={`px-2 py-1 text-xs font-bold rounded-lg ${
                              user.role === 'instructor'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            معلّم
                          </button>
                          <button
                            onClick={() => switchRole('admin')}
                            className={`px-2 py-1 text-xs font-bold rounded-lg ${
                              user.role === 'admin'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            مدير
                          </button>
                        </div>
                      </div>

                      {/* Logout */}
                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Google Sign-in Trigger */
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                {/* Google SVG */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span className="hidden sm:inline">دخول بحساب Gmail</span>
                <span className="sm:hidden">دخول</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
