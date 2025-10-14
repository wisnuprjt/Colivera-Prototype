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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-900">
        <h4 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
          Hapus Pengguna
        </h4>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Apakah kamu yakin ingin menghapus akun{" "}
          <span className="font-semibold text-red-600">{user.name}</span>?
          <br />
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              onDelete(user.id);
              onClose();
            }}
          >
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
