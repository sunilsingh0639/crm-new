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
  {
    label: 'Total Revenue', value: '$284,500', change: '+18.2%', up: true,
    icon: DollarSign,
    iconBg: 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(99,102,241,0.9))',
    iconGlow: 'rgba(139,92,246,0.45)',
    cardGlow: 'rgba(139,92,246,0.08)',
    sparkline: [40, 55, 48, 62, 58, 72, 68, 84],
  },
  {
    label: 'Total Users', value: '5,200', change: '+12.5%', up: true,
    icon: Users,
    iconBg: 'linear-gradient(135deg, rgba(6,182,212,0.9), rgba(59,130,246,0.9))',
    iconGlow: 'rgba(6,182,212,0.45)',
    cardGlow: 'rgba(6,182,212,0.07)',
    sparkline: [30, 38, 42, 50, 55, 62, 70, 78],
  },
  {
    label: 'Active Projects', value: '12', change: '+3', up: true,
    icon: FolderKanban,
    iconBg: 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(6,182,212,0.9))',
    iconGlow: 'rgba(16,185,129,0.45)',
    cardGlow: 'rgba(16,185,129,0.07)',
    sparkline: [8, 9, 10, 9, 11, 10, 12, 12],
  },
  {
    label: 'Conversion Rate', value: '5.2%', change: '+0.8%', up: true,
    icon: Target,
    iconBg: 'linear-gradient(135deg, rgba(245,158,11,0.9), rgba(249,115,22,0.9))',
    iconGlow: 'rgba(245,158,11,0.45)',
    cardGlow: 'rgba(245,158,11,0.07)',
    sparkline: [3.2, 3.8, 4.1, 4.5, 4.8, 5.0, 5.1, 5.2],
  },
];

const activities = [
  { user: 'Sarah Johnson',  action: 'added a new contact',                  time: '5m ago'  },
  { user: 'Marcus Chen',    action: 'completed task: API Documentation',     time: '23m ago' },
  { user: 'Jordan Lee',     action: 'updated project: Mobile App Launch',    time: '1h ago'  },
  { user: 'Maya Patel',     action: 'submitted invoice #INV-2024-089',       time: '2h ago'  },
  { user: 'Alex Morgan',    action: 'deployed Nuvora Platform v2.0 build',   time: '3h ago'  },
];

function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 72, h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
  const color = up ? '#10b981' : '#ef4444';
  return (
    <svg width={w} height={h}>
      <defs>
        <linearGradient id={`sg-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
    </svg>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10,8,30,0.92)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 14,
      padding: '10px 14px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.50)',
    }}>
      <p className="text-slate-400 text-xs mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs font-medium" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
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
    <div className="space-y-5">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good Morning,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #c4b5fd 0%, #a5b4fc 50%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Alex
            </span>{' '}
            👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening with your workspace today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden md:block">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <div
            className="flex gap-0.5 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            {(['7d', '30d', '90d', '1y'] as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  dateRange === r
                    ? 'text-violet-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                style={dateRange === r ? {
                  background: 'rgba(139,92,246,0.20)',
                  boxShadow: '0 0 12px rgba(139,92,246,0.20)',
                } : {}}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', damping: 24, stiffness: 200 }}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="relative overflow-hidden rounded-[20px] p-5 cursor-default"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.19), rgba(255,255,255,0.045) 48%, rgba(255,255,255,0.075))',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: `0 18px 45px rgba(0,0,0,0.30), 0 0 60px ${card.cardGlow}, inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(20,35,70,0.25)`,
            }}
          >
            {/* Top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            {/* Corner glow */}
            <div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${card.iconGlow} 0%, transparent 70%)`, filter: 'blur(12px)' }}
            />

            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: card.iconBg,
                  boxShadow: `0 4px 16px ${card.iconGlow}, inset 0 1px 0 rgba(255,255,255,0.25)`,
                  border: '1px solid rgba(255,255,255,0.18)',
                }}
              >
                <card.icon size={17} className="text-white" />
              </div>
              <MiniSparkline data={card.sparkline} up={card.up} />
            </div>

            <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{card.label}</p>

            <div className="flex items-center gap-1.5 mt-3">
              {card.up
                ? <TrendingUp size={12} className="text-emerald-400" />
                : <TrendingDown size={12} className="text-red-400" />
              }
              <span className={`text-xs font-semibold ${card.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {card.change}
              </span>
              <span className="text-xs text-slate-600">vs last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-white">Revenue Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">Income vs expenses comparison</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: '#8b5cf6' }} />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: '#3b82f6' }} />
                Expenses
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${formatNumber(v)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#3b82f6" strokeWidth={2} fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card"
        >
          <h2 className="font-semibold text-white mb-1">Revenue by Category</h2>
          <p className="text-xs text-slate-500 mb-4">Breakdown by source</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={46} outerRadius={68} paddingAngle={4} dataKey="value">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 6px ${entry.color}60)` }} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => `${v}%`}
                contentStyle={{
                  background: 'rgba(10,8,30,0.92)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  fontSize: 12,
                  backdropFilter: 'blur(24px)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color, boxShadow: `0 0 6px ${c.color}80` }} />
                  <span className="text-slate-400">{c.name}</span>
                </div>
                <span className="text-white font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Project Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
          <h2 className="font-semibold text-white mb-4">Project Performance</h2>
          <div className="space-y-4">
            {topProjects.map((p) => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-300 truncate flex-1 mr-2">{p.name}</span>
                  <span className="text-xs text-slate-500 tabular-nums">{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} size="sm" />
                <div className="flex items-center justify-between mt-1.5">
                  <Badge label={p.status} status={p.status} />
                  <span className="text-xs text-slate-600">{formatDate(p.dueDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card">
          <h2 className="font-semibold text-white mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: tx.type === 'income' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    border: `1px solid ${tx.type === 'income' ? 'rgba(16,185,129,0.20)' : 'rgba(239,68,68,0.20)'}`,
                  }}
                >
                  <ArrowUpRight size={13} className={tx.type === 'income' ? 'text-emerald-400' : 'text-red-400 rotate-180'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{tx.name}</p>
                  <p className="text-xs text-slate-600">{tx.category}</p>
                </div>
                <div className="text-right shrink-0">
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
          <h2 className="font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-3">
                <Avatar name={a.user} size="sm" className="shrink-0 mt-0.5 ring-2 ring-white/10" />
                <div>
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-white">{a.user}</span>{' '}{a.action}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Top Projects Table ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card">
        <h2 className="font-semibold text-white mb-4">Top Performing Projects</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Project', 'Owner', 'Progress', 'Revenue', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 font-medium pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 5).map((p) => {
                const owner = useStore.getState().teamMembers.find((m) => p.team.includes(m.id));
                return (
                  <tr
                    key={p.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="py-3 pr-4 font-medium text-slate-200">{p.name}</td>
                    <td className="py-3 pr-4">
                      {owner && (
                        <div className="flex items-center gap-2">
                          <Avatar name={owner.name} size="xs" />
                          <span className="text-slate-400 text-xs">{owner.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 w-32">
                      <ProgressBar value={p.progress} size="sm" showLabel />
                    </td>
                    <td className="py-3 pr-4 text-emerald-400 font-semibold">
                      {p.revenue ? formatCurrency(p.revenue) : '—'}
                    </td>
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
