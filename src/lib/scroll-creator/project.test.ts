import { describe, expect, it } from 'vitest';

import {
  createDefaultScrollProject,
  parseScrollProjectJson,
  requireScrollFontStylesheetUrl,
  requireScrollImageUrl,
  requireScrollProject,
  serializeScrollProject,
} from './project';

describe('scroll project domain', () => {
  it('creates the approved blank parchment project', () => {
    expect(createDefaultScrollProject()).toEqual({
      version: 1,
      paperId: 'paper01',
      width: 600,
      height: 865,
      text: '',
      textStyle: {
        fontFamily: 'Trebuchet MS',
        fontSize: 20,
        color: '#24180e',
        bold: false,
        italic: false,
        align: 'left',
      },
      images: [],
      customFonts: [],
    });
  });

  it('validates and round trips text, image geometry, and custom Google Font records', () => {
    const project = {
      ...createDefaultScrollProject(),
      paperId: 'paper15',
      width: 900,
      height: 1400,
      text: 'The watch begins at dusk.',
      textStyle: {
        fontFamily: 'UnifrakturCook',
        fontSize: 28,
        color: '#8f2f1f',
        bold: true,
        italic: true,
        align: 'center' as const,
      },
      images: [
        {
          id: 'sigil_1',
          url: 'https://cdn.example.test/sigil.png',
          x: 80,
          y: 120,
          width: 180,
          height: 140,
        },
      ],
      customFonts: [
        {
          family: 'UnifrakturCook',
          stylesheetUrl: 'https://fonts.googleapis.com/css2?family=UnifrakturCook',
        },
      ],
    };

    const serializedProject = serializeScrollProject(project);
    expect(parseScrollProjectJson(serializedProject)).toEqual(project);
    expect(requireScrollProject(JSON.parse(serializedProject))).toEqual(project);
  });

  it('rejects malformed values with the offending field and value', () => {
    const project = createDefaultScrollProject();

    expect(() => requireScrollProject({ ...project, paperId: 'paper16' })).toThrow(
      'project.paperId',
    );
    expect(() => requireScrollProject({ ...project, width: 2 })).toThrow('received 2');
    expect(() =>
      requireScrollProject({
        ...project,
        textStyle: { ...project.textStyle, color: 'red' },
      }),
    ).toThrow('received "red"');
    expect(() =>
      requireScrollProject({
        ...project,
        images: [{ id: 'image', url: 'javascript:alert(1)', x: 0, y: 0, width: 20, height: 20 }],
      }),
    ).toThrow('javascript:alert(1)');
    expect(() =>
      requireScrollProject({
        ...project,
        images: [{ id: 'image', url: 'https://cdn.example.test/sigil.png', x: 0, y: 0, width: 7, height: 20 }],
      }),
    ).toThrow('received 7');
    expect(() =>
      requireScrollProject({
        ...project,
        customFonts: [{ family: 'Mage', stylesheetUrl: 'https://evil.example.test/font.css' }],
      }),
    ).toThrow('evil.example.test');
    expect(() =>
      requireScrollProject({
        ...project,
        textStyle: { ...project.textStyle, fontFamily: 'Unknown Font' },
      }),
    ).toThrow('received "Unknown Font"');
    expect(() =>
      requireScrollProject({
        ...project,
        textStyle: { ...project.textStyle, fontFamily: ' Trebuchet MS' },
      }),
    ).toThrow('leading or trailing whitespace');
    expect(() =>
      requireScrollProject({
        ...project,
        customFonts: [
          { family: ' Mage', stylesheetUrl: 'https://fonts.googleapis.com/css?family=Mage' },
        ],
      }),
    ).toThrow('received " Mage"');
    expect(() => requireScrollProject({ ...project, unexpected: true })).toThrow('unexpected');
  });

  it('rejects duplicate image ids, duplicate custom fonts, malformed JSON, and oversized JSON', () => {
    const project = createDefaultScrollProject();
    const duplicateImage = {
      id: 'same',
      url: 'https://cdn.example.test/a.png',
      x: 0,
      y: 0,
      width: 30,
      height: 30,
    };
    expect(() =>
      requireScrollProject({ ...project, images: [duplicateImage, duplicateImage] }),
    ).toThrow('duplicates an earlier image id');

    const duplicateFont = {
      family: 'Mage',
      stylesheetUrl: 'https://fonts.googleapis.com/css?family=Mage',
    };
    expect(() =>
      requireScrollProject({ ...project, customFonts: [duplicateFont, { ...duplicateFont, family: 'mage' }] }),
    ).toThrow('duplicates an earlier custom font family');
    expect(() =>
      requireScrollProject({
        ...project,
        customFonts: [{ family: 'verdana', stylesheetUrl: 'https://fonts.googleapis.com/css?family=Verdana' }],
      }),
    ).toThrow('must not duplicate a built-in font family; received "verdana"');
    expect(() => parseScrollProjectJson('{')).toThrow('Invalid scroll project JSON');
    expect(() => parseScrollProjectJson('x'.repeat(1_048_577))).toThrow('UTF-8 bytes');
  });

  it('accepts remote SVG image URLs while rejecting inline SVG payloads', () => {
    expect(requireScrollImageUrl('https://cdn.example.test/sigil.svg')).toBe(
      'https://cdn.example.test/sigil.svg',
    );
    expect(() => requireScrollImageUrl('data:image/svg+xml,<svg></svg>')).toThrow(
      'data:image/svg+xml,<svg></svg>',
    );
    expect(
      requireScrollFontStylesheetUrl('https://fonts.googleapis.com/css2?family=MedievalSharp'),
    ).toBe('https://fonts.googleapis.com/css2?family=MedievalSharp');
  });
});
