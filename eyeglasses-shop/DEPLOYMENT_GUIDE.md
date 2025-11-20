# Deployment Guide for Contabo VPS

This guide will walk you through deploying your eyeglasses e-commerce website to a Contabo VPS.

## Prerequisites
- A Contabo VPS (Ubuntu 20.04 or later recommended)
- SSH access to your VPS
- A domain name (optional, but recommended)

---

## Step 1: Connect to Your VPS

```bash
ssh root@your-vps-ip-address
```

Enter your password when prompted.

---

## Step 2: Update the System

```bash
apt update && apt upgrade -y
```

---

## Step 3: Install Node.js and npm

```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Verify installation
node -v
npm -v
```

---

## Step 4: Install Nginx

```bash
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Check status
systemctl status nginx
```

---

## Step 5: Install Git

```bash
apt install -y git
```

---

## Step 6: Create a Deployment User (Optional but Recommended)

```bash
# Create a new user
adduser deploy

# Add to sudo group
usermod -aG sudo deploy

# Switch to the new user
su - deploy
```

---

## Step 7: Upload Your Project to VPS

### Option A: Using Git (Recommended)

```bash
# On your local machine, push your project to GitHub/GitLab
cd /Users/kelvinnguyen/Music/anvy2/eyeglasses-shop
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# On your VPS
cd /var/www
sudo mkdir eyeglasses-shop
sudo chown -R $USER:$USER eyeglasses-shop
git clone YOUR_REPO_URL eyeglasses-shop
cd eyeglasses-shop
```

### Option B: Using SCP (Direct Upload)

```bash
# On your local machine
cd /Users/kelvinnguyen/Music/anvy2
tar -czf eyeglasses-shop.tar.gz eyeglasses-shop/
scp eyeglasses-shop.tar.gz root@your-vps-ip:/var/www/

# On your VPS
cd /var/www
tar -xzf eyeglasses-shop.tar.gz
rm eyeglasses-shop.tar.gz
```

---

## Step 8: Install Dependencies and Build

```bash
cd /var/www/eyeglasses-shop

# Install dependencies
npm install

# Build for production
npm run build
```

This will create a `dist` folder with your production-ready files.

---

## Step 9: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/eyeglasses-shop
```

Paste the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    # Replace with your domain or use your VPS IP
    server_name your-domain.com www.your-domain.com;
    # Or use: server_name your-vps-ip;
    
    root /var/www/eyeglasses-shop/dist;
    index index.html;
    
    # Logs
    access_log /var/log/nginx/eyeglasses-shop-access.log;
    error_log /var/log/nginx/eyeglasses-shop-error.log;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/eyeglasses-shop /etc/nginx/sites-enabled/

# Remove default site if it exists
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Step 10: Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## Step 11: Set Up SSL with Let's Encrypt (Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts
# Certbot will automatically configure Nginx for HTTPS

# Test auto-renewal
certbot renew --dry-run
```

---

## Step 12: Verify Deployment

Visit your website:
- Without SSL: `http://your-vps-ip` or `http://your-domain.com`
- With SSL: `https://your-domain.com`

---

## Step 13: Set Up Auto-Deployment (Optional)

Create a deployment script:

```bash
nano /var/www/eyeglasses-shop/deploy.sh
```

Add:

```bash
#!/bin/bash
cd /var/www/eyeglasses-shop
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
echo "Deployment completed!"
```

Make it executable:

```bash
chmod +x /var/www/eyeglasses-shop/deploy.sh
```

Now you can deploy updates with:

```bash
./deploy.sh
```

---

## Troubleshooting

### Site not loading
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check if port 80 is open
sudo netstat -tlnp | grep :80
```

### Permission issues
```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/eyeglasses-shop/dist

# Fix permissions
sudo chmod -R 755 /var/www/eyeglasses-shop/dist
```

### Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Security Best Practices

1. **Change default SSH port** (optional):
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Change Port 22 to something else
   sudo systemctl restart sshd
   ```

2. **Disable root login**:
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   sudo systemctl restart sshd
   ```

3. **Install Fail2Ban**:
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

4. **Keep system updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## Monitoring

### Check website uptime
```bash
# Install htop for system monitoring
sudo apt install htop
htop
```

### Monitor Nginx access logs
```bash
sudo tail -f /var/log/nginx/eyeglasses-shop-access.log
```

---

## Summary

Your website should now be live! 🎉

- **Website URL**: http://your-domain.com (or http://your-vps-ip)
- **HTTPS URL**: https://your-domain.com (if SSL is configured)
- **Project Location**: /var/www/eyeglasses-shop
- **Nginx Config**: /etc/nginx/sites-available/eyeglasses-shop

For updates, simply:
1. Make changes locally
2. Push to Git repository
3. SSH into VPS
4. Run `./deploy.sh`
