'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NavMenu from '@/components/NavMenu';

interface AnonymousFeedback {
  id: number;
  message: string;
  created_at: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<AnonymousFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingsCount, setRatingsCount] = useState<number>(0);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/feedback/get');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch feedback');
      }

      setFeedback(data.feedback || []);
      setAverageRating(
        typeof data.averageUserExperienceRating === 'number'
          ? data.averageUserExperienceRating
          : null
      );
      setRatingsCount(
        typeof data.ratingsCount === 'number' ? data.ratingsCount : 0
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8 md:p-16 overflow-hidden" style={{ padding: '5px' }}>
      <NavMenu />
      <div className="w-full max-w-4xl mx-auto px-8 md:px-12" style={{ padding: '5px' }}>
        {/* Back to Home Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-8 flex items-center gap-2 text-blue-900 hover:text-blue-950 hover:bg-blue-100 bg-blue-50/80 border border-blue-200 px-3 py-2 rounded-lg transition-all duration-200 group whitespace-nowrap"
          style={{ padding: '5px' }}
        >
          <svg
            className="w-3 h-3 max-w-[12px] max-h-[12px] transform group-hover:-translate-x-1 transition-transform flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-semibold" style={{ padding: '5px' }}>Back to Home</span>
        </button>

        <div className="space-y-8" style={{ padding: '5px' }}>
          {/* Header Card */}
          <Card className="p-8 md:p-12" style={{ padding: '5px' }}>
            <div className="text-center mb-8" style={{ padding: '5px' }}>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent mb-4" style={{ padding: '5px' }}>
                User Feedback
              </h1>
              <p className="text-lg md:text-xl text-blue-700 font-semibold" style={{ padding: '5px' }}>
                Anonymous feedback from our users
              </p>
            </div>

            {/* Average Rating Summary */}
            {!isLoading && !error && averageRating !== null && ratingsCount > 0 && (
              <div className="flex items-center justify-center gap-3" style={{ padding: '5px' }}>
                <div className="flex items-center gap-2" style={{ padding: '5px' }}>
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ padding: '5px' }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-blue-900 font-semibold text-lg" style={{ padding: '5px' }}>
                    {averageRating.toFixed(1)}/5.0
                  </span>
                </div>
                <span className="text-blue-700 font-medium text-base" style={{ padding: '5px' }}>
                  ({ratingsCount} {ratingsCount === 1 ? 'feedback' : 'feedbacks'})
                </span>
              </div>
            )}
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="p-8 md:p-12" style={{ padding: '5px' }}>
              <div className="flex items-center justify-center py-12" style={{ padding: '5px' }}>
                <LoadingSpinner size="lg" />
                <span className="ml-4 text-blue-900 font-semibold" style={{ padding: '5px' }}>
                  Loading feedback...
                </span>
              </div>
            </Card>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Card className="p-8 md:p-12" style={{ padding: '5px' }}>
              <div className="text-center py-8" style={{ padding: '5px' }}>
                <div className="mb-4" style={{ padding: '5px' }}>
                  <svg
                    className="w-16 h-16 mx-auto text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ padding: '5px' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-red-600 font-semibold text-lg mb-4" style={{ padding: '5px' }}>
                  {error}
                </p>
                <button
                  onClick={fetchFeedback}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  style={{ padding: '5px' }}
                >
                  Try Again
                </button>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !error && feedback.length === 0 && (
            <Card className="p-8 md:p-12" style={{ padding: '5px' }}>
              <div className="text-center py-12" style={{ padding: '5px' }}>
                <div className="mb-4" style={{ padding: '5px' }}>
                  <svg
                    className="w-16 h-16 mx-auto text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ padding: '5px' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-blue-700 font-semibold text-xl mb-2" style={{ padding: '5px' }}>
                  No feedback yet
                </p>
                <p className="text-blue-600 text-lg" style={{ padding: '5px' }}>
                  Be the first to share your thoughts!
                </p>
                <button
                  onClick={() => router.push('/contact')}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ padding: '5px' }}
                >
                  Submit Feedback
                </button>
              </div>
            </Card>
          )}

          {/* Feedback List */}
          {!isLoading && !error && feedback.length > 0 && (
            <div className="space-y-6" style={{ padding: '5px' }}>
              <div className="mb-6" style={{ padding: '5px' }}>
                <p className="text-blue-900 font-semibold text-lg" style={{ padding: '5px' }}>
                  {feedback.length} {feedback.length === 1 ? 'feedback' : 'feedbacks'} received
                </p>
              </div>

              {feedback.map((item) => (
                <Card key={item.id} className="p-6 md:p-8" style={{ padding: '5px' }}>
                  <div className="space-y-4" style={{ padding: '5px' }}>
                    <div className="flex items-start justify-between" style={{ padding: '5px' }}>
                      <div className="flex-1" style={{ padding: '5px' }}>
                        <p className="text-blue-900 font-semibold text-lg leading-relaxed whitespace-pre-wrap break-words" style={{ padding: '5px' }}>
                          {item.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-blue-200" style={{ padding: '5px' }}>
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ padding: '5px' }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-blue-600 text-sm font-medium" style={{ padding: '5px' }}>
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

