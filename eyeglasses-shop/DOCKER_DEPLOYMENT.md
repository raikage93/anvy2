# Docker Deployment Guide for Contabo VPS

This guide will walk you through deploying your eyeglasses e-commerce website to a Contabo VPS using Docker and Docker Compose.

## 📋 Prerequisites

Before you begin, ensure you have:
- A Contabo VPS (Ubuntu 20.04 or later recommended)
- SSH access to your VPS
- A domain name (optional, but recommended for SSL)
- Your project files ready for deployment

---

## 🚀 Step 1: Connect to Your Contabo VPS

```bash
ssh root@YOUR_VPS_IP_ADDRESS
```

Replace `YOUR_VPS_IP_ADDRESS` with your actual Contabo VPS IP address. Enter your password when prompted.

---

## 🔄 Step 2: Update the System

Always start with a system update:

```bash
apt update && apt upgrade -y
```

---

## 🐳 Step 3: Install Docker

Install Docker Engine:

```bash
# Remove old versions (if any) - ignore "unable to locate package" errors, this is normal
apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Install required packages
apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

---

## ✅ Step 4: Start and Enable Docker

```bash
# Start Docker service
systemctl start docker

# Enable Docker to start on boot
systemctl enable docker

# Verify Docker is running
systemctl status docker
```

---

## 📦 Step 5: Install Git

```bash
apt install -y git
```

---

## 🔐 Step 6: Create Deployment Directory

```bash
# Create directory for your application
mkdir -p /var/www/eyeglasses-shop
cd /var/www/eyeglasses-shop
```

---

## 📤 Step 7: Upload Your Project to VPS

### Option A: Using Git (Recommended)

**On your local machine:**

```bash
# Navigate to your project
cd /Users/kelvinnguyen/Music/anvy2/eyeglasses-shop

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for Docker deployment"

# Add your remote repository (GitHub/GitLab/Bitbucket)
git remote add origin YOUR_REPOSITORY_URL

# Push to repository
git push -u origin main
```

**On your VPS:**

```bash
# Clone your repository
cd /var/www
git clone YOUR_REPOSITORY_URL eyeglasses-shop
cd eyeglasses-shop
```

### Option B: Using SCP (Direct Upload)

**On your local machine:**

```bash
# Navigate to project parent directory
cd /Users/kelvinnguyen/Music/anvy2

# Create a tarball (excluding node_modules and dist)
tar --exclude='node_modules' --exclude='dist' --exclude='.git' -czf eyeglasses-shop.tar.gz eyeglasses-shop/

# Upload to VPS
scp eyeglasses-shop.tar.gz root@YOUR_VPS_IP:/var/www/

# Clean up local tarball
rm eyeglasses-shop.tar.gz
```

**On your VPS:**

```bash
cd /var/www
tar -xzf eyeglasses-shop.tar.gz
rm eyeglasses-shop.tar.gz
cd eyeglasses-shop
```

### Option C: Using rsync (Best for Updates)

**On your local machine:**

```bash
rsync -avz --exclude='node_modules' --exclude='dist' --exclude='.git' \
  /Users/kelvinnguyen/Music/anvy2/eyeglasses-shop/ \
  root@YOUR_VPS_IP:/var/www/eyeglasses-shop/
```

---

## 🏗️ Step 8: Build Docker Image

```bash
cd /var/www/eyeglasses-shop

# Build the Docker image
docker build -t eyeglasses-shop:latest .

# Verify the image was created
docker images
```

---

## 🚢 Step 9: Run with Docker Compose

```bash
# Start the application
docker compose up -d

# Check if container is running
docker compose ps

# View logs
docker compose logs -f
```

To stop viewing logs, press `Ctrl+C`.

---

## ✅ Step 10: Verify Deployment

Check if your application is running:

```bash
# Check container status
docker ps

# Test locally on VPS
curl http://localhost

# Check application health
docker inspect --format='{{.State.Health.Status}}' eyeglasses-shop
```

Now visit your website at: `http://YOUR_VPS_IP`

---

## 🔒 Step 11: Configure Firewall

```bash
# Install UFW if not already installed
apt install -y ufw

# Allow SSH (IMPORTANT - do this first!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS (for SSL later)
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check firewall status
ufw status
```

---

## 🔐 Step 12: Set Up SSL with Let's Encrypt (Optional but Recommended)

### Install Nginx as Reverse Proxy

```bash
# Install Nginx
apt install -y nginx

# Stop Apache if running (it conflicts with Nginx)
systemctl stop apache2 2>/dev/null || true
systemctl disable apache2 2>/dev/null || true

# Stop Nginx temporarily
systemctl stop nginx
```

### Update Docker Compose for SSL

Edit your `docker-compose.yml`:

```bash
nano /var/www/eyeglasses-shop/docker-compose.yml
```

Change the ports section to:

```yaml
    ports:
      - "8080:80"  # Changed from 80:80 to avoid conflict with Nginx
```

Restart Docker container:

```bash
docker compose down
docker compose up -d
```

### Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/eyeglasses-shop
```

Paste the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;
    # Or use your IP: server_name YOUR_VPS_IP;
    
    # Logs
    access_log /var/log/nginx/eyeglasses-shop-access.log;
    error_log /var/log/nginx/eyeglasses-shop-error.log;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/eyeglasses-shop /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Start Nginx
systemctl start nginx
systemctl enable nginx
```

### Install SSL Certificate

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com

# Follow the prompts
# Choose option 2 to redirect HTTP to HTTPS

# Test auto-renewal
certbot renew --dry-run
```

Your website should now be available at: `https://YOUR_DOMAIN.com`

---

## 🔄 Step 13: Create Deployment Script

A deployment script (`deploy.sh`) is already included in the project. Copy it to your VPS:

```bash
# If you uploaded the project, the script should already be there
cd /var/www/eyeglasses-shop

# Make it executable
chmod +x deploy.sh

# Test it
./deploy.sh
```

**Note**: For automatic deployments on every push to `main` branch, see `CI_CD_SETUP.md` for GitHub Actions CI/CD setup.

---

## 📊 Step 14: Useful Docker Commands

### Container Management

```bash
# View running containers
docker compose ps

# View all containers (including stopped)
docker ps -a

# Stop containers
docker compose down

# Start containers
docker compose up -d

# Restart containers
docker compose restart

# View logs
docker compose logs -f

# View logs for specific time
docker compose logs --since 1h

# Execute command in running container
docker compose exec eyeglasses-shop sh
```

### Image Management

```bash
# List images
docker images

# Remove unused images
docker image prune -a

# View image details
docker inspect eyeglasses-shop:latest
```

### Resource Monitoring

```bash
# View resource usage
docker stats

# View detailed container info
docker inspect eyeglasses-shop
```

### Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

---

## 🔍 Step 15: Monitoring and Logs

### View Application Logs

```bash
# Real-time logs
docker compose logs -f

# Last 100 lines
docker compose logs --tail=100

# Logs from last hour
docker compose logs --since=1h
```

### View Nginx Logs (if using reverse proxy)

```bash
# Access logs
tail -f /var/log/nginx/eyeglasses-shop-access.log

# Error logs
tail -f /var/log/nginx/eyeglasses-shop-error.log
```

### System Monitoring

```bash
# Install htop
apt install -y htop

# Run htop
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check Docker disk usage
docker system df
```

---

## 🔄 Step 16: Auto-Deploy Updates

To deploy updates:

1. **Make changes locally** and commit to Git
2. **Push to repository**: `git push origin main`
3. **SSH to VPS**: `ssh root@YOUR_VPS_IP`
4. **Run deployment script**: `cd /var/www/eyeglasses-shop && ./deploy.sh`

---

## 🆘 Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs

# Check if port 80 is already in use
netstat -tlnp | grep :80

# Kill process using port 80
lsof -ti:80 | xargs kill -9
```

### Website not loading

```bash
# Check if container is running
docker compose ps

# Check container health
docker inspect --format='{{.State.Health.Status}}' eyeglasses-shop

# Test locally
curl http://localhost

# Check firewall
ufw status
```

### Build fails

```bash
# Clear Docker cache and rebuild
docker compose down
docker system prune -a
docker build --no-cache -t eyeglasses-shop:latest .
docker compose up -d
```

### Out of disk space

```bash
# Check disk usage
df -h
docker system df

# Clean up Docker
docker system prune -a --volumes

# Remove old logs
journalctl --vacuum-time=7d
```

### SSL certificate issues

```bash
# Check certificate status
certbot certificates

# Renew certificate manually
certbot renew

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## 🔐 Security Best Practices

### 1. Change Default SSH Port (Optional)

```bash
nano /etc/ssh/sshd_config
# Change: Port 22 to Port 2222 (or any other port)
systemctl restart sshd

# Update firewall
ufw allow 2222/tcp
ufw delete allow 22/tcp
```

### 2. Disable Root Login

```bash
# Create a new user first
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy

# Disable root login
nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
systemctl restart sshd
```

### 3. Install Fail2Ban

```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### 4. Set Up Automatic Updates

```bash
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

### 5. Regular Backups

Create a backup script:

```bash
nano /root/backup.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/eyeglasses-shop_$DATE.tar.gz /var/www/eyeglasses-shop

# Keep only last 7 backups
ls -t $BACKUP_DIR/eyeglasses-shop_* | tail -n +8 | xargs rm -f

echo "Backup completed: $BACKUP_DIR/eyeglasses-shop_$DATE.tar.gz"
```

Make it executable and schedule:

```bash
chmod +x /root/backup.sh
crontab -e
# Add: 0 2 * * * /root/backup.sh
```

---

## 📈 Performance Optimization

### Enable Docker BuildKit

```bash
# Add to /etc/environment
echo 'DOCKER_BUILDKIT=1' >> /etc/environment
source /etc/environment
```

### Limit Container Resources

Edit `docker-compose.yml`:

```yaml
services:
  eyeglasses-shop:
    # ... other settings ...
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          memory: 256M
```

---

## 📝 Summary

Your website should now be live! 🎉

| Item | Value |
|------|-------|
| **HTTP URL** | http://YOUR_VPS_IP |
| **HTTPS URL** | https://YOUR_DOMAIN.com |
| **Project Location** | /var/www/eyeglasses-shop |
| **Deployment Script** | /var/www/eyeglasses-shop/deploy.sh |
| **Docker Compose File** | /var/www/eyeglasses-shop/docker-compose.yml |
| **Nginx Config** | /etc/nginx/sites-available/eyeglasses-shop |

### Quick Reference Commands

```bash
# Deploy updates
cd /var/www/eyeglasses-shop && ./deploy.sh

# View logs
docker compose logs -f

# Restart application
docker compose restart

# Check status
docker compose ps

# Stop application
docker compose down

# Start application
docker compose up -d
```

---

## 🎯 Next Steps

1. ✅ Set up SSL certificate with Let's Encrypt
2. ✅ Configure automatic backups
3. ✅ Set up monitoring (consider installing Netdata or Grafana)
4. ✅ **Set up CI/CD pipeline** - See `CI_CD_SETUP.md` for detailed instructions
5. ✅ Set up domain DNS records

---

## 📞 Need Help?

If you encounter any issues:

1. Check the logs: `docker compose logs -f`
2. Verify container status: `docker compose ps`
3. Check system resources: `htop` and `df -h`
4. Review firewall rules: `ufw status`
5. Test connectivity: `curl http://localhost`

Good luck with your deployment! 🚀
