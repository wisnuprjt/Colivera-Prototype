"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

interface HapusUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onDelete: (id: string) => void;
}

export default function HapusUserModal({
  isOpen,
  onClose,
  user,
  onDelete,
}: HapusUserModalProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[550px] m-4">
      <div className="bg-white rounded-2xl shadow-xl dark:bg-gray-900 overflow-hidden">
        {/* Header with gradient - danger theme with Winter Chill */}
        <div className="bg-gradient-to-br from-[#0B2E33] to-[#4F7C82] px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-1">Hapus Pengguna</h4>
              <p className="text-[#B8E3E9] text-sm">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Warning Box */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                  Peringatan!
                </h5>
                <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                  Apakah kamu yakin ingin menghapus akun{" "}
                  <span className="font-bold">{user.name}</span>?
                  <br />
                  Semua data pengguna akan dihapus secara permanen.
                </p>
              </div>
            </div>
          </div>

          {/* User Info to Delete */}
          <div className="bg-gradient-to-r from-[#B8E3E9]/20 to-[#93B1B5]/20 border border-[#93B1B5]/30 rounded-xl p-4">
            <p className="text-xs text-[#4F7C82] dark:text-gray-400 mb-2 font-medium">Pengguna yang akan dihapus:</p>
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
              onClick={() => {
                onDelete(user.id);
                onClose();
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Permanen
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
