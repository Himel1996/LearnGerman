import { NextRequest, NextResponse } from 'next/server';
import { getAllFeedback } from '@/lib/db';

export interface AnonymousFeedback {
  id: number;
  message: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get all feedback from database
    const feedback = await getAllFeedback();

    // Compute average user experience rating (1-5) based on all feedbacks that provided a rating
    const ratedFeedback = feedback.filter(
      (entry) =>
        typeof entry.user_experience_rating === 'number' &&
        entry.user_experience_rating !== null
    );

    const ratingsCount = ratedFeedback.length;
    const averageUserExperienceRating =
      ratingsCount > 0
        ? Number(
            (
              ratedFeedback.reduce(
                (sum, entry) => sum + (entry.user_experience_rating || 0),
                0
              ) / ratingsCount
            ).toFixed(1)
          )
        : null;

    // Return anonymous feedback (exclude name and email for privacy)
    const anonymousFeedback: AnonymousFeedback[] = feedback.map((entry) => ({
      id: entry.id || 0,
      message: entry.message,
      created_at: entry.created_at || new Date().toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        feedback: anonymousFeedback,
        count: anonymousFeedback.length,
        ratingsCount,
        averageUserExperienceRating,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching feedback:', error);

    // If table doesn't exist, return empty array
    if (error instanceof Error && error.message.includes('does not exist')) {
      return NextResponse.json(
        {
          success: true,
          feedback: [],
          count: 0,
          ratingsCount: 0,
          averageUserExperienceRating: null,
          message: 'No feedback yet. Be the first to submit!',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

