import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { CommandEntry } from "../../store/commands";
import { toast } from "sonner";

interface Props {
  onRemove: (widgetId: string) => void;
  widgetId: string;
}

export const CommandHistoryPanel = ({ onRemove, widgetId }: Props) => {
  const { data: commands = [], isLoading } = useQuery<CommandEntry[], Error>({
    queryKey: ["commandHistory"],
    queryFn: async (): Promise<CommandEntry[]> => {
      const res = await fetch("http://localhost:8080/api/commands");
      if (!res.ok) {
        toast.error("Failed to fetch command history");
      }
      return res.json();
    },
    refetchInterval: 10000,
  });

  const formatPayload = (payload: unknown): string => {
    try {
      const parsed =
        typeof payload === "string" ? JSON.parse(payload) : payload;

      if (parsed && typeof parsed === "object") {
        return JSON.stringify(parsed, null, 2);
      }

      return String(parsed);
    } catch {
      return String(payload);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold'>Command History</h2>
            <Button
              variant='close'
              size='icon'
              onClick={() => onRemove(widgetId)}
              title='Remove'>
              <X className='w-2 h-2' />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className='space-y-2 overflow-y-auto text-sm'>
          {commands.map((cmd) => (
            <li
              key={cmd.id}
              className='border border-gray-700 rounded-md p-2 bg-gray-900'>
              <div className='flex justify-between'>
                <span className='font-bold capitalize'>
                  {cmd.type.replaceAll("_", " ")}
                </span>
                <span className='text-xs text-gray-400'>
                  {new Date(cmd.timestamp).toLocaleString()}
                </span>
              </div>
              <div className='text-xs mt-1'>
                <p>
                  Status: <strong>{cmd.status}</strong>
                </p>
                {cmd.payload && <p>Payload: {formatPayload(cmd.payload)}</p>}
                {cmd.critical && <p className='text-red-400'>Critical</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
