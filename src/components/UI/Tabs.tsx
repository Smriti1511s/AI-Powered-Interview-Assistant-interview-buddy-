import React, { useState } from 'react';
import { Tabs as AntTabs } from 'antd';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { ChatWindow } from '../Chat/ChatWindow';
import { CandidateList } from '../Dashboard/CandidateList';

const { TabPane } = AntTabs;

export const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('interviewee');

  return (
    <AntTabs
      activeKey={activeTab}
      onChange={setActiveTab}
      size="large"
      style={{ marginTop: '20px' }}
    >
      <TabPane
        tab={
          <span>
            <UserOutlined />
            Interviewee
          </span>
        }
        key="interviewee"
      >
        <ChatWindow />
      </TabPane>
      <TabPane
        tab={
          <span>
            <DashboardOutlined />
            Interviewer Dashboard
          </span>
        }
        key="interviewer"
      >
        <CandidateList />
      </TabPane>
    </AntTabs>
  );
};
