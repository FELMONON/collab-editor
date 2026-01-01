"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${className}`}
      >
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 border-2 border-gray-300 rounded-md bg-white transition-all duration-200 peer-checked:bg-sky-500 peer-checked:border-sky-500 peer-focus-visible:ring-2 peer-focus-visible:ring-sky-500 peer-focus-visible:ring-offset-2 peer-hover:border-gray-400 peer-checked:peer-hover:bg-sky-600 peer-checked:peer-hover:border-sky-600">
            <Check className="w-full h-full p-0.5 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
          </div>
          <Check className="absolute inset-0 w-full h-full p-0.5 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100 pointer-events-none" />
        </div>
        {label && (
          <span className="text-sm text-gray-600 peer-disabled:text-gray-400">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
