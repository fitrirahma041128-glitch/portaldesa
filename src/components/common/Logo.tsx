import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  lightMode?: boolean;
  className?: string;
}

export const VillageEmblem: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-sm ${className}`}
      aria-label="Lambang Resmi Desa Adimulya"
    >
      {/* Outer Shield with Gold Accent */}
      <path
        d="M50 4L90 18V56C90 82 50 106 50 106C50 106 10 82 10 56V18L50 4Z"
        fill="#047857"
        stroke="#F59E0B"
        strokeWidth="3.5"
      />
      {/* Inner Shield Layer */}
      <path
        d="M50 10L84 22V54C84 76 50 98 50 98C50 98 16 76 16 54V22L50 10Z"
        fill="#065F46"
        stroke="#FBBF24"
        strokeWidth="1.5"
      />
      {/* Sky Blue Horizon */}
      <path
        d="M18 24L50 12L82 24V50C82 60 76 70 68 78L50 88L32 78C24 70 18 60 18 50V24Z"
        fill="#0284C7"
      />
      {/* Mountain Silhouettes (Gunung Slamet) */}
      <path
        d="M26 62L44 38L56 50L68 34L80 58C74 68 64 78 50 85C36 78 26 68 26 62Z"
        fill="#1E293B"
      />
      <path
        d="M34 60L46 44L54 52L64 40L74 58C68 66 58 74 48 78L34 60Z"
        fill="#334155"
      />
      {/* Golden Rising Sun */}
      <circle cx="50" cy="38" r="9" fill="#F59E0B" />
      <circle cx="50" cy="38" r="6" fill="#FDE047" />

      {/* Terraced Green Rice Paddies */}
      <path
        d="M20 54C28 58 38 56 50 56C62 56 72 58 80 54C80 62 76 72 68 78L50 86L32 78C24 72 20 62 20 54Z"
        fill="#10B981"
      />
      {/* River Flow (Sungai Cikawung) */}
      <path
        d="M48 56C47 64 53 72 50 86C48 86 46 86 45 85C47 73 42 65 44 56H48Z"
        fill="#E0F2FE"
      />

      {/* Golden Star at Apex */}
      <path
        d="M50 14L52 19L57 19.5L53 23L54.5 28L50 25L45.5 28L47 23L43 19.5L48 19L50 14Z"
        fill="#FDE047"
        stroke="#D97706"
        strokeWidth="0.5"
      />

      {/* Rice & Cotton Wreath (Padi & Kapas) */}
      <circle cx="24" cy="36" r="3" fill="#FDE047" />
      <circle cx="21" cy="44" r="3" fill="#FDE047" />
      <circle cx="20" cy="52" r="3" fill="#FDE047" />
      <circle cx="76" cy="36" r="3" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
      <circle cx="79" cy="44" r="3" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
      <circle cx="80" cy="52" r="3" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />

      {/* Red-White Ribbon Banner */}
      <path
        d="M22 84L50 92L78 84L82 92L50 102L18 92L22 84Z"
        fill="#DC2626"
        stroke="#FFFFFF"
        strokeWidth="1"
      />
      <text
        x="50"
        y="93"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="7.5"
        fontWeight="800"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        ADIMULYA
      </text>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  withText = true,
  lightMode = false,
  className = '',
}) => {
  const pixelSize = size === 'sm' ? 32 : size === 'md' ? 42 : size === 'lg' ? 56 : 72;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <VillageEmblem size={pixelSize} />
      {withText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight ${
                size === 'sm'
                  ? 'text-base'
                  : size === 'md'
                  ? 'text-lg'
                  : size === 'lg'
                  ? 'text-xl'
                  : 'text-2xl'
              } ${lightMode ? 'text-white' : 'text-slate-900'}`}
            >
              SIMPANDADU
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 border border-amber-500/25">
              Desa
            </span>
          </div>
          <span
            className={`text-xs font-medium leading-tight ${
              lightMode ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Sistem Informasi Desa Adimulya
          </span>
        </div>
      )}
    </div>
  );
};
