import type { ReferenceNavigationId, ReferenceToolId } from './workbench-copy';

type CoatToolGlyphId = ReferenceToolId | ReferenceNavigationId;

interface CoatToolGlyphProps {
  toolId: CoatToolGlyphId;
}

/** Original, small geometric category glyphs for the coat-maker tool rail. */
export function CoatToolGlyph({ toolId }: CoatToolGlyphProps) {
  return <svg aria-hidden="true" className="coat-tool-glyph" data-tool-glyph={toolId} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
    <GlyphMarks toolId={toolId} />
  </svg>;
}

function GlyphMarks({ toolId }: CoatToolGlyphProps) {
  if (toolId === 'position') return <>
    <path d="m5 8 7-4 7 4-7 4-7-4Z" />
    <path d="m5 12 7 4 7-4M5 16l7 4 7-4" />
  </>;
  if (toolId === 'shields') return <path d="M6 4h12v8c0 4.6-2.5 6.8-6 8-3.5-1.2-6-3.4-6-8V4Z" />;
  if (toolId === 'custom') return <>
    <path d="M6 4h12v8c0 4.6-2.5 6.8-6 8-3.5-1.2-6-3.4-6-8V4Z" />
    <path d="M12 5v13" />
  </>;
  if (toolId === 'charges') return <>
    <circle cx="12" cy="12" r="3.2" />
    <path d="m12 3 1.4 4.1M21 12l-4.1 1.4M12 21l-1.4-4.1M3 12l4.1-1.4M18.4 5.6l-2.9 3M18.4 18.4l-3-2.9M5.6 18.4l2.9-3M5.6 5.6l3 2.9" />
  </>;
  if (toolId === 'top') return <path d="M4 18h16M5 16l1.5-8 5.5 4 5.5-4 1.5 8M7 6V4m5 5V3m5 3V4" />;
  if (toolId === 'colors') return <>
    <path d="M12 4a8 8 0 1 0 0 16h1.5a1.5 1.5 0 0 0 0-3H12a1.5 1.5 0 0 1 0-3h1a7 7 0 0 0 0-10Z" />
    <path d="M8 9h.01M11 7h.01M15 8h.01M7 13h.01" strokeWidth="3" />
  </>;
  if (toolId === 'tools') return <>
    <path d="m14 5 5 5-3 3-5-5 3-3Z" />
    <path d="m10 9-5 5m-1 5 3-3m0 0 4 4m-4-4-3-3" />
  </>;
  if (toolId === 'how-to') return <>
    <circle cx="12" cy="12" r="8" />
    <path d="m10 9 5 3-5 3V9Z" />
  </>;
  if (toolId === 'settings') return <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4" />
  </>;
  if (toolId === 'flags') return <>
    <path d="M6 21V4m0 1h11l-2.5 3L17 11H6" />
    <path d="M4 21h4" />
  </>;
  return <>
    <path d="M5 5h14v8l-7 6-7-6V5Z" />
    <path d="m12 7 1.3 2.6 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4L12 7Z" />
  </>;
}
