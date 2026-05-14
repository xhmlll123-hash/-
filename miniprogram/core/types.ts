export type TemplateId = 'food' | 'place' | 'buy' | 'priority' | 'custom';

export interface DecisionTemplate {
  readonly id: TemplateId;
  readonly name: string;
  readonly description: string;
  readonly inputPlaceholder: string;
  readonly examples: readonly string[];
}

export interface OptionItem {
  id: string;
  templateId: TemplateId;
  text: string;
  poolCount: number;
  chosenCount: number;
  lastUsedAt: number;
  pinned: boolean;
}

export interface SuggestionItem {
  text: string;
  source: 'history' | 'example';
}

export type SixSymbolKey = 'daan' | 'liulian' | 'suxi' | 'chikou' | 'xiaoji' | 'kongwang';

export type SixSymbolAction = 'accept' | 'reroll' | 'avoid';

export interface SixSymbol {
  readonly key: SixSymbolKey;
  readonly name: string;
  readonly tone: 'steady' | 'delay' | 'quick' | 'cautious' | 'light' | 'empty';
  readonly hint: string;
  readonly summary: string;
  readonly recommendedAction: SixSymbolAction;
}

export interface OptionSymbolAssignment {
  readonly optionText: string;
  readonly symbol: SixSymbol;
  readonly score: number;
}

export interface SymbolPoolCell {
  readonly key: SixSymbolKey;
  readonly name: string;
  readonly optionTexts: readonly string[];
}

export interface ChineseHour {
  readonly index: number;
  readonly name: string;
  readonly rangeLabel: string;
}

export interface LunarDate {
  readonly lunarYear: number;
  readonly lunarMonth: number;
  readonly lunarDay: number;
  readonly isLeapMonth: boolean;
}

export interface SixSymbolDecision {
  readonly baseSymbol: SixSymbol;
  readonly startSymbol: SixSymbol;
  readonly symbol: SixSymbol;
  readonly optionText: string;
  readonly title: string;
  readonly message: string;
  readonly recommendedAction: SixSymbolAction;
  readonly generatedAt: number;
  readonly lunar: LunarDate;
  readonly chineseHour: ChineseHour;
  readonly optionPool: string[];
  readonly symbolPool: readonly SixSymbol[];
  readonly optionSymbols: readonly OptionSymbolAssignment[];
  readonly rankedOptions: readonly OptionSymbolAssignment[];
  readonly symbolCells: readonly SymbolPoolCell[];
}

export interface DecisionSession {
  templateId: TemplateId;
  title: string;
  pool: string[];
  excluded: string[];
  currentResult: string | null;
  currentDecision: SixSymbolDecision | null;
}

export interface DecisionRecord {
  templateId: TemplateId;
  finalChoice: string;
  createdAt: number;
}
