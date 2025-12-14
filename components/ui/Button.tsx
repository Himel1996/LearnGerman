import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';
  
  const variantClasses = variant === 'primary' 
    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 active:scale-95'
    : variant === 'gradient'
    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95'
    : 'bg-white/90 hover:bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg active:scale-95';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {(variant === 'primary' || variant === 'gradient') && (
        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
      )}
    </button>
  );
}

