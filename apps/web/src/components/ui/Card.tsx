import React from 'react';
import { twMerge } from 'tailwind-merge';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div 
      className={twMerge(
        'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden', 
        className
      )}
    >
      {children}
    </div>
  );
}

type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

Card.Header = function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div 
      className={twMerge(
        'px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900', 
        className
      )}
    >
      {children}
    </div>
  );
};

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

Card.Content = function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={twMerge('p-4', className)}>
      {children}
    </div>
  );
};

type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};

Card.Footer = function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div 
      className={twMerge(
        'px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900', 
        className
      )}
    >
      {children}
    </div>
  );
};
