import type { Region } from "../types";
import { REGIONS } from "../types";

interface RegionFilterProps {
  active: Region | "ALL";
  onChange: (region: Region | "ALL") => void;
}

export function RegionFilter({ active, onChange }: RegionFilterProps) {
  const options: (Region | "ALL")[] = ["ALL", ...REGIONS];

  return (
    <div className="inline-flex gap-1 rounded-lg bg-graphite-900 p-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={[
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            active === option ? "bg-signal-500 text-graphite-950" : "text-graphite-400 hover:text-graphite-100"
          ].join(" ")}
        >
          {option === "ALL" ? "All regions" : option}
        </button>
      ))}
    </div>
  );
}
