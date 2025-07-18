import { X } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { usePowerTelemetry } from "../../hooks/usePowerTelemetry";

interface Props {
  onRemove: (widgetId: string) => void;
  widgetId: string;
}

export function PowerStatusPanel({ onRemove, widgetId }: Props) {
  const { battery, solar_input, consumption } = usePowerTelemetry();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold'>Power Status</h2>
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
        <div className='border border-white p-4 rounded-md'>
          <div className='mb-4 border-b-2'>
            <strong>Battery Level</strong>
            <Progress value={battery} className='h-4 rounded-md' />
            <p className='text-sm mt-1'>{battery}%</p>
          </div>
          <div className='mb-4 border-b-2'>
            <strong>Solar Input</strong>
            <p>{solar_input} W</p>
          </div>
          <div className='mb-4 border-b-2'>
            <strong>Power Consumption</strong>
            <p>{consumption} W</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
