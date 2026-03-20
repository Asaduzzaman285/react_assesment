import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-5 -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <header className="mb-8">
          <Title level={1} className="!mb-1 font-extrabold tracking-tight text-slate-900">
            {title}
          </Title>
          <div className="h-1.5 w-12 bg-blue-600 rounded-full" />
        </header>
        
        <main className="glass-effect rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
