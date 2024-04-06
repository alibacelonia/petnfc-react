export type FeeInfo = {
    display_name: string;
    currency: string;
    fee_type: string;
    enabled: boolean;
    created_by: null;
    updated_by: null;
    id: string;
    amount: number;
    operation: string;
    created_at: string;
    updated_at: string;
}

export type LocationData = {
  country_code: string;
  country_name: string;
  city: string | null;
  postal: string | null;
  latitude: number;
  longitude: number;
  IPv4: string;
  state: string | null;
};