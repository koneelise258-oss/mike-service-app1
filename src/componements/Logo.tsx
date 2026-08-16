import { Link } from 'react-router-dom';

export function Logo({ className = '', showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink shadow-md">
        <span className="font-display text-lg font-extrabold text-gold-light">MS</span>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-extrabold tracking-tight text-ink">MIKE SERVICE</span>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-gold">CÔTE D'IVOIRE</span>
        </div>
      )}
    </Link>
  );
}
