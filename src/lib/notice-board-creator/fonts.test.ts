// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import { NOTICE_BOARD_FONTS } from '@/lib/notice-board-creator/catalog';
import { NoticeBoardFontError, loadNoticeBoardFont, parseGoogleFontInputs } from '@/lib/notice-board-creator/fonts';

describe('notice board custom fonts', () => {
  it('parses a Google Fonts URL and keeps the first family from the CSS declaration', () => {
    expect(
      parseGoogleFontInputs(
        'https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap',
        'font-family: "Uncial Antiqua", serif;',
      ),
    ).toEqual({
      family: 'Uncial Antiqua',
      stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap',
    });
  });

  it('parses a single link element without evaluating its markup', () => {
    expect(
      parseGoogleFontInputs(
        '<link href="https://fonts.googleapis.com/css2?family=IM+Fell+English&display=swap" rel="stylesheet">',
        "font-family: 'IM Fell English', serif;",
      ),
    ).toEqual({
      family: 'IM Fell English',
      stylesheetUrl: 'https://fonts.googleapis.com/css2?family=IM+Fell+English&display=swap',
    });
  });

  it.each([
    ['non-HTTPS URL', 'http://fonts.googleapis.com/css2?family=Uncial+Antiqua'],
    ['untrusted host', 'https://fonts.example.com/css2?family=Uncial+Antiqua'],
    ['unexpected port', 'https://fonts.googleapis.com:444/css2?family=Uncial+Antiqua'],
    ['unexpected path', 'https://fonts.googleapis.com/other?family=Uncial+Antiqua'],
    ['missing family query', 'https://fonts.googleapis.com/css2?display=swap'],
    ['URL credentials', 'https://user@fonts.googleapis.com/css2?family=Uncial+Antiqua'],
    ['URL fragment', 'https://fonts.googleapis.com/css2?family=Uncial+Antiqua#preview'],
  ])('rejects a %s input with its received value', (_caseName, stylesheetUrl) => {
    expect(() => parseGoogleFontInputs(stylesheetUrl, 'font-family: Uncial Antiqua, serif;')).toThrow(
      NoticeBoardFontError,
    );
    expect(() => parseGoogleFontInputs(stylesheetUrl, 'font-family: Uncial Antiqua, serif;')).toThrow(
      stylesheetUrl,
    );
  });

  it('rejects a font family declaration that could inject CSS', () => {
    const stylesheetUrl = 'https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap';
    const unsafeFamilyDeclaration = 'font-family: "</style><script>alert(1)</script>";';

    expect(() => parseGoogleFontInputs(stylesheetUrl, unsafeFamilyDeclaration)).toThrow(NoticeBoardFontError);
    expect(() => parseGoogleFontInputs(stylesheetUrl, unsafeFamilyDeclaration)).toThrow('script');
  });

  it('loads a Google stylesheet through a link element and deduplicates the same URL', () => {
    const font = parseGoogleFontInputs(
      'https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap',
      'Uncial Antiqua',
    );

    const firstLink = loadNoticeBoardFont(font, document);
    const secondLink = loadNoticeBoardFont(font, document);
    const matchingLinks = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
    ).filter(
      (stylesheetLink) => stylesheetLink.href === font.stylesheetUrl,
    );

    expect(firstLink).toBeInstanceOf(HTMLLinkElement);
    expect(secondLink).toBe(firstLink);
    expect(matchingLinks).toHaveLength(1);
  });

  it('keeps custom fonts separate from the eight built-in font options', () => {
    const customFont = parseGoogleFontInputs(
      'https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap',
      'Uncial Antiqua',
    );

    expect(NOTICE_BOARD_FONTS).toHaveLength(8);
    expect(NOTICE_BOARD_FONTS.some((font) => font.family === customFont.family)).toBe(false);
  });
});
