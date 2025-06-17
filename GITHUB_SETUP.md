# 🚀 دليل رفع المشروع على GitHub

## 📋 المتطلبات الأساسية

1. **حساب GitHub** - إذا لم يكن لديك، أنشئ حساباً على [github.com](https://github.com)
2. **Git مثبت على جهازك** - تحميل من [git-scm.com](https://git-scm.com/download)
3. **Terminal أو Command Prompt**

## 🔧 خطوات الإعداد

### 1️⃣ إنشاء المستودع على GitHub

1. ��ذهب إلى [github.com](https://github.com)
2. اضغط على **"New repository"** أو الزر **"+"** ثم **"New repository"**
3. املأ التفاصيل:
   ```
   Repository name: gym-management-system
   Description: نظام إدارة صالة حسام لكمال الأجسام والرشاقة
   Visibility: Public (أو Private حسب رغبتك)
   ```
4. **لا تختر** أي من الخيارات الإضافية (README, .gitignore, license) لأننا أنشأناها بالفعل
5. اضغط **"Create repository"**

### 2️⃣ ربط المشروع المحلي بـ GitHub

افتح Terminal/Command Prompt في مجلد مشروعك ونفذ:

```bash
# تهيئة Git إذا لم ي��ن مُهيأً
git init

# إضافة جميع الملفات للتتبع
git add .

# إنشاء أول commit
git commit -m "Initial commit: نظام إدارة صالة حسام مع قاعدة بيانات IndexedDB"

# تعيين الفرع الرئيسي
git branch -M main

# إضافة المستودع البعيد (استبدل YOUR_USERNAME باسمك على GitHub)
git remote add origin https://github.com/YOUR_USERNAME/gym-management-system.git

# رفع الكود لأول مرة
git push -u origin main
```

### 3️⃣ التحقق من نجاح الرفع

1. انتقل إلى مستودعك على GitHub
2. تأكد من وجود جميع الملفات
3. تحقق من ظهور ملف `README.md` بشكل صحيح

## 🌐 إعداد GitHub Pages للاستضافة المجانية

### الطريقة التلقائية (موصى بها)

1. في مستودع GitHub، اذهب إلى **Settings**
2. انزل إلى قسم **Pages** في القائمة الجانبية
3. في **Source**، اختر **GitHub Actions**
4. سيتم تفعيل النشر التلقائي عبر ملف الـ workflow الذي أنشأناه

### التحقق من حالة النشر

1. اذهب إلى تبويب **Actions** في مستودعك
2. ستجد عملية النشر تعمل تلقائياً عند كل تحديث
3. بعد اكتمال العملية، ستحصل على رابط الموقع

## 📝 تحديث المشروع مستقبلاً

كلما أردت رفع تحديثات جديدة:

```bash
# إضافة التغييرات
git add .

# إنشاء commit مع و��ف التحديث
git commit -m "وصف التحديث الجديد"

# رفع التحديثات
git push
```

## 🔑 إعداد الرمز الشخصي (إذا واجهت مشاكل في المصادقة)

إذا طُلب منك كلمة مرور عند `git push`:

1. اذهب إلى GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. حدد الصلاحيات المطلوبة (repo على الأقل)
5. انسخ الرمز واستخدمه بدلاً من كلمة المرور

## 🌟 مميزات الإعداد الحالي

### ✅ **قاعدة البيانات المتقدمة**

- **IndexedDB** - قاعدة بيانات محلية قوية وسريعة
- **جداول منظمة** لكل نوع من البيانات
- **فهرسة متقدمة** للبحث السريع
- **نسخ احتياطي ومزامنة**

### ✅ **الميزات التقنية**

- **PWA كامل** - يعمل بدون اتصال
- **تشفير آمن** للبيانات الحساسة
- **تحديثات تلقائية** عبر GitHub Actions
- **نسخ احتياطية** قابلة للتصدير والاستيراد

### ✅ **سهولة الاستخدام**

- **واجهة عربية كاملة** مع دعم RTL
- **بحث متقدم** في جميع الصفحات
- **طباعة احترافية** للتقارير والفواتير
- **إشعارات ذكية** للتحديثات والتنبيهات

## 📊 هيكل قاعدة البيانات

```
GymManagementDB/
├── members/          # جدول الأعضاء
│   ├── id (primary key)
│   ├── name (indexed)
│   ├── age, height, weight
│   ├── courses[], dietPlans[]
│   └── createdAt, updatedAt
│
├── courses/          # جدول الكورسات
│   ├── id (primary key)
│   ├── name (indexed)
│   └── createdAt
│
├── dietPlans/        # جدول الأنظمة الغذائية
│   ├── id (primary key)
│   ├── name (indexed)
│   └── createdAt
│
├── products/         # جدول المنتجات
│   ├── id (primary key)
│   ├── name (indexed)
│   ├── quantity (indexed)
│   ├── price
│   └── createdAt, updatedAt
│
├── sales/            # جدول المبيعات
│   ├── id (primary key)
│   ├── buyerName (indexed)
│   ├── productId (indexed)
│   ├── quantity, unitPrice, totalPrice
│   └── createdAt
│
└── auth/             # جدول المصادقة
    └── authState
```

## 🚨 نص��ئح مهمة

### 🔐 الأمان

- غيّر رمز الدخول الافتراضي في `src/pages/Login.tsx`
- لا تشارك رمز الدخول مع أشخاص غير مصرح لهم
- أنشئ نسخاً احتياطية دورية

### 💾 النسخ الاحتياطي

- استخدم ميزة التصدير في إعدادات قاعدة البيانات
- احفظ النسخ الاحتياطية في مكان آمن
- تأكد من عمل نسخة احتياطية قبل أي تحديث كبير

### 🔄 التحديثات

- راقب تبويب Actions على GitHub للتأكد من نجاح النشر
- اختبر التطبيق بعد كل تحديث
- احفظ نسخة احتياطية قبل تطبيق أي تحديثات كبيرة

## 🆘 حل المشاكل الشائعة

### مشكلة: "Permission denied"

```bash
# تأكد من الصلاحيات
git config --global user.name "اسمك"
git config --global user.email "بريدك_الإلكتروني"
```

### مشكلة: "Repository not found"

```bash
# تحقق من صحة الرابط
git remote -v
# إذا كان خاطئاً، غيّره:
git remote set-url origin https://github.com/USERNAME/REPOSITORY_NAME.git
```

### مشكلة: في النشر على GitHub Pages

1. تأكد من أن الفرع الرئيسي هو `main`
2. تحقق من ملف `.github/workflows/deploy.yml`
3. راجع تبويب Actions للأخطاء

## 📞 الدعم

إذا واجهت أي مشاكل:

1. راجع الأخطاء في تبويب Actions على GitHub
2. تحقق من Console في المتصفح (F12)
3. أنشئ Issue جديد في المستودع مع تفاصيل المشكلة

---

**🎉 مبروك! مشروعك جاهز للعمل مع قاعدة بيانات احترافية!**

الآن يمكنك استخدام النظام في صالتك بثقة كاملة مع:

- ✅ حفظ آمن للبيانات
- ✅ نسخ احتياطية تلقائية
- ✅ عمل بدون اتصال
- ✅ واجهة احترافية باللغة العربية
