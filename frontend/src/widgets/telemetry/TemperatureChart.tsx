"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";

const mockData = [
  { time: "10:00", temperature: 22 },
  { time: "10:10", temperature: 23 },
  { time: "10:20", temperature: 21 },
  { time: "10:30", temperature: 24 },
  { time: "10:40", temperature: 25 },
  { time: "10:50", temperature: 23 },
  { time: "11:00", temperature: 26 },
];

interface Props {
  onRemove: (widgetId: string) => void;
  widgetId: string;
}

export function TemperatureChart({ onRemove, widgetId }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex justify-between'>
            <h2 className='text-lg font-semibold'>Temperature Chart</h2>
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
        <ResponsiveContainer width='100%' aspect={2}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#444' />
            <XAxis dataKey='time' stroke='#aaa' />
            <YAxis domain={[20, 30]} stroke='#aaa' />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='temperature'
              stroke='#34D399'
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <ReferenceLine
              y={28}
              stroke='#EF4444'
              strokeDasharray='4 2'
              label='Limit'
            />
            <Brush dataKey='time' height={20} stroke='#8884d8' />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
