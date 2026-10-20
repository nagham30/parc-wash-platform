# المرحلة الثانية — إدارة مستخدمين حقيقية

هذه النسخة تستبدل الحسابات التجريبية ببيانات Supabase الحقيقية. **لا يكفي تشغيل npm وحده**؛ يجب تفعيل جزأين في Supabase:

1. افتح Supabase > SQL Editor ونفّذ `supabase/sql/02_admin_users.sql` مرة واحدة. هذا يتيح للمدير فقط عرض المستخدمين الحقيقيين.
2. انشر Edge Function الموجودة في `supabase/functions/manage-users/index.ts` باسم `manage-users`. أسهل طريقة باستخدام Supabase CLI بعد تسجيل الدخول وربط المشروع:

```bash
npx supabase login
npx supabase link --project-ref pzyerfbqgumphothdymp
npx supabase functions deploy manage-users
```

يجب ترك JWT verification مفعّلًا لوظيفة Edge Function (الإعداد الافتراضي)، وتحتاج الوظيفة متغيرات البيئة الافتراضية SUPABASE_URL وSUPABASE_ANON_KEY وSUPABASE_SERVICE_ROLE_KEY الموجودة في بيئة Supabase. **لا تنسخ SERVICE_ROLE_KEY إلى .env.local أو ملفات React**.

3. في مجلد المشروع على جهازك احتفظ بملف `.env.local` الذي يحتوي VITE_SUPABASE_URL وVITE_SUPABASE_PUBLISHABLE_KEY، ثم `npm install` و`npm run dev`.
4. ادخل بحساب المدير ثم صفحة «المستخدمون». جرّب عرض القائمة ثم إرسال دعوة إلى بريد تجريبي تملكه. لا تُرسل دعوات لموظفين حقيقيين قبل التأكد من إعداد قالب رسالة الدعوة ورابط العودة في Supabase Auth > URL Configuration.

ملاحظات: المراسلات والموافقات وربط محتوى الأنشطة وقاعدة بياناتها **لم تُفعّل بعد**. الوظيفة تمنع تعديل المدير لحسابه من هذه الشاشة وتتحقق من الدور على السيرفر. قد يظل مستخدم معطّل يملك جلسة مفتوحة حتى انتهاء صلاحية التوكن؛ للاستخدام الإنتاجي يجب مراجعة سياسات الوصول وإبطال الجلسات عند الحاجة.
