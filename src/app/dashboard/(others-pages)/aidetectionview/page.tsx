import Link from "next/link";
import AIDetection from "@/components/ecommerce/AIDetection";
import { ArrowLeftIcon } from "lucide-react";

export const metadata = { title: "AI Detection View • Colivera" };

export default function AIDetectionViewPage() {
  return (
    <div className="px-4 sm:px-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Reuse radial chart kamu */}
      <AIDetection hideDropdown={true} />

      {/* Placeholder: nanti kita isi penjelasan model & log prediksi */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="mb-2 text-lg font-semibold">Keterangan & Log Prediksi</h2>
        <p className="text-sm text-gray-500">
          (Placeholder) Ringkasan ambang batas, penjelasan label aman/bahaya, dan log score per batch.
        </p>
      </div>
    </div>
  );
}
