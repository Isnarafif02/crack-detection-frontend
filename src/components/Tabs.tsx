import React from "react";
type TabsProps = { active: string; onTab: (tab: string) => void };
export default function Tabs({ active, onTab }: TabsProps) {
  return (
    <div className="flex w-full max-w-4xl mx-auto mt-6 mb-8">
      {["Hasil Segmentasi", "Metrik & Akurasi", "Grafik Analisis"].map(tab => (
        <button
          key={tab}
          className={`flex-1 py-2 rounded transition font-semibold ${active === tab ? "bg-gray-100" : ""}`}
          onClick={() => onTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}