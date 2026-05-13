import { calculateSixSymbol, getChineseHour, SIX_SYMBOLS } from './liuren';
import { getLunarDate } from './lunar';
import { getAvailableOptions } from './session';
import type {
  DecisionSession,
  OptionSymbolAssignment,
  SixSymbol,
  SixSymbolDecision,
  SixSymbolKey,
  SymbolPoolCell
} from './types';

export interface DrawSixSymbolDecisionOptions {
  readonly now?: Date;
  readonly shuffleOptions?: boolean;
  readonly random?: () => number;
}

const SYMBOL_SCORES: Record<SixSymbolKey, number> = {
  daan: 5,
  suxi: 4,
  xiaoji: 4,
  liulian: 2,
  chikou: 1,
  kongwang: 0
};

export function drawSixSymbolDecision(
  session: DecisionSession,
  options: DrawSixSymbolDecisionOptions = {}
): DecisionSession {
  const available = getAvailableOptions(session);
  if (available.length === 0) {
    throw new Error('没有可速选的选项');
  }

  const now = options.now ?? new Date();
  const lunar = getLunarDate(now);
  const chineseHour = getChineseHour(now);
  const baseSymbol = calculateSixSymbol({
    lunarMonth: lunar.lunarMonth,
    lunarDay: lunar.lunarDay,
    hourIndex: chineseHour.index
  });
  const arrangedOptions = options.shuffleOptions
    ? shuffleOptionTexts(available, options.random ?? Math.random)
    : available;
  const optionSymbols = assignOptionSymbols(arrangedOptions, baseSymbol);
  const rankedOptions = rankAssignments(optionSymbols);
  const selected = rankedOptions[0];
  const optionText = selected.optionText;
  const currentDecision: SixSymbolDecision = {
    baseSymbol,
    startSymbol: baseSymbol,
    symbol: selected.symbol,
    optionText,
    title: `${selected.symbol.name}落在：${optionText}`,
    message: buildDecisionMessage(selected.symbol.name, optionText, selected.symbol.summary),
    recommendedAction: selected.symbol.recommendedAction,
    generatedAt: now.getTime(),
    lunar,
    chineseHour,
    optionPool: arrangedOptions,
    symbolPool: SIX_SYMBOLS,
    optionSymbols,
    rankedOptions,
    symbolCells: buildSymbolCells(optionSymbols)
  };

  return {
    ...session,
    currentResult: optionText,
    currentDecision
  };
}

function shuffleOptionTexts(options: string[], random: () => number): string[] {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const value = random();
    const normalized = Number.isFinite(value) ? Math.min(Math.max(value, 0), 0.999999) : 0;
    const targetIndex = Math.floor(normalized * (index + 1));
    [shuffled[index], shuffled[targetIndex]] = [shuffled[targetIndex], shuffled[index]];
  }
  return shuffled;
}

function assignOptionSymbols(options: string[], baseSymbol: SixSymbol): OptionSymbolAssignment[] {
  const baseIndex = SIX_SYMBOLS.findIndex((item) => item.key === baseSymbol.key);
  const startIndex = baseIndex >= 0 ? baseIndex : 0;

  return options.map((optionText, index) => {
    const symbol = SIX_SYMBOLS[(startIndex + index) % SIX_SYMBOLS.length];
    return {
      optionText,
      symbol,
      score: SYMBOL_SCORES[symbol.key]
    };
  });
}

function rankAssignments(
  optionSymbols: readonly OptionSymbolAssignment[]
): OptionSymbolAssignment[] {
  return [...optionSymbols].sort((left, right) => {
    const scoreDiff = right.score - left.score;
    if (scoreDiff !== 0) return scoreDiff;
    return (
      optionSymbols.findIndex((item) => item.optionText === left.optionText) -
      optionSymbols.findIndex((item) => item.optionText === right.optionText)
    );
  });
}

function buildSymbolCells(
  optionSymbols: readonly OptionSymbolAssignment[]
): readonly SymbolPoolCell[] {
  return SIX_SYMBOLS.map((symbol) => ({
    key: symbol.key,
    name: symbol.name,
    optionTexts: optionSymbols
      .filter((assignment) => assignment.symbol.key === symbol.key)
      .map((assignment) => assignment.optionText)
  }));
}

function buildDecisionMessage(symbolName: string, optionText: string, summary: string): string {
  return `按当前时辰起局，${optionText}落${symbolName}。${summary}`;
}
