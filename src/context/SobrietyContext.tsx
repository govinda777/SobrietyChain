import React, { createContext, useContext, useState, useEffect } from 'react';
import { Milestone } from '../config/contracts';

const STORAGE_KEY = 'sobrietychain_clean_start_ms';

export interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalHours: number;
  totalDays: number;
}

interface SobrietyContextType {
  startTimeMs: number;
  elapsed: TimeElapsed;
  setStartTimeMs: (ms: number) => void;
  resetToNow: () => void;
  setPresetDaysAgo: (days: number) => void;
  isMilestoneUnlocked: (milestone: Milestone) => boolean;
  getProgressToMilestone: (milestone: Milestone) => number;
}

const SobrietyContext = createContext<SobrietyContextType | undefined>(undefined);

export const SobrietyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa o timestamp numérico a partir do localStorage
  const [startTimeMs, setStartTimeMsState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && !isNaN(Number(saved))) {
      return Number(saved);
    }
    // Padrão inicial: 24 horas atrás para o usuário já ver o relógio contando desde o primeiro acesso
    const defaultStart = Date.now() - (24 * 60 * 60 * 1000);
    localStorage.setItem(STORAGE_KEY, String(defaultStart));
    return defaultStart;
  });

  const calculateElapsed = (start: number): TimeElapsed => {
    const now = Date.now();
    const diffMs = Math.max(0, now - start);

    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = diffMs / (1000 * 60 * 60);
    const totalDays = diffMs / (1000 * 60 * 60 * 24);

    return { days, hours, minutes, seconds, totalHours, totalDays };
  };

  const [elapsed, setElapsed] = useState<TimeElapsed>(() => calculateElapsed(startTimeMs));

  // Tick a cada 1 segundo garantido
  useEffect(() => {
    setElapsed(calculateElapsed(startTimeMs));
    const interval = setInterval(() => {
      setElapsed(calculateElapsed(startTimeMs));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTimeMs]);

  const setStartTimeMs = (newMs: number) => {
    localStorage.setItem(STORAGE_KEY, String(newMs));
    setStartTimeMsState(newMs);
    setElapsed(calculateElapsed(newMs));
  };

  const resetToNow = () => {
    const now = Date.now();
    setStartTimeMs(now);
  };

  const setPresetDaysAgo = (days: number) => {
    const targetMs = Date.now() - (days * 24 * 60 * 60 * 1000);
    setStartTimeMs(targetMs);
  };

  // Regra de desbloqueio rigorosa: só libera o resgate se o usuário atingir o tempo
  const isMilestoneUnlocked = (milestone: Milestone): boolean => {
    if (milestone.daysRequired === 1) {
      // 24 horas requer no mínimo 24 horas completas
      return elapsed.totalHours >= 24;
    }
    return elapsed.days >= milestone.daysRequired;
  };

  // Porcentagem de progresso até a ficha (0 a 100%)
  const getProgressToMilestone = (milestone: Milestone): number => {
    if (milestone.daysRequired === 1) {
      return Math.min(100, Math.floor((elapsed.totalHours / 24) * 100));
    }
    return Math.min(100, Math.floor((elapsed.days / milestone.daysRequired) * 100));
  };

  return (
    <SobrietyContext.Provider
      value={{
        startTimeMs,
        elapsed,
        setStartTimeMs,
        resetToNow,
        setPresetDaysAgo,
        isMilestoneUnlocked,
        getProgressToMilestone,
      }}
    >
      {children}
    </SobrietyContext.Provider>
  );
};

export const useSobriety = (): SobrietyContextType => {
  const context = useContext(SobrietyContext);
  if (!context) {
    throw new Error('useSobriety deve ser utilizado dentro de um SobrietyProvider');
  }
  return context;
};
