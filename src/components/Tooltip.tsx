import React, { ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'bottom',
  className = ''
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-[#1C1814] border-x-transparent border-b-0 border-4 border-solid';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1C1814] border-x-transparent border-t-0 border-4 border-solid';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-[#1C1814] border-y-transparent border-r-0 border-4 border-solid';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-[#1C1814] border-y-transparent border-l-0 border-4 border-solid';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1C1814] border-x-transparent border-t-0 border-4 border-solid';
    }
  };

  return (
    <div className={`relative group inline-flex items-center justify-center ${className}`}>
      {children}
      <div className={`absolute ${getPositionClasses()} w-48 p-2 text-xs font-sans text-paper-aged bg-[#1C1814] border border-leather-brown/40 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] text-center leading-relaxed font-normal`}>
        {content}
        <span className={`absolute ${getArrowClasses()}`} />
      </div>
    </div>
  );
};
