
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SchedulingAlgorithm } from '@/types/process';

interface AlgorithmGuideProps {
  selectedAlgorithm: SchedulingAlgorithm;
}

const AlgorithmGuide = ({ selectedAlgorithm }: AlgorithmGuideProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Algorithm Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="description">
            <AccordionTrigger>About {selectedAlgorithm}</AccordionTrigger>
            <AccordionContent>
              {selectedAlgorithm === SchedulingAlgorithm.FCFS && (
                <div className="space-y-2">
                  <p>
                    <strong>First-Come, First-Served (FCFS)</strong> is the simplest CPU scheduling algorithm. 
                    In this scheme, the process that requests the CPU first is allocated the CPU first.
                  </p>
                  <p>
                    <strong>Key characteristics:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Non-preemptive algorithm</li>
                    <li>Easy to understand and implement</li>
                    <li>Poor in performance as average wait time is often quite long</li>
                    <li>Can cause the "convoy effect" where short processes wait for a long process to finish</li>
                  </ul>
                </div>
              )}

              {selectedAlgorithm === SchedulingAlgorithm.SJF && (
                <div className="space-y-2">
                  <p>
                    <strong>Shortest Job First (SJF)</strong> selects the process with the smallest execution time.
                  </p>
                  <p>
                    <strong>Key characteristics:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Can be either preemptive or non-preemptive</li>
                    <li>This implementation is non-preemptive SJF</li>
                    <li>Optimal for minimizing average waiting time</li>
                    <li>Requires knowledge of process burst times in advance (practically impossible)</li>
                    <li>May lead to starvation of longer processes if short processes continually arrive</li>
                  </ul>
                </div>
              )}

              {selectedAlgorithm === SchedulingAlgorithm.PRIORITY && (
                <div className="space-y-2">
                  <p>
                    <strong>Priority Scheduling</strong> assigns a priority value to each process, and the CPU is allocated based on priority.
                  </p>
                  <p>
                    <strong>Key characteristics:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Can be either preemptive or non-preemptive</li>
                    <li>This implementation is non-preemptive priority scheduling</li>
                    <li>Lower priority values indicate higher priority</li>
                    <li>May lead to starvation of low-priority processes</li>
                    <li>Aging can be used to mitigate starvation</li>
                  </ul>
                </div>
              )}

              {selectedAlgorithm === SchedulingAlgorithm.ROUND_ROBIN && (
                <div className="space-y-2">
                  <p>
                    <strong>Round Robin (RR)</strong> is designed specifically for time-sharing systems. It assigns a fixed time slice or quantum to each process.
                  </p>
                  <p>
                    <strong>Key characteristics:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Preemptive scheduling algorithm</li>
                    <li>Each process gets a fixed time slice called the time quantum</li>
                    <li>After the quantum expires, the process is preempted and added to the end of the ready queue</li>
                    <li>Fair allocation of CPU to all processes</li>
                    <li>Performance depends heavily on the time quantum size</li>
                  </ul>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="metrics">
            <AccordionTrigger>Understanding Metrics</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Waiting Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Time spent waiting in the ready queue for CPU. 
                    Waiting Time = Completion Time - Arrival Time - Burst Time
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Turnaround Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Total time taken to complete a process.
                    Turnaround Time = Completion Time - Arrival Time
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">CPU Utilization</h4>
                  <p className="text-sm text-muted-foreground">
                    Percentage of time the CPU spends doing useful work rather than being idle.
                    CPU Utilization = (Total Burst Time / Total Execution Time) × 100%
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AlgorithmGuide;
