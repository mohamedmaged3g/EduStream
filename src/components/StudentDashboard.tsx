import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Course, Certificate, Note } from '../types';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Flame, 
  Sparkles, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Bookmark, 
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Trash2
} from 'lucide-react';

interface StudentDashboardProps {
  onSelectCourse: (course: Course) => void;
  onViewCertificate: (cert: Certificate) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onSelectCourse,
  onViewCertificate,
}) => {
  const { user, courses, getCourseProgress, deleteNote } = useAuth();

  if (!user) return null;

  const enrolledCourses = courses.filter(c => user.enrolledCourseIds.includes(c.id));
  const userNotes: Note[] = JSON.parse(localStorage.getItem('taallam_notes') || '[]');

  const totalLessonsCompleted = user.completedLessonIds.length;
  const totalCertificates = user.certificates.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Student Welcome Header Card */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl border border-emerald-700/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-500/50 shadow-md"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-1 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{user.role === 'instructor' ? 'حساب مدرب معتمد' : 'طالب متميز'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">
              أهلاً بك مجدداً، {user.name} 👋
            </h1>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-center border border-white/10">
            <div className="flex items-center justify-center text-amber-400 gap-1 text-xs font-bold mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نقاط XP</span>
            </div>
            <div className="text-xl font-black text-white">{user.xp}</div>
          </div>

          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-center border border-white/10">
            <div className="flex items-center justify-center text-orange-400 gap-1 text-xs font-bold mb-0.5">
              <Flame className="w-3.5 h-3.5" />
              <span>أيام متتالية</span>
            </div>
            <div className="text-xl font-black text-white">{user.streakDays}</div>
          </div>

          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-center border border-white/10">
            <div className="flex items-center justify-center text-emerald-400 gap-1 text-xs font-bold mb-0.5">
              <Award className="w-3.5 h-3.5" />
              <span>شهادات</span>
            </div>
            <div className="text-xl font-black text-white">{totalCertificates}</div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <span>دوراتي ومساري التدريبي ({enrolledCourses.length})</span>
          </h2>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              لم تسجل في أي دورة بعد
            </p>
            <p className="text-xs text-slate-400 mt-1">
              استكشف كتالوج الدورات وابدأ التعلم مجاناً الآن!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => {
              const progress = getCourseProgress(course.id);
              const isDone = progress.percentage === 100;
              const cert = user.certificates.find(c => c.courseId === course.id);

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[11px] font-semibold">
                        {course.categoryNameAr}
                      </div>
                      {isDone && (
                        <div className="absolute top-2 right-2 px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow">
                          مكتمل 100% ✨
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        {course.title}
                      </h3>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-600 dark:text-slate-300">
                            نسبة الإنجاز:
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {progress.percentage}% ({progress.completedCount}/{progress.totalCount} درس)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{isDone ? 'مراجعة الدروس' : 'متابعة التعلم'}</span>
                    </button>

                    {cert && (
                      <button
                        onClick={() => onViewCertificate(cert)}
                        className="p-2.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 rounded-xl transition-colors"
                        title="عرض الشهادة"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Saved Notes Section */}
      {userNotes.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-500" />
            <span>ملاحظاتي المدونة ({userNotes.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userNotes.map(note => (
              <div
                key={note.id}
                className="p-4 bg-amber-50/50 dark:bg-slate-800/80 rounded-2xl border border-amber-200/60 dark:border-slate-700 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 line-clamp-1">
                      {note.lessonTitle}
                    </span>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                    {note.content}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {note.createdAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
