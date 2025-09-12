'use client';

import React from 'react';

interface CardProps {
  variant?: 'default' | 'gradient' | 'elevated' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  padding = 'md',
  hover = false,
  children,
  className = '',
  style,
  onClick
}) => {
  const baseClasses = 'bg-white rounded-xl border transition-all duration-300';

  const variantClasses = {
    default: 'border-gray-200 shadow-sm',
    gradient: 'border-0 shadow-lg bg-gradient-to-br from-white to-gray-50',
    elevated: 'border-gray-100 shadow-lg',
    outlined: 'border-2 border-gray-300 shadow-none'
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} style={style} onClick={onClick}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-between mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

// Export individual components
export { CardHeader as Header, CardContent as Content, CardFooter as Footer };

export default Card;