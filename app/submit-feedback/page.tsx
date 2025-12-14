'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NavMenu from '@/components/NavMenu';

export default function SubmitFeedbackPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    isAnonymous: false,
    userExperienceRating: 0,
    easeOfUseRating: 0,
    translationUsefulness: 0,
    analysisUsefulness: 0,
    wouldRecommend: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number' || name.includes('Rating')) {
      setFormData((prev) => ({ ...prev, [name]: value ? parseInt(value) : 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRatingChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    // Validate that message is provided
    if (!formData.message.trim()) {
      setSubmitStatus('error');
      setSubmitMessage('Please provide your feedback message.');
      setIsSubmitting(false);
      return;
    }

    // Validate email if not anonymous
    if (!formData.isAnonymous) {
      if (!formData.email.trim()) {
        setSubmitStatus('error');
        setSubmitMessage('Please provide your email address or select anonymous submission.');
        setIsSubmitting(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setSubmitStatus('error');
        setSubmitMessage('Please provide a valid email address.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.isAnonymous ? null : formData.name,
          email: formData.isAnonymous ? null : formData.email,
          message: formData.message,
          isAnonymous: formData.isAnonymous,
          userExperienceRating: formData.userExperienceRating || null,
          easeOfUseRating: formData.easeOfUseRating || null,
          translationUsefulness: formData.translationUsefulness || null,
          analysisUsefulness: formData.analysisUsefulness || null,
          wouldRecommend: formData.wouldRecommend || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmitStatus('success');
      setSubmitMessage('Thank you for your feedback! Your input helps us improve the app.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
        isAnonymous: false,
        userExperienceRating: 0,
        easeOfUseRating: 0,
        translationUsefulness: 0,
        analysisUsefulness: 0,
        wouldRecommend: '',
      });
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage(
        err instanceof Error ? err.message : 'An error occurred while submitting feedback'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ 
    name, 
    label, 
    value, 
    onChange 
  }: { 
    name: string; 
    label: string; 
    value: number; 
    onChange: (value: number) => void;
  }) => {
    return (
      <div className="space-y-2" style={{ padding: '5px' }}>
        <label className="block text-sm font-semibold text-blue-900" style={{ padding: '5px' }}>
          {label} {value > 0 && <span className="text-blue-600">({value}/5)</span>}
        </label>
        <div className="flex gap-2" style={{ padding: '5px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`transition-all duration-200 ${
                star <= value
                  ? 'text-yellow-400 hover:text-yellow-500'
                  : 'text-gray-300 hover:text-gray-400'
              }`}
              style={{ padding: '5px' }}
            >
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
                style={{ padding: '5px' }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
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
                Submit Feedback
              </h1>
              <p className="text-lg md:text-xl text-blue-700 font-semibold" style={{ padding: '5px' }}>
                Help us improve by sharing your experience
              </p>
            </div>
          </Card>

          {/* Feedback Form Card */}
          <Card className="p-8 md:p-12" style={{ padding: '5px' }}>
            <form onSubmit={handleSubmit} className="space-y-8" style={{ padding: '5px' }}>
              {/* Anonymous Submission Option */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6" style={{ padding: '5px' }}>
                <label className="flex items-center gap-3 cursor-pointer" style={{ padding: '5px' }}>
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                    style={{ padding: '5px' }}
                  />
                  <span className="text-blue-900 font-semibold text-lg" style={{ padding: '5px' }}>
                    Submit anonymously (your name and email will not be stored)
                  </span>
                </label>
              </div>

              {/* Personal Information (only if not anonymous) */}
              {!formData.isAnonymous && (
                <div className="space-y-6" style={{ padding: '5px' }}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-blue-900 mb-2"
                      style={{ padding: '5px' }}
                    >
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/90 text-blue-900 font-medium"
                      placeholder="Your name"
                      style={{ padding: '5px' }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-blue-900 mb-2"
                      style={{ padding: '5px' }}
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required={!formData.isAnonymous}
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/90 text-blue-900 font-medium"
                      placeholder="your.email@example.com"
                      style={{ padding: '5px' }}
                    />
                  </div>
                </div>
              )}

              {/* Structured Questions */}
              <div className="space-y-6 border-t-2 border-blue-200 pt-6" style={{ padding: '5px' }}>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent" style={{ padding: '5px' }}>
                  Evaluation Questions
                </h2>

                <StarRating
                  name="userExperienceRating"
                  label="Overall User Experience"
                  value={formData.userExperienceRating}
                  onChange={(value) => handleRatingChange('userExperienceRating', value)}
                />

                <StarRating
                  name="easeOfUseRating"
                  label="Ease of Use"
                  value={formData.easeOfUseRating}
                  onChange={(value) => handleRatingChange('easeOfUseRating', value)}
                />

                <StarRating
                  name="translationUsefulness"
                  label="Translation Feature Usefulness"
                  value={formData.translationUsefulness}
                  onChange={(value) => handleRatingChange('translationUsefulness', value)}
                />

                <StarRating
                  name="analysisUsefulness"
                  label="Grammar Analysis Feature Usefulness"
                  value={formData.analysisUsefulness}
                  onChange={(value) => handleRatingChange('analysisUsefulness', value)}
                />

                <div>
                  <label
                    htmlFor="wouldRecommend"
                    className="block text-sm font-semibold text-blue-900 mb-2"
                    style={{ padding: '5px' }}
                  >
                    Would you recommend this app to others?
                  </label>
                  <select
                    id="wouldRecommend"
                    name="wouldRecommend"
                    value={formData.wouldRecommend}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/90 text-blue-900 font-medium"
                    style={{ padding: '5px' }}
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Maybe">Maybe</option>
                  </select>
                </div>
              </div>

              {/* Open Feedback */}
              <div className="border-t-2 border-blue-200 pt-6" style={{ padding: '5px' }}>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-blue-900 mb-2"
                  style={{ padding: '5px' }}
                >
                  Additional Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/90 text-blue-900 font-medium resize-y"
                  placeholder="Share your thoughts, suggestions, or any other feedback..."
                  style={{ padding: '5px' }}
                />
              </div>

              {/* Submit Status */}
              {submitStatus && (
                <div
                  className={`p-4 rounded-lg ${
                    submitStatus === 'success'
                      ? 'bg-green-50 border-2 border-green-200 text-green-800'
                      : 'bg-red-50 border-2 border-red-200 text-red-800'
                  }`}
                  style={{ padding: '5px' }}
                >
                  <p className="font-semibold" style={{ padding: '5px' }}>{submitMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                variant="gradient"
                style={{ padding: '5px' }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2" style={{ padding: '5px' }}>
                    <LoadingSpinner size="sm" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}

