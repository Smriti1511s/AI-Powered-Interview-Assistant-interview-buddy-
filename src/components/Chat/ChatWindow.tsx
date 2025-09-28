import React, { useState } from 'react';
import { Card, Input, Button, Typography, Space, Alert } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { MessageBubble } from './MessageBubble';
import { QuestionTimer } from './QuestionTimer';
import { ResumeUpload } from '../Resume/ResumeUpload';
import { startInterview, submitAnswerAndNext } from '../../features/interview/interviewThunks';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export const ChatWindow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentCandidate, currentQuestion, chatMessages, isInterviewComplete } = useAppSelector(
    (state) => state.interview
  );
  
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartInterview = (candidate: any) => {
    dispatch(startInterview(candidate));
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(submitAnswerAndNext(answer.trim()));
      setAnswer('');
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  // Show resume upload if no candidate
  if (!currentCandidate) {
    return (
      <div className="chat-window">
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Title level={3}>Welcome to AI Interview Assistant</Title>
            <Paragraph>
              Upload your resume to begin your interview. We'll extract your information and start the process.
            </Paragraph>
            <ResumeUpload onCandidateCreated={handleStartInterview} />
          </div>
        </Card>
      </div>
    );
  }

  // Show interview complete message
  if (isInterviewComplete) {
    const handleStartNewInterview = () => {
      dispatch({ type: 'interview/resetInterview' });
    };

    return (
      <div className="chat-window">
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Title level={3}>🎉 Interview Complete!</Title>
            <Paragraph>
              Thank you for completing the interview. Your responses have been evaluated and saved.
            </Paragraph>
            <Alert
              message="Interview Results"
              description={`Final Score: ${currentCandidate.finalScore || 0}/100`}
              type="success"
              showIcon
              style={{ marginTop: '20px' }}
            />
            <Paragraph style={{ marginTop: '20px' }}>
              {currentCandidate.summary}
            </Paragraph>
            <div style={{ marginTop: '30px' }}>
              <Button
                type="primary"
                size="large"
                onClick={handleStartNewInterview}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                🚀 Start New Interview
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <Card style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>
            Interview with {currentCandidate.name}
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Question {currentCandidate.currentQuestionIndex + 1} of 6
          </Paragraph>
        </div>

        {/* Current Question and Timer */}
        {currentQuestion && (
          <div style={{ marginBottom: '16px' }}>
            <QuestionTimer />
            <Card size="small" style={{ marginTop: '8px' }}>
              <Title level={5} style={{ margin: 0 }}>
                {currentQuestion.text}
              </Title>
              <Paragraph type="secondary" style={{ margin: '8px 0 0 0' }}>
                Difficulty: {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </Paragraph>
            </Card>
          </div>
        )}

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
          {chatMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        {/* Answer Input */}
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here..."
              rows={3}
              style={{ resize: 'none' }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmitAnswer}
              loading={isSubmitting}
              disabled={!answer.trim()}
            >
              Submit
            </Button>
          </Space.Compact>
        </div>
      </Card>
    </div>
  );
};
