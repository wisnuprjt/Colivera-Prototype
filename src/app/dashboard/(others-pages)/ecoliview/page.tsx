import Link from "next/link";
import EColiChart from "@/components/ecommerce/TotalColiformMPN";
import ColiformHistoryTable from "@/components/ecommerce/ColiformHistoryTable"; // ✅ panggil komponen tabel

export const metadata = { title: "E.Coli View • Colivera" };

export default function EColiViewPage() {
  return (
    <div className="px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Total Coliform – Detail History (MPN)
        </h1>
        <Link
          href="/dashboard"
          className="text-sm text-primary-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Komponen Chart */}
      <EColiChart />

      {/* Komponen Tabel Riwayat (nyambung ke backend) */}
      <ColiformHistoryTable />
    </div>
  );
}
