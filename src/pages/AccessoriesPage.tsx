import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Smartphone, Package } from 'lucide-react';
import { useAccessories } from '@/hooks/useRepairs';
import { formatPrice } from '@/lib/format';

export function AccessoriesPage() {
  const [category, setCategory] = useState('Tous');
  const { accessories, loading } = useAccessories(category);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    accessories.forEach((a) => cats.add(a.category));
    return ['Tous', ...Array.from(cats)];
  }, [accessories]);

  // Since useAccessories filters by category, we need all for the category list
  const { accessories: allAccessories } = useAccessories();
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    allAccessories.forEach((a) => cats.add(a.category));
    return ['Tous', ...Array.from(cats)];
  }, [allAccessories]);

  return (
    <div className="animate-fade-in">
      <div className="border-b border-cream-dark bg-cream">
        <div className="container-app py-8">
          <nav className="mb-4 flex items-center gap-1 text-xs text-ink-soft">
            <Link to="/" className="hover:text-gold">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink">Accessoires</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Accessoires</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Chargeurs, câbles, coques, protections d'écran, power banks et plus encore
          </p>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-ink text-white'
                  : 'border border-cream-dark bg-white text-ink-soft hover:border-gold hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

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
        ) : accessories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cream-dark bg-white p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-ink-soft/40" />
            <p className="mt-4 text-sm font-medium text-ink">Aucun accessoire dans cette catégorie</p>
            <p className="mt-1 text-sm text-ink-soft">
              L'administrateur peut ajouter des accessoires depuis le tableau de bord.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {accessories.map((acc) => (
              <div key={acc.id} className="card card-hover group p-5">
                <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-cream transition-colors group-hover:bg-gold-50">
                  {acc.image_url ? (
                    <img
                      src={acc.image_url}
                      alt={acc.name}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <Smartphone className="h-12 w-12 text-ink-soft/30 transition-colors group-hover:text-gold/50" />
                  )}
                </div>
                <p className="text-xs font-medium text-gold">{acc.category}</p>
                <h3 className="mt-1 text-sm font-semibold text-ink line-clamp-2">{acc.name}</h3>
                {acc.description && (
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft line-clamp-2">
                    {acc.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-base font-bold text-ink">{formatPrice(acc.price)}</p>
                  {acc.stock > 0 ? (
                    <span className="badge bg-green-50 text-green-600">En stock</span>
                  ) : (
                    <span className="badge bg-red-50 text-red-600">Rupture</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-xl border border-cream-dark bg-cream p-4 text-center text-xs text-ink-soft">
          Les prix affichés sont des données de démonstration. Contactez-nous sur WhatsApp pour
          commander un accessoire.
        </div>
      </div>
    </div>
  );
                           }
      
