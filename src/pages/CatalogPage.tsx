import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Smartphone, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useBrands, usePhoneModels } from '@/hooks/useCatalog';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const brandFilter = searchParams.get('brand') || '';
  const [searchInput, setSearchInput] = useState(query);
  const { brands } = useBrands();
  const { models, loading } = usePhoneModels();

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const filtered = models.filter((m) => {
    const matchesQuery = !query || m.name.toLowerCase().includes(query.toLowerCase()) || m.brand?.name.toLowerCase().includes(query.toLowerCase());
    const matchesBrand = !brandFilter || m.brand?.slug === brandFilter;
    return matchesQuery && matchesBrand;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set('q', searchInput);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const setBrand = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('brand', slug);
    } else {
      params.delete('brand');
    }
    setSearchParams(params);
  };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="border-b border-cream-dark bg-cream">
        <div className="container-app py-8">
          <nav className="mb-4 flex items-center gap-1 text-xs text-ink-soft">
            <Link to="/" className="hover:text-gold">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink">Catalogue</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Catalogue des téléphones</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Sélectionnez votre modèle pour voir les réparations et prix disponibles
          </p>

          <form onSubmit={handleSearch} className="mt-6 relative max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher un modèle..."
              className="w-full rounded-full border border-cream-dark bg-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-soft/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </form>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Brand filters */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <SlidersHorizontal className="h-4 w-4" />
            Filtrer par marque
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setBrand('')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !brandFilter
                  ? 'bg-ink text-white'
                  : 'border border-cream-dark bg-white text-ink-soft hover:border-gold hover:text-gold'
              }`}
            >
              Toutes
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setBrand(brand.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  brandFilter === brand.slug
                    ? 'bg-ink text-white'
                    : 'border border-cream-dark bg-white text-ink-soft hover:border-gold hover:text-gold'
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-ink-soft">
          {filtered.length} modèle{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          {query && ` pour « ${query} »`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse p-5">
                <div className="mb-4 h-32 rounded-xl bg-cream" />
                <div className="h-3 w-1/3 rounded bg-cream" />
                <div className="mt-2 h-4 w-2/3 rounded bg-cream" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cream-dark bg-white p-12 text-center">
            <Smartphone className="mx-auto h-12 w-12 text-ink-soft/40" />
            <p className="mt-4 text-sm font-medium text-ink">Aucun modèle trouvé</p>
            <p className="mt-1 text-sm text-ink-soft">
              Essayez une autre recherche ou filtrez par une marque différente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((model) => (
              <Link
                key={model.id}
                to={`/telephone/${model.brand?.slug}/${model.slug}`}
                className="card card-hover group flex flex-col p-5"
              >
                <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-cream transition-colors group-hover:bg-gold-50">
                  <Smartphone className="h-12 w-12 text-ink-soft/30 transition-colors group-hover:text-gold/50" />
                </div>
                <p className="text-xs font-medium text-gold">{model.brand?.name}</p>
                <h3 className="mt-1 text-sm font-semibold text-ink">{model.name}</h3>
                {model.description && (
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft line-clamp-2">
                    {model.description}
                  </p>
                )}
                {model.popular && (
                  <span className="mt-2 inline-flex w-fit items-center rounded-full bg-gold-50 px-2 py-0.5 text-xs font-medium text-gold-dark">
                    Populaire
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
    }
        
