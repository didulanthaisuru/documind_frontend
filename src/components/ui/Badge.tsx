import React from 'react';
import { clsx } from 'clsx';
import { DocumentStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-grey-100 text-grey-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };

  return (
    <span
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

// Status Badge component specifically for document status
interface StatusBadgeProps {
  status: DocumentStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.UPLOADING:
        return { variant: 'info' as const, text: 'Uploading' };
      case DocumentStatus.PROCESSING:
        return { variant: 'warning' as const, text: 'Processing' };
      case DocumentStatus.COMPLETED:
        return { variant: 'success' as const, text: 'Completed' };
      case DocumentStatus.FAILED:
        return { variant: 'error' as const, text: 'Failed' };
      default:
        return { variant: 'default' as const, text: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} size={size}>
      {config.text}
    </Badge>
  );
};

export default Badge; 