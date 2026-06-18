'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MagicLampIcon } from '@/components/icons/MagicLampIcon';
import { NAV_LINKS } from '@/lib/constants';
import type { NavLink } from '@/lib/types';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleSmoothScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // If it's a regular link without a hash, let it navigate normally
      if (!href.includes('#')) {
        setIsMobileMenuOpen(false);
        return;
      }

      e.preventDefault();
      setIsMobileMenuOpen(false);
      const targetId = href.split('#')[1];
      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    [],
  );

  return (
    <>
      <motion.nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#09090b]/80 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/[0.06]'
            : 'bg-transparent border-b border-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* ─── Logo ─── */}
          <a href="#" id="navbar-logo" className="flex items-center gap-2 group">
            <span className="relative flex items-center justify-center w-8 h-8">
              <MagicLampIcon className="relative w-12 h-12" animated={true} />
            </span>
            <span className="text-xl font-bold tracking-tight font-serif flex items-center">
              <motion.span 
                className="text-white"
                animate={{
                  color: ['#ffffff', '#c4b5fd', '#ffffff']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                JINI
              </motion.span>
              <motion.span 
                className="text-[#e8b84b] ml-1"
                animate={{
                  textShadow: [
                    '0px 0px 4px rgba(232, 184, 75, 0)',
                    '0px 0px 12px rgba(232, 184, 75, 0.8)',
                    '0px 0px 4px rgba(232, 184, 75, 0)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                AI
              </motion.span>
            </span>
          </a>

          {/* ─── Desktop Navigation ─── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link: NavLink) => (
              <a
                key={link.href}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="relative px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.04] group"
              >
                {link.label}
                {/* Underline indicator */}
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 group-hover:w-5 h-px bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* ─── Desktop CTA ─── */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              id="navbar-cta"
              variant="primary"
              size="sm"
              href="#hero-input"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Blueprint
            </Button>
          </div>

          {/* ─── Mobile Menu Toggle ─── */}
          <button
            id="navbar-mobile-toggle"
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ─── Mobile Menu Panel ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              id="navbar-mobile-backdrop"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              id="navbar-mobile-menu"
              className="fixed top-16 right-0 z-50 w-full sm:w-80 h-[calc(100dvh-4rem)] bg-[#09090b]/95 backdrop-blur-2xl border-l border-white/[0.06] md:hidden overflow-y-auto"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex flex-col p-6 gap-2">
                {NAV_LINKS.map((link: NavLink, i: number) => (
                  <motion.a
                    key={link.href}
                    id={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className="flex items-center gap-3 px-4 py-3 text-base text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors duration-200"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3, ease: 'easeOut' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-50" />
                    {link.label}
                  </motion.a>
                ))}

                {/* Divider */}
                <div className="my-4 h-px bg-white/[0.06]" />

                {/* Mobile CTA */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  <Button
                    id="navbar-mobile-cta"
                    variant="primary"
                    size="lg"
                    href="#hero-input"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Blueprint
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
