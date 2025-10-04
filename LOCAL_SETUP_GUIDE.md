# دليل التشغيل المحلي | Local Setup Guide

## تحميل واستعادة المشروع | Download and Restore

### 1. تحميل النسخة الاحتياطية
```bash
# تحميل الملف
wget https://page.gensparksite.com/project_backups/real_estate_feasibility_pro_clean_local.tar.gz

# استخراج الملفات
tar -xzf real_estate_feasibility_pro_clean_local.tar.gz

# الدخول إلى مجلد المشروع
cd home/user/webapp
```

### 2. المتطلبات الأساسية | Prerequisites
- **Node.js** (النسخة 18 أو أحدث)
- **npm** (يأتي مع Node.js)
- **Git** (اختياري للتطوير)

### 3. تثبيت التبعيات | Install Dependencies
```bash
npm install
```

### 4. تشغيل المشروع محلياً | Run Locally

#### الطريقة الأولى: Vite Dev Server (للتطوير)
```bash
npm run dev
```
- سيعمل على: http://localhost:5173
- يدعم Hot Reload للتطوير السريع

#### الطريقة الثانية: Wrangler Pages (محاكاة الإنتاج)
```bash
# بناء المشروع أولاً
npm run build

# تشغيل محاكي Cloudflare Pages
npm run preview
```
- سيعمل على: http://localhost:8788
- محاكاة دقيقة لبيئة Cloudflare Pages

### 5. البرمجة النصية السريعة | Scripts
```bash
npm run build          # بناء المشروع للإنتاج
npm run dev            # تشغيل خادم التطوير
npm run preview        # معاينة النسخة المبنية
npm test              # اختبار سريع للتطبيق
```

### 6. هيكل المشروع | Project Structure
```
webapp/
├── src/
│   └── index.jsx          # التطبيق الرئيسي
├── public/               # الملفات الثابتة
├── dist/                 # ملفات البناء (تُنشأ تلقائياً)
├── package.json          # إعدادات المشروع
├── wrangler.jsonc        # إعدادات Cloudflare
├── vite.config.ts        # إعدادات Vite
└── README.md            # وثائق المشروع
```

### 7. الميزات المتاحة | Available Features
- ✅ **واجهة ثنائية اللغة** (عربي/إنجليزي)
- ✅ **حسابات دراسة الجدوى** الشاملة
- ✅ **رسوم بيانية تفاعلية**
- ✅ **تصدير تقارير PDF**
- ✅ **تصميم متجاوب**

### 8. استكشاف الأخطاء | Troubleshooting

#### مشكلة المنافذ
```bash
# إذا كان المنفذ مشغولاً
killall node
# أو
lsof -ti:5173 | xargs kill -9
```

#### إعادة تثبيت التبعيات
```bash
rm -rf node_modules package-lock.json
npm install
```

#### مشاكل البناء
```bash
rm -rf dist
npm run build
```

### 9. التطوير والتخصيص | Development & Customization

#### تحرير التصميم
- الألوان والخطوط: `src/index.jsx` (في قسم styles)
- النصوص: ابحث عن `translations` object في الكود
- المكونات: موجودة في `src/index.jsx`

#### إضافة ميزات جديدة
- إضافة API endpoints جديدة في `src/index.jsx`
- إضافة مكونات UI جديدة
- تحديث النظام المالي للحسابات

### 10. النشر | Deployment

#### Cloudflare Pages (موصى به)
```bash
npm run build
npx wrangler pages deploy dist --project-name your-project-name
```

#### Vercel
```bash
npm run build
npx vercel --prod
```

#### Netlify
```bash
npm run build
# ثم ارفع مجلد dist
```

---

## ملاحظات مهمة | Important Notes

1. **الملفات المتضمنة**: هذه النسخة الاحتياطية تحتوي على جميع الملفات اللازمة
2. **لا تحتاج إنترنت للتشغيل المحلي**: جميع التبعيات محفوظة
3. **Git Repository**: مشمول - يمكنك دفع التغييرات مباشرة
4. **إصدار نظيف**: تم تنظيف الملفات المؤقتة والسجلات

## الدعم | Support
- راجع `README.md` للتفاصيل الفنية الكاملة
- راجع ملفات `.md` الأخرى للتوثيق المتقدم

**التاريخ**: أكتوبر 2025  
**الإصدار**: v3.21.5 I18N Guards v2