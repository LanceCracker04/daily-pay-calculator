
export interface EarningEntry {
  id: string;
  date: string;
  gross: number;
  expenses: number;
  platformFeePercent: number;
  hoursWorked: number;
  net: number;
}

export interface UserSettings {
  currency: string;
  taxPercent: number;
  savingsTargetPercent: number;
  dailyGoal: number;
  theme: 'light' | 'dark';
}

export type View = 'dashboard' | 'add' | 'history' | 'settings';
