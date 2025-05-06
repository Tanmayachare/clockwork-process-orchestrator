
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Process, TimeSlot } from '@/types/process';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GanttChartProps {
  timeline: TimeSlot[];
  processes: Process[];
  totalTime: number;
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  cpuUtilization: number;
}

const GanttChart = ({
  timeline,
  processes,
  totalTime,
  averageWaitingTime,
  averageTurnaroundTime,
  cpuUtilization
}: GanttChartProps) => {
  // Function to generate time markers for the timeline
  const generateTimeMarkers = () => {
    const markers = [];
    const markerCount = totalTime <= 20 ? totalTime + 1 : 11; // If long timeline, show fewer markers
    const step = totalTime <= 20 ? 1 : Math.ceil(totalTime / 10);
    
    for (let i = 0; i < markerCount; i++) {
      const time = i * step;
      if (time <= totalTime) {
        markers.push(
          <span 
            key={`marker-${i}`}
            className="time-marker"
            style={{ left: `${(time / totalTime) * 100}%` }}
          >
            {time}
          </span>
        );
      }
    }
    
    return markers;
  };

  const getProcessById = (id: string): Process | undefined => {
    return processes.find(p => p.id === id);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Simulation Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="gantt">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
            <TabsTrigger value="metrics">Process Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gantt" className="space-y-4">
            <div className="rounded-md border">
              <div className="p-4">
                <div className="gantt-chart">
                  <div className="labels flex flex-col justify-center">
                    <div className="h-5"></div> {/* Space for time markers */}
                    {processes.map((process) => (
                      <div key={process.id} className="h-10 flex items-center font-medium">
                        {process.name}
                      </div>
                    ))}
                  </div>
                  
                  <div className="chart">
                    <div className="time-markers">
                      {generateTimeMarkers()}
                    </div>
                    
                    {processes.map((process) => (
                      <div key={process.id} className="timeline">
                        {timeline
                          .filter(slot => slot.processId === process.id)
                          .map((slot, index) => (
                            <div
                              key={`${process.id}-slot-${index}`}
                              className={cn("process-block", process.color)}
                              style={{
                                left: `${(slot.start / totalTime) * 100}%`,
                                width: `${((slot.end - slot.start) / totalTime) * 100}%`,
                              }}
                            >
                              {slot.end - slot.start > 1 && (
                                <span className="text-xs">{slot.end - slot.start}</span>
                              )}
                            </div>
                          ))}
                      </div>
                    ))}
                    
                    {/* Idle time slots */}
                    <div className="timeline">
                      {timeline
                        .filter(slot => slot.processId === null)
                        .map((slot, index) => (
                          <div
                            key={`idle-slot-${index}`}
                            className="process-block bg-gray-300 text-gray-700"
                            style={{
                              left: `${(slot.start / totalTime) * 100}%`,
                              width: `${((slot.end - slot.start) / totalTime) * 100}%`,
                            }}
                          >
                            {slot.end - slot.start > 1 && (
                              <span className="text-xs">IDLE</span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Summary metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-secondary rounded-md p-4 text-center">
                <div className="text-sm text-muted-foreground">Average Waiting Time</div>
                <div className="text-2xl font-semibold">{averageWaitingTime.toFixed(2)}</div>
              </div>
              <div className="bg-secondary rounded-md p-4 text-center">
                <div className="text-sm text-muted-foreground">Average Turnaround Time</div>
                <div className="text-2xl font-semibold">{averageTurnaroundTime.toFixed(2)}</div>
              </div>
              <div className="bg-secondary rounded-md p-4 text-center">
                <div className="text-sm text-muted-foreground">CPU Utilization</div>
                <div className="text-2xl font-semibold">{cpuUtilization.toFixed(2)}%</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="metrics">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Process</TableHead>
                    <TableHead className="text-center">Arrival Time</TableHead>
                    <TableHead className="text-center">Burst Time</TableHead>
                    <TableHead className="text-center">Priority</TableHead>
                    <TableHead className="text-center">Completion Time</TableHead>
                    <TableHead className="text-center">Turnaround Time</TableHead>
                    <TableHead className="text-center">Waiting Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processes.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell className="font-medium">{process.name}</TableCell>
                      <TableCell className="text-center">{process.arrivalTime}</TableCell>
                      <TableCell className="text-center">{process.burstTime}</TableCell>
                      <TableCell className="text-center">{process.priority}</TableCell>
                      <TableCell className="text-center">
                        {process.finishTime !== undefined ? process.finishTime : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {process.turnaroundTime !== undefined ? process.turnaroundTime : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {process.waitingTime !== undefined ? process.waitingTime : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
