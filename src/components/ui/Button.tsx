import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Loader2 } from 'lucide-react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
  icon?: boolean;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external,
  icon,
  isLoading,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'group relative inline-flex items-center justify-center font-sans font-medium overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 ease-out-expo';

  const variants = {
    primary: 'bg-primary text-surface',
    secondary: 'border border-primary text-primary hover:text-surface',
    accent: 'text-orange',
    ghost: 'text-neutral-mid hover:text-primary',
  };

  const sizes = {
    sm: 'text-[13px] px-5 py-2.5',
    md: 'text-[13px] px-7 py-3.5',
    lg: 'text-sm px-9 py-4',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const IconComponent = external ? ArrowUpRight : ArrowRight;

  const content = (
    <>
      {(variant === 'primary' || variant === 'secondary') && (
        <span
          className={`absolute inset-0 transition-transform duration-500 ease-out-expo translate-y-full group-hover:translate-y-0 ${
            variant === 'primary' ? 'bg-neutral-dark' : 'bg-primary'
          }`}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>{children}</span>
        {icon && !isLoading && (
          <span className="relative w-4 h-4 overflow-hidden">
            <IconComponent className="w-4 h-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-full group-hover:-translate-y-full" />
            <IconComponent className="w-4 h-4 absolute top-0 left-0 -translate-x-full translate-y-full transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
          </span>
        )}
      </span>
    </>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {content}
        </a>
      );
    }
    return (
      <Link to={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
}
