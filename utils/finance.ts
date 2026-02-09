
import { EarningEntry, UserSettings } from '../types';

export const calculateNet = (gross: number, expenses: number, feePercent: number): number => {
  const fee = (gross * feePercent) / 100;
  return gross - expenses - fee;
};

export const getStatistics = (entries: EarningEntry[], settings: UserSettings) => {
  if (entries.length === 0) {
    return {
      totalNet: 0,
      avgDailyNet: 0,
      monthlyProjection: 0,
      burnRate: 0,
      savingsTarget: 0,
      healthScore: 0,
    };
  }

  const totalNet = entries.reduce((acc, curr) => acc + curr.net, 0);
  const avgDailyNet = totalNet / entries.length;
  const monthlyProjection = avgDailyNet * 30;
  
  const totalGross = entries.reduce((acc, curr) => acc + curr.gross, 0);
  const totalExpenses = entries.reduce((acc, curr) => acc + curr.expenses, 0);
  const burnRate = totalGross > 0 ? (totalExpenses / totalGross) * 100 : 0;
  
  const savingsTarget = (totalNet * settings.savingsTargetPercent) / 100;
  
  // Simple health score formula
  // Based on meeting daily goal and having low expenses
  const goalAchievement = Math.min(100, (avgDailyNet / settings.dailyGoal) * 100);
  const efficiency = Math.max(0, 100 - burnRate);
  const healthScore = Math.round((goalAchievement * 0.7) + (efficiency * 0.3));

  return {
    totalNet,
    avgDailyNet,
    monthlyProjection,
    burnRate,
    savingsTarget,
    healthScore,
  };
};

export const formatCurrency = (val: number, symbol: string) => {
  return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
