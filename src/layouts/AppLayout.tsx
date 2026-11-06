import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopNav } from '../components/layout/TopNav';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';

export function AppLayout() {
  const { sidebarCollapsed, theme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.theme);
    const root = document.documentElement;
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-2', theme.accentSecondary);
    root.style.setProperty('--glass-blur', `${theme.glassBlur}px`);
    root.style.setProperty('--radius', `${theme.borderRadius}px`);
    root.style.setProperty('--shadow-intensity', theme.shadowIntensity.toString());
    root.style.setProperty('--spacing-card', theme.cardSpacing === 'compact' ? '1rem' : theme.cardSpacing === 'relaxed' ? '2rem' : '1.5rem');
  }, [theme]);

  const ml = sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]';

  return (
    <div className="min-h-screen bg-primary">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <Sidebar />
      <TopNav />

      <motion.main
        className={`${ml} pt-[60px] min-h-screen transition-all duration-300`}
        initial={false}
      >
        <div className="p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
