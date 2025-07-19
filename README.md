# viral-video
# ভাইরাল ভিডিও সাইট - স্থাপনা নির্দেশিকা

## 📌 প্রয়োজনীয় সফটওয়্যার
- Termux (Android)
- PHP 8.0+
- Apache/NGINX (ঐচ্ছিক)
- Git

## 🚀 দ্রুত সেটআপ

### ১. টার্মিনালে নিচের কমান্ডগুলো রান করুন:
```bash
pkg update && pkg upgrade
pkg install php git apache2 -y
git clone https://github.com/Hasin5454/viral-video-site.git
cd viral-video-site
mkdir -p videos credentials
touch credentials/users.txt
chmod 755 videos/
chmod 644 credentials/users.txt
```

### ২. সার্ভার চালু করুন:
```bash
# PHP বিল্ট-ইন সার্ভার (ডিফল্ট)
php -S 0.0.0.0:8000

# অথবা Apache ব্যবহার করতে চাইলে:
apachectl start
```

## 🔧 কনফিগারেশন

### Apache কনফিগারেশন (যদি ব্যবহার করেন):
```bash
nano $PREFIX/etc/apache2/httpd.conf
```
নিচের লাইনগুলো যোগ/এডিট করুন:
```apache
Listen 8000
DocumentRoot /data/data/com.termux/files/home/viral-video-site
<Directory "/data/data/com.termux/files/home/viral-video-site">
    AllowOverride All
    Require all granted
</Directory>
```

## 🌐 অ্যাক্সেস
- লোকাল: `http://localhost:8000`
- LAN: `http://[আপনার-আইপি]:8000`

## 🔒 ডিফল্ট লগইন ক্রেডেনশিয়াল
**এডমিন প্যানেল:**
- ইউজারনেম: `admin`
- পাসওয়ার্ড: `admin123`

## ⚠️ সমস্যা সমাধান
```bash
# Apache এরর লগ:
tail -f $PREFIX/var/log/apache2/error_log

# PHP এরর:
php -d display_errors=1 index.php
```

## 📂 ফাইল স্ট্রাকচার
```
viral-video-site/
├── admin.php
├── index.php
├── login.php
├── videos/          # ভিডিও স্টোরেজ
├── credentials/
│   └── users.txt    # ইউজার ডাটা
└── style.css
```

> **নোট**: প্রোডাকশন ব্যবহারের আগে অবশ্যই `admin***` পাসওয়ার্ড পরিবর্তন করুন।
