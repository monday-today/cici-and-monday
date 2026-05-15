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
