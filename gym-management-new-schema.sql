-- New Gym Management System Database Schema
-- Completely new structure as requested
-- Execute this in your Supabase SQL Editor

-- Drop old tables if they exist (complete overhaul)
DROP TABLE IF EXISTS sync_status CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS member_diet_plans CASCADE;
DROP TABLE IF EXISTS member_courses CASCADE;
DROP TABLE IF EXISTS diet_plans CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- 1. Subscribers Table (المشتركين)
CREATE TABLE subscribers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    age INTEGER,
    weight DECIMAL(5,2), -- الوزن
    height DECIMAL(5,2), -- الطول
    phone TEXT,
    notes TEXT, -- الملاحظات
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Groups Table (مجموعات الكورسات والأنظمة الغذائية)
CREATE TABLE groups (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    subscriber_id TEXT NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    title TEXT, -- عنوان المجموعة (اختياري)
    type TEXT NOT NULL CHECK (type IN ('course', 'diet')), -- نوع المجموعة
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Group Items Table (النقاط داخل كل مجموعة)
CREATE TABLE group_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- اسم النقطة (تمرين أو عنصر غذائي)
    order_index INTEGER DEFAULT 0 -- ترتيب النقطة داخل المجموعة
);

-- 4. Course Points Table (مكتبة نقاط التمارين)
CREATE TABLE course_points (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL UNIQUE, -- اسم التمرين
    description TEXT, -- وصف مختصر
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Diet Items Table (مكتبة العناصر الغذائية)
CREATE TABLE diet_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL UNIQUE, -- اسم العنصر الغذائي
    description TEXT, -- وصف مختصر
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_subscribers_name ON subscribers(name);
CREATE INDEX idx_subscribers_created_at ON subscribers(created_at);

CREATE INDEX idx_groups_subscriber_id ON groups(subscriber_id);
CREATE INDEX idx_groups_type ON groups(type);

CREATE INDEX idx_group_items_group_id ON group_items(group_id);
CREATE INDEX idx_group_items_order ON group_items(order_index);

CREATE INDEX idx_course_points_name ON course_points(name);
CREATE INDEX idx_diet_items_name ON diet_items(name);

-- Insert some default course points (sample data)
INSERT INTO course_points (name, description) VALUES
('بنج أمامي', 'تمرين عضلات الصدر الأمامية'),
('سكوات', 'تمرين عضلات الأرجل والمؤخرة'),
('ظهر علوي', 'تمرين عضلات الظهر العلوية'),
('كتف أمامي', 'تمرين عضلات الكتف الأمامية'),
('بايسبس', 'تمرين عضلات البايسبس'),
('ترايسبس', 'تمرين عضلات الترايسبس'),
('بطن', 'تمرين عضلات البطن'),
('كارديو', 'تمارين القلب والأوعية الدموية');

-- Insert some default diet items (sample data)
INSERT INTO diet_items (name, description) VALUES
('بيض مسلوق', 'مصدر بروتين عالي الجودة'),
('شوفان', 'كربوهيدرات معقدة ومفيدة'),
('تمر', 'سكريات طبيعية وطاقة سريعة'),
('لوز', 'دهون صحية وبروتين'),
('دجاج مشوي', 'بروتين خالي من الدهون'),
('أرز بني', 'كربوهيدرات معقدة'),
('خضروات ورقية', 'فيتامينات ومعادن أساسية'),
('موز', 'بوتاسيوم وكربوهيدرات طبيعية'),
('سمك', 'أوميغا 3 وبروتين عالي'),
('حليب قليل الدسم', 'كالسيوم وبروتين');

-- Comments for table purposes
COMMENT ON TABLE subscribers IS 'جدول المشتركين - يحتوي على معلومات المشتركين الأساسية';
COMMENT ON TABLE groups IS 'جدول المجموعات - يحتوي على مجموعات الكورسات والأنظمة الغذائية لكل مشترك';
COMMENT ON TABLE group_items IS 'جدول عناصر المجموعات - يحتوي على النقاط داخل كل مجموعة';
COMMENT ON TABLE course_points IS 'جدول نقاط الكورسات - مكتبة التمارين المتاحة';
COMMENT ON TABLE diet_items IS 'جدول العناصر الغذائية - مكتبة الأطعمة المتاحة';
