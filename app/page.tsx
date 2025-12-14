'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import NavMenu from '@/components/NavMenu';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center p-8 md:p-16 overflow-hidden">
      <NavMenu />
      <div className="w-full max-w-6xl px-8 md:px-12">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image
              src="/GermanFlag.png"
              alt="German Flag"
              width={80}
              height={60}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent mb-4 leading-tight">
            Learn German
          </h1>
          <p className="text-xl md:text-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent font-bold max-w-2xl mx-auto drop-shadow-sm" style={{ margin: 'auto'}}>
            Master German with AI-powered translation and grammar analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <Card className="flex flex-col items-center justify-center text-center min-h-[400px] group cursor-pointer hover:scale-[1.03] transition-all duration-500 animate-fadeIn" style={{ animationDelay: '0.1s' }} onClick={() => router.push('/translate')}>
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-2xl transform group-hover:rotate-6 transition-transform duration-500">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-4">
              Translate to German
            </h2>
            <p className="text-blue-700 font-semibold mb-8 px-6 text-lg leading-relaxed">
              Translate English text into German using advanced AI translation technology
            </p>
            <Button onClick={() => router.push('/translate')} className="w-full max-w-xs">
              Get Started →
            </Button>
          </Card>

          <Card className="flex flex-col items-center justify-center text-center min-h-[400px] group cursor-pointer hover:scale-[1.03] transition-all duration-500 animate-fadeIn" style={{ animationDelay: '0.2s' }} onClick={() => router.push('/analyze')}>
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-600 p-6 rounded-2xl shadow-2xl transform group-hover:rotate-6 transition-transform duration-500">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-4">
              Analyse German Text
            </h2>
            <p className="text-blue-700 font-semibold mb-8 px-6 text-lg leading-relaxed">
              Analyze German sentences for detailed grammar, vocabulary, and meaning breakdown
            </p>
            <Button onClick={() => router.push('/analyze')} variant="gradient" className="w-full max-w-xs">
              Get Started →
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}

