import { Question } from '../types';

// Mock API service for real-time questions
// In production, this would connect to a real AI service like OpenAI

export interface QuestionRequest {
  candidateInfo: {
    name: string;
    email: string;
    experience?: string;
    skills?: string[];
  };
  currentQuestionIndex: number;
  previousAnswers?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuestionResponse {
  question: Question;
  isLast: boolean;
  totalQuestions: number;
}

// Mock AI service that generates contextual questions
export const generateQuestionFromAPI = async (request: QuestionRequest): Promise<QuestionResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { candidateInfo, currentQuestionIndex, difficulty } = request;
  
  // Generate contextual questions based on candidate info
  const contextualQuestions = generateContextualQuestions(candidateInfo, difficulty);
  
  const question = contextualQuestions[currentQuestionIndex] || contextualQuestions[0];
  
  return {
    question,
    isLast: currentQuestionIndex >= 5,
    totalQuestions: 6,
  };
};

// Generate questions based on candidate's background
const generateContextualQuestions = (candidateInfo: any, difficulty: string): Question[] => {
  const { name, experience, skills } = candidateInfo;
  
  // Base questions that adapt to the candidate
  const baseQuestions = [
    {
      id: 'contextual-1',
      text: `Hello ${name}! Let's start with your background. Can you tell me about your experience with ${skills?.[0] || 'programming'}?`,
      difficulty: 'easy' as const,
      timeLimit: 20,
      category: 'Background',
    },
    {
      id: 'contextual-2', 
      text: `Based on your experience, how would you approach debugging a complex issue in a production system?`,
      difficulty: 'easy' as const,
      timeLimit: 20,
      category: 'Problem Solving',
    },
    {
      id: 'contextual-3',
      text: `Can you walk me through how you would design a scalable web application architecture?`,
      difficulty: 'medium' as const,
      timeLimit: 60,
      category: 'System Design',
    },
    {
      id: 'contextual-4',
      text: `Describe a challenging project you've worked on and how you overcame the obstacles.`,
      difficulty: 'medium' as const,
      timeLimit: 60,
      category: 'Experience',
    },
    {
      id: 'contextual-5',
      text: `How would you implement a real-time chat feature with millions of concurrent users?`,
      difficulty: 'hard' as const,
      timeLimit: 120,
      category: 'Advanced System Design',
    },
    {
      id: 'contextual-6',
      text: `Explain how you would optimize a slow-performing database query and prevent similar issues in the future.`,
      difficulty: 'hard' as const,
      timeLimit: 120,
      category: 'Performance Optimization',
    },
  ];
  
  return baseQuestions;
};

// Submit answer and get AI feedback
export const submitAnswerToAPI = async (answer: string, questionId: string): Promise<{
  feedback: string;
  score: number;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock AI evaluation
  const score = Math.floor(Math.random() * 40) + 60; // Score between 60-100
  const feedback = generateMockFeedback(answer, score);
  
  return {
    feedback,
    score,
  };
};

const generateMockFeedback = (answer: string, score: number): string => {
  const feedbacks = [
    "Good understanding of the concept. You demonstrated solid knowledge.",
    "Excellent explanation! You showed deep understanding of the topic.",
    "Good answer with room for improvement. Consider diving deeper into implementation details.",
    "Strong response! You covered the key points well.",
    "Good foundation, but try to provide more specific examples and use cases.",
  ];
  
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
};

// Get final evaluation from AI
export const getFinalEvaluation = async (allAnswers: any[]): Promise<{
  totalScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const totalScore = Math.floor(Math.random() * 30) + 70; // Score between 70-100
  
  return {
    totalScore,
    summary: `Based on your responses, you demonstrated strong technical knowledge and problem-solving skills. Your experience with modern technologies is evident, and you showed good understanding of system design principles.`,
    strengths: [
      "Strong technical foundation",
      "Good problem-solving approach", 
      "Clear communication skills",
      "Understanding of best practices"
    ],
    improvements: [
      "Consider more specific examples",
      "Dive deeper into implementation details",
      "Discuss scalability considerations more"
    ]
  };
};
