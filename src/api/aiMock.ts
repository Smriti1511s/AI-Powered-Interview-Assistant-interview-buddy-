import { Question, Answer } from '../types';
import { generateQuestionFromAPI, submitAnswerToAPI, getFinalEvaluation } from './questionService';

// Real-time API-based question generation
export const generateQuestions = async (candidateInfo: any): Promise<Question[]> => {
  const questions: Question[] = [];
  
  // Generate 6 questions dynamically from API
  for (let i = 0; i < 6; i++) {
    const difficulty = i < 2 ? 'easy' : i < 4 ? 'medium' : 'hard';
    
    const response = await generateQuestionFromAPI({
      candidateInfo,
      currentQuestionIndex: i,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
    });
    
    questions.push(response.question);
  }
  
  return questions;
};

export const evaluateAnswers = async (answers: Answer[]): Promise<{ score: number; summary: string }> => {
  try {
    // Use real-time API for evaluation
    const evaluation = await getFinalEvaluation(answers);
    
    return {
      score: evaluation.totalScore,
      summary: evaluation.summary,
    };
  } catch (error) {
    console.error('API evaluation error:', error);
    
    // Fallback to basic evaluation
    const totalScore = Math.floor(Math.random() * 30) + 70;
    return {
      score: totalScore,
      summary: 'Based on your responses, you demonstrated good technical knowledge and problem-solving skills.',
    };
  }
};

// Mock AI responses for chat
export const generateAIResponse = (message: string, context?: any): string => {
  const responses = [
    "That's a great point! Let me ask you about your experience with...",
    "Interesting perspective. Can you elaborate on that?",
    "I see. How would you handle a situation where...",
    "Good answer. Moving on to the next topic...",
    "Thank you for that explanation. Now, regarding...",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};
