import { useState } from "react";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { X } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { sendCommandToAPI } from "../../lib/api";
import { useCommandStore } from "../../store/commands";

interface Props {
  onRemove: (widgetId: string) => void;
  widgetId: string;
}

export function ScheduleSystemRebootCommand({ onRemove, widgetId }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const { sendCommand } = useCommandStore();

  const { mutate } = useMutation({
    mutationFn: sendCommandToAPI,
    onSuccess: () => {
      toast.success("Reboot scheduled successfully!");
    },
    onError: () => {
      toast.error("Failed to schedule reboot");
    },
  });

  const handleSubmit = () => {
    if (!date || !time) {
      toast.error("Please select both date and time.");
      return;
    }
    setShowConfirm(true);
  };

  const submit = () => {
    setShowConfirm(false);
    const scheduledAt = new Date(`${date}T${time}`);

    const data = {
      type: "schedule_reboot",
      payload: JSON.stringify({ scheduledAt: scheduledAt.toISOString() }),
      critical: true,
      status: "pending",
    };

    const cmd = sendCommand(data);
    mutate(cmd);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className='flex justify-between overflow-auto'>
              <h2 className='text-lg font-semibold mb-2'>
                Schedule System Reboot{" "}
              </h2>
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

        <div className='overflow-auto'>
          <div>
            <Label htmlFor='reboot-date'>Reboot Date</Label>
            <Input
              type='date'
              id='reboot-date'
              className='no-drag'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor='reboot-time'>Reboot Time</Label>
            <Input
              type='time'
              id='reboot-time'
              className='no-drag'
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <Button
            variant='destructive'
            onClick={handleSubmit}
            className='w-full'>
            Schedule Reboot
          </Button>
        </div>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Scheduled Reboot</DialogTitle>
            <DialogDescription>
              This is a critical operation. Confirm scheduling the system
              reboot.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant='secondary'
              onClick={() => submit()}
              className='ml-2'>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
