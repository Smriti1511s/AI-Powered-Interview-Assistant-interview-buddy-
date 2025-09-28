import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate } from '../../types';

interface CandidatesState {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  searchTerm: string;
  sortBy: 'name' | 'score' | 'date';
  sortOrder: 'asc' | 'desc';
}

const initialState: CandidatesState = {
  candidates: [],
  selectedCandidate: null,
  searchTerm: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action: PayloadAction<{ id: string; updates: Partial<Candidate> }>) => {
      console.log('updateCandidate called with:', action.payload);
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      console.log('Found candidate at index:', index);
      if (index !== -1) {
        const oldCandidate = state.candidates[index];
        state.candidates[index] = { ...state.candidates[index], ...action.payload.updates };
        console.log('Updated candidate:', state.candidates[index]);
        console.log('Old candidate:', oldCandidate);
        console.log('New candidate:', state.candidates[index]);
      } else {
        console.log('Candidate not found with ID:', action.payload.id);
      }
    },
    selectCandidate: (state, action: PayloadAction<string>) => {
      const candidate = state.candidates.find(c => c.id === action.payload);
      state.selectedCandidate = candidate || null;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'score' | 'date'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    clearSelectedCandidate: (state) => {
      state.selectedCandidate = null;
    },
  },
});

export const {
  addCandidate,
  updateCandidate,
  selectCandidate,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  clearSelectedCandidate,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;
