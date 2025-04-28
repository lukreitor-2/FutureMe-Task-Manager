import React from 'react';
import { useRouter } from 'next/router';
import { HomeIcon, ClipboardDocumentIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClipboardDocumentIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">FutureMe Task Manager</h1>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:block">
          <nav className="p-4 space-y-2">
            <Link 
              href="/" 
              className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                router.pathname === '/' 
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/tasks" 
              className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                router.pathname.startsWith('/tasks') 
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <ClipboardDocumentIcon className="h-5 w-5" />
              <span>Tasks</span>
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
