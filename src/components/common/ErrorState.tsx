import React from 'react';
import { Result, Button } from 'antd';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex justify-center items-center py-20">
      <Result
        status="error"
        title="Something went wrong"
        subTitle={message}
        extra={
          onRetry && (
            <Button type="primary" onClick={onRetry}>
              Try Again
            </Button>
          )
        }
      />
    </div>
  );
};

export default ErrorState;
