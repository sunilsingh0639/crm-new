import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/layout/Sidebar';
import { TopNav } from '../components/layout/TopNav';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';

export function AppLayout() {
  const { sidebarCollapsed, theme } = useStore();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.theme);
    const root = document.documentElement;
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-2', theme.accentSecondary);
    root.style.setProperty('--glass-blur', `${theme.glassBlur}px`);
    root.style.setProperty('--blur-md', `${theme.glassBlur}px`);
    root.style.setProperty('--radius', `${theme.borderRadius}px`);
    root.style.setProperty('--shadow-intensity', theme.shadowIntensity.toString());
    root.style.setProperty('--spacing-card',
      theme.cardSpacing === 'compact' ? '1rem' :
      theme.cardSpacing === 'relaxed' ? '2rem' : '1.5rem'
    );
  }, [theme]);

  const ml = sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]';

  return (
    <div className="min-h-screen relative">
      {/* ── Atmospheric Background ── */}
      <div className="nuvora-bg" />

      {/* ── Animated floating orbs ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            top: '-15%', left: '-10%',
            background: 'radial-gradient(circle, rgba(99,60,220,0.22) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            top: '10%', right: '-8%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.16) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, -35, 0], y: [0, 45, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            bottom: '5%', left: '30%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, 25, 0], y: [0, -30, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            bottom: '20%', right: '15%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
        />
      </div>

      {/* ── Layout ── */}
      <div className="relative z-10">
        <Sidebar />
        <TopNav />

        <motion.main
          className={`${ml} pt-[64px] min-h-screen transition-all duration-300`}
          initial={false}
        >
          <div className="p-5 lg:p-6">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <Outlet />
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
