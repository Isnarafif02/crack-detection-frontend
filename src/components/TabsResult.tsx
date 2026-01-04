import AdvancedTrainingGraphs, {
  genSyntheticResult,
} from "./AdvancedTrainingGraphs";
import DetectionChart from "./DetectionChart";
import LineChartMetrics from "./LineChartMetrics";
import MetricsTable from "./MetricsTable";
import SegmentasiGrid from "./SegmentasiGrid";
import StatsCards from "./StatsCards";
import { motion } from "framer-motion";
import React, { useState } from "react";

export default function TabsResult({ result }: { result: any }) {
  const [tab, setTab] = useState("Hasil Segmentasi");
  const tabs = ["Hasil Segmentasi", "Metrik & Akurasi", "Grafik Analisis"];

  return (
    <div>
      <div className="flex w-full justify-center mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`mx-2 px-6 py-2 rounded-full transition ${
              t === tab
                ? "bg-blue-600 text-white dark:bg-blue-800 dark:text-gray-200"
                : "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-b-xl shadow p-8 dark:bg-gray-900 dark:text-gray-200"
      >
        {tab === "Hasil Segmentasi" && (
          <div className="bg-white rounded-xl shadow p-6 dark:bg-gray-800 dark:text-gray-200">
            <SegmentasiGrid result={result} />
          </div>
        )}

        {tab === "Metrik & Akurasi" && (
          <div >
            <StatsCards result={result} />
            <MetricsTable result={result} />
          </div>
        )}

        {tab === "Grafik Analisis" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-white rounded-xl shadow p-6 dark:bg-gray-800 dark:text-gray-200">
                <DetectionChart result={result} />
              </div>
              <div className="bg-white rounded-xl shadow p-6 dark:bg-gray-800 dark:text-gray-200">
                <h3 className="text-center font-semibold text-black dark:text-blue-200 mb-2">
                  Training Metrics
                </h3>
                <LineChartMetrics
                  data={
                    Array.isArray(result?.metrics_history) &&
                    result.metrics_history.length > 0
                      ? result.metrics_history
                      : genSyntheticResult(
                          result?.original_image ??
                            result?.normal_image ??
                            JSON.stringify(result ?? "seed"),
                          15
                        )
                  }
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 dark:bg-gray-800 dark:text-gray-200">
              <AdvancedTrainingGraphs result={result?.training_graphs || []} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
