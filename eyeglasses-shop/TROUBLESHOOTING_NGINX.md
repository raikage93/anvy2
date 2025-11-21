# 🔧 Khắc Phục Lỗi: Hiển Thị Trang "Welcome to nginx!" Thay Vì Ứng Dụng

## ❌ Vấn Đề

Khi truy cập `http://YOUR_IP`, bạn thấy trang mặc định của nginx:
```
Welcome to nginx!
If you see this page, the nginx web server is successfully installed and working.
```

## 🔍 Nguyên Nhân

Có 2 nguyên nhân chính:

1. **Nginx đang chạy trên host** và đang phục vụ trang mặc định, chiếm port 80
2. **Docker container không chạy** hoặc không được map đúng port

---

## ✅ Giải Pháp

### Cách 1: Tắt Nginx trên Host (Đơn Giản Nhất)

Nếu bạn chỉ muốn chạy ứng dụng qua Docker mà không cần nginx làm reverse proxy:

```bash
# SSH vào VPS
ssh root@YOUR_VPS_IP

# Kiểm tra nginx có đang chạy không
systemctl status nginx

# Tắt nginx
systemctl stop nginx

# Vô hiệu hóa nginx khởi động cùng hệ thống
systemctl disable nginx

# Kiểm tra port 80 có đang được sử dụng không
netstat -tlnp | grep :80
# hoặc
lsof -i :80

# Nếu có process khác đang dùng port 80, kill nó
# (Thay PID bằng process ID thực tế)
kill -9 PID

# Kiểm tra Docker container có đang chạy không
docker ps

# Nếu container không chạy, khởi động lại
cd /var/www/eyeglasses-shop
docker compose up -d

# Kiểm tra logs
docker compose logs -f
```

Sau đó truy cập lại `http://YOUR_IP` - bạn sẽ thấy ứng dụng của mình.

---

### Cách 2: Cấu Hình Nginx Làm Reverse Proxy (Khuyên Dùng)

Nếu bạn muốn dùng nginx trên host làm reverse proxy (tốt hơn cho SSL và quản lý):

#### Bước 1: Kiểm tra và cập nhật Docker Compose

```bash
cd /var/www/eyeglasses-shop

# Kiểm tra docker-compose.yml
cat docker-compose.yml
```

Nếu port mapping là `80:80`, cần đổi thành `8080:80`:

```bash
nano docker-compose.yml
```

Thay đổi:
```yaml
ports:
  - "8080:80"  # Thay vì "80:80"
```

Lưu và thoát (Ctrl+X, Y, Enter)

#### Bước 2: Khởi động lại Docker container

```bash
docker compose down
docker compose up -d

# Kiểm tra container có chạy không
docker compose ps

# Test xem container có hoạt động không
curl http://localhost:8080
```

#### Bước 3: Cấu hình Nginx làm Reverse Proxy

```bash
# Tạo file cấu hình nginx
nano /etc/nginx/sites-available/eyeglasses-shop
```

Dán nội dung sau (thay `YOUR_VPS_IP` bằng IP thực tế của bạn):

```nginx
server {
    listen 80;
    listen [::]:80;
    
    # Thay YOUR_VPS_IP bằng IP thực tế của VPS
    server_name YOUR_VPS_IP;
    # Hoặc nếu có domain: server_name yourdomain.com www.yourdomain.com;
    
    # Logs
    access_log /var/log/nginx/eyeglasses-shop-access.log;
    error_log /var/log/nginx/eyeglasses-shop-error.log;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (nếu cần)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Lưu và thoát (Ctrl+X, Y, Enter)

#### Bước 4: Kích hoạt cấu hình và xóa trang mặc định

```bash
# Tạo symbolic link
ln -s /etc/nginx/sites-available/eyeglasses-shop /etc/nginx/sites-enabled/

# XÓA trang mặc định (quan trọng!)
rm /etc/nginx/sites-enabled/default

# Kiểm tra cấu hình nginx có đúng không
nginx -t

# Nếu OK, reload nginx
systemctl reload nginx

# Hoặc restart nginx
systemctl restart nginx

# Kiểm tra nginx có chạy không
systemctl status nginx
```

#### Bước 5: Kiểm tra lại

```bash
# Test trên VPS
curl http://localhost

# Hoặc test từ máy local
curl http://YOUR_VPS_IP
```

Bây giờ truy cập `http://YOUR_IP` sẽ thấy ứng dụng của bạn!

---

## 🔍 Kiểm Tra Chi Tiết

### 1. Kiểm tra Docker Container

```bash
# Xem container có chạy không
docker ps

# Xem logs của container
docker compose logs -f

# Kiểm tra health status
docker inspect --format='{{.State.Health.Status}}' eyeglasses-shop

# Test container trực tiếp
curl http://localhost:8080  # Nếu dùng reverse proxy
# hoặc
curl http://localhost:80    # Nếu chạy trực tiếp
```

### 2. Kiểm tra Nginx

```bash
# Xem nginx có chạy không
systemctl status nginx

# Xem cấu hình nginx
nginx -t

# Xem các site đang enabled
ls -la /etc/nginx/sites-enabled/

# Xem logs nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/eyeglasses-shop-error.log
```

### 3. Kiểm tra Port

```bash
# Xem process nào đang dùng port 80
sudo lsof -i :80
# hoặc
sudo netstat -tlnp | grep :80

# Xem process nào đang dùng port 8080
sudo lsof -i :8080
```

### 4. Kiểm tra Firewall

```bash
# Xem firewall rules
ufw status

# Nếu cần, mở port
ufw allow 80/tcp
ufw allow 8080/tcp
```

---

## 🚨 Các Lỗi Thường Gặp

### Lỗi: "Address already in use"

```bash
# Tìm process đang dùng port 80
sudo lsof -i :80

# Kill process (thay PID bằng số thực tế)
sudo kill -9 PID

# Hoặc tắt nginx
sudo systemctl stop nginx
```

### Lỗi: "502 Bad Gateway"

- Kiểm tra Docker container có chạy không: `docker ps`
- Kiểm tra container có listen trên port 8080 không: `curl http://localhost:8080`
- Kiểm tra nginx config: `nginx -t`

### Lỗi: Vẫn thấy trang mặc định

- Đảm bảo đã xóa `/etc/nginx/sites-enabled/default`
- Kiểm tra `server_name` trong nginx config có đúng không
- Reload nginx: `systemctl reload nginx`

---

## 📝 Quick Fix Script

Tạo script để tự động fix:

```bash
nano /root/fix-nginx.sh
```

Dán nội dung:

```bash
#!/bin/bash

echo "🔧 Fixing nginx configuration..."

# Stop nginx
systemctl stop nginx

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Check if docker container is running
if ! docker ps | grep -q eyeglasses-shop; then
    echo "⚠️  Docker container not running. Starting..."
    cd /var/www/eyeglasses-shop
    docker compose up -d
    sleep 5
fi

# Check if nginx config exists
if [ ! -f /etc/nginx/sites-available/eyeglasses-shop ]; then
    echo "⚠️  Nginx config not found. Please create it first."
    exit 1
fi

# Enable site
ln -sf /etc/nginx/sites-available/eyeglasses-shop /etc/nginx/sites-enabled/eyeglasses-shop

# Test nginx config
if nginx -t; then
    echo "✅ Nginx config is valid"
    systemctl start nginx
    systemctl enable nginx
    echo "✅ Nginx started successfully"
else
    echo "❌ Nginx config has errors. Please check."
    exit 1
fi

echo "✅ Done! Test with: curl http://localhost"
```

Chạy:

```bash
chmod +x /root/fix-nginx.sh
/root/fix-nginx.sh
```

---

## ✅ Kết Quả Mong Đợi

Sau khi fix xong:

1. ✅ Truy cập `http://YOUR_IP` sẽ thấy ứng dụng eyeglasses shop
2. ✅ Không còn thấy trang "Welcome to nginx!"
3. ✅ Docker container đang chạy: `docker ps` hiển thị container
4. ✅ Nginx đang chạy và proxy đúng: `systemctl status nginx` = active

---

## 📞 Cần Thêm Trợ Giúp?

Nếu vẫn gặp vấn đề, chạy các lệnh sau và gửi kết quả:

```bash
# System info
echo "=== Docker Status ==="
docker ps
docker compose ps

echo "=== Nginx Status ==="
systemctl status nginx

echo "=== Port Usage ==="
sudo lsof -i :80
sudo lsof -i :8080

echo "=== Nginx Config ==="
ls -la /etc/nginx/sites-enabled/
cat /etc/nginx/sites-available/eyeglasses-shop

echo "=== Docker Logs ==="
docker compose logs --tail=50
```

