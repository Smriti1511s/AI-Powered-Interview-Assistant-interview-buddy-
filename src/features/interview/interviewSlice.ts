import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InterviewState, ChatMessage, Question, Answer } from '../../types';

const initialState: InterviewState = {
  currentCandidate: null,
  currentQuestion: null,
  timeRemaining: 0,
  isTimerActive: false,
  chatMessages: [],
  isInterviewComplete: false,
  isWelcomeBackModalOpen: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCurrentCandidate: (state, action: PayloadAction<any>) => {
      state.currentCandidate = action.payload;
    },
    setCurrentQuestion: (state, action: PayloadAction<Question | null>) => {
      state.currentQuestion = action.payload;
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    setIsTimerActive: (state, action: PayloadAction<boolean>) => {
      state.isTimerActive = action.payload;
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
    },
    clearChatMessages: (state) => {
      state.chatMessages = [];
    },
    setIsInterviewComplete: (state, action: PayloadAction<boolean>) => {
      state.isInterviewComplete = action.payload;
    },
    setIsWelcomeBackModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWelcomeBackModalOpen = action.payload;
    },
    submitAnswer: (state, action: PayloadAction<Answer>) => {
      if (state.currentCandidate) {
        state.currentCandidate.answers.push(action.payload);
        state.currentCandidate.currentQuestionIndex += 1;
      }
    },
    resetInterview: (state) => {
      state.currentCandidate = null;
      state.currentQuestion = null;
      state.timeRemaining = 0;
      state.isTimerActive = false;
      state.chatMessages = [];
      state.isInterviewComplete = false;
      state.isWelcomeBackModalOpen = false;
    },
  },
});

export const {
  setCurrentCandidate,
  setCurrentQuestion,
  setTimeRemaining,
  setIsTimerActive,
  addChatMessage,
  clearChatMessages,
  setIsInterviewComplete,
  setIsWelcomeBackModalOpen,
  submitAnswer,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;
