import Link from "next/link";
import EColiChart from "@/components/ecommerce/TotalColiformMPN";
import ColiformHistoryTable from "@/components/ecommerce/ColiformHistoryTable";
import { ArrowLeftIcon } from "lucide-react";

export const metadata = { title: "E.Coli View • Colivera" };

export default function EColiViewPage() {
  return (
    <div className="px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Komponen Chart */}
      <EColiChart hideDropdown={true} />

      {/* Komponen Tabel Riwayat (nyambung ke backend) */}
      <ColiformHistoryTable />
    </div>
  );
}
