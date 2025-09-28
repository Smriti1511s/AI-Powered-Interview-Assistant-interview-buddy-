import React from 'react';
import { Spin } from 'antd';

interface SpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'default', tip }) => {
  return <Spin size={size} tip={tip} />;
};
