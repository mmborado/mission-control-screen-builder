import { useDrag } from "react-dnd";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const DRAG_ITEM_TYPE = "SIDEBAR_WIDGET";

const WIDGETS = [
  "TelemetryPanel",
  "PowerStatusPanel",
  "TemperatureChart",
  "ResetPayloadCommand",
  "AdjustThermalControlCommand",
  "ActivatePayloadCommand",
  "AdjustAntennaOrientationCommand",
  "ScheduleSystemRebootCommand",
  "HistoricalTelemetryPanel",
  "CommandHistoryPanel",
];

const SidebarItem = ({ name }: { name: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_ITEM_TYPE,
    item: { widgetType: name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Button
      ref={(el) => {
        drag(el);
      }}
      variant='secondary'
      className={`w-full px-4 py-2 rounded border-2 border-black shadow-lg ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}>
      <Plus /> {name}
    </Button>
  );
};

export function Sidebar() {
  return (
    <div className='h-full bg-gray-800 text-white p-2 shadow-[6px_0_8px_-2px_rgba(0,0,0,0.6)]'>
      <h2 className='text-xl font-bold pb-2 text-center border-b-2 border-primary'>
        {" "}
        Widgets{" "}
      </h2>

      <div className='p-4 space-y-2'>
        {WIDGETS.map((name) => (
          <SidebarItem key={name} name={name} />
        ))}
      </div>
    </div>
  );
}
