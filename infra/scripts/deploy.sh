#!/bin/bash
# EC2 Deployment Script
# Pulls latest Docker image from ECR and deploys the application

set -e

# Configuration
APP_DIR="/opt/aiblog"
ENV_FILE="$APP_DIR/.env"
COMPOSE_FILE="$APP_DIR/docker-compose.prod.yml"

echo "=========================================="
echo "AI Blog - Deployment Script"
echo "=========================================="

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found at $ENV_FILE"
    echo "Please copy .env.template to .env and configure it"
    exit 1
fi

# Load environment variables
set -a
source "$ENV_FILE"
set +a

# Validate required AWS variables
if [ -z "$AWS_ACCOUNT_ID" ] || [ -z "$AWS_DEFAULT_REGION" ] || [ -z "$IMAGE_REPO_NAME" ]; then
    echo "Error: Missing required AWS environment variables"
    echo "Required: AWS_ACCOUNT_ID, AWS_DEFAULT_REGION, IMAGE_REPO_NAME"
    exit 1
fi

# Validate production secrets
if [ -z "$SESSION_SECRET" ] || [ "$SESSION_SECRET" = "your_session_secret_here" ]; then
    echo "Error: SESSION_SECRET must be set to a secure value"
    echo "Generate one with: openssl rand -hex 32"
    exit 1
fi

if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" = "postgres" ]; then
    echo "Warning: POSTGRES_PASSWORD should be set to a secure value for production"
fi

REPOSITORY_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME"

echo "Repository: $REPOSITORY_URI"
echo ""

# Login to ECR
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region "$AWS_DEFAULT_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"

# Pull latest image
echo "Pulling latest image..."
docker pull "$REPOSITORY_URI:latest"

# Create docker-compose.prod.yml with environment variable references (not literal values)
echo "Creating production docker-compose file..."
cat > "$COMPOSE_FILE" << 'EOF'
version: '3.8'

services:
  app:
    image: ${REPOSITORY_URI}:latest
    ports:
      - "80:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/aiblog
      - SESSION_SECRET=${SESSION_SECRET}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - aiblog-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=aiblog
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    networks:
      - aiblog-network

volumes:
  postgres_data:

networks:
  aiblog-network:
    driver: bridge
EOF

# Replace REPOSITORY_URI placeholder with actual value
sed -i "s|\${REPOSITORY_URI}|$REPOSITORY_URI|g" "$COMPOSE_FILE"

# Stop existing containers
echo "Stopping existing containers..."
cd "$APP_DIR"
docker-compose -f "$COMPOSE_FILE" down --remove-orphans || true

# Export variables for docker-compose
export POSTGRES_PASSWORD
export SESSION_SECRET

# Start new containers
echo "Starting new containers..."
docker-compose -f "$COMPOSE_FILE" up -d

# Wait for health check
echo "Waiting for application to be healthy..."
sleep 15

# Check if app is running
if curl -s http://localhost/api/articles > /dev/null; then
    echo ""
    echo "=========================================="
    echo "Deployment Successful!"
    echo "=========================================="
    echo ""
    PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_PUBLIC_IP')
    echo "Application is running at: http://$PUBLIC_IP"
    echo ""
else
    echo ""
    echo "Warning: Health check failed. Check container logs:"
    echo "  docker-compose -f $COMPOSE_FILE logs app"
    echo "  docker-compose -f $COMPOSE_FILE logs db"
fi

# Cleanup old images
echo "Cleaning up old Docker images..."
docker image prune -f
