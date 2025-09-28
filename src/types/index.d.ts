export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  resumeText?: string;
  interviewStatus: 'not_started' | 'in_progress' | 'completed';
  currentQuestionIndex: number;
  answers: Answer[];
  finalScore?: number;
  summary?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  category: string;
}

export interface Answer {
  questionId: string;
  questionText: string;
  answer: string;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  questionId?: string;
}

export interface InterviewState {
  currentCandidate: Candidate | null;
  currentQuestion: Question | null;
  timeRemaining: number;
  isTimerActive: boolean;
  chatMessages: ChatMessage[];
  isInterviewComplete: boolean;
  isWelcomeBackModalOpen: boolean;
}

export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  text: string;
  score?: number;
}

export interface ParsedResume extends ResumeData {
  isValid: boolean;
  missingFields: string[];
}
