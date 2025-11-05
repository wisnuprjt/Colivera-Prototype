# Axios Interceptor - Account Deletion Handler

## 📋 Lokasi File

```
src/lib/axios.ts
```

## 🎯 Fungsi

File ini berisi konfigurasi axios instance dengan interceptor untuk menangani berbagai error response dari backend, terutama untuk kasus **account deletion** oleh admin.

## 🔧 Cara Kerja

### 1. **Response Interceptor**

Menangkap semua response dari backend dan mengecek error tertentu:

#### A. Account Deleted (401 + accountDeleted flag)
```javascript
if (error.response?.status === 401 && error.response?.data?.accountDeleted) {
  // Clear localStorage & sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear JWT cookies (PENTING!)
  deleteCookie('token');
  deleteCookie('refreshToken');
  
  // Alert user
  alert('Akun Anda telah dihapus oleh admin. Anda akan diarahkan ke halaman login.');
  
  // Redirect ke signin menggunakan window.location.replace (force reload)
  window.location.replace('/signin');
}
```

**Mengapa perlu clear cookie?**
- Middleware Next.js mengecek cookie `token` untuk proteksi route
- Jika cookie masih ada tapi user sudah dihapus → infinite redirect loop
- `window.location.replace()` memastikan full page reload (bukan client-side navigation)

**Skenario:**
- Admin menghapus user di halaman Super Admin
- Backend menghapus akun dan set JWT cookie dengan flag `accountDeleted: true`
- User yang sedang login melakukan request (misal: klik Manual Override, fetch data, dll)
- Interceptor mendeteksi response 401 dengan `accountDeleted: true`
- Clear semua storage + cookies
- User otomatis logout dan diarahkan ke halaman login

#### B. Unauthorized Biasa (401)
```javascript
else if (error.response?.status === 401) {
  // Token expired atau tidak valid
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear cookies
  deleteCookie('token');
  deleteCookie('refreshToken');
  
  // Redirect (jangan loop jika sudah di /signin)
  if (!window.location.pathname.includes('/signin')) {
    window.location.replace('/signin');
  }
}
```

#### C. Forbidden (403)
```javascript
else if (error.response?.status === 403) {
  alert('Akses ditolak. Anda tidak memiliki izin untuk melakukan aksi ini.');
}
```

#### D. Server Error (500)
```javascript
else if (error.response?.status === 500) {
  console.error('Server error:', error.response?.data?.message);
}
```

### 2. **Request Interceptor**

Otomatis attach JWT token dari localStorage ke setiap request:

```javascript
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

## 📦 Cara Penggunaan

### Import di Component

```typescript
import axiosInstance from '@/lib/axios';

// Contoh: Manual Override Button
const handleOverride = async () => {
  try {
    const response = await axiosInstance.post<OverrideResponse>('/api/override');
    console.log(response.data);
  } catch (error) {
    // Error sudah di-handle oleh interceptor
    console.error('Error:', error);
  }
};
```

### Contoh Request

```typescript
// GET request
const data = await axiosInstance.get('/api/users');

// POST request
const result = await axiosInstance.post('/api/login', { email, password });

// PUT request
const updated = await axiosInstance.put('/api/profile', userData);

// DELETE request
await axiosInstance.delete('/api/user/123');
```

## 🔄 Flow Diagram

```
User sedang login → Melakukan action (klik button, fetch data)
                            ↓
                    Request ke backend
                            ↓
                Admin hapus akun user
                            ↓
        Backend return 401 + accountDeleted: true
                            ↓
              Axios Interceptor menangkap
                            ↓
            Clear localStorage & sessionStorage
                            ↓
                  Clear JWT cookies
                            ↓
          Alert: "Akun Anda telah dihapus..."
                            ↓
          window.location.replace('/signin')
                            ↓
                  Full page reload
                            ↓
            Middleware cek cookie → TIDAK ADA
                            ↓
              Izinkan akses /signin ✅
```

## 🐛 Troubleshooting

### Problem: 404 Not Found setelah delete user

**Penyebab:**
- Cookie JWT masih tersimpan di browser
- Middleware Next.js mendeteksi cookie → redirect `/signin` ke `/dashboard`
- Dashboard butuh auth → redirect ke `/signin` lagi
- Infinite loop atau 404

**Solusi:**
```typescript
// Clear cookies sebelum redirect
deleteCookie('token');
deleteCookie('refreshToken');

// Gunakan window.location.replace() bukan .href
window.location.replace('/signin');
```

### Problem: Infinite redirect loop

**Penyebab:**
- Interceptor redirect ke `/signin` tapi masih ada token
- Middleware redirect `/signin` → `/dashboard` karena ada token

**Solusi:**
- Pastikan `deleteCookie()` dipanggil sebelum redirect
- Gunakan `.replace()` untuk force full page reload
- Check `!window.location.pathname.includes('/signin')` sebelum redirect

## ⚙️ Konfigurasi

```typescript
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true, // Kirim cookie JWT
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Environment Variable

Tambahkan di `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🛡️ Keamanan

1. **withCredentials: true** - Memastikan cookie JWT dikirim ke backend
2. **Auto token attachment** - Token otomatis ditambahkan ke setiap request
3. **Auto logout on unauthorized** - Jika token invalid/expired, auto logout
4. **Account deletion detection** - Khusus menangani kasus akun dihapus

## 📝 Catatan

- File ini akan digunakan oleh **semua component** yang perlu komunikasi dengan backend
- Ganti `fetch()` dengan `axiosInstance` untuk mendapat benefit interceptor
- Interceptor berjalan di client-side (browser), bukan di server-side
- `window.location.href` hanya berjalan di browser (sudah di-handle dengan `typeof window !== 'undefined'`)

## 🔗 File Terkait

1. **ManualOverrideButton.tsx** - Sudah menggunakan axios instance
2. **Backend: verifyToken middleware** - Mengirim response dengan `accountDeleted: true`
3. **Backend: deleteUser controller** - Set flag `accountDeleted` saat hapus user
