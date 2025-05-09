export type Feasibility = 'Automatable' | 'Partially Automatable' | 'Non-Automatable';

export function classifyAutomation(domDiff: boolean, errors: string[]): Feasibility {
  if (errors.length > 0) return 'Non-Automatable';
  if (domDiff) return 'Partially Automatable';
  return 'Automatable';
}
