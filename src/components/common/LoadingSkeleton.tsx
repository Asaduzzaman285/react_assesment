import React from 'react';
import { Skeleton } from 'antd';

interface LoadingSkeletonProps {
  rows?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 5 }) => {
  return (
    <div className="p-4">
      <Skeleton active={true} paragraph={{ rows }} />
    </div>
  );
};

export default LoadingSkeleton;
