import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, TrendingUp, Users, FolderKanban, DollarSign, UserCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../../store/useStore';
import { formatCurrency, downloadCSV } from '../../utils/helpers';
import { revenueData, userGrowthData } from '../../data/mockData';

const reportCategories = [
  { id: 'revenue', label: 'Revenue Reports', icon: TrendingUp, color: 'from-violet-500 to-purple-600' },
  { id: 'finance', label: 'Finance Reports', icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
  { id: 'projects', label: 'Project Reports', icon: FolderKanban, color: 'from-blue-500 to-cyan-600' },
  { id: 'crm', label: 'CRM Reports', icon: Users, color: 'from-orange-500 to-amber-600' },
  { id: 'team', label: 'Team Reports', icon: UserCircle, color: 'from-pink-500 to-rose-600' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="text-secondary mb-1">{label}</p>
      {payload.map((p) => <p key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value > 100 ? formatCurrency(p.value) : p.value}</p>)}
    </div>
  );
};

export default function Reports() {
  const { projects, contacts, transactions, teamMembers } = useStore();
  const [activeReport, setActiveReport] = useState('revenue');

  const revenueReport = revenueData['1y'];
  const totalRevenue = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const projectReport = projects.map((p) => ({ name: p.name.slice(0, 15), progress: p.progress, budget: p.budget }));
  const crmReport = contacts.map((c) => ({ name: c.name, company: c.company, status: c.status, source: c.source }));
  const teamReport = teamMembers.map((m) => ({ name: m.name, role: m.role, department: m.department, status: m.status }));
  const financeReport = transactions.map((t) => ({ name: t.name, amount: t.amount, type: t.type, category: t.category, date: t.date, status: t.status }));

  const handleDownload = () => {
    const dataMap: Record<string, Record<string, unknown>[]> = {
      revenue: revenueReport as unknown as Record<string, unknown>[],
      finance: financeReport as unknown as Record<string, unknown>[],
      projects: projectReport as unknown as Record<string, unknown>[],
      crm: crmReport as unknown as Record<string, unknown>[],
      team: teamReport as unknown as Record<string, unknown>[],
    };
    downloadCSV(dataMap[activeReport], `${activeReport}-report`);
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Reports</h1>
          <p className="text-secondary text-sm mt-1">Generate and export business reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-glass gap-2"><Printer size={14} />Print</button>
          <button onClick={handleDownload} className="btn-primary gap-2"><Download size={14} />Export CSV</button>
        </div>
      </div>

      {/* Category Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {reportCategories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setActiveReport(cat.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`glass-card text-left transition-all ${activeReport === cat.id ? 'ring-1 ring-violet-500/50 bg-violet-500/5' : ''}`}
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2`}>
              <cat.icon size={16} className="text-white" />
            </div>
            <p className="text-sm font-medium text-primary">{cat.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Report Content */}
      <motion.div key={activeReport} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {activeReport === 'revenue' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[['Total Revenue', formatCurrency(totalRevenue), 'text-emerald-400'], ['Total Expenses', formatCurrency(totalExpenses), 'text-red-400'], ['Net Profit', formatCurrency(totalRevenue - totalExpenses), 'text-violet-400']].map(([l, v, c]) => (
                <div key={l} className="glass-card text-center">
                  <p className={`text-2xl font-bold ${c}`}>{v}</p>
                  <p className="text-xs text-muted mt-1">{l}</p>
                </div>
              ))}
            </div>
            <div className="glass-card">
              <h3 className="font-semibold text-primary mb-4">Annual Revenue vs Expenses</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueReport}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeReport === 'finance' && (
          <div className="glass-card overflow-x-auto">
            <h3 className="font-semibold text-primary mb-4">Transaction Report ({financeReport.length} records)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Name', 'Type', 'Category', 'Amount', 'Date', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs text-muted font-medium pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {financeReport.map((t, i) => (
                  <tr key={i} className="hover:bg-white/2">
                    <td className="py-2 pr-4 text-primary">{t.name}</td>
                    <td className={`py-2 pr-4 capitalize ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>{t.type}</td>
                    <td className="py-2 pr-4 text-secondary">{t.category}</td>
                    <td className={`py-2 pr-4 font-medium ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(t.amount)}</td>
                    <td className="py-2 pr-4 text-muted">{t.date}</td>
                    <td className="py-2 pr-4 text-secondary capitalize">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'projects' && (
          <>
            <div className="glass-card">
              <h3 className="font-semibold text-primary mb-4">Project Progress Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={projectReport} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="progress" name="Progress %" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeReport === 'crm' && (
          <div className="glass-card overflow-x-auto">
            <h3 className="font-semibold text-primary mb-4">CRM Contact Report ({crmReport.length} contacts)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Name', 'Company', 'Status', 'Source'].map((h) => (
                    <th key={h} className="text-left text-xs text-muted font-medium pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {crmReport.map((c, i) => (
                  <tr key={i} className="hover:bg-white/2">
                    <td className="py-2 pr-4 text-primary font-medium">{c.name}</td>
                    <td className="py-2 pr-4 text-secondary">{c.company}</td>
                    <td className="py-2 pr-4 text-secondary capitalize">{c.status}</td>
                    <td className="py-2 pr-4 text-secondary capitalize">{c.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'team' && (
          <>
            <div className="glass-card">
              <h3 className="font-semibold text-primary mb-4">User Growth Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="users" name="Total Users" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card overflow-x-auto">
              <h3 className="font-semibold text-primary mb-4">Team Members ({teamReport.length})</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Name', 'Role', 'Department', 'Status'].map((h) => (
                      <th key={h} className="text-left text-xs text-muted font-medium pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teamReport.map((m, i) => (
                    <tr key={i} className="hover:bg-white/2">
                      <td className="py-2 pr-4 text-primary font-medium">{m.name}</td>
                      <td className="py-2 pr-4 text-secondary">{m.role}</td>
                      <td className="py-2 pr-4 text-secondary">{m.department}</td>
                      <td className="py-2 pr-4 text-secondary capitalize">{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
