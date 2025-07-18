import { create } from "zustand";
import type { Layout } from "react-grid-layout";
import type { WidgetType } from "../types/widgets";
import { defaultWidgetSizes } from "../constants/defaultWidgetSizes";

const STORAGE_KEY = "missionControlLayout";

function saveLayoutToStorage(layout: Layout[], widgets: WidgetInstance[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ layout, widgets }));
}

interface LoadLayoutFromStorageProps {
  layout: Layout[];
  widgets: WidgetInstance[];
}

function loadLayoutFromStorage(): LoadLayoutFromStorageProps {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data)
      return {
        layout: [],
        widgets: [],
      };
    const parsedData = JSON.parse(data);
    return {
      layout: parsedData.layout || [],
      widgets: parsedData.widgets || [],
    };
  } catch (e) {
    console.error("Failed to laod layout: ", e);
    return {
      layout: [],
      widgets: [],
    };
  }
}

interface WidgetInstance {
  i: string;
  type: WidgetType;
}

interface LayoutState {
  layout: Layout[];
  widgets: WidgetInstance[];
  initLayout: () => void;
  setLayout: (layout: Layout[]) => void;
  addWidget: (
    type: WidgetInstance["type"],
    position?: { x: number; y: number }
  ) => void;
  removeWidget: (id: string) => void;
}

let idCounter = 0;
let hasLoadedFromStorage = false;

export const useLayoutStore = create<LayoutState>((set, get) => ({
  layout: [],
  widgets: [],
  initLayout: () => {
    const { layout, widgets } = loadLayoutFromStorage();
    hasLoadedFromStorage = true;
    set({ layout, widgets });
  },
  setLayout: (layout) => {
    const widgets = get().widgets;
    if (hasLoadedFromStorage) {
      saveLayoutToStorage(layout, widgets);
    }
    set({ layout });
  },
  addWidget: (type, position = { x: 0, y: Infinity }) => {
    const id = `${type.toLowerCase()}-${idCounter++}`;

    const { w, h } = defaultWidgetSizes[type] || { w: 4, h: 2 };

    const newItem: Layout = {
      i: id,
      x: position.x,
      y: position.y,
      w,
      h,
    };

    const newWidget: WidgetInstance = { i: id, type };

    const layout = [...get().layout, newItem];
    const widgets = [...get().widgets, newWidget];

    if (hasLoadedFromStorage) {
      saveLayoutToStorage(layout, widgets);
    }

    set({ layout, widgets });
  },

  removeWidget: (id: string) => {
    const layout = get().layout.filter((item) => item.i !== id);
    const widgets = get().widgets.filter((widget) => widget.i !== id);

    if (hasLoadedFromStorage) {
      saveLayoutToStorage(layout, widgets);
    }
    set({ layout, widgets });
  },
}));
