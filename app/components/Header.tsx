'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNetwork } from '@/lib/hooks/useNetwork';

interface HeaderProps {
  onOpenWallet: () => void;
}

import ThemeToggle from './ThemeToggle';

const Header: React.FC<HeaderProps> = ({ onOpenWallet }) => {
  const pathname = usePathname();
  const { network } = useNetwork();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/90 backdrop-blur-md border-b border-black/5 dark:border-white/10">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <img src="/docs/OpenTheDoorz%20-%20Logotype%20(1).png" alt="OpenTheDoorz" className="h-8 w-auto object-contain" />
            <span className="text-sm font-bold tracking-tight hover:opacity-80 transition-opacity text-black dark:text-white">OPEN THE DOORZ</span>
          </Link>
          <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-widest ${
            network === 'MAINNET' 
              ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' 
              : 'border-amber-500/50 text-amber-500 bg-amber-500/10'
          }`}>
            {network}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="https://openthedoorz.gitbook.io/open-the-doorz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
          >
            Docs
          </Link>
          <button 
            onClick={onOpenWallet}
            className="px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all"
          >
            WALLET
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
