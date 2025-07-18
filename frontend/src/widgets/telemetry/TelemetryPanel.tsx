import { X } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useTelemetry } from "../../hooks/useTelemetry";
import type { TelemetryDatum } from "../../hooks/useTelemetry";
import { useState } from "react";

interface Props {
  onRemove: (widgetId: string) => void;
  widgetId: string;
}

export function TelemetryPanel({ onRemove, widgetId }: Props) {
  const { data } = useTelemetry();
  const [filters, setFilters] = useState<string[]>([]);

  const toggleFilter = (metric: string) => {
    setFilters((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const clearFilters = () => setFilters([]);

  const getColorForMetric = (metric: string, value: number) => {
    if (metric === "cpu_temp") {
      if (value > 85) return "text-red-500";
      if (value > 70) return "text-yellow-400";
      return "text-green-400";
    }
    if (metric === "battery") {
      if (value < 20) return "text-red-500";
      if (value < 50) return "text-yellow-400";
      return "text-green-400";
    }
    return "text-white";
  };

  const uniqueMetrics = Array.from(
    new Set(data?.map((item) => item.metric.toLowerCase()) ?? [])
  );

  const filteredData = data?.filter(
    (item) =>
      filters.length === 0 || filters.includes(item.metric.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold'>Telemetry Panel</h2>
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
      <CardContent className='flex overflow-auto'>
        <div className='flex flex-col mb-4 space-y-2'>
          {uniqueMetrics.length > 0 && (
            <Button
              onClick={clearFilters}
              className={`px-3 py-1 rounded-md text-sm border ${
                filters.length === 0
                  ? "bg-[var(--color-secondary)] text-black"
                  : "bg-gray-700 text-white"
              }`}>
              All
            </Button>
          )}
          {uniqueMetrics.map((metric) => {
            const isActive = filters.includes(metric);
            return (
              <Button
                key={metric}
                onClick={() => toggleFilter(metric)}
                className={`px-3 py-1 rounded-md text-sm border cursor-pointer capitalize ${
                  isActive
                    ? "bg-[var(--color-secondary)] text-black"
                    : "bg-gray-700 text-white"
                }`}>
                {metric.replace("_", " ")}
              </Button>
            );
          })}
        </div>
        <div className='px-4 flex-4/5'>
          {filteredData && filteredData.length > 0 ? (
            <ul className='space-y-2 border border-white rounded-md p-2 w-full'>
              {filteredData.map((item: TelemetryDatum) => (
                <li
                  key={item.metric}
                  className={`${getColorForMetric(
                    item.metric,
                    item.value
                  )} capitalize`}>
                  <div className='grid grid-cols-2'>
                    <span>{item.metric.replace("_", " ")}: </span>
                    <strong className='text-center'>
                      {item.value} {item.unit}
                    </strong>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading telemetry data...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
