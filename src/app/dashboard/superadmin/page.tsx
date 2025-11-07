"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/button/Button";
import axiosInstance from "@/lib/axios";

// import modal components
import AddUserModal from "@/components/superadminmodal/AddUserModal";
import EditUserModal from "@/components/superadminmodal/EditUserModal";
import ResetPasswordModal from "@/components/superadminmodal/ResetPasswordModal";
import HapusUserModal from "@/components/superadminmodal/HapusUserModal";

const API = process.env.NEXT_PUBLIC_API_URL;

// Add keyframes for animations
const styles = `
  @keyframes spin-slow {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }
  
  .animate-fadeInUp {
    opacity: 1;
  }

  .animate-fadeIn {
    opacity: 1;
  }

  .animate-scaleIn {
    opacity: 1;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default function UsersPage() {
  const { user } = useAuth();

  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    superadmins: 0,
    activeToday: 0
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "admin" });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [password, setPassword] = useState("");

  // ====== LOAD USERS ======
  async function load() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q.trim()) params.append("q", q);
      if (role && role !== "all") params.append("role", role);
      params.append("page", String(page));
      params.append("limit", "10");

      console.log("📊 Loading users...");
      const res = await axiosInstance.get(`/api/users?${params.toString()}`);

      if (res.data && Array.isArray(res.data)) {
        console.log("✅ Users loaded:", res.data.length);
        setRows(res.data);
        
        // Calculate stats
        const total = res.data.length;
        const admins = res.data.filter((u: any) => u.role === 'admin').length;
        const superadmins = res.data.filter((u: any) => u.role === 'superadmin').length;
        setStats({ total, admins, superadmins, activeToday: Math.floor(total * 0.7) });
      }
    } catch (err) {
      console.error("❌ Load users error:", err);
      setRows([]);
    } finally {
      setLoading(false); // Removed setTimeout - instant loading
    }
  }

  // ====== AUTO LOAD (Debounced) ======
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.role === "superadmin") {
        load();
      }
    }, 500); // Increased debounce to reduce frequent calls

    return () => clearTimeout(timer);
  }, [q, role, page, user?.role]); // Changed dependency to user?.role only

  // ====== REALTIME LISTENER ======
  useEffect(() => {
    console.log("🎧 User Management: Setting up realtime listener");

    const handleUserListChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("⚡ User list changed:", customEvent.detail);
      load(); // Reload list
    };

    window.addEventListener("userListChanged", handleUserListChanged);

    return () => {
      window.removeEventListener("userListChanged", handleUserListChanged);
    };
  }, []); // Empty deps - only setup once, no re-attach

  // ====== CRUD HANDLERS ======
  const handleAddUser = async (formData: any) => {
    if (!formData.name || !formData.email || !formData.password) {
      return alert("Isi semua field!");
    }
    
    try {
      const res = await axiosInstance.post('/api/users', formData);
      
      if (res.data) {
        alert("✅ User berhasil ditambahkan!");
        setIsAddOpen(false);
        setNewUser({ name: "", email: "", password: "", role: "admin" });
        load();
      }
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || "Terjadi kesalahan saat menambah user.";
      alert(`Gagal: ${message}`);
    }
  };

  const handleEditUser = async (updatedUser: any) => {
    try {
      const res = await axiosInstance.patch(`/api/users/${updatedUser.id}`, updatedUser);
      
      if (res.data) {
        alert("✅ Data user berhasil diperbarui!");
        setIsEditOpen(false);
        load();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui user.");
    }
  };

  const handleResetPassword = async (id: string, newPassword: string) => {
    if (!newPassword || newPassword.length < 8) {
      return alert("Password minimal 8 karakter!");
    }
    
    try {
      const res = await axiosInstance.patch(`/api/users/${id}/password`, { newPassword });
      
      if (res.data) {
        alert("✅ Password berhasil direset!");
        setIsResetOpen(false);
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal reset password.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/api/users/${id}`);
      
      if (res.data) {
        alert("✅ User berhasil dihapus!");
        setIsDeleteOpen(false);
        load();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus user.");
    }
  };

  // ====== AUTH CHECK ======
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
        <div className="text-center">
          {/* Animated Loading Spinner */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer rotating ring */}
            <div className="absolute w-20 h-20 border-4 border-slate-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute w-20 h-20 border-4 border-t-[#4F7C82] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            
            {/* Middle pulse ring */}
            <div className="absolute w-16 h-16 bg-[#4F7C82]/10 dark:bg-[#4F7C82]/20 rounded-full animate-pulse"></div>
            
            {/* Inner rotating ring (opposite direction) */}
            <div className="w-12 h-12 border-3 border-t-[#93B1B5] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
            
            {/* Center dot */}
            <div className="absolute w-3 h-3 bg-gradient-to-br from-[#4F7C82] to-[#0B2E33] rounded-full animate-pulse"></div>
          </div>
          
          {/* Loading Text */}
          <div className="mt-6">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 animate-pulse">
              Memuat Data...
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Mohon tunggu sebentar
            </p>
          </div>
          
          {/* Loading dots animation */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-[#4F7C82] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#4F7C82] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#4F7C82] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (user.role !== "superadmin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-8xl mb-4">🚫</div>
          <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-300 mb-2">403 - Akses Ditolak</h2>
          <p className="text-gray-600 dark:text-gray-400">Halaman ini hanya untuk SuperAdmin</p>
        </div>
      </div>
    );
  }

  // Helper function to get avatar color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-emerald-500 to-teal-600',
      'from-teal-500 to-cyan-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-600 to-green-700',
      'from-teal-600 to-emerald-700',
      'from-slate-600 to-gray-700',
      'from-blue-600 to-cyan-700',
      'from-green-600 to-emerald-700',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // ====== RENDER ======
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Kelola semua akun pengguna dengan mudah
              </p>
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          </div>

          {/* Search & Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                  placeholder="Search users..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-all outline-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="superadmin">SuperAdmin</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 opacity-60">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-8xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No users found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rows.map((u, idx) => (
              <div
                key={u.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Avatar & Info */}
                <div className="flex flex-col items-center text-center mb-4">
                  <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarColor(u.name)} flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                    {u.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {u.email}
                  </p>
                  <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
                    u.role === 'superadmin' 
                      ? 'bg-gradient-to-r from-slate-600 to-gray-700 text-white' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                  }`}>
                    {u.role === 'superadmin' ? '⚡ SuperAdmin' : '👤 Admin'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setIsEditOpen(true);
                    }}
                    className="w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setIsResetOpen(true);
                      }}
                      className="py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-1 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Reset
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setIsDeleteOpen(true);
                      }}
                      className="py-2 px-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-1 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddUser}
        form={newUser}
        setForm={setNewUser}
      />

      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={selectedUser}
        setUser={setSelectedUser}
        onSave={handleEditUser}
      />

      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        user={selectedUser}
        password={password}
        setPassword={setPassword}
        onSave={handleResetPassword}
      />

      <HapusUserModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        user={selectedUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}