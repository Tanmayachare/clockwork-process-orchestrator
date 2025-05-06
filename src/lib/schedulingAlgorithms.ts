
import { SchedulingAlgorithm, Process, TimeSlot, SchedulingResult } from "../types/process";

// Helper function to deep clone processes array
const cloneProcesses = (processes: Process[]): Process[] => {
  return processes.map(process => ({
    ...process,
    remainingTime: process.burstTime,
    completed: false,
  }));
};

// First-Come, First-Served (FCFS) Algorithm
export const runFCFS = (processes: Process[]): SchedulingResult => {
  const clonedProcesses = cloneProcesses(processes);
  const timeline: TimeSlot[] = [];
  
  // Sort processes by arrival time
  clonedProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  
  // Process each job in order of arrival
  for (const process of clonedProcesses) {
    // Update current time if the process hasn't arrived yet
    if (currentTime < process.arrivalTime) {
      // Add idle time slot
      timeline.push({
        processId: null,
        start: currentTime,
        end: process.arrivalTime
      });
      currentTime = process.arrivalTime;
    }
    
    // Set process start time
    process.startTime = currentTime;
    
    // Add this process to the timeline
    timeline.push({
      processId: process.id,
      start: currentTime,
      end: currentTime + process.burstTime
    });
    
    // Move time forward by the burst time of this process
    currentTime += process.burstTime;
    
    // Set finish time and calculate waiting and turnaround times
    process.finishTime = currentTime;
    process.waitingTime = process.startTime - process.arrivalTime;
    process.turnaroundTime = process.finishTime - process.arrivalTime;
    
    // Add to totals for averages
    totalWaitingTime += process.waitingTime;
    totalTurnaroundTime += process.turnaroundTime;
  }
  
  const totalProcesses = clonedProcesses.length;
  const totalExecutionTime = currentTime;
  const totalBurstTime = clonedProcesses.reduce((sum, p) => sum + p.burstTime, 0);
  
  return {
    timeline,
    processes: clonedProcesses,
    averageWaitingTime: totalWaitingTime / totalProcesses,
    averageTurnaroundTime: totalTurnaroundTime / totalProcesses,
    cpuUtilization: (totalBurstTime / totalExecutionTime) * 100,
    totalTime: totalExecutionTime
  };
};

// Shortest Job First (SJF) Algorithm - Non-preemptive
export const runSJF = (processes: Process[]): SchedulingResult => {
  const clonedProcesses = cloneProcesses(processes);
  const timeline: TimeSlot[] = [];
  
  // Sort processes by arrival time initially
  clonedProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let completed = 0;
  const totalProcesses = clonedProcesses.length;
  
  // Continue until all processes are completed
  while (completed < totalProcesses) {
    // Find the process with the shortest burst time among arrived processes
    let shortestIndex = -1;
    let shortestBurst = Number.MAX_VALUE;
    
    for (let i = 0; i < totalProcesses; i++) {
      const process = clonedProcesses[i];
      if (!process.completed && process.arrivalTime <= currentTime && process.burstTime < shortestBurst) {
        shortestBurst = process.burstTime;
        shortestIndex = i;
      }
    }
    
    // If no process is available at current time
    if (shortestIndex === -1) {
      // Find the next arriving process
      let nextArrival = Number.MAX_VALUE;
      let nextIndex = -1;
      
      for (let i = 0; i < totalProcesses; i++) {
        const process = clonedProcesses[i];
        if (!process.completed && process.arrivalTime < nextArrival) {
          nextArrival = process.arrivalTime;
          nextIndex = i;
        }
      }
      
      // Add idle time slot
      if (nextIndex !== -1) {
        timeline.push({
          processId: null,
          start: currentTime,
          end: nextArrival
        });
        currentTime = nextArrival;
      }
      continue;
    }
    
    // Process the shortest job
    const process = clonedProcesses[shortestIndex];
    
    // Set process start time
    process.startTime = currentTime;
    
    // Add this process to the timeline
    timeline.push({
      processId: process.id,
      start: currentTime,
      end: currentTime + process.burstTime
    });
    
    // Move time forward by the burst time of this process
    currentTime += process.burstTime;
    
    // Set finish time and calculate waiting and turnaround times
    process.finishTime = currentTime;
    process.waitingTime = process.startTime - process.arrivalTime;
    process.turnaroundTime = process.finishTime - process.arrivalTime;
    process.completed = true;
    
    // Add to totals for averages
    totalWaitingTime += process.waitingTime;
    totalTurnaroundTime += process.turnaroundTime;
    completed++;
  }
  
  const totalExecutionTime = currentTime;
  const totalBurstTime = clonedProcesses.reduce((sum, p) => sum + p.burstTime, 0);
  
  return {
    timeline,
    processes: clonedProcesses,
    averageWaitingTime: totalWaitingTime / totalProcesses,
    averageTurnaroundTime: totalTurnaroundTime / totalProcesses,
    cpuUtilization: (totalBurstTime / totalExecutionTime) * 100,
    totalTime: totalExecutionTime
  };
};

// Priority Scheduling Algorithm - Non-preemptive
export const runPriority = (processes: Process[]): SchedulingResult => {
  const clonedProcesses = cloneProcesses(processes);
  const timeline: TimeSlot[] = [];
  
  // Sort processes by arrival time initially
  clonedProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let completed = 0;
  const totalProcesses = clonedProcesses.length;
  
  // Continue until all processes are completed
  while (completed < totalProcesses) {
    // Find the process with highest priority (lower value means higher priority)
    let highestPriorityIndex = -1;
    let highestPriority = Number.MAX_VALUE;
    
    for (let i = 0; i < totalProcesses; i++) {
      const process = clonedProcesses[i];
      if (!process.completed && process.arrivalTime <= currentTime && process.priority < highestPriority) {
        highestPriority = process.priority;
        highestPriorityIndex = i;
      }
    }
    
    // If no process is available at current time
    if (highestPriorityIndex === -1) {
      // Find the next arriving process
      let nextArrival = Number.MAX_VALUE;
      let nextIndex = -1;
      
      for (let i = 0; i < totalProcesses; i++) {
        const process = clonedProcesses[i];
        if (!process.completed && process.arrivalTime < nextArrival) {
          nextArrival = process.arrivalTime;
          nextIndex = i;
        }
      }
      
      // Add idle time slot
      if (nextIndex !== -1) {
        timeline.push({
          processId: null,
          start: currentTime,
          end: nextArrival
        });
        currentTime = nextArrival;
      }
      continue;
    }
    
    // Process the highest priority job
    const process = clonedProcesses[highestPriorityIndex];
    
    // Set process start time
    process.startTime = currentTime;
    
    // Add this process to the timeline
    timeline.push({
      processId: process.id,
      start: currentTime,
      end: currentTime + process.burstTime
    });
    
    // Move time forward by the burst time of this process
    currentTime += process.burstTime;
    
    // Set finish time and calculate waiting and turnaround times
    process.finishTime = currentTime;
    process.waitingTime = process.startTime - process.arrivalTime;
    process.turnaroundTime = process.finishTime - process.arrivalTime;
    process.completed = true;
    
    // Add to totals for averages
    totalWaitingTime += process.waitingTime;
    totalTurnaroundTime += process.turnaroundTime;
    completed++;
  }
  
  const totalExecutionTime = currentTime;
  const totalBurstTime = clonedProcesses.reduce((sum, p) => sum + p.burstTime, 0);
  
  return {
    timeline,
    processes: clonedProcesses,
    averageWaitingTime: totalWaitingTime / totalProcesses,
    averageTurnaroundTime: totalTurnaroundTime / totalProcesses,
    cpuUtilization: (totalBurstTime / totalExecutionTime) * 100,
    totalTime: totalExecutionTime
  };
};

// Round Robin Algorithm
export const runRoundRobin = (processes: Process[], timeQuantum: number): SchedulingResult => {
  const clonedProcesses = cloneProcesses(processes);
  const timeline: TimeSlot[] = [];
  
  // Sort processes by arrival time initially
  clonedProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let completed = 0;
  const totalProcesses = clonedProcesses.length;
  
  // Initialize remaining time for each process
  clonedProcesses.forEach(process => {
    process.remainingTime = process.burstTime;
  });
  
  // Queue to track processes ready for execution
  const readyQueue: Process[] = [];
  
  // Add first process(es) that have arrived at time 0
  for (const process of clonedProcesses) {
    if (process.arrivalTime <= currentTime) {
      readyQueue.push(process);
    }
  }
  
  // Continue until all processes are completed
  while (completed < totalProcesses) {
    if (readyQueue.length === 0) {
      // Find next process to arrive
      const nextProcess = clonedProcesses.find(p => !p.completed && !readyQueue.includes(p));
      if (nextProcess) {
        // Add idle time slot
        timeline.push({
          processId: null,
          start: currentTime,
          end: nextProcess.arrivalTime
        });
        currentTime = nextProcess.arrivalTime;
        
        // Add all processes that have arrived by this time to the ready queue
        for (const process of clonedProcesses) {
          if (!process.completed && !readyQueue.includes(process) && process.arrivalTime <= currentTime) {
            readyQueue.push(process);
          }
        }
      }
      continue;
    }
    
    // Get the next process from the ready queue
    const process = readyQueue.shift()!;
    
    // Calculate execution time in this time slice
    const executionTime = Math.min(timeQuantum, process.remainingTime!);
    
    // If this is the first time this process is executed, set its start time
    if (process.startTime === undefined) {
      process.startTime = currentTime;
    }
    
    // Add this time slice to the timeline
    timeline.push({
      processId: process.id,
      start: currentTime,
      end: currentTime + executionTime
    });
    
    // Update current time
    currentTime += executionTime;
    
    // Update remaining time
    process.remainingTime! -= executionTime;
    
    // Check for new arrivals during this time slice and add them to ready queue
    for (const p of clonedProcesses) {
      if (!p.completed && !readyQueue.includes(p) && p !== process &&
          p.arrivalTime > currentTime - executionTime && p.arrivalTime <= currentTime) {
        readyQueue.push(p);
      }
    }
    
    if (process.remainingTime! > 0) {
      // Process not completed, add it back to the ready queue
      readyQueue.push(process);
    } else {
      // Process completed
      process.completed = true;
      process.finishTime = currentTime;
      process.turnaroundTime = process.finishTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      
      totalWaitingTime += process.waitingTime;
      totalTurnaroundTime += process.turnaroundTime;
      completed++;
    }
  }
  
  const totalExecutionTime = currentTime;
  const totalBurstTime = clonedProcesses.reduce((sum, p) => sum + p.burstTime, 0);
  
  return {
    timeline,
    processes: clonedProcesses,
    averageWaitingTime: totalWaitingTime / totalProcesses,
    averageTurnaroundTime: totalTurnaroundTime / totalProcesses,
    cpuUtilization: (totalBurstTime / totalExecutionTime) * 100,
    totalTime: totalExecutionTime
  };
};

// Run the selected scheduling algorithm
export const runSchedulingAlgorithm = (
  algorithm: SchedulingAlgorithm, 
  processes: Process[],
  timeQuantum: number = 1
): SchedulingResult => {
  switch (algorithm) {
    case SchedulingAlgorithm.FCFS:
      return runFCFS(processes);
    case SchedulingAlgorithm.SJF:
      return runSJF(processes);
    case SchedulingAlgorithm.PRIORITY:
      return runPriority(processes);
    case SchedulingAlgorithm.ROUND_ROBIN:
      return runRoundRobin(processes, timeQuantum);
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
};
