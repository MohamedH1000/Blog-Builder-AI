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
- Complete Docker infrastructure for production deployment
- AWS deployment scripts and CodeBuild configuration

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components, React Query
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Scheduling**: node-cron for daily article generation
- **Build**: Vite (frontend), esbuild (backend bundling)
- **Deployment**: Docker, Docker Compose, AWS ECR/EC2

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
├── infra/                  # Infrastructure configuration
│   ├── buildspec.yml       # AWS CodeBuild configuration
│   └── scripts/            # EC2 init and deploy scripts
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Production Docker Compose (requires .env)
├── docker-compose.dev.yml  # Development database only
```

## API Endpoints
- `GET /api/articles` - Get all articles (sorted by newest first)
- `GET /api/articles/:id` - Get a single article by ID
- `POST /api/articles/generate` - Manually generate a new article

## Database Schema
- **articles**: id, title, excerpt, content, topic, readingTime, createdAt
- **users**: id, username, password (for future auth)

## Running the Application

### Development
```bash
npm install
npm run db:push
npm run dev
```
Application runs at http://localhost:5000

### Production Build
```bash
npm run build      # Creates dist/index.cjs and dist/public/
npm run start      # Starts production server
```

### Docker Deployment
```bash
# Set required environment variables
export POSTGRES_PASSWORD=secure_password
export SESSION_SECRET=$(openssl rand -hex 32)

# Build and run
docker-compose up --build
```

## Architecture Decisions
- Using pre-built article templates instead of live AI API calls for reliability and cost-free operation
- Articles are seeded on first startup, then one new article is generated daily at midnight
- React Query handles all data fetching with caching and error handling
- Dark mode support with localStorage persistence
- Multi-stage Docker build: builds in Node 20 Alpine, bundles server with esbuild, copies dist to minimal production image
- Environment validation: docker-compose requires POSTGRES_PASSWORD and SESSION_SECRET via ${VAR:?error} syntax
