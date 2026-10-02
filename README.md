# The Habit Tracker — Modern Dark Habit Journal & Tracker

The Habit Tracker is a modern, dark-themed monthly habit tracking application built with **Next.js 16 (App Router)**, **TypeScript**, **MongoDB (Mongoose)**, **NextAuth.js (Google OAuth)**, **Tailwind CSS v4**, and **Framer Motion**.

It bridges the structure of a monthly habit tracking spreadsheet with the interactivity, speed, and aesthetics of a modern web application.

---

## 🌟 Key Features

- **Google OAuth Authentication**: Secure login backed by strict server-side user data isolation.
- **Dynamic Monthly Calendar Engine**:
  - Automatically calculates days, leap years, and weekday names.
  - Dynamically groups days into weeks (Week 1 to Week 5).
  - Highlights today's date and prevents accidental check-ins on future dates.
  - Month & Year navigation (previous/next month, jump to today).
- **Habit Management**: Create, edit, archive, and permanently delete habits with custom emoji icons and color tags.
- **Optimistic Check-ins**: Lightning-fast check-in toggles with real-time UI updates, automated rollback on network failure, and animated progress feedback.
- **Dynamic Streak & Stats System**: Calculates current streaks, longest streaks, monthly progress percentages, and total check-ins in real time.
- **Analytics Dashboard (`/analytics`)**:
  - Summary KPI metrics (Overall Rate, Total Check-ins, Streak stats, Best Habit).
  - Day-of-Week completion activity bar chart.
  - Weekly progress trend indicators.
  - Ranked habit performance breakdown.
- **Premium Dark SaaS Aesthetic**: Obsidian backdrop (`#0a0a0a`), subtle glassmorphism (`backdrop-blur-xl`), animated shimmer skeletons, and smooth Framer Motion micro-interactions.
- **Accessibility & Responsive Design**: Full mobile horizontal scrolling with sticky habit column shadows, touch-friendly targets (min 44px), screen reader ARIA attributes, keyboard navigation, and reduced-motion support.

---

## 🛠️ Architecture & Technology Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend**: Next.js Server Components, Server Actions, and API Route Handlers
- **Database**: MongoDB with Mongoose ORM & MongoDB Atlas indexing
- **Authentication**: NextAuth.js (Google OAuth provider with JWT sessions)
- **Testing & Quality**: Vitest, ESLint, TypeScript (`tsc --noEmit`)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/habitflow`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.
- **Google Cloud Console Account**: For Google OAuth Client ID & Secret.

---

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/harshverma-25/habit-tracker.git
cd habit-tracker
npm install
```

---

### 2. Configure Environment Variables

Create a `.env` file in the root directory (copying from `.env.example`):

```bash
cp .env.example .env
```

Fill in your environment values:

```env
# Application URL
NEXTAUTH_URL=http://localhost:3000

# NextAuth Secret (generate via `openssl rand -base64 32`)
NEXTAUTH_SECRET=your_nextauth_secret_here_min_32_chars

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/habitflow
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/habitflow?retryWrites=true&w=majority
```

---

### 3. Setting Up Google OAuth Credentials

1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Application type: *Web application*).
3. Add Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
4. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`
5. Copy the **Client ID** and **Client Secret** into your `.env` file.

---

### 4. Running the Application

#### Development Mode:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Running Tests:
```bash
npx vitest run
```

#### Running TypeScript Checks:
```bash
npx tsc --noEmit
```

#### Running Code Quality Linter:
```bash
npm run lint
```

#### Building for Production:
```bash
npm run build
npm start
```

---

## 🗄️ Database Schema & Indexing

The Habit Tracker uses three primary MongoDB collections with compound indexes for performance and data integrity:

1. **`User` Collection**:
   - `email` (Unique index)
2. **`Habit` Collection**:
   - `userId` (Ref to User, Indexed)
   - `isArchived` (Indexed)
   - Compound Index: `{ userId: 1, isArchived: 1 }`
3. **`HabitCompletion` Collection**:
   - `habitId`, `userId`, `date` (YYYY-MM-DD string)
   - Compound Unique Index: `{ userId: 1, habitId: 1, date: 1 }` (Prevents duplicate completion entries)
   - Range Query Index: `{ userId: 1, date: 1 }` (Optimizes monthly completion queries)

---

## 🔒 Security & User Isolation

- **Server-Side Verification**: Every database query resolves the user identity directly from the authenticated server session (`getServerSession(authOptions)`).
- **No Client Trust**: Client-submitted `userId` parameters are never trusted.
- **Sanitized Inputs**: Habit names, descriptions, and date strings are trimmed and validated on the server.
- **Secrets Protection**: Environment variables containing database URIs and OAuth secrets are listed in `.gitignore` to prevent leaks.

---

## 🚀 Deployment Guide (Vercel)

1. Push code repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set the Environment Variables (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MONGODB_URI`) in the Vercel project settings.
4. Update Authorized Redirect URIs in Google Cloud Console with your production Vercel URL (`https://your-app.vercel.app/api/auth/callback/google`).
5. Deploy!

---

## 📄 License

This project is licensed under the MIT License.
