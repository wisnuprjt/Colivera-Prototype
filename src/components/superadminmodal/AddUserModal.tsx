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
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-900">
        <h4 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">Tambah Akun Baru</h4>
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          Isi data user baru dengan lengkap.
        </p>
        <form className="flex flex-col gap-4">
          <div>
            <Label>Nama Lengkap</Label>
            <Input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <Label>Role</Label>
            <select
              name="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
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
            <Button size="sm" onClick={() => onSave(form)}>
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
