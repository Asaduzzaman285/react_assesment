import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  return (
    <div className="p-6 bg-white min-h-screen">
      <Title level={2}>{title}</Title>
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default PageWrapper;
