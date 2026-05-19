-- ============================================
-- 次次和礼拜一 · Supabase 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此文件（可重复执行）
-- ============================================

-- 1. 重要日期表（纪念日、生日等）
CREATE TABLE IF NOT EXISTS important_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('anniversary', 'birthday')),
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE important_dates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "认证用户可读" ON important_dates;
DROP POLICY IF EXISTS "认证用户可写" ON important_dates;
DROP POLICY IF EXISTS "认证用户可更新" ON important_dates;
DROP POLICY IF EXISTS "认证用户可删除" ON important_dates;
CREATE POLICY "认证用户可读" ON important_dates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可写" ON important_dates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "认证用户可更新" ON important_dates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可删除" ON important_dates FOR DELETE USING (auth.role() = 'authenticated');

-- 2. 回忆记录表
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  image_urls TEXT[] DEFAULT '{}',
  memory_date DATE NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "认证用户可读" ON memories;
DROP POLICY IF EXISTS "认证用户可写" ON memories;
DROP POLICY IF EXISTS "认证用户可更新" ON memories;
DROP POLICY IF EXISTS "认证用户可删除" ON memories;
CREATE POLICY "认证用户可读" ON memories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可写" ON memories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "认证用户可更新" ON memories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可删除" ON memories FOR DELETE USING (auth.role() = 'authenticated');

-- 3. 日记表（content 字段存储 AES-GCM 密文）
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT DEFAULT 'love',
  image_urls TEXT[] DEFAULT '{}',
  entry_date DATE NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "认证用户可读" ON diary_entries;
DROP POLICY IF EXISTS "认证用户可写" ON diary_entries;
DROP POLICY IF EXISTS "认证用户可更新" ON diary_entries;
DROP POLICY IF EXISTS "认证用户可删除" ON diary_entries;
CREATE POLICY "认证用户可读" ON diary_entries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可写" ON diary_entries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "认证用户可更新" ON diary_entries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可删除" ON diary_entries FOR DELETE USING (auth.role() = 'authenticated');

-- 4. 相册照片表
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT DEFAULT '',
  taken_at DATE DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "认证用户可读" ON photos;
DROP POLICY IF EXISTS "认证用户可写" ON photos;
DROP POLICY IF EXISTS "认证用户可更新" ON photos;
DROP POLICY IF EXISTS "认证用户可删除" ON photos;
CREATE POLICY "认证用户可读" ON photos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可写" ON photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "认证用户可更新" ON photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可删除" ON photos FOR DELETE USING (auth.role() = 'authenticated');

-- 5. 旅行记录表
CREATE TABLE IF NOT EXISTS travels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  story TEXT DEFAULT '',
  lat FLOAT8 NOT NULL DEFAULT 0,
  lng FLOAT8 NOT NULL DEFAULT 0,
  image_urls TEXT[] DEFAULT '{}',
  visit_date DATE NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE travels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "认证用户可读" ON travels;
DROP POLICY IF EXISTS "认证用户可写" ON travels;
DROP POLICY IF EXISTS "认证用户可更新" ON travels;
DROP POLICY IF EXISTS "认证用户可删除" ON travels;
CREATE POLICY "认证用户可读" ON travels FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可写" ON travels FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "认证用户可更新" ON travels FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可删除" ON travels FOR DELETE USING (auth.role() = 'authenticated');

-- 6. 心愿清单表
CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "认证用户可读" ON wishes;
DROP POLICY IF EXISTS "认证用户可写" ON wishes;
DROP POLICY IF EXISTS "认证用户可更新" ON wishes;
DROP POLICY IF EXISTS "认证用户可删除" ON wishes;
CREATE POLICY "认证用户可读" ON wishes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可写" ON wishes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "认证用户可更新" ON wishes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可删除" ON wishes FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- 7. 弹幕消息表
CREATE TABLE IF NOT EXISTS danmaku (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE danmaku ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "认证用户可读" ON danmaku;
DROP POLICY IF EXISTS "认证用户可写" ON danmaku;
DROP POLICY IF EXISTS "认证用户可更新" ON danmaku;
DROP POLICY IF EXISTS "认证用户可删除" ON danmaku;
CREATE POLICY "认证用户可读" ON danmaku FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可写" ON danmaku FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "认证用户可更新" ON danmaku FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可删除" ON danmaku FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE important_dates ADD COLUMN IF NOT EXISTS photo_urls TEXT DEFAULT '';
ALTER TABLE important_dates ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE important_dates ADD COLUMN IF NOT EXISTS count_mode TEXT DEFAULT 'countdown';
ALTER TABLE important_dates ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE important_dates ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT true;

ALTER PUBLICATION supabase_realtime ADD TABLE danmaku;

-- 10. 时间线自定义照片表
CREATE TABLE IF NOT EXISTS timeline_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE timeline_photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "认证用户可读" ON timeline_photos;
DROP POLICY IF EXISTS "认证用户可写" ON timeline_photos;
DROP POLICY IF EXISTS "认证用户可更新" ON timeline_photos;
DROP POLICY IF EXISTS "认证用户可删除" ON timeline_photos;
CREATE POLICY "认证用户可读" ON timeline_photos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可写" ON timeline_photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "认证用户可更新" ON timeline_photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可删除" ON timeline_photos FOR DELETE USING (auth.role() = 'authenticated');

-- 8. 食谱表
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ingredients TEXT DEFAULT '',
  steps TEXT DEFAULT '',
  cooking_time TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "认证用户可读" ON recipes;
DROP POLICY IF EXISTS "认证用户可写" ON recipes;
DROP POLICY IF EXISTS "认证用户可更新" ON recipes;
DROP POLICY IF EXISTS "认证用户可删除" ON recipes;
CREATE POLICY "认证用户可读" ON recipes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可写" ON recipes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "认证用户可更新" ON recipes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可删除" ON recipes FOR DELETE USING (auth.role() = 'authenticated');

-- 9. 美食记录表
CREATE TABLE IF NOT EXISTS food_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_name TEXT NOT NULL,
  restaurant TEXT DEFAULT '',
  location TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  allergies TEXT DEFAULT '',
  record_date DATE NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE food_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "认证用户可读" ON food_records;
DROP POLICY IF EXISTS "认证用户可写" ON food_records;
DROP POLICY IF EXISTS "认证用户可更新" ON food_records;
DROP POLICY IF EXISTS "认证用户可删除" ON food_records;
CREATE POLICY "认证用户可读" ON food_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可写" ON food_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "认证用户可更新" ON food_records FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "认证用户可删除" ON food_records FOR DELETE USING (auth.role() = 'authenticated');

-- Storage Buckets（在 Supabase Dashboard → Storage 中手动创建）
-- ============================================
-- 创建以下 4 个 bucket：
--   1. memories  — 回忆图片
--   2. diary     — 日记图片
--   3. album     — 相册照片
--   4. travel    — 旅行照片
--
-- 每个 bucket 添加策略：全部3种操作勾选，表达式：
--   (auth.role() = 'authenticated')

-- ============================================
-- 创建共享账号
-- ============================================
-- Dashboard → Authentication → Add User：
--   Email: 情侣共用邮箱
--   Password: 情侣暗号（也是日记加密密钥）
--   ✅ Auto Confirm User
