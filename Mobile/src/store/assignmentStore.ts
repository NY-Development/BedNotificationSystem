import { create } from 'zustand';
import type { Assignment } from '@/src/types';

interface AssignmentState {
  assignments: Assignment[];
  myAssignment: Assignment | null;
  setAssignments: (assignments: Assignment[]) => void;
  setMyAssignment: (assignment: Assignment | null) => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  myAssignment: null,

  setAssignments: (assignments) => set({ assignments }),
  setMyAssignment: (myAssignment) => set({ myAssignment }),
}));
