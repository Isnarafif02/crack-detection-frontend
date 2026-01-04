import React from "react";

export default function StatsCards({ result }: { result: any }) {
  // debug: tunjukkan nilai yang diterima untuk verifikasi
  console.log(
    "StatsCards result:",
    result?.accuracy,
    result?.mAP,
    result?.f1_score,
    result?.precision,
    result?.recall
  );

  const fmtPct = (v: any) => {
    if (v === undefined || v === null) return "-";
    const n = Number(v);
    if (Number.isNaN(n)) return "-";
    // jika v dalam 0..1 => konversi ke persen, jika >1 asumsikan sudah persen
    const val = n > 1 ? n : n * 100;
    return `${val.toFixed(2)}%`;
  };

  const fmtMap = (v: any) => {
    if (v === undefined || v === null) return "-";
    const n = Number(v);
    if (Number.isNaN(n)) return "-";
    // tampilkan mAP apa adanya (0..1 atau 0..100)
    return n > 1 ? n.toFixed(2) : n.toFixed(2);
  };

  const fmtTime = (v: any) => {
    if (v === undefined || v === null) return "-";
    const n = Number(v);
    if (Number.isNaN(n)) return "-";
    // backend mengirim ms -> tampilkan detik
    return `${(n / 1000).toFixed(2)}s`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="dark:bg-gray-800 rounded-xl shadow p-6 text-center">
        <div className="text-sm dark:text-blue-200">Akurasi</div>
        <div className="text-3xl font-bold dark:text-blue-200 mt-2">
          {fmtPct(result?.accuracy)}
        </div>
        <div className="text-xs dark:text-blue-600 mt-2">
          Tingkat ketepatan model
        </div>
      </div>

      <div className="dark:bg-gray-800 rounded-xl shadow p-6 text-center">
        <div className="text-sm dark:text-blue-200">
          mAP (mean Average Precision)
        </div>
        <div className="text-3xl font-bold dark:text-blue-200 mt-2">
          {fmtMap(result?.mAP)}
        </div>
        <div className="text-xs dark:text-blue-600 mt-2">
          Rata-rata presisi pada kelas
        </div>
      </div>

      <div className="dark:bg-gray-800 rounded-xl shadow p-6 text-center">
        <div className="text-sm dark:text-blue-200">Waktu Inferensi</div>
        <div className="text-3xl font-bold dark:text-blue-200 mt-2">
          {fmtTime(result?.inference_time)}
        </div>
        <div className="text-xs dark:text-blue-600 mt-2">
          Waktu pemrosesan gambar
        </div>
      </div>

      <div className="dark:bg-gray-800 rounded-xl shadow p-6 text-center">
        <div className="text-sm dark:text-blue-200">F1-Score</div>
        <div className="text-3xl font-bold dark:text-blue-200 mt-2">
          {fmtPct(result?.f1_score)}
        </div>
        <div className="text-xs dark:text-blue-600 mt-2">
          Keseimbangan presisi & recall
        </div>
      </div>
    </div>
  );
}
