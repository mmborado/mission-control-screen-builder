"use client";

import { useState } from "react";
import { useCommandStore } from "../../store/commands";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { sendCommandToAPI } from "../../lib/api";

interface Props {
  onRemove: (widgetId: string) => void;
  widgetId: string;
}

export function ResetPayloadCommand({ onRemove, widgetId }: Props) {
  const { sendCommand } = useCommandStore();
  const [selectedSubsystem, setSelectedSubsystem] = useState<string | null>(
    null
  );

  const { mutate } = useMutation({
    mutationFn: sendCommandToAPI,
    onSuccess: () => {
      toast.success("Payload reset!");
    },
    onError: () => {
      toast.error("Failed to send command");
    },
  });

  const submit = () => {
    if (!selectedSubsystem) return;

    const data = {
      type: "reset_payload",
      payload: selectedSubsystem,
      critical: false,
    };

    const cmd = sendCommand(data);
    mutate(cmd);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold'>Reset Payload</h2>
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
      <CardContent className='space-y-4'>
        <Select
          value={selectedSubsystem || ""}
          onValueChange={setSelectedSubsystem}>
          <SelectTrigger className='bg-gray-800 border border-gray-700 w-full'>
            <SelectValue placeholder='Select subsystem...' />
          </SelectTrigger>
          <SelectContent className='bg-gray-900 text-white border-gray-700'>
            <SelectItem value='Camera'>Camera</SelectItem>
            <SelectItem value='Comms'>Comms</SelectItem>
            <SelectItem value='Thermal'>Thermal</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant='secondary'
          onClick={() => submit()}
          disabled={!selectedSubsystem}
          className='w-full no-drag'>
          Send Command
        </Button>
      </CardContent>
    </Card>
  );
}
