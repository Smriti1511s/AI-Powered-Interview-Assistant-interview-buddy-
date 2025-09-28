import React from 'react';
import { Card, Avatar, Typography } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { ChatMessage } from '../../types';
import { formatDate } from '../../utils/storage';

const { Paragraph } = Typography;

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        maxWidth: '70%',
        flexDirection: isUser ? 'row-reverse' : 'row'
      }}>
        <Avatar 
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          style={{ 
            backgroundColor: isUser ? '#1890ff' : '#52c41a',
            margin: isUser ? '0 0 0 8px' : '0 8px 0 0'
          }}
        />
        <Card
          size="small"
          style={{
            backgroundColor: isUser ? '#1890ff' : '#f6f6f6',
            color: isUser ? 'white' : 'inherit',
            border: 'none',
            borderRadius: '12px',
          }}
        >
          <Paragraph 
            style={{ 
              margin: 0, 
              color: isUser ? 'white' : 'inherit',
              whiteSpace: 'pre-wrap'
            }}
          >
            {message.content}
          </Paragraph>
          <div style={{ 
            fontSize: '12px', 
            opacity: 0.7, 
            marginTop: '4px',
            color: isUser ? 'white' : 'inherit'
          }}>
            {formatDate(message.timestamp)}
          </div>
        </Card>
      </div>
    </div>
  );
};
