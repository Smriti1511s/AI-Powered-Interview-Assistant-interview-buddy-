import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { Candidate } from '../../types';

const { Title, Text, Paragraph } = Typography;

interface ResumePreviewProps {
  candidate: Candidate;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ candidate }) => {
  const handleDownload = () => {
    if (candidate.resumeUrl) {
      const link = document.createElement('a');
      link.href = candidate.resumeUrl;
      link.download = `${candidate.name}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleView = () => {
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, '_blank');
    }
  };

  return (
    <Card title="Resume Information" style={{ marginBottom: '16px' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Title level={5} style={{ margin: 0 }}>Contact Information</Title>
          <Space direction="vertical" size="small">
            <Text strong>Name:</Text> {candidate.name}
            <Text strong>Email:</Text> {candidate.email}
            <Text strong>Phone:</Text> {candidate.phone}
          </Space>
        </div>

        {candidate.resumeText && (
          <div>
            <Title level={5} style={{ margin: 0 }}>Resume Content</Title>
            <div style={{ 
              maxHeight: '200px', 
              overflowY: 'auto', 
              padding: '12px', 
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '12px',
              lineHeight: '1.4'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {candidate.resumeText}
              </pre>
            </div>
          </div>
        )}

        {candidate.resumeUrl && (
          <div>
            <Title level={5} style={{ margin: 0 }}>Resume File</Title>
            <Space>
              <Button 
                icon={<EyeOutlined />} 
                onClick={handleView}
                size="small"
              >
                View
              </Button>
              <Button 
                icon={<DownloadOutlined />} 
                onClick={handleDownload}
                size="small"
              >
                Download
              </Button>
            </Space>
          </div>
        )}
      </Space>
    </Card>
  );
};
