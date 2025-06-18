# حل مشكلة الجداول المفقودة - صالة حسام جم

## 🚨 المشكلة

ظهور رسالة: "قاعدة البيانات غير مهيأة. الجداول المفقودة: products, sales"

## ✅ الحل السريع

### الطريقة الأولى: إضافة الجداول المفقودة فقط (مُوصى بها)

1. **اذهب إلى Supabase Dashboard**

   - [supabase.com](https://supabase.com)
   - سجل الدخول واختر مشروعك

2. **افتح SQL Editor**

   - في الشريط الجانبي، اضغط "SQL Editor"

3. **أنسخ والصق الكود التالي:**

```sql
-- إضافة جداول المخزون والمبيعات المفقودة

-- 1. جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    description TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول المبيعات
CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    buyer_name TEXT NOT NULL,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    sale_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_sales_buyer_name ON sales(buyer_name);

-- 4. إضافة بيانات تجريبية
INSERT INTO products (name, quantity, price, description, category) VALUES
('بروتين مصل اللبن', 10, 250.00, 'مكمل بروتين عالي الجودة', 'مكملات'),
('كرياتين', 15, 180.00, 'لزيادة القوة والطاقة', 'مكملات'),
('مشروب طاقة', 25, 15.00, 'مشروب منشط قبل التمرين', 'مشروبات')
ON CONFLICT (id) DO NOTHING;
```

4. **اضغط "Run" أو Ctrl/Cmd + Enter**

5. **أعد تحميل صفحة التطبيق**

---

### الطريقة الثانية: استخدام الملف الجاهز

**أو** يمكنك نسخ محتوى ملف `add-inventory-tables.sql` المرفق وتشغيله.

---

## 🔍 للتحقق من النجاح

بعد تنفيذ الكود، تحقق من:

1. **في Supabase Table Editor:**

   - يجب أن ترى جدولين جديدين: `products` و `sales`

2. **في التطبيق:**
   - أعد تحميل الصفحة
   - يجب أن تختفي رسالة الخطأ
   - يجب أن تظهر صفحة الدخول برمز 112233

## ⚠️ إذا استمرت المشكلة

1. **تحقق من الأخطاء في SQL Editor**
2. **تأكد من تشغيل الكود كاملاً**
3. **أعد تحميل الصفحة عدة مرات**
4. **امسح cache المتصفح (Ctrl+F5)**

## 📞 الدعم

إذا استمر الخطأ، يمكنك:

- التحقق من console المتصفح (F12)
- التأكد من صحة إعدادات Supabase
- إعادة تشغيل الاستعلام

---

## ✅ النتيجة المتوقعة

بعد تطبيق الحل:

- ✅ اختفاء رسالة الخطأ
- ✅ ظهور صفحة الدخول
- ✅ إمكانية الوصول لصفحة المخزون والمبيعات
- ✅ وجود بيانات تجريبية للمنتجات

**رمز الدخول**: 112233
