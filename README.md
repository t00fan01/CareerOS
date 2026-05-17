# 🚀 CareerOS

**CareerOS** is an AI-driven, next-generation career roadmap and application tracker specifically built for IT and Tech students. With a stunning glassmorphic interface and a highly responsive design, CareerOS helps you effortlessly track your job applications, map your skills, and ace your interviews using an integrated Mock Interview Simulator.

## ✨ Features

- **📊 Job Application Tracker:** Visually manage your ongoing applications with real-time Firestore syncing. 
- **⚡ Dynamic Skill Progress:** Add and evaluate your technical skills seamlessly.
- **🤖 AI Mock Interview Simulator:** Generates hard, highly specific 3-question assessments based on your target role, instantly graded with detailed technical explanations from the Google Gemini AI.
- **🎨 Premium UX/UI:** Deep dark mode by default (`zinc-950`), butter-smooth Framer Motion animations, glowing micro-interactions, and a sleek layout.

## 🗺️ Roadmap & Future Plans
The vision for CareerOS extends far beyond the current MVP. The following features are slated for upcoming development phases:

* 🧠 **The Resume AI Engine:** * Upload your resume (PDF) via Firebase Storage.
  * Gemini AI will analyze the text, score it out of 100 based on your target company, and explicitly highlight missing keywords and skills.
* 💬 **The AI Career Mentor:**
  * A persistent, context-aware chatbot acting as an elite tech recruiter.
  * Ask for insider company info, generate custom interview scripts, or seek negotiation advice.
* 📊 **Advanced Analytics Dashboard:**
  * Integration of Recharts/Chart.js to visualize skill progression over time.
  * Funnel charts showing the conversion rate from "Application" to "Offer".
* 📝 **Expanded Interview Simulator:**
  * Transition from MCQs to long-form written technical answers, dynamically graded by AI for accuracy and code efficiency.

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth:** [Firebase](https://firebase.google.com/) (Firestore & Firebase Auth)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/) + [Google Gemini](https://ai.google.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/t00fan01/CareerOS.git
cd CareerOS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Firebase configurations and Gemini API key:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see the application in action!

## 🤝 Contributing
Contributions are welcome! Feel free to fork this project, submit pull requests, or open issues.

---
*Built with ❤️ for ambitious developers to land their dream roles.*
