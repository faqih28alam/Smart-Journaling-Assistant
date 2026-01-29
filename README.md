# 📝 Smart Journaling Assistant

An intelligent journaling platform that doesn't just store your thoughts—it understands them. Using AI to "tidy up" messy thoughts, track emotional trends, and provide weekly insights to help you grow.

# 🔗 Links
* ![Live Demo:]()

# 📸 Screenshots
* The Editor (AI Tidy-Up)
* Mood Calendar View
* Weekly Insights Dashboard
 
## 🌟 Features

* **AI Tidy-Up:** Transforms messy, stream-of-consciousness notes into clear, well-structured journal entries using Claude API.
* **Mood Detection:** Automatically detects one of 9 moods from your writing to track your emotional well-being.
* **Auto-Categorization:** Sorts entries into 5 core categories (Personal, Work, Health, etc.) for better organization.
* **Mood Calendar:** A color-coded visual overview of your emotional journey throughout the month.
* **Weekly Insights:** AI-generated summaries that analyze your weekly entries to identify patterns and progress.
* **Smart Search & Filter:** Quickly find past entries by mood, category, or keywords.

## 🛠 Tech Stack

| Layer          | Technology                                     |
| :------------- | :--------------------------------------------- |
| **Frontend** | React.js, Next.js 14 (App Router), TailwindCSS |
| **Backend** | Express.js / Next.js API Routes                |
| **Database** | PostgreSQL (via Supabase)                      |
| **Auth** | Supabase Auth                                  |
| **AI Engine** | Claude API (Anthropic) / OpenAI                |
| **Deployment** | Vercel                                         |

## 🚀 Getting Started

### 1. Project Initialization
This project was started using the standard template:
```bash
npx create-next-app@latest my-project --typescript --tailwind --app
npm install @supabase/supabase-js @anthropic-ai/sdk lucide-react
```
## 📅 Development Timeline
* Day 1-2: Project Setup, Auth integration, and Basic Journal CRUD.
* Day 3-4: AI Tidy-up integration (Before/After view) and Mood Detection.
* Day 5-6: Mood Calendar implementation and Weekly Insights engine.
* Day 7: Final Testing, UI Polishing, and Vercel Deployment.
