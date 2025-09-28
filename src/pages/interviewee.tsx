import React, { useState } from 'react';
import { ResumeUpload } from '../components/Resume/ResumeUpload';
import { useSelector, useDispatch } from 'react-redux';
// ...existing code...
import { generateQuestion, scoreAnswers } from '../lib/aiService';
import { updateCandidate } from '../features/candidates/candidatesSlice';
import { Button, Modal } from 'antd';

const Interviewee: React.FC = () => {
  // Redux selectors and dispatch
  const candidate = useSelector((state: any) => state.candidates.selectedCandidate);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<any[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Question flow
  const difficulties = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard'] as const;
  const timers = [20, 20, 60, 60, 120, 120];

  const startInterview = () => {
    setQuestionIndex(0);
    askNextQuestion(0);
  };

  const askNextQuestion = (idx: number) => {
    if (idx < 6) {
      const q = generateQuestion(difficulties[idx]);
      setMessages((msgs) => [...msgs, { type: 'ai', content: q }]);
      setTimer(timers[idx]);
    } else {
      // Interview complete
      const result = scoreAnswers(candidate.answers || []);
      dispatch(updateCandidate({ id: candidate.id, updates: { finalScore: result.score, summary: result.summary, interviewStatus: 'completed' } }));
      setMessages((msgs) => [...msgs, { type: 'ai', content: `Interview complete! Score: ${result.score}. Summary: ${result.summary}` }]);
    }
  };

  // Timer logic (simplified)
  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && questionIndex < 6) {
      // Auto-submit answer
      dispatch(updateCandidate({ id: candidate.id, updates: { answers: [...(candidate.answers || []), { answer, questionId: questionIndex.toString(), difficulty: difficulties[questionIndex], questionText: messages[messages.length - 1]?.content || '' }] } }));
      setAnswer('');
      setQuestionIndex((idx) => {
        askNextQuestion(idx + 1);
        return idx + 1;
      });
    }
  }, [timer]);

  return (
    <div>
  <ResumeUpload onCandidateCreated={(candidate) => { console.log('Candidate created:', candidate); }} />
      <Button onClick={startInterview}>Start Interview</Button>
      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, minHeight: 200, marginBottom: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ color: msg.type === 'ai' ? 'blue' : 'black', marginBottom: 8 }}>
            {msg.content}
          </div>
        ))}
      </div>
      {timer > 0 && <div>Time left: {timer}s</div>}
      <input
        type="text"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        disabled={timer === 0}
        style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginBottom: 16 }}
        placeholder="Type your answer..."
      />
      <Modal open={showModal} onCancel={() => setShowModal(false)}>Welcome Back! Your session is restored.</Modal>
    </div>
  );
};

export default Interviewee;
