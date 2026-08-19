export interface TabItem {
  key: string;
  label: string;
}

interface TabBarProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function TabBar({ items, activeKey, onChange }: TabBarProps) {
  return (
    <div role="tablist" className="inline-flex gap-1 rounded-lg bg-studio-800 p-1">
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <button
            key={item.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={[
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              active ? "bg-tape-500 text-studio-950" : "text-studio-300 hover:text-studio-50"
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
