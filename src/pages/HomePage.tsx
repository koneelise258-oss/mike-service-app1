import { Link } from 'react-router-dom';
import {
  Search,
  MessageCircle,
  Smartphone,
  Battery,
  Plug,
  Cpu,
  Camera,
  Volume2,
  Mic,
  Settings,
  Droplets,
  CircuitBoard,
  Wrench,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrands, usePhoneModels } from '@/hooks/useCatalog';
import { useRepairServices } from '@/hooks/useRepairs';
import { useAccessories } from '@/hooks/useRepairs';
import { useSettings } from '@/hooks/useSettings';
import { formatPrice } from '@/lib/format';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  screen: Smartphone,
  battery: Battery,
  plug: Plug,
  cpu: Cpu,
  camera: Camera,
  'volume-2': Volume2,
  mic: Mic,
  button: Settings,
  droplets: Droplets,
  'circuit-board': CircuitBoard,
  'soldering-iron': Wrench,
  wrench: Wrench,
};

export function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const { brands } = useBrands();
  const { models } = usePhoneModels();
  const { services } = useRepairServices();
  const { accessories } = useAccessories();
  const { settings } = useSettings();

  const popularModels = models.filter((m) => m.popular).slice(0, 6);
  const featuredAccessories = accessories.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/catalogue?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const whatsappLink = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`
    : '#';

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cream">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-gold-50" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-gold-100 blur-3xl opacity-40" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-gold-50 blur-3xl opacity-60" />

        <div className="container-app relative py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white px-4 py-1.5 text-xs font-medium text-gold-dark shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Réparation premium garantie en Côte d'Ivoire
            </div>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Réparez votre smartphone avec{' '}
              <span className="text-gold">confiance</span>
            </h1>
            <p className="mt-5 text-balance text-lg leading-relaxed text-ink-soft">
              Écran cassé, batterie déchargée, problème de charge — trouvez la réparation adaptée à
              votre modèle, comparez les prix et demandez votre devis en ligne.
            </p>

            <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Tecno Spark 40, iPhone 13, Galaxy A15..."
                  className="w-full rounded-full border border-cream-dark bg-white py-4 pl-14 pr-32 text-base text-ink shadow-lg placeholder:text-ink-soft/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
                >
                  Rechercher
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-soft">
              <span>Populaire :</span>
              {['Tecno Spark 40', 'iPhone 13', 'Samsung Galaxy A15', 'Infinix Hot 40'].map((name) => (
                <button
                  key={name}
                  onClick={() => navigate(`/catalogue?q=${encodeURIComponent(name)}`)}
                  className="rounded-full border border-cream-dark bg-white px-3 py-1 font-medium transition-colors hover:border-gold hover:text-gold"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-cream-dark bg-white">
        <div className="container-app py-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: ShieldCheck, label: 'Réparation garantie', sub: 'Jusqu\'à 3 mois' },
              { icon: Zap, label: 'Service rapide', sub: 'La plupart en 24h' },
              { icon: Award, label: 'Pièces qualité', sub: 'Original, intermédiaire, TFT' },
              { icon: MessageCircle, label: 'Devis en ligne', sub: 'Via WhatsApp' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-50">
                  <item.icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <p className="text-xs text-ink-soft">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container-app">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink">Nos services de réparation</h2>
            <p className="mt-2 text-ink-soft">
              Une gamme complète de réparations pour tous les modèles de smartphones
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = ICON_MAP[service.icon || 'wrench'] || Wrench;
              return (
                <div
                  key={service.id}
                  className="card card-hover group p-5"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-cream transition-colors group-hover:bg-gold-50">
                    <Icon className="h-6 w-6 text-ink-soft transition-colors group-hover:text-gold" />
                  </div>
                  <h3 className="text-sm font-semibold text-ink">{service.name}</h3>
                  {service.description && (
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Phones */}
      <section className="bg-cream py-16">
        <div className="container-app">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-ink">Téléphones populaires</h2>
              <p className="mt-2 text-ink-soft">
                Sélectionnez votre modèle pour voir les réparations disponibles
              </p>
            </div>
            <Link
              to="/catalogue"
              className="hidden items-center gap-1 text-sm font-semibold text-gold hover:text-gold-dark sm:flex"
            >
              Voir tout le catalogue
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {popularModels.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-cream-dark bg-white p-12 text-center">
              <Smartphone className="mx-auto h-10 w-10 text-ink-soft/40" />
              <p className="mt-3 text-sm text-ink-soft">
                Aucun modèle populaire pour le moment. Ajoutez-en depuis l'administration.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {popularModels.map((model) => (
                <Link
                  key={model.id}
                  to={`/telephone/${model.brand?.slug}/${model.slug}`}
                  className="card card-hover group flex flex-col items-center p-5 text-center"
                >
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-cream transition-colors group-hover:bg-gold-50">
                    <Smartphone className="h-8 w-8 text-ink-soft transition-colors group-hover:text-gold" />
                  </div>
                  <p className="text-xs font-medium text-ink-soft">{model.brand?.name}</p>
                  <p className="text-sm font-semibold text-ink">{model.name}</p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link to="/catalogue" className="btn-outline">
              Voir tout le catalogue
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="py-12">
          <div className="container-app">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-ink">Marques prises en charge</h2>
              <p className="mt-1 text-sm text-ink-soft">
                L'administrateur peut ajouter de nouvelles marques depuis le tableau de bord
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/catalogue?brand=${brand.slug}`}
                  className="rounded-xl border border-cream-dark bg-white px-6 py-3 text-sm font-semibold text-ink transition-all hover:border-gold hover:text-gold hover:shadow-md"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Accessories */}
      <section className="bg-cream py-16">
        <div className="container-app">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-ink">Accessoires populaires</h2>
              <p className="mt-2 text-ink-soft">
                Chargeurs, câbles, coques, protections d'écran et plus encore
              </p>
            </div>
            <Link
              to="/accessoires"
              className="hidden items-center gap-1 text-sm font-semibold text-gold hover:text-gold-dark sm:flex"
            >
              Voir tous les accessoires
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredAccessories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-cream-dark bg-white p-12 text-center">
              <p className="text-sm text-ink-soft">
                Aucun accessoire pour le moment. Ajoutez-en depuis l'administration.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featuredAccessories.map((acc) => (
                <div key={acc.id} className="card card-hover group p-5">
                  <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-cream transition-colors group-hover:bg-gold-50">
                    <Smartphone className="h-12 w-12 text-ink-soft/30 transition-colors group-hover:text-gold/50" />
                  </div>
                  <p className="text-xs font-medium text-gold">{acc.category}</p>
                  <h3 className="mt-1 text-sm font-semibold text-ink line-clamp-2">{acc.name}</h3>
                  <p className="mt-2 text-base font-bold text-ink">{formatPrice(acc.price)}</p>
                  {!acc.available && (
                    <span className="mt-2 inline-block rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                      Rupture de stock
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link to="/accessoires" className="btn-outline">
              Voir tous les accessoires
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center lg:px-12 lg:py-16">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-gold/5 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white lg:text-4xl">
                Besoin d'une réparation ?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/60">
                Contactez-nous sur WhatsApp pour un diagnostic rapide ou parcourez notre catalogue
                pour trouver le prix de votre réparation.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contacter sur WhatsApp
                </a>
                <Link
                  to="/catalogue"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Parcourir le catalogue
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="bg-cream py-16">
        <div className="container-app">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50">
                <MapPin className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-base font-semibold text-ink">Notre atelier</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {settings?.address || 'Adresse à configurer'}
                {settings?.city ? `, ${settings.city}` : ''}
              </p>
              <Link to="/contact" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-dark">
                Voir l'itinéraire
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50">
                <Clock className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-base font-semibold text-ink">Horaires</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {settings?.hours || 'Horaires à configurer'}
              </p>
            </div>

            <div className="card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50">
                <Phone className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-base font-semibold text-ink">Téléphone</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {settings?.phone_number ? (
                  <a href={`tel:${settings.phone_number}`} className="hover:text-gold">
                    {settings.phone_number}
                  </a>
                ) : (
                  'Numéro à configurer'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
    }
                
