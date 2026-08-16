import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Smartphone,
  ChevronRight,
  MessageCircle,
  Check,
  X,
  AlertCircle,
  Wrench,
  Send,
  ArrowLeft,
} from 'lucide-react';
import { usePhoneModel } from '@/hooks/useCatalog';
import { useRepairOptions } from '@/hooks/useRepairs';
import { useSettings } from '@/hooks/useSettings';
import { formatPrice } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { RepairOption } from '@/types';

export function PhoneDetailPage() {
  const { brandSlug = '', modelSlug = '' } = useParams();
  const { model, loading } = usePhoneModel(brandSlug, modelSlug);
  const { options, loading: optionsLoading } = useRepairOptions(model?.id);
  const { settings } = useSettings();

  const [selectedOption, setSelectedOption] = useState<RepairOption | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    whatsapp_number: '',
    problem_description: '',
    comment: '',
    payment_method: 'espèces',
  });

  if (loading) {
    return (
      <div className="container-app py-20">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-cream" />
          <div className="mt-6 h-48 rounded-2xl bg-cream" />
          <div className="mt-4 h-32 rounded-2xl bg-cream" />
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="container-app py-20 text-center">
        <Smartphone className="mx-auto h-12 w-12 text-ink-soft/40" />
        <h1 className="mt-4 text-xl font-semibold text-ink">Modèle introuvable</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Ce téléphone n'existe pas dans notre catalogue.
        </p>
        <Link to="/catalogue" className="btn-gold mt-6">
          <ArrowLeft className="h-4 w-4" />
          Retour au catalogue
        </Link>
      </div>
    );
  }

  // Group options by repair service
  const groupedOptions: Record<string, RepairOption[]> = {};
  options.forEach((opt) => {
    const key = opt.repair_service?.name || 'Autre';
    if (!groupedOptions[key]) groupedOptions[key] = [];
    groupedOptions[key].push(opt);
  });

  const handleSelect = (opt: RepairOption) => {
    setSelectedOption(opt);
    setShowForm(true);
    setSubmittedRef(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const { data, error } = await supabase
        .from('repair_requests')
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          whatsapp_number: formData.whatsapp_number,
          phone_model_id: model.id,
          repair_service_id: selectedOption?.repair_service_id,
          repair_option_id: selectedOption?.id,
          quality_tier: selectedOption?.quality_tier || null,
          problem_description: formData.problem_description,
          comment: formData.comment,
          payment_method: formData.payment_method,
          negotiated_price: selectedOption?.price ?? null,
          status: 'pending',
        })
        .select('reference')
        .single();

      if (error) throw error;
      setSubmittedRef(data.reference);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  const generateWhatsAppMessage = (ref: string) => {
    const lines = [
      'MIKE SERVICE CI — NOUVELLE DEMANDE',
      `Référence : ${ref}`,
      `Client : ${formData.first_name} ${formData.last_name}`,
      `Téléphone : ${model.brand?.name} ${model.name}`,
      `Service : ${selectedOption?.repair_service?.name || ''}`,
    ];
    if (selectedOption?.quality_tier) {
      lines.push(`Qualité : ${selectedOption.quality_tier}`);
    }
    if (selectedOption?.price) {
      lines.push(`Prix : ${formatPrice(selectedOption.price)}`);
    }
    lines.push(`Paiement : ${formData.payment_method}`);
    if (formData.problem_description) {
      lines.push(`Problème : ${formData.problem_description}`);
    }
    return encodeURIComponent(lines.join('\n'));
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="border-b border-cream-dark bg-cream">
        <div className="container-app py-6">
          <nav className="mb-4 flex items-center gap-1 text-xs text-ink-soft">
            <Link to="/" className="hover:text-gold">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/catalogue" className="hover:text-gold">Catalogue</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink">{model.name}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Smartphone className="h-16 w-16 text-ink-soft/30" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gold">{model.brand?.name}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {model.name}
              </h1>
              {model.description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  {model.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Repair options */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink">Réparations disponibles</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Sélectionnez une réparation pour demander un devis. Les prix affichés sont des données de
            démonstration.
          </p>
        </div>

        {optionsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card animate-pulse p-6">
                <div className="h-5 w-1/3 rounded bg-cream" />
                <div className="mt-3 h-16 rounded bg-cream" />
              </div>
            ))}
          </div>
        ) : options.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cream-dark bg-white p-12 text-center">
            <Wrench className="mx-auto h-10 w-10 text-ink-soft/40" />
            <p className="mt-3 text-sm font-medium text-ink">
              Aucune réparation configurée pour ce modèle
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              L'administrateur peut ajouter des réparations depuis le tableau de bord.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedOptions).map(([serviceName, opts]) => (
              <div key={serviceName} className="card overflow-hidden">
                <div className="border-b border-cream-dark bg-cream/50 px-5 py-3">
                  <h3 className="text-sm font-semibold text-ink">{serviceName}</h3>
                </div>
                <div className="divide-y divide-cream-dark">
                  {opts.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {opt.quality_tier && (
                            <span className="rounded-md bg-gold-50 px-2 py-0.5 text-xs font-semibold text-gold-dark">
                              {opt.quality_tier}
                            </span>
                          )}
                          {opt.requires_diagnosis && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                              <AlertCircle className="h-3 w-3" />
                              Diagnostic requis
                            </span>
                          )}
                          {!opt.available && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                              <X className="h-3 w-3" />
                              Indisponible
                            </span>
                          )}
                          {opt.warranty && (
                            <span className="text-xs text-ink-soft">
                              Garantie : {opt.warranty}
                            </span>
                          )}
                        </div>
                        {opt.description && (
                          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                            {opt.description}
                          </p>
                        )}
                        {opt.negotiable && !opt.requires_diagnosis && (
                          <p className="mt-1 text-xs font-medium text-green-600">
                            Prix négociable
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {opt.requires_diagnosis ? (
                            <p className="text-sm font-semibold text-blue-600">
                              Prix sur devis
                            </p>
                          ) : opt.price ? (
                            <p className="text-lg font-bold text-ink">
                              {formatPrice(opt.price)}
                            </p>
                          ) : (
                            <p className="text-sm text-ink-soft">Prix non défini</p>
                          )}
                        </div>
                        {opt.available && (
                          <button
                            onClick={() => handleSelect(opt)}
                            className="shrink-0 rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gold-dark"
                          >
                            Demander
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request modal */}
      {showForm && selectedOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => !submittedRef && setShowForm(false)}
          />
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scale-in">
            {submittedRef ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-ink">Demande envoyée !</h2>
                <p className="mt-2 text-sm text-ink-soft">
                  Votre demande a été enregistrée avec la référence :
                </p>
                <p className="mt-2 text-lg font-bold text-gold">{submittedRef}</p>
                <div className="mt-4 rounded-xl border border-cream-dark bg-cream p-4 text-left text-xs text-ink-soft">
                  <p className="font-semibold text-ink">Statut : EN ATTENTE DE VALIDATION</p>
                  <p className="mt-1">
                    Ce document est un devis provisoire. Le reçu final vous sera remis après
                    réparation.
                  </p>
                </div>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <a
                    href={`https://wa.me/${settings?.whatsapp_number?.replace(/[^0-9]/g, '') || ''}?text=${generateWhatsAppMessage(submittedRef)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Envoyer sur WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setSubmittedRef(null);
                      setSelectedOption(null);
                    }}
                    className="btn-outline"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-ink">Demande de réparation</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-lg p-1.5 text-ink-soft hover:bg-cream"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Summary */}
                <div className="mb-5 rounded-xl border border-cream-dark bg-cream p-4">
                  <p className="text-xs font-medium text-ink-soft">Téléphone</p>
                  <p className="text-sm font-semibold text-ink">
                    {model.brand?.name} {model.name}
                  </p>
                  <p className="mt-2 text-xs font-medium text-ink-soft">Service</p>
                  <p className="text-sm font-semibold text-ink">
                    {selectedOption.repair_service?.name}
                    {selectedOption.quality_tier && ` — ${selectedOption.quality_tier}`}
                  </p>
                  <p className="mt-2 text-xs font-medium text-ink-soft">Prix</p>
                  <p className="text-sm font-bold text-gold">
                    {selectedOption.requires_diagnosis
                      ? 'Diagnostic nécessaire — Prix sur devis'
                      : formatPrice(selectedOption.price)}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label-field">Prénom</label>
                      <input
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="input-field"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label className="label-field">Nom</label>
                      <input
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="input-field"
                        placeholder="Konan"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-field">Numéro WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp_number}
                      onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                      className="input-field"
                      placeholder="+225 07 00 00 00 00"
                    />
                  </div>
                  <div>
                    <label className="label-field">Problème rencontré</label>
                    <textarea
                      value={formData.problem_description}
                      onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                      className="input-field min-h-[80px] resize-y"
                      placeholder="Décrivez le problème..."
                    />
                  </div>
                  <div>
                    <label className="label-field">Commentaire (optionnel)</label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="input-field min-h-[60px] resize-y"
                      placeholder="Informations supplémentaires..."
                    />
                  </div>
                  <div>
                    <label className="label-field">Mode de paiement souhaité</label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="input-field"
                    >
                      <option value="espèces">Espèces</option>
                      <option value="dépôt / virement">Dépôt / Virement</option>
                    </select>
                  </div>

                  {formError && (
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full disabled:opacity-50"
                  >
                    {submitting ? (
                      'Envoi en cours...'
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Envoyer ma demande
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
