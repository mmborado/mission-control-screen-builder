import type { WidgetType } from "../types/widgets";

export const defaultWidgetSizes: Record<WidgetType, { w: number; h: number }> =
  {
    TelemetryPanel: { w: 6, h: 5 },
    PowerStatusPanel: { w: 3, h: 4 },
    TemperatureChart: { w: 6, h: 4 },
    ResetPayloadCommand: { w: 4, h: 3 },
    ActivatePayloadCommand: { w: 3, h: 2 },
    AdjustThermalControlCommand: { w: 4, h: 3 },
    AdjustAntennaOrientationCommand: { w: 4, h: 5 },
    ScheduleSystemRebootCommand: { w: 4, h: 4 },
    HistoricalTelemetryPanel: { w: 12, h: 12 },
    CommandHistoryPanel: { w: 6, h: 5 },
  };
