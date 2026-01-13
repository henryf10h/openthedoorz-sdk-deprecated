'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useNetwork } from '@/lib/hooks/useNetwork.tsx';
import WalletManager, { WalletSession } from '@/app/components/WalletManager';
import VesuLending from '@/app/components/VesuLending';
import NetworkSelector from '@/app/components/NetworkSelector';
import Header from '@/app/components/Header';
import WalletPopup from '@/app/components/WalletPopup';
import Footer from '@/app/components/Footer';

export default function DashboardPage() {
  const { user, loading, signOut } = useFirebaseAuth();
  const { network } = useNetwork();
  const router = useRouter();
  const [walletSession, setWalletSession] = useState<WalletSession | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-transparent mx-auto"></div>
          <p className="text-zinc-600 font-medium uppercase tracking-widest text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-16">
      {/* Header del Prototipo */}
      <Header onOpenWallet={() => setIsWalletOpen(true)} />

      {/* Main Content */}
      <main className="pt-20 pb-20 px-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="inline-block px-3 py-1 border border-white/20 text-[10px] uppercase tracking-[0.3em] text-zinc-300 mb-4">
            Usuario Conectado: {user.email}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 leading-[0.9]">
            <span className="text-white">
              BIENVENIDO AL<br />ECOSISTEMA WEB3
            </span>
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl font-light leading-relaxed">
            Gestiona tu wallet, accede a Vesu para lending, y ejecuta transacciones gasless con ChipiPay desde una única interfaz.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left/Center: Main Feature Area */}
          <div className="lg:col-span-2">
            !walletSession ? (
              <div className="border border-gray-200 bg-white p-12 rounded-xl shadow-sm min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-zinc-500 text-sm uppercase tracking-widest mb-2">Paso 1</p>
                  <p className="text-black font-bold text-lg mb-4">Conecta tu Wallet</p>
                  <button 
                    onClick={() => setIsWalletOpen(true)}
                    className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-100 transition-colors uppercase tracking-widest text-sm"
                  >
                    Abrir Wallet
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 bg-white rounded-xl shadow-sm p-6">
                <VesuLending
                  walletInfo={{
                    publicKey: walletSession.publicKey,
                    walletId: walletSession.walletId
                  }}
                  encryptKey={walletSession.encryptKey}
                />
              </div>
            )}
          </div>

          {/* Right: Quick Access Panel */}
          <div className="space-y-6">
            {/* Network Selector */}
            <NetworkSelector />

            {/* Quick Wallet Status */}
            <div className="border border-gray-200 bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4">Estado del Sistema</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Red</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded uppercase tracking-widest ${
                    network === 'MAINNET' 
                      ? 'text-green-400 border border-green-400/30 bg-green-400/10' 
                      : 'text-orange-400 border border-orange-400/30 bg-orange-400/10'
                  }`}>
                    {network}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Usuario</span>
                  <span className="text-[10px] text-green-400 font-medium flex items-center gap-1.5 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Activo
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-black text-xs font-bold rounded-lg border border-gray-200 hover:border-gray-300 transition-all uppercase tracking-widest"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Wallet Popup - Componente del Prototipo */}
      <WalletPopup isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
