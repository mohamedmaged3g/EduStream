import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CourseCatalog } from './components/CourseCatalog';
import { CoursePlayer } from './components/CoursePlayer';
import { StudentDashboard } from './components/StudentDashboard';
import { InstructorStudio } from './components/InstructorStudio';
import { CertificatesGallery } from './components/CertificatesGallery';
import { ForumView } from './components/ForumView';
import { MessagesRepository } from './components/MessagesRepository';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { CertificateModal } from './components/CertificateModal';
import { Course, Certificate } from './types';
import { 
  GraduationCap, 
  BookOpen, 
  LayoutDashboard, 
  Presentation, 
  Award, 
  Sparkles, 
  Heart,
  Globe,
  ShieldCheck,
  MessageSquare,
  Mail
} from 'lucide-react';

function LMSContent() {
  const { isAuthenticated, openAuthModal, unreadMessagesCount } = useAuth();
  const [currentView, setCurrentView] = useState<'catalog' | 'dashboard' | 'studio' | 'player' | 'certificates' | 'forum' | 'messages'>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedCourse(null);
    setCurrentView('catalog');
  };

  const handleViewCertificate = (cert: Certificate) => {
    setSelectedCertificate(cert);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-8">
        {currentView === 'catalog' && (
          <CourseCatalog
            onSelectCourse={handleSelectCourse}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {currentView === 'forum' && (
          <ForumView />
        )}

        {currentView === 'messages' && (
          <MessagesRepository
            onBackToCatalog={handleBackToCatalog}
          />
        )}

        {currentView === 'player' && selectedCourse && (
          <CoursePlayer
            course={selectedCourse}
            onBack={handleBackToCatalog}
            onViewCertificate={handleViewCertificate}
          />
        )}

        {currentView === 'dashboard' && (
          <StudentDashboard
            onSelectCourse={handleSelectCourse}
            onViewCertificate={handleViewCertificate}
          />
        )}

        {currentView === 'studio' && (
          <InstructorStudio
            onBack={handleBackToCatalog}
            onCourseCreated={(newCourse) => {
              handleSelectCourse(newCourse);
            }}
            onOpenMessages={() => setCurrentView('messages')}
          />
        )}

        {currentView === 'certificates' && (
          <CertificatesGallery
            onViewCertificate={handleViewCertificate}
            onExploreCourses={() => setCurrentView('catalog')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  منصة تَعَلَّمْ الأكاديمية
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                منصة متخصصة في لغات البرمجة العريقة والحديثة وتكنولوجيا المعلومات، مع نظام منتديات نقاش متكامل، اختبارات وحدات واختبارات نهائية وشهادات رقمية معتمدة.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>تسجيل دخول فوري وآمن بحساب Google وGmail</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                المسارات البرمجية
              </h4>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-medium">
                <li className="hover:text-emerald-600 cursor-pointer">لغات البرمجة العريقة (COBOL, C, Pascal)</li>
                <li className="hover:text-emerald-600 cursor-pointer">لغات البرمجة الحديثة (Rust, Go, TypeScript)</li>
                <li className="hover:text-emerald-600 cursor-pointer">الذكاء الاصطناعي وهندسة النماذج</li>
                <li className="hover:text-emerald-600 cursor-pointer">الأمن السيبراني وبنية الأنظمة</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                المجتمع والروابط السريعة
              </h4>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-medium">
                <li>
                  <button onClick={() => setCurrentView('forum')} className="hover:text-emerald-600">
                    منتديات ومجتمع النقاش
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('catalog')} className="hover:text-emerald-600">
                    استكشاف الدورات
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('studio')} className="hover:text-emerald-600">
                    استوديو المعلم والمدرب
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('certificates')} className="hover:text-emerald-600">
                    الشهادات الرقمية المعتمدة
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} لمنصة تَعَلَّمْ LMS
            </div>
            <div className="flex items-center gap-1">
              <span>مدعوم بواسطة</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Gemini 3 AI</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <div className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentView('catalog')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            currentView === 'catalog'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الدورات</span>
        </button>

        <button
          onClick={() => setCurrentView('messages')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold relative ${
            currentView === 'messages'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>الرسائل</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setCurrentView('forum')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            currentView === 'forum'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>المنتدى</span>
        </button>

        <button
          onClick={() => {
            if (!isAuthenticated) openAuthModal();
            else setCurrentView('dashboard');
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            currentView === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>مساري</span>
        </button>

        <button
          onClick={() => {
            if (!isAuthenticated) openAuthModal();
            else setCurrentView('studio');
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            currentView === 'studio'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>استوديو</span>
        </button>
      </div>

      {/* Global Modals */}
      <GoogleAuthModal />
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LMSContent />
    </AuthProvider>
  );
}
