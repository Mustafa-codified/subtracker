import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Subscription, SpendingCategory } from '../types';

interface SpendingChartProps {
  subscriptions: Subscription[];
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export const SpendingChart: React.FC<SpendingChartProps> = ({ subscriptions }) => {
  
  // Aggregate data by category
  const data = React.useMemo(() => {
    const categoryMap: Record<string, number> = {};
    subscriptions.forEach(sub => {
      if (sub.status !== 'Canceled') {
        const cat = sub.category || 'Other';
        categoryMap[cat] = (categoryMap[cat] || 0) + sub.cost;
      }
    });

    return Object.keys(categoryMap).map((name, index) => ({
      name,
      value: parseFloat(categoryMap[name].toFixed(2)),
      color: COLORS[index % COLORS.length]
    }));
  }, [subscriptions]);

  if (data.length === 0) {
    return (
        <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No active spending data
        </div>
    );
  }

  return (
    <div className="w-full h-80 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Spending by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value}`, 'Cost']}
            contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
