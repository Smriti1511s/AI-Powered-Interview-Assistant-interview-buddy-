import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { generateQuestions, evaluateAnswers } from '../../api/aiMock';
import { Answer, Candidate } from '../../types';

// Thunk to start a new interview
export const startInterview = createAsyncThunk(
  'interview/startInterview',
  async (candidate: Candidate, { dispatch, getState }) => {
    try {
      // First, add the candidate to the candidates store
      dispatch({ type: 'candidates/addCandidate', payload: candidate });
      
      // Generate questions using API with candidate info
      const candidateInfo = {
        name: candidate.name,
        email: candidate.email,
        experience: candidate.resumeText?.substring(0, 200) || '',
        skills: extractSkillsFromResume(candidate.resumeText || ''),
      };
      
      const questions = await generateQuestions(candidateInfo);
      const firstQuestion = questions[0];
      
      // Dispatch actions to set up the interview
      dispatch({ type: 'interview/setCurrentCandidate', payload: candidate });
      dispatch({ type: 'interview/setCurrentQuestion', payload: firstQuestion });
      dispatch({ type: 'interview/setTimeRemaining', payload: firstQuestion.timeLimit });
      dispatch({ type: 'interview/setIsTimerActive', payload: true });
      dispatch({ type: 'interview/setIsInterviewComplete', payload: false });
      
      // Add welcome message
      dispatch({
        type: 'interview/addChatMessage',
        payload: {
          id: Date.now().toString(),
          type: 'ai',
          content: `Hello ${candidate.name}! Welcome to your AI interview. I've analyzed your background and prepared personalized questions for you. Let's begin!`,
          timestamp: new Date().toISOString(),
        }
      });

      return { questions, firstQuestion };
    } catch (error) {
      console.error('Error starting interview:', error);
      throw error;
    }
  }
);

// Helper function to extract skills from resume text
const extractSkillsFromResume = (resumeText: string): string[] => {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git'
  ];
  
  const foundSkills = commonSkills.filter(skill => 
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills.length > 0 ? foundSkills : ['Programming'];
};

// Thunk to submit an answer and move to next question
export const submitAnswerAndNext = createAsyncThunk(
  'interview/submitAnswerAndNext',
  async (answer: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { currentQuestion, currentCandidate } = state.interview;
    
    if (!currentQuestion || !currentCandidate) {
      throw new Error('No current question or candidate');
    }

    const timeSpent = currentQuestion.timeLimit - state.interview.timeRemaining;
    
    const answerObj: Answer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answer,
      timeSpent,
      difficulty: currentQuestion.difficulty,
      timestamp: new Date().toISOString(),
    };

    // Submit the answer
    dispatch({ type: 'interview/submitAnswer', payload: answerObj });

    // Add user message to chat
    dispatch({
      type: 'interview/addChatMessage',
      payload: {
        id: Date.now().toString(),
        type: 'user',
        content: answer,
        timestamp: new Date().toISOString(),
        questionId: currentQuestion.id,
      }
    });

    // Check if interview is complete
    if (currentCandidate.currentQuestionIndex >= 5) {
      // Interview complete - evaluate answers using API
      const evaluation = await evaluateAnswers(currentCandidate.answers);
      
      dispatch({
        type: 'interview/addChatMessage',
        payload: {
          id: Date.now().toString(),
          type: 'ai',
          content: `Interview complete! Your final score is ${evaluation.score}/100. ${evaluation.summary}`,
          timestamp: new Date().toISOString(),
        }
      });

      dispatch({ type: 'interview/setIsInterviewComplete', payload: true });
      dispatch({ type: 'interview/setIsTimerActive', payload: false });
      
      // Update candidate with final results
      const updatedCandidate = {
        ...currentCandidate,
        finalScore: evaluation.score,
        summary: evaluation.summary,
        interviewStatus: 'completed' as const,
        completedAt: new Date().toISOString(),
      };
      
      console.log('Updating candidate with score:', evaluation.score);
      console.log('Candidate ID:', currentCandidate.id);
      
      dispatch({
        type: 'candidates/updateCandidate',
        payload: {
          id: currentCandidate.id,
          updates: {
            finalScore: evaluation.score,
            summary: evaluation.summary,
            interviewStatus: 'completed',
            completedAt: new Date().toISOString(),
          }
        }
      });
      
      console.log('Candidate update dispatched');
      
      // Update the current candidate in interview state
      dispatch({ type: 'interview/setCurrentCandidate', payload: updatedCandidate });

      return { isComplete: true, evaluation };
    } else {
      // Move to next question - generate new question from API
      const candidateInfo = {
        name: currentCandidate.name,
        email: currentCandidate.email,
        experience: currentCandidate.resumeText?.substring(0, 200) || '',
        skills: extractSkillsFromResume(currentCandidate.resumeText || ''),
      };
      
      const questions = await generateQuestions(candidateInfo);
      const nextQuestion = questions[currentCandidate.currentQuestionIndex + 1];
      
      dispatch({ type: 'interview/setCurrentQuestion', payload: nextQuestion });
      dispatch({ type: 'interview/setTimeRemaining', payload: nextQuestion.timeLimit });
      dispatch({ type: 'interview/setIsTimerActive', payload: true });

      // Add AI message for next question
      dispatch({
        type: 'interview/addChatMessage',
        payload: {
          id: Date.now().toString(),
          type: 'ai',
          content: `Great! Here's your next question: ${nextQuestion.text}`,
          timestamp: new Date().toISOString(),
        }
      });

      return { isComplete: false, nextQuestion };
    }
  }
);

// Thunk to handle timer expiration
export const handleTimerExpiration = createAsyncThunk(
  'interview/handleTimerExpiration',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { currentQuestion, currentCandidate } = state.interview;
    
    if (!currentQuestion || !currentCandidate) {
      return;
    }

    // Auto-submit empty answer
    const answerObj: Answer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answer: '[No answer provided - time expired]',
      timeSpent: currentQuestion.timeLimit,
      difficulty: currentQuestion.difficulty,
      timestamp: new Date().toISOString(),
    };

    dispatch({ type: 'interview/submitAnswer', payload: answerObj });

    // Add AI message about time expiration
    dispatch({
      type: 'interview/addChatMessage',
      payload: {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Time\'s up! Moving to the next question.',
        timestamp: new Date().toISOString(),
      }
    });

    // Move to next question or complete interview
    dispatch(submitAnswerAndNext(''));
  }
);
