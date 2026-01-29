# 🧾 Smart-Journaling-Assistant

Product Goal To create an easy-to-use, AI-powered journaling app to help users journal consistently and provide meaningful insights.

## 🌟 Features

* **Smart OCR Upload:** Snap a photo or upload a receipt to automatically extract merchant, date, and amount.
* **AI Categorization:** Automatically sorts expenses into 8 distinct categories (Food, Transport, Bills, etc.) using Claude/OpenAI.
* **Budget Management:** Set a monthly spending limit and track your progress with a visual progress bar.
* **Visual Dashboard:** Quick glance at total spending, recent receipts, and simple expenditure charts.
* **PDF Export:** Generate and download professional summaries of your expenses.
* **Secure Auth:** Powered by Supabase Auth for a seamless and secure login experience.

## 🛠 Tech Stack

| Layer          | Technology                               |
| :------------- | :--------------------------------------- |
| **Frontend** | React.js, Next.js (App Router), Tailwind |
| **Backend** | Express.js / Next.js API Routes          |
| **Database** | PostgreSQL via Supabase                  |
| **Auth** | Supabase Auth                            |
| **AI/OCR** | Claude API / OpenAI API                  |
| **Deployment** | Vercel                                   |

## 🚀 Getting Started

### Prerequisites
* Node.js (Latest LTS)
* Supabase Account & Project API Keys
* OpenAI or Anthropic API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/receipt-manager.git](https://github.com/your-username/receipt-manager.git)
   cd receipt-manager
