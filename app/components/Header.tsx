'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNetwork } from '@/lib/hooks/useNetwork';

interface HeaderProps {
  onOpenWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenWallet }) => {
  const pathname = usePathname();
  const { network } = useNetwork();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/otd.webp" alt="OTD" className="w-48 h-48 object-contain" />
        </div>
        
        <div className="flex items-center gap-4">
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
