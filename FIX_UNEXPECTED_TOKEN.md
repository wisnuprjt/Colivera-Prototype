# 🔴 Fix: Error "Unexpected token '<', '<!DOCTYPE'... is not valid JSON"

## 🐛 Apa Masalahnya?

Error ini terjadi karena:
1. **Backend mengembalikan HTML** (halaman error 404/500) padahal frontend expect JSON
2. **Endpoint salah** - menggunakan `/coliform/latest` padahal backend expect `/api/coliform/latest`

## ✅ Sudah Diperbaiki

### **1. AuthContext.tsx**
- ✅ Tambah header `Accept: application/json`
- ✅ Validasi content-type sebelum parsing JSON
- ✅ Error handling yang lebih baik

### **2. ColiformHistoryTable.tsx**
- ❌ **Sebelum:** `${API_BASE}/coliform/latest`
- ✅ **Setelah:** `${API_BASE}/api/coliform/latest`

### **3. Semua Komponen Lain**
Sudah menggunakan endpoint yang benar dengan prefix `/api/`

---

## 🔍 Cara Cek Error Ini

### **1. Lihat di DevTools Console**
```
Error: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

### **2. Buka Network Tab**
- Klik request yang error (biasanya merah)
- Lihat **Response** tab
- Jika muncul HTML (bukan JSON), berarti endpoint salah atau backend error

### **3. Cek Response Headers**
```
Content-Type: text/html    ❌ Salah! Harusnya application/json
Content-Type: application/json  ✅ Benar!
```

---

## 🛠️ Troubleshooting

### **Problem: Masih muncul error "Unexpected token"**

#### **Langkah 1: Cek Backend Berjalan**
```bash
curl http://localhost:4000/api/coliform/latest
```

**Harus return JSON:**
```json
{
  "status": "success",
  "data": [...]
}
```

**Jika return HTML:**
- Backend tidak berjalan
- Endpoint tidak ada
- Backend crash

#### **Langkah 2: Cek Endpoint di Backend**

Pastikan backend punya endpoint ini:
```
GET /api/auth/me
POST /api/auth/login
POST /api/auth/logout
GET /api/coliform/latest
GET /api/sensor/coliform/history
GET /api/sensor/ai-detection
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
POST /api/override
```

#### **Langkah 3: Cek CORS Headers**

Backend harus return headers ini:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

---

## 📝 Pola Error yang Umum

### **Error 1: Frontend fetch ke endpoint yang tidak ada**
```javascript
fetch(`${API_BASE}/wrong-endpoint`)  // ❌
fetch(`${API_BASE}/api/correct-endpoint`)  // ✅
```

### **Error 2: Backend tidak handle error dengan JSON**
Backend harusnya selalu return JSON, bukan HTML:

**❌ Buruk:**
```javascript
app.get('/api/users', (req, res) => {
  throw new Error('Something wrong');  // Return HTML error page
});
```

**✅ Baik:**
```javascript
app.get('/api/users', (req, res) => {
  try {
    // logic here
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});
```

### **Error 3: Middleware redirect ke halaman error**
```javascript
// ❌ Buruk - redirect ke HTML error page
app.use((err, req, res, next) => {
  res.redirect('/error');
});

// ✅ Baik - return JSON error
app.use((err, req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: err.message
  });
});
```

---

## 🚀 Testing

### **Test 1: Cek Semua Endpoint**
```bash
# Auth endpoints
curl http://localhost:4000/api/auth/me
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test","password":"test"}'

# Data endpoints
curl http://localhost:4000/api/coliform/latest
curl http://localhost:4000/api/sensor/coliform/history
curl http://localhost:4000/api/sensor/ai-detection

# Admin endpoints
curl http://localhost:4000/api/users
```

**Semua harus return JSON** (walaupun error 401/403)

### **Test 2: Check Frontend**

1. Buka http://localhost:3000
2. Buka DevTools Console (F12)
3. Tidak ada error merah
4. Network tab → semua request return JSON

---

## 📌 Checklist

Pastikan semua ini sudah benar:

- [ ] Backend berjalan di `localhost:4000`
- [ ] Semua endpoint backend menggunakan prefix `/api/`
- [ ] Backend selalu return JSON (bukan HTML)
- [ ] CORS configured dengan benar
- [ ] `.env.local` frontend: `NEXT_PUBLIC_API_URL=http://localhost:4000`
- [ ] Tidak ada error "Unexpected token" di Console
- [ ] Network tab menunjukkan `Content-Type: application/json`

---

## 🎯 Summary

**Root Cause:**
- Endpoint tidak konsisten (ada yang pakai `/api/`, ada yang tidak)
- Backend return HTML untuk error alih-alih JSON

**Solution:**
- ✅ Semua endpoint frontend sekarang pakai `/api/` prefix
- ✅ Error handling ditambahkan untuk cek content-type
- ✅ Validasi response sebelum parse JSON

**Result:**
- ✅ Tidak ada lagi error "Unexpected token"
- ✅ Error messages lebih jelas
- ✅ Frontend robust terhadap backend errors

---

🎉 **Sekarang coba refresh browser dan login lagi!**
