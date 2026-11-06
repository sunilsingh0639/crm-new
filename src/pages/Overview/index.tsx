import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, FolderKanban, Target, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStore } from '../../store/useStore';
import { revenueData, categoryData } from '../../data/mockData';
import { formatCurrency, formatNumber, formatDate } from '../../utils/helpers';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Avatar } from '../../components/common/Avatar';
import type { DateRange } from '../../types';

const statCards = [
  { label: 'Total Revenue', value: '$284,500', change: '+18.2%', up: true, icon: DollarSign, color: 'from-violet-500 to-purple-600', sparkline: [40, 55, 48, 62, 58, 72, 68, 84] },
  { label: 'Total Users', value: '5,200', change: '+12.5%', up: true, icon: Users, color: 'from-blue-500 to-cyan-600', sparkline: [30, 38, 42, 50, 55, 62, 70, 78] },
  { label: 'Active Projects', value: '12', change: '+3', up: true, icon: FolderKanban, color: 'from-emerald-500 to-teal-600', sparkline: [8, 9, 10, 9, 11, 10, 12, 12] },
  { label: 'Conversion Rate', value: '5.2%', change: '+0.8%', up: true, icon: Target, color: 'from-orange-500 to-amber-600', sparkline: [3.2, 3.8, 4.1, 4.5, 4.8, 5.0, 5.1, 5.2] },
];

const activities = [
  { user: 'Sarah Johnson', action: 'added a new contact', time: '5m ago', type: 'contact' },
  { user: 'Marcus Chen', action: 'completed task: API Documentation', time: '23m ago', type: 'task' },
  { user: 'Jordan Lee', action: 'updated project: Mobile App Launch', time: '1h ago', type: 'project' },
  { user: 'Maya Patel', action: 'submitted invoice #INV-2024-089', time: '2h ago', type: 'finance' },
  { user: 'Alex Morgan', action: 'deployed Nuvora Platform v2.0 build', time: '3h ago', type: 'deploy' },
];

function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={pts} fill="none" stroke={up ? '#10b981' : '#ef4444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="text-secondary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {formatCurrency(p.value)}</p>
      ))}
    </div>
  );
};

export default function Overview() {
  const { projects, transactions } = useStore();
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const chartData = revenueData[dateRange as keyof typeof revenueData] ?? revenueData['30d'];
  const today = new Date();

  const topProjects = projects.filter((p) => p.status !== 'completed').slice(0, 4);
  const recentTx = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Good Morning, <span className="accent-gradient">Alex</span> 👋
          </h1>
          <p className="text-secondary text-sm mt-1">Here's what's happening with your workspace today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          <div className="flex gap-1 glass rounded-xl p-1">
            {(['7d', '30d', '90d', '1y'] as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${dateRange === r ? 'bg-violet-500/20 text-violet-400' : 'text-muted hover:text-secondary'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card glass-hover"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon size={18} className="text-white" />
              </div>
              <MiniSparkline data={card.sparkline} up={card.up} />
            </div>
            <p className="text-2xl font-bold text-primary">{card.value}</p>
            <p className="text-sm text-muted mt-0.5">{card.label}</p>
            <div className="flex items-center gap-1 mt-2">
              {card.up ? <TrendingUp size={13} className="text-emerald-400" /> : <TrendingDown size={13} className="text-red-400" />}
              <span className={`text-xs font-medium ${card.up ? 'text-emerald-400' : 'text-red-400'}`}>{card.change}</span>
              <span className="text-xs text-muted">vs last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-primary">Revenue Overview</h2>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-violet-400 inline-block rounded" />Revenue</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-400 inline-block rounded" />Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${formatNumber(v)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#3b82f6" strokeWidth={2} fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card">
          <h2 className="font-semibold text-primary mb-4">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-secondary">{c.name}</span>
                </div>
                <span className="text-primary font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Project Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
          <h2 className="font-semibold text-primary mb-4">Project Performance</h2>
          <div className="space-y-4">
            {topProjects.map((p) => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-primary truncate flex-1 mr-2">{p.name}</span>
                  <span className="text-xs text-muted">{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} size="sm" />
                <div className="flex items-center justify-between mt-1">
                  <Badge label={p.status} status={p.status} />
                  <span className="text-xs text-muted">{formatDate(p.dueDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card">
          <h2 className="font-semibold text-primary mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  <ArrowUpRight size={14} className={tx.type === 'income' ? 'text-emerald-400' : 'text-red-400 rotate-180'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary truncate">{tx.name}</p>
                  <p className="text-xs text-muted">{tx.category}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  <Badge label={tx.status} status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card">
          <h2 className="font-semibold text-primary mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-3">
                <Avatar name={a.user} size="sm" className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-primary"><span className="font-medium">{a.user}</span> {a.action}</p>
                  <p className="text-xs text-muted mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Projects Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card">
        <h2 className="font-semibold text-primary mb-4">Top Performing Projects</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Project', 'Owner', 'Progress', 'Revenue', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs text-muted font-medium pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.slice(0, 5).map((p) => {
                const owner = useStore.getState().teamMembers.find((m) => p.team.includes(m.id));
                return (
                  <tr key={p.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4 font-medium text-primary">{p.name}</td>
                    <td className="py-3 pr-4">
                      {owner && (
                        <div className="flex items-center gap-2">
                          <Avatar name={owner.name} size="xs" />
                          <span className="text-secondary text-xs">{owner.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 w-32">
                      <ProgressBar value={p.progress} size="sm" showLabel />
                    </td>
                    <td className="py-3 pr-4 text-emerald-400 font-medium">{p.revenue ? formatCurrency(p.revenue) : '—'}</td>
                    <td className="py-3"><Badge label={p.status} status={p.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
