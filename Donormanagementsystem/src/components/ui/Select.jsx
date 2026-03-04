import React from 'react';
import { cn } from '../../lib/utils';

export const Select = React.forwardRef(
  ({ className, children, options, ...props }, ref) => {
    const renderedOptions =
      children ||
      (Array.isArray(options)
        ? options.map((option) => (
            <option
              key={option.value ?? option.label}
              value={option.value}
            >
              {option.label}
            </option>
          ))
        : null);

    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            className
          )}
          ref={ref}
          {...props}
        >
          {renderedOptions}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";
