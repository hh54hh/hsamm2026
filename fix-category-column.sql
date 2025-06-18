/*
========================================================
                حل مشكلة عمود الفئة المفقود
========================================================

المشكلة: Could not find the 'category' column of 'products'
الحل: إضافة العمود المفقود وتحديث البيانات

كيفية الاستخدام:
1. انتقل إلى Supabase Dashboard
2. اضغط "SQL Editor"
3. انسخ والصق كامل محتوى هذا الملف
4. اضغط "Run"
5. أعد تحميل صفحة المخزون

========================================================
*/

-- إضافة عمود الفئة إذا لم يكن موجود
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category TEXT;

-- تحديث المنتجات الموجود�� بفئات ذكية
UPDATE products 
SET category = CASE 
    -- مكملات غذائية
    WHEN LOWER(name) LIKE '%بروتين%' OR 
         LOWER(name) LIKE '%كرياتين%' OR 
         LOWER(name) LIKE '%فيتامين%' OR 
         LOWER(name) LIKE '%أحماض%' OR
         LOWER(name) LIKE '%مكمل%' 
    THEN 'مكملات'
    
    -- مشروبات
    WHEN LOWER(name) LIKE '%مشروب%' OR 
         LOWER(name) LIKE '%طاقة%' OR 
         LOWER(name) LIKE '%عصير%'
    THEN 'مشروبات'
    
    -- أدوات رياضية
    WHEN LOWER(name) LIKE '%شيكر%' OR 
         LOWER(name) LIKE '%حزام%' OR 
         LOWER(name) LIKE '%قفاز%' OR
         LOWER(name) LIKE '%أدوات%'
    THEN 'أدوات'
    
    -- إكسسوارات
    WHEN LOWER(name) LIKE '%منشفة%' OR 
         LOWER(name) LIKE '%حقيبة%' OR
         LOWER(name) LIKE '%إكسسوار%'
    THEN 'إكسسوارات'
    
    -- ملابس رياضية
    WHEN LOWER(name) LIKE '%قميص%' OR 
         LOWER(name) LIKE '%شورت%' OR 
         LOWER(name) LIKE '%ملابس%'
    THEN 'ملابس'
    
    -- فئة افتراضية
    ELSE 'أخرى'
END
WHERE category IS NULL;

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- إضافة فهرس إضافي للبحث
CREATE INDEX IF NOT EXISTS idx_products_name_category ON products(name, category);

-- إدراج منتجات تجريبية إضافية (إذا لم تكن موجودة)
INSERT INTO products (name, quantity, price, description, category) 
VALUES 
    ('بروتين واي', 15, 280.00, 'بروتين مصل اللبن المعزول', 'مكملات'),
    ('كرياتين مونوهيدرات', 20, 150.00, 'كرياتين خالص 100%', 'مكملات'),
    ('مشروب طاقة ريد بول', 50, 8.00, 'مشروب طاقة سريع المفعول', 'مشروبات'),
    ('قفازات جيم', 10, 65.00, 'قفازات رياضية مضادة للانزلاق', 'أدوات'),
    ('حزام رفع أثقال جلدي', 8, 350.00, 'حزام دعم ظهر جلد طبيعي', 'أدوات')
ON CONFLICT (name) DO NOTHING;

-- التحقق من ال��تائج
SELECT 
    '🎯 نتائج الإصلاح:' as status,
    COUNT(*) as total_products,
    COUNT(CASE WHEN category IS NOT NULL THEN 1 END) as products_with_category,
    ROUND(
        (COUNT(CASE WHEN category IS NOT NULL THEN 1 END) * 100.0 / COUNT(*)), 
        1
    ) || '%' as completion_percentage
FROM products;

-- عرض الفئات الموجودة
SELECT 
    '📊 الفئات المتاحة:' as info,
    category as category_name,
    COUNT(*) as product_count,
    STRING_AGG(name, ', ') as sample_products
FROM products 
WHERE category IS NOT NULL
GROUP BY category
ORDER BY product_count DESC;

-- رسالة نجاح
SELECT '✅ تم إصلاح مشكلة عمود الفئة بنجاح! يمكنك الآن استخدام صفحة المخزون بدون مشاكل.' as success_message;

/*
========================================================
                    تم الانتهاء!
========================================================

ما تم إنجازه:
✅ إضافة عمود category للجدول
✅ تصنيف المنتجات الموجودة تلقائياً
✅ إضافة فهارس لتحسين الأداء
✅ إضافة منتجات تجريبية جديدة

الخطوات التالية:
1. أعد تحميل صفحة المخزون (F5)
2. جرب إضا��ة منتج جديد
3. اختر فئة من القائمة المنسدلة

الفئات المتاحة:
• مكملات
• مشروبات
• أدوات
• إكسسوارات
• ملابس
• أخرى

========================================================
*/
