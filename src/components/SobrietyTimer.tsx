import React, { useState } from 'react';
import { Calendar, Clock, Award, HeartHandshake, RotateCcw, Zap } from 'lucide-react';
import { SOBRIETY_MILESTONES } from '../config/contracts';
import { useSobriety } from '../context/SobrietyContext';

export const SobrietyTimer: React.FC = () => {
  const { elapsed, startTimeMs, resetToNow, setStartTimeMs, setPresetDaysAgo } = useSobriety();

  // Helper para converter timestamp numérico em formato compatível com input datetime-local no fuso do usuário
  const toLocalIsoString = (ms: number) => {
    const date = new Date(ms);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - tzOffset);
    return localDate.toISOString().slice(0, 16);
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempDateStr, setTempDateStr] = useState<string>(() => toLocalIsoString(startTimeMs));

  const handleOpenEdit = () => {
    setTempDateStr(toLocalIsoString(startTimeMs));
    setIsEditing(true);
  };

  const handleSaveDate = () => {
    if (!tempDateStr) return;
    const parsed = new Date(tempDateStr).getTime();
    if (!isNaN(parsed)) {
      setStartTimeMs(parsed);
    }
    setIsEditing(false);
  };

  const handleResetToNow = () => {
    resetToNow();
    setTempDateStr(toLocalIsoString(Date.now()));
    setIsEditing(false);
  };

  // Cálculo da porcentagem do ciclo diário de 24 horas (0 a 100%)
  const currentDayProgressPercent = Math.min(
    100,
    Math.floor(((elapsed.hours * 60 + elapsed.minutes) / (24 * 60)) * 100)
  );

  // Próximo marco baseado no tempo decorrido
  const nextMilestone =
    SOBRIETY_MILESTONES.find((m) => elapsed.days < m.daysRequired) ||
    SOBRIETY_MILESTONES[SOBRIETY_MILESTONES.length - 1];

  return (
    <section className="relative overflow-hidden rounded-3xl serena-glass p-6 sm:p-8 border border-serena-border shadow-2xl">
      {/* Luz ambiente suave */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Bloco de Mensagem & Filosofia de 24h */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Só Por Hoje • Um Dia de Cada Vez</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Seu Tempo em Serenidade
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-lg leading-relaxed">
            Não importa se você tem 24 horas ou 20 anos: a recuperação acontece sempre no dia de hoje.
            O relógio calcula seus marcos e sincroniza com os resgates de cada ficha.
          </p>

          {/* Ciclo diário de 24 horas */}
          <div className="mt-5 max-w-md">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Ciclo diário atual (24h)
              </span>
              <span className="text-emerald-400 font-semibold">{currentDayProgressPercent}% concluído</span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${currentDayProgressPercent}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              {23 - elapsed.hours >= 0 ? 23 - elapsed.hours : 0}h e {59 - elapsed.minutes >= 0 ? 59 - elapsed.minutes : 0}m restantes para completar o ciclo de 24 horas atual.
            </p>
          </div>
        </div>

        {/* Mostrador Numérico do Tempo & Controles */}
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
            {/* Dias */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 w-20 sm:w-24 shadow-inner">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {elapsed.days}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                Dias
              </span>
            </div>

            {/* Horas */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 w-20 sm:w-24 shadow-inner">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {String(elapsed.hours).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                Horas
              </span>
            </div>

            {/* Minutos */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 w-20 sm:w-24 shadow-inner">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {String(elapsed.minutes).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                Minutos
              </span>
            </div>

            {/* Segundos */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 w-20 sm:w-24 shadow-inner">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {String(elapsed.seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                Segundos
              </span>
            </div>
          </div>

          {/* Configuração da Data de Início */}
          <div className="mt-4 flex items-center gap-3">
            {isEditing ? (
              <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-900/95 border border-slate-700">
                <input
                  type="datetime-local"
                  value={tempDateStr}
                  onChange={(e) => setTempDateStr(e.target.value)}
                  className="bg-slate-800 text-xs text-white px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSaveDate}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
                >
                  Salvar
                </button>
                <button
                  onClick={handleResetToNow}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
                  title="Reiniciar para agora"
                >
                  Agora
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1.5 text-slate-400 hover:text-slate-200 text-xs"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-700/80 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Ajustar Minha Data Inicial
                </button>

                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Deseja reiniciar a contagem para agora? Recomeçar com sinceridade e serenidade faz parte do caminho.'
                      )
                    ) {
                      handleResetToNow();
                    }
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition text-xs"
                  title="Zerar e recomeçar para agora"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>
              </div>
            )}
          </div>

          {/* Atalhos Rápidos de Simulação para Testes de Fichas */}
          <div className="mt-3.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/70 text-center max-w-sm">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-medium mb-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Simular Marcos (Para Testar Desbloqueios):</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                onClick={() => resetToNow()}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                0 Horas
              </button>
              <button
                onClick={() => setPresetDaysAgo(1)}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                24 Horas
              </button>
              <button
                onClick={() => setPresetDaysAgo(30)}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                30 Dias
              </button>
              <button
                onClick={() => setPresetDaysAgo(90)}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                90 Dias
              </button>
              <button
                onClick={() => setPresetDaysAgo(180)}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                6 Meses
              </button>
              <button
                onClick={() => setPresetDaysAgo(365)}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                1 Ano
              </button>
            </div>
          </div>

          {/* Destaque do próximo marco */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Próximo marco:{' '}
              <strong className="text-slate-200">{nextMilestone.name}</strong> ({nextMilestone.daysRequired} dias)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
