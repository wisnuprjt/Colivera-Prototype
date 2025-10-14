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

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-900">
        <h4 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">Edit Data Pengguna</h4>
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">Perbarui informasi pengguna di bawah ini.</p>
        <form className="flex flex-col gap-4">
          <div>
            <Label>Nama Lengkap</Label>
            <Input name="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
          </div>
          <div>
            <Label>Role</Label>
            <select
              name="role"
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 shadow-sm w-full"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">SuperAdmin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button size="sm" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button size="sm" onClick={() => onSave(user)}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
