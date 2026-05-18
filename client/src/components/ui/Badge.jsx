import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-pill';
  
  const variants = {
    primary: 'bg-rose text-white',
    secondary: 'bg-cream-dark text-chocolate',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-error/10 text-error',
    outline: 'border border-current text-chocolate',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
