import { useEffect, useState } from "react";
import type { PowerTelemetry, TelemetryEntry } from "../types/telemetry";

export function usePowerTelemetry() {
  const [data, setData] = useState<PowerTelemetry>({
    battery: 0,
    solar_input: 0,
    consumption: 0,
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws/telemetry");

    ws.onmessage = (event) => {
      try {
        const parsed: TelemetryEntry[] = JSON.parse(event.data);

        const battery = parsed.find(
          (entry) => entry.metric === "battery"
        )?.value;
        const solarInput = parsed.find(
          (entry) => entry.metric === "solar_input"
        )?.value;
        const consumption = parsed.find(
          (entry) => entry.metric === "consumption"
        )?.value;

        if (
          battery !== undefined &&
          solarInput !== undefined &&
          consumption !== undefined
        ) {
          setData({
            battery,
            solar_input: solarInput,
            consumption,
          });
        }
      } catch (err) {
        console.error("Invalid telemetry data", err);
      }
    };

    return () => ws.close();
  }, []);

  return data;
}
