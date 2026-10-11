import type { ChangeEvent } from 'react';

import styles from './PopulationGeneratorWorkbench.module.css';

interface PopulationTextControlProps {
  id: string;
  label: string;
  value: string;
  onChange: (nextText: string) => void;
}

interface PopulationNumberControlProps {
  id: string;
  label: string;
  value: string;
  error: string | null;
  inputMode: 'numeric' | 'decimal';
  onChange: (rawText: string) => void;
  onBlur: () => void;
}

export function PopulationTextControl({ id, label, value, onChange }: PopulationTextControlProps) {
  return (
    <div className={styles.labeledControl}>
      <label className={styles.hiddenLabel} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={styles.textInput}
        type="text"
        value={value}
        autoComplete="off"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
}

export function PopulationNumberControl({
  id,
  label,
  value,
  error,
  inputMode,
  onChange,
  onBlur,
}: PopulationNumberControlProps) {
  const errorId = `${id}-error`;
  return (
    <div className={styles.labeledControl}>
      <label className={styles.hiddenLabel} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={styles.textInput}
        type="text"
        inputMode={inputMode}
        value={value}
        autoComplete="off"
        spellCheck={false}
        aria-invalid={error !== null}
        aria-describedby={error !== null ? errorId : undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value);
        }}
        onBlur={onBlur}
      />
      {error !== null ? (
        <p id={errorId} className={styles.fieldError} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
