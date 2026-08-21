"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      data-cursor="hover"
      className={`group relative h-9 w-[64px] rounded-full border border-line-strong overflow-hidden ${className}`}
    >
      {/* animated track background */}
      <span
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: isLight
            ? "linear-gradient(120deg,#e9e3d4,#fbf7ee)"
            : "linear-gradient(120deg,#111014,#1c1c22)",
        }}
      />
      {/* knob */}
      <span
        className="absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full grid place-items-center transition-[left,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          left: isLight ? "30px" : "3px",
          background: "linear-gradient(135deg,var(--accent),var(--accent-2))",
          boxShadow: "0 4px 14px -4px rgba(0,0,0,0.5)",
        }}
      >
        {isLight ? (
          <SunIcon className="h-3.5 w-3.5 text-[#2a230f]" />
        ) : (
          <MoonIcon className="h-3.5 w-3.5 text-[#0a0a0b]" />
        )}
      </span>
    </button>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={12 + Math.cos(a) * 7}
            y1={12 + Math.sin(a) * 7}
            x2={12 + Math.cos(a) * 9.2}
            y2={12 + Math.sin(a) * 9.2}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a0.5 0.5 0 0 0-.7-.6A9 9 0 1 0 20.6 15.2a.5.5 0 0 0-.6-.7Z" />
    </svg>
  );
}
