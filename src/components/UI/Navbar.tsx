import React from 'react';
import { Layout, Typography } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

export const Navbar: React.FC = () => {
  return (
    <Header style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '0 24px', 
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <RobotOutlined style={{ 
          fontSize: '28px', 
          color: '#fff', 
          marginRight: '16px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }} />
        <Title level={2} style={{ 
          margin: 0, 
          color: '#fff',
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          AI Interview Assistant
        </Title>
      </div>
    </Header>
  );
};
