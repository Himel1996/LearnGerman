import { NextRequest, NextResponse } from 'next/server';
import { saveFeedback, initFeedbackTable } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      message,
      isAnonymous = false,
      userExperienceRating,
      easeOfUseRating,
      translationUsefulness,
      analysisUsefulness,
      wouldRecommend,
    } = body;

    // Validate input - message is always required
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Feedback message is required' },
        { status: 400 }
      );
    }

    // Validate email format only if not anonymous
    if (!isAnonymous) {
      if (!email || typeof email !== 'string' || email.trim().length === 0) {
        return NextResponse.json(
          { error: 'Email is required when not submitting anonymously' },
          { status: 400 }
        );
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Validate ratings if provided (1-5)
    const validateRating = (rating: any, fieldName: string) => {
      if (rating !== null && rating !== undefined) {
        const numRating = Number(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
          return `${fieldName} must be between 1 and 5`;
        }
      }
      return null;
    };

    const ratingErrors = [
      validateRating(userExperienceRating, 'User experience rating'),
      validateRating(easeOfUseRating, 'Ease of use rating'),
      validateRating(translationUsefulness, 'Translation usefulness'),
      validateRating(analysisUsefulness, 'Analysis usefulness'),
    ].filter(Boolean);

    if (ratingErrors.length > 0) {
      return NextResponse.json(
        { error: ratingErrors.join(', ') },
        { status: 400 }
      );
    }

    // Validate wouldRecommend if provided
    if (wouldRecommend && !['Yes', 'No', 'Maybe'].includes(wouldRecommend)) {
      return NextResponse.json(
        { error: 'Would recommend must be Yes, No, or Maybe' },
        { status: 400 }
      );
    }

    // Initialize table if it doesn't exist (safe to call multiple times)
    try {
      await initFeedbackTable();
    } catch (initError) {
      // If table already exists, that's fine - continue
      console.log('Table initialization check:', initError);
    }

    // Save feedback to Vercel Postgres database
    const feedbackEntry = await saveFeedback(
      message,
      isAnonymous,
      name || null,
      email || null,
      userExperienceRating || null,
      easeOfUseRating || null,
      translationUsefulness || null,
      analysisUsefulness || null,
      wouldRecommend || null
    );

    console.log('Feedback saved to database:', {
      id: feedbackEntry.id,
      isAnonymous: feedbackEntry.is_anonymous,
      created_at: feedbackEntry.created_at,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback received and saved successfully',
        id: feedbackEntry.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing feedback:', error);

    // Provide more specific error messages
    if (error instanceof Error) {
      // Check if it's a database connection error
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return NextResponse.json(
          {
            error:
              'Database table not initialized. Please run the SQL migration in your Vercel Postgres dashboard.',
            details: 'See sql/init.sql for the migration script',
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: `Failed to process feedback: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}

