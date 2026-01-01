"use client";

import { useEffect, useState } from "react";

interface Cursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

interface RemoteCursorsProps {
  cursors: Cursor[];
  containerRef: React.RefObject<HTMLElement | null>;
}

export function RemoteCursors({ cursors, containerRef }: RemoteCursorsProps) {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    // Update positions when cursors change
    const newPositions: Record<string, { x: number; y: number }> = {};
    cursors.forEach((cursor) => {
      newPositions[cursor.id] = { x: cursor.x, y: cursor.y };
    });
    setPositions(newPositions);
  }, [cursors]);

  if (!containerRef.current) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {cursors.map((cursor) => (
        <div
          key={cursor.id}
          className="absolute transition-all duration-100 ease-out"
          style={{
            left: cursor.x,
            top: cursor.y,
            zIndex: 50,
          }}
        >
          {/* Cursor pointer */}
          <svg
            width="24"
            height="36"
            viewBox="0 0 24 36"
            fill="none"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
          >
            <path
              d="M5.65376 12.4563L0.169067 2.03859C-0.0742445 1.56425 0.0916985 0.988567 0.541601 0.755843C0.699889 0.671401 0.878478 0.628906 1.05999 0.628906H22.94C23.4923 0.628906 23.94 1.07662 23.94 1.62891C23.94 1.81042 23.8975 1.98901 23.8131 2.14729L18.3285 12.5659C17.9831 13.2154 17.3205 13.6284 16.5903 13.6284H7.39285C6.66269 13.6284 6.0001 13.2154 5.65376 12.4563Z"
              fill={cursor.color}
            />
          </svg>
          {/* Name label */}
          <div
            className="absolute left-4 top-5 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap font-medium"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </div>
  );
}
