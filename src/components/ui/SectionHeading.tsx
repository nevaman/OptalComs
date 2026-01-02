import { ReactNode } from 'react';

type SectionHeadingProps = {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
  dark?: boolean;
};

export function SectionHeading({ label, title, description, align = 'left', children, dark = false }: SectionHeadingProps) {
  return (
    <div className={`mb-14 md:mb-20 ${align === 'center' ? 'text-center' : ''}`}>
      {label && (
        <p className={`caption mb-4 ${dark ? 'text-surface/40' : ''}`}>
          {label}
        </p>
      )}
      <h2 className={`text-balance ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-xl'} ${dark ? 'text-surface' : ''}`}>
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-lg leading-relaxed ${
            align === 'center' ? 'max-w-xl mx-auto' : 'max-w-lg'
          } ${dark ? 'text-surface/60' : 'text-neutral-mid'}`}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
