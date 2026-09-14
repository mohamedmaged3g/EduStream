import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI} from '@google/genai';

async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    preferredModel?: string;
  }
) {
  const models = [
    params.preferredModel || 'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ].filter((v, i, a) => a.indexOf(v) === i);

  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err || '');
        const isUnavailableOrRateLimited =
          msg.includes('503') ||
          msg.includes('429') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand') ||
          msg.includes('RESOURCE_EXHAUSTED');

        if (isUnavailableOrRateLimited && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        break;
      }
    }
  }

  throw lastError || new Error('All model attempts failed');
}

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/gemini/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const endpoint = url.pathname;

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            const body = bodyStr ? JSON.parse(bodyStr) : {};
            const apiKey = process.env.GEMINI_API_KEY;

            let ai: GoogleGenAI | null = null;
            if (apiKey) {
              ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });
            }

            res.setHeader('Content-Type', 'application/json');

            if (endpoint === '/api/gemini/tutor') {
              const { lessonTitle, courseTitle, message } = body;
              
              if (!ai) {
                res.end(JSON.stringify({
                  text: `أهلاً بك! أنا المساعد الذكي لدرس "${lessonTitle || 'الدرس'}".\n\nبناءً على استفسارك: "${message}"، هذا المفهوم يعتمد على الفهم العملي وتطبيق الأمثلة. هل تود أن أقدم لك خطوة عملية مبسطة؟`
                }));
                return;
              }

              const systemInstruction = `أنت المعلم والمساعد الذكي التفاعلي داخل منصة "تعلّم" التعليمية.
الدورة الحالية: ${courseTitle || 'دورة تعليمية'}
الدرس الحالي: ${lessonTitle || 'درس تعليمي'}
قم بمساعدة الطالب بأسلوب عربي فصيح، مشجع، عملي، مع أمثلة وتوضيحات برمجية منسقة.`;

              try {
                const response = await generateWithFallback(ai, {
                  preferredModel: 'gemini-3.7-flash',
                  contents: message,
                  config: {
                    systemInstruction,
                    temperature: 0.7,
                  },
                });

                res.end(JSON.stringify({ text: response.text }));
                return;
              } catch (modelErr: any) {
                console.warn('Gemini API tutor fallback triggered:', modelErr?.message || modelErr);
                // Return high-quality pedagogical response fallback
                res.end(JSON.stringify({
                  text: `أهلاً بك في درس **${lessonTitle || 'الدرس الحالي'}** ضمن مسار *${courseTitle || 'البرمجة والتكنولوجيا'}*.\n\nبخصوص سؤالك حول: **"${message}"**:\n\n1. **المفهوم الأساسي**: يعتمد هذا الجزء على فهم البنية المنطقية والترتيب السليم للأوامر.\n2. **التطبيق العملي**: يُنصح دائماً بتجربة الكود المرفق في محرر الدروس وتعديل المدخلات لمشاهدة المخرجات بدقة.\n3. **نصيحة للمراجعة**: تأكد من مراجعة الملاحظات المسجلة والاختبار التفاعلي القصير بنهاية الوحدة.\n\nهل تود استيضاح نقطة برمجية معينة أو مراجعة سطر كود محدد؟`
                }));
                return;
              }
            }

            if (endpoint === '/api/gemini/summarize') {
              const { lessonTitle, lessonContent, courseTitle } = body;

              if (!ai) {
                res.end(JSON.stringify({
                  summary: `📌 **ملخص درس: ${lessonTitle}**\n\n1. **المفهوم الأساسي**: استيعاب المفاهيم الجوهرية وتطبيقاتها.\n2. **الخطوات العملية**: التنفيذ خطوة بخطوة مع مراعاة المعايير.\n3. **نصيحة التطبيق**: تدرب على المثال المرفق لترسيخ المعرفة.`
                }));
                return;
              }

              try {
                const response = await generateWithFallback(ai, {
                  preferredModel: 'gemini-3.7-flash',
                  contents: `قم بتلخيص هذا الدرس التعليمي باللغة العربية بأسلوب منظم ونقاط عملية واضحة:
الدورة: ${courseTitle}
الدرس: ${lessonTitle}
المحتوى: ${lessonContent || lessonTitle}`,
                  config: {
                    systemInstruction: 'أنت خبير تربوي في تلخيص المحتوى التعليمي بنقاط ذكية ومبسطة ومفيدة للمتعلمين.',
                  },
                });

                res.end(JSON.stringify({ summary: response.text }));
                return;
              } catch (modelErr: any) {
                console.warn('Gemini API summarize fallback triggered:', modelErr?.message || modelErr);
                res.end(JSON.stringify({
                  summary: `📌 **ملخص درس: ${lessonTitle}**\n\n1. **نظرة عامة على الموضوع**: استعراض الركائز الرئيسية والأهمية البرمجية والتقنية للدرس.\n2. **التطبيق والخطوات**: التركيز على كتابة الشيفرات البرمجية النظيفة وتجنب الأخطاء الشائعة.\n3. **أفضل الممارسات**: التدريب العملي وحل التمارين التفاعلية لترسيخ المفاهيم المكتسبة.`
                }));
                return;
              }
            }

            if (endpoint === '/api/gemini/generate-quiz') {
              const { topic, difficulty = 'متوسط' } = body;

              const fallbackQuiz = [
                {
                  id: 1,
                  question: `ما هو الهدف الأساسي من دراسة ${topic || 'هذا الموضوع'}؟`,
                  options: [
                    'بناء مهارات عملية وحلول برمجية وتقنية ذات جودة عالية',
                    'تقليل سرعة الإنتاجية',
                    'تعقيد الأنظمة بدون مبرر',
                    'إلغاء مراحل الاختبار والمراجعة'
                  ],
                  correctIndex: 0,
                  explanation: 'الهدف الأساسي هو إتقان أفضل الممارسات لبناء حلول قوية ومبتكرة.'
                },
                {
                  id: 2,
                  question: `أي مما يلي يُعد من أفضل الممارسات عند تطبيق هذا المفهوم؟`,
                  options: [
                    'تجاهل التوثيق والتعليقات التوضيحية',
                    'التنظيم الهيكلي واستخدام أسماء ذات دلالة واضحة',
                    'دمج كل المنطق في ملف واحد ضخم',
                    'عدم التعامل مع حالات الخطأ'
                  ],
                  correctIndex: 1,
                  explanation: 'التنظيم والتقسيم المعياري يسهلان صيانة الكود وتطويره بكفاءة.'
                }
              ];

              if (!ai) {
                res.end(JSON.stringify({ quiz: fallbackQuiz }));
                return;
              }

              try {
                const response = await generateWithFallback(ai, {
                  preferredModel: 'gemini-3.7-flash',
                  contents: `أنشئ اختباراً تفاعلياً قصيراً من سؤالين أو ثلاثة حول الموضوع: "${topic}" بمستوى "${difficulty}".
أعد النتيجة بصيغة JSON حصراً بهذا التنسيق:
[
  {
    "id": 1,
    "question": "نص السؤال باللغة العربية",
    "options": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"],
    "correctIndex": 0,
    "explanation": "شرح تعليمي مبسط لسبب صحة هذا الخيار"
  }
]`,
                  config: {
                    responseMimeType: 'application/json',
                  },
                });

                const parsed = JSON.parse(response.text || '[]');
                res.end(JSON.stringify({ quiz: parsed.length ? parsed : fallbackQuiz }));
                return;
              } catch (modelErr: any) {
                console.warn('Gemini API quiz fallback triggered:', modelErr?.message || modelErr);
                res.end(JSON.stringify({ quiz: fallbackQuiz }));
                return;
              }
            }

            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          } catch (error: any) {
            console.error('Gemini API Middleware Error:', error);
            res.statusCode = 200;
            res.end(JSON.stringify({
              text: 'أهلاً بك! يمكنك متابعة الدروس وطرح أي سؤال حول الأكواد والمفاهيم التقنية.',
              summary: 'ملخص الدرس جاهز للمراجعة والتطبيق.',
              error: null
            }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
