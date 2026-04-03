import { ImageResponse } from 'next/og';
import type { SiteLocale } from '@/lib/site-locale';

export const seoImageSize = {
  width: 1200,
  height: 630,
};

export const seoImageContentType = 'image/png';

type SeoImageTone = 'home';

interface SeoImageOptions {
  locale: SiteLocale;
  eyebrow: string;
  title: string;
  description: string;
  chips?: string[];
  tone?: SeoImageTone;
}

const toneStyles: Record<
  SeoImageTone,
  { accent: string; accentSoft: string; secondary: string; background: string }
> = {
  home: {
    accent: '#f1d492',
    accentSoft: 'rgba(241, 212, 146, 0.18)',
    secondary: '#87a8da',
    background: '#07090d',
  },
};


export function createSeoImage({
  locale,
  eyebrow,
  title,
  description,
  chips = [],
  tone = 'home',
}: SeoImageOptions) {
  const palette = toneStyles[tone];
  const localeChip = locale === 'zh' ? '中文' : 'EN';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: palette.background,
          color: '#f5f5f4',
          fontFamily: '"Iowan Old Style", Georgia, serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.08), transparent 22%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.05), transparent 20%), linear-gradient(135deg, rgba(255,255,255,0.04), transparent 34%, transparent 68%, rgba(255,255,255,0.03))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -120,
            top: -160,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: palette.accentSoft,
            filter: 'blur(16px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -120,
            bottom: -140,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: 'rgba(92, 142, 217, 0.18)',
            filter: 'blur(16px)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '56px 64px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${palette.accent}`,
                  color: palette.accent,
                  fontFamily: 'Avenir Next, Segoe UI, sans-serif',
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                TM
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: 'Avenir Next, Segoe UI, sans-serif',
                    fontSize: 17,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: palette.accent,
                  }}
                >
                  {eyebrow}
                </div>
                <div
                  style={{
                    fontFamily: 'Avenir Next, Segoe UI, sans-serif',
                    fontSize: 18,
                    color: '#d6d3d1',
                  }}
                >
                  Token Maker
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  padding: '10px 16px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontFamily: 'Avenir Next, Segoe UI, sans-serif',
                  fontSize: 16,
                  color: '#d6d3d1',
                }}
              >
                {localeChip}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 26,
              maxWidth: 920,
            }}
          >
            <div
              style={{
                fontSize: title.length > 48 ? 66 : 76,
                lineHeight: 1.02,
                letterSpacing: '-0.05em',
                color: '#fafaf9',
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Avenir Next, Segoe UI, sans-serif',
                fontSize: 24,
                lineHeight: 1.55,
                color: '#d6d3d1',
                maxWidth: 980,
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 14,
                flexWrap: 'wrap',
                maxWidth: 880,
              }}
            >
              {chips.slice(0, 3).map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 18px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)',
                    fontFamily: 'Avenir Next, Segoe UI, sans-serif',
                    fontSize: 18,
                    color: '#e7e5e4',
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 8,
                fontFamily: 'Avenir Next, Segoe UI, sans-serif',
              }}
            >
              <div
                style={{
                  fontSize: 17,
                  textTransform: 'uppercase',
                  letterSpacing: '0.24em',
                  color: palette.secondary,
                }}
              >
                Browser token workshop
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: '#a8a29e',
                }}
              >
                DnD • Roll20 • Foundry VTT
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...seoImageSize,
    },
  );
}
