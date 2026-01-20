'use client';

import React, { useState } from 'react';
import { Database, TrendingUp, Layers, ArrowUp, ArrowDown, Settings, X, RotateCw, EyeOff, ExternalLink, ArrowRight, Zap, Globe, Shield, Mail, CheckCircle2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const Landing: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleWaitingListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('waiting_list')
        .insert([
          {
            email: email.toLowerCase().trim(),
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === '23505') {
          setMessage({ type: 'error', text: 'This email is already on the waiting list' });
        } else {
          setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        }
      } else {
        setMessage({ type: 'success', text: 'Successfully joined the waiting list!' });
        setEmail('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };
  const partnerLogos = [
    { src: "https://avatars.githubusercontent.com/u/104390117", alt: "Starknet Foundation", class: "h-16 md:h-20" },
    { src: "https://www.cairo-lang.org/wp-content/uploads/2024/03/Cairo-logo.png", alt: "Cairo", class: "h-16 md:h-20" },
    { src: "https://www.gstatic.com/devrel-devsite/prod/ve08add287a6b4bdf8961ab8a1be50bf551be3816cdd70b7cc934114ff3ad5f10/firebase/images/touchicon-180.png", alt: "Firebase", class: "h-16 md:h-20" },
    { src: "https://avatars.githubusercontent.com/u/104390117", alt: "Starknet Foundation", class: "h-16 md:h-20" },
    { src: "https://www.cairo-lang.org/wp-content/uploads/2024/03/Cairo-logo.png", alt: "Cairo", class: "h-16 md:h-20" },
    { src: "https://www.gstatic.com/devrel-devsite/prod/ve08add287a6b4bdf8961ab8a1be50bf551be3816cdd70b7cc934114ff3ad5f10/firebase/images/touchicon-180.png", alt: "Firebase", class: "h-16 md:h-20" },
  ];

  // Double the logos for a seamless infinite loop
  const carouselLogos = [...partnerLogos, ...partnerLogos];

  return (
    <div className="pt-20 pb-20 overflow-x-hidden">
      {/* CSS for Infinite Carousel */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50%)); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 35s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Section */}
      <section className="px-6 max-w-7xl mx-auto flex flex-col justify-start pt-2 min-h-[70vh]">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-4">
          <div className="order-1 lg:order-2">
            <div className="inline-block px-3 py-1 border border-emerald-500/20 text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-6 font-bold bg-emerald-500/5">
              Institutional Grade Web3 Loyalty
            </div>

            <br />
            <br />
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 leading-[0.9]">
              <span className="text-white">
                Your direct bridge to Web3.
              </span>
            </h1>
            <br />
            <br />
            <p className="text-xl text-zinc-300 max-w-xl font-light leading-relaxed">
              It allows banks to onboard their users on Starknet without complex wallets, using only their email.
              No custodial of private keys, no transaction fees, and built-in access to lending solutions.
            </p>

            {/* Waiting List Form */}
            <div className="mt-8 max-w-xl">
              <form onSubmit={handleWaitingListSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 bg-black border border-white/20 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <RotateCw size={18} className="animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Waiting List</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Success/Error Messages */}
              {message && (
                <div className={`mt-4 p-4 border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                  {message.type === 'success' && <CheckCircle2 size={20} />}
                  {message.type === 'error' && <X size={20} />}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}
            </div>

          </div>

          {/* Wallet Preview in Hero - Now visible on mobile too */}
          <div className="relative order-2 block mt-12 lg:mt-0">
            <div className="absolute -inset-20 bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 border border-white/20 bg-black w-full max-w-[380px] mx-auto shadow-[0_0_100px_rgba(255,255,255,0.05)]">

              {/* Total Value Section */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Value</span>
                    <RotateCw size={10} className="text-zinc-500" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-[8px] font-bold text-emerald-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    Mainnet Network
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-white">$1,14</span>
                    <EyeOff size={18} className="text-zinc-500" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-widest hover:text-white cursor-pointer transition-colors">
                    Live <ExternalLink size={10} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 p-4 border-b border-white/10">
                <div className="flex items-center justify-center gap-2 py-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <ArrowUp size={14} className="text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Send</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <ArrowDown size={14} className="text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Receive</span>
                </div>
              </div>

              {/* Lending Promo */}
              <div className="p-4 border-b border-white/10">
                <div className="p-4 border border-blue-500/30 bg-gradient-to-r from-blue-600/10 to-transparent flex items-center justify-between hover:bg-blue-600/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                      <TrendingUp size={20} className="text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-white uppercase tracking-wider">Lending & Loans</span>
                      <span className="text-[10px] text-zinc-400 font-medium">Earn Institutional Yield</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                </div>
              </div>

              {/* Assets Section */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Assets</span>
                  <div className="h-0.5 bg-white mt-1 w-full max-w-[120px] mx-auto"></div>
                </div>

                <div className="space-y-4">
                  {/* Ethereum Item */}
                  <div className="flex items-center justify-between p-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded">
                        <svg width="16" height="16" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                          <path fill="#fff" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
                          <path fill="#fff" d="M127.962 0L0 212.32l127.962 75.638V154.158z" />
                          <path fill="#fff" d="M127.961 312.187l-1.575 1.92V417l1.575-4.61 128.038-180.32z" />
                          <path fill="#fff" d="M127.962 417V312.187L0 232.07z" />
                          <path fill="#fff" d="M127.961 287.958l127.96-75.637-127.96-58.162z" opacity=".2" />
                          <path fill="#fff" d="M0 212.32l127.962 75.638V154.158z" opacity=".4" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-white">Ethereum</span>
                        <span className="text-[10px] text-zinc-500 font-medium">0.00034 ETH</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-[12px] font-bold text-white">$1,14</span>
                      <span className="text-[8px] text-zinc-500 font-medium">$3355,25 / unit</span>
                    </div>
                  </div>

                  {/* Starknet Item */}
                  <div className="flex items-center justify-between p-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded overflow-hidden">
                        <img src="https://avatars.githubusercontent.com/u/104390117" alt="Starknet" className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-white">Starknet</span>
                        <span className="text-[10px] text-zinc-500 font-medium">0.00 STRK</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-[12px] font-bold text-white">$0,00</span>
                      <span className="text-[8px] text-zinc-500 font-medium">$0,088 / unit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Powered By Infinite Carousel */}
        <div className="w-full mt-4 py-8 border-t border-white/5 overflow-hidden">
          <div className="relative">
            {/* Masking Gradients */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

            <div className="animate-scroll">
              {carouselLogos.map((logo, index) => (
                <div
                  key={index}
                  className="relative group px-6 md:px-16 flex items-center justify-center min-w-[140px] md:min-w-[200px]"
                >
                  {/* Halo Glow Effect */}
                  <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-[2.5] z-0"></div>

                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`${logo.class} relative z-10 transition-all duration-500 hover:scale-110 active:scale-95 object-contain`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="w-full py-24 border-t border-white/5 bg-zinc-950/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">

              {/* Left Column: Use Case Rows */}
              <div className="order-2 lg:order-1 space-y-4">
                {[
                  {
                    name: "Open The Doorz Rewards",
                    description: "Reward users for account creation and daily missions through a seamless Web3 loyalty experience.",
                    url: "https://rewards.openthedoorz.com",
                    icon: <Zap size={20} className="text-amber-400" />,
                    color: "border-amber-500/20 hover:border-amber-500/40"
                  },
                  {
                    name: "NeoPawn White label B2B",
                    description: "White label B2B lending infrastructure enabling banks and lenders to access decentralized liquidity.",
                    url: "https://www.neopawn.com",
                    icon: <Layers size={20} className="text-blue-400" />,
                    color: "border-blue-500/20 hover:border-blue-500/40"
                  },
                  {
                    name: "Kleo E2E Loan Agent",
                    description: "Standardize communication between banking entities and tokenize loans for secure, auditable institutional liquidity.",
                    url: "https://kleo.live/#enterprise",
                    icon: <Shield size={20} className="text-purple-400" />,
                    color: "border-purple-500/20 hover:border-purple-500/40"
                  }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-6 bg-black border ${item.color} transition-all duration-300 group hover:translate-x-2`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-lg font-bold text-white tracking-tight uppercase">{item.name}</h4>
                          <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-md">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={20} className="text-zinc-600 group-hover:text-zinc-200 transition-colors" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Right Column: Institutional Header Style */}
              <div className="order-1 lg:order-2">
                <div className="inline-block px-3 py-1 border border-emerald-500/20 text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-6 font-bold bg-emerald-500/5">
                  Powered by Infrastructure
                </div>
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[0.9] text-white">
                  Real-world<br />
                  Utility.
                </h2>
                <div className="w-20 h-1 bg-white mb-8"></div>
                <p className="text-xl text-zinc-300 font-light leading-relaxed">
                  These leading protocols and platforms are built on top of the
                  <span className="text-white font-bold"> Open The Doorz </span>
                  infrastructure to bridge traditional finance with the next generation of on-chain liquidity.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-4 py-8 border-t border-white/5 overflow-hidden">
          <div className="relative">
            {/* Masking Gradients */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

            <div className="animate-scroll">
              {carouselLogos.map((logo, index) => (
                <div
                  key={index}
                  className="relative group px-6 md:px-16 flex items-center justify-center min-w-[140px] md:min-w-[200px]"
                >
                  {/* Halo Glow Effect */}
                  <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-[2.5] z-0"></div>

                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`${logo.class} relative z-10 transition-all duration-500 hover:scale-110 active:scale-95 object-contain`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reflecter Labs Section */}
        <div className="w-full py-32 border-t border-white/5 bg-black relative overflow-hidden">
          {/* Background Visual */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="text-zinc-500 font-black text-[20vw] tracking-tighter select-none">
              LATAM
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
            <div className="inline-block px-3 py-1 border border-zinc-500/20 text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-8 font-bold bg-zinc-500/5">
              Web3 Innovation Labs
            </div>

            <h2 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.9] text-white text-center">
              Developed by<br />
              Reflecter Labs.
            </h2>

            <div className="w-20 h-1 bg-white mb-8"></div>

            <p className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed mb-12 max-w-2xl text-center">
              Built by a world-class <span className="text-white font-bold">Latin American</span> laboratory focused on creating
              the next generation of financial infrastructure.
            </p>

            <a
              href="https://reflecterlabs.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 px-10 py-5 border border-white text-white hover:bg-white hover:text-black transition-all duration-500"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Explore reflecterlabs.xyz</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
