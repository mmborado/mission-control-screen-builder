import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Slider } from "../../components/ui/slider";
import { Button } from "../../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import { sendCommandToAPI } from "../../lib/api";
import { useCommandStore } from "../../store/commands";

interface Props {
  onRemove: (widgetId: string) => void;
  widgetId: string;
}

export function AdjustThermalControlCommand({ onRemove, widgetId }: Props) {
  const [value, setValue] = useState(50);
  const [confirmed, setConfirmed] = useState(false);
  const { sendCommand } = useCommandStore();

  const { mutate, isPending } = useMutation({
    mutationFn: sendCommandToAPI,
    onSuccess: () => {
      toast.success("Power level adjusted");
      setConfirmed(false);
    },
    onError: () => {
      toast.error("Failed to send command");
    },
  });

  const submit = () => {
    const data = {
      type: "adjust_thermal_control",
      payload: JSON.stringify({ level: value }),
      critical: true,
    };

    const cmd = sendCommand(data);
    mutate(cmd);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold'>Adjust Thermal Control</h2>
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
      <CardContent>
        <div className='mb-6'>
          <div className='mb-2'>
            <strong>Power Level: {value}% </strong>
          </div>
          <Slider
            value={[value]}
            onValueChange={(v) => setValue(v[0])}
            min={0}
            max={100}
            step={5}
          />
        </div>

        <div className='text-center'>
          {!confirmed ? (
            <Button variant='destructive' onClick={() => setConfirmed(true)}>
              Confirm Critical Command
            </Button>
          ) : (
            <Button
              variant='outline'
              onClick={() => submit()}
              disabled={isPending}>
              {isPending ? "Sending..." : "Send Command"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
