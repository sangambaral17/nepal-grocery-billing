import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus:ring-indigo-500 shadow-lg shadow-indigo-500/30',
        secondary: 'bg-[var(--color-secondary)] text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-lg shadow-emerald-500/30',
        danger: 'bg-[var(--color-danger)] text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/30',
        outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-indigo-50 focus:ring-indigo-500',
        ghost: 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-100',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        icon: 'p-2',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
