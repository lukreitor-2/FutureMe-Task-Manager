// src/pages/tasks/[id].tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import TaskDialog from '@/components/TaskDialog';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { Task, tasksApi, UpdateTaskDto } from '@/lib/api';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function TaskDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTask = useCallback(async (taskId: number) => {
    try {
      setLoading(true);
      const data = await tasksApi.getById(taskId);
      setTask(data);
    } catch (error) {
      console.error('Failed to fetch task:', error);
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchTask(parseInt(id));
    }
  }, [id, fetchTask]);

  const handleUpdateTask = async (data: UpdateTaskDto) => {
    if (!task) return;

    try {
      const updatedTask = await tasksApi.update(task.id, data);
      setTask(updatedTask);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;

    try {
      setIsDeleting(true);
      await tasksApi.delete(task.id);
      router.push('/tasks');
    } catch (error) {
      console.error('Failed to delete task:', error);
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (status: Task['status']) => {
    if (!task) return;

    try {
      const updatedTask = await tasksApi.update(task.id, { status });
      setTask(updatedTask);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (error) {
      return dateString;
    }
  };

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

  return (
    <Layout>
      <div className="mb-6 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          icon={<ArrowLeftIcon className="h-4 w-4" />}
        >
          Back
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      ) : task ? (
        <>
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{task.title}</h1>
                <Badge variant={statusVariant[task.status]}>
                  {statusText[task.status]}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Created {formatDate(task.createdAt)}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => setIsEditDialogOpen(true)}
                icon={<PencilIcon className="h-5 w-5" />}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => setIsDeleteDialogOpen(true)}
                icon={<TrashIcon className="h-5 w-5" />}
              >
                Delete
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <Card.Header>
              <h2 className="font-medium">Description</h2>
            </Card.Header>
            <Card.Content>
              <p className="whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="font-medium">Status</h2>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Current status: <Badge variant={statusVariant[task.status]}>{statusText[task.status]}</Badge>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Last updated: {formatDate(task.updatedAt)}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {task.status !== 'in-progress' && (
                    <Button
                      variant="primary"
                      onClick={() => handleStatusChange('in-progress')}
                      icon={<ClockIcon className="h-5 w-5" />}
                    >
                      Mark as In Progress
                    </Button>
                  )}

                  {task.status !== 'completed' && (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatusChange('completed')}
                      icon={<CheckIcon className="h-5 w-5" />}
                    >
                      Mark as Completed
                    </Button>
                  )}

                  {task.status !== 'pending' && (
                    <Button
                      variant="ghost"
                      onClick={() => handleStatusChange('pending')}
                      icon={<ArrowLeftIcon className="h-5 w-5" />}
                    >
                      Reset to Pending
                    </Button>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>

          <TaskDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSubmit={handleUpdateTask}
            task={task}
            title="Edit Task"
          />

          <DeleteConfirmation
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteTask}
            title={task.title}
            isDeleting={isDeleting}
          />
        </>
      ) : (
        <p>Task not found.</p>
      )}
    </Layout>
  );
}
