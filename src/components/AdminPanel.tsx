import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  UserX, 
  Crown, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  GraduationCap,
  Presentation,
  Shield,
  Trash2,
  Filter,
  Sparkles,
  ArrowRight,
  Mail
} from 'lucide-react';

interface AdminPanelProps {
  onBackToCatalog: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToCatalog }) => {
  const { 
    user, 
    registeredUsers, 
    roleRequests, 
    updateUserRole, 
    approveRoleRequest, 
    rejectRoleRequest, 
    deletePlatformUser 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'requests' | 'users'>('requests');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const filteredUsers = registeredUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const pendingRequests = roleRequests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Super Admin Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-rose-800/40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <Crown className="w-3.5 h-3.5 text-rose-400" />
              <span>لوحة التحكم الرئيسية والمدير العام للمنصة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              إدارة الأعضاء والصلاحيات والترقيات
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              بصفتك الحساب الرئيسي والمدير العام للمنصة (<span className="text-rose-300 font-mono font-bold">{user?.email}</span>)، يمكنك تعيين وتعديل صلاحيات المستخدمين (طلاب، مدرسين، مديرين) والموافقة على طلبات ترقية الطلاب ليصبحوا معلمين.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onBackToCatalog}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4 transform rotate-180" />
              <span>العودة للكتالوج</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-rose-900/50">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-xs text-rose-300 font-bold mb-1">طلبات الترقية المعلقة</div>
            <div className="text-2xl font-black text-rose-400">{pendingRequests.length}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-xs text-slate-300 font-bold mb-1">إجمالي المعلمين</div>
            <div className="text-2xl font-black text-indigo-400">
              {registeredUsers.filter(u => u.role === 'instructor').length}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-xs text-slate-300 font-bold mb-1">إجمالي المديرين</div>
            <div className="text-2xl font-black text-amber-400">
              {registeredUsers.filter(u => u.role === 'admin').length}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-xs text-slate-300 font-bold mb-1">إجمالي الطلاب</div>
            <div className="text-2xl font-black text-emerald-400">
              {registeredUsers.filter(u => u.role === 'student').length}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'requests'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>طلبات ترقية الطلاب لمعلمين ({pendingRequests.length})</span>
          {pendingRequests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-300 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة حسابات المستخدمين والصلاحيات ({registeredUsers.length})</span>
        </button>
      </div>

      {/* TAB 1: Role Upgrade Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  طلبات ترقية الحسابات من طالب إلى معلّم
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  هنا تظهر طلبات الطلاب الراغبين في الانضمام إلى هيئة التدريس ونشر الدورات التدريبية
                </p>
              </div>
            </div>

            {roleRequests.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  لا توجد طلبات ترقية معلقة حالياً
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  عندما يطلب أي طالب الترقية ليصبح مدرساً، ستظهر التفاصيل وسبب الطلب هنا للمراجعة والموافقة الفورية
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {roleRequests.map(request => (
                  <div 
                    key={request.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={request.userAvatar}
                        alt={request.userName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/40 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {request.userName}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            request.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : request.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {request.status === 'pending' ? 'قيد المراجعة' : request.status === 'approved' ? 'تمت الموافقة' : 'مرفوض'}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {request.userEmail}
                        </div>
                        {request.reason && (
                          <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 mt-2">
                            <span className="font-bold text-rose-600 dark:text-rose-400">الخبرة ومجال التدريس: </span>
                            {request.reason}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                          <span>تاريخ التقديم: {new Date(request.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {request.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => {
                              approveRoleRequest(request.id);
                              showNotification(`تمت الموافقة بنجاح وترقية ${request.userName} إلى معلّم`);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>موافقة وترقية لمعلّم</span>
                          </button>
                          <button
                            onClick={() => {
                              rejectRoleRequest(request.id);
                              showNotification(`تم رفض طلب ${request.userName}`);
                            }}
                            className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>رفض</span>
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400 font-bold">
                          تمت المراجعة
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: User List and Direct Role Assignment */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-bold">تصفية حسب الدور:</span>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="all">كل الأدوار ({registeredUsers.length})</option>
                  <option value="student">طلاب</option>
                  <option value="instructor">مدرسين</option>
                  <option value="admin">مديرين</option>
                </select>
              </div>
            </div>

            {/* Users Table / Grid */}
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredUsers.map(member => {
                const isSelf = member.email === user?.email;
                const isSuper = member.email === 'mohamedmaged3g@gmail.com';

                return (
                  <div 
                    key={member.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {member.name}
                          </h4>
                          {isSuper && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-black flex items-center gap-1">
                              <Crown className="w-3 h-3 text-rose-500" />
                              <span>المدير الرئيسي للمنصة (المالك)</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          {member.email}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
                          <span>{member.xp} XP</span>
                          <span>•</span>
                          <span>مسجل في {member.enrolledCourseIds.length} دورة</span>
                        </div>
                      </div>
                    </div>

                    {/* Role Controller Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          disabled={isSuper}
                          onClick={() => {
                            updateUserRole(member.id, 'student');
                            showNotification(`تم تغيير دور ${member.name} إلى طالب`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            member.role === 'student'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          طالب
                        </button>

                        <button
                          type="button"
                          disabled={isSuper}
                          onClick={() => {
                            updateUserRole(member.id, 'instructor');
                            showNotification(`تم تعيين ${member.name} مدرساً في المنصة`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            member.role === 'instructor'
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          معلّم / مدرّس
                        </button>

                        <button
                          type="button"
                          disabled={isSuper}
                          onClick={() => {
                            updateUserRole(member.id, 'admin');
                            showNotification(`تم تعيين ${member.name} مديراً للمنصة`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            member.role === 'admin'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          مدير
                        </button>
                      </div>

                      {!isSuper && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف حساب ${member.name} (${member.email}) نهائياً؟`)) {
                              deletePlatformUser(member.id);
                              showNotification(`تم حذف المستخدم ${member.name}`);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors"
                          title="حذف المستخدم"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
