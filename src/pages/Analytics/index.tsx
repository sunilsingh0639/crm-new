import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, Users, MousePointer, DollarSign } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { revenueData, userGrowthData, categoryData, expenseCategoryData, trafficData, conversionData } from '../../data/mockData';
import { formatCurrency, formatNumber, downloadCSV } from '../../utils/helpers';
import type { DateRange } from '../../types';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="text-secondary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value > 1000 ? formatCurrency(p.value) : p.value}</p>
      ))}
    </div>
  );
};

const kpis = [
  { label: 'Total Revenue', value: '$1.68M', change: '+22.4%', icon: DollarSign, color: 'text-violet-400' },
  { label: 'Total Users', value: '5,200', change: '+333%', icon: Users, color: 'text-blue-400' },
  { label: 'Avg Conversion', value: '4.3%', change: '+1.1%', icon: MousePointer, color: 'text-emerald-400' },
  { label: 'Revenue Growth', value: '22.4%', change: '+5.2%', icon: TrendingUp, color: 'text-amber-400' },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>('1y');
  const chartData = revenueData[dateRange as keyof typeof revenueData] ?? revenueData['1y'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Analytics</h1>
          <p className="text-secondary text-sm mt-1">Comprehensive performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 glass rounded-xl p-1">
            {(['7d', '30d', '90d', '1y'] as DateRange[]).map((r) => (
              <button key={r} onClick={() => setDateRange(r)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${dateRange === r ? 'bg-violet-500/20 text-violet-400' : 'text-muted hover:text-secondary'}`}>{r}</button>
            ))}
          </div>
          <button onClick={() => downloadCSV(chartData as unknown as Record<string, unknown>[], 'revenue-analytics')} className="btn-glass gap-2">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card glass-hover">
            <k.icon size={20} className={`${k.color} mb-3`} />
            <p className="text-2xl font-bold text-primary">{k.value}</p>
            <p className="text-xs text-muted mt-0.5">{k.label}</p>
            <p className="text-xs text-emerald-400 mt-1">{k.change} YoY</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Expenses */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-primary">Revenue Analytics</h2>
            <button onClick={() => downloadCSV(chartData as unknown as Record<string, unknown>[], 'revenue')} className="btn-glass text-xs gap-1"><Download size={12} />CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="aRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${formatNumber(v)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#aRevGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="none" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-primary">User Growth</h2>
            <button onClick={() => downloadCSV(userGrowthData as unknown as Record<string, unknown>[], 'user-growth')} className="btn-glass text-xs gap-1"><Download size={12} />CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="newUsers" name="New Users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="churn" name="Churn" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Traffic & Conversion */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-primary">Traffic Analytics</h2>
            <button onClick={() => downloadCSV(trafficData as unknown as Record<string, unknown>[], 'traffic')} className="btn-glass text-xs gap-1"><Download size={12} />CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="organic" name="Organic" fill="#8b5cf6" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="paid" name="Paid" fill="#3b82f6" radius={[0, 0, 0, 0]} stackId="a" />
              <Bar dataKey="referral" name="Referral" fill="#06b6d4" radius={[0, 0, 0, 0]} stackId="a" />
              <Bar dataKey="direct" name="Direct" fill="#10b981" radius={[0, 0, 4, 4]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-primary">Conversion Rate</h2>
            <button onClick={() => downloadCSV(conversionData as unknown as Record<string, unknown>[], 'conversion')} className="btn-glass text-xs gap-1"><Download size={12} />CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="rate" name="Conversion %" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[{ title: 'Revenue by Category', data: categoryData }, { title: 'Expense Breakdown', data: expenseCategoryData }].map(({ title, data }, idx) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + idx * 0.05 }} className="glass-card">
            <h2 className="font-semibold text-primary mb-4">{title}</h2>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {data.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                      <span className="text-secondary">{c.name}</span>
                    </div>
                    <span className="text-primary font-medium">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
