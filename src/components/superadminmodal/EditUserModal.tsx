"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (updatedUser: any) => void;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export default function EditUserModal({ isOpen, onClose, user, onSave, setUser }: EditUserModalProps) {
  if (!user) return null;

  // Get avatar color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-[#B8E3E9] to-[#93B1B5]",
      "bg-gradient-to-br from-[#93B1B5] to-[#4F7C82]",
      "bg-gradient-to-br from-[#4F7C82] to-[#0B2E33]",
      "bg-gradient-to-br from-[#B8E3E9] to-[#4F7C82]",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="bg-white rounded-2xl shadow-xl dark:bg-gray-900 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#4F7C82] to-[#0B2E33] px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${getAvatarColor(user.name)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              {getInitials(user.name)}
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-1">Edit Data Pengguna</h4>
              <p className="text-[#B8E3E9] text-sm">Perbarui informasi pengguna di bawah ini</p>
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
              value={user.name} 
              onChange={(e) => setUser({ ...user, name: e.target.value })}
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
              value={user.email} 
              onChange={(e) => setUser({ ...user, email: e.target.value })}
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
            <div className="relative">
              <select
                name="role"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4F7C82] focus:border-[#4F7C82] transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">SuperAdmin</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
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
              onClick={() => onSave(user)}
              className="bg-gradient-to-r from-[#4F7C82] to-[#0B2E33] hover:from-[#0B2E33] hover:to-[#0B2E33] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
