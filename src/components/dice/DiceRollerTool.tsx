'use client';

import { Copy, Trash2, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { DiceTray } from '@/components/dice/DiceTray';
import { 
  createEmptyPlayback,
  appendDieToPlayback,
  rerollPlayback,
  updatePlaybackModifier,
  type DiceTrayPlayback, 
  type DiceSides, 
} from '@/lib/dice/tray-css';
import { formatMixedDiceRequest, type SupportedDieSides } from '@/lib/dice/roller';
import type { SiteLocale } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

function createRollId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const toolCopyByLocale = {
  en: {
    heroEyebrow: 'DICE ROLLER DND',
    heroTitle: 'DnD Dice Roller —',
    heroTitle2: 'Roll Any Combination',
    heroDescription:
      'Build your roll with d4, d6, d8, d10, d12, d20, or d100. Add a bonus modifier and click Roll. Results are calculated and logged.',
    rollButton: 'Roll!',
    clearButton: 'Clear',
    bonusLabel: 'Bonus',
    latestRollLabel: 'LATEST ROLL',
    latestRollHint: 'Roll dice to see the result here.',
    breakdownPrefix: 'Breakdown:',
    rollLogLabel: 'ROLL LOG',
    clearLogLabel: 'Clear',
    emptyLogLabel: 'No rolls yet.',
    trayTitle: 'Dice Tray',
    copyButton: 'Copy',
    copiedButton: 'Copied',
    trayBadges: ['Custom Pools', 'd4 · d6 · d20', 'Modifiers'],
  },
  zh: {
    heroEyebrow: 'DICE ROLLER DND',
    heroTitle: 'DnD 在线掷骰器 —',
    heroTitle2: '自由组合，一键投掷',
    heroDescription:
      '点击下方骰子组建你需要投掷的骰子池，支持设置加值。准备好后点击投掷即可。',
    rollButton: '投掷 (Roll!)',
    clearButton: '清空托盘',
    bonusLabel: '加值 (Bonus)',
    rollLogLabel: '掷骰日志',
    clearLogLabel: '清空',
    emptyLogLabel: '还没有掷骰记录。',
    trayTitle: '骰子托盘',
    copyButton: '复制',
    copiedButton: '已复制',
    trayBadges: ['自由搭配', 'd12 · d20 · d100', '加值修正'],
  },
} as const;

function formatTimestamp(locale: SiteLocale) {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
}

function syncUrl(requestString: string | null) {
  if (typeof window === 'undefined') return;
  const nextUrl = new URL(window.location.href);
  if (requestString) {
    nextUrl.searchParams.set('expr', requestString);
  } else {
    nextUrl.searchParams.delete('expr');
  }
  window.history.replaceState(null, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
}

const SUPPORTED_DICE: SupportedDieSides[] = [4, 6, 8, 10, 12, 20, 100];

export function DiceRollerTool({ locale }: { locale: SiteLocale }) {
  const copy = toolCopyByLocale[locale];

  const [bonusInput, setBonusInput] = useState('0');
  const [activePlayback, setActivePlayback] = useState<DiceTrayPlayback | null>(null);
  const [stagedGroups, setStagedGroups] = useState<{sides: SupportedDieSides, count: number}[]>([]);

  // We maintain a history list of strings/descriptions if needed, or total roll objects.
  const [history, setHistory] = useState<Array<{ id: string; playback: DiceTrayPlayback; timestampLabel: string }>>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const commitToHistory = (playback: DiceTrayPlayback) => {
    if (playback.dice.length === 0) return;
    setHistory((prev) =>
      [{ id: Date.now().toString(), playback, timestampLabel: formatTimestamp(locale) }, ...prev].slice(0, 20)
    );
  };

  const MAX_DICE = 15;

  const updateDieCount = (sides: SupportedDieSides, newCount: number) => {
    const totalOther = stagedGroups.filter(g => g.sides !== sides).reduce((sum, g) => sum + g.count, 0);
    const clamped = Math.max(0, Math.min(newCount, MAX_DICE - totalOther));

    const nextGroups = stagedGroups.filter(g => g.sides !== sides);
    if (clamped > 0) {
      nextGroups.push({ sides, count: clamped });
    }
    nextGroups.sort((a, b) => a.sides - b.sides);

    setStagedGroups(nextGroups);
    setActivePlayback(null);
    syncUrl(nextGroups.length > 0
      ? formatMixedDiceRequest({ groups: nextGroups, modifier: parseInt(bonusInput, 10) || 0 })
      : null
    );
  };

  const handleClear = () => {
    setStagedGroups([]);
    setBonusInput('0');
    setActivePlayback(null);
    setCopied(false);
    syncUrl(null);
  };

  const runRoll = () => {
    if (stagedGroups.length === 0) return;
    const modifier = parseInt(bonusInput, 10) || 0;
    
    // Create playback from staged groups
    const playback = createEmptyPlayback(createRollId(), modifier);
    playback.request.groups = stagedGroups;
    
    const nextPb = rerollPlayback(playback, createRollId());
    setActivePlayback(nextPb);
    commitToHistory(nextPb);
    setCopied(false);
  };

  const handleBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBonusInput(val);
    const parsed = parseInt(val, 10);
    let nextModifier = 0;
    if (!isNaN(parsed)) {
      nextModifier = parsed;
    }
    syncUrl(formatMixedDiceRequest({ groups: stagedGroups, modifier: nextModifier }));
  };

  const handleCopy = async () => {
    if (!activePlayback) return;
    try {
      const rolls = activePlayback.result.allRolls.map(r => r.value).join(', ');
      await navigator.clipboard.writeText(`${activePlayback.headline}\nRolls: ${rolls || 'None'}`);
      setCopied(true);
    } catch { setCopied(false); }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(440px,1.2fr)] lg:items-start xl:grid-cols-[minmax(0,1fr)_minmax(520px,1.25fr)] xl:gap-10">

      {/* ═══ Left column: Hero + Controls ═══ */}
      <div className="flex flex-col gap-5">

        {/* Hero */}
        <div className="mb-2">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#d7b46a]">
            {copy.heroEyebrow}
          </p>
          <h1 className="font-display mt-4 max-w-[28rem] text-4xl leading-[1.06] tracking-tight text-stone-50 sm:text-5xl lg:text-[3.5rem]">
            {copy.heroTitle}
            <br />
            {copy.heroTitle2}
          </h1>
          <p className="mt-4 max-w-[26rem] text-[0.95rem] leading-[1.7] text-stone-400">
            {copy.heroDescription}
          </p>
        </div>

        {/* Dice Picker Panel */}
        <div className="rounded-[24px] border border-white/10 bg-black/40 p-5 shadow-[0_32px_96px_rgba(2,6,23,0.34)] backdrop-blur md:p-6 lg:p-8 shrink-0">
          
          <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3 md:gap-4 mb-8 px-2 md:px-4">
            {SUPPORTED_DICE.map((sides) => {
              const count = stagedGroups.find(g => g.sides === sides)?.count || 0;
              const isActive = count > 0;
              return (
                <div key={`die-${sides}`} className="flex flex-col items-center gap-2">
                  {/* Clickable die icon — always +1 */}
                  <button
                    type="button"
                    onClick={() => updateDieCount(sides, count + 1)}
                    className={cn(
                      "flex flex-col items-center gap-2 sm:gap-3 transition duration-200 outline-none cursor-pointer",
                      isActive ? "opacity-100 scale-[1.02]" : "opacity-70 hover:opacity-100 hover:scale-[1.02] active:scale-95"
                    )}
                  >
                    <div className="relative w-11 h-11 sm:w-14 sm:h-14 drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
                      <Image
                        src={`/dice/d${sides}.svg`}
                        alt={`Add a ${sides}-sided die (d${sides}) to your dice pool`}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className={cn(
                      "font-display text-sm sm:text-[15px] font-bold tracking-wider",
                      isActive ? "text-[#d7b46a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" : "text-stone-400"
                    )}>
                      d{sides}
                    </span>
                  </button>

                  {/* Stepper — only visible when count > 0 */}
                  {isActive && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateDieCount(sides, count - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-xs text-stone-400 transition hover:bg-white/[0.08] hover:text-stone-200 cursor-pointer"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={count}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          updateDieCount(sides, isNaN(v) ? 0 : v);
                        }}
                        className="w-8 h-6 rounded-md border border-white/10 bg-white/[0.04] text-center text-xs font-display font-semibold text-stone-100 outline-none focus:border-[#d7b46a] transition"
                      />
                      <button
                        type="button"
                        onClick={() => updateDieCount(sides, count + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-xs text-stone-400 transition hover:bg-white/[0.08] hover:text-stone-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-stretch gap-3 md:gap-4 mt-8 pt-2">
            <div className="flex flex-col gap-2 shrink-0">
               <input
                type="text"
                inputMode="numeric"
                pattern="[\-0-9]*"
                value={bonusInput}
                onChange={handleBonusChange}
                className="w-20 md:w-24 h-14 md:h-16 text-center text-2xl font-display font-medium bg-white/[0.04] border border-white/10 rounded-2xl text-stone-100 outline-none focus:border-[#d7b46a] focus:bg-white/[0.08] transition"
              />
              <span className="text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
                {copy.bonusLabel}
              </span>
            </div>

            <button
              onClick={runRoll}
              className="flex-1 flex items-center justify-center bg-[linear-gradient(180deg,#d7b46a,#b38d38)] hover:bg-[linear-gradient(180deg,#e5c47f,#c29a41)] text-slate-950 font-display text-2xl tracking-wide font-semibold rounded-2xl shadow-[0_8px_24px_rgba(215,180,106,0.2)] transition active:scale-[0.98]"
            >
              🚀 {copy.rollButton}
            </button>

            <button
              onClick={handleClear}
              className="px-5 md:px-7 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-stone-300 font-medium transition active:scale-[0.98]"
            >
              {copy.clearButton}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Right column: Dice Tray ═══ */}
      <div className="flex flex-col gap-3">
        <DiceTray
          playback={activePlayback}
          stagedGroups={stagedGroups}
          stagedExpr={stagedGroups.length > 0 ? formatMixedDiceRequest({ groups: stagedGroups, modifier: parseInt(bonusInput, 10) || 0 }) : undefined}
          locale={locale}
          title={copy.trayTitle}
        />

        {/* Bottom badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {copy.trayBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.72rem] tracking-[0.16em] text-stone-400"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Roll log */}
        <div className="mt-2 rounded-[24px] border border-white/10 bg-black/20 p-5 shadow-[0_32px_96px_rgba(2,6,23,0.26)] backdrop-blur md:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#d7b46a]">
              {copy.rollLogLabel}
            </span>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setHistory([])}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[0.7rem] uppercase tracking-[0.1em] text-stone-400 transition hover:border-white/20 hover:text-stone-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {copy.clearLogLabel}
              </button>
            )}
          </div>

          <div className="mt-3 flex max-h-64 flex-col gap-2 overflow-y-auto [scrollbar-color:rgba(255,255,255,0.1)_transparent] [scrollbar-width:thin]">
            {history.length === 0 ? (
              <p className="py-2 text-sm text-stone-500">{copy.emptyLogLabel}</p>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className="block w-full rounded-[16px] border border-white/8 bg-white/[0.03] px-4 py-3 text-left transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.7rem] uppercase tracking-[0.2em] text-stone-500">
                      {entry.timestampLabel}
                    </span>
                    <span className="font-display text-xl tracking-tight text-stone-50">
                      {entry.playback.result.total}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.82rem] font-medium text-stone-200">
                    {formatMixedDiceRequest(entry.playback.request)}
                    <span className="font-normal text-stone-500">
                      {' '}— {entry.playback.result.allRolls.map(r => r.value).join(', ')}
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
