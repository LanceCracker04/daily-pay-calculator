
import { UserSettings } from './types';

export const DEFAULT_SETTINGS: UserSettings = {
  currency: '$',
  taxPercent: 15,
  savingsTargetPercent: 20,
  dailyGoal: 150,
  theme: 'light',
};

export const LOCAL_STORAGE_ENTRIES_KEY = 'daily_pay_entries';
export const LOCAL_STORAGE_SETTINGS_KEY = 'daily_pay_settings';
