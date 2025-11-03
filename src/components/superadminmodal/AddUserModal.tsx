"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  form: { name: string; email: string; password: string; role: string };
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function AddUserModal({ isOpen, onClose, onSave, form, setForm }: AddUserModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="bg-white rounded-2xl shadow-xl dark:bg-gray-900 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#4F7C82] to-[#0B2E33] px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B8E3E9] to-[#93B1B5] flex items-center justify-center text-[#0B2E33] font-bold text-2xl shadow-lg">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-1">Tambah Akun Baru</h4>
              <p className="text-[#B8E3E9] text-sm">Isi data user baru dengan lengkap</p>
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
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="transition-all duration-200 focus:ring-2 focus:ring-[#4F7C82] focus:border-[#4F7C82]"
              placeholder="nama@colivera.com"
            />
          </div>

          {/* Password */}
          <div className="group">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
              <svg className="w-4 h-4 text-[#4F7C82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Password
            </Label>
            <Input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="transition-all duration-200 focus:ring-2 focus:ring-[#4F7C82] focus:border-[#4F7C82]"
              placeholder="Minimal 8 karakter"
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                {form.role === 'superadmin' ? (
                  <svg className="w-5 h-5 text-[#4F7C82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#93B1B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <select
                name="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl pl-12 pr-12 py-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4F7C82] focus:border-[#4F7C82] transition-all duration-200 appearance-none cursor-pointer font-medium hover:border-[#93B1B5] shadow-sm hover:shadow-md"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">SuperAdmin</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-[#4F7C82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {/* Role Info Badge */}
            <div className="mt-2 flex items-center gap-2">
              {form.role === 'superadmin' ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#4F7C82]/20 to-[#0B2E33]/20 border border-[#4F7C82]">
                  <svg className="w-3.5 h-3.5 text-[#0B2E33] dark:text-[#B8E3E9]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#0B2E33] dark:text-[#B8E3E9]">Kontrol Penuh</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#93B1B5]/20 to-[#4F7C82]/20 border border-[#93B1B5]">
                  <svg className="w-3.5 h-3.5 text-[#4F7C82] dark:text-[#93B1B5]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-[#4F7C82] dark:text-[#93B1B5]">Akses Terbatas</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onClose}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Batal
            </Button>
            <Button 
              size="sm" 
              onClick={() => onSave(form)}
              className="bg-gradient-to-r from-[#4F7C82] to-[#0B2E33] hover:from-[#0B2E33] hover:to-[#0B2E33] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
