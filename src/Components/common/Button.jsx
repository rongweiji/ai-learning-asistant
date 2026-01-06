import React from 'react'

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-400 focus:ring-emerald-500/50',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400/50',
    outline: 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-300/60',
  };

  const sizeStyles = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-sm',
  };

  const variantClass = variantStyles[variant] || variantStyles.primary;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[baseStyles, variantClass, sizeClass, className].join(' ')}
    >
      {children}
    </button>
  )
}

export default Button