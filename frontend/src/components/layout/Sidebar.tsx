import { useDrag } from "react-dnd";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useLayoutStore } from "../../store/layout";

const DRAG_ITEM_TYPE = "SIDEBAR_WIDGET";

const WIDGETS = [
  { name: "Telemetry Panel", widgetType: "TelemetryPanel" },
  { name: "Power Status Panel", widgetType: "PowerStatusPanel" },
  { name: "Temperature Panel", widgetType: "TemperatureChart" },
  { name: "Command History Panel", widgetType: "CommandHistoryPanel" },
  {
    name: "Historical Telemetry Panel",
    widgetType: "HistoricalTelemetryPanel",
  },

  { name: "Reset Payload Command", widgetType: "ResetPayloadCommand" },
  { name: "Activate Payload Command", widgetType: "ActivatePayloadCommand" },
  {
    name: "Adjust Thermal Control Command",
    widgetType: "AdjustThermalControlCommand",
  },

  {
    name: "Adjust Antenna Orientation Command",
    widgetType: "AdjustAntennaOrientationCommand",
  },
  {
    name: "Schedule System Reboot Command",
    widgetType: "ScheduleSystemRebootCommand",
  },
];

const SidebarItem = ({
  item,
}: {
  item: { name: string; widgetType: string };
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_ITEM_TYPE,
    item: { widgetType: item.widgetType },
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
      className={`w-full px-4 py-2 rounded border-2 border-black shadow-lg justify-start ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}>
      <Plus /> {item.name}
    </Button>
  );
};

export function Sidebar() {
  const { clearLayout } = useLayoutStore();

  const clearDashboard = () => {
    clearLayout();
  };

  return (
    <div className='h-full bg-gray-800 text-white p-2 shadow-[6px_0_8px_-2px_rgba(0,0,0,0.6)]'>
      <h2 className='text-xl font-bold pb-2 text-center border-b-2 border-primary'>
        {" "}
        Widgets{" "}
      </h2>

      <div className='p-4 space-y-2'>
        {WIDGETS.map((widget) => (
          <SidebarItem key={widget.widgetType} item={widget} />
        ))}
        <div className='py-4'>
          <Button variant='outline' className='w-full' onClick={clearDashboard}>
            {" "}
            Clear Dashboard{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}
