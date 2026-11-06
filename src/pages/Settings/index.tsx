import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Bell, Shield, Database, Sun, Moon, Sparkles, RotateCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../store/useStore';
import { Avatar } from '../../components/common/Avatar';
import { useToast } from '../../components/common/Toast';
import { ConfirmDialog } from '../../components/common/Modal';

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  jobTitle: z.string().min(1),
  timezone: z.string().min(1),
  bio: z.string().optional(),
});
type ProfileData = z.infer<typeof profileSchema>;

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'theme', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'data', label: 'Data', icon: Database },
];

const accentPresets = [
  { label: 'Violet', value: '139 92 246', secondary: '59 130 246' },
  { label: 'Blue', value: '59 130 246', secondary: '6 182 212' },
  { label: 'Emerald', value: '16 185 129', secondary: '6 182 212' },
  { label: 'Rose', value: '244 63 94', secondary: '251 113 133' },
  { label: 'Amber', value: '245 158 11', secondary: '249 115 22' },
  { label: 'Cyan', value: '6 182 212', secondary: '59 130 246' },
];

export default function Settings() {
  const { userProfile, updateUserProfile, theme, updateTheme, resetDemoData } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: userProfile,
  });

  const onProfileSubmit = (data: ProfileData) => {
    updateUserProfile(data);
    toast('Profile updated', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-secondary text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="glass-card p-2 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === id ? 'bg-violet-500/20 text-violet-400' : 'text-secondary hover:text-primary hover:bg-white/5'}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-4">
          {activeTab === 'profile' && (
            <div className="glass-card">
              <h2 className="font-semibold text-primary mb-6">Profile Settings</h2>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                <Avatar name={userProfile.name} size="xl" />
                <div>
                  <p className="font-semibold text-primary">{userProfile.name}</p>
                  <p className="text-sm text-muted">{userProfile.email}</p>
                  <button className="btn-glass text-xs mt-2">Change Photo</button>
                </div>
              </div>
              <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted mb-1 block">Full Name</label>
                    <input {...register('name')} className="input-glass" />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">Email</label>
                    <input {...register('email')} type="email" className="input-glass" />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">Phone</label>
                    <input {...register('phone')} className="input-glass" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">Job Title</label>
                    <input {...register('jobTitle')} className="input-glass" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">Timezone</label>
                    <select {...register('timezone')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
                      {['America/Los_Angeles', 'America/New_York', 'America/Chicago', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Singapore'].map((tz) => (
                        <option key={tz} value={tz} style={{ background: 'rgb(var(--bg-secondary))' }}>{tz}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted mb-1 block">Bio</label>
                  <textarea {...register('bio')} className="input-glass resize-none" rows={3} />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="glass-card">
                <h2 className="font-semibold text-primary mb-4">Theme</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'dark', icon: Moon, label: 'Dark', desc: 'Deep dark glass' },
                    { key: 'light', icon: Sun, label: 'Light', desc: 'Clean & bright' },
                    { key: 'liquid', icon: Sparkles, label: 'Liquid Glass', desc: 'Premium glass' },
                  ].map(({ key, icon: Icon, label, desc }) => (
                    <button
                      key={key}
                      onClick={() => updateTheme({ theme: key as 'dark' | 'light' | 'liquid' })}
                      className={`glass-card text-left transition-all ${theme.theme === key ? 'ring-1 ring-violet-500/50 bg-violet-500/5' : ''}`}
                    >
                      <Icon size={20} className={theme.theme === key ? 'text-violet-400' : 'text-muted'} />
                      <p className="text-sm font-medium text-primary mt-2">{label}</p>
                      <p className="text-xs text-muted">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card">
                <h2 className="font-semibold text-primary mb-4">Accent Color</h2>
                <div className="flex flex-wrap gap-3">
                  {accentPresets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => updateTheme({ accent: preset.value, accentSecondary: preset.secondary })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl glass transition-all ${theme.accent === preset.value ? 'ring-1 ring-white/30' : ''}`}
                    >
                      <span className="w-4 h-4 rounded-full" style={{ background: `rgb(${preset.value})` }} />
                      <span className="text-xs text-secondary">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card space-y-4">
                <h2 className="font-semibold text-primary">Customization</h2>
                {[
                  { label: 'Glass Blur', key: 'glassBlur', min: 0, max: 40, unit: 'px', value: theme.glassBlur },
                  { label: 'Border Radius', key: 'borderRadius', min: 0, max: 32, unit: 'px', value: theme.borderRadius },
                  { label: 'Shadow Intensity', key: 'shadowIntensity', min: 0, max: 1, unit: '', value: theme.shadowIntensity, step: 0.1 },
                ].map(({ label, key, min, max, unit, value, step }) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-muted">{label}</label>
                      <span className="text-xs text-secondary">{value}{unit}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step ?? 1}
                      value={value}
                      onChange={(e) => updateTheme({ [key]: parseFloat(e.target.value) })}
                      className="w-full accent-violet-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs text-muted mb-2 block">Card Spacing</label>
                  <div className="flex gap-2">
                    {(['compact', 'normal', 'relaxed'] as const).map((s) => (
                      <button key={s} onClick={() => updateTheme({ cardSpacing: s })} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${theme.cardSpacing === s ? 'bg-violet-500/20 text-violet-400' : 'btn-glass'}`}>{s}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted mb-2 block">Sidebar Style</label>
                  <div className="flex gap-2">
                    {(['glass', 'solid', 'minimal'] as const).map((s) => (
                      <button key={s} onClick={() => updateTheme({ sidebarStyle: s })} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${theme.sidebarStyle === s ? 'bg-violet-500/20 text-violet-400' : 'btn-glass'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card space-y-4">
              <h2 className="font-semibold text-primary mb-4">Notification Preferences</h2>
              {[
                ['Email Notifications', 'Receive updates via email'],
                ['Push Notifications', 'Browser push notifications'],
                ['Task Reminders', 'Get reminded about due tasks'],
                ['Project Updates', 'Updates on project progress'],
                ['Team Activity', 'When team members take actions'],
                ['Financial Alerts', 'Transaction and payment alerts'],
              ].map(([label, desc]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-primary">{label}</p>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                  <button className="w-10 h-5 rounded-full bg-violet-500 relative">
                    <span className="absolute right-1 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-card space-y-4">
              <h2 className="font-semibold text-primary mb-4">Security Settings</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted mb-1 block">Current Password</label>
                  <input type="password" className="input-glass" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1 block">New Password</label>
                  <input type="password" className="input-glass" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1 block">Confirm Password</label>
                  <input type="password" className="input-glass" placeholder="••••••••" />
                </div>
                <button onClick={() => toast('Password updated (demo)', 'success')} className="btn-primary">Update Password</button>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">Two-Factor Authentication</p>
                    <p className="text-xs text-muted">Add an extra layer of security</p>
                  </div>
                  <button onClick={() => toast('2FA enabled (demo)', 'success')} className="btn-glass text-xs">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="glass-card space-y-4">
              <h2 className="font-semibold text-primary mb-4">Data Management</h2>
              <div className="glass p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <p className="text-sm font-medium text-amber-400 mb-1">Reset Demo Data</p>
                <p className="text-xs text-secondary mb-3">This will restore all original mock data. Your customizations will be lost.</p>
                <button onClick={() => setResetOpen(true)} className="btn-glass text-amber-400 gap-2">
                  <RotateCcw size={14} />Reset to Demo Data
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary">Storage Usage</p>
                <div className="glass p-3 rounded-xl text-xs text-secondary">
                  Data is stored in your browser's localStorage. No data is sent to any server.
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => { resetDemoData(); toast('Demo data restored', 'success'); }}
        title="Reset Demo Data"
        message="This will restore all original mock data and reset your settings. Are you sure?"
        confirmLabel="Reset"
        danger
      />
    </div>
  );
}
