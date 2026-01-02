import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react';

type InputProps = {
  label?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-primary">
            {label}
            {props.required && <span className="text-orange ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${error ? 'border-orange' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-orange">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

type TextareaProps = {
  label?: string;
  error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-primary">
            {label}
            {props.required && <span className="text-orange ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`input-field min-h-[120px] resize-y ${error ? 'border-orange' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-orange">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

type SelectProps = {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-primary">
            {label}
            {props.required && <span className="text-orange ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`input-field appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%232A2A33%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:16px] pr-10 ${
            error ? 'border-orange' : ''
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-orange">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
