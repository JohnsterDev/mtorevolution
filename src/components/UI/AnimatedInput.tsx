import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export function AnimatedInput({ 
  label, 
  error, 
  helperText, 
  icon, 
  className, 
  type,
  ...props 
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={clsx(
            'peer w-full px-4 py-3 border-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 focus:outline-none',
            icon && 'pl-12',
            isPassword && 'pr-12',
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20',
            'focus:ring-4',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          placeholder=""
        />
        
        {/* Floating Label */}
        {label && (
          <motion.label
            className={clsx(
              'absolute left-4 transition-all duration-300 pointer-events-none',
              icon && 'left-12',
              (isFocused || hasValue)
                ? 'top-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium'
                : 'top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400'
            )}
            animate={{
              scale: (isFocused || hasValue) ? 0.85 : 1,
              y: (isFocused || hasValue) ? -8 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {/* Focus Ring */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-indigo-500 opacity-0 pointer-events-none"
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}