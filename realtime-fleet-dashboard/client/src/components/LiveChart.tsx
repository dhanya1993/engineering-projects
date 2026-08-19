import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import type { ChartPoint } from "../hooks/useOnlineCountHistory";

export function LiveChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="rounded-lg border border-graphite-700 bg-graphite-900 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-graphite-400">
        Devices online (live)
      </p>
      <div className="mt-2 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="onlineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2A9873" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#2A9873" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#28323D" />
            <XAxis dataKey="time" stroke="#576B7E" tick={{ fontSize: 10 }} minTickGap={30} />
            <YAxis stroke="#576B7E" tick={{ fontSize: 10 }} width={28} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1B222B",
                border: "1px solid #28323D",
                borderRadius: 8,
                fontSize: 12
              }}
              labelStyle={{ color: "#A9BCC9" }}
            />
            <Area
              type="monotone"
              dataKey="online"
              stroke="#2A9873"
              fill="url(#onlineGradient)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
