import { Check } from 'lucide-react';

import type { Difficulty } from '../../lib/api';
import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: 'bg-diff-easy-bg border-diff-easy-line',
  hard: 'bg-diff-hard-bg border-diff-hard-line',
  delusional: 'bg-diff-delusional-bg border-diff-delusional-line',
};

export interface DifficultyCardProps {
  difficulty: Difficulty;
  selected: boolean;
  onSelect: (difficulty: Difficulty) => void;
  /** Radio group name; the fieldset legend carries the visible label. */
  name: string;
}

/** Single-select difficulty card (FR-N-4). */
export function DifficultyCard({ difficulty, selected, onSelect, name }: DifficultyCardProps) {
  const copy = COPY.newHabit.difficultyOptions[difficulty];

  return (
    <label
      className={cn(
        'relative flex min-h-20 cursor-pointer flex-col justify-center gap-0.5 rounded-md border p-3',
        'transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-strong',
        selected
          ? DIFFICULTY_STYLES[difficulty]
          : 'border-line bg-surface hover:border-line-strong',
      )}
    >
      <input
        type="radio"
        name={name}
        value={difficulty}
        checked={selected}
        onChange={() => onSelect(difficulty)}
        className="sr-only"
      />
      {selected ? (
        <Check
          aria-hidden="true"
          strokeWidth={3}
          className="absolute right-2 top-2 size-3.5 text-ink"
        />
      ) : null}
      <span className="type-card text-ink">{copy.title}</span>
      <span className="type-caption text-muted">{copy.description}</span>
    </label>
  );
}
