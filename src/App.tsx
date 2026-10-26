import React, { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { Header } from './components/Header';
import { SobrietyTimer } from './components/SobrietyTimer';
import { MilestoneCard } from './components/MilestoneCard';
import { SOBRIETY_MILESTONES, activeChain, EDITION_DROP_ADDRESS } from './config/contracts';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  HelpCircle, 
  Layers, 
  HeartHandshake, 
  ExternalLink 
} from 'lucide-react';

export const App: React.FC = () => {
  const account = useActiveAccount();
  const [filter, setFilter] = useState<'all' | 'milestones'>('all');

  const isContractConfigured = EDITION_DROP_ADDRESS !== '0x0000000000000000000000000000000000000000';

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      {/* Topo de Navegação */}
      <Header />

      {/* Alerta de Contrato não configurado caso o usuário ainda não tenha preenchido o .env */}
      {!isContractConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Atenção de Setup:</strong> Endereço do contrato Edition Drop ainda não configurado no arquivo <code>.env</code>. As fichas visuais estão em modo demonstração.
          </span>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        
        {/* Seção Hero & Filosofia */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Rede Base ({activeChain.name}) • Gas Patrocinado</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Celebre cada vitória. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Um dia de cada vez.
            </span>
          </h1>

          <p className="text-base text-slate-300 leading-relaxed font-light">
            Inspirado na tradição das fichas de sobriedade de <strong>Alcoólicos Anônimos</strong>. 
            Suas conquistas são registradas na blockchain com <strong>anonimato absoluto</strong>, 
            zero custo de transação e guarda perpétua.
          </p>

          {!account && (
            <p className="text-xs text-emerald-400/90 font-medium">
              💡 Não precisa de criptomoedas ou extensões. Conecte-se silenciosamente com seu E-mail, Google ou Passkey.
            </p>
          )}
        </div>

        {/* Componente de Contagem e Ciclo de 24 Horas */}
        <SobrietyTimer />

        {/* Grade de Fichas de Sobriedade */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Fichas e Medalhas de Sobriedade
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Do primeiro dia de coragem ao primeiro ano de serenidade reconquistada.
              </p>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todas as Fichas ({SOBRIETY_MILESTONES.length})
              </button>
            </div>
          </div>

          {/* Grid responsivo com os 5 marcos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOBRIETY_MILESTONES.map((milestone) => (
              <MilestoneCard key={milestone.tokenId.toString()} milestone={milestone} />
            ))}
          </div>
        </section>

        {/* Oração da Serenidade */}
        <section className="rounded-3xl serena-glass p-8 border border-serena-border text-center max-w-3xl mx-auto shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Oração da Serenidade
            </span>
            <blockquote className="text-lg sm:text-xl font-medium text-slate-100 italic leading-relaxed">
              "Concedei-me, Senhor, a serenidade necessária para aceitar as coisas que não posso modificar, 
              coragem para modificar aquelas que posso e sabedoria para distinguir umas das outras."
            </blockquote>
            <p className="text-xs text-slate-400 pt-2">
              — Princípio fundamental de sobriedade e paz interior
            </p>
          </div>
        </section>

        {/* Pilares da Arquitetura SobrietyChain */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Anonimato Rigoroso</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Respeitamos o princípio das 12 tradições. Nenhum nome, telefone ou documento é exigido ou gravado on-chain.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Gasless (ERC-4337)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Você não precisa comprar ETH nem pagar taxas de rede. O dApp SobrietyChain patrocina integralmente suas transações.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Perpetuidade Base</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tokens gravados na rede Base (Ethereum L2). Seu histórico de superação permanecerá acessível para sempre.
            </p>
          </div>
        </section>

        {/* Apoio Fraterno & Telefones Úteis */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="text-slate-300 font-semibold">Precisa de apoio em momentos de crise?</p>
              <p>Você nunca está sozinho. Existem grupos de apoio gratuitos e anônimos 24 horas por dia.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.aa.org.br"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 underline"
            >
              Alcoólicos Anônimos (Brasil) <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://cvv.org.br"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 underline"
            >
              CVV (Ligue 188) <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>

      </main>

      {/* Rodapé Estático */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>SobrietyChain dApp • Hospedado 100% de forma estática no GitHub Pages</p>
          <p className="text-slate-400 font-medium">"Apenas por 24 horas."</p>
        </div>
      </footer>
    </div>
  );
};
