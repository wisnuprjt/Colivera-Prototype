import axios from 'axios';

// Helper function to delete cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Create axios instance dengan base URL backend
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Untuk mengirim cookie JWT
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor untuk handle error global
axiosInstance.interceptors.response.use(
  (response: any) => {
    // Jika response sukses, langsung return
    return response;
  },
  (error: any) => {
    // Handle 401 dengan accountDeleted flag
    if (error.response?.status === 401 && error.response?.data?.accountDeleted) {
      // Clear local storage (jika ada)
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear cookies
        deleteCookie('token');
        deleteCookie('refreshToken');
        
        // Tampilkan notifikasi
        alert('Akun Anda telah dihapus oleh admin. Anda akan diarahkan ke halaman login.');
        
        // Force reload ke signin page
        window.location.replace('/signin');
      }
    }
    
    // Handle 401 unauthorized biasa (token expired, dll)
    else if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Jangan redirect jika sudah di halaman signin
        if (!window.location.pathname.includes('/signin')) {
          localStorage.clear();
          sessionStorage.clear();
          
          // Clear cookies
          deleteCookie('token');
          deleteCookie('refreshToken');
          
          window.location.replace('/signin');
        }
      }
    }
    
    // Handle 403 Forbidden
    else if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        alert('Akses ditolak. Anda tidak memiliki izin untuk melakukan aksi ini.');
      }
    }
    
    // Handle 500 Server Error
    else if (error.response?.status === 500) {
      console.error('Server error:', error.response?.data?.message);
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor (opsional) untuk attach token jika diperlukan
axiosInstance.interceptors.request.use(
  (config: any) => {
    // Jika ada token di localStorage, attach ke header
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
