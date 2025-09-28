import React from 'react';
import { Card, Button, Typography, Space, Divider, Tag, Progress, Timeline } from 'antd';
import { ArrowLeftOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../app/hooks';
import { clearSelectedCandidate } from '../../features/candidates/candidatesSlice';
import { ResumePreview } from '../Resume/ResumePreview';
import { Candidate, Answer } from '../../types';
import { formatDate, formatDuration } from '../../utils/storage';

const { Title, Paragraph, Text } = Typography;

interface CandidateDetailsProps {
  candidate: Candidate;
}

export const CandidateDetails: React.FC<CandidateDetailsProps> = ({ candidate }) => {
  const dispatch = useAppDispatch();

  const handleBack = () => {
    dispatch(clearSelectedCandidate());
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'default';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <div>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ marginBottom: '16px' }}
          >
            Back to Candidates
          </Button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {candidate.name}
              </Title>
              <Space style={{ marginTop: '8px' }}>
                <Tag color={candidate.interviewStatus === 'completed' ? 'success' : 'processing'}>
                  {candidate.interviewStatus === 'completed' ? 'Completed' : 'In Progress'}
                </Tag>
                {candidate.finalScore && (
                  <Tag color={getScoreColor(candidate.finalScore)}>
                    Score: {candidate.finalScore}/100
                  </Tag>
                )}
              </Space>
            </div>
            
            {candidate.finalScore && (
              <div style={{ textAlign: 'right' }}>
                <Progress
                  type="circle"
                  percent={candidate.finalScore}
                  strokeColor={getScoreColor(candidate.finalScore)}
                  size={80}
                />
              </div>
            )}
          </div>
        </div>

        <Divider />

        {/* Contact Information */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Title level={4}>Contact Information</Title>
          <Space direction="vertical" size="small">
            <Space>
              <MailOutlined />
              <Text>{candidate.email}</Text>
            </Space>
            <Space>
              <PhoneOutlined />
              <Text>{candidate.phone}</Text>
            </Space>
            <Space>
              <UserOutlined />
              <Text>Interview Date: {formatDate(candidate.createdAt)}</Text>
            </Space>
            {candidate.completedAt && (
              <Space>
                <UserOutlined />
                <Text>Completed: {formatDate(candidate.completedAt)}</Text>
              </Space>
            )}
          </Space>
        </Card>

        {/* Resume Information */}
        <ResumePreview candidate={candidate} />

        {/* Interview Progress */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Title level={4}>Interview Progress</Title>
          <Progress 
            percent={(candidate.currentQuestionIndex / 6) * 100}
            format={() => `${candidate.currentQuestionIndex}/6 questions completed`}
          />
        </Card>

        {/* Final Summary */}
        {candidate.summary && (
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Title level={4}>AI Evaluation Summary</Title>
            <Paragraph>{candidate.summary}</Paragraph>
          </Card>
        )}

        {/* Interview Answers */}
        {candidate.answers.length > 0 && (
          <Card size="small">
            <Title level={4}>Interview Answers</Title>
            <Timeline>
              {candidate.answers.map((answer: Answer, index: number) => (
                <Timeline.Item
                  key={answer.questionId}
                  color={getDifficultyColor(answer.difficulty)}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text strong>Question {index + 1}:</Text>
                      <Tag color={getDifficultyColor(answer.difficulty)} style={{ marginLeft: '8px' }}>
                        {answer.difficulty.toUpperCase()}
                      </Tag>
                      <Text type="secondary" style={{ marginLeft: '8px' }}>
                        Time spent: {formatDuration(answer.timeSpent)}
                      </Text>
                    </div>
                    <Paragraph style={{ marginBottom: '8px' }}>
                      <Text strong>Q:</Text> {answer.questionText}
                    </Paragraph>
                    <Paragraph style={{ 
                      backgroundColor: '#f5f5f5', 
                      padding: '12px', 
                      borderRadius: '4px',
                      margin: 0
                    }}>
                      <Text strong>A:</Text> {answer.answer}
                    </Paragraph>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        )}
      </Card>
    </div>
  );
};
