import React from 'react';
import { Result, Button } from 'antd';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="py-20 flex justify-center items-center bg-white rounded-2xl shadow-sm border border-slate-100">
      <Result
        status="error"
        title={<span className="font-bold text-slate-800">Something went wrong</span>}
        subTitle={<span className="text-slate-500">{message}</span>}
        extra={
          onRetry && (
            <Button
              type="primary"
              size="large"
              onClick={onRetry}
              className="bg-blue-600 rounded-xl px-10 h-12 font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-100"
            >
              Try Again
            </Button>
          )
        }
      />
    </div>
    </div>
  );
};

export default ErrorState;
