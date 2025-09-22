import React from "react";

export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        Anda Login
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Menjadi <span className="font-semibold text-brand-500">SuperAdmin</span>
      </p>
    </div>
  );
}
