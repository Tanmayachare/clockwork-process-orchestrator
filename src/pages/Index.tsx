
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Process, SchedulingAlgorithm, SchedulingResult } from '@/types/process';
import ProcessForm from '@/components/ProcessForm';
import ProcessList from '@/components/ProcessList';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import GanttChart from '@/components/GanttChart';
import AlgorithmGuide from '@/components/AlgorithmGuide';
import { runSchedulingAlgorithm } from '@/lib/schedulingAlgorithms';
import { toast } from 'sonner';

const Index = () => {
  // State for processes
  const [processes, setProcesses] = useState<Process[]>([]);
  
  // State for scheduling configuration
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SchedulingAlgorithm>(
    SchedulingAlgorithm.FCFS
  );
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  
  // State for simulation results
  const [simulationResult, setSimulationResult] = useState<SchedulingResult | null>(null);
  
  // Function to add a new process
  const handleAddProcess = (process: Process) => {
    setProcesses(prev => [...prev, process]);
    // Reset simulation results when a new process is added
    setSimulationResult(null);
  };
  
  // Function to remove a process
  const handleRemoveProcess = (id: string) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
    // Reset simulation results when a process is removed
    setSimulationResult(null);
  };
  
  // Function to run the simulation
  const runSimulation = () => {
    if (processes.length === 0) {
      toast.error('Add at least one process before running the simulation');
      return;
    }
    
    try {
      const result = runSchedulingAlgorithm(selectedAlgorithm, processes, timeQuantum);
      setSimulationResult(result);
      toast.success('Simulation completed successfully');
    } catch (error) {
      console.error('Simulation error:', error);
      toast.error('Error running simulation');
    }
  };
  
  // Function to add demo processes
  const addDemoProcesses = () => {
    const demoProcesses: Process[] = [
      { id: 'p-1', name: 'P1', arrivalTime: 0, burstTime: 6, priority: 3, color: 'bg-process-p1' },
      { id: 'p-2', name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, color: 'bg-process-p2' },
      { id: 'p-3', name: 'P3', arrivalTime: 3, burstTime: 8, priority: 2, color: 'bg-process-p3' },
      { id: 'p-4', name: 'P4', arrivalTime: 5, burstTime: 4, priority: 4, color: 'bg-process-p4' },
    ];
    setProcesses(demoProcesses);
    setSimulationResult(null);
    toast.success('Demo processes added');
  };
  
  // Function to clear all processes
  const clearProcesses = () => {
    setProcesses([]);
    setSimulationResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container">
          <h1 className="text-2xl font-bold">Process Scheduling Simulator</h1>
          <p className="text-primary-foreground/80">
            Visualize CPU scheduling algorithms and analyze their performance metrics
          </p>
        </div>
      </header>
      
      <main className="container py-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6 gap-6 lg:gap-0">
          {/* Left column - Configuration */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="flex gap-2">
              <Button variant="secondary" onClick={addDemoProcesses} className="flex-1">
                Add Demo Processes
              </Button>
              <Button variant="outline" onClick={clearProcesses} className="flex-1">
                Clear All
              </Button>
            </div>
            
            <ProcessForm onAddProcess={handleAddProcess} processCount={processes.length} />
            
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              timeQuantum={timeQuantum}
              onTimeQuantumChange={setTimeQuantum}
              onRunSimulation={runSimulation}
              disableRun={processes.length === 0}
            />
            
            <AlgorithmGuide selectedAlgorithm={selectedAlgorithm} />
          </div>
          
          {/* Right column - Process List and Results */}
          <div className="w-full lg:w-2/3 space-y-6">
            <ProcessList processes={processes} onRemoveProcess={handleRemoveProcess} />
            
            {simulationResult ? (
              <GanttChart
                timeline={simulationResult.timeline}
                processes={simulationResult.processes}
                totalTime={simulationResult.totalTime}
                averageWaitingTime={simulationResult.averageWaitingTime}
                averageTurnaroundTime={simulationResult.averageTurnaroundTime}
                cpuUtilization={simulationResult.cpuUtilization}
              />
            ) : (
              processes.length > 0 && (
                <div className="bg-muted text-muted-foreground rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium mb-2">Ready to Simulate</h3>
                  <p>
                    Configure your algorithm settings and click "Run Simulation" to see the results.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-muted py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Process Scheduling Simulator - A tool to visualize CPU scheduling algorithms
        </div>
      </footer>
    </div>
  );
};

export default Index;
