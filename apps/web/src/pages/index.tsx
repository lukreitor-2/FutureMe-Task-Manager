// src/pages/index.tsx
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Task, tasksApi } from '@/lib/api';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksApi.getAll();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const counts = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your tasks and progress
          </p>
        </div>

        <Link href="/tasks/new">
          <Button icon={<PlusIcon className="h-5 w-5" />}>
            New Task
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse h-24">
              <div></div> {/* Add empty children */}
            </Card>

          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <Card.Content className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Pending Tasks
                </p>
                <p className="text-3xl font-bold mt-1">{counts.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  In Progress
                </p>
                <p className="text-3xl font-bold mt-1">{counts.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Completed
                </p>
                <p className="text-3xl font-bold mt-1">{counts.completed}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Recent Tasks</h2>
        <Link href="/tasks">
          <Button variant="ghost" className="text-sm" icon={<ArrowRightIcon className="h-4 w-4" />}>
            View All
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse h-24">
              <div></div> {/* Add empty children */}
            </Card>

          ))}
        </div>
      ) : (
        <>
          {tasks.length === 0 ? (
            <Card>
              <Card.Content className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You don&apos;t have any tasks yet.
                </p>
                <Link href="/tasks/new">
                  <Button icon={<PlusIcon className="h-5 w-5" />}>
                    Create Your First Task
                  </Button>
                </Link>
              </Card.Content>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.slice(0, 6).map((task) => (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <Card.Content>
                      <h3 className="font-medium mb-2 truncate">{task.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {task.description || 'No description provided.'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : task.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}
                        >
                          {task.status === 'in-progress'
                            ? 'In Progress'
                            : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </div>
                    </Card.Content>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
