import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Input } from 'antd';

const Interviewer: React.FC = () => {
  const candidates = useSelector((state: any) => state.candidates.candidates);
  const [search, setSearch] = React.useState('');

  const filtered = candidates.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    { title: 'Score', dataIndex: 'finalScore', key: 'score', sorter: (a: any, b: any) => (a.finalScore || 0) - (b.finalScore || 0) },
    { title: 'Summary', dataIndex: 'summary', key: 'summary' },
  ];

  return (
    <div>
      <Input.Search placeholder="Search by name" value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16, width: 300 }} />
      <Table columns={columns} dataSource={filtered} rowKey="id" />
    </div>
  );
};

export default Interviewer;
