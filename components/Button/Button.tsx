import React from 'react';

interface IProps {
  type?: 'submit' | 'reset' | 'button';
  onClick?: (e: any) => void;
  children?: React.ReactNode;
  primary?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  type = 'button',
  primary,
  className,
  children,
  onClick,
  disabled = false,
  id = '',
  ...props
}: IProps) => {
  return (
    <button
      type={type}
      className={` ${className} ${
        disabled ? 'bg-gray-400' : ''
      } rounded-md font-bold  active:stroke-blue-dark active:shadow-xl transition duration-150 ease-in-out border-blue-400 bg-white`}
      {...props}
      onClick={onClick && onClick}
      id={id}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
