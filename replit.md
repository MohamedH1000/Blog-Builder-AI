# AI Blog - Auto-Generated Blog Application

## Overview
A full-stack auto-generated blog application that automatically creates and publishes AI-generated articles daily. Built with React, Node.js/Express, and PostgreSQL.

## Current State
- Fully functional MVP with article list and detail views
- PostgreSQL database with Drizzle ORM for article persistence
- Auto-generates 3 initial articles on first run
- Daily article generation scheduled via node-cron (runs at midnight)
- Dark/light theme support
- Responsive design optimized for readability

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components, React Query
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Scheduling**: node-cron for daily article generation

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Home, Article, NotFound)
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and API client
├── server/                 # Backend Express application
│   ├── services/           # Business logic (AI client, article scheduler)
│   ├── routes.ts           # API route handlers
│   ├── storage.ts          # Database storage layer
│   └── db.ts               # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle schema definitions
```

## API Endpoints
- `GET /api/articles` - Get all articles (sorted by newest first)
- `GET /api/articles/:id` - Get a single article by ID

## Database Schema
- **articles**: id, title, excerpt, content, topic, readingTime, createdAt
- **users**: id, username, password (for future auth)

## Running the Application
The application runs on port 5000 with `npm run dev`. The database schema is managed with Drizzle ORM - use `npm run db:push` to sync schema changes.

## Architecture Decisions
- Using pre-built article templates instead of live AI API calls for reliability and cost-free operation
- Articles are seeded on first startup, then one new article is generated daily at midnight
- React Query handles all data fetching with caching and error handling
- Dark mode support with localStorage persistence
