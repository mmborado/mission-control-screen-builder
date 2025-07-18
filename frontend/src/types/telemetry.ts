export type TelemetryEntry = {
  timestamp: string;
  subsystem: string;
  metric: string;
  value: number;
  unit: string;
  status: string;
};

export type PowerTelemetry = {
  battery: number;
  solar_input: number;
  consumption: number;
};
