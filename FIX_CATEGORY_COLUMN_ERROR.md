# حل مشكلة عمود الفئة المفقود

## 🚨 المشكلة

```
Could not find the 'category' column of 'products' in the schema cache
```

## 🔍 السبب

عمود `category` مفقود من جدول `products` في قاعدة البيانات.

## ✅ الحل السريع (30 ثانية)

### انسخ والصق هذا في Supabase SQL Editor:

```sql
-- إضافة عمود الفئة المفقود
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;

-- تحديث المنتجات الموجودة بفئات افتراضية
UPDATE products
SET category = CASE
    WHEN name ILIKE '%بروتين%' OR name ILIKE '%كرياتين%' OR name ILIKE '%فيتامين%' THEN 'مكملات'
    WHEN name ILIKE '%مشروب%' OR name ILIKE '%طاقة%' THEN 'مشروبات'
    WHEN name ILIKE '%شيكر%' OR name ILIKE '%حزام%' OR name ILIKE '%قفاز%' THEN 'أدوات'
    ELSE 'أخرى'
END
WHERE category IS NULL;

-- إضافة فهرس للأداء
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
```

### أو استخدم الملف الجاهز:

انسخ محتوى `ADD_MISSING_CATEGORY_COLUMN.sql` وشغله في Supabase.

## 🔧 خطوات التطبيق

1. **اذهب إلى Supabase Dashboard**
2. **اضغط "SQL Editor"**
3. **الصق الكود أعلاه**
4. **اضغط "Run"**
5. **جرب إضافة منتج جديد**

## ✅ التحقق من النجاح

بعد تشغيل الكود:

- ✅ يمكنك إضافة منتجات مع فئات
- ✅ المنتجات الموجودة لها فئات افتراضية
- ✅ لا توجد أخطاء في المخزون

## 🎯 النتيجة المتوقعة

### قبل الإصلاح:

```
❌ Error: Could not find the 'category' column
```

### بعد الإصلاح:

```
✅ تم حفظ المنتج بنجاح
```

## 📋 الفئات المتاحة بعد الإصلاح

- **مكملات**: بروتين، كرياتين، فيتامينات
- **مشروبات**: مشروبات الطاقة
- **أدوات**: شيكر، حزام، قفازات
- **إكسسوارات**: منشفة، إلخ
- **أخرى**: المنتجات الأخرى

## 🔄 إذا استمر الخطأ

1. **تأكد من تشغيل الكود كاملاً**
2. **أعد تحميل صفحة التطبيق**
3. **امسح cache المتصفح (Ctrl+F5)**
4. **تحقق من Table Editor في Supabase أن العمود موجود**

---

## ✅ الحل مطبق وجاهز!

بعد تطبيق الإصلاح:

- 🎉 **صفحة المخزون تعمل بدون أخطاء**
- 📦 **يمكنك إضافة منتجات مع فئات**
- 🔍 **الكود محسن للتعامل مع هذه المشاكل مستقبلاً**
