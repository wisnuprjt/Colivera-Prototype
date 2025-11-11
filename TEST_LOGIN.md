# 🔐 Test Login & Troubleshooting Guide

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **Endpoint API diperbaiki di AuthContext**
- ✅ `/auth/me` → `/api/auth/me`
- ✅ `/auth/login` → `/api/auth/login`
- ✅ `/auth/logout` → `/api/auth/logout`

### 2. **Signin Page menggunakan AuthContext**
- ✅ Tidak lagi manual fetch
- ✅ Menggunakan `useAuth()` hook
- ✅ Error handling lebih baik

### 3. **Middleware sudah benar**
- ✅ Protected `/dashboard/*` routes
- ✅ Redirect `/signin` jika sudah login
- ✅ Cookie `token` validation

---

## 🧪 Cara Test

### **Step 1: Pastikan Backend Berjalan**

```bash
cd "c:\Users\Asus\Desktop\TA SKRIPSI\BACKUP LOCAL\Colivera-BE"
npm run dev
```

**Cek di browser atau Postman:**
```
GET http://localhost:4000/api/auth/me
```

Harus return:
- `401 Unauthorized` (jika belum login) ← **INI NORMAL**
- Atau user data (jika ada session)

---

### **Step 2: Jalankan Frontend**

```bash
cd "c:\Users\Asus\Desktop\TA SKRIPSI\BACKUP LOCAL\Colivera-Prototype"
npm run dev
```

Buka: http://localhost:3000

---

### **Step 3: Test Login**

1. **Buka DevTools Console** (F12)
2. Masukkan credentials admin atau superadmin
3. Perhatikan log di console:

**✅ Log yang harus muncul saat login berhasil:**
```
🔄 Fetching user session...
✅ Login success: email@example.com
✅ Session loaded: email@example.com (superadmin)
```

**❌ Jika gagal, akan muncul:**
```
🔴 No active session
❌ Login error: ...
```

---

## 🔍 Troubleshooting

### **Problem 1: "Session tidak ditemukan" / "Anda Login" terus-terusan**

**Penyebab:**
- Backend tidak mengirim cookie `token` dengan benar
- CORS configuration salah

**Solusi:**

#### **Cek CORS di Backend** (`Colivera-BE/.env`)

```env
CORS_ORIGIN=http://localhost:3000
```

**WAJIB SAMA** dengan URL frontend!

#### **Cek Backend Code** (di `server.js` atau `app.js`):

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true  // ← INI WAJIB!
}));
```

#### **Cek Response Headers di DevTools:**

Network tab → klik request `/api/auth/login` → lihat **Response Headers**:

```
Set-Cookie: token=...; Path=/; HttpOnly; SameSite=Lax
```

**Jika tidak ada `Set-Cookie`**, backend tidak mengirim cookie!

---

### **Problem 2: "Superadmin tidak muncul di menu"**

**Penyebab:**
- User yang login bukan superadmin
- Session tidak ter-sync

**Solusi:**

1. **Cek role di database**:
```sql
SELECT id, name, email, role FROM users;
```

Pastikan ada user dengan `role = 'superadmin'`

2. **Test di Console Browser**:
```javascript
// Paste di Console (F12)
fetch('http://localhost:4000/api/auth/me', { 
  credentials: 'include' 
})
.then(r => r.json())
.then(d => console.log('User:', d))
```

Harus return user dengan `role: "superadmin"`

3. **Jika role masih salah**, update database:
```sql
UPDATE users 
SET role = 'superadmin' 
WHERE email = 'admin@example.com';
```

---

### **Problem 3: "Cannot read property 'role' of null"**

**Penyebab:**
- AuthContext belum selesai load
- Backend tidak merespons

**Solusi:**

Di `superadmin/page.tsx`, sudah ada loading check:

```typescript
if (!user) {
  return <div>Loading...</div>;
}

if (user.role !== "superadmin") {
  return <div>403 - Akses Ditolak</div>;
}
```

**Cek apakah backend merespons:**

```bash
# Di terminal backend, harus ada log:
GET /api/auth/me 200 (atau 401 jika belum login)
```

---

### **Problem 4: "Network Error / ECONNREFUSED"**

**Penyebab:**
- Backend tidak berjalan
- Port salah

**Solusi:**

1. **Pastikan backend running di port 4000:**
```bash
cd Colivera-BE
npm run dev
```

Output harus:
```
Server running on http://localhost:4000
```

2. **Cek `.env.local` frontend:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**WAJIB** port 4000!

3. **Test manual:**
```bash
curl http://localhost:4000/api/auth/me
```

Harus return sesuatu (bukan connection refused)

---

## 📝 Credentials untuk Test

**Pastikan ada di database backend:**

### **SuperAdmin Account:**
```
Email: superadmin@colivera.com
Password: (sesuai database)
Role: superadmin
```

### **Admin Account:**
```
Email: admin@colivera.com
Password: (sesuai database)
Role: admin
```

---

## 🚀 Quick Test Checklist

- [ ] Backend berjalan di `localhost:4000`
- [ ] Frontend berjalan di `localhost:3000`
- [ ] CORS_ORIGIN = `http://localhost:3000`
- [ ] Ada user dengan role `superadmin` di database
- [ ] Cookie `token` muncul di DevTools Application → Cookies
- [ ] Console log menunjukkan `✅ Session loaded`
- [ ] Menu "Super Admin" muncul di sidebar (jika login sebagai superadmin)

---

## 🔧 SQL untuk Membuat SuperAdmin

Jika belum punya superadmin:

```sql
-- Ganti dengan password yang sudah di-hash (menggunakan bcrypt)
INSERT INTO users (name, email, password, role, created_at, updated_at)
VALUES (
  'Super Admin',
  'superadmin@colivera.com',
  '$2b$10$...hash_dari_backend...',  -- Password harus di-hash!
  'superadmin',
  NOW(),
  NOW()
);
```

**ATAU** update user yang sudah ada:

```sql
UPDATE users 
SET role = 'superadmin' 
WHERE email = 'email_anda@example.com';
```

---

## 📞 Jika Masih Error

Kirim screenshot:
1. **DevTools Console** (F12)
2. **DevTools Network** tab (lihat request `/api/auth/login` dan `/api/auth/me`)
3. **Backend terminal** (log dari server)

Saya akan bantu debug lebih lanjut! 🛠️
