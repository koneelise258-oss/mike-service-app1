import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, MessageCircle, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';
import { useSettings } from '@/hooks/useSettings';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { settings } = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-gold' : 'text-ink-soft hover:text-ink'}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/catalogue?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white'
      }`}
    >
      <div className="border-b border-cream-dark">
        <div className="container-app flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex">
            <NavLink to="/" className={navLinkClass} end>
              Accueil
            </NavLink>
            <NavLink to="/catalogue" className={navLinkClass}>
              Catalogue
            </NavLink>
            <NavLink to="/accessoires" className={navLinkClass}>
              Accessoires
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`https://wa.me/${settings?.whatsapp_number?.replace(/[^0-9]/g, '') || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold !py-2 !px-4"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <Link to="/admin" className="btn-ghost">
              Admin
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-ink transition-colors hover:bg-cream lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="border-b border-cream-dark bg-cream">
        <div className="container-app py-3">
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Rechercher un modèle : Tecno Spark 40, iPhone 13, Galaxy A15..."
              className="w-full rounded-full border border-cream-dark bg-white py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-soft/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </form>
        </div>
      </div>

      {open && (
        <div className="border-b border-cream-dark bg-white lg:hidden">
          <div className="container-app flex flex-col gap-1 py-4">
            <NavLink
              to="/"
              className="rounded-lg px-4 py-3 text-sm font-medium text-ink-soft hover:bg-cream hover:text-ink"
              onClick={() => setOpen(false)}
              end
            >
              Accueil
            </NavLink>
            <NavLink
              to="/catalogue"
              className="rounded-lg px-4 py-3 text-sm font-medium text-ink-soft hover:bg-cream hover:text-ink"
              onClick={() => setOpen(false)}
            >
              Catalogue
            </NavLink>
            <NavLink
              to="/accessoires"
              className="rounded-lg px-4 py-3 text-sm font-medium text-ink-soft hover:bg-cream hover:text-ink"
              onClick={() => setOpen(false)}
            >
              Accessoires
            </NavLink>
            <NavLink
              to="/contact"
              className="rounded-lg px-4 py-3 text-sm font-medium text-ink-soft hover:bg-cream hover:text-ink"
              onClick={() => setOpen(false)}
            >
              Contact
            </NavLink>
            <div className="mt-2 flex flex-col gap-2 border-t border-cream-dark pt-3">
              <a
                href={`https://wa.me/${settings?.whatsapp_number?.replace(/[^0-9]/g, '') || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <Link to="/admin" className="btn-outline w-full" onClick={() => setOpen(false)}>
                Espace Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
              }
              
