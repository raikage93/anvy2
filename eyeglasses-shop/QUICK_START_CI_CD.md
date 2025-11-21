# ⚡ Quick Start: CI/CD Setup

Hướng dẫn nhanh để setup CI/CD auto-deploy trong 5 phút.

## 🎯 Mục Tiêu

Mỗi khi bạn `git push origin main`, ứng dụng sẽ tự động deploy lên VPS.

---

## 📝 Checklist

### 1. Trên VPS (5 phút)

```bash
# SSH vào VPS
ssh root@YOUR_VPS_IP

# Clone repository (nếu chưa có)
cd /var/www
git clone YOUR_REPO_URL eyeglasses-shop
cd eyeglasses-shop

# Make deploy script executable
chmod +x deploy.sh

# Test deployment
./deploy.sh
```

### 2. Tạo SSH Key (2 phút)

```bash
# Trên local machine
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy
# Nhấn Enter khi hỏi passphrase (để tự động)

# Copy public key lên VPS
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@YOUR_VPS_IP

# Test connection
ssh -i ~/.ssh/github_actions_deploy root@YOUR_VPS_IP
```

### 3. Setup GitHub Secrets (3 phút)

1. Vào GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Thêm các secrets:

| Secret Name | Value |
|------------|-------|
| `VPS_HOST` | IP của VPS (ví dụ: `123.456.789.0`) |
| `VPS_USER` | `root` (hoặc user khác) |
| `VPS_SSH_KEY` | Nội dung private key: `cat ~/.ssh/github_actions_deploy` |
| `VPS_PORT` | `22` (hoặc port SSH khác) |

### 4. Push Code (1 phút)

```bash
# Commit và push
git add .
git commit -m "Add CI/CD workflow"
git push origin main
```

### 5. Kiểm Tra (1 phút)

1. Vào GitHub → **Actions** tab
2. Xem workflow đang chạy
3. Đợi deployment hoàn thành
4. Truy cập `http://YOUR_VPS_IP` để verify

---

## ✅ Done!

Từ giờ, mỗi khi bạn push code lên `main`, nó sẽ tự động deploy! 🎉

---

## 🆘 Troubleshooting

### Lỗi SSH?
```bash
# Kiểm tra key đã được thêm vào VPS chưa
ssh root@YOUR_VPS_IP "cat ~/.ssh/authorized_keys | grep github-actions"
```

### Lỗi Git?
```bash
# Trên VPS, kiểm tra remote
cd /var/www/eyeglasses-shop
git remote -v
```

### Xem chi tiết?
Xem file `CI_CD_SETUP.md` để có hướng dẫn đầy đủ.

---

## 📚 Files Created

- ✅ `.github/workflows/deploy.yml` - Simple workflow
- ✅ `.github/workflows/deploy-advanced.yml` - Advanced workflow với tests
- ✅ `deploy.sh` - Deployment script
- ✅ `CI_CD_SETUP.md` - Hướng dẫn chi tiết

