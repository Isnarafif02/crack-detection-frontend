import React from "react";

export default function CacheBadge({
  fromCache,
  createdAt,
}: {
  fromCache?: boolean;
  createdAt?: string;
}) {
  if (!fromCache) return null;
  return (
    <div className="inline-flex items-center space-x-3 bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full border border-yellow-200 shadow-sm">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="mr-1"
      >
        <path
          d="M12 2v6"
          stroke="#b45309"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 12h16"
          stroke="#b45309"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22v-6"
          stroke="#b45309"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="text-xs">
        <div className="font-semibold">From cache</div>
        {createdAt && (
          <div className="text-[11px] text-yellow-700/90">
            Saved: {new Date(createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
