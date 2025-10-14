import Link from "next/link";
import AIDetection from "@/components/ecommerce/AIDetection";

export const metadata = { title: "AI Detection View • Colivera" };

export default function AIDetectionViewPage() {
  return (
    <div className="px-4 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          AI Detection – Detail
        </h1>
        <Link
          href="/dashboard"
          className="text-sm text-primary-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Reuse radial chart kamu */}
      <AIDetection />

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
