import { useState, useEffect, useRef } from "react";

export type TelemetryDatum = {
  metric: string;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
};

export function useTelemetry(): { data: TelemetryDatum[] } {
  const [data, setData] = useState<TelemetryDatum[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws/telemetry");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data) as TelemetryDatum[];
      setData(parsed);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { data };
}
