import React from 'react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16',
  };

  return (
    <div className={cn('flex items-center gap-3 group', className)}>
      <div className={cn('relative flex items-center justify-center bg-white border border-[#059669] rounded-sm overflow-hidden transition-transform group-hover:scale-105', sizes[size], 'aspect-square')}>
        <svg viewBox="0 0 200 200" className="w-full h-full p-1">
          <text 
            x="50%" 
            y="45%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fill="#059669" 
            className="font-sans font-bold" 
            fontSize="70"
          >
            BHP
          </text>
          <text 
            x="50%" 
            y="75%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fill="#059669" 
            className="font-sans font-bold" 
            fontSize="28" 
            letterSpacing="8"
          >
            FINANCE
          </text>
        </svg>
      </div>
      {showText && (
        <span className={cn('font-bold tracking-tight text-slate-900', size === 'sm' ? 'text-lg' : 'text-xl')}>
          BHP Finance
        </span>
      )}
    </div>
  );
}
