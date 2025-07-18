import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export type CommandStatus = "pending" | "approved" | "sent" | "failed";

export type CommandEntry = {
  id: string;
  type: string;
  payload?: string;
  critical: boolean;
  status: CommandStatus;
  timestamp: string;
};

type CommandStore = {
  commands: CommandEntry[];
  sendCommand: (
    cmd: Omit<CommandEntry, "id" | "status" | "timestamp">
  ) => CommandEntry;
  clearCommands: () => void;
};

export const useCommandStore = create<CommandStore>()(
  persist(
    (set) => ({
      commands: [],
      sendCommand: (cmdInput) => {
        const newCommand: CommandEntry = {
          id: nanoid(),
          status: cmdInput.critical ? "pending" : "sent",
          timestamp: new Date().toISOString(),
          ...cmdInput,
        };

        set((state) => ({
          commands: [...state.commands, newCommand],
        }));

        return newCommand;
      },
      clearCommands: () => set({ commands: [] }),
    }),
    {
      name: "mission-control-commands",
    }
  )
);
