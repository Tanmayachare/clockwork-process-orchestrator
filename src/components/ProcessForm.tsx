
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Process } from '@/types/process';
import { toast } from 'sonner';

const PROCESS_COLORS = [
  'bg-process-p1', 'bg-process-p2', 'bg-process-p3', 'bg-process-p4',
  'bg-process-p5', 'bg-process-p6', 'bg-process-p7', 'bg-process-p8'
];

interface ProcessFormProps {
  onAddProcess: (process: Process) => void;
  processCount: number;
}

const ProcessForm = ({ onAddProcess, processCount }: ProcessFormProps) => {
  const [name, setName] = useState(`P${processCount + 1}`);
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(1);
  const [priority, setPriority] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (burstTime < 1) {
      toast.error('Burst time must be at least 1');
      return;
    }

    if (arrivalTime < 0) {
      toast.error('Arrival time cannot be negative');
      return;
    }

    const colorIndex = processCount % PROCESS_COLORS.length;
    
    const newProcess: Process = {
      id: `p-${Date.now()}`,
      name,
      arrivalTime,
      burstTime,
      priority,
      color: PROCESS_COLORS[colorIndex],
    };
    
    onAddProcess(newProcess);
    
    // Reset form for next process
    setName(`P${processCount + 2}`);
    setArrivalTime(prev => prev);
    setBurstTime(1);
    setPriority(prev => prev + 1);
    
    toast.success(`Process ${name} added`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Add Process</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="process-name">Process Name</Label>
              <Input
                id="process-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Process name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrival-time">Arrival Time</Label>
              <Input
                id="arrival-time"
                type="number"
                min="0"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="burst-time">Burst Time</Label>
              <Input
                id="burst-time"
                type="number"
                min="1"
                value={burstTime}
                onChange={(e) => setBurstTime(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value))}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Add Process</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProcessForm;
