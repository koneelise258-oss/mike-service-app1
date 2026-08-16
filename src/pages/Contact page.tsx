import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Clock, Phone, Mail, MessageCircle, Navigation } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';

export function ContactPage() {
  const { settings } = useSettings();
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const whatsappLink = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`
    : '#';

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }
    setLocationStatus('Localisation en cours...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (settings?.latitude && settings?.longitude) {
          const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${settings.latitude},${settings.longitude}`;
          window.open(url, '_blank');
          setLocationStatus('Itinéraire ouvert dans Google Maps.');
        } else {
          setLocationStatus('Localisation de l\'atelier non configurée.');
        }
      },
      () => {
        setLocationStatus('Impossible d\'obtenir votre position. Vérifiez vos autorisations.');
      }
    );
  };

  const mapsLink =
    settings?.latitude && settings?.longitude
      ? `https://www.google.com/maps?q=${settings.latitude},${settings.longitude}`
      : '#';

  return (
    <div className="animate-fade-in">
      <div className="border-b border-cream-dark bg-cream">
        <div className="container-app py-8">
          <nav className="mb-4 flex items-center gap-1 text-xs text-ink-soft">
            <Link to="/" className="hover:text-gold">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink">Contact</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Contact & localisation</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Retrouvez notre atelier et contactez-nous pour toute demande
          </p>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50">
                <MapPin className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-base font-semibold text-ink">Adresse de l'atelier</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {settings?.address || 'Adresse à configurer depuis l\'administration'}
                {settings?.city ? `, ${settings.city}` : ''}
              </p>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-dark"
              >
                Voir sur Google Maps
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50">
                <Clock className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-base font-semibold text-ink">Horaires d'ouverture</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {settings?.hours || 'Horaires à configurer depuis l\'administration'}
              </p>
            </div>

            <div className="card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50">
                <Phone className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-base font-semibold text-ink">Téléphone & Email</h3>
              <div className="mt-2 space-y-1 text-sm text-ink-soft">
                {settings?.phone_number && (
                  <p>
                    <a href={`tel:${settings.phone_number}`} className="hover:text-gold">
                      {settings.phone_number}
                    </a>
                  </p>
                )}
                {settings?.email && (
                  <p>
                    <a href={`mailto:${settings.email}`} className="hover:text-gold">
                      {settings.email}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-ink">WhatsApp Business</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Contactez-nous directement pour un diagnostic ou un devis rapide.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4" />
                Discuter sur WhatsApp
              </a>
            </div>

            <div className="card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50">
                <Navigation className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-base font-semibold text-ink">Itinéraire vers l'atelier</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Utilisez votre position actuelle pour calculer l'itinéraire vers notre atelier.
              </p>
              <button onClick={handleUseMyLocation} className="btn-gold mt-3">
                <Navigation className="h-4 w-4" />
                Utiliser ma position
              </button>
              {locationStatus && (
                <p className="mt-2 text-xs text-ink-soft">{locationStatus}</p>
              )}
              <p className="mt-2 text-xs text-ink-soft/70">
                Nous ne demandons jamais votre position sans votre autorisation.
              </p>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="card overflow-hidden">
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center bg-cream p-8 text-center">
              {settings?.latitude && settings?.longitude ? (
                <iframe
                  src={`https://maps.google.com/maps?q=${settings.latitude},${settings.longitude}&z=15&output=embed`}
                  className="h-full min-h-[400px] w-full rounded-xl border-0"
                  loading="lazy"
                  title="Localisation MIKE SERVICE CI"
                />
              ) : (
                <>
                  <MapPin className="h-12 w-12 text-ink-soft/30" />
                  <p className="mt-4 text-sm font-medium text-ink">Carte non disponible</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    L'administrateur doit configurer la localisation depuis les paramètres.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
        }
                
