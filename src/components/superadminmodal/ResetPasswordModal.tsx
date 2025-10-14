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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-900">
        <h4 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">Reset Password</h4>
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          Masukkan password baru untuk <strong>{user.name}</strong>.
        </p>
        <form className="flex flex-col gap-4">
          <div>
            <Label>Password Baru</Label>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button size="sm" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button size="sm" onClick={() => onSave(user.id, password)}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
