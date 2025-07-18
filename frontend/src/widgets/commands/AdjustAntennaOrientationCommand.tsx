import { useState } from "react";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { X } from "lucide-react";
import { useCommandStore } from "../../store/commands";
import { useMutation } from "@tanstack/react-query";
import { sendCommandToAPI } from "../../lib/api";

interface Props {
  onRemove: (widgetId: string) => void;
  widgetId: string;
}

export function AdjustAntennaOrientationCommand({ onRemove, widgetId }: Props) {
  const [direction, setDirection] = useState<string>("N");
  const [elevation, setElevation] = useState<number | "">(0);
  const [polarization, setPolarization] = useState<string>("RHCP");
  const [autoTrack, setAutoTrack] = useState<boolean>(false);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { sendCommand } = useCommandStore();

  const handleSubmit = () => {
    if (typeof elevation === "string") {
      toast.error("Please Provide a value for elevation");
      return;
    }
    setShowConfirm(true);
  };

  const { mutate } = useMutation({
    mutationFn: sendCommandToAPI,
    onSuccess: () => {
      toast.success("Command submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to send command");
    },
  });

  const handleConfirm = async () => {
    setShowConfirm(false);

    const payload = {
      direction,
      elevation,
      polarization,
      autoTrack,
    };

    const data = {
      type: "schedule_reboot",
      payload: JSON.stringify(payload),
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
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-semibold'>
                Adjust Antenna Orientation
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
        <div className='overflow-auto space-y-4'>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <Label htmlFor='direction'>Direction</Label>
              <Select
                value={direction}
                onValueChange={(value) => setDirection(value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select direction' />
                </SelectTrigger>
                <SelectContent>
                  {["N", "NE", "E", "SE", "S", "SW", "W", "NW"].map((dir) => (
                    <SelectItem key={dir} value={dir} className='no-drag'>
                      {dir}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='elevation'>Elevation (0-90°)</Label>
              <Input
                type='number'
                className='no-drag'
                min={0}
                max={90}
                value={elevation}
                onChange={(e) => {
                  const val = e.target.value;
                  setElevation(val === "" ? "" : Number(val));
                }}
                id='elevation'
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <Label htmlFor='polarization'>Polarization</Label>
              <Select
                value={polarization}
                onValueChange={(value) => setPolarization(value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select polarization' />
                </SelectTrigger>
                <SelectContent>
                  {["RHCP", "LHCP"].map((pol) => (
                    <SelectItem key={pol} value={pol} className='no-drag'>
                      {pol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex flex-col space-x-2'>
              <Label htmlFor='autoTrack'>Auto-Track Enabled</Label>
              <Switch
                checked={autoTrack}
                onCheckedChange={(checked) => setAutoTrack(Boolean(checked))}
                id='autoTrack'
                className='no-drag'
              />
            </div>
          </div>

          <Button onClick={handleSubmit} variant='secondary' className='w-full'>
            Submit Command
          </Button>
        </div>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Critical Command</DialogTitle>
            <DialogDescription>
              This is a critical operation. Please confirm you want to proceed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleConfirm}
              className='ml-2'>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
