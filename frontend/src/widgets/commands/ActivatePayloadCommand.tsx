import { useState } from "react";
import { Switch } from "../../components/ui/switch";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { sendCommandToAPI } from "../../lib/api";
import { useCommandStore } from "../../store/commands";

interface Props {
  onRemove: (widgetId: string) => void;
  widgetId: string;
}

export function ActivatePayloadCommand({ onRemove, widgetId }: Props) {
  const [enabled, setEnabled] = useState(false);
  const { sendCommand } = useCommandStore();

  const { mutate } = useMutation({
    mutationFn: sendCommandToAPI,
    onSuccess: () => {
      toast.success(`Payload ${enabled ? "activated" : "deactivated"}`);
    },
    onError: () => {
      toast.error("Failed to send command");
      setEnabled((prev) => !prev);
    },
  });

  const handleToggle = () => {
    const payloadEnabled = !enabled;
    setEnabled(payloadEnabled);
    const payload = JSON.stringify({ payloadEnabled });

    const data = {
      type: "activate_payload",
      payload,
      critical: false,
      status: "pending",
    };

    const cmd = sendCommand(data);
    mutate(cmd);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold'>Activate Payload</h2>
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

      <div className='flex items-center gap-2'>
        <Switch
          id='payload-switch'
          className='no-drag'
          checked={enabled}
          onCheckedChange={handleToggle}
        />
        <span>{enabled ? "On" : "Off"}</span>
      </div>
    </Card>
  );
}
