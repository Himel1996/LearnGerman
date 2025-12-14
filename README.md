# Learn German

An AI-powered web application for learning German through advanced translation and comprehensive grammar analysis. Master German with intelligent tools that provide detailed grammatical breakdowns, vocabulary explanations, and accurate translations.

![Learn German](https://img.shields.io/badge/Learn-German-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red)

## 🌟 Features

### 1. **Translate to German**
- **AI-Powered Translation**: Uses DeepL API for accurate, context-aware translations
- **Text-to-Speech**: Listen to German translations with correct pronunciation
- **Quick Analysis**: Direct link to analyze translated text for grammar breakdown
- **Multi-language Support**: Translate from any language to German

### 2. **Analyze German Text**
- **Sentence Segmentation**: Automatically breaks down passages into individual sentences
- **Detailed Grammar Analysis**: 
  - Case analysis (Nominative, Accusative, Dative, Genitive)
  - Tense identification
  - Word order explanations
  - Sentence structure breakdown
- **Vocabulary Breakdown**: German words with English translations
- **English Translation**: Understand the meaning of German sentences
- **Text-to-Speech**: Listen to German sentences with proper pronunciation
- **Smart Caching**: LRU cache system prevents duplicate API calls for the same sentence

### 3. **User Feedback System**
- **Structured Feedback Form**: Comprehensive evaluation system for research purposes
  - Overall user experience rating (1-5 stars)
  - Ease of use rating
  - Feature usefulness ratings
  - Recommendation options
  - Open-ended feedback
- **Anonymous Submission**: Option to submit feedback without personal information
- **Public Feedback View**: View anonymous feedback from other users
- **Database Storage**: All feedback stored securely in Vercel Postgres

### 4. **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful Gradients**: Blue-themed design with animated background elements
- **Intuitive Navigation**: Easy-to-use menu bar accessible from all pages
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- API keys for:
  - DeepL API (for translation)
  - Groq API (for grammar analysis - free tier available)
  - Vercel Postgres (for feedback storage - free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd LearnGerman
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # DeepL API (Required for translation)
   DEEPL_API_KEY=your_deepl_api_key
   DEEPL_API_URL=https://api-free.deepl.com/v2/translate
   
   # Groq API (Required for grammar analysis - Free tier available)
   GROQ_API_KEY=your_groq_api_key
   
   # Vercel Postgres (Required for feedback storage)
   # These are automatically set when deploying to Vercel
   POSTGRES_URL=your_postgres_url
   POSTGRES_PRISMA_URL=your_postgres_prisma_url
   POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
   POSTGRES_USER=your_postgres_user
   POSTGRES_HOST=your_postgres_host
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DATABASE=your_postgres_database
   ```

4. **Set up the database**
   
   If deploying to Vercel:
   - Create a Postgres database in your Vercel project
   - Run the SQL migration from `sql/init.sql` in your Vercel Postgres dashboard
   
   See `VERCEL_POSTGRES_SETUP.md` for detailed instructions.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guidelines

### Using the Translation Feature

1. **Navigate to Translate Page**
   - Click "Translate" from the menu or home page
   - Or use the direct link: `/translate`

2. **Enter Your Text**
   - Type or paste the text you want to translate into German
   - The text can be in any language

3. **Translate**
   - Click the "Translate" button
   - Wait for the AI to process your text
   - View the German translation below

4. **Listen to Pronunciation**
   - Click the speaker icon next to the translation
   - Listen to the correct German pronunciation

5. **Analyze Translation** (Optional)
   - Click "Analyse Text" button
   - Opens analysis page with the translated text pre-filled
   - Get detailed grammar breakdown

### Using the Grammar Analysis Feature

1. **Navigate to Analysis Page**
   - Click "Analyse" from the menu or home page
   - Or use the direct link: `/analyze`

2. **Enter German Text**
   - Type or paste German text (single sentence or multiple sentences)
   - The app will automatically segment it into sentences

3. **Analyze**
   - Click "Analyse German text" button
   - View the segmented sentences

4. **Get Detailed Analysis**
   - Click on any sentence to see:
     - English translation
     - Detailed grammatical analysis
     - Vocabulary breakdown with translations
   - Click the speaker icon to hear pronunciation

5. **Model Selection**
   - Choose between Groq (free) or OpenAI (premium, currently disabled for demo)
   - Groq is recommended for free usage

### Submitting Feedback

1. **Navigate to Feedback Page**
   - Click "Submit Feedback" from the menu
   - Or use the direct link: `/submit-feedback`

2. **Choose Submission Type**
   - Select "Submit anonymously" if you don't want to share personal information
   - Or provide your name and email (optional if anonymous)

3. **Complete Evaluation**
   - Rate your experience (1-5 stars) for:
     - Overall User Experience
     - Ease of Use
     - Translation Feature Usefulness
     - Grammar Analysis Feature Usefulness
   - Select whether you would recommend the app
   - Provide additional feedback in the text area

4. **Submit**
   - Click "Submit Feedback"
   - Your feedback helps improve the app!

### Viewing Public Feedback

1. **Navigate to Feedback View**
   - Click "View Feedback" from the menu
   - Or use the direct link: `/feedback`

2. **Browse Feedback**
   - View anonymous feedback from other users
   - See when feedback was submitted
   - Get insights from the community

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Translation API**: DeepL
- **Grammar Analysis**: Groq (LLM) - Free tier
- **Database**: Vercel Postgres
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
LearnGerman/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── analyze/      # Grammar analysis endpoint
│   │   ├── translate/    # Translation endpoint
│   │   └── feedback/     # Feedback endpoints
│   ├── analyze/          # Grammar analysis page
│   ├── translate/        # Translation page
│   ├── feedback/         # View feedback page
│   ├── submit-feedback/  # Submit feedback page
│   ├── contact/          # Contact page
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/              # UI components (Button, Card, Modal, etc.)
│   ├── NavMenu.tsx      # Navigation menu
│   ├── Footer.tsx       # Footer component
│   └── SentenceSegment.tsx
├── lib/                  # Utility functions
│   ├── deepl.ts         # DeepL API integration
│   ├── groq.ts          # Groq API integration
│   ├── db.ts            # Database utilities
│   └── text-segmentation.ts
├── sql/                  # Database migrations
│   └── init.sql         # Initial schema
├── styles/               # Global styles
│   └── globals.css
└── public/               # Static assets
    └── GermanFlag.png
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

### Deploying to Vercel

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Set environment variables**
   - Add all required API keys in Vercel dashboard
   - Environment variables section

4. **Set up Vercel Postgres**
   - Go to Storage tab
   - Create Postgres database
   - Run SQL migration from `sql/init.sql`

5. **Deploy**
   - Vercel will automatically deploy on push
   - Your app will be live!

See `VERCEL_POSTGRES_SETUP.md` for detailed database setup instructions.

## 📊 API Endpoints

### POST `/api/translate`
Translates text to German using DeepL API.

**Request:**
```json
{
  "text": "Hello, how are you?",
  "targetLang": "de"
}
```

**Response:**
```json
{
  "translation": "Hallo, wie geht es dir?"
}
```

### POST `/api/analyze`
Analyzes German sentence for grammar, vocabulary, and translation.

**Request:**
```json
{
  "sentence": "Ich lerne Deutsch.",
  "model": "groq"
}
```

**Response:**
```json
{
  "translation": "I am learning German.",
  "grammar": "Detailed grammatical analysis...",
  "vocabulary": [
    {"german": "Ich", "english": "I"},
    {"german": "lerne", "english": "learn"},
    {"german": "Deutsch", "english": "German"}
  ]
}
```

### POST `/api/feedback`
Submits user feedback.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great app!",
  "isAnonymous": false,
  "userExperienceRating": 5,
  "easeOfUseRating": 5,
  "translationUsefulness": 5,
  "analysisUsefulness": 5,
  "wouldRecommend": "Yes"
}
```

### GET `/api/feedback/get`
Retrieves anonymous feedback entries.

## 🤝 Contributing

We welcome contributions! This app is designed for research and educational purposes. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 Feedback & Support

**Your feedback is invaluable!** We're continuously working to improve this application.

### Ways to Provide Feedback:

1. **Structured Feedback Form**
   - Navigate to "Submit Feedback" from the menu
   - Complete the evaluation form
   - Help us understand your experience

2. **Contact Page**
   - Visit the Contact page for developer information
   - Find links to the developer's website

3. **View Community Feedback**
   - Check out what other users are saying
   - Navigate to "View Feedback" from the menu

### Why Your Feedback Matters:

- **Research Purposes**: This app is part of ongoing research in language learning technology
- **Improvement**: Your feedback directly influences future updates
- **Feature Development**: Help us prioritize new features
- **User Experience**: Share what works and what doesn't

**We appreciate every piece of feedback!** 🎉

## 👤 Developer

**Himel Ghosh**

- Website: [https://himelghosh.vercel.app/](https://himelghosh.vercel.app/)
- Contact: Available through the Contact page in the app

## 📄 License

© Himel Ghosh 2026. All Rights Reserved.

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- DeepL for translation API
- Groq for free LLM access
- Vercel for hosting and database services
- Next.js team for the amazing framework
- All users who provide valuable feedback

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [DeepL API Documentation](https://www.deepl.com/docs-api)
- [Groq API Documentation](https://console.groq.com/docs)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)

---

**Made with ❤️ for German language learners**

*Last updated: 2026*

