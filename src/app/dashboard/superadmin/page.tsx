"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/button/Button";

// import modal components
import AddUserModal from "@/components/superadminmodal/AddUserModal";
import EditUserModal from "@/components/superadminmodal/EditUserModal";
import ResetPasswordModal from "@/components/superadminmodal/ResetPasswordModal";
import HapusUserModal from "@/components/superadminmodal/HapusUserModal"; // 🆕 tambahan

const API = process.env.NEXT_PUBLIC_API_URL;
if (!API) console.error("❌ NEXT_PUBLIC_API_URL belum kebaca, cek .env.local");

export default function UsersPage() {
  const { user } = useAuth();

  // ====== STATE ======
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  // modal visibility
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // 🆕 tambahan

  // data states
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "admin" });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [password, setPassword] = useState("");

  // ====== LOAD USERS ======
  async function load() {
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.append('q', q.trim());
      if (role) params.append('role', role);
      params.append('page', String(page));
      params.append('limit', '10');
      
      const res = await fetch(`${API}/api/users?${params.toString()}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setRows(Array.isArray(data) ? data : data.users || []);
      } else {
        console.error("Fetch users gagal:", res.status);
        setRows([]);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setRows([]);
    }
  }

  useEffect(() => {
    if (user?.role === "superadmin") {
      const timeoutId = setTimeout(load, 300); // debounce search
      return () => clearTimeout(timeoutId);
    }
  }, [q, role, page, user]);

  // ====== CRUD HANDLERS ======
  const handleAddUser = async (formData: any) => {
    if (!formData.name || !formData.email || !formData.password)
      return alert("Isi semua field!");
    try {
      const res = await fetch(`${API}/api/users`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("✅ User berhasil ditambahkan!");
        setIsAddOpen(false);
        setNewUser({ name: "", email: "", password: "", role: "admin" });
        load();
      } else {
        const data = await res.json();
        alert(`Gagal: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambah user.");
    }
  };

  const handleEditUser = async (updatedUser: any) => {
    try {
      const res = await fetch(`${API}/api/users/${updatedUser.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (res.ok) {
        alert("✅ Data user berhasil diperbarui!");
        setIsEditOpen(false);
        load();
      } else {
        alert("Gagal memperbarui user.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update user.");
    }
  };

  const handleResetPassword = async (id: string, newPassword: string) => {
    if (!newPassword || newPassword.length < 8)
      return alert("Password minimal 8 karakter!");
    try {
      const res = await fetch(`${API}/api/users/${id}/password`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      if (res.ok) {
        alert("✅ Password berhasil direset!");
        setIsResetOpen(false);
        setPassword("");
        load();
      } else {
        alert("Gagal reset password.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat reset password.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`${API}/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        alert("✅ User berhasil dihapus!");
        setIsDeleteOpen(false);
        load();
      } else {
        alert("Gagal menghapus user.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ====== AUTH CHECK ======
  if (!user) return <p className="text-center mt-10 text-gray-500">Memuat…</p>;
  if (user.role !== "superadmin")
    return (
      <p className="p-6 text-red-600 font-semibold text-center">
        403 — Hanya SuperAdmin
      </p>
    );

  // ====== RENDER ======
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">
          Kelola Akun Pengguna
        </h1>
        <Button onClick={() => setIsAddOpen(true)}>+ Tambah Akun</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          className="border border-gray-300 focus:ring-2 focus:ring-indigo-400 rounded-lg px-3 py-2 w-full md:w-1/3 shadow-sm"
          placeholder="Cari nama/email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 shadow-sm w-full md:w-1/4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="superadmin">SuperAdmin</option>
        </select>
      </div>

      {/* ==== USERS TABLE ==== */}
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="w-full text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr
                key={u.id}
                className="border-b hover:bg-indigo-50 transition-colors"
              >
                <td className="p-3 font-medium text-gray-800">{u.name}</td>
                <td className="p-3 text-gray-700">{u.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === "superadmin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setIsEditOpen(true);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md shadow-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setIsResetOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-sm"
                  >
                    Reset PW
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setIsDeleteOpen(true); // 🆕 pakai modal hapus
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Tidak ada data user
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==== MODALS ==== */}
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
