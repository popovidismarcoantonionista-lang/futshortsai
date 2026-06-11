CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  url TEXT NOT NULL,
  name TEXT,
  duration REAL,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clips (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL,
  start_time REAL NOT NULL,
  end_time REAL NOT NULL,
  title TEXT,
  description TEXT,
  hashtags TEXT,
  viral_score INTEGER,
  retention_score INTEGER,
  engagement_score INTEGER,
  ctr_score INTEGER,
  category TEXT,
  thumbnail_url TEXT,
  download_url TEXT,
  analysis_report TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscriptions (
  user_id TEXT PRIMARY KEY,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  credits INTEGER DEFAULT 10,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
