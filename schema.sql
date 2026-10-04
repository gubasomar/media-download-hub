CREATE DATABASE IF NOT EXISTS media_download_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE media_download_hub;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  preferred_language ENUM('en', 'ar') NOT NULL DEFAULT 'en',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS catalog (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  title_ar VARCHAR(180) NOT NULL,
  type ENUM('game', 'movie') NOT NULL,
  genre VARCHAR(80) NOT NULL,
  year SMALLINT UNSIGNED NOT NULL,
  description TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  size_label VARCHAR(40) NOT NULL,
  quality VARCHAR(80) NOT NULL,
  platform VARCHAR(100) NOT NULL DEFAULT '',
  source_url VARCHAR(1000) NOT NULL,
  source_name VARCHAR(180) NOT NULL,
  license_label VARCHAR(180) NOT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX catalog_browse (published, type, genre, featured)
);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  catalog_id BIGINT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment VARCHAR(1000) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY one_review_per_user (user_id, catalog_id),
  CONSTRAINT review_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT reviews_catalog_fk FOREIGN KEY (catalog_id) REFERENCES catalog(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS downloads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  catalog_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT downloads_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT downloads_catalog_fk FOREIGN KEY (catalog_id) REFERENCES catalog(id) ON DELETE CASCADE,
  INDEX download_history (user_id, created_at)
);

INSERT INTO catalog
  (slug, title, title_ar, type, genre, year, description, description_ar, image_url, size_label, quality, platform, source_url, source_name, license_label, featured)
VALUES
  ('0-ad', '0 A.D.', '0 A.D.', 'game', 'Strategy', 2025,
   'Build a civilization, manage resources, and lead your people through a richly detailed historical strategy game.',
   'ابنِ حضارة وأدر الموارد وقُد شعبك في لعبة استراتيجية تاريخية غنية بالتفاصيل.',
   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85', '2.5 GB', 'HD · PC', 'Windows · macOS · Linux', 'https://play0ad.com/download/', 'Official 0 A.D. website', 'Open source · GPL', 1),
  ('xonotic', 'Xonotic', 'Xonotic', 'game', 'Action', 2024,
   'A fast-paced arena shooter with fluid movement, polished maps, and a passionate open-source community.',
   'لعبة تصويب سريعة في ساحات القتال، بحركة سلسة وخرائط متقنة ومجتمع مفتوح المصدر.',
   'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85', '1.8 GB', 'HD · PC', 'Windows · macOS · Linux', 'https://www.xonotic.org/download/', 'Official Xonotic website', 'Open source · GPL', 1),
  ('supertuxkart', 'SuperTuxKart', 'سوبر تاكس كارت', 'game', 'Racing', 2024,
   'A cheerful open-source kart racer featuring colorful tracks, memorable characters, and local multiplayer.',
   'لعبة سباق كارت مفتوحة المصدر بمسارات ملونة وشخصيات مميزة ولعب جماعي محلي.',
   'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85', '1.2 GB', 'HD · PC', 'Windows · macOS · Linux · Android', 'https://supertuxkart.net/Download', 'Official SuperTuxKart website', 'Open source · GPL', 0),
  ('big-buck-bunny', 'Big Buck Bunny', 'الأرنب الكبير', 'movie', 'Animation', 2008,
   'A charming animated short created by the Blender Institute and released under a Creative Commons license.',
   'فيلم رسوم متحركة قصير ولطيف من إنتاج معهد بلندر، متاح بموجب ترخيص المشاع الإبداعي.',
   'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1000&q=85', '463 MB', '1080p · MP4', 'English · Subtitles available', 'https://peach.blender.org/download/', 'Blender Foundation', 'Creative Commons BY 3.0', 1),
  ('sintel', 'Sintel', 'سنتل', 'movie', 'Fantasy', 2010,
   'An independent fantasy short from the Blender Open Movie Project, freely shared by its creators.',
   'فيلم خيالي قصير مستقل من مشروع أفلام بلندر المفتوحة، متاح مجاناً من صانعيه.',
   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85', '1.1 GB', '1080p · MP4', 'English · Subtitles available', 'https://durian.blender.org/download/', 'Blender Foundation', 'Creative Commons BY 3.0', 0),
  ('night-of-the-living-dead', 'Night of the Living Dead', 'ليلة الموتى الأحياء', 'movie', 'Horror', 1968,
   'George A. Romero’s landmark independent horror film. Check the source listing for rights and availability in your region.',
   'فيلم الرعب المستقل الشهير لجورج روميرو. تحقّق من المصدر لمعرفة الحقوق والتوفر في منطقتك.',
   'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=85', '1.4 GB', '1080p · MP4', 'English · Public-domain listing', 'https://archive.org/details/night_of_the_living_dead', 'Internet Archive', 'Public-domain listing · verify locally', 0)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  title_ar = VALUES(title_ar),
  description = VALUES(description),
  description_ar = VALUES(description_ar),
  source_url = VALUES(source_url);
