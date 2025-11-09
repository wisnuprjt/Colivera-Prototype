"use client";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";

interface Notification {
  id: number;
  message: string;
  status: "read" | "unread";
  created_at: string;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState(false);
  const { user } = useAuth();

  // ✅ samakan ENV dengan AuthContext
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);
  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  // =====================================
  // Fetch notifikasi dari backend
  // =====================================
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        credentials: "include", // ✨ penting untuk cookie JWT
      });

      const data = await res.json();
      console.log("🔍 Notification Fetch Result:", data);

      if (data.success && Array.isArray(data.data)) {
        setNotifications(data.data);
        const hasUnread = data.data.some(
          (n: Notification) => n.status === "unread"
        );
        setNotifying(hasUnread);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("❌ Gagal fetch notifikasi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetch pertama kali saat user sudah login
  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  // Auto-refresh setiap 10 detik
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        {/* indikator titik oranye di pojok */}
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>

        {/* ikon lonceng */}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notification
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
              <p>Memuat notifikasi...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-500 dark:text-gray-400 select-none">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-7 h-7 text-gray-400 dark:text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.97 8.97 0 0118 9.75V9a6 6 0 10-12 0v.75a8.97 8.97 0 01-2.311 6.022c1.768.72 3.57 1.221 5.454 1.31m5.714 0a3 3 0 11-5.714 0m5.714 0H9.143"
                    />
                  </svg>
                </div>
                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Tidak ada notifikasi anomali
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center px-6 leading-snug">
                  Sistem monitoring berjalan normal. Semua pembacaan sensor berada dalam batas aman.
                </p>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
              {notifications.map((notif) => (
                <DropdownItem
                  key={notif.id}
                  onItemClick={closeDropdown}
                  className="flex items-start gap-3 rounded-lg border-b border-gray-100 p-3 px-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Alert Icon - Static untuk semua notifikasi */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-gray-800 dark:text-white font-medium text-sm leading-snug">
                      {notif.message}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(notif.created_at).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {/* Unread indicator */}
                  {notif.status === 'unread' && (
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5"></div>
                  )}
                </DropdownItem>
              ))}
            </ul>
          )}
        </div>
      </Dropdown>
    </div>
  );
}
