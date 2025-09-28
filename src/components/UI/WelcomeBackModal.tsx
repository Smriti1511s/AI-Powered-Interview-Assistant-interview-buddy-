import React, { useEffect } from 'react';
import { Modal, Button, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setIsWelcomeBackModalOpen } from '../../features/interview/interviewSlice';

const { Title, Paragraph } = Typography;

export const WelcomeBackModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isWelcomeBackModalOpen, currentCandidate } = useAppSelector((state) => state.interview);

  // Check if there's a persisted candidate on app load
  useEffect(() => {
    if (currentCandidate && currentCandidate.interviewStatus !== 'completed') {
      dispatch(setIsWelcomeBackModalOpen(true));
    }
  }, [currentCandidate, dispatch]);

  const handleClose = () => {
    dispatch(setIsWelcomeBackModalOpen(false));
  };

  const handleContinue = () => {
    dispatch(setIsWelcomeBackModalOpen(false));
  };

  const handleStartOver = () => {
    dispatch({ type: 'interview/resetInterview' });
    dispatch(setIsWelcomeBackModalOpen(false));
  };

  return (
    <Modal
      title="Welcome Back!"
      open={isWelcomeBackModalOpen}
      onCancel={handleClose}
      footer={[
        <Button key="continue" type="primary" onClick={handleContinue}>
          Continue Interview
        </Button>,
        <Button key="start-over" onClick={handleStartOver}>
          Start Over
        </Button>,
      ]}
      centered
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Title level={4}>Welcome back, {currentCandidate?.name}!</Title>
        <Paragraph>
          We've restored your interview progress. You can continue where you left off or start fresh.
        </Paragraph>
        {currentCandidate && (
          <Paragraph type="secondary">
            Current progress: {currentCandidate.currentQuestionIndex + 1} of 6 questions completed
          </Paragraph>
        )}
      </div>
    </Modal>
  );
};
