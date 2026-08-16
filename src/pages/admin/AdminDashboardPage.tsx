import { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Smartphone,
  Wrench,
  Package,
  Settings,
  ClipboardList,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { supabase } from '@/lib/supabase';
import { formatPrice, formatDateTime, slugify } from '@/lib/format';
import type { Brand, PhoneModel, RepairService, RepairOption, Accessory, Settings as SettingsType, RepairRequest } from '@/types';
import { STATUS_LABELS, STATUS_COLORS } from '@/types';

type Tab = 'overview' | 'brands' | 'models' | 'services' | 'options' | 'accessories' | 'requests' | 'settings';

export function AdminDashboardPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'brands', label: 'Marques', icon: Smartphone },
    { id: 'models', label: 'Modèles', icon: Smartphone },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'options', label: 'Tarification', icon: TrendingUp },
    { id: 'accessories', label: 'Accessoires', icon: Package },
    { id: 'requests', label: 'Demandes', icon: ClipboardList },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-cream-dark bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo showText={false} />
            <div>
              <p className="text-sm font-bold text-ink">Administration</p>
              <p className="text-xs text-ink-soft">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost hidden sm:flex"
            >
              Voir le site
            </button>
            <button
              onClick={async () => { await signOut(); navigate('/admin'); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-cream-dark bg-white p-4 lg:block">
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-gold-50 text-gold-dark'
                    : 'text-ink-soft hover:bg-cream hover:text-ink'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="flex overflow-x-auto border-b border-cream-dark bg-white lg:hidden scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'border-gold text-gold-dark'
                  : 'border-transparent text-ink-soft'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'brands' && <BrandsTab />}
          {tab === 'models' && <ModelsTab />}
          {tab === 'services' && <ServicesTab />}
          {tab === 'options' && <OptionsTab />}
          {tab === 'accessories' && <AccessoriesTab />}
          {tab === 'requests' && <RequestsTab />}
          {tab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

// ─── Overview ───────────────────────────────────────────────────────────────

function OverviewTab() {
  const [stats, setStats] = useState({ requests: 0, pending: 0, completed: 0, models: 0, accessories: 0 });
  const [recentRequests, setRecentRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [reqs, pending, completed, models, accs, recent] = await Promise.all([
        supabase.from('repair_requests').select('*', { count: 'exact', head: true }),
        supabase.from('repair_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('repair_requests').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('phone_models').select('*', { count: 'exact', head: true }),
        supabase.from('accessories').select('*', { count: 'exact', head: true }),
        supabase.from('repair_requests').select('*, phone_model:phone_models(*), repair_service:repair_services(*)').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        requests: reqs.count || 0,
        pending: pending.count || 0,
        completed: completed.count || 0,
        models: models.count || 0,
        accessories: accs.count || 0,
      });
      setRecentRequests((recent.data as RepairRequest[]) || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <DashboardLoading />;

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold text-ink">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total demandes" value={stats.requests} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={Clock} label="En attente" value={stats.pending} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={CheckCircle2} label="Terminées" value={stats.completed} color="text-green-600" bg="bg-green-50" />
        <StatCard icon={Smartphone} label="Modèles" value={stats.models} color="text-gold-dark" bg="bg-gold-50" />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-ink">Demandes récentes</h2>
        {recentRequests.length === 0 ? (
          <div className="card p-8 text-center text-sm text-ink-soft">
            Aucune demande pour le moment.
          </div>
        ) : (
          <div className="card divide-y divide-cream-dark">
            {recentRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{req.reference}</p>
                  <p className="text-xs text-ink-soft">
                    {req.first_name} {req.last_name} — {req.phone_model?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-ink-soft">{formatDateTime(req.created_at)}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[req.status] || 'bg-gray-100 text-gray-600'}`}>
                  {STATUS_LABELS[req.status] || req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string; bg: string }) {
  return (
    <div className="card p-5">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  );
}

// ─── Brands ──────────────────────────────────────────────────────────────────

function BrandsTab() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  const load = useCallback(async () => {
    const { data } = await supabase.from('brands').select('*').order('display_order', { ascending: true });
    setBrands((data as Brand[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!name.trim()) return;
    if (editing) {
      await supabase.from('brands').update({ name, slug: slugify(name), display_order: displayOrder }).eq('id', editing.id);
    } else {
      await supabase.from('brands').insert({ name, slug: slugify(name), display_order: displayOrder });
    }
    setShowForm(false);
    setEditing(null);
    setName('');
    setDisplayOrder(0);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette marque ? Tous les modèles associés seront aussi supprimés.')) return;
    await supabase.from('brands').delete().eq('id', id);
    load();
  };

  if (loading) return <DashboardLoading />;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Marques</h1>
        <button onClick={() => { setEditing(null); setName(''); setDisplayOrder(0); setShowForm(true); }} className="btn-gold">
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {showForm && (
        <div className="card mb-6 p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">{editing ? 'Modifier' : 'Nouvelle'} marque</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-field">Nom</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Tecno" />
            </div>
            <div>
              <label className="label-field">Ordre d'affichage</label>
              <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="input-field" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="btn-gold"><Save className="h-4 w-4" /> Enregistrer</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Annuler</button>
          </div>
        </div>
      )}

      <div className="card divide-y divide-cream-dark">
        {brands.map((b) => (
          <div key={b.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-ink">{b.name}</p>
              <p className="text-xs text-ink-soft">/{b.slug} — ordre: {b.display_order}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(b); setName(b.name); setDisplayOrder(b.display_order); setShowForm(true); }} className="rounded-lg p-2 text-ink-soft hover:bg-cream hover:text-gold">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(b.id)} className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Models ──────────────────────────────────────────────────────────────────

function ModelsTab() {
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PhoneModel | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', brand_id: '', description: '', popular: false, display_order: 0 });

  const load = useCallback(async () => {
    const [m, b] = await Promise.all([
      supabase.from('phone_models').select('*, brand:brands(*)').order('display_order', { ascending: true }),
      supabase.from('brands').select('*').order('name'),
    ]);
    setModels((m.data as PhoneModel[]) || []);
    setBrands((b.data as Brand[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name || !form.brand_id) return;
    const payload = { ...form, slug: slugify(form.name) };
    if (editing) {
      await supabase.from('phone_models').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('phone_models').insert(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', brand_id: '', description: '', popular: false, display_order: 0 });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce modèle ?')) return;
    await supabase.from('phone_models').delete().eq('id', id);
    load();
  };

  if (loading) return <DashboardLoading />;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Modèles de téléphones</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', brand_id: brands[0]?.id || '', description: '', popular: false, display_order: 0 }); setShowForm(true); }} className="btn-gold">
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {showForm && (
        <div className="card mb-6 p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">{editing ? 'Modifier' : 'Nouveau'} modèle</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-field">Nom</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Spark 40" />
            </div>
            <div>
              <label className="label-field">Marque</label>
              <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className="input-field">
                <option value="">Sélectionner...</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[60px]" />
            </div>
            <div>
              <label className="label-field">Ordre</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="input-field" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="h-4 w-4 rounded border-cream-dark" />
                Populaire (affiché sur l'accueil)
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="btn-gold"><Save className="h-4 w-4" /> Enregistrer</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Annuler</button>
          </div>
        </div>
      )}

      <div className="card divide-y divide-cream-dark">
        {models.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-ink">{m.brand?.name} {m.name}</p>
              <p className="text-xs text-ink-soft">/{m.slug} {m.popular && '— Populaire'}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(m); setForm({ name: m.name, brand_id: m.brand_id, description: m.description || '', popular: m.popular, display_order: m.display_order }); setShowForm(true); }} className="rounded-lg p-2 text-ink-soft hover:bg-cream hover:text-gold">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(m.id)} className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────

function ServicesTab() {
  const [services, setServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<RepairService | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', icon: 'wrench', display_order: 0 });

  const load = useCallback(async () => {
    const { data } = await supabase.from('repair_services').select('*').order('display_order', { ascending: true });
    setServices((data as RepairService[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name) return;
    const payload = { ...form, slug: slugify(form.name) };
    if (editing) {
      await supabase.from('repair_services').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('repair_services').insert(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', description: '', icon: 'wrench', display_order: 0 });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce service ?')) return;
    await supabase.from('repair_services').delete().eq('id', id);
    load();
  };

  if (loading) return <DashboardLoading />;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Services de réparation</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', description: '', icon: 'wrench', display_order: 0 }); setShowForm(true); }} className="btn-gold">
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

            {showForm && (
        <div className="card mb-6 p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">{editing ? 'Modifier' : 'Nouveau'} modèle</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-field">Nom</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Spark 40" />
            </div>
            <div>
              <label className="label-field">Marque</label>
              <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className="input-field">
                <option value="">Sélectionner...</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[60px]" />
            </div>
            <div>
              <label className="label-field">Ordre</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="input-field" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="h-4 w-4 rounded border-cream-dark" />
                Populaire (affiché sur l'accueil)
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="btn-gold"><Save className="h-4 w-4" /> Enregistrer</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Annuler</button>
          </div>
        </div>
      )}

      <div className="card divide-y divide-cream-dark">
        {models.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-ink">{m.brand?.name} {m.name}</p>
              <p className="text-xs text-ink-soft">/{m.slug} {m.popular && '— Populaire'}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(m); setForm({ name: m.name, brand_id: m.brand_id, description: m.description || '', popular: m.popular, display_order: m.display_order }); setShowForm(true); }} className="rounded-lg p-2 text-ink-soft hover:bg-cream hover:text-gold">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(m.id)} className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────

function ServicesTab() {
  const [services, setServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<RepairService | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', icon: 'wrench', display_order: 0 });

  const load = useCallback(async () => {
    const { data } = await supabase.from('repair_services').select('*').order('display_order', { ascending: true });
    setServices((data as RepairService[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name) return;
    const payload = { ...form, slug: slugify(form.name) };
    if (editing) {
      await supabase.from('repair_services').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('repair_services').insert(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', description: '', icon: 'wrench', display_order: 0 });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce service ?')) return;
    await supabase.from('repair_services').delete().eq('id', id);
    load();
  };

  if (loading) return <DashboardLoading />;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Services de réparation</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', description: '', icon: 'wrench', display_order: 0 }); setShowForm(true); }} className="btn-gold">
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {showForm && (
        <div className="card mb-6 p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">{editing ? 'Modifier' : 'Nouveau'} service</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-field">Nom</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Remplacement d'écran" />
            </div>
            <div>
              <label className="label-field">Icône (lucide-react)</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input-field" placeholder="screen, battery, plug..." />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[60px]" />
            </div>
            <div>
              <label className="label-field">Ordre</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="input-field" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="btn-gold"><Save className="h-4 w-4" /> Enregistrer</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Annuler</button>
          </div>
        </div>
      )}

      <div className="card divide-y divide-cream-dark">
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-ink">{s.name}</p>
              <p className="text-xs text-ink-soft">/{s.slug} — icône: {s.icon}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(s); setForm({ name: s.name, description: s.description || '', icon: s.icon || 'wrench', display_order: s.display_order }); setShowForm(true); }} className="rounded-lg p-2 text-ink-soft hover:bg-cream hover:text-gold">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(s.id)} className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Options (Tarification) ──────────────────────────────────────────────────

function OptionsTab() {
  const [options, setOptions] = useState<RepairOption[]>([]);
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [services, setServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<RepairOption | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterModel, setFilterModel] = useState<string>('');

  const [form, setForm] = useState({
    phone_model_id: '',
    repair_service_id: '',
    quality_tier: '',
    price: '' as string | number,
    min_price: '' as string | number,
    negotiable: false,
    stock: 0,
    warranty: '',
    available: true,
    requires_diagnosis: false,
    display_order: 0,
  });

  const load = useCallback(async () => {
    const [opts, m, s] = await Promise.all([
      supabase.from('repair_options').select('*, repair_service:repair_services(*), phone_model:phone_models(*)').order('display_order', { ascending: true }),
      supabase.from('phone_models').select('*, brand:brands(*)').order('name'),
      supabase.from('repair_services').select('*').order('name'),
    ]);
    setOptions((opts.data as RepairOption[]) || []);
    setModels((m.data as PhoneModel[]) || []);
    setServices((s.data as RepairService[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.phone_model_id || !form.repair_service_id) return;
    const payload = {
      phone_model_id: form.phone_model_id,
      repair_service_id: form.repair_service_id,
      quality_tier: form.quality_tier || '',
      price: form.requires_diagnosis ? null : (form.price === '' ? null : Number(form.price)),
      min_price: form.requires_diagnosis ? null : (form.min_price === '' ? null : Number(form.min_price)),
      negotiable: form.negotiable,
      stock: form.stock,
      warranty: form.warranty || null,
      available: form.available,
      requires_diagnosis: form.requires_diagnosis,
      display_order: form.display_order,
    };
    if (editing) {
      await supabase.from('repair_options').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('repair_options').insert(payload);
    }
    setShowForm(false);
    setEditing(null);
    load();
            </div>
      </div>
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
      }
                      </div>
      </div>
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}
