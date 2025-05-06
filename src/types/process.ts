
export enum SchedulingAlgorithm {
  FCFS = "First-Come, First-Served",
  SJF = "Shortest Job First",
  PRIORITY = "Priority Scheduling",
  ROUND_ROBIN = "Round Robin"
}

export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  color: string;
  remainingTime?: number;
  startTime?: number;
  finishTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  completed?: boolean;
}

export interface TimeSlot {
  processId: string | null;
  start: number;
  end: number;
}

export interface SchedulingResult {
  timeline: TimeSlot[];
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  cpuUtilization: number;
  totalTime: number;
}
