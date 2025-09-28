import React from 'react';
import { Progress, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useTimer } from '../../hooks/useTimer';
import { handleTimerExpiration } from '../../features/interview/interviewThunks';
import { formatDuration } from '../../utils/storage';

const { Text } = Typography;

export const QuestionTimer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentQuestion, isTimerActive } = useAppSelector(
    (state) => state.interview
  );

  const { timeRemaining: timerTime } = useTimer({
    initialTime: currentQuestion?.timeLimit || 0,
    isActive: isTimerActive,
    onExpire: () => {
      dispatch(handleTimerExpiration());
    },
  });

  if (!currentQuestion) return null;

  const progress = ((currentQuestion.timeLimit - timerTime) / currentQuestion.timeLimit) * 100;
  const isLowTime = timerTime <= 10;
  const isCriticalTime = timerTime <= 5;

  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <Text strong>Time Remaining</Text>
        <Text 
          style={{ 
            fontSize: '18px',
            fontWeight: 'bold',
            color: isCriticalTime ? '#ff4d4f' : isLowTime ? '#faad14' : '#52c41a'
          }}
        >
          {formatDuration(timerTime)}
        </Text>
      </div>
      <Progress
        percent={progress}
        showInfo={false}
        strokeColor={isCriticalTime ? '#ff4d4f' : isLowTime ? '#faad14' : '#52c41a'}
        trailColor="#f0f0f0"
      />
    </div>
  );
};
