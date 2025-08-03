import React from 'react';
import clsx from 'clsx';

type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary', className }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-6 py-2 rounded-lg cursor-pointer text-base font-semibold transition-all duration-300 shadow-md',
        'hover:scale-105 hover:shadow-lg focus:outline-none',
        {
          'bg-teal-500 text-white hover:bg-teal-600': variant === 'primary',
          'bg-white text-teal-700 border border-teal-500 hover:bg-teal-50': variant === 'secondary',
        },
        className
      )}
    >
      {text}
    </button>
  );
};

export default Button;
