/*
===============================================
   إصلاح سريع: إضافة عمود الفئة المفقود
===============================================

المشكلة: العمود 'category' مفقود من جدول products
الحل: إضافة العمود مع القيم الافتراضية

تعليمات الاستخدام:
1. انتقل إلى Supabase Dashboard
2. اضغط على "SQL Editor" 
3. انسخ والصق محتوى هذا الملف
4. اضغط "Run" أو Ctrl+Enter
5. جرب إضافة منتج جديد

===============================================
*/

-- إضافة عمود الفئة إلى جدول المنتجات
DO $$
BEGIN
    -- التحقق من وجود العمود أولاً
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'category'
    ) THEN
        
        -- إضافة العمود
        ALTER TABLE products 
        ADD COLUMN category TEXT;
        
        RAISE NOTICE '✅ تم إضافة عمود category بنجاح';
        
        -- تحديث المنتجات الموجودة بفئات افتراضية
        UPDATE products 
        SET category = CASE 
            WHEN name ILIKE '%بروتين%' OR name ILIKE '%كرياتين%' OR name ILIKE '%فيتامين%' OR name ILIKE '%أحماض%' THEN 'مكملات'
            WHEN name ILIKE '%مشروب%' OR name ILIKE '%طاقة%' THEN 'مشروبات'
            WHEN name ILIKE '%شيكر%' OR name ILIKE '%حزام%' OR name ILIKE '%قفاز%' THEN 'أدوات'
            WHEN name ILIKE '%منشفة%' THEN 'إكسسوارات'
            ELSE 'أخرى'
        END
        WHERE category IS NULL;
        
        RAISE NOTICE '✅ تم تحديث فئات المنتجات الموجودة';
        
    ELSE
        RAISE NOTICE '⚠️ عمود category موجود بالفعل';
    END IF;
END
$$;

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- عرض النتيجة
SELECT 
    '🔍 فحص جدول المنتجات' as test_name,
    COUNT(*) as total_products,
    COUNT(category) as products_with_category,
    CASE 
        WHEN COUNT(*) = COUNT(category) THEN '✅ جميع المنتجات لها فئات'
        ELSE '⚠️ بعض المنتجات بدون فئات'
    END as status
FROM products;

-- عرض الفئات المتاحة
SELECT 
    '📋 الفئات المتاحة:' as info,
    category,
    COUNT(*) as product_count
FROM products 
WHERE category IS NOT NULL
GROUP BY category
ORDER BY product_count DESC;

/*
===============================================
           تم الانتهاء من الإصلاح!
===============================================

الآن يمكنك:
1. إضافة منتجات جديدة مع الفئات
2. تعديل المنتجات الموجودة
3. استخدام صفحة المخزون بدون أخطاء

الفئات المتاحة:
- مكملات
- مشروبات  
- أدوات
- إكسسوارات
- أخرى
===============================================
*/
