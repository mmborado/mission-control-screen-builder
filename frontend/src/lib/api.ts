// lib/api.ts
import type { CommandEntry } from "../store/commands";

export async function sendCommandToAPI(cmd: CommandEntry) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/api/commands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  });

  if (!res.ok) {
    throw new Error("Failed to send command");
  }

  return await res.json();
}
