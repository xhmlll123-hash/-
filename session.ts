import { getTemplateById } from './templates';
import type { DecisionSession, TemplateId } from './types';
import { normalizeOptionText } from './optionLibrary';

export function createSession(templateId: TemplateId): DecisionSession {
  const template = getTemplateById(templateId);
  return {
    templateId,
    title: template.name,
    pool: [],
    excluded: [],
    currentResult: null,
    currentDecision: null
  };
}

export function createQuickSession(firstRawText = '1', secondRawText = '2'): DecisionSession {
  const firstText = normalizeOptionText(firstRawText);
  const secondText = normalizeOptionText(secondRawText);
  if (!firstText || !secondText || firstText === secondText) {
    throw new Error('极速起局需要两个不同选项');
  }

  return {
    ...createSession('custom'),
    title: '极速起局',
    pool: [firstText, secondText]
  };
}

export function addOptionToSession(session: DecisionSession, rawText: string): DecisionSession {
  const text = normalizeOptionText(rawText);
  if (!text || session.pool.includes(text)) {
    return session;
  }

  return {
    ...session,
    pool: [...session.pool, text],
    currentResult: null,
    currentDecision: null
  };
}

export function removeOptionFromSession(session: DecisionSession, text: string): DecisionSession {
  return {
    ...session,
    pool: session.pool.filter((item) => item !== text),
    excluded: session.excluded.filter((item) => item !== text),
    currentResult: session.currentResult === text ? null : session.currentResult,
    currentDecision: session.currentResult === text ? null : session.currentDecision
  };
}

export function getAvailableOptions(session: DecisionSession): string[] {
  return session.pool.filter((text) => !session.excluded.includes(text));
}

export function drawRandom(
  session: DecisionSession,
  random: () => number = Math.random
): DecisionSession {
  const available = getAvailableOptions(session);
  if (available.length === 0) {
    throw new Error('没有可抽取的选项');
  }

  const value = random();
  const normalized = Number.isFinite(value) ? Math.max(0, value) : 0;
  const index = Math.min(Math.floor(normalized * available.length), available.length - 1);
  return {
    ...session,
    currentResult: available[index],
    currentDecision: null
  };
}

export function excludeCurrentResult(session: DecisionSession): DecisionSession {
  if (!session.currentResult || session.excluded.includes(session.currentResult)) {
    return {
      ...session,
      currentResult: null,
      currentDecision: null
    };
  }

  return {
    ...session,
    excluded: [...session.excluded, session.currentResult],
    currentResult: null,
    currentDecision: null
  };
}

export function resetCurrentResult(session: DecisionSession): DecisionSession {
  return {
    ...session,
    currentResult: null,
    currentDecision: null
  };
}

export function restoreExcludedOptions(session: DecisionSession): DecisionSession {
  return {
    ...session,
    excluded: [],
    currentResult: null,
    currentDecision: null
  };
}
