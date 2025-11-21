# 🚀 CI/CD Setup Guide - Auto Deploy to Contabo VPS

Hướng dẫn thiết lập CI/CD để tự động deploy ứng dụng lên Contabo VPS mỗi khi push code lên branch `main`.

## 📋 Tổng Quan

Khi bạn push code lên branch `main`, GitHub Actions sẽ:
1. ✅ Chạy tests và linter
2. ✅ Build ứng dụng
3. ✅ SSH vào VPS
4. ✅ Pull code mới nhất
5. ✅ Rebuild Docker image
6. ✅ Restart containers
7. ✅ Kiểm tra health check

---

## 🔧 Bước 1: Chuẩn Bị VPS

### 1.1. Cài đặt Git trên VPS (nếu chưa có)

```bash
ssh root@YOUR_VPS_IP
apt update
apt install -y git
```

### 1.2. Clone Repository lên VPS

```bash
cd /var/www
git clone YOUR_REPOSITORY_URL eyeglasses-shop
cd eyeglasses-shop

# Nếu repository là private, cần setup SSH key hoặc deploy token
```

### 1.3. Tạo Deployment Script

Script `deploy.sh` đã được tạo sẵn. Đảm bảo nó có quyền thực thi:

```bash
chmod +x /var/www/eyeglasses-shop/deploy.sh
```

### 1.4. Test Deployment Script

```bash
cd /var/www/eyeglasses-shop
./deploy.sh
```

---

## 🔐 Bước 2: Tạo SSH Key cho GitHub Actions

### 2.1. Tạo SSH Key trên Local Machine

```bash
# Tạo SSH key mới (hoặc dùng key có sẵn)
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy

# Nếu muốn không có passphrase (để CI/CD tự động)
# Nhấn Enter khi hỏi passphrase
```

### 2.2. Copy Public Key lên VPS

```bash
# Copy public key lên VPS
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@YOUR_VPS_IP

# Hoặc copy thủ công:
cat ~/.ssh/github_actions_deploy.pub
# Sau đó SSH vào VPS và thêm vào ~/.ssh/authorized_keys
```

### 2.3. Test SSH Connection

```bash
ssh -i ~/.ssh/github_actions_deploy root@YOUR_VPS_IP
# Nếu kết nối thành công, bạn đã setup đúng
```

---

## 🔑 Bước 3: Cấu Hình GitHub Secrets

### 3.1. Truy cập GitHub Repository Settings

1. Vào repository trên GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 3.2. Thêm các Secrets sau:

#### `VPS_HOST`
- **Name**: `VPS_HOST`
- **Value**: IP address của VPS (ví dụ: `123.456.789.0`)

#### `VPS_USER`
- **Name**: `VPS_USER`
- **Value**: Username để SSH (thường là `root`)

#### `VPS_SSH_KEY`
- **Name**: `VPS_SSH_KEY`
- **Value**: Nội dung của **private key** (không phải public key!)
  ```bash
  cat ~/.ssh/github_actions_deploy
  # Copy toàn bộ output, bao gồm cả -----BEGIN và -----END
  ```

#### `VPS_PORT` (Optional)
- **Name**: `VPS_PORT`
- **Value**: SSH port (mặc định là `22`)

### 3.3. Kiểm tra Secrets

Bạn sẽ có các secrets sau:
- ✅ `VPS_HOST`
- ✅ `VPS_USER`
- ✅ `VPS_SSH_KEY`
- ✅ `VPS_PORT` (optional)

---

## 📝 Bước 4: Chọn Workflow File

Có 2 workflow files để chọn:

### Option 1: Simple Workflow (`deploy.yml`)
- ✅ Đơn giản, dễ hiểu
- ✅ Deploy trực tiếp sau khi build
- ✅ Phù hợp cho project nhỏ

### Option 2: Advanced Workflow (`deploy-advanced.yml`)
- ✅ Có bước test riêng
- ✅ Có thể skip tests khi cần
- ✅ Có health check tốt hơn
- ✅ Phù hợp cho project lớn

**Khuyến nghị**: Bắt đầu với `deploy.yml`, sau đó chuyển sang `deploy-advanced.yml` nếu cần.

---

## 🚀 Bước 5: Kích Hoạt CI/CD

### 5.1. Push Code lên GitHub

```bash
# Trên local machine
cd /Users/kelvinnguyen/Music/anvy2/eyeglasses-shop

# Commit và push
git add .
git commit -m "Add CI/CD workflow"
git push origin main
```

### 5.2. Kiểm tra GitHub Actions

1. Vào repository trên GitHub
2. Click tab **Actions**
3. Bạn sẽ thấy workflow đang chạy
4. Click vào workflow run để xem chi tiết

### 5.3. Xem Logs

Trong GitHub Actions, bạn có thể:
- Xem từng bước của deployment
- Xem logs chi tiết
- Debug nếu có lỗi

---

## 🔍 Troubleshooting

### Lỗi: "Permission denied (publickey)"

**Nguyên nhân**: SSH key không đúng hoặc chưa được thêm vào VPS

**Giải pháp**:
```bash
# Kiểm tra public key đã được thêm vào VPS chưa
ssh root@YOUR_VPS_IP "cat ~/.ssh/authorized_keys"

# Nếu chưa có, thêm lại:
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@YOUR_VPS_IP
```

### Lỗi: "Host key verification failed"

**Giuyên nhân**: VPS chưa được thêm vào known_hosts

**Giải pháp**: Workflow `deploy-advanced.yml` đã tự động xử lý. Hoặc thêm vào workflow:
```yaml
- name: Add VPS to known hosts
  run: |
    ssh-keyscan -p ${{ secrets.VPS_PORT || 22 }} ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts
```

### Lỗi: "git pull failed"

**Nguyên nhân**: Repository trên VPS chưa được clone hoặc không có quyền

**Giải pháp**:
```bash
# SSH vào VPS
ssh root@YOUR_VPS_IP

# Kiểm tra repository
cd /var/www/eyeglasses-shop
git remote -v

# Nếu chưa có, clone lại:
cd /var/www
rm -rf eyeglasses-shop
git clone YOUR_REPOSITORY_URL eyeglasses-shop
cd eyeglasses-shop
```

### Lỗi: "Docker compose command not found"

**Nguyên nhân**: Docker Compose chưa được cài đặt trên VPS

**Giải pháp**:
```bash
# Cài đặt Docker Compose plugin
apt update
apt install -y docker-compose-plugin

# Hoặc dùng docker compose (v2)
# Đảm bảo Docker đã được cài đặt
```

### Lỗi: "Port 80 already in use"

**Nguyên nhân**: Nginx hoặc service khác đang dùng port 80

**Giải pháp**: Xem file `TROUBLESHOOTING_NGINX.md`

---

## 🎯 Workflow Options

### Manual Trigger

Bạn có thể trigger deployment thủ công:

1. Vào **Actions** tab trên GitHub
2. Chọn workflow **Deploy to Contabo VPS**
3. Click **Run workflow**
4. Chọn branch và click **Run workflow**

### Skip Tests (Advanced Workflow)

Với `deploy-advanced.yml`, bạn có thể skip tests:

1. Trigger workflow manually
2. Check box **Skip tests**
3. Click **Run workflow**

---

## 🔒 Security Best Practices

### 1. Sử dụng Deploy User thay vì Root

```bash
# Tạo user mới trên VPS
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy

# Setup SSH key cho user này
# Sau đó dùng VPS_USER=deploy trong GitHub Secrets
```

### 2. Giới hạn SSH Access

Chỉ cho phép SSH từ GitHub Actions IPs (khó khăn vì IP thay đổi). Thay vào đó:
- Sử dụng SSH key mạnh
- Disable password authentication
- Sử dụng non-standard SSH port

### 3. Rotate SSH Keys

Định kỳ thay đổi SSH keys:
```bash
# Tạo key mới
ssh-keygen -t ed25519 -C "github-actions-$(date +%Y%m%d)"

# Update trên VPS và GitHub Secrets
```

---

## 📊 Monitoring Deployment

### Xem Deployment History

```bash
# Trên VPS
cd /var/www/eyeglasses-shop
git log --oneline -10

# Xem Docker container history
docker ps -a
```

### Xem Logs

```bash
# GitHub Actions logs
# Vào Actions tab trên GitHub

# VPS logs
docker compose logs -f
```

### Health Check

Sau mỗi deployment, workflow sẽ tự động kiểm tra:
```bash
curl http://localhost
```

---

## 🔄 Rollback

Nếu deployment bị lỗi, rollback về version trước:

```bash
# SSH vào VPS
ssh root@YOUR_VPS_IP

cd /var/www/eyeglasses-shop

# Xem commit history
git log --oneline -5

# Rollback về commit trước
git reset --hard HEAD~1

# Rebuild và restart
docker compose down
docker compose build --no-cache
docker compose up -d
```

Hoặc rollback về commit cụ thể:
```bash
git reset --hard <commit-hash>
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

## 📝 Summary

Sau khi setup xong:

| Item | Value |
|------|-------|
| **Workflow File** | `.github/workflows/deploy.yml` |
| **Trigger** | Push to `main` branch |
| **Deployment Script** | `/var/www/eyeglasses-shop/deploy.sh` |
| **GitHub Secrets** | `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT` |

### Quick Commands

```bash
# Test deployment script manually
ssh root@YOUR_VPS_IP
cd /var/www/eyeglasses-shop
./deploy.sh

# View GitHub Actions
# Vào repository → Actions tab

# View deployment logs on VPS
docker compose logs -f
```

---

## 🎉 Next Steps

1. ✅ Setup GitHub Secrets
2. ✅ Push code lên `main` branch
3. ✅ Kiểm tra GitHub Actions
4. ✅ Verify deployment thành công
5. ✅ Test ứng dụng trên production

**Chúc bạn thành công! 🚀**

