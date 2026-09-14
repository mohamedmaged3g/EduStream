import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Course, CourseCategory, CourseLevel } from '../types';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Star, 
  Users, 
  Filter, 
  PlayCircle, 
  CheckCircle, 
  TrendingUp,
  Cpu,
  Code2,
  Database,
  Palette,
  Briefcase,
  Shield,
  Layers,
  ArrowUpRight,
  History,
  Terminal,
  DollarSign,
  Check,
  Lock
} from 'lucide-react';

interface CourseCatalogProps {
  onSelectCourse: (course: Course) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CATEGORIES: { id: CourseCategory | 'all'; name: string; icon: any }[] = [
  { id: 'all', name: 'جميع المسارات', icon: Layers },
  { id: 'legacy-programming', name: 'لغات البرمجة العريقة والتأسيسية (COBOL, C, Pascal)', icon: History },
  { id: 'modern-programming', name: 'لغات البرمجة الحديثة والسحابية (Rust, Go, TS, Python)', icon: Terminal },
  { id: 'ai', name: 'الذكاء الاصطناعي وهندسة النماذج', icon: Cpu },
  { id: 'cybersecurity', name: 'الأمن السيبراني والأنظمة', icon: Shield },
  { id: 'web', name: 'تطوير الويب الشامل', icon: Code2 },
  { id: 'data', name: 'قواعد وهندسة البيانات', icon: Database },
];

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  onSelectCourse,
  searchQuery,
  setSearchQuery,
}) => {
  const { courses, user, getCourseProgress, enrollInCourse } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [selectedCourseForPurchase, setSelectedCourseForPurchase] = useState<Course | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const filteredCourses = useMemo(() => {
    return courses
      .filter(course => {
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
        const matchesPricing =
          pricingFilter === 'all' ||
          (pricingFilter === 'free' && course.price === 0) ||
          (pricingFilter === 'paid' && course.price > 0);
        const matchesSearch =
          !searchQuery.trim() ||
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesLevel && matchesPricing && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'popular') return b.studentsCount - a.studentsCount;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [courses, selectedCategory, selectedLevel, pricingFilter, searchQuery, sortBy]);

  const handleEnrollOrBuy = (course: Course) => {
    if (course.price > 0 && !user?.enrolledCourseIds.includes(course.id)) {
      setSelectedCourseForPurchase(course);
    } else {
      enrollInCourse(course.id);
      onSelectCourse(course);
    }
  };

  const confirmPurchase = () => {
    if (!selectedCourseForPurchase) return;
    setIsPurchasing(true);
    setTimeout(() => {
      enrollInCourse(selectedCourseForPurchase.id);
      const boughtCourse = selectedCourseForPurchase;
      setSelectedCourseForPurchase(null);
      setIsPurchasing(false);
      onSelectCourse(boughtCourse);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-8 md:p-12 shadow-xl border border-slate-700/50">
        {/* Background glow & shapes */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold backdrop-blur-md border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>منصة متخصصة في لغات البرمجة العريقة والحديثة • مدعومة بنماذج Gemini 3</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            تعلّم تاريخ ومستقبل البرمجة والتقنية من الصفر حتى الاحتراف
          </h1>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            من لغات التأسيس المعمارية (COBOL, Pascal, C, Assembly) إلى أقوى لغات الحاضر والسحاب (Rust, Go, TypeScript, Python) مع اختبارات تقييم شاملة وشهادات موثقة.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-700/80">
            <div>
              <div className="text-2xl font-black text-emerald-400">+50,000</div>
              <div className="text-xs text-slate-400">طالب نشط بالمنصة</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">مسارات ربحية ومجانية</div>
              <div className="text-xs text-slate-400">خيارات متعددة للمتعلمين</div>
            </div>
            <div>
              <div className="text-2xl font-black text-teal-400">اختبارات وشهادات</div>
              <div className="text-xs text-slate-400">شهادات رقمية موثقة QR</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-400">مجتمع ومنتديات</div>
              <div className="text-xs text-slate-400">إشراف من المعلمين والمدراء</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>تصفح حسب المسار التخصصي</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {filteredCourses.length} دورة متوفرة
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        {/* Search input in catalog */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="بحث في لغات البرمجة والتقنيات..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Pricing Model Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setPricingFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                pricingFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setPricingFilter('free')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                pricingFilter === 'free'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              مجاني
            </button>
            <button
              onClick={() => setPricingFilter('paid')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                pricingFilter === 'paid'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              مدفوع ومميز
            </button>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>المستوى:</span>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">الكل</option>
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
              <option value="جميع المستويات">جميع المستويات</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>الترتيب:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="popular">الأكثر شعبية</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="newest">الأحدث</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            لم يتم العثور على دورات مطابقة للبحث
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            جرب تغيير كلمات البحث أو اختيار مسار تعليمي آخر
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
              setPricingFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow transition-colors"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const isEnrolled = user?.enrolledCourseIds.includes(course.id);
            const progress = isEnrolled ? getCourseProgress(course.id) : null;
            const hasFinalExam = !!course.finalExam;

            return (
              <div
                key={course.id}
                className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {course.price === 0 ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-md">
                        مجاني 100%
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold shadow-md">
                        دورة مميزة • {course.price}$
                      </span>
                    )}
                    {course.badge && (
                      <span className="px-2 py-1 rounded-lg bg-slate-900/80 text-white text-[11px] font-medium backdrop-blur-md">
                        {course.badge}
                      </span>
                    )}
                  </div>

                  {/* Level Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-slate-200 text-xs font-medium backdrop-blur-md">
                    {course.level}
                  </div>

                  {/* Duration & Lessons Overlay */}
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white text-xs font-medium">
                    <div className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{course.durationHours} ساعة</span>
                    </div>
                    {hasFinalExam && (
                      <div className="flex items-center gap-1 bg-amber-500/80 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        <span>🎓 اختبار وشهادة</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                      <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                      <span>{course.lessonsCount} درس</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Category Name */}
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {course.categoryNameAr}
                    </span>

                    {/* Title */}
                    <h3 
                      onClick={() => onSelectCourse(course)}
                      className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      {course.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Instructor & Rating */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {course.instructor.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{course.rating}</span>
                      <span className="text-slate-400 font-normal text-[10px]">
                        ({course.reviewsCount})
                      </span>
                    </div>
                  </div>

                  {/* Enrolled Progress Bar or Action Button */}
                  {isEnrolled && progress ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600 dark:text-slate-300">
                          التقدم في الدورة:
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {progress.percentage}% ({progress.completedCount}/{progress.totalCount} درس)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="w-full mt-2 py-2 px-4 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>متابعة التعلم</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {course.price === 0 ? 'مجاناً 100%' : `${course.price} $`}
                        </span>
                        {course.originalPrice && (
                          <span className="text-xs text-slate-400 line-through mr-2">
                            {course.originalPrice} $
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleEnrollOrBuy(course)}
                        className={`py-2 px-4 font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5 ${
                          course.price > 0
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <span>{course.price > 0 ? 'شراء الدورة والتسجيل' : 'الانضمام مجاناً'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transform -rotate-90" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment / Checkout Simulation Modal for Paid Courses */}
      {selectedCourseForPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                إتمام التسجيل والدفع
              </span>
              <button
                onClick={() => setSelectedCourseForPurchase(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-3">
              <img
                src={selectedCourseForPurchase.thumbnail}
                alt={selectedCourseForPurchase.title}
                className="w-20 h-14 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {selectedCourseForPurchase.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  المدرب: {selectedCourseForPurchase.instructor.name}
                </p>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-1">
                  {selectedCourseForPurchase.price} $
                </div>
              </div>
            </div>

            {/* Features Included */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>وصول دائم لجميع الفيديوهات والتمارين البرمجية</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>أداء الاختبار النهائي والحصول على شهادة معتمدة موثقة</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>مساعد ذكي Gemini 3 للإجابة على مدار الساعة في مجتمع النقاش</span>
              </div>
            </div>

            {/* Simulated Payment Methods */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                اختر وسيلة الدفع المعتمدة:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>💳 بطاقة بنكية (Visa/Master)</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>Google Pay</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={confirmPurchase}
                disabled={isPurchasing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isPurchasing ? (
                  <span>جاري تأكيد الدفع والتسجيل...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>تأكيد الشراء ({selectedCourseForPurchase.price} $) والانضمام</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
