import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useFormContext } from 'react-hook-form';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  name: string; // Ensure 'name' is a required prop
};

const Input: React.FC<InputProps> = ({
  className,
  label,
  error,
  id,
  name,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  console.log('Input component rendered with id:', inputId, 'and props:', props); // Debugging line
  const { register } = useFormContext();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={twMerge(
          'block w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
        {...register(name, { required: 'This field is required' })} // Apply register here
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
