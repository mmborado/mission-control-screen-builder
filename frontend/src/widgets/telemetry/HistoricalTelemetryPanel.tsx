import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { Minus, Plus, X } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";

type TelemetryPoint = {
  timestamp: string; // ISO string
  [metric: string]: number | string; // dynamic metrics + timestamp
};

const ALL_METRICS = [
  "cpu_temp",
  "battery_voltage",
  "signal_strength",
  "payload_temp",
  "thermal_level",
];

const TIME_RANGES = [
  { label: "Last 1 Hour", value: "1h" },
  { label: "Last 24 Hours", value: "24h" },
  { label: "Custom Range", value: "custom" },
];

interface LimitLine {
  metric: string;
  value: number;
  label: string;
  stroke: string;
}

interface Props {
  onRemove: (widgetId: string) => void;
  widgetId: string;
}

export function HistoricalTelemetryPanel({ onRemove, widgetId }: Props) {
  const [metrics, setMetrics] = useState<string[]>([
    "cpu_temp",
    "battery_voltage",
    "signal_strength",
    "payload_temp",
    "thermal_level",
  ]);

  const [timeRange, setTimeRange] = useState<string>("24h");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  const [limitLines, setLimitLines] = useState<LimitLine[]>([
    { metric: "cpu_temp", value: 28, label: "Temp Limit", stroke: "#EF4444" },
  ]);

  const [data, setData] = useState<TelemetryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [brushStartIndex, setBrushStartIndex] = useState<number | undefined>(
    undefined
  );
  const [brushEndIndex, setBrushEndIndex] = useState<number | undefined>(
    undefined
  );

  const apiTimeRangeParam = useMemo(() => {
    if (timeRange !== "custom") return timeRange;
    if (customStart && customEnd) return `${customStart},${customEnd}`;
    return "";
  }, [timeRange, customStart, customEnd]);

  useEffect(() => {
    if (!metrics.length) {
      setData([]);
      return;
    }
    if (timeRange === "custom" && (!customStart || !customEnd)) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("range", apiTimeRangeParam);
        queryParams.set("metrics", metrics.join(","));

        const res = await fetch(
          `http://localhost:8080/api/telemetry/historical?${queryParams.toString()}`
        );
        if (!res.ok) throw new Error(`Server error: ${res.statusText}`);

        const json = await res.json();
        if (!json) {
          setData([]);
        } else {
          setData(json);
        }
      } catch (e: any) {
        setError(e.message);
        setData([]);
        toast("Error", {
          description: e.message,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [metrics, apiTimeRangeParam]);

  const onBrushChange = (range: any) => {
    if (
      range &&
      typeof range.startIndex === "number" &&
      typeof range.endIndex === "number"
    ) {
      setBrushStartIndex(range.startIndex);
      setBrushEndIndex(range.endIndex);
    }
  };

  const zoomStep = 100;
  const zoomIn = () => {
    if (brushStartIndex === undefined || brushEndIndex === undefined) return;
    const newStart = Math.min(brushStartIndex + zoomStep, brushEndIndex);
    setBrushStartIndex(newStart);
  };
  const zoomOut = () => {
    if (brushStartIndex === undefined || brushEndIndex === undefined) return;
    const newStart = Math.max(0, brushStartIndex - zoomStep);
    setBrushStartIndex(newStart);
  };

  const addLimitLine = () => {
    if (metrics.length === 0) return;
    setLimitLines((prev) => [
      ...prev,
      { metric: metrics[0], value: 0, label: "New Limit", stroke: "#F59E0B" },
    ]);
  };

  const updateLimitLineValue = (index: number, value: number) => {
    setLimitLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, value } : line))
    );
  };

  const updateLimitLineMetric = (index: number, metric: string) => {
    setLimitLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, metric } : line))
    );
  };

  const removeLimitLine = (index: number) => {
    setLimitLines((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleOption = (option: string) => {
    if (metrics.includes(option)) {
      setMetrics(metrics.filter((item) => item !== option));
    } else {
      setMetrics([...metrics, option]);
    }
  };

  return (
    <Card>
      <div className='overflow-auto'>
        <CardHeader>
          <CardTitle>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-semibold'>Reset Payload</h2>
              <Button
                variant='close'
                size='icon'
                onClick={() => onRemove(widgetId)}
                title='Remove'>
                <X className='w-2 h-2' />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <div className='my-4 flex flex-wrap gap-4 items-center'>
          <div className='max-h-48 overflow-auto border rounded p-2 bg-gray-800 text-white w-48 no-drag'>
            {ALL_METRICS.map((option) => (
              <label
                key={option}
                className='flex items-center space-x-2 cursor-pointer mb-1'>
                <input
                  type='checkbox'
                  checked={metrics.includes(option)}
                  onChange={() => toggleOption(option)}
                  className='form-checkbox'
                />
                <span className='capitalize'>
                  {option.replaceAll("_", " ")}
                </span>
              </label>
            ))}
          </div>

          <div className='flex space-x-2'>
            {TIME_RANGES.map(({ label, value }) => (
              <Button
                key={value}
                variant={timeRange === value ? "secondary" : "outline"}
                onClick={() => setTimeRange(value)}>
                {label}
              </Button>
            ))}
          </div>

          {timeRange === "custom" && (
            <div className='flex space-x-2 items-center'>
              <label className='text-sm'>Start:</label>
              <Input
                type='datetime-local'
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
              <label className='text-sm'>End:</label>
              <Input
                type='datetime-local'
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                min={customStart}
              />
            </div>
          )}
        </div>

        <div className='mb-4'>
          <h4 className='mb-2 font-semibold text-white'>Limit Lines</h4>
          {limitLines.map(({ value, metric }, i) => (
            <div key={i} className='flex items-center space-x-2 mb-2'>
              <Select
                value={metric}
                onValueChange={(val) => updateLimitLineMetric(i, val)}>
                <SelectTrigger className='w-1/2'>{metric}</SelectTrigger>
                <SelectContent>
                  {metrics.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type='number'
                value={value}
                onChange={(e) =>
                  updateLimitLineValue(i, Number(e.target.value))
                }
                className='w-20 mb-0'
              />
              <Button
                variant='outline'
                onClick={() => removeLimitLine(i)}
                aria-label='Remove limit line'>
                ✕
              </Button>
            </div>
          ))}
          <Button variant='secondary' onClick={addLimitLine}>
            Add Limit Line
          </Button>
        </div>

        {/* Zoom controls */}
        <div className='mb-4 px-8 flex items-center justify-end space-x-2'>
          <span>Zoom: </span>
          <Button
            variant='outline'
            onClick={zoomIn}
            disabled={brushStartIndex === undefined}>
            <Plus />
          </Button>
          <Button
            variant='outline'
            onClick={zoomOut}
            disabled={brushStartIndex === undefined}>
            <Minus />
          </Button>
        </div>

        {/* Chart */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-400'>{error}</p>
        ) : data.length === 0 ? (
          <p> No data available for this time range.</p>
        ) : (
          <ResponsiveContainer width='100%' height={400} className='no-drag'>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#444' />
              <XAxis
                dataKey='timestamp'
                stroke='#aaa'
                tickFormatter={(tick) =>
                  new Date(tick).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })
                }
                interval='preserveStartEnd'
              />
              <YAxis stroke='#aaa' />
              <Tooltip
                labelFormatter={(label) =>
                  new Date(label).toLocaleString(undefined, {
                    timeZoneName: "short",
                  })
                }
              />
              <Legend />

              {metrics.map((metric, idx) => (
                <Line
                  key={metric}
                  type='monotone'
                  dataKey={metric}
                  stroke={["#34D399", "#3B82F6", "#F59E0B", "#EF4444"][idx % 4]}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}

              {limitLines.map(({ value, label, stroke }, i) => (
                <ReferenceLine
                  key={i}
                  y={value}
                  stroke={stroke}
                  strokeDasharray='4 2'
                  label={label}
                />
              ))}

              <Brush
                dataKey='timestamp'
                height={30}
                stroke='#8884d8'
                travellerWidth={10}
                onChange={onBrushChange}
                startIndex={brushStartIndex}
                endIndex={brushEndIndex}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
