import { TelemetryPanel } from "./telemetry/TelemetryPanel";
import { TemperatureChart } from "./telemetry/TemperatureChart";
import { ResetPayloadCommand } from "./commands/ResetPayloadCommand";
import { AdjustThermalControlCommand } from "./commands/AdjustThermalControlCommand";
import { PowerStatusPanel } from "./telemetry/PowerStatusPanel";
import { ActivatePayloadCommand } from "./commands/ActivatePayloadCommand";
import { AdjustAntennaOrientationCommand } from "./commands/AdjustAntennaOrientationCommand";
import { ScheduleSystemRebootCommand } from "./commands/RebootCommand";
import { HistoricalTelemetryPanel } from "./telemetry/HistoricalTelemetryPanel";
import { CommandHistoryPanel } from "./telemetry/CommandHistoryPanel";

export const WIDGET_COMPONENTS = {
  TelemetryPanel,
  TemperatureChart,
  ResetPayloadCommand,
  AdjustThermalControlCommand,
  ActivatePayloadCommand,
  PowerStatusPanel,
  AdjustAntennaOrientationCommand,
  ScheduleSystemRebootCommand,
  HistoricalTelemetryPanel,
  CommandHistoryPanel,
};

export const WIDGET_PROPS: Record<string, any> = {
  HistoricalTelemetryPanel: {
    metrics: ["cpu_temp", "battery_voltage", "thermal_level"],
  },
};
