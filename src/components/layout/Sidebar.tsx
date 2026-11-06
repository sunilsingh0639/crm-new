import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BarChart3, Users, FolderKanban, CheckSquare,
  DollarSign, UserCircle, Calendar, FileText, Puzzle, Settings,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Avatar } from '../common/Avatar';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Overview' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/crm', icon: Users, label: 'CRM' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/finance', icon: DollarSign, label: 'Finance' },
  { path: '/team', icon: UserCircle, label: 'Team' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/components', icon: Puzzle, label: 'UI Components' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, userProfile } = useStore();
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="glass fixed left-0 top-0 h-full z-50 flex flex-col border-r border-white/5 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shrink-0 glow">
          <Zap size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-lg tracking-tight accent-gradient"
            >
              NUVORA
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              title={sidebarCollapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                active
                  ? 'bg-gradient-to-r from-violet-500/20 to-blue-500/10 text-white border border-violet-500/20'
                  : 'text-secondary hover:text-primary hover:bg-white/5'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-violet-500 to-blue-500 rounded-r-full"
                />
              )}
              <Icon size={18} className={`shrink-0 ${active ? 'text-violet-400' : ''}`} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3">
          <Avatar name={userProfile.name} size="sm" className="shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-primary truncate">{userProfile.name}</p>
                <p className="text-xs text-muted truncate">{userProfile.jobTitle}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full glass border border-white/10 flex items-center justify-center text-secondary hover:text-primary transition-colors z-10"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
