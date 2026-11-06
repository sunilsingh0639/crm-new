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
  { path: '/',           icon: LayoutDashboard, label: 'Overview' },
  { path: '/analytics',  icon: BarChart3,        label: 'Analytics' },
  { path: '/crm',        icon: Users,            label: 'CRM' },
  { path: '/projects',   icon: FolderKanban,     label: 'Projects' },
  { path: '/tasks',      icon: CheckSquare,      label: 'Tasks' },
  { path: '/finance',    icon: DollarSign,       label: 'Finance' },
  { path: '/team',       icon: UserCircle,       label: 'Team' },
  { path: '/calendar',   icon: Calendar,         label: 'Calendar' },
  { path: '/reports',    icon: FileText,         label: 'Reports' },
  { path: '/components', icon: Puzzle,           label: 'UI Components' },
  { path: '/settings',   icon: Settings,         label: 'Settings' },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, userProfile } = useStore();
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 244 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed left-0 top-0 h-full z-50 flex flex-col overflow-hidden"
      style={{
        background: 'var(--glass-floating-bg)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderRight: '1px solid var(--glass-floating-border)',
        boxShadow: '4px 0 40px rgba(0,0,0,0.30), inset -1px 0 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 py-5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <motion.div
          whileHover={{ scale: 1.08, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(99,102,241,0.9) 100%)',
            boxShadow: '0 4px 20px rgba(139,92,246,0.50), inset 0 1px 0 rgba(255,255,255,0.25)',
            border: '1px solid rgba(255,255,255,0.20)',
          }}
        >
          <Zap size={17} className="text-white" />
        </motion.div>

        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="font-bold text-[17px] tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, #c4b5fd 0%, #a5b4fc 50%, #67e8f9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                NUVORA
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden scroll-area">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              title={sidebarCollapsed ? label : undefined}
              className="block"
            >
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all duration-200 relative cursor-pointer ${
                  active ? 'nav-active' : 'hover:bg-white/[0.06]'
                }`}
              >
                {/* Active left bar */}
                {active && (
                  <motion.div
                    layoutId="sidebarActiveBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, rgb(var(--accent)), rgb(var(--accent-cyan)))' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}

                <Icon
                  size={17}
                  className={`shrink-0 transition-colors ${
                    active ? 'text-violet-300' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`text-[13px] font-medium whitespace-nowrap overflow-hidden ${
                        active ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active dot when collapsed */}
                {active && sidebarCollapsed && (
                  <motion.div
                    layoutId="sidebarActiveDot"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-400"
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* ── User Profile ── */}
      <div className="shrink-0 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <motion.div
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          className="flex items-center gap-3 p-2 rounded-[14px] cursor-pointer transition-colors"
        >
          <Avatar name={userProfile.name} size="sm" className="shrink-0 ring-2 ring-violet-500/30" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[13px] font-semibold text-white truncate">{userProfile.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{userProfile.jobTitle}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Collapse Toggle ── */}
      <motion.button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute -right-3.5 top-[88px] w-7 h-7 rounded-full flex items-center justify-center z-10 transition-colors"
        style={{
          background: 'var(--glass-floating-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.30)',
        }}
      >
        {sidebarCollapsed
          ? <ChevronRight size={13} className="text-slate-300" />
          : <ChevronLeft  size={13} className="text-slate-300" />
        }
      </motion.button>
    </motion.aside>
  );
}
