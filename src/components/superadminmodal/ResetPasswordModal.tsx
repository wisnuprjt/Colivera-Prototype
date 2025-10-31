"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onSave: (id: string, newPassword: string) => void;
}

export default function ResetPasswordModal({ isOpen, onClose, user, password, setPassword, onSave }: ResetPasswordModalProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[550px] m-4">
      <div className="bg-white rounded-2xl shadow-xl dark:bg-gray-900 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#93B1B5] to-[#4F7C82] px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B8E3E9] to-white flex items-center justify-center text-[#0B2E33] font-bold text-2xl shadow-lg">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-1">Reset Password</h4>
              <p className="text-[#B8E3E9] text-sm">Ubah password pengguna</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form className="p-6 space-y-5">
          {/* User Info */}
          <div className="bg-gradient-to-r from-[#B8E3E9]/20 to-[#93B1B5]/20 border border-[#93B1B5]/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4F7C82] to-[#0B2E33] flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#0B2E33] dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-[#4F7C82] dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="group">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
              <svg className="w-4 h-4 text-[#4F7C82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Password Baru
            </Label>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="transition-all duration-200 focus:ring-2 focus:ring-[#4F7C82] focus:border-[#4F7C82]"
            />
            <p className="mt-2 text-xs text-[#4F7C82] dark:text-gray-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Password harus minimal 8 karakter untuk keamanan
            </p>
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
              onClick={() => onSave(user.id, password)}
              className="bg-gradient-to-r from-[#93B1B5] to-[#4F7C82] hover:from-[#4F7C82] hover:to-[#0B2E33] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
