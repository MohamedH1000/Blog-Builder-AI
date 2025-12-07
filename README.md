# AI Blog - Auto-Generated Blog Application

A full-stack auto-generated blog application that automatically creates and publishes AI-generated articles daily. Built with React, Node.js/Express, and PostgreSQL.

## Features

- **Auto-Generated Content**: AI-powered article generation with template-based content
- **Daily Updates**: Automatic daily article generation via scheduled tasks
- **Clean UI**: Modern, responsive design optimized for reading
- **Dark Mode**: Built-in theme switching
- **Containerized**: Docker support for easy deployment

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or Docker)

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Using Docker

```bash
# Option 1: Full Docker setup (builds and runs app + database)
docker-compose up --build

# Option 2: Database only (for local development)
docker-compose -f docker-compose.dev.yml up -d

# Update .env to connect to Docker database:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aiblog_dev

# Push schema and start dev server
npm run db:push
npm run dev
```

### Production Build

```bash
# Build the application (client + server)
npm run build

# Start production server
npm run start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | Get all articles |
| GET | `/api/articles/:id` | Get single article |
| POST | `/api/articles/generate` | Generate new article |

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types/schemas
├── infra/           # AWS infrastructure configs
└── docs/            # Documentation
```

## Deployment to AWS

### Prerequisites

1. AWS Account with ECR and EC2 access
2. Docker installed on EC2 instance
3. AWS CLI configured

### Step-by-Step

1. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name aiblog
   ```

2. **Set Up CodeBuild**
   - Create a project pointing to your GitHub repo
   - Use `infra/buildspec.yml`
   - Enable privileged mode for Docker builds

3. **Deploy to EC2**
   ```bash
   # On your EC2 instance
   bash infra/scripts/init-ec2.sh
   
   # Configure .env file
   cp /opt/aiblog/.env.template /opt/aiblog/.env
   nano /opt/aiblog/.env
   
   # Deploy
   bash infra/scripts/deploy.sh
   ```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed documentation.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Infrastructure**: Docker, AWS (EC2, ECR, CodeBuild)

## License

MIT
