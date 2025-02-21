'use client';

import { useTheme } from '../editor/ThemeContext';
import { ButtonHTMLAttributes } from 'react';

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'default';
  icon?: boolean;
}

const RetroButton = ({
  children,
  className = '',
  size = 'default',
  icon = false,
  ...props
}: RetroButtonProps) => {
  const { theme, themes } = useTheme();

  const sizeClasses = {
    sm: 'w-6 h-6 !p-0',
    default: 'px-2 py-1',
  };

  return (
    <button
      className={`
        ${themes[theme].button}
        ${themes[theme].buttonHover}
        ${sizeClasses[size]}
        border border-[#DFDFDF] border-r-[#808080] border-b-[#808080]
        text-sm font-chicago
        flex items-center justify-center
        ${icon ? 'gap-1.5' : ''}
        active:border-[#808080] active:border-t-[#808080] active:border-l-[#808080]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        shadow-[inset_-1px_-1px_#808080,inset_1px_1px_#fff]
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default RetroButton;
