# 🚀 البداية السريعة | Quick Start

## للمستخدمين الجدد | For New Users

### التثبيت والتشغيل في 3 خطوات:

```bash
# 1. تثبيت التبعيات
npm install

# 2. بناء المشروع
npm run build

# 3. تشغيل التطبيق (اختر واحد)
npm run dev          # للتطوير (http://localhost:5173)
npm run preview      # للمعاينة (http://localhost:8788)
```

## للمطورين | For Developers

### أوامر التطوير السريعة:

```bash
npm run dev:local      # تطوير محلي عادي
npm run dev            # تطوير مع إتاحة خارجية
npm run build          # بناء للإنتاج
npm run preview:local  # معاينة محلية
npm run start          # بناء + معاينة في خطوة واحدة
```

### أوامر التنظيف:
```bash
npm run clean          # تنظيف ملفات البناء
npm run clean-all      # تنظيف شامل + إعادة تثبيت
npm run setup          # إعداد كامل من الصفر
```

### اختبار التطبيق:
```bash
npm run test           # اختبار الرابط المتاح
npm run test:dev       # اختبار رابط التطوير
npm run test:preview   # اختبار رابط المعاينة
```

## الروابط المتوقعة | Expected URLs
- **التطوير**: http://localhost:5173
- **المعاينة**: http://localhost:8788  
- **الاختبار**: يفحص الروابط تلقائياً

## استكشاف المشاكل | Troubleshooting
```bash
# إعادة التثبيت الكاملة
npm run clean-all
npm install
npm run setup

# إذا كان المنفذ مشغولاً
npm run clean-port
killall node
```

---
**💡 نصيحة**: استخدم `npm run dev` للتطوير السريع مع Hot Reload