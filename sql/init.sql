-- Vercel Postgres Database Schema for Feedback
-- Run this SQL in your Vercel Postgres dashboard or via Vercel CLI

-- Drop existing table if you need to recreate it (uncomment if needed)
-- DROP TABLE IF EXISTS feedback;

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  message TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  user_experience_rating INTEGER CHECK (user_experience_rating >= 1 AND user_experience_rating <= 5),
  ease_of_use_rating INTEGER CHECK (ease_of_use_rating >= 1 AND ease_of_use_rating <= 5),
  translation_usefulness INTEGER CHECK (translation_usefulness >= 1 AND translation_usefulness <= 5),
  analysis_usefulness INTEGER CHECK (analysis_usefulness >= 1 AND analysis_usefulness <= 5),
  would_recommend VARCHAR(20) CHECK (would_recommend IN ('Yes', 'No', 'Maybe')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_is_anonymous ON feedback(is_anonymous);
CREATE INDEX IF NOT EXISTS idx_feedback_user_experience_rating ON feedback(user_experience_rating);
CREATE INDEX IF NOT EXISTS idx_feedback_would_recommend ON feedback(would_recommend);

-- If you have an existing table and need to migrate, run these ALTER statements:
-- ALTER TABLE feedback ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;
-- ALTER TABLE feedback ADD COLUMN IF NOT EXISTS user_experience_rating INTEGER CHECK (user_experience_rating >= 1 AND user_experience_rating <= 5);
-- ALTER TABLE feedback ADD COLUMN IF NOT EXISTS ease_of_use_rating INTEGER CHECK (ease_of_use_rating >= 1 AND ease_of_use_rating <= 5);
-- ALTER TABLE feedback ADD COLUMN IF NOT EXISTS translation_usefulness INTEGER CHECK (translation_usefulness >= 1 AND translation_usefulness <= 5);
-- ALTER TABLE feedback ADD COLUMN IF NOT EXISTS analysis_usefulness INTEGER CHECK (analysis_usefulness >= 1 AND analysis_usefulness <= 5);
-- ALTER TABLE feedback ADD COLUMN IF NOT EXISTS would_recommend VARCHAR(20) CHECK (would_recommend IN ('Yes', 'No', 'Maybe'));
-- ALTER TABLE feedback ALTER COLUMN name DROP NOT NULL;
-- ALTER TABLE feedback ALTER COLUMN email DROP NOT NULL;

