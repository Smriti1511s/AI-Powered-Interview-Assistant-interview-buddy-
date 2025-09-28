import type { Answer } from '../types';

export function generateQuestion(difficulty: 'easy' | 'medium' | 'hard') {
  const questions = {
    easy: [
      'What is React?',
      'Explain the useState hook.'
    ],
    medium: [
      'How does Redux work in a React app?',
      'Describe the lifecycle of a React component.'
    ],
    hard: [
      'How would you optimize a large React/Node application for performance?',
      'Explain server-side rendering in Next.js.'
    ]
  };
  const pool = questions[difficulty];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function scoreAnswers(answers: Answer[]) {
  // Mock scoring: random score and summary
  const score = Math.floor(60 + Math.random() * 40);
  const summary = 'Candidate demonstrated good understanding of full stack concepts.';
  return { score, summary };
}
