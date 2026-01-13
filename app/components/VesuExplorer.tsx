'use client';

import React, { useState } from 'react';
import {
    ChevronLeft,
    TrendingUp,
    Zap,
    Lock,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle
} from 'lucide-react';

import useVesuPool from '@/lib/hooks/useVesuPool';
import WalletManager, { WalletSession } from './WalletManager';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useTokenBalance } from '@/lib/hooks/useTokenBalance';

interface VesuExplorerProps {
    onBack: () => void;
    walletSession?: WalletSession | null;
    onSessionChange?: (session: WalletSession | null) => void;
}

export const VesuExplorer: React.FC<VesuExplorerProps> = ({ onBack, walletSession, onSessionChange }) => {
    const { deposit, withdraw, isLoading: isPoolLoading } = useVesuPool();

    const { wallet } = useFetchWallet();
    const { balance: strkBalance, isLoading: balanceLoading } = useTokenBalance('STRK', wallet?.publicKey);

    const [amount, setAmount] = useState<string>('1');
    const [activeTab, setActiveTab] = useState<'stake' | 'withdraw'>('stake');

    // Safe fallbacks for optional session callbacks/values
    const safeOnSessionChange: (session: WalletSession | null) => void = onSessionChange ?? (() => {});
    const safeWalletSession: WalletSession | null = walletSession ?? null;

    const isLoading = isPoolLoading;
    // local result state for tx feedback
    const [txId, setTxId] = useState<string | null>(null);
    const [error, setError] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleAction = async () => {
        if (!walletSession || !wallet) return;

        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        if (activeTab === 'stake') {
            const balance = parseFloat(strkBalance || '0');
            if (numAmount > balance) {
                alert(`Insufficient STRK balance. You have ${strkBalance} STRK.`);
                return;
            }

            try {
                const hash = await deposit({
                    amount: String(numAmount),
                    receiver: wallet.publicKey,
                });
                setTxId(hash as string | null);
                setIsSuccess(Boolean(hash));
                setError(null);
            } catch (err) {
                console.error('Staking failed:', err);
                setError(err);
                setIsSuccess(false);
            }
        } else {
            try {
                const hash = await withdraw({ amount: String(numAmount), recipient: wallet.publicKey });
                setTxId(hash as string | null);
                setIsSuccess(Boolean(hash));
                setError(null);
            } catch (err) {
                console.error('Withdrawal failed:', err);
                setError(err);
                setIsSuccess(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-full p-6 animate-in fade-in duration-300">
            <div className="shrink-0">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                >
                    <ChevronLeft size={14} /> Back to Assets
                </button>


            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col items-center justify-start pt-10 p-4">
                <div className="w-full max-w-sm space-y-8 text-center">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-black uppercase tracking-tighter">
                            {activeTab === 'stake' ? 'Deposit & Earn' : 'Withdraw from Vault'}
                        </h2>
                        <p className="text-sm text-zinc-400 leading-relaxed font-light">
                            {activeTab === 'stake'
                                ? 'Deposit your STRK into Vesu pools to start earning institutional-grade yield.'
                                : 'Withdraw your STRK from the Vesu vault back to your wallet.'}
                        </p>
                    </div>

                    <div className="pt-4 space-y-4">
                        {/* Tabs: Deposit / Withdraw */}
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => setActiveTab('stake')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-colors ${
                                    activeTab === 'stake'
                                        ? 'bg-white text-black'
                                        : 'bg-zinc-900/30 text-zinc-400 hover:text-white'
                                }`}
                            >
                                <ArrowUpCircle size={14} /> Deposit
                            </button>
                            <button
                                onClick={() => setActiveTab('withdraw')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-colors ${
                                    activeTab === 'withdraw'
                                        ? 'bg-white text-black'
                                        : 'bg-zinc-900/30 text-zinc-400 hover:text-white'
                                }`}
                            >
                                <ArrowDownCircle size={14} /> Withdraw
                            </button>
                        </div>
                        {!walletSession ? (
                            <div className="bg-zinc-900/50 border border-amber-500/20 p-6 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-500">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
                                        <Lock size={20} className="text-amber-500" />
                                    </div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Vault Locked</h3>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider">
                                        Please unlock your security vault (PIN) <br />
                                        to enable lending operations.
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <WalletManager
                                        onSessionChange={safeOnSessionChange}
                                        walletSession={safeWalletSession}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Balance Display Card (Only for Stake) */}
                                {activeTab === 'stake' && (
                                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                                <Wallet size={16} className="text-blue-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Available Balance</p>
                                                <p className="text-sm font-mono font-bold text-white">
                                                    {balanceLoading ? '---' : strkBalance} <span className="text-zinc-500">STRK</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setAmount(strkBalance || '0')}
                                            className="text-[9px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/5 px-2 py-1 rounded border border-blue-400/10"
                                        >
                                            Use Max
                                        </button>
                                    </div>
                                )}

                                {/* Amount Input */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            {activeTab === 'stake' ? 'Amount to Stake' : 'Amount to Withdraw'}
                                        </label>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">STRK</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-lg focus:outline-none focus:border-white/20 transition-all text-center"
                                    />
                                </div>

                                <button
                                    onClick={handleAction}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                                    ) : (
                                        <Zap size={14} className="group-hover:fill-black transition-all" />
                                    )}
                                    {isLoading
                                        ? (activeTab === 'stake' ? 'Depositing...' : 'Withdrawing...')
                                        : (activeTab === 'stake' ? 'Deposit' : 'Withdraw')}
                                </button>

                                {isSuccess && txId && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-400 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                                        {activeTab === 'stake' ? 'Deposit Successful!' : 'Withdrawal Successful!'} <br />
                                        <span className="font-mono text-zinc-500">{txId.slice(0, 20)}...</span>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-bold uppercase tracking-widest">
                                        {error.message || 'Error occurred'}
                                    </div>
                                )}
                            </div>
                        )}

                        <p className="mt-4 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
                            Powered by Vesu Protocol
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};
