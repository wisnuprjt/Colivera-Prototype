"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // ✅ ambil data user dari context

const API = process.env.NEXT_PUBLIC_API_URL;

export default function UserPersonalInformation() {
  const { user } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return alert("User belum login.");
    try {
      const res = await fetch(`${API}/api/users/${user.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("✅ Data berhasil diperbarui!");
        closeModal();
        window.location.reload();
      } else {
        const data = await res.json();
        alert(`Gagal: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <div className="overflow-hidden border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-8 pb-20">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Profile</h3>
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/30 border border-white/30"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
              />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Card - Overlapping Header */}
      <div className="relative px-6 -mt-16 pb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          {/* Avatar + Info */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <div className="relative">
              <div className="w-24 h-24 overflow-hidden rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg">
                <Image
                  width={96}
                  height={96}
                  src="/images/user/ownerwisnu.jpeg"
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 border-4 border-white dark:border-gray-900 rounded-full"></div>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {user?.name || "User Tidak Dikenal"}
              </h4>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  {user?.role === "superadmin" ? "Super Admin" : "Admin"}
                </span>
                <div className="hidden sm:block h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                <span className="text-sm">
                  Aktif sejak {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
              Personal Information
            </h5>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Nama Lengkap
                </p>
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-white pl-6">
                {user?.name || "-"}
              </p>
            </div>

            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Email
                </p>
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-white pl-6 break-all">
                {user?.email || "-"}
              </p>
            </div>

            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Role
                </p>
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-white pl-6 capitalize">
                {user?.role || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="bg-white rounded-2xl shadow-xl dark:bg-gray-900 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-[#4F7C82] to-[#0B2E33] px-6 py-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B8E3E9] to-[#93B1B5] flex items-center justify-center text-[#0B2E33] font-bold text-2xl shadow-lg">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-1">Edit Personal Information</h4>
                <p className="text-[#B8E3E9] text-sm">Update your profile details</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form className="p-6 space-y-5">
            {/* Nama Lengkap */}
            <div className="group">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                <svg className="w-4 h-4 text-[#4F7C82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Nama Lengkap
              </Label>
              <Input 
                name="name" 
                value={form.name} 
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-[#4F7C82] focus:border-[#4F7C82]"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Email */}
            <div className="group">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                <svg className="w-4 h-4 text-[#4F7C82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </Label>
              <Input 
                name="email" 
                value={form.email} 
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-[#4F7C82] focus:border-[#4F7C82]"
                placeholder="nama@colivera.com"
              />
            </div>

            {/* Role */}
            <div className="group">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                <svg className="w-4 h-4 text-[#4F7C82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Role Pengguna
              </Label>
              <Input 
                name="role" 
                value={form.role} 
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-[#4F7C82] focus:border-[#4F7C82]"
                placeholder="Role"
                disabled
              />
              <p className="mt-2 text-xs text-[#4F7C82] dark:text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Role tidak dapat diubah pada halaman ini
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={closeModal}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                className="bg-gradient-to-r from-[#4F7C82] to-[#0B2E33] hover:from-[#0B2E33] hover:to-[#0B2E33] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
