import { Course, Discussion, Review, StudentMessage } from '../types';

export const INITIAL_COURSES: Course[] = [
  // 1. Ancient / Legacy Programming: COBOL
  {
    id: 'cobol-legacy-systems',
    title: 'إتقان لغة COBOL والأنظمة المصرفية العتيدة (Mainframe & Banking Systems)',
    titleEn: 'Mastering COBOL & Legacy Mainframe Banking Systems',
    subtitle: 'تعلم لغة البرمجة التي تدير 80% من المعاملات المالية والمصرفية حول العالم',
    category: 'legacy-programming',
    categoryNameAr: 'لغات البرمجة القديمة والعتيدة',
    level: 'متوسط',
    price: 49,
    originalPrice: 120,
    rating: 4.96,
    reviewsCount: 840,
    studentsCount: 3920,
    durationHours: 26,
    lessonsCount: 16,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    badge: 'الأكثر طلباً للمصارف',
    isFeatured: true,
    isPopular: true,
    updatedAt: '2026-08-28',
    instructor: {
      id: 'inst-cobol',
      name: 'د. فاروق السعيد',
      nameEn: 'Dr. Farouk El-Saeed',
      title: 'كبير مهندسي النظم المركزية ومستشار تحديث الأنظمة البنكية',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      rating: 4.97,
      studentsCount: 18400,
      bio: 'أكثر من 28 عاماً في برمجة وصيانة الأنظمة المركزية IBM Mainframe z/OS ولغة COBOL في كبرى البنوك والمؤسسات المالية الدولية.'
    },
    tags: ['COBOL', 'Mainframe', 'IBM z/OS', 'JCL', 'Banking Tech', 'Data Division'],
    outcomes: [
      'فهم البنية الهيكلية لملفات وبرامج COBOL المكونة من 4 أقسام رئيسية (Divisions)',
      'التعامل مع ملفات السجلات Indexed & Sequential Files ومعالجة الحسابات المالية',
      'كتابة أوامر الإجراءات PROCEDURE DIVISION والتعامل مع PIC Clauses',
      'فهم تكامل لغة COBOL مع لغات البرمجة الحديثة وواجهات REST APIs'
    ],
    requirements: [
      'فهم أساسيات المنطق البرمجي ومتغيرات البيانات',
      'بيئة عمل GnuCOBOL أو محاكي الويب المدمج في المنصة'
    ],
    sections: [
      {
        id: 'sec-cob-1',
        title: 'الوحدة الأولى: البنية المعمارية لبرامج COBOL وأقسام الكود الأربعة',
        lessons: [
          {
            id: 'cob-l1',
            title: 'مقدمة في تاريخ COBOL ودورها الحيوي في الاقتصاد العالمي',
            titleEn: 'History of COBOL & Its Modern Financial Impact',
            durationMinutes: 18,
            videoUrl: 'https://www.youtube.com/embed/a7_WFUlFS94',
            videoType: 'youtube',
            description: 'لماذا لا تزال لغة كولبول التي ظهرت عام 1959 تدير مليارات الدولارات يومياً؟ وكيف يعمل المترجم والـ Mainframe.',
            codeSnippet: {
              language: 'cobol',
              code: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO-WORLD.
       AUTHOR. TAREQ.
       ENVIRONMENT DIVISION.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-GREETING PIC X(30) VALUE 'WELCOME TO TAALLAM LMS!'.
       PROCEDURE DIVISION.
           DISPLAY WS-GREETING.
           STOP RUN.`,
              explanation: 'هيكل برنامج COBOL القياسي مع الأقسام الأربعة واستخدام جملة DISPLAY لعرض النصوص.'
            },
            quiz: {
              id: 'q-cob-1',
              title: 'اختبار قصير: أساسيات هيكل لغة COBOL',
              passingScore: 70,
              questions: [
                {
                  id: 1,
                  question: 'أي قسم في برنامج COBOL مخصص لتعريف المتغيرات ومساحات التخزين؟',
                  options: ['DATA DIVISION', 'IDENTIFICATION DIVISION', 'PROCEDURE DIVISION', 'ENVIRONMENT DIVISION'],
                  correctIndex: 0,
                  explanation: 'قسم DATA DIVISION وخاصة WORKING-STORAGE SECTION هو المكان الذي تُعرّف فيه جميع المتغيرات والسجلات.'
                },
                {
                  id: 2,
                  question: 'ما الذي تدل عليه العبارة PIC X(20) في كود COBOL؟',
                  options: ['متغير نصي بطول 20 حرفاً', 'رقم صحيح مكون من 20 خانة', 'صورة رقمية بدقة 20 بكسل', 'مؤشر ذاكرة مؤقت'],
                  correctIndex: 0,
                  explanation: 'الحرف X في بند PICTURE يدل على البيانات النصية أو الأبجدية الرقمية (Alphanumeric).'
                }
              ]
            }
          },
          {
            id: 'cob-l2',
            title: 'معالجة العمليات الحسابية والمالية الدقيقة في PROCEDURE DIVISION',
            titleEn: 'Arithmetic Operations & High-Precision Financials in COBOL',
            durationMinutes: 24,
            videoUrl: 'https://www.youtube.com/embed/T8Xp9gU2458',
            videoType: 'youtube',
            description: 'التعامل مع جمل COMPUTE و ADD و MULTIPLY وحساب الفوائد البنكية بدقة متناهية دون أخطاء الفاصلة العائمة (Floating Point).'
          }
        ]
      }
    ],
    finalExam: {
      id: 'exam-cobol-final',
      title: 'الاختبار النهائي الشامل لاعتماد مهندس لغة COBOL والأنظمة المالية',
      durationMinutes: 30,
      passingScore: 75,
      questions: [
        {
          id: 1,
          question: 'ما هو الترتيب الصحيح للأقسام الأربعة الرئيسية في كود COBOL من البداية للنهاية؟',
          options: [
            'IDENTIFICATION DIVISION ثم ENVIRONMENT DIVISION ثم DATA DIVISION ثم PROCEDURE DIVISION',
            'PROCEDURE DIVISION ثم DATA DIVISION ثم IDENTIFICATION DIVISION ثم ENVIRONMENT DIVISION',
            'DATA DIVISION ثم PROCEDURE DIVISION ثم ENVIRONMENT DIVISION ثم IDENTIFICATION DIVISION',
            'IDENTIFICATION DIVISION ثم DATA DIVISION ثم PROCEDURE DIVISION فقط'
          ],
          correctIndex: 0,
          explanation: 'الترتيب الصارم المعياري لـ COBOL يبدأ بـ IDENTIFICATION ثم ENVIRONMENT ثم DATA وأخيراً PROCEDURE.'
        },
        {
          id: 2,
          question: 'كيف يتم تعريف متغير رقمي يحتوي على رقمين عشريين في COBOL؟',
          options: ['PIC 9(5)V99', 'PIC X(5).2', 'PIC NUM(5,2)', 'DECIMAL 5.2'],
          correctIndex: 0,
          explanation: 'الرمز V يعبر عن الفاصلة العشرية الافتراضية (Assumed Decimal Point) دون حجز مساحة حرفية إضافية.'
        },
        {
          id: 3,
          question: 'ما هي ميزة COBOL الحاسمة التي تجعل البنوك الكبرى تفضلها على كثير من اللغات الحديثة؟',
          options: [
            'الحسابات العشرية الدقيقة Fixed-Point Arithmetic بدون أخطاء تقريب الفاصلة العائمة، وسرعة معالجة الملفات المليونية',
            'دعمها لمحركات الألعاب ثلاثية الأبعاد',
            'صغر حجمها على هواتف آيفون',
            'سهولة تصميم واجهات الويب المتحركة بها'
          ],
          correctIndex: 0,
          explanation: 'دقة الحسابات المالية بالبنسات والمليمات، مع ثبات واستقرار أنظمة Mainframe لعقود دون توقف.'
        },
        {
          id: 4,
          question: 'ما هو دور جملة PERFORM ... UNTIL في COBOL؟',
          options: [
            'تنفيذ حلقات التكرار (Looping) حتى يتحقق شرط محدد',
            'إنهاء البرنامج فوراً وإغلاق الملفات',
            'طباعة تقرير مصرفي على الطابعة المركزية',
            'استدعاء كود بلغة JavaScript'
          ],
          correctIndex: 0,
          explanation: 'PERFORM UNTIL هي الأداة القياسية في كولبول لإنشاء الحلقات التكرارية والتحكم في سير التنفيذ.'
        }
      ]
    }
  },

  // 2. Ancient / Low-Level: Assembly x86
  {
    id: 'assembly-x86-core',
    title: 'برمجة لغة التجميع x86 والمعالجات الدقيقة (Assembly & Low-Level Architecture)',
    titleEn: 'x86/x64 Assembly Language & Reverse Engineering Fundamentals',
    subtitle: 'افهم ما يحدث داخل وحدة المعالجة المركزية CPU، السجلات Registers، والذاكرة RAM',
    category: 'legacy-programming',
    categoryNameAr: 'لغات البرمجة القديمة والعتيدة',
    level: 'متقدم',
    price: 0,
    originalPrice: 99,
    rating: 4.93,
    reviewsCount: 610,
    studentsCount: 5200,
    durationHours: 22,
    lessonsCount: 14,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    badge: 'مجانية بالكامل',
    isFeatured: true,
    isPopular: false,
    isFree: true,
    updatedAt: '2026-08-22',
    instructor: {
      id: 'inst-asm',
      name: 'م. حسام الدين علام',
      nameEn: 'Eng. Hossam Allam',
      title: 'خبير الهندسة العكسية وأمن النواة Kernel Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 4.94,
      studentsCount: 14500,
      bio: 'متخصص في برمجة النظم المنخفضة المستوى، تطوير برامج القيادة (Device Drivers)، وتحليل الثغرات البرمجية في لغة التجميع.'
    },
    tags: ['Assembly x86', 'CPU Registers', 'Stack Frame', 'Low-Level', 'Reverse Engineering', 'Memory'],
    outcomes: [
      'فهم سجلات المعالج العامة EAX, EBX, ECX, EDX ومؤشرات الذاكرة ESP, EBP',
      'فهم بنية الـ Call Stack وطريقة تمرير المعاملات وعمليات Push و Pop',
      'كتابة برامج تجميع كاملة باستخدام NASM والتفاعل مع مقاطعات النظام Syscalls',
      'تحليل الثغرات مثل Buffer Overflow وفهم كيفية حماية البرامج المنخفضة المستوى'
    ],
    requirements: [
      'معرفة جيدة بمفاهيم أنظمة العد الثنائي والست عشري (Hexadecimal & Binary)',
      'فهم مبدئي للغة C أو أي لغة برمجية مفسرة'
    ],
    sections: [
      {
        id: 'sec-asm-1',
        title: 'الوحدة الأولى: معمارية المعالج والسجلات وذاكرة المكدس',
        lessons: [
          {
            id: 'asm-l1',
            title: 'سجلات المعالج x86 والتعامل مع أوامر MOV و ADD و SUB',
            titleEn: 'x86 Registers & Core Arithmetic Instructions',
            durationMinutes: 20,
            videoUrl: 'https://www.youtube.com/embed/4gyCU8FbQKw',
            videoType: 'youtube',
            description: 'فهم السجلات العامة، سجلات المقاطع، وكيفية نقل البيانات بين الذاكرة والـ CPU.',
            codeSnippet: {
              language: 'assembly',
              code: `section .data
    msg db 'Hello from x86 Assembly!', 0xA
    len equ $ - msg

section .text
    global _start

_start:
    ; write syscall (sys_write = 4 in 32-bit x86)
    mov eax, 4
    mov ebx, 1      ; stdout
    mov ecx, msg    ; message pointer
    mov edx, len    ; length
    int 0x80        ; interrupt kernel

    ; exit syscall
    mov eax, 1
    xor ebx, ebx    ; return 0
    int 0x80`,
              explanation: 'برنامج بلغة التجميع NASM يقوم بطباعة نص إلى المخرج القياسي باستخدام مقاطعة النواة int 0x80.'
            },
            quiz: {
              id: 'q-asm-1',
              title: 'اختبار فهم سجلات x86',
              passingScore: 75,
              questions: [
                {
                  id: 1,
                  question: 'أي من السجلات التالية يُستخدم عادةً كمؤشر لقمة المكدس (Stack Pointer) في معمارية 32-بت؟',
                  options: ['ESP', 'EAX', 'ECX', 'EDX'],
                  correctIndex: 0,
                  explanation: 'سجل ESP (Extended Stack Pointer) يشير دائماً إلى أعلى عنصر موجود في المكدس (Stack).'
                }
              ]
            }
          }
        ]
      }
    ],
    finalExam: {
      id: 'exam-asm-final',
      title: 'الاختبار النهائي الشامل للغة التجميع ومعمارية الحاسوب',
      durationMinutes: 25,
      passingScore: 75,
      questions: [
        {
          id: 1,
          question: 'ما هو تأثير الأمر xor eax, eax على قيمة السجل EAX؟',
          options: ['تصفير قيمة السجل EAX (يصبح 0) بأسرع طريقة وأقل حجم بايتات', 'مضاعفة قيمة السجل', 'عكس جميع البتات إلى 1', 'حفظ السجل في القرص الصلب'],
          correctIndex: 0,
          explanation: 'عملية XOR للشيء مع نفسه ينتج عنها دائماً 0، وهي الطريقة المثلى لدى المترجمات لتصفير السجلات بسرعة.'
        },
        {
          id: 2,
          question: 'عند تنفيذ أمر PUSH EAX، كيف تتغير قيمة مؤشر المكدس ESP في معمارية 32-bit؟',
          options: ['تنقص قيمة ESP بمقدار 4 بايتات (لأن المكدس ينمو نحو العناوين الأدنى)', 'تزيد قيمة ESP بمقدار 4 بايتات', 'تبقى كما هي', 'تتضاعف'],
          correctIndex: 0,
          explanation: 'في معمارية x86 القياسية، ينمو المكدس للأسفل (Downwards towards lower memory addresses).'
        }
      ]
    }
  },

  // 3. Modern Language: Rust
  {
    id: 'rust-systems-concurrency',
    title: 'لغة Rust الحديثة وبرمجة النظم عالية الأمان والتوازي (Systems & Concurrency)',
    titleEn: 'Modern Rust Programming: Memory Safety Without Garbage Collection',
    subtitle: 'احترف لغة المستقبل لأنظمة التشغيل، محركات الألعاب، وتطبيقات WebAssembly فائقة السرعة',
    category: 'modern-programming',
    categoryNameAr: 'لغات البرمجة والتقنيات الحديثة',
    level: 'متوسط',
    price: 39,
    originalPrice: 89,
    rating: 4.97,
    reviewsCount: 1120,
    studentsCount: 7890,
    durationHours: 28,
    lessonsCount: 18,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    badge: 'الأعلى تقييماً عالمياً',
    isFeatured: true,
    isPopular: true,
    updatedAt: '2026-08-27',
    instructor: {
      id: 'inst-rust',
      name: 'م. زياد كمال',
      nameEn: 'Eng. Ziad Kamal',
      title: 'مهندس برمجيات نظم ومطور في مشاريع مفتوحة المصدر للغة Rust',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: 4.98,
      studentsCount: 22000,
      bio: 'متخصص في بناء خوادم التداول المالي منخفضة زمن الوصول (Low Latency) وتطبيقات التزامن والذكاء الاصطناعي بلغة Rust.'
    },
    tags: ['Rust', 'Memory Safety', 'Ownership & Borrowing', 'Concurrency', 'Tokio', 'Async'],
    outcomes: [
      'إتقان نموذج الملكية والاستعارة (Ownership & Borrowing) بدون مجمع قمامة (Garbage Collector)',
      'التعامل مع أنواع البيانات Enums المتقدمة والـ Pattern Matching ومطابقة الأنماط',
      'بناء خوادم غير متزامنة Asynchronous فائقة السرعة باستخدام مكتبة Tokio و Axum',
      'منع أخطاء التزامن (Data Races) نهائياً أثناء زمن التحويل (Compile-time)'
    ],
    requirements: [
      'معرفة بأي لغة برمجية (C, C++, Go, Python, أو JavaScript)'
    ],
    sections: [
      {
        id: 'sec-rust-1',
        title: 'الوحدة الأولى: ثورة نظام الملكية والاستعارة (Ownership & Lifetimes)',
        lessons: [
          {
            id: 'rust-l1',
            title: 'لماذا تتفوق Rust؟ قواعد الملكية الثلاثة وإدارة الذاكرة',
            titleEn: 'Why Rust? The Three Rules of Ownership',
            durationMinutes: 22,
            videoUrl: 'https://www.youtube.com/embed/zF34dRivLOw',
            videoType: 'youtube',
            description: 'فهم كيف يضمن مترجم Rust الأمان التام للذاكرة بدون أي تكلفة أثناء التشغيل (Zero-cost Abstractions).',
            codeSnippet: {
              language: 'rust',
              code: `fn main() {
    let s1 = String::from("Hello Taallam LMS!");
    let len = calculate_length(&s1); // الاستعارة المرجعية Borrowing
    println!("النص: '{}' - الطول: {}", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}`,
              explanation: 'الكود يوضح مبدأ الاستعارة بالمرجع (&String) الذي يمنع نقل الملكية (Move) ويسمح بقراءة البيانات بأمان.'
            },
            quiz: {
              id: 'q-rust-1',
              title: 'اختبار قواعد الملكية في Rust',
              passingScore: 80,
              questions: [
                {
                  id: 1,
                  question: 'ماذا يحدث للمتغير في Rust عندما يخرج عن نطاقه (Scope)؟',
                  options: ['يتم تحرير ذاكرته تلقائياً وفوراً عبر استدعاء دالة Drop', 'ينتظر مجمع القمامة لتنظيفه', 'يظل في الذاكرة حتى إغلاق الجهاز', 'يتسبب في خطأ Null Pointer'],
                  correctIndex: 0,
                  explanation: 'في Rust، عندما يخرج مالك القيمة عن النطاق، يتم تحرير الذاكرة فوراً وبدقة بواسطة Drop.'
                }
              ]
            }
          }
        ]
      }
    ],
    finalExam: {
      id: 'exam-rust-final',
      title: 'الاختبار النهائي الشامل لشهادة احتراف لغة Rust',
      durationMinutes: 30,
      passingScore: 80,
      questions: [
        {
          id: 1,
          question: 'ما هي القاعدة الأساسية للاستعارة (Borrowing) في لغة Rust في أي لحظة زمنية؟',
          options: [
            'يمكنك الحصول على أي عدد من المراجع غير القابلة للتعديل (&T)، أو مرجع واحد فقط قابل للتعديل (&mut T)، ولكن ليس كلاهما معاً',
            'يمكنك التعديل في عدة مراجع متزامنة بحرية تامة',
            'لا يمكن استخدام المراجع نهائياً ويجب نسخ البيانات دائماً',
            'يجب استخدام المؤشرات غير الآمنة Raw Pointers في كل مكان'
          ],
          correctIndex: 0,
          explanation: 'قاعدة الاستعارة في Rust تمنع سباقات القراءة/الكتابة (Data Races) في زمن الترجمة تماماً.'
        },
        {
          id: 2,
          question: 'ما هو النوع القياسي في Rust للتعامل مع القيم التي قد تكون موجودة أو غير موجودة بدون الحاجة لقيمة Null؟',
          options: ['Option<T>', 'Result<T, E>', 'Nullable<T>', 'Void<T>'],
          correctIndex: 0,
          explanation: 'Rust ليس بها Null، وتستخدم Option<T> بقيمتيه Some(value) أو None لتجنب أخطاء المؤشرات المعدومة.'
        }
      ]
    }
  },

  // 4. Modern Tech & AI: Gemini & GenAI Masterclass
  {
    id: 'ai-masterclass',
    title: 'هندسة الذكاء الاصطناعي التوليدي ونماذج Gemini 3',
    titleEn: 'Generative AI & Gemini API Masterclass',
    subtitle: 'تعلم بناء تطبيقات ذكية، وكلاء Antigravity، وهندسة التلقينات باحترافية',
    category: 'ai',
    categoryNameAr: 'الذكاء الاصطناعي',
    level: 'متوسط',
    price: 0,
    originalPrice: 199,
    rating: 4.95,
    reviewsCount: 1420,
    studentsCount: 8950,
    durationHours: 18,
    lessonsCount: 14,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    badge: 'الأعلى تقييماً',
    isFeatured: true,
    isPopular: true,
    isFree: true,
    updatedAt: '2026-08-25',
    instructor: {
      id: 'inst-1',
      name: 'د. طارق المنشاوي',
      nameEn: 'Dr. Tarek El-Menshawy',
      title: 'كبير باحثي الذكاء الاصطناعي ومستشار Google Cloud',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: 4.95,
      studentsCount: 24500,
      bio: 'خبير ذكاء اصطناعي بخبرة أكثر من 12 عاماً في بناء نماذج التعلم العميق والأنظمة التوليدية.'
    },
    tags: ['Gemini 3', 'Prompt Engineering', 'TypeScript', 'AI Agents', 'Full-Stack'],
    outcomes: [
      'فهم المعمارية الداخلية للنماذج اللغوية الكبيرة LLMs',
      'احتراف التعامل مع مكتبة @google/genai واستدعاء Gemini 3 Flash & Pro',
      'بناء وكلاء أذكياء (AI Agents) قادرين على استخدام الأدوات والبحث',
      'تنفيذ استراتيجيات هندسة التلقين المتقدمة وتضمين المتجهات Vector Embeddings'
    ],
    requirements: [
      'معرفة أساسية بأساسيات البرمجة (JavaScript أو Python)',
      'جهاز حاسوب متصل بالإنترنت ومتصفح حديث'
    ],
    sections: [
      {
        id: 'sec-1',
        title: 'الوحدة الأولى: مدخل إلى ثورة الذكاء الاصطناعي التوليدي',
        lessons: [
          {
            id: 'ai-l1',
            title: 'مقدمة الدورة ونظرة عامة على معمارية النماذج اللغوية',
            titleEn: 'Course Introduction & LLM Architecture',
            durationMinutes: 12,
            videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
            videoType: 'youtube',
            description: 'في هذا الدرس التمهيدي، سنتعرف على خارطة طريق الدورة وكيفية عمل شبكات Transformer والنماذج اللغوية الحديثة.',
            codeSnippet: {
              language: 'typescript',
              code: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

const response = await ai.models.generateContent({
  model: 'gemini-3.7-flash',
  contents: 'اشرح لي مفهوم التوليد الآلي في سطرين'
});
console.log(response.text);`,
              explanation: 'الكود يوضح الطريقة القياسية لتهيئة عميل Gemini واستدعاء نموذج Flash الحديث.'
            },
            quiz: {
              id: 'q-ai-1',
              title: 'اختبار فهم أساسيات النماذج اللغوية',
              passingScore: 70,
              questions: [
                {
                  id: 1,
                  question: 'ما هي التقنية المعمارية الأساسية التي تقف وراء النماذج اللغوية الكبيرة (LLMs) الحديثة؟',
                  options: ['آلية الانتباه في معمارية المحولات (Transformer Attention)', 'أشجار القرار البسيطة', 'الشبكات التلافيفية فقط بدون انتباه', 'قواعد البيانات العلائقية'],
                  correctIndex: 0,
                  explanation: 'معمارية Transformer مع آلية Self-Attention أحدثت الثورة الكبرى في معالجة وفهم اللغات الطبيعية.'
                }
              ]
            }
          }
        ]
      }
    ],
    finalExam: {
      id: 'exam-ai-final',
      title: 'الاختبار النهائي الشامل لشهادة مهندس نماذج الذكاء الاصطناعي و Gemini',
      durationMinutes: 30,
      passingScore: 75,
      questions: [
        {
          id: 1,
          question: 'ما هو الدور الرئيسي لتقنية استدعاء الدوال (Function Calling) في النماذج التوليدية؟',
          options: [
            'تمكين النموذج اللغوي من التواصل مع خوادم خارجية وقواعد بيانات واستدعاء دوال برمجية محددة بدقة مع معلمات مهيكلة',
            'تسريع سرعة الإنترنت لدى المستخدم',
            'ترجمة الفيديو تلقائياً بدون صوت',
            'إيقاف النموذج عن التفكير تماماً'
          ],
          correctIndex: 0,
          explanation: 'Function Calling يربط ذكاء النموذج اللغوي بالعالم الحقيقي وأدوات التنفيذ البرمجية وقواعد البيانات.'
        },
        {
          id: 2,
          question: 'ما هي الفائدة من تفعيل الـ Structured Outputs بصيغة JSON Schema في Gemini؟',
          options: [
            'ضمان إرجاع البيانات في شكل كائن JSON صالح يطابق المخطط النمطي المحدد مسبقاً بنسبة 100%',
            'تقليل حجم الخط على الشاشة',
            'تحويل النص إلى صورة ملونة',
            'إلغاء الحاجة لمفتاح API'
          ],
          correctIndex: 0,
          explanation: 'المخرجات المهيكلة تمنع أخطاء Parsing وتضمن تكامل البيانات مباشرة مع تطبيقات الـ Backend.'
        }
      ]
    }
  },

  // 5. Modern Fullstack Web
  {
    id: 'web-react-fullstack',
    title: 'دورة تطوير الويب المتكامل الشاملة مع React 19 & TypeScript',
    titleEn: 'Modern Full-Stack Web Development with React, TypeScript & Node',
    subtitle: 'من الصفر إلى الاحتراف: بناء تطبيقات ويب متجاوبة، سريعة، وقابلة للتوسع',
    category: 'web',
    categoryNameAr: 'تطوير الويب',
    level: 'جميع المستويات',
    price: 0,
    originalPrice: 150,
    rating: 4.88,
    reviewsCount: 2310,
    studentsCount: 14200,
    durationHours: 32,
    lessonsCount: 22,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    badge: 'الأكثر شعبية',
    isFeatured: true,
    isPopular: true,
    isFree: true,
    updatedAt: '2026-08-20',
    instructor: {
      id: 'inst-2',
      name: 'م. أحمد الشناوي',
      nameEn: 'Eng. Ahmed El-Shennawy',
      title: 'مهندس برمجيات أول في شركة تقنية عالمية',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 4.88,
      studentsCount: 38000,
      bio: 'مطور Full-Stack شغوف بتبسيط مفاهيم البرمجة المتقدمة وبناء مشاريع حقيقية عملية.'
    },
    tags: ['React 19', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vite'],
    outcomes: [
      'إتقان React 19 والـ Hooks الحديثة وإدارة الحالة بكفاءة',
      'بناء واجهات متجاوبة مذهلة وسريعة باستخدام Tailwind CSS',
      'كتابة كود TypeScript آمن ومنظم خالٍ من الأخطاء النمطية',
      'إنشاء خوادم RESTful وربط الواجهات الأمامية بقواعد البيانات'
    ],
    requirements: [
      'فهم مبدئي لـ HTML و CSS و JavaScript الأساسي'
    ],
    sections: [
      {
        id: 'sec-w1',
        title: 'الوحدة الأولى: البداية القوية مع React 19 و TypeScript',
        lessons: [
          {
            id: 'web-l1',
            title: 'مكونات React الحديثة والـ Props والـ State',
            titleEn: 'Modern React Components, Props & State',
            durationMinutes: 15,
            videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
            videoType: 'youtube',
            description: 'فهم دورة حياة المكونات، وكيفية تقسيم الواجهة إلى مكونات صغيرة يعاد استخدامها.',
            codeSnippet: {
              language: 'tsx',
              code: `interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
}

export function ActionButton({ label, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={variant === 'primary' ? 'bg-emerald-600 text-white px-4 py-2 rounded-lg' : 'bg-gray-100 text-gray-800 px-4 py-2 rounded-lg'}
    >
      {label}
    </button>
  );
}`,
              explanation: 'مكون React مكتوب بـ TypeScript مع دعم الخصائص الاختيارية والأنماط التفاعلية.'
            },
            quiz: {
              id: 'q-web-1',
              title: 'اختبار مفاهيم مكونات React',
              passingScore: 75,
              questions: [
                {
                  id: 1,
                  question: 'ما فائدة استخدام TypeScript مع React؟',
                  options: ['اكتشاف أخطاء الأنواع أثناء كتابة الكود وتوفير الإكمال التلقائي الذكي', 'تسريع تحميل الصور على الموقع', 'إلغاء الحاجة لـ CSS', 'جعل الكود يعمل بدون متصفح'],
                  correctIndex: 0,
                  explanation: 'TypeScript يضمن سلامة البيانات والأنماط مما يمنع الأخطاء الشائعة أثناء التشغيل.'
                }
              ]
            }
          }
        ]
      }
    ],
    finalExam: {
      id: 'exam-web-final',
      title: 'الاختبار النهائي الشامل لشهادة مطور Full-Stack Web المعتمد',
      durationMinutes: 30,
      passingScore: 75,
      questions: [
        {
          id: 1,
          question: 'ما هو الغرض الأساسي من خطاف useEffect في React؟',
          options: [
            'التعامل مع الآثار الجانبية (Side Effects) مثل جلب البيانات من الخادم والاشتراكات والمؤقتات',
            'رسم الصور المتحركة في الـ Canvas فقط',
            'إلغاء الحاجة لكتابة كود HTML',
            'تغيير لغة المتصفح'
          ],
          correctIndex: 0,
          explanation: 'useEffect يسمح بتنفيذ الأكواد التي تتفاعل مع أنظمة خارج React مثل الشبكة و DOM.'
        }
      ]
    }
  },

  // 6. Ancient/Classical: Fortran Scientific Computing
  {
    id: 'fortran-scientific',
    title: 'الحوسبة العلمية الرياضية والمحاكاة الفيزيائية بلغة FORTRAN',
    titleEn: 'Scientific Computing & Numerical Analysis with Modern FORTRAN',
    subtitle: 'تعلم لغة المحاكاة الفيزيائية، الأرصاد الجوية، والديناميكا الهوائية فائقة الأداء',
    category: 'legacy-programming',
    categoryNameAr: 'لغات البرمجة القديمة والعتيدة',
    level: 'متوسط',
    price: 29,
    originalPrice: 75,
    rating: 4.91,
    reviewsCount: 390,
    studentsCount: 2300,
    durationHours: 18,
    lessonsCount: 12,
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    badge: 'حوسبة فيزيائية',
    isFeatured: false,
    isPopular: false,
    updatedAt: '2026-08-14',
    instructor: {
      id: 'inst-fortran',
      name: 'أ.د. ماجد عبد الرزاق',
      nameEn: 'Prof. Maged Abdelrazek',
      title: 'أستاذ الفيزياء الحاسوبية ونمذجة السوائل الرياضية',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      rating: 4.92,
      studentsCount: 8900,
      bio: 'خبير في الحواسيب الفائقة Supercomputers ومكتبات الجبر الخطي BLAS و LAPACK بلغة Fortran.'
    },
    tags: ['FORTRAN 90/2023', 'Scientific Computing', 'Linear Algebra', 'Physics Simulation', 'HPC'],
    outcomes: [
      'فهم قوة مصفوفات Arrays متعددة الأبعاد والعمليات المتجهية المتوازية في Fortran',
      'تطبيق خوارزميات التحليل العددي وحل المعادلات التفاضلية والمعادلات المصفوفية',
      'ربط كود Fortran بلغات حديثة مثل Python و C عبر C-Bindings',
      'استخدام تقنيات الحوسبة الفائقة OpenMP و MPI لتوزيع الحسابات على آلاف الأنوية'
    ],
    requirements: [
      'معرفة أساسية بمفاهيم الجبر الخطي والتفاضل والتكامل'
    ],
    sections: [
      {
        id: 'sec-f1',
        title: 'الوحدة الأولى: البناء النمطي ومصفوفات FORTRAN الرياضية',
        lessons: [
          {
            id: 'fort-l1',
            title: 'المصفوفات والعمليات المتجهية التلقائية في Modern FORTRAN',
            titleEn: 'Array Operations & Vectorized Math in Fortran',
            durationMinutes: 16,
            videoUrl: 'https://www.youtube.com/embed/zL5fB0lK7bQ',
            videoType: 'youtube',
            description: 'كيف تنفذ فورتران العمليات الرياضية على ملايين الأرقام بأعلى سرعة ممكنة لمعالجات الحاسوب.',
            codeSnippet: {
              language: 'fortran',
              code: `program vector_addition
    implicit none
    real, dimension(5) :: a = [1.0, 2.0, 3.0, 4.0, 5.0]
    real, dimension(5) :: b = [10.0, 20.0, 30.0, 40.0, 50.0]
    real, dimension(5) :: c

    ! جمع المصفوفات بضربة واحدة بدون Loops يدوية
    c = a + b
    print *, "النتيجة: ", c
end program vector_addition`,
              explanation: 'عمليات المصفوفات الأصلية في Fortran تسمح بالجمع المتجهي المباشر فائق السرعة.'
            }
          }
        ]
      }
    ],
    finalExam: {
      id: 'exam-fortran-final',
      title: 'الاختبار النهائي الشامل لشهادة الحوسبة العلمية الرياضية بلغة FORTRAN',
      durationMinutes: 25,
      passingScore: 75,
      questions: [
        {
          id: 1,
          question: 'ما فائدة استخدام implicit none في بداية أي برنامج أو وحدة بلغة Fortran؟',
          options: [
            'إلغاء التعيين التلقائي القديم لأنواع المتغيرات وإلزام المبرمج بتعريف نوع كل متغير صراحة لمنع الأخطاء',
            'تسريع وقت الترجمة بمقدار 50%',
            'إخفاء المخرجات من الشاشة',
            'إلغاء المصفوفات'
          ],
          correctIndex: 0,
          explanation: 'implicit none تحمي الكود من الأخطاء الإملائية وتمنع إسناد أنواع افتراضية غير مقصودة للمتغيرات.'
        }
      ]
    }
  }
];

export const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: 'disc-pinned-1',
    category: 'announcements',
    categoryNameAr: 'إعلانات وإرشادات المنصة',
    userName: 'د. فاروق السعيد (مدير الأكاديمية)',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    userRole: 'admin',
    title: '📌 ميثاق مجتمع منصة تَعَلَّمْ: قواعد النقاش، الإشراف، والتواصل الإيجابي',
    content: 'أهلاً بجميع الطلاب والمعلمين! تهدف منصة تَعَلَّمْ لتوفير بيئة تعليمية راقية ومتخصصة في لغات البرمجة الكلاسيكية والحديثة. نرجو من الجميع الالتزام بآداب الحوار، تنسيق الأكواد باستخدام وسوم الشفرة البرمجية، ومساعدة الزملاء. المشرفون والمعلمون يقومون بمراجعة المنشورات باستمرار لضمان بيئة تعليمية إيجابية.',
    tags: ['إرشادات', 'المجتمع', 'إشراف', 'ترحيب'],
    date: 'مثبت في الأعلى',
    upvotes: 48,
    isPinned: true,
    isLocked: false,
    replies: [
      {
        id: 'rep-ann-1',
        userName: 'م. أحمد الشناوي',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        userRole: 'instructor',
        content: 'مرحباً بجميع رواد المنصة! فريق المعلمين متواجد يومياً للرد على استفساراتكم البرمجية واعتماد الإجابات النموذجية.',
        date: 'منذ يومين',
        isInstructor: true
      }
    ]
  },
  {
    id: 'disc-cobol-1',
    category: 'legacy-lang',
    categoryNameAr: 'لغات البرمجة القديمة والعتيدة',
    courseId: 'cobol-legacy-systems',
    userName: 'سامح الطوخي',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    userRole: 'student',
    title: 'كيف تتعامل البنوك مع تحديث أنظمة COBOL دون إيقاف العمليات الحية (Zero Downtime)؟',
    content: 'كنت أتساءل: إذا كان هناك تعديل في حسابات الفائدة أو الضرائب في نظام بنكي مبني بـ COBOL على IBM z/OS، كيف يتم تطبيق التحديث بأمان تام دون المساس بمليارات السجلات؟',
    codeSnippet: {
      language: 'cobol',
      code: `       COMPUTE WS-INTEREST-AMOUNT ROUNDED = 
           WS-PRINCIPAL-BALANCE * (WS-ANNUAL-RATE / 365) * WS-DAYS-COUNT.`
    },
    tags: ['COBOL', 'Banking', 'Mainframe', 'Architecture'],
    date: 'منذ يومين',
    upvotes: 19,
    isPinned: false,
    isLocked: false,
    acceptedReplyId: 'rep-cob-sol-1',
    replies: [
      {
        id: 'rep-cob-sol-1',
        userName: 'د. فاروق السعيد',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
        userRole: 'instructor',
        content: 'سؤال جوهري وممتاز جداً! البنوك تستخدم تقنية الـ Parallel Sysplex والـ Shadow Execution. يتم تشغيل الكود الجديد في بيئة موازية وقراءة المعاملات وتدقيق النتائج الرياضية بالمقارنة مع الكود القديم لعدة أسابيع قبل التحويل النهائي، مع وجود خطة تراجع (Rollback) آنية.',
        date: 'منذ يوم',
        isInstructor: true,
        isAcceptedSolution: true,
        upvotes: 24
      }
    ]
  },
  {
    id: 'disc-rust-1',
    category: 'modern-lang',
    categoryNameAr: 'لغات البرمجة والتقنيات الحديثة',
    courseId: 'rust-systems-concurrency',
    userName: 'إسراء المهدي',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    userRole: 'student',
    title: 'الفرق في الأداء بين Mutex و RwLock في لغة Rust عند التعامل مع القراءة المكثفة',
    content: 'لدينا خدمة خادم بها آلاف عمليات القراءة في الثانية وتعديلات نادرة جداً على البيانات المشتركة. هل استخدام RwLock يقدم فرقاً ملحوظاً مقارنة بـ Mutex العادي؟',
    codeSnippet: {
      language: 'rust',
      code: `use std::sync::RwLock;

struct SharedCache {
    data: RwLock<Vec<String>>,
}`
    },
    tags: ['Rust', 'Concurrency', 'Threads', 'Performance'],
    date: 'منذ 3 أيام',
    upvotes: 14,
    replies: [
      {
        id: 'rep-rust-1',
        userName: 'م. زياد كمال',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        userRole: 'instructor',
        content: 'نعم بالتأكيد! الـ RwLock يسمح لعدد غير محدود من الخيوط (Threads) بالقراءة بالتوازي في نفس اللحظة (Shared Readers)، ويحجز القفل الحصري فقط عند الكتابة (Exclusive Writer)، مما يرفع الأداء بأضعاف في سيناريوهات القراءة المكثفة (Read-Heavy).',
        date: 'منذ يومين',
        isInstructor: true,
        isAcceptedSolution: true,
        upvotes: 18
      }
    ]
  },
  {
    id: 'disc-ai-1',
    category: 'ai-gen',
    categoryNameAr: 'الذكاء الاصطناعي وهندسة الأوامر',
    courseId: 'ai-masterclass',
    userName: 'محمود سامي',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    userRole: 'student',
    title: 'أفضل طريقة لربط نماذج Gemini 3 بأدوات مخصصة Function Calling في بيئة الإنتاج',
    content: 'كيف يمكن التأكد من حماية استدعاء الدوال من حقن الأوامر التلقينية (Prompt Injection) عندما يطلب النموذج استدعاء قاعدة بيانات؟',
    tags: ['Gemini 3', 'Function Calling', 'Security', 'LLM'],
    date: 'منذ 4 أيام',
    upvotes: 11,
    replies: [
      {
        id: 'rep-ai-1',
        userName: 'د. طارق المنشاوي',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        userRole: 'instructor',
        content: 'القاعدة الذهبية: لا تثق أبداً في معلمات الدالة المولدة بشكل أعمى! يجب إجراء التحقق من النوع والحدود (Schema Validation) على جانب الخادم، واستخدام Prepared Statements في SQL لمنع أي حقن أو تلاعب بالبيانات.',
        date: 'منذ 3 أيام',
        isInstructor: true,
        isAcceptedSolution: true
      }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-cobol-1',
    courseId: 'cobol-legacy-systems',
    userName: 'عبدالله إبراهيم',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: 'أمس',
    comment: 'دورة نادرة واستثنائية في الوطن العربي. تعلمت من د. فاروق كيف تعمل الأنظمة البنكية الحقيقية وحصلت على فرصة عمل في قطاع التقنية المالية بفضل هذا الشرح العميق.'
  },
  {
    id: 'rev-rust-1',
    courseId: 'rust-systems-concurrency',
    userName: 'نورهان عادل',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: 'منذ يومين',
    comment: 'شرح لغة Rust هنا هو الأفضل دون منازع. مفاهيم الـ Ownership و Lifetimes التي كانت معقدة أصبحت بديهية وواضحة جداً.'
  }
];

export const INITIAL_MESSAGES: StudentMessage[] = [
  {
    id: 'msg-inst-1',
    senderId: 'inst-cobol',
    senderName: 'د. فاروق السعيد',
    senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    senderRole: 'instructor',
    recipientType: 'individual',
    recipientId: 'usr-google-1',
    recipientName: 'محمد ماجد',
    courseId: 'cobol-legacy-systems',
    courseTitle: 'إتقان لغة COBOL والأنظمة المصرفية العتيدة',
    subject: 'ملاحظات إرشادية حول تدريب معالجة الملفات المفهرسة (Indexed Files)',
    content: 'أهلاً بك يا محمد! اطلعت على أدائك المميز في اختبار الوحدة الأولى بلغة COBOL. أود تزويدك بملف PDF التوضيحي المرفق حول كيفية حجز سجلات الـ PIC Clause بدقة، وفيديو شرح إضافي يوضح آلية معالجة الحسابات المصرفية في بيئة IBM z/OS. لا تتردد في طرح أي استفسار!',
    date: 'اليوم، 10:30 ص',
    isRead: false,
    isImportant: true,
    attachments: [
      {
        id: 'att-pdf-1',
        title: 'دليل هيكلة سجلات البيانات و PIC Clauses في COBOL.pdf',
        type: 'pdf',
        size: '2.4 MB',
        pageCount: 14,
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
        description: 'شرح تفصيلي مع أمثلة برمجية لكيفية تمثيل البيانات المالية والمحاسبية.'
      },
      {
        id: 'att-vid-1',
        title: 'شرح فيديو عملي: محاكاة معالجة المعاملات المالية المجمعة Batch Processing',
        type: 'video',
        size: '12 دقيقة',
        url: 'https://www.youtube.com/embed/aircAruvnKk',
        description: 'تسجيل مسجل لتطبيق عملي على نظام حقيقي.'
      }
    ],
    replies: [
      {
        id: 'rep-m-1',
        senderId: 'usr-google-1',
        senderName: 'محمد ماجد',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        senderRole: 'student',
        content: 'شكراً جزيلاً دكتور فاروق! قمت بفتح ملف الـ PDF والشرح واضح جداً، وسأقوم بتطبيق المثال في محرر المنصة فوراً.',
        date: 'اليوم، 11:15 ص'
      }
    ]
  },
  {
    id: 'msg-inst-2',
    senderId: 'inst-rust',
    senderName: 'م. سارة المهدي',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    senderRole: 'instructor',
    recipientType: 'course_broadcast',
    courseId: 'rust-systems-concurrency',
    courseTitle: 'برمجة النظم المتوازية فائقة السرعة بلغة Rust الحديثة',
    subject: '📢 إعلان هام لجميع طلاب دورة Rust: إضافة ملخص مرئي وقواعد الذاكرة الآمنة',
    content: 'مرحباً بجميع مهندسي وطلاب مسار Rust! تم تحديث محتوى الدورة بإضافة مستند PDF شامل يوضح خريطة قواعد الملكية (Ownership) والاقتراض (Borrowing) والتزامن الآمن (Fearless Concurrency) بدون سباقات بيانات. تجدون الملف مرفقاً في هذه الرسالة وفي مكتبة موارد الدورة.',
    date: 'أمس، 04:15 م',
    isRead: false,
    isImportant: true,
    attachments: [
      {
        id: 'att-pdf-2',
        title: 'خريطة قواعد الذاكرة والتزامن الآمن في Rust (CheatSheet & Guide).pdf',
        type: 'pdf',
        size: '3.8 MB',
        pageCount: 18,
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
        description: 'مخطط رسومي يوضح دورات حياة المتغيرات والتعامل مع خيوط المعالجة المتعددة.'
      }
    ],
    replies: []
  },
  {
    id: 'msg-inst-3',
    senderId: 'inst-ai',
    senderName: 'د. طارق المنشاوي',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    senderRole: 'instructor',
    recipientType: 'all_students',
    subject: '🌟 إعلان عام: ورشة عمل تطبيقية حول هندسة الأوامر ونماذج Gemini 3 المتقدمة',
    content: 'أعزائي طلاب منصة تَعَلَّمْ، يسرنا دعوتكم لحضور الجلسة التفاعلية المباشرة حول ربط نماذج الذكاء الاصطناعي متعددة الوسائط بالأنظمة البرمجية. أرفق لكم ملف PDF يتضمن أجندة الورشة والمشاريع التطبيقية المقترحة.',
    date: 'منذ 3 أيام',
    isRead: true,
    attachments: [
      {
        id: 'att-pdf-3',
        title: 'أجندة مشاريع الذكاء الاصطناعي وهندسة الأوامر 2026.pdf',
        type: 'pdf',
        size: '1.9 MB',
        pageCount: 8,
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
        description: 'دليل متطلبات المشروعات النهائية المؤهلة للحصول على الشهادات المعتمدة.'
      }
    ],
    replies: []
  }
];

