import { getContract } from 'thirdweb';
import { sepolia, baseSepolia, base } from 'thirdweb/chains';
import { client } from '../client';

// Define a rede padrão com base nas variáveis de ambiente
const chainEnv = import.meta.env.VITE_ACTIVE_CHAIN;
export const activeChain =
  chainEnv === 'base'
    ? base
    : chainEnv === 'base-sepolia'
    ? baseSepolia
    : sepolia;

// Endereço do contrato Edition Drop (ERC-1155)
export const EDITION_DROP_ADDRESS =
  import.meta.env.VITE_EDITION_DROP_ADDRESS ||
  '0x0000000000000000000000000000000000000000';

/**
 * Instância do contrato Edition Drop para leitura e mintagem/resgate
 */
export const sobrietyContract = getContract({
  client,
  chain: activeChain,
  address: EDITION_DROP_ADDRESS,
});

export interface Milestone {
  tokenId: bigint;
  name: string;
  durationLabel: string;
  daysRequired: number;
  rarity: 'Comum' | 'Incomum' | 'Rara' | 'Épica' | 'Lendária';
  themeColor: string;
  accentBorder: string;
  glowClass: string;
  motto: string;
  description: string;
  symbol: string;
}

/**
 * Metadados dos 5 marcos de sobriedade representados por Token IDs do ERC-1155.
 */
export const SOBRIETY_MILESTONES: Milestone[] = [
  {
    tokenId: 0n,
    name: 'Ficha de 24 Horas',
    durationLabel: '24 Horas',
    daysRequired: 1,
    rarity: 'Comum',
    themeColor: '#94A3B8', // Prata
    accentBorder: 'border-slate-400/40 hover:border-slate-300',
    glowClass: 'shadow-slate-500/10 hover:shadow-slate-400/20',
    motto: 'Apenas por hoje.',
    description: 'O início de tudo. A vitória fundamental conquistada minuto a minuto, completando o primeiro ciclo de sobriedade.',
    symbol: '⚪',
  },
  {
    tokenId: 1n,
    name: 'Ficha de 30 Dias',
    durationLabel: '30 Dias (1 Mês)',
    daysRequired: 30,
    rarity: 'Incomum',
    themeColor: '#F43F5E', // Carmim
    accentBorder: 'border-rose-500/40 hover:border-rose-400',
    glowClass: 'shadow-rose-500/10 hover:shadow-rose-500/25',
    motto: 'Um dia de cada vez.',
    description: 'Um mês de mente limpa e novos hábitos sendo forjados. A névoa começa a dissipar, revelando a serenidade.',
    symbol: '🔴',
  },
  {
    tokenId: 2n,
    name: 'Ficha de 90 Dias',
    durationLabel: '90 Dias (3 Meses)',
    daysRequired: 90,
    rarity: 'Rara',
    themeColor: '#F59E0B', // Âmbar
    accentBorder: 'border-amber-500/40 hover:border-amber-400',
    glowClass: 'shadow-amber-500/10 hover:shadow-amber-500/25',
    motto: 'A clareza se consolida.',
    description: 'O marco dos três meses consolida o compromisso com a recuperação e demonstra a força da persistência.',
    symbol: '🟡',
  },
  {
    tokenId: 3n,
    name: 'Ficha de 6 Meses',
    durationLabel: '6 Meses (Meio Ano)',
    daysRequired: 180,
    rarity: 'Épica',
    themeColor: '#10B981', // Esmeralda
    accentBorder: 'border-emerald-500/40 hover:border-emerald-400',
    glowClass: 'shadow-emerald-500/10 hover:shadow-emerald-500/25',
    motto: 'Renovação e Esperança.',
    description: 'Meio ano de liberdade. A reconstrução pessoal e espiritual se torna evidente para você e ao seu redor.',
    symbol: '🟢',
  },
  {
    tokenId: 4n,
    name: 'Ficha de 1 Ano',
    durationLabel: '1 Ano (365 Dias)',
    daysRequired: 365,
    rarity: 'Lendária',
    themeColor: '#3B82F6', // Safira
    accentBorder: 'border-blue-500/50 hover:border-blue-400',
    glowClass: 'shadow-blue-500/15 hover:shadow-blue-500/30',
    motto: 'Uma nova maneira de viver.',
    description: 'Um ano inteiro sem ceder. Um testemunho vivo de resiliência, humildade e triunfo pessoal contínuo.',
    symbol: '🔵',
  },
];
