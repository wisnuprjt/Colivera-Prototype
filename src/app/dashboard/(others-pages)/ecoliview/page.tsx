import Link from "next/link";
import EColiChart from "@/components/ecommerce/EColiHistory";

export const metadata = { title: "E.Coli View • Colivera" };

export default function EColiViewPage() {
  return (
    <div className="px-4 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          E.Coli – Detail History (CFU)
        </h1>
        <Link
          href="/dashboard"
          className="text-sm text-primary-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Reuse komponen chart kamu */}
      <EColiChart />

      {/* Placeholder: nanti kita isi tabel riwayat & filter */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="mb-2 text-lg font-semibold">Riwayat Pembacaan Terakhir</h2>
        <p className="text-sm text-gray-500">
          (Placeholder) Tabel daftar timestamp, tegangan (V), dan konversi CFU.
        </p>
      </div>
    </div>
  );
}
