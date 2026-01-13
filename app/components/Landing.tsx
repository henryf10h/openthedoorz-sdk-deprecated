
import React from 'react';
import Link from 'next/link';
import { Shield, Zap, Cpu, Database, TrendingUp, Layers, ArrowUp, ArrowDown } from 'lucide-react';

const Landing: React.FC = () => {
  const partnerLogos = [
    { src: "https://avatars.githubusercontent.com/u/104390117", alt: "Starknet Foundation", class: "h-16 md:h-20" },
    { src: "https://www.cairo-lang.org/wp-content/uploads/2024/03/Cairo-logo.png", alt: "Cairo", class: "h-16 md:h-20" },
    { src: "https://www.gstatic.com/devrel-devsite/prod/ve08add287a6b4bdf8961ab8a1be50bf551be3816cdd70b7cc934114ff3ad5f10/firebase/images/touchicon-180.png", alt: "Firebase", class: "h-16 md:h-20" },
    { src: "https://www.chipipay.com/chipi-white.png", alt: "ChipiPay", class: "h-12 md:h-14" },
    { src: "https://docs.vesu.xyz/img/logo.png", alt: "Vesu", class: "h-10 md:h-12 brightness-0 invert" }
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
          <div className="order-1">
            <div className="inline-block px-3 py-1 border border-gray-200 text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4 animate-pulse">
              Universal Web3 SDK v1.0
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 leading-[0.95]">
              <span className="text-black">
                La Infraestructura DeFI de préstamos
                <br />que toda institución necesita
              </span>
            </h1>
            <p className="text-xl text-zinc-700 max-w-xl font-light leading-relaxed">
              Unlock the full potential of Web3 with a single line of code. OpenTheDoorz provides social login, encrypted cloud storage, y servicios DeFI.
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <Link
                href="https://openthedoorz.gitbook.io/open-the-doorz/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center gap-2"
              >
                View Documentation
              </Link>
              <Link
                href="https://www.reflecterlabs.xyz/start-project"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-black/10 text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black/5 transition-all flex items-center gap-2"
              >
                Start Project
              </Link>
            </div>
          </div>

          {/* Wallet Preview in Hero - Now visible on mobile too */}
          <div className="relative order-2 block mt-12 lg:mt-0">
            {/* Simplified light-themed wallet preview */}
            <div className="relative z-10 border border-black/5 bg-white w-full max-w-[380px] mx-auto shadow-md lg:rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="p-4 border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-xs">OTD</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">Preview Mode</span>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-white border border-black/5 mb-4 flex flex-col relative overflow-hidden">
                  <div className="p-4">
                    <div className="text-[8px] uppercase text-zinc-700 font-bold tracking-widest mb-1">Active Wallet</div>
                    <div className="font-mono text-[10px] text-zinc-600 mb-2 tracking-tighter">0x0471...952a</div>
                    <div className="text-2xl font-extrabold tracking-tighter text-black">$5,352.60</div>
                  </div>
                  <div className="grid grid-cols-2 border-t border-black/5 bg-white">
                    <div className="py-2.5 flex items-center justify-center gap-1.5 border-r border-black/5 text-[8px] uppercase font-bold tracking-widest text-zinc-700">
                      <ArrowUp size={10} /> Send
                    </div>
                    <div className="py-2.5 flex items-center justify-center gap-1.5 text-[8px] uppercase font-bold tracking-widest text-zinc-700">
                      <ArrowDown size={10} /> Receive
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mb-6">
                  {['Storage', 'Lending', 'Staging'].map((label, idx) => (
                    <div key={label} className="flex flex-col items-center gap-1 p-2 border border-black/5 bg-white">
                      {idx === 0 ? <Database size={12} className="text-zinc-700" /> : idx === 1 ? <TrendingUp size={12} className="text-zinc-700" /> : <Layers size={12} className="text-zinc-700" />}
                      <span className="text-[7px] uppercase font-bold tracking-widest text-zinc-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel removed per design update */}
      </section>

      {/* Features Grid */}
      <section className="px-6 max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white mt-12 border border-gray-100 rounded-lg">
        <FeatureCard 
          icon={<Shield size={24} />} 
          title="Serverless Identity" 
          desc="Drop-in social login and non-custodial wallet creation using secure email/password auth protocols."
        />
        <FeatureCard 
          icon={<Zap size={24} />} 
          title="Universal Bridge" 
          desc="Low-latency transaction execution and cross-chain bridging capabilities built directly into the SDK."
        />
        <FeatureCard 
          icon={<Database size={24} />} 
          title="Cloud Storage" 
          desc="Encrypted user data and session management powered by Firebase for a persistent Web3 profile."
        />
        <FeatureCard 
          icon={<Cpu size={24} />} 
          title="One-Line Integration" 
          desc="A comprehensive developer experience designed for high-performance applications and clean stacks."
        />
      </section>

      {/* Code Preview Section */}
      <section className="px-6 max-w-5xl mx-auto mt-40">
            <div className="border border-gray-100 p-1">
          <div className="bg-gray-50 p-6 md:p-12 border border-gray-100 rounded">
            <h2 className="text-3xl font-bold tracking-tight mb-6 uppercase tracking-tighter text-black">INTEGRATE IN MINUTES</h2>
            <div className="bg-gray-100 border border-gray-100 rounded p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-zinc-800">
                <code>{`// Initialize OpenTheDoorz
import { DoorzProvider } from '@openthedoorz/sdk';

function App() {
  return (
    <DoorzProvider 
      apiKey="your_api_key" 
      storage="serverless-firebase"
      bridge="auto"
    >
      <YourApp />
    </DoorzProvider>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-8 group hover:bg-zinc-50 transition-colors border border-gray-100">
    <div className="mb-6 text-zinc-700 group-hover:text-black transition-colors">{icon}</div>
    <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-black">{title}</h3>
    <p className="text-sm text-zinc-600 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
