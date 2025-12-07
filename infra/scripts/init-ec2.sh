#!/bin/bash
# EC2 Instance Initialization Script
# Run this on a fresh Amazon Linux 2 or Ubuntu EC2 instance

set -e

echo "=========================================="
echo "AI Blog - EC2 Initialization Script"
echo "=========================================="

# Update system packages
echo "Updating system packages..."
if command -v yum &> /dev/null; then
    sudo yum update -y
    sudo yum install -y docker git
elif command -v apt-get &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y docker.io docker-compose git
fi

# Start Docker service
echo "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose (for Amazon Linux)
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install AWS CLI v2
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
fi

# Create app directory
echo "Creating application directory..."
sudo mkdir -p /opt/aiblog
sudo chown $USER:$USER /opt/aiblog

# Generate a secure session secret
SESSION_SECRET=$(openssl rand -hex 32)

# Create environment file
cat > /opt/aiblog/.env << EOF
# AI Blog Environment Configuration
# Generated on $(date)

# AWS Configuration (required for ECR access)
AWS_ACCOUNT_ID=YOUR_AWS_ACCOUNT_ID
AWS_DEFAULT_REGION=us-east-1
IMAGE_REPO_NAME=aiblog

# Database Configuration
# The app connects to Postgres container via Docker network
POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)

# Session Secret (auto-generated secure value)
SESSION_SECRET=$SESSION_SECRET
EOF

# Create template for reference
cat > /opt/aiblog/.env.template << 'EOF'
# AI Blog Environment Configuration Template
# Copy to .env and fill in values

# AWS Configuration (required)
AWS_ACCOUNT_ID=123456789012
AWS_DEFAULT_REGION=us-east-1
IMAGE_REPO_NAME=aiblog

# Database Configuration
POSTGRES_PASSWORD=your_secure_password_here

# Session Secret (generate with: openssl rand -hex 32)
SESSION_SECRET=your_session_secret_here
EOF

echo "=========================================="
echo "Initialization Complete!"
echo "=========================================="
echo ""
echo "IMPORTANT: Complete these steps before deploying:"
echo ""
echo "1. Log out and log back in (for docker group to take effect)"
echo "   Command: exit && ssh <your-ec2>"
echo ""
echo "2. Configure AWS CLI with your credentials:"
echo "   Command: aws configure"
echo ""
echo "3. Edit the environment file with your AWS Account ID:"
echo "   File: /opt/aiblog/.env"
echo "   - Set AWS_ACCOUNT_ID to your 12-digit account ID"
echo "   - Verify AWS_DEFAULT_REGION matches your ECR region"
echo ""
echo "4. Run the deployment script:"
echo "   Command: bash /opt/aiblog/deploy.sh"
echo "   (You'll need to copy deploy.sh from your repo first)"
echo ""
echo "Secure credentials have been auto-generated in .env"
echo "Review them with: cat /opt/aiblog/.env"
echo ""
