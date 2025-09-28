import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const selectCandidatesState = (state: RootState) => state.candidates;

export const selectAllCandidates = createSelector(
  [selectCandidatesState],
  (candidatesState) => candidatesState.candidates
);

export const selectSelectedCandidate = createSelector(
  [selectCandidatesState],
  (candidatesState) => candidatesState.selectedCandidate
);

export const selectSearchTerm = createSelector(
  [selectCandidatesState],
  (candidatesState) => candidatesState.searchTerm
);

export const selectSortBy = createSelector(
  [selectCandidatesState],
  (candidatesState) => candidatesState.sortBy
);

export const selectSortOrder = createSelector(
  [selectCandidatesState],
  (candidatesState) => candidatesState.sortOrder
);

export const selectFilteredAndSortedCandidates = createSelector(
  [selectAllCandidates, selectSearchTerm, selectSortBy, selectSortOrder],
  (candidates, searchTerm, sortBy, sortOrder) => {
    let filtered = candidates;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(term) ||
        candidate.email.toLowerCase().includes(term) ||
        candidate.phone.includes(term)
      );
    }

    // Sort candidates
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'score':
          const scoreA = a.finalScore || 0;
          const scoreB = b.finalScore || 0;
          comparison = scoreA - scoreB;
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }
);
