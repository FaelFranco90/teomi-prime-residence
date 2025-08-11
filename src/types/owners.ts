
export interface Owner {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyOwnerLink {
  property_id: string;
  owner_id: string;
  ownership_percent: number | null;
  created_at: string;
  updated_at: string;
}

export interface SelectedOwner {
  owner: Owner;
  ownership_percent: number | null;
}
