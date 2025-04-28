import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import TaskCard from '@/components/TaskCard';
import TaskDialog from '@/components/TaskDialog';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/ui/Button';
import { Task, tasksApi, CreateTaskDto, UpdateTaskDto } from '@/lib/api';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState<Task['status'] | 'all'>('all');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
    console.log('TasksPage useEffect: tasks fetched'); // Debugging line
  }, []);
  
  const handleCreateTask = async (data: CreateTaskDto) => {
    try {
        console.log("TasksPage: Creating task with data:", data); // Debugging line
      await tasksApi.create(data);
      setIsTaskDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('TasksPage: Failed to create task:', error);
    }
  };
  
  const handleUpdateTask = async (data: CreateTaskDto) => {
    if (!currentTask) return;
    
    try {
      console.log("TasksPage: Updating task with data:", data); // Debugging line
      await tasksApi.update(currentTask.id, data as UpdateTaskDto);
      setIsTaskDialogOpen(false);
      setCurrentTask(undefined);
      fetchTasks();
    } catch (error) {
      console.error('TasksPage: Failed to update task:', error);
    }
  };
  
  const handleDeleteTask = async () => {
    if (!currentTask) return;
    
    try {
      setIsDeleting(true);
      console.log("TasksPage: Deleting task with id:", currentTask.id); // Debugging line
      await tasksApi.delete(currentTask.id);
      setIsDeleteDialogOpen(false);
      setCurrentTask(undefined);
      fetchTasks();
    } catch (error) {
      console.error('TasksPage: Failed to delete task:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleEditClick = (task: Task) => {
    console.log("TasksPage: Editing task:", task); // Debugging line
    setCurrentTask(task);
    setIsTaskDialogOpen(true);
  };
  
  const handleDeleteClick = (task: Task) => {
    console.log("TasksPage: Deleting task:", task); // Debugging line
    setCurrentTask(task);
    setIsDeleteDialogOpen(true);
  };
  
  const handleUpdateStatus = async (taskId: number, status: Task['status']) => {
    try {
      console.log(`TasksPage: Updating task ${taskId} status to ${status}`); // Debugging line
      await tasksApi.update(taskId, { status });
      fetchTasks();
    } catch (error) {
      console.error('TasksPage: Failed to update task status:', error);
    }
  };
  
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.status === filter);
  
  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tasks
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Task['status'] | 'all')}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <Button
            onClick={() => {
              setCurrentTask(undefined);
              setIsTaskDialogOpen(true);
              console.log('TasksPage: New Task button clicked'); // Debugging line
            }}
            icon={<PlusIcon className="h-5 w-5" />}
          >
            New Task
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {filteredTasks.length === 0 ? (
            <EmptyState
              title="No tasks found"
              description={
                filter === 'all'
                  ? "You don't have any tasks yet. Create your first task to get started."
                  : `You don't have any ${filter} tasks. Change the filter or create a new task.`
              }
              actionLabel="Create Task"
              onAction={() => {
                setCurrentTask(undefined);
                setIsTaskDialogOpen(true);
                console.log('TasksPage: EmptyState Create Task clicked'); // Debugging line
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditClick}
                  onDelete={() => handleDeleteClick(task)}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </>
      )}
      
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setCurrentTask(undefined);
          console.log('TasksPage: TaskDialog closed'); // Debugging line
        }}
        onSubmit={currentTask ? handleUpdateTask : handleCreateTask}
        task={currentTask}
        title={currentTask ? 'Edit Task' : 'Create Task'}
        
      />
      
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCurrentTask(undefined);
          console.log('TasksPage: DeleteConfirmation closed'); // Debugging line
        }}
        onConfirm={handleDeleteTask}
        title={currentTask?.title || 'this task'}
        isDeleting={isDeleting}
      />
    </Layout>
  );
}
