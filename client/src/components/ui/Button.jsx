import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled, 
  children, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-pill';
  
  const variants = {
    primary: 'bg-rose text-white hover:bg-rose-dark',
    secondary: 'border-2 border-rose text-rose hover:bg-rose-light',
    ghost: 'text-chocolate hover:bg-cream-dark',
    danger: 'bg-error text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'h-8 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${!disabled && !isLoading ? 'active:scale-[0.98]' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
