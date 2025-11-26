import React from 'react';
import { Subscription } from '../types';
import { SpendingChart } from './SpendingChart';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

interface InsightsProps {
  subscriptions: Subscription[];
}

export const Insights: React.FC<InsightsProps> = ({ subscriptions }) => {
  const activeSubs = subscriptions.filter(s => s.status === 'Active' || s.status === 'Expiring Soon');
  const monthlySpend = activeSubs.reduce((acc, curr) => acc + curr.cost, 0);
  const trialSubs = activeSubs.filter(s => s.isTrial);
  const trialSavings = trialSubs.reduce((acc, curr) => acc + curr.cost, 0);
  
  // Find highest category
  const categories: Record<string, number> = {};
  activeSubs.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + s.cost;
  });
  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-slate-500 font-medium">Monthly Burn</h3>
            </div>
            <div className="text-3xl font-bold text-slate-800">${monthlySpend.toFixed(2)}</div>
            <div className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                <span>2% less than last month</span>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-slate-500 font-medium">At Risk (Trials)</h3>
            </div>
            <div className="text-3xl font-bold text-slate-800">${trialSavings.toFixed(2)}</div>
            <div className="mt-2 text-sm text-slate-400">
                Potential savings if cancelled
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-slate-500 font-medium">Top Category</h3>
            </div>
            <div className="text-3xl font-bold text-slate-800">{topCategory ? topCategory[0] : 'N/A'}</div>
            <div className="mt-2 text-sm text-slate-400">
                ${topCategory ? topCategory[1].toFixed(2) : '0.00'} / month
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart subscriptions={subscriptions} />
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Savings Opportunities</h3>
            <div className="space-y-4">
                {trialSubs.length > 0 ? (
                    trialSubs.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg">
                                    🎁
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-800">{sub.name}</div>
                                    <div className="text-sm text-amber-700">Ends {new Date(sub.nextRenewalDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-slate-800">${sub.cost}</div>
                                <div className="text-xs text-slate-500">Save this</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        No active free trials found. You're doing great!
                    </div>
                )}
                
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 opacity-60">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg">
                        📺
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-slate-800">Streaming Bundle</div>
                        <div className="text-sm text-slate-500">Combine services to save $5/mo</div>
                    </div>
                    <button className="text-sm font-medium text-indigo-600" disabled>Coming Soon</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};