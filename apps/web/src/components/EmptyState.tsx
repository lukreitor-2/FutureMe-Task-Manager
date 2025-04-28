import React from 'react';
import Button from './ui/Button';
import { ClipboardDocumentIcon, PlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="flex justify-center">
        <ClipboardDocumentIcon className="h-16 w-16 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        {description}
      </p>
      <div className="mt-6">
        <Button
          onClick={onAction}
          icon={<PlusIcon className="h-5 w-5" />}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
