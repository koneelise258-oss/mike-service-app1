export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  display_order: number;
  created_at: string;
}

export interface PhoneModel {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  popular: boolean;
  display_order: number;
  created_at: string;
  brand?: Brand;
}

export interface RepairService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  created_at: string;
}

export interface RepairOption {
  id: string;
  phone_model_id: string;
  repair_service_id: string;
  quality_tier: string;
  price: number | null;
  min_price: number | null;
  negotiable: boolean;
  stock: number;
  description: string | null;
  image_url: string | null;
  warranty: string | null;
  available: boolean;
  requires_diagnosis: boolean;
  display_order: number;
  created_at: string;
  repair_service?: RepairService;
}

export interface Accessory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price: number;
  stock: number;
  available: boolean;
  category: string;
  display_order: number;
  created_at: string;
}

export interface Settings {
  id: number;
  company_name: string;
  whatsapp_number: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  updated_at: string;
}

export interface RepairRequest {
  id: string;
  reference: string;
  first_name: string | null;
  last_name: string | null;
  whatsapp_number: string | null;
  phone_model_id: string | null;
  repair_service_id: string | null;
  repair_option_id: string | null;
  quality_tier: string | null;
  problem_description: string | null;
  comment: string | null;
  payment_method: string | null;
  negotiated_price: number | null;
  status: string;
  created_at: string;
  phone_model?: PhoneModel;
  repair_service?: RepairService;
  repair_option?: RepairOption;
}

export type RequestStatus =
  | 'pending'
  | 'quote_sent'
  | 'accepted'
  | 'refused'
  | 'in_repair'
  | 'completed'
  | 'cancelled';

export const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  quote_sent: 'Devis envoyé',
  accepted: 'Accepté',
  refused: 'Refusé',
  in_repair: 'En réparation',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  quote_sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  refused: 'bg-red-100 text-red-800',
  in_repair: 'bg-purple-100 text-purple-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-gray-100 text-gray-800',
};
  
