type Props = { crackLength: number; crackArea: number; severity: string };
export default function StatsPanel({
  crackLength,
  crackArea,
  severity,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center mb-6 w-full max-w-xl dark:bg-gray-900 dark:text-gray-100">
      <h2 className="font-bold mb-2 text-lg dark:text-blue-200">
        Crack Analysis
      </h2>
      <div className="flex flex-wrap gap-8 justify-center">
        <div className="text-center">
          <div className="font-mono text-lg dark:text-white">
            {crackLength.toFixed(2)} px
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-300">
            Crack Length
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg dark:text-white">
            {crackArea.toFixed(0)} px²
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-300">
            Crack Area
          </div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg dark:text-white">{severity}</div>
          <div className="text-xs text-gray-500 dark:text-gray-300">
            Severity
          </div>
        </div>
      </div>
    </div>
  );
}
