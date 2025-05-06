
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SchedulingAlgorithm } from '@/types/process';
import { Play } from 'lucide-react';

interface AlgorithmSelectorProps {
  selectedAlgorithm: SchedulingAlgorithm;
  onAlgorithmChange: (algorithm: SchedulingAlgorithm) => void;
  timeQuantum: number;
  onTimeQuantumChange: (quantum: number) => void;
  onRunSimulation: () => void;
  disableRun: boolean;
}

const AlgorithmSelector = ({
  selectedAlgorithm,
  onAlgorithmChange,
  timeQuantum,
  onTimeQuantumChange,
  onRunSimulation,
  disableRun
}: AlgorithmSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Scheduling Algorithm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="algorithm">Select Algorithm</Label>
            <Select 
              value={selectedAlgorithm} 
              onValueChange={(value) => onAlgorithmChange(value as SchedulingAlgorithm)}
            >
              <SelectTrigger id="algorithm">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SchedulingAlgorithm.FCFS}>
                  {SchedulingAlgorithm.FCFS}
                </SelectItem>
                <SelectItem value={SchedulingAlgorithm.SJF}>
                  {SchedulingAlgorithm.SJF}
                </SelectItem>
                <SelectItem value={SchedulingAlgorithm.PRIORITY}>
                  {SchedulingAlgorithm.PRIORITY}
                </SelectItem>
                <SelectItem value={SchedulingAlgorithm.ROUND_ROBIN}>
                  {SchedulingAlgorithm.ROUND_ROBIN}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedAlgorithm === SchedulingAlgorithm.ROUND_ROBIN && (
            <div className="space-y-2">
              <Label htmlFor="time-quantum">Time Quantum</Label>
              <Input
                id="time-quantum"
                type="number"
                min="1"
                value={timeQuantum}
                onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          )}

          <Button 
            onClick={onRunSimulation} 
            disabled={disableRun}
            className="w-full"
          >
            <Play className="mr-2 h-4 w-4" />
            Run Simulation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmSelector;
