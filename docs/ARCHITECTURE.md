# AI Blog - Architecture Documentation

## Overview

AI Blog is a full-stack auto-generated blog application that automatically creates and publishes AI-generated articles daily. The application is containerized with Docker and designed for deployment on AWS EC2.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AWS EC2 Instance                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Docker Network                      │  │
│  │  ┌─────────────────┐     ┌─────────────────────────┐  │  │
│  │  │   AI Blog App   │     │    PostgreSQL 15        │  │  │
│  │  │   (Node.js)     │────▶│    (Database)           │  │  │
│  │  │   Port 5000     │     │    Port 5432            │  │  │
│  │  └─────────────────┘     └─────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Query (TanStack Query)** - Data fetching and caching
- **Wouter** - Client-side routing
- **date-fns** - Date formatting

### Backend
- **Node.js 20** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **node-cron** - Scheduled tasks
- **PostgreSQL 15** - Database

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **AWS ECR** - Container registry
- **AWS CodeBuild** - CI/CD builds
- **AWS EC2** - Hosting

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and API client
│   └── index.html
│
├── server/                 # Backend Express application
│   ├── services/           # Business logic
│   │   ├── aiClient.ts     # AI article generation
│   │   └── articleJob.ts   # Scheduled article creation
│   ├── routes.ts           # API route handlers
│   ├── storage.ts          # Database operations
│   ├── db.ts               # Database connection
│   └── index.ts            # Server entry point
│
├── shared/                 # Shared code between frontend/backend
│   └── schema.ts           # Database schemas and types
│
├── infra/                  # Infrastructure configuration
│   ├── buildspec.yml       # AWS CodeBuild configuration
│   └── scripts/
│       ├── init-ec2.sh     # EC2 initialization script
│       └── deploy.sh       # Deployment script
│
├── docs/                   # Documentation
│   └── ARCHITECTURE.md     # This file
│
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Production compose file
├── docker-compose.dev.yml  # Development compose file
└── README.md               # Project README
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | Get all articles (sorted by newest first) |
| GET | `/api/articles/:id` | Get a single article by ID |
| POST | `/api/articles/generate` | Generate a new AI article on demand |

## Database Schema

### Articles Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| title | TEXT | Article title |
| excerpt | TEXT | Short summary |
| content | TEXT | Full article content |
| topic | TEXT | Article category/topic |
| readingTime | INTEGER | Estimated reading time (minutes) |
| createdAt | TIMESTAMP | Creation timestamp |

## CI/CD Pipeline

### GitHub → CodeBuild → ECR → EC2

1. **Code Push**: Developer pushes code to GitHub
2. **CodeBuild Trigger**: AWS CodeBuild detects the push
3. **Docker Build**: CodeBuild builds the Docker image
4. **ECR Push**: Image is pushed to Amazon ECR
5. **EC2 Deploy**: Manual or automated deployment to EC2

### Setting Up CodeBuild

1. Create an ECR repository named `aiblog`:
   ```bash
   aws ecr create-repository --repository-name aiblog --region us-east-1
   ```

2. Create a CodeBuild project:
   - Source: GitHub repository
   - Buildspec: `infra/buildspec.yml`
   - Environment: Linux, Standard image (aws/codebuild/amazonlinux2-x86_64-standard:5.0)
   - Privileged mode: **Enabled** (required for Docker builds)

3. Add environment variables in CodeBuild:
   | Variable | Value | Type |
   |----------|-------|------|
   | AWS_ACCOUNT_ID | Your 12-digit AWS account ID | Plaintext |
   | AWS_DEFAULT_REGION | us-east-1 (or your region) | Plaintext |

4. Attach IAM policy to CodeBuild role for ECR access:
   - `AmazonEC2ContainerRegistryPowerUser`

### Deploying to EC2

1. Launch an EC2 instance (Amazon Linux 2 or Ubuntu)
2. SSH into the instance
3. Run the init script: `bash infra/scripts/init-ec2.sh`
4. Configure environment variables in `/opt/aiblog/.env`
5. Run the deploy script: `bash infra/scripts/deploy.sh`

## Scheduled Tasks

The application uses `node-cron` for scheduled article generation:

- **Daily Generation**: New article created at midnight (00:00) every day
- **Initial Seeding**: 3 articles created on first startup if database is empty

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| SESSION_SECRET | Session encryption secret | Yes |
| NODE_ENV | Environment (development/production) | Yes |
| PORT | Server port (default: 5000) | No |

## Local Development

### Using Docker Compose
```bash
# Start database only
docker-compose -f docker-compose.dev.yml up -d

# Run the application
npm run dev
```

### Full Docker Setup
```bash
# Build and run everything
docker-compose up --build
```

## Security Considerations

1. **Database**: Use strong passwords in production
2. **Secrets**: Never commit `.env` files to version control
3. **HTTPS**: Use a reverse proxy (nginx) with SSL in production
4. **ECR**: Use IAM roles for ECR access on EC2
5. **Security Groups**: Limit inbound access to necessary ports

## Monitoring

- **Health Check**: `GET /api/articles` endpoint
- **Docker Health**: Built-in health checks in Dockerfile
- **Logs**: `docker-compose logs -f` for container logs

## Scaling Considerations

For higher traffic:
1. Use AWS RDS for managed PostgreSQL
2. Add nginx as reverse proxy with caching
3. Consider AWS Application Load Balancer
4. Move to ECS/Fargate for container orchestration
