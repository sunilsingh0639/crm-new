import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Sun, Moon, Sparkles, Plus, ChevronRight,
  X, LogOut, User, Settings, HelpCircle, Palette
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Avatar } from '../common/Avatar';
import { formatRelativeTime } from '../../utils/helpers';

const breadcrumbMap: Record<string, string> = {
  '/': 'Overview', '/analytics': 'Analytics', '/crm': 'CRM',
  '/projects': 'Projects', '/tasks': 'Tasks', '/finance': 'Finance',
  '/team': 'Team', '/calendar': 'Calendar', '/reports': 'Reports',
  '/components': 'UI Components', '/settings': 'Settings',
};

const dropdownStyle: React.CSSProperties = {
  background: 'rgba(12, 10, 35, 0.88)',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.12)',
  boxShadow: '0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
  borderRadius: 18,
};

export function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    notifications, markNotificationRead, markAllNotificationsRead,
    deleteNotification, theme, updateTheme, userProfile, sidebarCollapsed,
    contacts, projects, tasks, transactions, teamMembers,
  } = useStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  const searchResults = searchQuery.length > 1 ? [
    ...contacts.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map((c) => ({ type: 'Contact', label: c.name, sub: c.company, path: '/crm' })),
    ...projects.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map((p) => ({ type: 'Project', label: p.name, sub: p.status, path: '/projects' })),
    ...tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map((t) => ({ type: 'Task', label: t.title, sub: t.status, path: '/tasks' })),
    ...transactions.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map((t) => ({ type: 'Transaction', label: t.name, sub: `$${t.amount}`, path: '/finance' })),
    ...teamMembers.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map((m) => ({ type: 'Member', label: m.name, sub: m.role, path: '/team' })),
  ] : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 80);
      }
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false); setProfileOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const currentPage = breadcrumbMap[location.pathname] ?? 'Page';
  const ml = sidebarCollapsed ? 'ml-[72px]' : 'ml-[244px]';

  const navStyle: React.CSSProperties = {
    background: 'rgba(8, 6, 25, 0.70)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.20)',
  };

  const themes: Array<{ key: 'dark' | 'light' | 'liquid'; icon: typeof Sun }> = [
    { key: 'light', icon: Sun },
    { key: 'dark',  icon: Moon },
    { key: 'liquid', icon: Sparkles },
  ];

  return (
    <header className={`fixed top-0 right-0 ${ml} z-40 transition-all duration-300`}>
      <div className="px-5 py-3 flex items-center gap-3" style={navStyle}>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
          <span className="text-slate-500 text-xs hidden sm:block">Nuvora</span>
          <ChevronRight size={12} className="text-slate-600 hidden sm:block" />
          <span className="text-white/90 font-medium text-sm truncate">{currentPage}</span>
        </div>

        {/* Search trigger */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 80); }}
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-slate-400 text-xs transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Search size={13} />
          <span>Search...</span>
          <kbd className="text-[10px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/8">⌘K</kbd>
        </motion.button>

        {/* Theme switcher */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {themes.map(({ key, icon: Icon }) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateTheme({ theme: key })}
              className={`p-1.5 rounded-lg transition-all ${
                theme.theme === key
                  ? 'text-violet-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={theme.theme === key ? {
                background: 'rgba(139,92,246,0.20)',
                boxShadow: '0 0 10px rgba(139,92,246,0.20)',
              } : {}}
              title={key}
            >
              <Icon size={13} />
            </motion.button>
          ))}
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-xl transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <Bell size={15} className="text-slate-300" />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
              >
                {unread}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute right-0 top-full mt-2 w-80 p-4 z-50"
                style={dropdownStyle}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-[18px]" />
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white text-sm">Notifications</h3>
                  <button onClick={markAllNotificationsRead} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Mark all read</button>
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto scroll-area">
                  {notifications.slice(0, 8).map((n) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-3 p-2.5 rounded-xl transition-colors ${!n.read ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'}`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        n.type === 'success' ? 'bg-emerald-400' :
                        n.type === 'error'   ? 'bg-red-400' :
                        n.type === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white">{n.title}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                      <button onClick={() => { markNotificationRead(n.id); deleteNotification(n.id); }} className="text-slate-600 hover:text-slate-400 shrink-0 mt-0.5">
                        <X size={11} />
                      </button>
                    </motion.div>
                  ))}
                  {notifications.length === 0 && <p className="text-center text-sm text-slate-500 py-6">No notifications</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick action */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary hidden sm:flex text-xs px-3.5 py-2"
        >
          <Plus size={13} />
          <span>New</span>
        </motion.button>

        {/* Profile */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1 rounded-xl transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)' }}
          >
            <Avatar name={userProfile.name} size="sm" className="ring-2 ring-violet-500/30" />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute right-0 top-full mt-2 w-56 p-3 z-50"
                style={dropdownStyle}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-[18px]" />
                <div className="flex items-center gap-3 pb-3 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <Avatar name={userProfile.name} size="md" className="ring-2 ring-violet-500/30" />
                  <div>
                    <p className="text-sm font-semibold text-white">{userProfile.name}</p>
                    <p className="text-xs text-slate-500">{userProfile.email}</p>
                  </div>
                </div>
                {[
                  { icon: User,       label: 'My Profile',       path: '/settings?tab=profile' },
                  { icon: Settings,   label: 'Account Settings', path: '/settings' },
                  { icon: Palette,    label: 'Appearance',       path: '/settings?tab=theme' },
                  { icon: HelpCircle, label: 'Help Center',      path: '/settings' },
                ].map(({ icon: Icon, label, path }) => (
                  <motion.button
                    key={label}
                    whileHover={{ x: 3 }}
                    onClick={() => { navigate(path); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all"
                  >
                    <Icon size={14} />
                    {label}
                  </motion.button>
                ))}
                <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <motion.button
                    whileHover={{ x: 3 }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Global Search Modal ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60" style={{ backdropFilter: 'blur(8px)' }} />
            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full max-w-xl p-4 z-10"
              style={dropdownStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-t-[18px]" />
              <div className="flex items-center gap-3 mb-1">
                <Search size={15} className="text-slate-400 shrink-0" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, tasks, contacts..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500 text-sm"
                />
                <button onClick={() => setSearchOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  <X size={15} />
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-3 pt-3 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  {searchResults.map((r, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => { navigate(r.path); setSearchOpen(false); setSearchQuery(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-colors text-left"
                    >
                      <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-full w-20 text-center border border-violet-500/20">{r.type}</span>
                      <span className="text-sm text-white flex-1">{r.label}</span>
                      <span className="text-xs text-slate-500">{r.sub}</span>
                    </motion.button>
                  ))}
                </div>
              )}
              {searchQuery.length > 1 && searchResults.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-5">No results found</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
