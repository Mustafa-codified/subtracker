export interface Subscription {
  id: string;
  name: string;
  cost: number;
  currency: string;
  billingCycle: 'Monthly' | 'Yearly' | 'Weekly';
  nextRenewalDate: string; // ISO Date string
  category: string;
  isTrial: boolean;
  status: 'Active' | 'Canceled' | 'Expiring Soon';
  logoUrl?: string;
}

export interface SpendingCategory {
  name: string;
  value: number;
  color: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SCANNER = 'SCANNER',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  INSIGHTS = 'INSIGHTS',
  SETTINGS = 'SETTINGS'
}