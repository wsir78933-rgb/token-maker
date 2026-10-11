import { useEffect, useId, useRef, useState } from 'react';

import type { PopulationGeneratorCopy } from './population-generator-copy';
import type { PopulationFileNotice } from './use-population-generator';

import styles from './PopulationGeneratorWorkbench.module.css';

interface PopulationGeneratorFileMenuProps {
  copy: PopulationGeneratorCopy;
  onExport: () => void;
  onImport: () => void;
  onPrint: () => void;
}

function fileNoticeText(copy: PopulationGeneratorCopy, notice: PopulationFileNotice): string | null {
  switch (notice.kind) {
    case 'idle':
      return null;
    case 'choosing':
      return copy.fileChoosing;
    case 'reading':
      return copy.fileReading;
    case 'success':
    case 'error':
      return notice.message;
    default: {
      const unexpected: never = notice;
      throw new Error(`Unknown population file notice ${JSON.stringify(unexpected)}.`);
    }
  }
}

export function PopulationGeneratorFileMenu({
  copy,
  onExport,
  onImport,
  onPrint,
}: PopulationGeneratorFileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function closeOnPointerDown(event: PointerEvent): void {
      if (event.target instanceof Node && rootRef.current?.contains(event.target)) {
        return;
      }
      setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', closeOnPointerDown);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnPointerDown);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  function choose(action: () => void): void {
    setOpen(false);
    action();
  }

  return (
    <div className={styles.fileMenu} ref={rootRef}>
      <button
        type="button"
        className={styles.quietButton}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <span className={styles.desktopMenuLabel}>{copy.fileMenu}</span>
        <span className={styles.mobileMenuLabel}>{copy.fileMenuMobile}</span>
      </button>
      {open ? (
        <div id={menuId} className={styles.menuPanel} role="menu">
          <button type="button" className={styles.menuItem} role="menuitem" onClick={() => choose(onExport)}>
            {copy.exportTxt}
          </button>
          <button type="button" className={styles.menuItem} role="menuitem" onClick={() => choose(onImport)}>
            {copy.importFile}
          </button>
          <button type="button" className={styles.menuItem} role="menuitem" onClick={() => choose(onPrint)}>
            {copy.printFull}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function PopulationFileNotice({
  copy,
  notice,
}: {
  copy: PopulationGeneratorCopy;
  notice: PopulationFileNotice;
}) {
  const noticeText = fileNoticeText(copy, notice);
  if (noticeText === null) {
    return null;
  }

  return (
    <p
      className={notice.kind === 'error' ? styles.inlineError : styles.inlineStatus}
      role={notice.kind === 'error' ? 'alert' : 'status'}
      data-population-file-notice={notice.kind}
    >
      {noticeText}
    </p>
  );
}
