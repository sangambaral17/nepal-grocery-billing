import React from 'react';

const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && <label className="text-sm font-medium text-[var(--text-muted)]">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 ${Icon ? 'pl-10' : ''
                        } ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                    {...props}
                />
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
