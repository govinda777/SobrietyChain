import React from 'react';
import { ConnectButton } from 'thirdweb/react';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { client } from '../client';
import { activeChain } from '../config/contracts';
import { ShieldCheck, Sparkles, Feather } from 'lucide-react';

const wallets = [
  inAppWallet({
    auth: {
      options: ['email', 'google', 'passkey', 'guest'],
    },
  }),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
];

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-serena-dark/80 border-b border-serena-border/70 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logotipo e Identidade SobrietyChain */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-emerald-900/30">
            <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center">
              <Feather className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SobrietyChain
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                100% Anônimo
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Marcos de Sobriedade Web3 • Apenas por hoje
            </p>
          </div>
        </div>

        {/* Informações de Rede e Botão de Conexão */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Transações Patrocinadas (Sem Gas)</span>
          </div>

          <ConnectButton
            client={client}
            chain={activeChain}
            wallets={wallets}
            accountAbstraction={{
              chain: activeChain,
              sponsorGas: true,
            }}
            connectButton={{
              label: 'Entrar com Serenidade',
              className: '!bg-gradient-to-r !from-emerald-600 !to-teal-600 hover:!from-emerald-500 hover:!to-teal-500 !text-white !font-medium !text-sm !px-4 !py-2.5 !rounded-xl !shadow-md !shadow-emerald-900/30 !transition-all !duration-200 !border-0',
            }}
            connectModal={{
              title: 'SobrietyChain — Identidade Silenciosa',
              size: 'compact',
              showThirdwebBranding: false,
              privacyPolicyUrl: 'https://pt.wikipedia.org/wiki/Alco%C3%B3licos_An%C3%B4nimos',
              termsOfServiceUrl: '#',
            }}
            detailsButton={{
              className: '!bg-slate-900/90 !border !border-slate-800 hover:!border-slate-700 !rounded-xl !text-slate-200 !text-sm',
            }}
            theme="dark"
          />
        </div>
      </div>
    </header>
  );
};
