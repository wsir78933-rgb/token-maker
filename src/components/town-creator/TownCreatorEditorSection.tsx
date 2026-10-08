'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { TOWN_CREATOR_EDITOR_ID } from '@/lib/town-creator/copy';

import styles from './TownCreatorEditorSection.module.css';

const TOWN_CREATOR_EDITOR_CLASS_NAME =
  'mx-auto w-full max-w-[96rem] scroll-mt-20 px-3 pt-2 pb-8 sm:px-6 sm:pt-4 sm:pb-10 lg:px-8';

function readTownEditorVisibility(entries: readonly IntersectionObserverEntry[]): boolean {
  const entry = entries[0];
  if (entry === undefined) {
    throw new Error(
      `Town creator editor observer returned no entries. Received ${JSON.stringify(entries)}.`,
    );
  }

  return entry.isIntersecting;
}

export function TownCreatorEditorSection({
  children,
}: {
  readonly children: ReactNode;
}) {
  const editorSectionRef = useRef<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const editorSection = editorSectionRef.current;
    if (editorSection === null) {
      throw new Error(
        `Town creator editor section is missing. id=${JSON.stringify(TOWN_CREATOR_EDITOR_ID)}.`,
      );
    }

    if (typeof IntersectionObserver === 'undefined') {
      throw new Error(
        `Town creator editor requires IntersectionObserver. Received ${JSON.stringify(typeof IntersectionObserver)}.`,
      );
    }

    const observer = new IntersectionObserver((entries) => {
      setIsIntersecting(readTownEditorVisibility(entries));
    });
    observer.observe(editorSection);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={editorSectionRef}
      id={TOWN_CREATOR_EDITOR_ID}
      className={`${TOWN_CREATOR_EDITOR_CLASS_NAME} ${styles.editorSection}`}
      data-in-view={isIntersecting ? 'true' : 'false'}
    >
      {children}
    </section>
  );
}
