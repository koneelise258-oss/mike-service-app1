import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Logo } from './Logo';
import { useSettings } from '@/hooks/useSettings';

export function Footer() {
  const { settings } = useSettings();
  const whatsappLink = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`
    : '#';

  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="container-app py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Réparation professionnelle de smartphones et vente d'accessoires en Côte d'Ivoire.
              Qualité, transparence et service premium.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/" className="transition-colors hover:text-gold-light">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="transition-colors hover:text-gold-light">
                  Catalogue téléphones
                </Link>
              </li>
              <li>
                <Link to="/accessoires" className="transition-colors hover:text-gold-light">
                  Accessoires
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-gold-light">
                  Contact & localisation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              {settings?.phone_number && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <a href={`tel:${settings.phone_number}`} className="hover:text-gold-light">
                    {settings.phone_number}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  <a href={`mailto:${settings.email}`} className="hover:text-gold-light">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>
                    {settings.address}
                    {settings?.city ? `, ${settings.city}` : ''}
                  </span>
                </li>
              )}
              {settings?.hours && (
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{settings.hours}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
              WhatsApp Business
            </h4>
            <p className="mb-4 text-sm text-white/60">
              Contactez-nous directement pour un diagnostic ou un devis rapide.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4" />
              Discuter sur WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          <p>
            © {new Date().getFullYear()} MIKE SERVICE CI. Tous droits réservés. — Les prix affichés
            sont des données de démonstration et seront remplacés par les prix officiels depuis
            l'administration.
          </p>
        </div>
      </div>
    </footer>
  );
                    }
      
