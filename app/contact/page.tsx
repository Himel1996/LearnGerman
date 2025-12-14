'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NavMenu from '@/components/NavMenu';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          isAnonymous: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmitStatus('success');
      setSubmitMessage('Thank you for your feedback! We appreciate your input.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage(
        err instanceof Error ? err.message : 'An error occurred while submitting feedback'
      );
    } finally {
      setIsSubmitting(false);
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
          <span className="font-semibold" style={{ padding: '5px' }}> Back to Home</span>
        </button>

        <div className="space-y-8" style={{ padding: '5px' }}>
          {/* Developer Info Card */}
          <Card className="p-8 md:p-12" style={{ padding: '5px' }}>
            <div className="text-center mb-8" style={{ padding: '5px' }}>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent mb-4" style={{ padding: '5px' }}>
                Contact Details
              </h1>
            </div>

            <div className="space-y-6 mb-8" style={{ padding: '5px' }}>
              <div className="text-center" style={{ padding: '5px' }}>
                <p className="text-xl md:text-2xl font-bold text-blue-900 mb-4" style={{ padding: '5px' }}>
                  Developed by Himel Ghosh
                </p>
                <a
                  href="https://himelghosh.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors duration-200 hover:underline"
                  style={{ padding: '5px' }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ padding: '5px' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  https://himelghosh.vercel.app/
                </a>
              </div>
            </div>
          </Card>

          {/* Feedback Form Card */}
          <Card className="p-8 md:p-12" style={{ padding: '5px' }}>
            <div className="text-center mb-6" style={{ padding: '5px' }}>
              <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent mb-4" style={{ padding: '5px' }}>
                Submit Feedback
              </h2>
              <p className="text-blue-700 font-semibold mb-6" style={{ padding: '5px' }}>
                Use our structured feedback form for better evaluation
              </p>
              <Button
                onClick={() => router.push('/submit-feedback')}
                variant="gradient"
                className="w-full max-w-md"
                style={{ padding: '5px' }}
              >
                Go to Feedback Form →
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-blue-200" style={{ padding: '5px' }}>
              <h3 className="text-xl font-bold text-blue-900 mb-4 text-center" style={{ padding: '5px' }}>
                Or use the simple form below
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6" style={{ padding: '5px' }}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-blue-900 mb-2"
                  style={{ padding: '5px' }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
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
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/90 text-blue-900 font-medium"
                  placeholder="your.email@example.com"
                  style={{ padding: '5px' }}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-blue-900 mb-2"
                  style={{ padding: '5px' }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/90 text-blue-900 font-medium resize-y"
                  placeholder="Your feedback, suggestions, or questions..."
                  style={{ padding: '5px' }}
                />
              </div>

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

