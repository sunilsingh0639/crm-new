import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, Sparkles, Plus, ChevronRight, X, LogOut, User, Settings, HelpCircle, Palette } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Avatar } from '../common/Avatar';
import { formatRelativeTime } from '../../utils/helpers';

const breadcrumbMap: Record<string, string> = {
  '/': 'Overview',
  '/analytics': 'Analytics',
  '/crm': 'CRM',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/finance': 'Finance',
  '/team': 'Team',
  '/calendar': 'Calendar',
  '/reports': 'Reports',
  '/components': 'UI Components',
  '/settings': 'Settings',
};

export function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, theme, updateTheme, userProfile, sidebarCollapsed } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  const { contacts, projects, tasks, transactions, teamMembers } = useStore();

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
        setTimeout(() => searchRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false); setProfileOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const themes: Array<{ key: 'dark' | 'light' | 'liquid'; icon: typeof Sun; label: string }> = [
    { key: 'light', icon: Sun, label: 'Light' },
    { key: 'dark', icon: Moon, label: 'Dark' },
    { key: 'liquid', icon: Sparkles, label: 'Liquid' },
  ];

  const currentPage = breadcrumbMap[location.pathname] ?? 'Page';
  const ml = sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]';

  return (
    <header className={`fixed top-0 right-0 ${ml} z-40 transition-all duration-300`}>
      <div className="glass border-b border-white/5 px-6 py-3 flex items-center gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm flex-1">
          <span className="text-muted">Nuvora</span>
          <ChevronRight size={14} className="text-muted" />
          <span className="text-primary font-medium">{currentPage}</span>
        </div>

        {/* Search */}
        <button
          onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100); }}
          className="btn-glass gap-2 hidden sm:flex"
        >
          <Search size={14} />
          <span className="text-muted text-xs">Search...</span>
          <kbd className="text-xs text-muted bg-white/5 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>

        {/* Theme switcher */}
        <div className="flex items-center gap-1 glass rounded-xl p-1">
          {themes.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => updateTheme({ theme: key })}
              className={`p-1.5 rounded-lg transition-all ${theme.theme === key ? 'bg-violet-500/20 text-violet-400' : 'text-muted hover:text-secondary'}`}
              title={key}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="btn-glass p-2 relative">
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 glass-card z-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-primary text-sm">Notifications</h3>
                  <button onClick={markAllNotificationsRead} className="text-xs text-violet-400 hover:text-violet-300">Mark all read</button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.slice(0, 8).map((n) => (
                    <div key={n.id} className={`flex gap-3 p-2 rounded-lg transition-colors ${!n.read ? 'bg-white/5' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'success' ? 'bg-emerald-400' : n.type === 'error' ? 'bg-red-400' : n.type === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-primary">{n.title}</p>
                        <p className="text-xs text-muted truncate">{n.message}</p>
                        <p className="text-xs text-muted mt-0.5">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                      <button onClick={() => { markNotificationRead(n.id); deleteNotification(n.id); }} className="text-muted hover:text-secondary shrink-0">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="text-center text-sm text-muted py-4">No notifications</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick action */}
        <button className="btn-primary hidden sm:flex">
          <Plus size={14} />
          <span>New</span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2">
            <Avatar name={userProfile.name} size="sm" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-56 glass-card z-50"
              >
                <div className="flex items-center gap-3 pb-3 mb-3 border-b border-white/5">
                  <Avatar name={userProfile.name} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-primary">{userProfile.name}</p>
                    <p className="text-xs text-muted">{userProfile.email}</p>
                  </div>
                </div>
                {[
                  { icon: User, label: 'My Profile', path: '/settings?tab=profile' },
                  { icon: Settings, label: 'Account Settings', path: '/settings' },
                  { icon: Palette, label: 'Appearance', path: '/settings?tab=theme' },
                  { icon: HelpCircle, label: 'Help Center', path: '/settings' },
                ].map(({ icon: Icon, label, path }) => (
                  <button
                    key={label}
                    onClick={() => { navigate(path); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-secondary hover:text-primary hover:bg-white/5 transition-colors"
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
                <div className="border-t border-white/5 mt-2 pt-2">
                  <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="glass-card w-full max-w-xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-3">
                <Search size={16} className="text-muted" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, tasks, contacts..."
                  className="flex-1 bg-transparent outline-none text-primary placeholder:text-muted text-sm"
                />
                <button onClick={() => setSearchOpen(false)} className="text-muted hover:text-secondary">
                  <X size={16} />
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="border-t border-white/5 pt-3 space-y-1">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => { navigate(r.path); setSearchOpen(false); setSearchQuery(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <span className="text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full w-20 text-center">{r.type}</span>
                      <span className="text-sm text-primary flex-1">{r.label}</span>
                      <span className="text-xs text-muted">{r.sub}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery.length > 1 && searchResults.length === 0 && (
                <p className="text-center text-sm text-muted py-4">No results found</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
