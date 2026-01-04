import React from "react";

function fmtPct(v: any) {
  if (v === undefined || v === null) return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return "-";
  const val = n > 1 ? n : n * 100;
  return `${val.toFixed(2)}%`;
}
function fmtNum(v: any, digits = 2) {
  if (v === undefined || v === null) return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return "-";
  return n.toFixed(digits);
}
function fmtTime(v: any) {
  if (v === undefined || v === null) return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return "-";
  return `${(n / 1000).toFixed(2)}s`;
}

export default function MetricsTable({ result }: { result: any }) {
  const precision = result?.precision ?? null;
  const recall = result?.recall ?? null;
  const crackArea = result?.crack_area ?? null;
  const crackLength = result?.crack_length ?? null;
  const severity = result?.severity ?? "-";

  console.log("MetricsTable result:", result);

  return (
    <div className="bg-white rounded-xl shadow p-6 dark:bg-gray-800 dark:text-gray-200">
      <h3 className="text-xl font-bold dark:text-blue-200 mb-4">Detail Metrik</h3>
      <p className="text-sm text-blue-600 mb-6">
        Metrik evaluasi model deteksi keretakan
      </p>

      <table className="w-full text-left">
        <thead>
          <tr className="text-sm dark:text-blue-200 border-b">
            <th className="py-3">Metrik</th>
            <th className="py-3">Nilai</th>
            <th className="py-3">Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-3 font-medium">Akurasi</td>
            <td className="py-3">{fmtPct(result?.accuracy)}</td>
            <td className="py-3 text-sm text-blue-600">
              Persentase prediksi yang benar dari total prediksi
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-3 font-medium">Presisi</td>
            <td className="py-3">
              {precision !== null ? fmtPct(precision) : "-"}
            </td>
            <td className="py-3 text-sm text-blue-600">
              Persentase prediksi positif yang benar
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-3 font-medium">Recall</td>
            <td className="py-3">{recall !== null ? fmtPct(recall) : "-"}</td>
            <td className="py-3 text-sm text-blue-600">
              Persentase kasus positif yang terdeteksi
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-3 font-medium">F1-Score</td>
            <td className="py-3">{fmtPct(result?.f1_score)}</td>
            <td className="py-3 text-sm text-blue-600">
              Rata-rata harmonik dari presisi dan recall
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-3 font-medium">mAP</td>
            <td className="py-3">
              {result?.mAP !== undefined ? fmtNum(result.mAP, 2) : "-"}
            </td>
            <td className="py-3 text-sm text-blue-600">
              mean Average Precision (per-epoch/model)
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-3 font-medium">Waktu Inferensi</td>
            <td className="py-3">{fmtTime(result?.inference_time)}</td>
            <td className="py-3 text-sm text-blue-600">
              Waktu yang dibutuhkan untuk memproses gambar
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-3 font-medium">Crack Area</td>
            <td className="py-3">{crackArea ?? "-"}</td>
            <td className="py-3 text-sm text-blue-600">Area pixel keretakan</td>
          </tr>
          <tr>
            <td className="py-3 font-medium">Crack Length</td>
            <td className="py-3">{crackLength ?? "-"}</td>
            <td className="py-3 text-sm text-blue-600">
              Panjang retak (pixel)
            </td>
          </tr>
          <tr>
            <td className="py-3 font-medium">Severity</td>
            <td className="py-3">{severity}</td>
            <td className="py-3 text-sm text-blue-600">
              Klasifikasi tingkat keparahan
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
