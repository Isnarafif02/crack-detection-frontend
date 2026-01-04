import LineChartMetrics from "./LineChartMetrics";
import React from "react";

function seedFromString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

export function genSyntheticResult(seedStr: string, epochs = 15) {
  const seedNum = seedFromString(seedStr).toString();
  const baseAcc = 70 + (Number(seedNum.slice(-2)) % 25);
  const baseMap = 30 + (Number(seedNum.slice(0, 2)) % 60);

  const rnd = (i: number) => {
    const v = (Number(seedNum.slice(-6)) + i * 9973) % 1000000;
    return (v % 1000) / 1000;
  };

  const accAmp = 6 + (Number(seedNum.slice(-1)) % 6);
  const mapAmp = 6 + ((Number(seedNum.slice(-2)) >> 1) % 6);
  const accFreq = 0.45 + (Number(seedNum.slice(0, 3)) % 7) * 0.03;
  const mapFreq = 0.55 + (Number(seedNum.slice(1, 4)) % 7) * 0.02;

  const out: any[] = [];
  for (let e = 1; e <= epochs; e++) {
    const noiseAcc = (rnd(e) - 0.5) * 4.0;
    const noiseMap = (rnd(e + 5) - 0.5) * 4.0;
    const seasonalAcc = Math.sin(e * accFreq + (Number(seedNum) % 13)) * accAmp;
    const seasonalMap =
      Math.cos(e * mapFreq + (Number(seedNum) % 11)) * mapAmp * 0.6;

    let a = baseAcc + seasonalAcc + noiseAcc + (e - epochs / 2) * 0.15;
    let m = baseMap + seasonalMap + noiseMap + (e - epochs / 2) * -0.08;

    a = Math.max(0, Math.min(99.9, a));
    m = Math.max(0, Math.min(100, m));

    out.push({
      epoch: e,
      accuracy: Number(a.toFixed(3)),
      mAP: Number(m.toFixed(3)),
      box_loss: Number(
        Math.abs(1.2 - rnd(e) * 1.2 + Math.sin(e * 0.35) * 0.4).toFixed(5)
      ),
      class_loss: Number(
        Math.abs(0.8 - rnd(e + 3) * 0.9 + Math.cos(e * 0.25) * 0.3).toFixed(5)
      ),
      object_loss: Number(
        Math.abs(0.6 - rnd(e + 7) * 0.7 + Math.sin(e * 0.18) * 0.25).toFixed(5)
      ),
    });
  }
  return out;
}

export default function AdvancedTrainingGraphs({ result }: { result?: any }) {
  const metrics =
    result &&
    Array.isArray(result.metrics_history) &&
    result.metrics_history.length > 0
      ? result.metrics_history
      : genSyntheticResult(
          result?.original_image ??
            result?.normal_image ??
            JSON.stringify(result ?? "seed")
        );

  return (
    <div className="dark:bg-gray-800 rounded-xl shadow p-6 mb-6 w-full">
      <h2 className="font-bold mb-4 text-lg dark:text-blue-200">
        Advanced Training Graphs
      </h2>
      <LineChartMetrics data={metrics} />
      <div className="text-sm text-gray-500 mt-4">
        Jika backend mengirim metrics_history maka grafik akan mencerminkan data
        itu. Jika tidak, grafik ini menampilkan data sintetis deterministik
        berdasarkan gambar.
      </div>
    </div>
  );
}
