# 🔧 Backend API Fix - Migration to localhost:4000

## 📋 Ringkasan Perubahan

Dokumen ini menjelaskan perubahan yang dilakukan untuk memperbaiki error HTTP 404 dan mengintegrasikan frontend dengan backend yang berjalan di `localhost:4000`.

## ✅ Perubahan yang Dilakukan

### 1. Update Environment Variables (`.env.local`)

```bash
# SEBELUM
NEXT_PUBLIC_API_URL=https:/localhost  # ❌ Typo dan tidak ada port

# SESUDAH
NEXT_PUBLIC_API_URL=http://localhost:4000  # ✅ URL yang benar
```

### 2. Migrasi dari `fetch()` ke `axiosInstance`

Semua component yang sebelumnya menggunakan `fetch()` sekarang menggunakan `axiosInstance` dari `src/lib/axios.ts` untuk:
- ✅ Error handling yang lebih baik
- ✅ Automatic credential handling (cookies)
- ✅ Centralized interceptor untuk handle 401, 403, 500
- ✅ Consistent API calls

#### Component yang Diperbaiki:

1. **AIDetectionHistoryTable.tsx**
   ```typescript
   // SEBELUM
   const res = await fetch(`${apiUrl}/coliform/ai-prediction/history?limit=20`, {
     method: 'GET',
     cache: 'no-cache',
     credentials: 'include',
   });
   
   // SESUDAH
   const res = await axiosInstance.get('/api/coliform/ai-prediction/history', {
     params: { limit: 20 }
   });
   ```

2. **TotalColiformMPN.tsx**
   ```typescript
   // SEBELUM
   const res = await fetch(`${apiUrl}/sensor/coliform/history?source=sensor&limit=20`, {...});
   
   // SESUDAH
   const res = await axiosInstance.get('/api/sensor/coliform/history', {
     params: { source: 'sensor', limit: 20 }
   });
   ```

3. **TotalColiformAI.tsx**
   ```typescript
   // SEBELUM
   const res = await fetch(`${apiUrl}/sensor/coliform/history?source=ai_prediction&limit=20`, {...});
   
   // SESUDAH
   const res = await axiosInstance.get('/api/sensor/coliform/history', {
     params: { source: 'ai_prediction', limit: 20 }
   });
   ```

4. **AIDetection.tsx**
   ```typescript
   // SEBELUM
   const response = await fetch(`${apiUrl}/sensor/ai-detection`, {...});
   
   // SESUDAH
   const response = await axiosInstance.get('/api/sensor/ai-detection');
   ```

5. **ManualOverride.tsx**
   ```typescript
   // SEBELUM
   const response = await fetch(`${apiUrl}/override`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     credentials: "include",
   });
   
   // SESUDAH
   const response = await axiosInstance.post('/api/override');
   ```

## 🚀 Cara Menjalankan

### 1. Development (Local)

**Backend:**
```bash
# Pastikan backend berjalan di localhost:4000
cd backend
npm run dev
# atau sesuai command backend Anda
```

**Frontend:**
```bash
# Di terminal terpisah
cd Colivera-Prototype
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000` dan akan connect ke backend di `http://localhost:4000`.

### 2. Production (Hosting)

Update `.env.local` (atau `.env.production`) dengan URL backend production:

```bash
NEXT_PUBLIC_API_URL=https://api-production.example.com
```

## 📝 Endpoint Backend yang Digunakan

Pastikan backend Anda memiliki endpoint berikut:

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/coliform/ai-prediction/history` | GET | History AI prediction |
| `/api/sensor/coliform/history` | GET | History sensor data (filter: `source=sensor` atau `source=ai_prediction`) |
| `/api/sensor/ai-detection` | GET | Real-time AI detection data |
| `/api/override` | POST | Manual override command |

## 🔍 Error Handling

Semua error sekarang di-handle lebih baik dengan informasi yang jelas:

```typescript
// Contoh error handling di AIDetectionHistoryTable.tsx
if (error.response) {
  // Backend responded with error
  const status = error.response.status;
  if (status === 404) {
    setError("Endpoint tidak ditemukan. Pastikan backend sudah berjalan di localhost:4000");
  } else if (status === 500) {
    setError("Server error. Periksa log backend.");
  } else {
    setError(`Error ${status}: ${error.response.data?.message || error.message}`);
  }
} else if (error.request) {
  // Request made but no response
  setError("Backend tidak merespons. Pastikan backend sudah berjalan di localhost:4000");
} else {
  setError(error.message || "Terjadi kesalahan");
}
```

## ⚠️ Troubleshooting

### Error: "Backend tidak merespons"
- ✅ Pastikan backend sudah berjalan di `localhost:4000`
- ✅ Check CORS settings di backend
- ✅ Verify `.env.local` sudah benar

### Error: "Endpoint tidak ditemukan (404)"
- ✅ Pastikan endpoint di backend match dengan yang ada di dokumentasi
- ✅ Check route configuration di backend
- ✅ Verify API base URL

### Error: "Unauthorized (401)"
- ✅ Login ulang
- ✅ Check JWT token di cookies
- ✅ Verify backend authentication middleware

## 📚 Referensi

- `src/lib/axios.ts` - Axios instance configuration & interceptors
- `AXIOS_INTERCEPTOR.md` - Dokumentasi lengkap tentang axios interceptor
- `.env.local` - Environment variables

## ✨ Keuntungan Perubahan Ini

1. **Consistent Error Handling** - Semua API calls menggunakan axios interceptor yang sama
2. **Better DX** - Error messages lebih informatif dan helpful
3. **Maintainability** - Lebih mudah untuk update base URL atau add global headers
4. **Type Safety** - TypeScript typing untuk response data
5. **Auto Logout** - Automatic redirect ke login page jika token expired (via axios interceptor)

---

**Last Updated:** November 10, 2025
**Author:** GitHub Copilot
