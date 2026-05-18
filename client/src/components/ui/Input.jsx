import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  wrapperClassName = '', 
  id, 
  ...props 
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-chocolate">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          flex h-11 w-full rounded-md border bg-white px-3 py-2 text-sm text-chocolate
          transition-colors placeholder:text-chocolate/40
          focus:outline-none focus:ring-2 focus:ring-rose/20 focus:border-rose
          disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-error focus:ring-error/20 focus:border-error' : 'border-chocolate/20'}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-error mt-0.5">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
