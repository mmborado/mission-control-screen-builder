import { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useLayoutStore } from "../../store/layout";
import { useDrop } from "react-dnd";
import type { WidgetType } from "../../types/widgets";
import { WIDGET_COMPONENTS, WIDGET_PROPS } from "../../widgets";
import { useRef } from "react";

const ResponsiveGridLayout = WidthProvider(Responsive);

export function WidgetGrid() {
  const { layout, setLayout, widgets, addWidget, removeWidget } =
    useLayoutStore();
  const gridRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "SIDEBAR_WIDGET",
    drop: (
      item: {
        widgetType: WidgetType;
      },
      monitor
    ) => {
      if (monitor.didDrop()) return;

      const clientOffset = monitor.getClientOffset();
      const gridRect = gridRef.current?.getBoundingClientRect();

      if (!clientOffset || !gridRect) {
        addWidget(item.widgetType);
        return;
      }

      const relativeX = clientOffset.x - gridRect.left;
      const relativeY = clientOffset.y - gridRect.top;

      const colWidth = gridRect.width / 12;
      const rowHeight = 80;

      const x = Math.max(0, Math.min(12 - 4, Math.floor(relativeX / colWidth))); // assuming widget w = 4
      const y = Math.floor(relativeY / rowHeight);

      addWidget(item.widgetType, { x, y });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(el) => {
        drop(el);
        gridRef.current = el;
      }}
      className={`border-2 ${
        isOver ? "border-blue-400 bg-gray-800" : "border-transparent"
      } rounded-lg h-[calc(100vh-150px)] relative`}
      style={{ width: "100%", minHeight: "400px" }}>
      {widgets.length === 0 && !isOver && (
        <div className='absolute inset-0 flex items-center justify-center text-white text-lg pointer-events-none z-10 font-bold bg-gray-800 rounded-lg'>
          Drag widgets here to start building your dashboard.
        </div>
      )}
      <ResponsiveGridLayout
        className='layout'
        style={{ minHeight: "320px" }}
        layouts={{ lg: layout }}
        breakpoints={{ sm: 768, lg: 1200 }}
        cols={{ sm: 4, lg: 12 }}
        rowHeight={80}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
        isResizable
        isDraggable
        draggableCancel='.no-drag'>
        {widgets.map(({ i, type }) => {
          const WidgetComponent = WIDGET_COMPONENTS[type];
          if (!WidgetComponent) return null;

          const props = WIDGET_PROPS[type] || {};

          return (
            <div
              key={i}
              className='p-2 b-2 border-black border-solid box-border overflow-hidden'>
              <WidgetComponent
                {...props}
                widgetId={i}
                onRemove={() => removeWidget(i)}
              />
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}
