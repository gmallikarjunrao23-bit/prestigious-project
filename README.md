# InfraOps — AI-Powered Infrastructure Monitoring SaaS

> Enterprise-grade infrastructure monitoring with AI-powered insights, incident management, and real-time analytics.

## Features

- **Multi-Protocol Monitoring**: HTTP, HTTPS, TCP, UDP, PING, DNS, API, WebSocket
- **AI Incident Commander**: Automatic root cause analysis, recommendations, and predictions
- **Real-time Dashboard**: Dark-first premium UI inspired by Linear, Vercel, Datadog
- **Smart Alerts**: Email, Discord, Slack, Webhook notifications with intelligent deduplication
- **Public Status Pages**: Custom branded status pages for your customers
- **Team Collaboration**: Role-based access control, shared projects
- **UPI Payment Flow**: India-native payment verification with screenshot upload
- **Admin Panel**: Verify payments, manage users, view analytics

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Railway)
- **Cache**: Redis (Railway)
- **AI**: Custom GPT API integration (`r-bots-free-apis.co08.art`)
- **Auth**: NextAuth.js v5 with Credentials + OAuth
- **Deployment**: Docker, Railway, Vercel-ready

## Quick Start

### Local Development

```bash
# 1. Clone and install
git clone <repo>
cd infraops-saas
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your credentials

# 3. Setup database
npx prisma migrate dev
npx prisma generate

# 4. Run dev server
npm run dev

