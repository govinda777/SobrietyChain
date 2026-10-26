import React, { useState } from 'react';
import { ClaimButton, useActiveAccount, useReadContract } from 'thirdweb/react';
import { balanceOf } from 'thirdweb/extensions/erc1155';
import { client } from '../client';
import { activeChain, EDITION_DROP_ADDRESS, Milestone, sobrietyContract } from '../config/contracts';
import { CheckCircle, Sparkles, AlertCircle, Shield, Lock, Unlock } from 'lucide-react';
import { useSobriety } from '../context/SobrietyContext';

interface MilestoneCardProps {
  milestone: Milestone;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  const account = useActiveAccount();
  const { isMilestoneUnlocked, getProgressToMilestone, elapsed } = useSobriety();
  const [claimStatus, setClaimStatus] = useState<'idle' | 'claiming' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Consulta do saldo de tokens deste Token ID para o usuário conectado
  const { data: balance, refetch } = useReadContract(balanceOf, {
    contract: sobrietyContract,
    owner: account?.address || '0x0000000000000000000000000000000000000000',
    tokenId: milestone.tokenId,
    queryOptions: {
      enabled: !!account?.address && EDITION_DROP_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  });

  const hasClaimed = balance ? balance > 0n : false;
  const isUnlocked = isMilestoneUnlocked(milestone);
  const progressPercent = getProgressToMilestone(milestone);

  // Render do emblema da ficha física estilo Alcoólicos Anônimos
  const renderCoinBadge = () => {
    return (
      <div className="relative group/coin mx-auto my-3 flex items-center justify-center">
        {/* Glow de fundo ativo apenas se desbloqueada */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition duration-500 ${
            isUnlocked ? 'opacity-30 group-hover/coin:opacity-60' : 'opacity-0'
          }`}
          style={{ backgroundColor: milestone.themeColor }}
        />

        {/* Ficha circular tridimensional */}
        <div
          className={`relative w-32 h-32 rounded-full p-2 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
            isUnlocked ? 'group-hover/coin:scale-105' : 'grayscale opacity-60 contrast-75'
          }`}
          style={{
            background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${milestone.themeColor} 45%, #0f172a 100%)`,
            border: `3px solid rgba(255, 255, 255, 0.4)`,
            boxShadow: isUnlocked
              ? `0 10px 25px -5px ${milestone.themeColor}40, inset 0 2px 6px rgba(255,255,255,0.6), inset 0 -3px 8px rgba(0,0,0,0.7)`
              : `0 5px 15px -3px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Anel interno */}
          <div className="w-full h-full rounded-full border border-white/40 flex flex-col items-center justify-center text-center p-1 backdrop-brightness-95">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/90 drop-shadow-md">
              SOBRIETYCHAIN
            </span>
            <span className="text-xl font-black text-white tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] my-0.5">
              {milestone.durationLabel.split(' ')[0]}
            </span>
            <span className="text-[9px] font-semibold text-white/95 uppercase tracking-tighter drop-shadow-sm">
              {milestone.durationLabel.split(' ').slice(1).join(' ') || 'SERENIDADE'}
            </span>
            <div className="mt-1 w-6 h-0.5 bg-white/60 rounded-full" />
          </div>

          {/* Ícone de Cadeado quando bloqueada */}
          {!isUnlocked && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-slate-950/40 backdrop-blur-[1px]">
              <div className="p-2 rounded-full bg-slate-900/80 border border-slate-700/80 shadow-lg text-slate-300">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative rounded-3xl serena-glass p-6 flex flex-col justify-between border transition-all duration-300 hover:-translate-y-1 ${
        isUnlocked ? milestone.accentBorder : 'border-slate-800'
      } ${isUnlocked ? milestone.glowClass : ''}`}
    >
      {/* Topo do Card: Rarity & Status */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
            style={{
              color: milestone.themeColor,
              borderColor: `${milestone.themeColor}40`,
              backgroundColor: `${milestone.themeColor}15`,
            }}
          >
            {milestone.rarity}
          </span>

          <div className="flex items-center gap-1.5">
            {hasClaimed ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Conquistada ({balance?.toString()})
              </span>
            ) : isUnlocked ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-300 bg-teal-950/60 border border-teal-500/30 px-2 py-0.5 rounded-full">
                <Unlock className="w-3 h-3 text-teal-400" />
                Disponível
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400/90 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3 text-amber-400" />
                Bloqueada ({progressPercent}%)
              </span>
            )}
          </div>
        </div>

        {/* Emblema Gráfico */}
        {renderCoinBadge()}

        {/* Informações Textuais */}
        <div className="text-center mt-2">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {milestone.name}
          </h3>
          <p className="text-xs font-medium text-emerald-400/90 italic mt-0.5">
            "{milestone.motto}"
          </p>
          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            {milestone.description}
          </p>
        </div>
      </div>

      {/* Rodapé e Ação de Resgate */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Tempo Mínimo Exigido:</span>
          <span className="font-semibold text-slate-200">
            {milestone.daysRequired === 1 ? '24 horas' : `${milestone.daysRequired} dias`}
          </span>
        </div>

        {/* Barra de Progresso quando ainda não desbloqueou */}
        {!isUnlocked && (
          <div className="mb-3 space-y-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>Progresso para desbloqueio:</span>
              <span className="text-amber-400 font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800/90 rounded-full h-1.5 overflow-hidden border border-slate-700/60">
              <div
                className="h-1.5 rounded-full transition-all duration-500 bg-amber-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 text-center">
              {milestone.daysRequired === 1
                ? `Faltam ${Math.max(0, 24 - elapsed.totalHours).toFixed(1)}h de sobriedade`
                : `Faltam ${Math.max(0, milestone.daysRequired - elapsed.days)} dias de sobriedade`}
            </p>
          </div>
        )}

        {/* Feedback visual de estado de Claim */}
        {claimStatus === 'success' && (
          <div className="mb-3 p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ficha resgatada com sucesso! Parabéns pela sua conquista.</span>
          </div>
        )}

        {claimStatus === 'error' && (
          <div className="mb-3 p-2 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{errorMessage || 'Erro ao processar resgate.'}</span>
          </div>
        )}

        {/* Botão de Reivindicação Thirdweb v5 ou Botão Desabilitado por Tempo */}
        {!account ? (
          <div className="text-center py-2.5 px-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            Conecte sua carteira para resgatar
          </div>
        ) : !isUnlocked ? (
          <button
            type="button"
            disabled
            className="w-full py-2.5 rounded-xl font-semibold text-xs bg-slate-800/80 border border-slate-700/60 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2 shadow-inner"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400/80" />
            <span>
              Bloqueada • Requer{' '}
              {milestone.daysRequired === 1 ? '24 horas' : `${milestone.daysRequired} dias`}
            </span>
          </button>
        ) : (
          <ClaimButton
            contractAddress={EDITION_DROP_ADDRESS}
            chain={activeChain}
            client={client}
            claimParams={{
              type: 'ERC1155',
              tokenId: milestone.tokenId,
              quantity: 1n,
            }}
            onTransactionSent={() => {
              setClaimStatus('claiming');
              setErrorMessage(null);
            }}
            onTransactionConfirmed={async () => {
              setClaimStatus('success');
              if (refetch) await refetch();
            }}
            onError={(error) => {
              setClaimStatus('error');
              setErrorMessage(error.message || 'Falha na transação');
            }}
            className="!w-full !py-2.5 !rounded-xl !font-semibold !text-xs !transition-all !duration-200 !cursor-pointer hover:!brightness-110 !shadow-md"
            style={{
              backgroundColor: milestone.themeColor,
              color: '#ffffff',
            }}
          >
            {hasClaimed ? 'Resgatar Mais Uma Ficha' : `Resgatar ${milestone.name}`}
          </ClaimButton>
        )}
      </div>
    </div>
  );
};
