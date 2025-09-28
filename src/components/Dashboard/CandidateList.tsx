import React from 'react';
import { Card, Table, Input, Select, Button, Space, Typography, Tag, Progress } from 'antd';
import { SearchOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectFilteredAndSortedCandidates } from '../../features/candidates/candidatesSelectors';
import { setSearchTerm, setSortBy, setSortOrder, selectCandidate } from '../../features/candidates/candidatesSlice';
import { CandidateDetails } from './CandidateDetails';
import { formatDate } from '../../utils/storage';

const { Title } = Typography;
const { Option } = Select;

export const CandidateList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, sortBy, sortOrder, selectedCandidate } = useAppSelector((state) => state.candidates);
  const filteredCandidates = useAppSelector(selectFilteredAndSortedCandidates);
  
  // Debug: Log the current candidates data
  const allCandidates = useAppSelector((state) => state.candidates.candidates);
  console.log('All candidates in store:', allCandidates);
  console.log('Filtered candidates:', filteredCandidates);
  console.log('Redux state:', useAppSelector((state) => state));

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'interviewStatus',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          not_started: { className: 'status-not-started', text: 'Not Started' },
          in_progress: { className: 'status-in-progress', text: 'In Progress' },
          completed: { className: 'status-completed', text: 'Completed' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag className={config.className}>{config.text}</Tag>;
      },
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (record: any) => {
        const progress = (record.currentQuestionIndex / 6) * 100;
        return (
          <Progress 
            percent={progress} 
            size="small" 
            format={() => `${record.currentQuestionIndex}/6`}
          />
        );
      },
    },
    {
      title: 'Score',
      dataIndex: 'finalScore',
      key: 'score',
      render: (score: number, record: any) => {
        if (!score && record.interviewStatus === 'completed') {
          return <Tag color="orange">Pending</Tag>;
        }
        if (!score) {
          return <Tag color="default">-</Tag>;
        }
        const getScoreColor = (score: number) => {
          if (score >= 80) return 'success';
          if (score >= 60) return 'warning';
          return 'error';
        };
        return (
          <Tag color={getScoreColor(score)} style={{ fontWeight: 'bold' }}>
            {score}/100
          </Tag>
        );
      },
      sorter: (a: any, b: any) => (a.finalScore || 0) - (b.finalScore || 0),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => formatDate(date),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => dispatch(selectCandidate(record.id))}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (selectedCandidate) {
    return <CandidateDetails candidate={selectedCandidate} />;
  }

  return (
    <div>
      <Card>
        <div style={{ 
          marginBottom: '24px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white'
        }}>
          <Title level={2} style={{ 
            margin: 0, 
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            📊 Interview Dashboard
          </Title>
          <p style={{ 
            margin: '8px 0 0 0', 
            opacity: 0.9,
            fontSize: '16px'
          }}>
            Manage and track candidate interviews
          </p>
          <Space style={{ marginTop: '16px' }}>
            <Button 
              type="primary" 
              onClick={() => {
                console.log('Current candidates:', allCandidates);
                console.log('Filtered candidates:', filteredCandidates);
                window.location.reload();
              }}
            >
              🔄 Refresh Data
            </Button>
            <Button 
              type="default" 
              onClick={() => {
                // Add a test candidate
                const testCandidate = {
                  id: 'test-' + Date.now(),
                  name: 'Test Candidate',
                  email: 'test@example.com',
                  phone: '123-456-7890',
                  interviewStatus: 'completed' as const,
                  currentQuestionIndex: 6,
                  answers: [],
                  finalScore: 85,
                  summary: 'Excellent candidate with strong technical skills.',
                  completedAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                };
                dispatch({ type: 'candidates/addCandidate', payload: testCandidate });
              }}
            >
              🧪 Add Test Candidate
            </Button>
          </Space>
        </div>

        {/* Debug Info */}
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>Debug Info:</strong> {allCandidates.length} candidates total, {filteredCandidates.length} filtered
          {allCandidates.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              {allCandidates.map(c => (
                <div key={c.id}>
                  {c.name} - Score: {c.finalScore || 'No score'} - Status: {c.interviewStatus}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Space wrap>
            <Input
              placeholder="Search candidates..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              style={{ width: 200 }}
            />
            <Select
              value={sortBy}
              onChange={(value) => dispatch(setSortBy(value))}
              style={{ width: 120 }}
            >
              <Option value="name">Name</Option>
              <Option value="score">Score</Option>
              <Option value="date">Date</Option>
            </Select>
            <Select
              value={sortOrder}
              onChange={(value) => dispatch(setSortOrder(value))}
              style={{ width: 100 }}
            >
              <Option value="asc">Asc</Option>
              <Option value="desc">Desc</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCandidates}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} candidates`,
          }}
          scroll={{ x: 800 }}
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          }}
          rowClassName={(record) => 
            record.interviewStatus === 'completed' 
              ? 'completed-row' 
              : record.interviewStatus === 'in_progress' 
                ? 'in-progress-row' 
                : 'not-started-row'
          }
        />
      </Card>
    </div>
  );
};
