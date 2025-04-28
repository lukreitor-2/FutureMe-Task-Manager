import React from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { Task } from '@/lib/api';
import { PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onUpdateStatus: (taskId: number, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const statusVariant = {
    pending: 'warning',
    'in-progress': 'primary',
    completed: 'success',
  } as const;
  
  const statusText = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const getNextStatus = (currentStatus: Task['status']): Task['status'] => {
    switch (currentStatus) {
      case 'pending':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      case 'completed':
        return 'pending';
      default:
        return 'pending';
    }
  };
  
  return (
    <Card className="h-full transition-all hover:shadow-lg">
      <Card.Header className="flex items-center justify-between">
        <h3 className="font-medium truncate">{task.title}</h3>
        <Badge variant={statusVariant[task.status]}>{statusText[task.status]}</Badge>
      </Card.Header>
      
      <Card.Content>
        <p className="text-gray-700 dark:text-gray-300 mb-4 h-16 overflow-hidden text-ellipsis">
          {task.description || 'No description provided.'}
        </p>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          <p>Created: {formatDate(task.createdAt)}</p>
          <p>Last updated: {formatDate(task.updatedAt)}</p>
        </div>
      </Card.Content>
      
      <Card.Footer className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            icon={<PencilIcon className="h-4 w-4" />}
            aria-label="Edit task"
          >
            Edit
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            icon={<TrashIcon className="h-4 w-4" />}
            aria-label="Delete task"
          >
            Delete
          </Button>
        </div>
        
        <Button
          variant={task.status === 'completed' ? 'ghost' : 'primary'}
          size="sm"
          onClick={() => onUpdateStatus(task.id, getNextStatus(task.status))}
          icon={<CheckCircleIcon className="h-4 w-4" />}
        >
          {task.status === 'completed' ? 'Restart' : 'Advance'}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default TaskCard;
