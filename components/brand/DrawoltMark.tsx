import React from 'react';

interface DrawoltMarkProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'titanium';
  showVectorSlotNote?: boolean;
  slotNoteText?: string;
}

/**
 * DRAWOLT Brand Lockup.
 * Preserves authentic brand typography and reserves the official D/Lion vector slot
 * without inventing an unauthorized lion graphic replacement.
 */
export function DrawoltMark({
  size = 'md',
  variant = 'light',
  showVectorSlotNote = false,
  slotNoteText,
}: DrawoltMarkProps) {
  const textColor = variant === 'dark' ? 'text-white' : 'text-[#101C35]';
  const accentColor = 'bg-[#9DCB16]';

  const sizeClasses = {
    sm: 'text-lg tracking-tight',
    md: 'text-xl tracking-tight',
    lg: 'text-3xl sm:text-4xl tracking-tight',
  }[size];

  return (
    <div className="inline-flex flex-col items-start">
      <div className="inline-flex items-center gap-2.5 whitespace-nowrap">
        {/* Precision architectural frame marking official D/Lion SVG emblem placement */}
        <span
          className={`inline-flex items-center justify-center rounded border font-mono text-[10px] font-bold tracking-wider ${
            variant === 'dark'
              ? 'border-white/25 bg-white/5 text-white/80'
              : 'border-[#101C35]/20 bg-[#F6F8FA] text-[#101C35]'
          } ${size === 'lg' ? 'h-9 w-9 text-xs' : 'h-7 w-7'}`}
          title="Official DRAWOLT D/Lion Emblem Vector Slot"
          aria-hidden="true"
        >
          D
        </span>
        <span
          className={`font-display font-bold italic uppercase ${sizeClasses} ${textColor}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          DRA<span className="text-[#9DCB16]">W</span>OLT
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1" aria-hidden="true">
        <span className={`h-[2px] ${size === 'lg' ? 'w-28' : 'w-16'} ${accentColor}`} />
        <span className="h-[2px] w-2 -skew-x-24 bg-[#7D8792]" />
        <span className="h-[2px] w-2 -skew-x-24 bg-[#7D8792]" />
        <span className="h-[2px] w-2 -skew-x-24 bg-[#9DCB16]" />
      </div>
      {showVectorSlotNote && slotNoteText && (
        <p className="mt-2 max-w-md text-xs text-[#7D8792]">{slotNoteText}</p>
      )}
    </div>
  );
}
