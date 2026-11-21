'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ThemeMode = 'dark' | 'light' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Apply theme to document element
  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else if (mode === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem('airastra-theme') as ThemeMode) || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Listener for system color scheme changes when in 'system' mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const current = (localStorage.getItem('airastra-theme') as ThemeMode) || 'dark';
      if (current === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectTheme = (newMode: ThemeMode) => {
    setTheme(newMode);
    localStorage.setItem('airastra-theme', newMode);
    applyTheme(newMode);
    setIsOpen(false);
  };

  if (!mounted) {
    return (
      <div className="inline-flex size-9 items-center justify-center rounded-md border border-border text-neutral-400">
        <Moon className="size-4" />
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Current theme: ${theme}. Click to change.`}
        aria-label="Toggle color theme (Light, Dark, System)"
        aria-expanded={isOpen}
        className={cn(
          'inline-flex size-9 items-center justify-center rounded-md border text-sm transition-colors cursor-pointer',
          isOpen
            ? 'border-brand text-brand bg-neutral-800/40 dark:bg-neutral-800/50'
            : 'border-border text-neutral-400 hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40'
        )}
      >
        {theme === 'dark' && <Moon className="size-4 text-neutral-200" />}
        {theme === 'light' && <Sun className="size-4 text-amber-500" />}
        {theme === 'system' && <Laptop className="size-4 text-neutral-300" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border border-border/60 bg-card p-1.5 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={() => selectTheme('light')}
            className={cn(
              'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              theme === 'light'
                ? 'bg-brand/10 text-brand font-semibold'
                : 'text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            )}
          >
            <div className="flex items-center gap-2">
              <Sun className="size-3.5 text-amber-500" />
              <span>Light</span>
            </div>
            {theme === 'light' && <Check className="size-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => selectTheme('dark')}
            className={cn(
              'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              theme === 'dark'
                ? 'bg-brand/10 text-brand font-semibold'
                : 'text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            )}
          >
            <div className="flex items-center gap-2">
              <Moon className="size-3.5 text-neutral-200" />
              <span>Dark</span>
            </div>
            {theme === 'dark' && <Check className="size-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => selectTheme('system')}
            className={cn(
              'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              theme === 'system'
                ? 'bg-brand/10 text-brand font-semibold'
                : 'text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            )}
          >
            <div className="flex items-center gap-2">
              <Laptop className="size-3.5 text-neutral-300" />
              <span>System</span>
            </div>
            {theme === 'system' && <Check className="size-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}
