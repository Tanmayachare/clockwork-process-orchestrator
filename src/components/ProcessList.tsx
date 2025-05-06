
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Process } from '@/types/process';
import { X } from 'lucide-react';

interface ProcessListProps {
  processes: Process[];
  onRemoveProcess: (id: string) => void;
}

const ProcessList = ({ processes, onRemoveProcess }: ProcessListProps) => {
  if (processes.length === 0) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Process List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No processes added yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Process List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Process</TableHead>
                <TableHead className="text-center">Color</TableHead>
                <TableHead className="text-center">Arrival Time</TableHead>
                <TableHead className="text-center">Burst Time</TableHead>
                <TableHead className="text-center">Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell className="font-medium">{process.name}</TableCell>
                  <TableCell className="text-center">
                    <div className={`w-4 h-4 rounded-full mx-auto ${process.color}`}></div>
                  </TableCell>
                  <TableCell className="text-center">{process.arrivalTime}</TableCell>
                  <TableCell className="text-center">{process.burstTime}</TableCell>
                  <TableCell className="text-center">{process.priority}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveProcess(process.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessList;
