import { sql } from '@vercel/postgres';

// @vercel/postgres automatically uses POSTGRES_URL or DATABASE_URL
// If using Neon or other providers, ensure the connection string is set as POSTGRES_URL
// or DATABASE_URL in your Vercel environment variables

export interface FeedbackEntry {
  id?: number;
  name: string | null;
  email: string | null;
  message: string;
  is_anonymous: boolean;
  user_experience_rating?: number | null;
  ease_of_use_rating?: number | null;
  translation_usefulness?: number | null;
  analysis_usefulness?: number | null;
  would_recommend?: string | null;
  created_at?: string;
}

/**
 * Initialize the feedback table if it doesn't exist
 * This should be run once when setting up the database
 */
export async function initFeedbackTable() {
  try {
    await sql`
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
    `;
    console.log('Feedback table initialized successfully');
  } catch (error) {
    console.error('Error initializing feedback table:', error);
    throw error;
  }
}

/**
 * Save feedback to the database
 */
export async function saveFeedback(
  message: string,
  isAnonymous: boolean = false,
  name: string | null = null,
  email: string | null = null,
  userExperienceRating?: number | null,
  easeOfUseRating?: number | null,
  translationUsefulness?: number | null,
  analysisUsefulness?: number | null,
  wouldRecommend?: string | null
): Promise<FeedbackEntry> {
  try {
    const result = await sql`
      INSERT INTO feedback (
        name, 
        email, 
        message, 
        is_anonymous,
        user_experience_rating,
        ease_of_use_rating,
        translation_usefulness,
        analysis_usefulness,
        would_recommend
      )
      VALUES (
        ${isAnonymous ? null : name}, 
        ${isAnonymous ? null : email}, 
        ${message},
        ${isAnonymous},
        ${userExperienceRating || null},
        ${easeOfUseRating || null},
        ${translationUsefulness || null},
        ${analysisUsefulness || null},
        ${wouldRecommend || null}
      )
      RETURNING 
        id, 
        name, 
        email, 
        message, 
        is_anonymous,
        user_experience_rating,
        ease_of_use_rating,
        translation_usefulness,
        analysis_usefulness,
        would_recommend,
        created_at;
    `;

    return result.rows[0] as FeedbackEntry;
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
}

/**
 * Get all feedback entries (for admin purposes)
 */
export async function getAllFeedback(): Promise<FeedbackEntry[]> {
  try {
    const result = await sql`
      SELECT 
        id, 
        name, 
        email, 
        message, 
        is_anonymous,
        user_experience_rating,
        ease_of_use_rating,
        translation_usefulness,
        analysis_usefulness,
        would_recommend,
        created_at
      FROM feedback
      ORDER BY created_at DESC;
    `;

    return result.rows as FeedbackEntry[];
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
}

