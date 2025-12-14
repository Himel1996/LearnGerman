import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/40 p-8 md:p-10 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01] hover:border-purple-200/60 overflow-hidden my-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

