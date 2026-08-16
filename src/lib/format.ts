export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return 'Prix sur devis';
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

export function formatPriceShort(price: number | null | undefined): string {
  if (price === null || price === undefined) return 'Sur devis';
  return new Intl.NumberFormat('fr-FR').format(price) + ' F';
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
