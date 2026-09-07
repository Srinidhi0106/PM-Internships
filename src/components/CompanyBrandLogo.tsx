import React from 'react';
import { Building2 } from 'lucide-react';

interface CompanyBrandLogoProps {
  companyName: string;
  logoUrl?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const CompanyBrandLogo: React.FC<CompanyBrandLogoProps> = ({
  companyName,
  logoUrl,
  className = '',
  size = 'md'
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);
  const name = (companyName || '').toLowerCase().trim();

  const sizeClasses = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-11 h-11 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-16 h-16 text-base'
  }[size];

  // If a valid custom logoUrl is given and hasn't failed, and isn't a random Unsplash photo
  const isGenericUnsplash = logoUrl && logoUrl.includes('images.unsplash.com');
  if (logoUrl && !isGenericUnsplash && !imageFailed) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs ${className}`}>
        <img
          src={logoUrl}
          alt={companyName}
          className="w-full h-full object-contain"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  // Tata Consultancy Services (TCS) / Tata
  if (name.includes('tcs') || name.includes('tata consultancy') || name.includes('tata')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#00529C] text-white font-black flex flex-col items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <span className="text-[9px] sm:text-[10px] tracking-wider font-sans font-extrabold uppercase">TCS</span>
        <span className="text-[6px] tracking-widest text-sky-200 uppercase font-sans -mt-0.5">TATA</span>
      </div>
    );
  }

  // Reliance Industries / Reliance Jio
  if (name.includes('reliance') || name.includes('jio')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#0092DF] text-white flex items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <div className="w-full h-full rounded-lg bg-[#1D2568] flex items-center justify-center">
          <span className="font-black italic text-white text-xs sm:text-sm font-sans">Jio</span>
        </div>
      </div>
    );
  }

  // Larsen & Toubro (L&T)
  if (name.includes('larsen') || name.includes('l&t') || name.includes('toubro')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#003B73] text-white font-black flex items-center justify-center shrink-0 shadow-2xs p-1 select-none border border-sky-600/30 ${className}`}>
        <div className="w-full h-full rounded-lg border border-white/60 flex items-center justify-center">
          <span className="font-extrabold text-[11px] sm:text-xs tracking-wider text-white">L&T</span>
        </div>
      </div>
    );
  }

  // Infosys
  if (name.includes('infosys')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#007CC3] text-white font-black flex items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <span className="text-[10px] sm:text-xs font-black tracking-tight font-sans">Infosys</span>
      </div>
    );
  }

  // Tech Mahindra / Mahindra
  if (name.includes('mahindra')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <div className="w-4 h-1.5 bg-[#E31837] transform -skew-x-12 rounded-2xs mb-0.5"></div>
        <span className="font-black text-[8px] text-[#E31837] tracking-tight uppercase font-sans leading-none">Mahindra</span>
      </div>
    );
  }

  // HDFC Bank
  if (name.includes('hdfc')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#004B8D] text-white font-black flex flex-col items-center justify-center shrink-0 shadow-2xs p-0.5 select-none ${className}`}>
        <div className="w-4 h-4 bg-white border border-[#ED232A] flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#004B8D]"></div>
        </div>
        <span className="text-[7px] font-black tracking-wider text-white mt-0.5">HDFC</span>
      </div>
    );
  }

  // Bharti Airtel / Airtel
  if (name.includes('airtel')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#E60000] text-white font-black flex items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <span className="text-xs sm:text-sm font-black lowercase italic tracking-tighter">airtel</span>
      </div>
    );
  }

  // Wipro
  if (name.includes('wipro')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#250E62] dark:text-purple-300 font-extrabold flex items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <div className="flex items-center gap-0.5">
          <span className="text-[11px] font-black lowercase tracking-tight">wipro</span>
          <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#00A896] via-[#FA9F42] to-[#B02E0C]"></span>
        </div>
      </div>
    );
  }

  // Cognizant
  if (name.includes('cognizant')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#0033A0] text-white font-bold flex flex-col items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <span className="text-[9px] font-black lowercase tracking-tight">cognizant</span>
      </div>
    );
  }

  // Capgemini
  if (name.includes('capgemini')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-white dark:bg-slate-900 border border-[#0070AD]/30 text-[#0070AD] font-black flex flex-col items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <span className="text-[9px] font-bold italic">Capgemini</span>
      </div>
    );
  }

  // Google
  if (name.includes('google')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <span className="text-xs font-black">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </span>
      </div>
    );
  }

  // IBM
  if (name.includes('ibm')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#006699] text-white font-black flex items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <span className="text-xs font-black tracking-widest font-mono">IBM</span>
      </div>
    );
  }

  // Ministry of Corporate Affairs / MCA / PM Scheme
  if (name.includes('mca') || name.includes('ministry') || name.includes('govt') || name.includes('pm')) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black flex flex-col items-center justify-center shrink-0 shadow-2xs p-1 select-none ${className}`}>
        <span className="text-[9px] font-black uppercase">MCA</span>
        <span className="text-[6px] font-extrabold uppercase -mt-0.5">GOVT</span>
      </div>
    );
  }

  // Generic Clean Fallback with Initials
  const initials = companyName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'CO';

  return (
    <div className={`${sizeClasses} rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs p-1 select-none ${className}`}>
      {initials.length <= 3 ? (
        <span className="font-extrabold tracking-tight">{initials}</span>
      ) : (
        <Building2 className="w-5 h-5 text-slate-400" />
      )}
    </div>
  );
};
