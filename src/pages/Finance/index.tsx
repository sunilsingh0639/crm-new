import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, Download } from 'lucide-react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStore } from '../../store/useStore';
import { generateId, formatCurrency, formatDate, downloadCSV } from '../../utils/helpers';
import { Badge } from '../../components/common/Badge';
import { SearchInput, Select } from '../../components/common/Inputs';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../components/common/Toast';
import { expenseCategoryData } from '../../data/mockData';
import type { Transaction } from '../../types';

const schema = z.object({
  name: z.string().min(2),
  amount: z.coerce.number().min(0.01),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(['completed', 'pending', 'failed']),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const categories = ['Subscription', 'Services', 'Infrastructure', 'Payroll', 'Marketing', 'Operations', 'Software', 'Legal', 'Training', 'Other'];

function TransactionForm({ tx, onClose }: { tx?: Transaction; onClose: () => void }) {
  const { addTransaction, updateTransaction } = useStore();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: tx ?? { type: 'income', status: 'completed', date: new Date().toISOString().split('T')[0] },
  });

  const onSubmit = (data: FormData) => {
    if (tx) { updateTransaction({ ...tx, ...data }); toast('Transaction updated', 'success'); }
    else { addTransaction({ ...data, id: generateId() }); toast('Transaction added', 'success'); }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs text-muted mb-1 block">Name</label>
        <input {...register('name')} className="input-glass" />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted mb-1 block">Amount ($)</label>
          <input {...register('amount')} type="number" step="0.01" className="input-glass" />
          {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>}
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Type</label>
          <select {...register('type')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            <option value="income" style={{ background: 'rgb(var(--bg-secondary))' }}>Income</option>
            <option value="expense" style={{ background: 'rgb(var(--bg-secondary))' }}>Expense</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Category</label>
          <select {...register('category')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            {categories.map((c) => <option key={c} value={c} style={{ background: 'rgb(var(--bg-secondary))' }}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Date</label>
          <input {...register('date')} type="date" className="input-glass" />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Status</label>
          <select {...register('status')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            {['completed', 'pending', 'failed'].map((s) => <option key={s} value={s} style={{ background: 'rgb(var(--bg-secondary))' }}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-muted mb-1 block">Description</label>
        <textarea {...register('description')} className="input-glass resize-none" rows={2} />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onClose} className="btn-glass">Cancel</button>
        <button type="submit" className="btn-primary">{tx ? 'Update' : 'Add'} Transaction</button>
      </div>
    </form>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="text-secondary mb-1">{label}</p>
      {payload.map((p) => <p key={p.name} style={{ color: p.color }}>{p.name}: {formatCurrency(p.value)}</p>)}
    </div>
  );
};

export default function Finance() {
  const { transactions, deleteTransaction } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = transactions.filter((t) =>
    (!search || t.name.toLowerCase().includes(search.toLowerCase())) &&
    (!typeFilter || t.type === typeFilter) &&
    (!categoryFilter || t.category === categoryFilter)
  );

  const summary = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === 'expense' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
    return { income, expenses, profit: income - expenses, balance: income - expenses };
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months: Record<string, { month: string; income: number; expenses: number }> = {};
    transactions.forEach((t) => {
      const m = new Date(t.date).toLocaleString('en-US', { month: 'short' });
      if (!months[m]) months[m] = { month: m, income: 0, expenses: 0 };
      if (t.type === 'income') months[m].income += t.amount;
      else months[m].expenses += t.amount;
    });
    return Object.values(months);
  }, [transactions]);

  const summaryCards = [
    { label: 'Total Balance', value: formatCurrency(summary.balance), icon: DollarSign, color: 'from-violet-500 to-purple-600', up: true },
    { label: 'Total Income', value: formatCurrency(summary.income), icon: TrendingUp, color: 'from-emerald-500 to-teal-600', up: true },
    { label: 'Total Expenses', value: formatCurrency(summary.expenses), icon: TrendingDown, color: 'from-red-500 to-rose-600', up: false },
    { label: 'Net Profit', value: formatCurrency(summary.profit), icon: ArrowUpRight, color: 'from-blue-500 to-cyan-600', up: summary.profit > 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Finance</h1>
          <p className="text-secondary text-sm mt-1">{transactions.length} transactions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => downloadCSV(filtered as unknown as Record<string, unknown>[], 'transactions')} className="btn-glass gap-2"><Download size={14} />Export</button>
          <button onClick={() => { setEditTx(undefined); setModalOpen(true); }} className="btn-primary"><Plus size={14} />Add Transaction</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card glass-hover">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
              <c.icon size={18} className="text-white" />
            </div>
            <p className="text-xl font-bold text-primary">{c.value}</p>
            <p className="text-xs text-muted mt-0.5">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
          <h2 className="font-semibold text-primary mb-4">Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card">
          <h2 className="font-semibold text-primary mb-4">Expense Breakdown</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={expenseCategoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {expenseCategoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {expenseCategoryData.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-secondary">{c.name}</span>
                  </div>
                  <span className="text-primary font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card">
        <div className="flex flex-wrap gap-3 mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search transactions..." className="w-64" />
          <Select value={typeFilter} onChange={setTypeFilter} options={[{ value: 'income', label: 'Income' }, { value: 'expense', label: 'Expense' }]} placeholder="All Types" className="w-36" />
          <Select value={categoryFilter} onChange={setCategoryFilter} options={categories.map((c) => ({ value: c, label: c }))} placeholder="All Categories" className="w-40" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<DollarSign size={24} />} title="No transactions found" action={<button onClick={() => setModalOpen(true)} className="btn-primary">Add Transaction</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Transaction', 'Category', 'Date', 'Amount', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs text-muted font-medium pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                          <ArrowUpRight size={14} className={t.type === 'income' ? 'text-emerald-400' : 'text-red-400 rotate-180'} />
                        </div>
                        <span className="font-medium text-primary">{t.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-secondary">{t.category}</td>
                    <td className="py-3 pr-4 text-muted">{formatDate(t.date)}</td>
                    <td className={`py-3 pr-4 font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="py-3 pr-4"><Badge label={t.status} status={t.status} /></td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditTx(t); setModalOpen(true); }} className="btn-glass p-1.5"><Edit2 size={13} /></button>
                        <button onClick={() => setDeleteId(t.id)} className="btn-glass p-1.5 text-red-400"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTx ? 'Edit Transaction' : 'Add Transaction'} size="md">
        <TransactionForm tx={editTx} onClose={() => setModalOpen(false)} />
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteTransaction(deleteId!); toast('Transaction deleted', 'success'); }} title="Delete Transaction" message="Delete this transaction permanently?" confirmLabel="Delete" danger />
    </div>
  );
}
