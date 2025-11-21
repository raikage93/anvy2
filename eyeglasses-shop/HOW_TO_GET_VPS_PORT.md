# 🔍 Cách Lấy VPS_PORT cho Contabo VPS

## 📋 Tổng Quan

`VPS_PORT` là SSH port để kết nối vào VPS. Mặc định là **22**, nhưng có thể đã được thay đổi vì lý do bảo mật.

---

## ✅ Cách 1: Kiểm Tra Trên VPS (Chính Xác Nhất)

### SSH vào VPS và kiểm tra:

```bash
# SSH vào VPS bằng port mặc định (22)
ssh root@YOUR_VPS_IP

# Sau khi vào VPS, kiểm tra SSH port đang dùng:
sudo netstat -tlnp | grep sshd
# hoặc
sudo ss -tlnp | grep sshd
# hoặc
sudo lsof -i -P -n | grep sshd
```

Kết quả sẽ hiển thị như:
```
tcp  0  0  0.0.0.0:22  0.0.0.0:*  LISTEN  1234/sshd
```
Số **22** ở đây là SSH port.

### Hoặc kiểm tra file cấu hình SSH:

```bash
# Xem SSH config
sudo cat /etc/ssh/sshd_config | grep Port

# Kết quả có thể là:
# Port 22
# hoặc
# Port 2222
# hoặc
# #Port 22  (nếu comment thì dùng port mặc định 22)
```

---

## ✅ Cách 2: Kiểm Tra Từ Local Machine

### Nếu bạn đã từng SSH vào VPS:

```bash
# Xem SSH config trên local
cat ~/.ssh/config | grep -A 5 YOUR_VPS_IP

# Hoặc kiểm tra known_hosts
cat ~/.ssh/known_hosts | grep YOUR_VPS_IP
```

### Test kết nối với các port phổ biến:

```bash
# Test port 22 (mặc định)
ssh -p 22 root@YOUR_VPS_IP

# Nếu không được, thử port 2222 (phổ biến khi đổi)
ssh -p 2222 root@YOUR_VPS_IP

# Hoặc dùng nmap để scan
nmap -p 22,2222,2200 YOUR_VPS_IP
```

---

## ✅ Cách 3: Kiểm Tra Trong Contabo Control Panel

1. Đăng nhập vào **Contabo Customer Panel**
2. Vào **VPS** → Chọn VPS của bạn
3. Xem thông tin **SSH Access** hoặc **Server Details**
4. Port SSH thường được hiển thị ở đây

**Lưu ý**: Contabo thường dùng port **22** mặc định.

---

## ✅ Cách 4: Kiểm Tra Khi Đang SSH

Nếu bạn đang SSH vào VPS, kiểm tra:

```bash
# Trong terminal đang SSH, chạy:
echo $SSH_CLIENT

# Kết quả sẽ là:
# YOUR_IP PORT VPS_IP 22
# Số thứ 2 là port bạn đang dùng để kết nối
```

---

## 🎯 Kết Luận

### Nếu bạn chưa bao giờ thay đổi SSH port:

**Dùng port `22`** - đây là port mặc định.

### Nếu bạn đã thay đổi SSH port:

1. SSH vào VPS bằng port cũ
2. Chạy: `sudo cat /etc/ssh/sshd_config | grep Port`
3. Lấy số port từ kết quả

---

## 📝 Ví Dụ GitHub Secrets

Sau khi biết port, thêm vào GitHub Secrets:

| Secret Name | Value | Ví dụ |
|------------|-------|-------|
| `VPS_PORT` | SSH port | `22` hoặc `2222` |

**Lưu ý**: Nếu bạn không thêm `VPS_PORT`, workflow sẽ dùng port mặc định `22`.

---

## 🔍 Quick Check Script

Tạo script để tự động tìm port:

```bash
# Trên local machine
nano check_ssh_port.sh
```

```bash
#!/bin/bash

VPS_IP="YOUR_VPS_IP"

echo "🔍 Checking SSH port for $VPS_IP..."

# Common SSH ports
PORTS=(22 2222 2200 22022)

for port in "${PORTS[@]}"; do
    if timeout 2 bash -c "echo > /dev/tcp/$VPS_IP/$port" 2>/dev/null; then
        echo "✅ Port $port is open!"
        if ssh -p $port -o ConnectTimeout=2 -o BatchMode=yes root@$VPS_IP exit 2>/dev/null; then
            echo "✅ SSH is working on port $port"
            echo "📝 Use VPS_PORT=$port in GitHub Secrets"
            exit 0
        fi
    fi
done

echo "❌ Could not find SSH port. Using default 22."
```

Chạy:
```bash
chmod +x check_ssh_port.sh
./check_ssh_port.sh
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Port 22** là mặc định - nếu chưa đổi thì dùng `22`
2. Nếu không chắc, **thử port 22 trước**
3. Nếu port 22 không work, kiểm tra firewall:
   ```bash
   # Trên VPS
   sudo ufw status
   sudo ufw allow 22/tcp  # Nếu chưa allow
   ```
4. Trong GitHub Secrets, nếu không set `VPS_PORT`, workflow sẽ dùng `22` mặc định

---

## 🎯 TL;DR (Tóm Tắt)

**Hầu hết trường hợp**: Dùng port **`22`**

Nếu không chắc:
1. SSH vào VPS: `ssh root@YOUR_VPS_IP` (port 22 mặc định)
2. Chạy: `sudo cat /etc/ssh/sshd_config | grep Port`
3. Lấy số port từ kết quả
4. Thêm vào GitHub Secrets: `VPS_PORT` = số port đó

