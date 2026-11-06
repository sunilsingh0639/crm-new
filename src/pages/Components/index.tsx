import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Zap, Star, Heart, Bell, Download, Trash2, Edit2, Plus, Search, ChevronDown, AlertCircle, CheckCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import { Badge } from '../../components/common/Badge';
import { Avatar, AvatarGroup } from '../../components/common/Avatar';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';

const categories = ['Buttons', 'Forms', 'Containers', 'Navigation', 'Feedback', 'Data Display'];

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="btn-glass p-1.5 text-xs gap-1">
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card space-y-4">
      <h3 className="font-semibold text-primary border-b border-white/5 pb-3">{title}</h3>
      {children}
    </div>
  );
}

function Preview({ label, code, children }: { label: string; code: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <CopyButton code={code} />
      </div>
      <div className="glass rounded-xl p-4 flex flex-wrap gap-3 items-center">
        {children}
      </div>
    </div>
  );
}

export default function Components() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('Buttons');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleOn, setToggleOn] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [sliderVal, setSliderVal] = useState(60);
  const [inputVal, setInputVal] = useState('');

  const filtered = categories.filter((c) => !search || c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">UI Components</h1>
        <p className="text-secondary text-sm mt-1">Liquid Glass design system components</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search components..." className="input-glass pl-9 w-56" />
        </div>
        <div className="flex flex-wrap gap-1 glass rounded-xl p-1">
          {filtered.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeCategory === c ? 'bg-violet-500/20 text-violet-400' : 'text-muted hover:text-secondary'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {(activeCategory === 'Buttons' || !activeCategory) && (
          <Section title="Buttons">
            <Preview label="Primary Buttons" code={`<button className="btn-primary">Primary</button>`}>
              <button className="btn-primary"><Zap size={14} />Primary</button>
              <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}><Star size={14} />Success</button>
              <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}><Trash2 size={14} />Danger</button>
              <button className="btn-primary opacity-50 cursor-not-allowed" disabled>Disabled</button>
            </Preview>
            <Preview label="Glass Buttons" code={`<button className="btn-glass">Glass</button>`}>
              <button className="btn-glass"><Bell size={14} />Glass</button>
              <button className="btn-glass"><Download size={14} />Download</button>
              <button className="btn-glass"><Edit2 size={14} />Edit</button>
              <button className="btn-glass p-2"><Plus size={16} /></button>
              <button className="btn-glass p-2 rounded-full"><Heart size={16} /></button>
            </Preview>
            <Preview label="Sizes" code={`<button className="btn-primary text-xs px-2 py-1">Small</button>`}>
              <button className="btn-primary text-xs px-2 py-1">Small</button>
              <button className="btn-primary">Medium</button>
              <button className="btn-primary text-base px-6 py-3">Large</button>
            </Preview>
            <Preview label="Floating Action Button" code={`<button className="btn-primary w-14 h-14 rounded-full shadow-2xl"><Plus /></button>`}>
              <button className="btn-primary w-14 h-14 rounded-full shadow-2xl flex items-center justify-center glow">
                <Plus size={24} />
              </button>
            </Preview>
          </Section>
        )}

        {activeCategory === 'Forms' && (
          <Section title="Form Elements">
            <Preview label="Text Inputs" code={`<input className="input-glass" placeholder="Enter text..." />`}>
              <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="input-glass w-48" placeholder="Glass input..." />
              <div className="relative w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input className="input-glass pl-9" placeholder="Search input..." />
              </div>
            </Preview>
            <Preview label="Textarea" code={`<textarea className="input-glass resize-none" rows={3} />`}>
              <textarea className="input-glass resize-none w-64" rows={3} placeholder="Glass textarea..." />
            </Preview>
            <Preview label="Select" code={`<select className="input-glass"><option>Option</option></select>`}>
              <select className="input-glass w-48" style={{ background: 'var(--glass-bg)' }}>
                <option style={{ background: 'rgb(var(--bg-secondary))' }}>Select option...</option>
                <option style={{ background: 'rgb(var(--bg-secondary))' }}>Option 1</option>
                <option style={{ background: 'rgb(var(--bg-secondary))' }}>Option 2</option>
              </select>
            </Preview>
            <Preview label="Toggle & Checkbox" code={`<button onClick={() => setOn(!on)} className="...">`}>
              <button onClick={() => setToggleOn(!toggleOn)} className={`w-12 h-6 rounded-full transition-all relative ${toggleOn ? 'bg-violet-500' : 'bg-white/10'}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${toggleOn ? 'left-7' : 'left-1'}`} />
              </button>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={checkboxVal} onChange={(e) => setCheckboxVal(e.target.checked)} className="w-4 h-4 rounded accent-violet-500" />
                <span className="text-sm text-secondary">Checkbox</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="radio" className="accent-violet-500" />
                <span className="text-sm text-secondary">Radio</span>
              </label>
            </Preview>
            <Preview label="Range Slider" code={`<input type="range" className="accent-violet-500" />`}>
              <div className="w-48">
                <input type="range" min={0} max={100} value={sliderVal} onChange={(e) => setSliderVal(+e.target.value)} className="w-full accent-violet-500" />
                <p className="text-xs text-muted mt-1 text-center">{sliderVal}%</p>
              </div>
            </Preview>
          </Section>
        )}

        {activeCategory === 'Containers' && (
          <Section title="Containers">
            <Preview label="Glass Cards" code={`<div className="glass-card">...</div>`}>
              <div className="glass-card w-48">
                <p className="text-sm font-semibold text-primary">Glass Card</p>
                <p className="text-xs text-muted mt-1">Frosted glass surface</p>
              </div>
              <div className="glass-card glass-hover w-48">
                <p className="text-sm font-semibold text-primary">Hover Card</p>
                <p className="text-xs text-muted mt-1">Hover me!</p>
              </div>
            </Preview>
            <Preview label="Stats Card" code={`<div className="glass-card"><p className="text-2xl font-bold">$24K</p></div>`}>
              <div className="glass-card w-48">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-3">
                  <Zap size={16} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-primary">$24K</p>
                <p className="text-xs text-muted">Total Revenue</p>
                <p className="text-xs text-emerald-400 mt-1">+18.2% vs last month</p>
              </div>
            </Preview>
            <Preview label="Profile Card" code={`<div className="glass-card flex items-center gap-3">...</div>`}>
              <div className="glass-card w-56">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name="Alex Morgan" size="lg" />
                  <div>
                    <p className="font-semibold text-primary">Alex Morgan</p>
                    <p className="text-xs text-muted">Lead Engineer</p>
                  </div>
                </div>
                <Badge label="active" status="active" />
              </div>
            </Preview>
          </Section>
        )}

        {activeCategory === 'Navigation' && (
          <Section title="Navigation">
            <Preview label="Tabs" code={`<div className="flex gap-1 glass rounded-xl p-1">...</div>`}>
              <div className="flex gap-1 glass rounded-xl p-1">
                {['Overview', 'Analytics', 'Settings'].map((t, i) => (
                  <button key={t} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${i === 0 ? 'bg-violet-500/20 text-violet-400' : 'text-muted hover:text-secondary'}`}>{t}</button>
                ))}
              </div>
            </Preview>
            <Preview label="Breadcrumb" code={`<div className="flex items-center gap-1.5 text-sm">...</div>`}>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-muted">Nuvora</span>
                <span className="text-muted">/</span>
                <span className="text-secondary">Settings</span>
                <span className="text-muted">/</span>
                <span className="text-primary font-medium">Profile</span>
              </div>
            </Preview>
            <Preview label="Pagination" code={`<div className="flex items-center gap-1">...</div>`}>
              <div className="flex items-center gap-1">
                <button className="btn-glass p-2"><ChevronDown size={14} className="rotate-90" /></button>
                {[1, 2, 3, 4, 5].map((p) => (
                  <button key={p} className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${p === 2 ? 'btn-primary' : 'btn-glass'}`}>{p}</button>
                ))}
                <button className="btn-glass p-2"><ChevronDown size={14} className="-rotate-90" /></button>
              </div>
            </Preview>
          </Section>
        )}

        {activeCategory === 'Feedback' && (
          <Section title="Feedback">
            <Preview label="Toast Notifications" code={`toast('Message', 'success')`}>
              <button onClick={() => toast('Operation successful!', 'success')} className="btn-glass text-emerald-400"><CheckCircle size={14} />Success</button>
              <button onClick={() => toast('Something went wrong', 'error')} className="btn-glass text-red-400"><AlertCircle size={14} />Error</button>
              <button onClick={() => toast('Please review this', 'warning')} className="btn-glass text-amber-400"><AlertTriangle size={14} />Warning</button>
              <button onClick={() => toast('New update available', 'info')} className="btn-glass text-blue-400"><Info size={14} />Info</button>
            </Preview>
            <Preview label="Alerts" code={`<div className="glass border-emerald-500/30 bg-emerald-500/10">...</div>`}>
              <div className="glass border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-3 flex items-center gap-2 w-full">
                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                <p className="text-sm text-emerald-400">Operation completed successfully</p>
              </div>
              <div className="glass border border-red-500/30 bg-red-500/10 rounded-xl p-3 flex items-center gap-2 w-full">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-400">An error occurred. Please try again.</p>
              </div>
            </Preview>
            <Preview label="Modal" code={`<Modal open={open} onClose={onClose} title="Title">...</Modal>`}>
              <button onClick={() => setModalOpen(true)} className="btn-primary">Open Modal</button>
            </Preview>
            <Preview label="Loading" code={`<Loader2 className="animate-spin" />`}>
              <Loader2 size={20} className="animate-spin text-violet-400" />
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-violet-400" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                ))}
              </div>
              <div className="w-32 h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
              </div>
            </Preview>
            <Preview label="Progress Bars" code={`<ProgressBar value={75} showLabel />`}>
              <div className="w-full space-y-2">
                <ProgressBar value={85} showLabel />
                <ProgressBar value={60} showLabel />
                <ProgressBar value={35} showLabel />
                <ProgressBar value={15} showLabel />
              </div>
            </Preview>
          </Section>
        )}

        {activeCategory === 'Data Display' && (
          <Section title="Data Display">
            <Preview label="Badges" code={`<Badge label="active" status="active" />`}>
              {['active', 'inactive', 'away', 'completed', 'in-progress', 'planning', 'on-hold', 'critical', 'high', 'medium', 'low'].map((s) => (
                <Badge key={s} label={s} status={s} />
              ))}
            </Preview>
            <Preview label="Avatars" code={`<Avatar name="Alex Morgan" size="md" />`}>
              {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <Avatar key={size} name="Alex Morgan" size={size} />
              ))}
              <AvatarGroup names={['Alex Morgan', 'Jordan Lee', 'Sam Wilson', 'Maya Patel', 'Chris Anderson']} max={3} />
            </Preview>
            <Preview label="Table" code={`<table className="w-full text-sm">...</table>`}>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Name', 'Status', 'Role'].map((h) => <th key={h} className="text-left text-xs text-muted font-medium pb-2 pr-4">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[['Alex Morgan', 'active', 'Engineer'], ['Jordan Lee', 'active', 'Designer'], ['Sam Wilson', 'away', 'PM']].map(([n, s, r]) => (
                      <tr key={n} className="hover:bg-white/2">
                        <td className="py-2 pr-4 text-primary">{n}</td>
                        <td className="py-2 pr-4"><Badge label={s} status={s} /></td>
                        <td className="py-2 pr-4 text-secondary">{r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Preview>
          </Section>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal" size="sm">
        <p className="text-secondary text-sm mb-4">This is a glass morphism modal with smooth animations and backdrop blur.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setModalOpen(false)} className="btn-glass">Cancel</button>
          <button onClick={() => { setModalOpen(false); toast('Action confirmed!', 'success'); }} className="btn-primary">Confirm</button>
        </div>
      </Modal>
    </div>
  );
}
