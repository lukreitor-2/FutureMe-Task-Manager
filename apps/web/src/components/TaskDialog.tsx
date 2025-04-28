import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form'; // Import FormProvider
import Button from './ui/Button';
import Input from './ui/Input';
import TextArea from './ui/TextArea';
import Select from './ui/Select';
import { Task, CreateTaskDto } from '@/lib/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto) => void;
  task?: Task;
  title: string;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  title,
}) => {
  const methods = useForm<CreateTaskDto>({ // Changed const { ... } to const methods = useForm(...)
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'pending',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods; // Access methods from the methods object

  console.log("TaskDialog: Initial Errors:", errors); // Debugging line

  useEffect(() => {
    if (isOpen) {
      reset({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'pending',
      });
      console.log("TaskDialog: Resetting form with:", { // Debugging line
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'pending',
      });
    }
  }, [isOpen, task, reset]);
  
  if (!isOpen) return null;
  
  const onSubmitInternal = (data: CreateTaskDto) => {
    console.log("TaskDialog: Submitting data:", data); // Debugging line
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <FormProvider {...methods}> {/* Wrap the form with FormProvider */}
          <form onSubmit={handleSubmit(onSubmitInternal)}>
            <div className="p-4 space-y-4">
              <Input
                label="Title"
                name="title" // Add the name prop
                error={errors.title?.message}
                placeholder="Enter task title"
              />
              
              <TextArea
                label="Description"
                name="description" // Add the name prop
                error={errors.description?.message}
                placeholder="Enter task description (optional)"
                rows={4}
                required={false} // Set to true if the description is required
                />

              
              <Select
                label="Status"
                {...methods.register('status')}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />
            </div>
            
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                {task ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default TaskDialog;
