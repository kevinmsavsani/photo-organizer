import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import { Button } from '@headlessui/react'
import clsx from 'clsx'

type CustomButtonProps = {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'light'
  size?: 'sm' | 'md' | 'lg'
} & ButtonHTMLAttributes<HTMLButtonElement>

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'rounded transition-all'
  const variants = {
    primary: 'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-900',
    secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-100 active:bg-gray-400',
    tertiary: 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700',
    light: 'bg-gray-100 text-gray-800 hover:bg-gray-50 active:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
  }
  const sizes = {
    sm: 'py-1 px-2 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-lg',
  }

  const combinedClassName = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    className,
    { 'opacity-50 cursor-not-allowed': disabled },
  )

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {children}
    </Button>
  )
}
