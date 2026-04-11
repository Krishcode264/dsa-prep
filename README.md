# DSA Prep Tracker

A high-performance, brutalist-designed Data Structures and Algorithms (DSA) tracking system. Built for efficiency, prioritization, and long-term interview preparation.

## 🚀 Overview

DSA Prep Tracker is a full-stack application designed to help developers track their problem-solving progress with a focus on **interview frequency**, **difficulty distribution**, and **topic mastery**. 

### Key Features
- **Brutalist UI**: High-contrast, minimalist design with a "White/Dark" charcoal theme.
- **Priority Tracking**: Integration of company-specific question frequencies to prioritize high-signal problems.
- **Detailed Analytics**: Real-time charts showing difficulty ratios, recent activity, and company breakdowns.
- **Secure Auth**: Full Email/Password authentication with persistent sessions.
- **Centralized Knowledge**: A dedicated "Question Detail Modal" providing all context (links, companies, topics) without disrupting the list flow.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS (v4), Zustand/Context State Management.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL (Neon/Local) with raw SQL for high-performance data patterns.
- **Styling**: Vanilla CSS Variables + Tailwind for a robust, theme-aware design system.

## 📦 Project Structure

```text
├── client/          # Vite + React Frontend
├── server/          # Express + Node Backend
└── scripts/         # Automation & Data Migration tools (Ignored)
```

## 🛠 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1.  **Clone the repository**
2.  **Server Setup**
    ```bash
    cd server
    npm install
    # Create .env with DATABASE_URL
    npm run dev
    ```
3.  **Client Setup**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## 🚀 Deployment

Both the client and server are configured for production:

- **Server**: Build with `npm run build` to generate the `dist/` directory, then run with `npm start`.
- **Client**: Build with `npm run build` to generate optimized static assets in the `dist/` directory.

## 🛡 License
Internal Use - Optimized for advanced DSA tracking and interview prep.
