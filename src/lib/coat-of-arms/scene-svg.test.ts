import { describe, expect, it } from 'vitest';
import { createDefaultProject } from './assets';
import { applyProjectCommand } from './commands';
import { renderCoatSceneSvg } from './scene-svg';

describe('coat scene SVG renderer', () => {
  it('renders a selected bundled SVG shield material as its authored image', () => {
    const baseProject = createDefaultProject('en');
    const shield = baseProject.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected default shield layer');
    const project = applyProjectCommand(baseProject, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { assetId: 'shield-001' },
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-bundled-shield-material="true"');
    expect(svg).toContain('href="/coat-assets/materials/shields/shield/shield-001.svg"');
  });

  it('renders a bundled WebP charge inside the shield field clip', () => {
    const project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-layer', assetId: 'material-symbol-alchemical-air',
    } as never);
    const sun = project.layers.at(-1);
    if (!sun || sun.type !== 'charge') throw new Error('Expected bundled sun charge layer');

    const clippedProject = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: sun.id,
      patch: { transform: { ...sun.transform, clipToField: true } },
    } as never);
    const svg = renderCoatSceneSvg(clippedProject, { width: 512, height: 512 });

    expect(svg).toContain(`data-layer-id="${sun.id}"`);
    expect(svg).toContain('data-bundled-raster="true"');
    expect(svg).toContain('href="/coat-assets/materials/symbols/alchemical-air.webp"');
    expect(svg).toContain('coat-charge-shield-clip-2');
  });

  it('renders a layer sent backward immediately above the background', () => {
    let project = createDefaultProject('en');
    project = applyProjectCommand(project, { type: 'add-layer', assetId: 'material-animal-alligator-passant' });
    project = applyProjectCommand(project, { type: 'add-layer', assetId: 'material-symbol-alchemical-air' });
    const background = project.layers.find((layer) => layer.type === 'background');
    const lion = project.layers.find((layer) => layer.type === 'charge' && layer.assetId === 'material-animal-alligator-passant');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!background || !lion || !shield) throw new Error('Expected background, shield, and golden lion layers');

    const movedToBack = applyProjectCommand(project, {
      type: 'move-layer-ids', direction: 'back', layerIds: [lion.id],
    } as never);
    const svg = renderCoatSceneSvg(movedToBack, { width: 512, height: 512 });

    expect(svg.indexOf(`data-layer-id="${background.id}"`)).toBeLessThan(svg.indexOf(`data-layer-id="${lion.id}"`));
    expect(svg.indexOf(`data-layer-id="${lion.id}"`)).toBeLessThan(svg.indexOf(`data-layer-id="${shield.id}"`));
  });

  it('emits the selected local font stack with italic bold text styling', () => {
    const project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-text-layer', text: 'HONOUR', color: '#F5E6A1', fontSize: 18,
      fontFamily: 'blackletter', fontStyle: 'italic', fontWeight: 'bold',
      alignment: 'center', path: { mode: 'none' },
    } as never);

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('font-family="&quot;Old English Text MT&quot;, &quot;Lucida Blackletter&quot;, serif"');
    expect(svg).toContain('font-style="italic"');
    expect(svg).toContain('font-weight="bold"');
  });

  it('renders a top ornament in its own positioned layer', () => {
    const project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-crown-royal-crown' });
    const topLayer = project.layers.at(-1);
    if (!topLayer || topLayer.type !== 'top') throw new Error('Expected top ornament layer');

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain(`data-layer-id="${topLayer.id}"`);
    expect(svg).toContain('data-bundled-raster="true"');
    expect(svg).toContain('href="/coat-assets/materials/crowns/royal-crown.webp"');
  });

  it('rejects SVG colour replacement requests for a WebP material', () => {
    const project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-crown-royal-crown' });
    const crown = project.layers.at(-1);
    if (!crown || crown.type !== 'top') throw new Error('Expected top ornament layer');
    expect(() => applyProjectCommand(project, {
      type: 'update-layer', layerId: crown.id,
      patch: { colorReplacements: { '#F5E6A1': '#1855A5' } },
    })).toThrow('Invalid unsupported SVG part colour: #F5E6A1');
  });

  it('renders clipped field ornaments above the selected field division', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'set-field', layerId: shield.id,
      field: { ...shield.field, ornaments: [{ id: 'bordure-1', kind: 'bordure', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0 }] },
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-field-ornament-id="bordure-1"');
    expect(svg).toContain('fill-rule="evenodd"');
  });

  it('renders a configured wavy field division with its chosen frequency and amplitude', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        division: 'per-pale',
        colors: ['#1855A5', '#F5E6A1'],
        divisionLine: { style: 'wavy', frequency: 3, amplitude: 7 },
      } as never,
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-field-division-line-style="wavy"');
    expect(svg).toContain('data-field-division-line-frequency="3"');
    expect(svg).toContain('data-field-division-line-amplitude="7"');
  });

  it('renders each configured quarterly region with its own clipped pattern', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        division: 'quarterly',
        colors: ['#111111', '#222222'],
        pattern: 'solid',
        regions: {
          q1: { colors: ['#B11F24'], pattern: 'solid' },
          q2: { colors: ['#1855A5', '#F5E6A1'], pattern: 'dots', patternScale: 0.5 },
          q3: { colors: ['#F5E6A1'], pattern: 'solid' },
          q4: { colors: ['#FFFFFF'], pattern: 'solid' },
        },
      },
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-field-region="q2"');
    expect(svg).toContain('data-field-region-pattern-scale="0.5"');
    expect(svg).toContain('coat-shield-clip-1-region-q2');
    expect(svg).toContain('fill="#1855A5"');
    expect(svg).not.toContain('#111111');
  });

  it('renders a target saltire field structure above the field pattern', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{ id: 'saltire-1', kind: 'saltire', color: '#B11F24', x: 0, y: 0, scale: 1, rotation: 0 }],
      } as never,
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-field-ornament-id="saltire-1"');
    expect(svg).toContain('M0 9L9 0L100 101V110H91L0 9Z');
  });

  it('renders an individually sized reversed chevron structure', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{
          id: 'chevron-geometry', kind: 'chevron', color: '#B11F24', x: 0, y: 0, scale: 1, rotation: 0,
          width: 72, thickness: 11, reversed: true,
        }],
      } as never,
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-field-ornament-id="chevron-geometry"');
    expect(svg).toContain('data-field-ornament-width="72"');
    expect(svg).toContain('data-field-ornament-reversed="true"');
  });

  it('renders configured geometry for every adjustable field structure while retaining legacy defaults', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [
          { id: 'cross-geometry', kind: 'cross', color: '#B11F24', x: 0, y: 0, scale: 1, rotation: 0, crossHorizontalThickness: 18, crossVerticalThickness: 24, crossCenterX: 43, crossCenterY: 61 },
          { id: 'saltire-geometry', kind: 'saltire', color: '#B11F24', x: 0, y: 0, scale: 1, rotation: 0, saltireCenterX: 46, saltireCenterY: 60 },
          { id: 'chevron-geometry', kind: 'chevron', color: '#B11F24', x: 0, y: 0, scale: 1, rotation: 0, chevronPeakHeight: 31, chevronVerticalPosition: 57 },
          { id: 'pall-geometry', kind: 'pall', color: '#B11F24', x: 0, y: 0, scale: 1, rotation: 0, pallForkX: 54, pallForkY: 46 },
          { id: 'mountain-geometry', kind: 'mountain', color: '#B11F24', x: 0, y: 0, scale: 1, rotation: 0, mountainPeakCount: 4, mountainSteepness: 0.72 },
          { id: 'legacy-cross', kind: 'cross', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0 },
        ],
      },
    } as never);

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-field-ornament-cross-horizontal-thickness="18"');
    expect(svg).toContain('data-field-ornament-cross-vertical-thickness="24"');
    expect(svg).toContain('M31 0H55V52H100V70H55V110H31V70H0V52H31Z');
    expect(svg).toContain('data-field-ornament-saltire-center-x="46"');
    expect(svg).toContain('translate(-4 5)');
    expect(svg).toContain('data-field-ornament-chevron-peak-height="31"');
    expect(svg).toContain('M0 40L14 26L50 57L86 26L100 40L50 81.8Z');
    expect(svg).toContain('data-field-ornament-pall-fork-x="54"');
    expect(svg).toContain('M43 0H65V46L100 85V110H67L54 67L33 110H0V85L43 46Z');
    expect(svg).toContain('data-field-ornament-mountain-peak-count="4"');
    expect(svg).toContain('M0 110L12.5 61.04L25 86.4992L37.5 61.04L50 86.4992L62.5 61.04L75 86.4992L87.5 61.04L100 110Z');
    expect(svg).toContain('M39 0H61V39H100V71H61V110H39V71H0V39H39Z');
  });

  it('renders every configured structural colour as a local SVG gradient', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{
          id: 'fess-colours', kind: 'fess', color: '#1855A5', x: 0, y: 0, scale: 1, rotation: 0,
          colors: ['#1855A5', '#F5E6A1', '#B11F24'], colorAmplitudes: [2, 1, 3],
        }],
      } as never,
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('id="coat-field-ornament-gradient-102-101-115-115-45-99-111-108-111-117-114-115"');
    expect(svg).toContain('stop-color="#1855A5"');
    expect(svg).toContain('stop-color="#F5E6A1"');
    expect(svg).toContain('stop-color="#B11F24"');
  });

  it('uses a configured heraldic edge in a bendlet’s rendered diagonal', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{
          id: 'bendlet-edge', kind: 'bendlet', color: '#B11F24', x: 0, y: 0, scale: 1, rotation: 0,
          edge: { style: 'wavy', frequency: 2, amplitude: 5 },
        }],
      } as never,
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-field-ornament-edge-style="wavy"');
    expect(svg).not.toContain('<path d="M0 0H14L100 96V110H86L0 14Z" fill="#B11F24"/>');
  });

  it('renders a locally stored custom shield mask around the field export', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: {
        id: 'mask-svg', mimeType: 'image/svg+xml', encoding: 'base64',
        data: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      },
    });
    project = applyProjectCommand(project, {
      type: 'set-custom-shield-mask', layerId: shield.id, uploadId: 'mask-svg',
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('id="coat-custom-shield-mask-1"');
    expect(svg).toContain('mask="url(#coat-custom-shield-mask-1)"');
    expect(svg).toContain('data:image/svg+xml;base64,PHN2Zy');
  });

  it('renders a visible outline around a locally stored custom shield mask', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: {
        id: 'outlined-mask', mimeType: 'image/svg+xml', encoding: 'base64',
        data: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      },
    });
    project = applyProjectCommand(project, { type: 'set-custom-shield-mask', layerId: shield.id, uploadId: 'outlined-mask' });
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: { ...shield.field, outline: { visible: true, color: '#B11F24', width: 3 } },
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-custom-shield-outline="true"');
    expect(svg).toContain('feMorphology');
    expect(svg).toContain('flood-color="#B11F24"');
  });

  it('clips a charge to its selected shield field placement', () => {
    let project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-lion-rampant' });
    const lion = project.layers.at(-1);
    if (!lion || lion.type !== 'charge') throw new Error('Expected lion charge');
    project = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: lion.id,
      patch: { transform: { ...lion.transform, fieldPlacement: 'chief', clipToField: true } } as never,
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-field-placement="chief"');
    expect(svg).toContain('id="coat-field-region-2"');
    expect(svg).toContain('<rect x="0" y="0" width="100" height="36.667"/>');
  });

  it('clips a charge to a detailed local field region', () => {
    let project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-lion-rampant' });
    const lion = project.layers.at(-1);
    if (!lion || lion.type !== 'charge') throw new Error('Expected lion charge');
    project = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: lion.id,
      patch: { transform: { ...lion.transform, fieldRegionId: 'bend-lower', clipToField: true } } as never,
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-field-region="bend-lower"');
    expect(svg).toContain('<path d="M100 0V110H0Z"/>');
  });

  it('renders the local custom background fill and its selected motif', () => {
    let project = createDefaultProject('en');
    const background = project.layers.find((layer) => layer.type === 'background');
    if (!background || background.type !== 'background') throw new Error('Expected background layer');
    project = applyProjectCommand(project, {
      type: 'set-background', assetId: background.assetId, motif: 'honeycomb', fill: '#004E89',
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('<rect width="100" height="110" fill="#004E89"/>');
    expect(svg).toContain('<polygon points="18,5 30,12 30,26 18,33 6,26 6,12"/>');
  });

  it('renders an extended background motif selected from the shared target pattern set', () => {
    const project = applyProjectCommand(createDefaultProject('en'), {
      type: 'set-background', assetId: 'ivory-background', motif: 'papelonny',
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-field-pattern="papelonny"');
  });

  it('renders visible layers in order and omits hidden layers', () => {
    const withCharges = applyProjectCommand(
      applyProjectCommand(createDefaultProject('en'), {
        type: 'add-layer',
        assetId: 'material-animal-lion-rampant',
      }),
      { type: 'add-layer', assetId: 'material-symbol-eight-point-star' },
    );
    const project = {
      ...withCharges,
      layers: withCharges.layers.map((layer, index) => (
        index === 2 ? { ...layer, id: 'visible-charge' } :
        index === 3 ? { ...layer, id: 'hidden-charge', visible: false } : layer
      )),
    };

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('data-layer-id="visible-charge"');
    expect(svg).not.toContain('hidden-charge');
    expect(svg.indexOf('data-layer-id="visible-charge"')).toBeGreaterThan(
      svg.indexOf('data-layer-id="' + project.layers[1]!.id + '"'),
    );
  });

  it('renders project text with XML-safe content', () => {
    const project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-text-layer',
      text: 'A < B & C',
      color: '#B11F24',
      fontSize: 12,
      alignment: 'center',
      path: { mode: 'none' },
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('A &lt; B &amp; C');
    expect(svg).not.toContain('A < B');
  });

  it('renders independent horizontal and vertical layer scaling', () => {
    let project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-layer', assetId: 'material-animal-lion-rampant',
    });
    const lion = project.layers.at(-1);
    if (!lion || lion.type !== 'charge') throw new Error('Expected lion charge');
    project = applyProjectCommand(project, {
      type: 'update-layer', layerId: lion.id,
      patch: { transform: { x: 0, y: 0, scale: 1, scaleX: 1.4, scaleY: 0.6, rotation: 0 } },
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('scale(1.4 0.6)');
  });

  it('clips and flips a selected element without changing its source asset', () => {
    let project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-layer', assetId: 'material-animal-lion-rampant',
    });
    const lion = project.layers.at(-1);
    if (!lion || lion.type !== 'charge') throw new Error('Expected lion charge');
    project = applyProjectCommand(project, {
      type: 'update-layer', layerId: lion.id,
      patch: {
        transform: {
          x: 0, y: 0, scale: 1, rotation: 0,
          flipHorizontal: true, crop: { x: 10, y: 12, width: 50, height: 64 },
        },
      },
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg).toContain('id="coat-crop-2"');
    expect(svg).toContain('<rect x="10" y="12" width="50" height="64"/>');
    expect(svg).toContain('scale(-1 1)');
  });

  it('composes fields, transforms, local uploads, and every text path mode', () => {
    let project = createDefaultProject('en');
    const shieldId = project.layers.find((layer) => layer.type === 'shield')?.id;
    if (!shieldId) throw new Error('Expected default shield');
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shieldId,
      field: { division: 'quarterly', colors: ['#1855A5', '#F5E6A1'], pattern: 'checks' },
    });
    project = applyProjectCommand(project, {
      type: 'set-background', assetId: 'azure-background', motif: 'dots', opacity: 0.4,
    });
    project = applyProjectCommand(project, { type: 'add-layer', assetId: 'material-ordinary-bend' });
    project = applyProjectCommand(project, { type: 'add-layer', assetId: 'material-animal-lion-rampant' });
    const ordinaryId = project.layers.at(-2)?.id;
    const chargeId = project.layers.at(-1)?.id;
    if (!ordinaryId || !chargeId) throw new Error('Expected ordinary and charge');
    project = applyProjectCommand(project, {
      type: 'update-layer', layerId: ordinaryId,
      patch: { transform: { x: 8, y: -4, scale: 1.25, rotation: 15 } },
    });
    project = applyProjectCommand(project, {
      type: 'group-layers', groupId: 'heraldic-pair', layerIds: [ordinaryId, chargeId],
    });
    project = applyProjectCommand(project, {
      type: 'set-group-opacity', groupId: 'heraldic-pair', opacity: 0.4,
    });
    project = applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: { id: 'local-mark', mimeType: 'image/png', encoding: 'base64', data: 'iVBORw0KGgo=' },
    });
    project = applyProjectCommand(project, { type: 'add-image-layer', uploadId: 'local-mark', opacity: 0.5 });
    for (const path of [
      { mode: 'motto', curve: 'upper' },
      { mode: 'curve', curve: 'lower' },
      { mode: 'ring', curve: 'clockwise' },
    ] as const) {
      project = applyProjectCommand(project, {
        type: 'add-text-layer', text: 'Arms', color: '#F5E6A1', fontSize: 9,
        alignment: 'center', path,
      });
    }

    const svg = renderCoatSceneSvg(project, { width: 400, height: 440 });

    expect(svg).toContain('clipPath id="coat-shield-clip-1"');
    expect(svg).toContain('fill="#F5E6A1"');
    expect(svg).toContain(
      'translate(8 -4) rotate(15 50 55) translate(50 55) scale(1.25) translate(-50 -55)',
    );
    expect(svg).toContain('data-group-id="heraldic-pair"');
    expect(svg).toContain('opacity="0.4"');
    expect(svg).toContain('href="data:image/png;base64,iVBORw0KGgo="');
    expect(svg).toContain('id="coat-text-path-');
    expect(svg).toContain('<textPath href="#coat-text-path-');
  });

  it('composites one contiguous group in one outer opacity wrapper while preserving layer order', () => {
    let project = ['material-animal-lion-rampant', 'material-symbol-eight-point-star', 'material-object-castle-tower'].reduce(
      (currentProject, assetId) => applyProjectCommand(currentProject, { type: 'add-layer', assetId }),
      createDefaultProject('en'),
    );
    const [firstGroupMember, secondGroupMember, afterGroupLayer] = project.layers.slice(-3);
    if (!firstGroupMember || !secondGroupMember || !afterGroupLayer) throw new Error('Expected three charges');
    project = applyProjectCommand(project, {
      type: 'group-layers', groupId: 'pair', layerIds: [firstGroupMember.id, secondGroupMember.id],
    });
    project = applyProjectCommand(project, {
      type: 'set-group-opacity', groupId: 'pair', opacity: 0.35,
    });

    const svg = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(svg.match(/data-group-id="pair"/g)).toHaveLength(1);
    expect(svg).toContain(
      `<g data-group-id="pair" opacity="0.35"><g data-layer-id="${firstGroupMember.id}">`,
    );
    expect(svg).toContain(`data-layer-id="${secondGroupMember.id}"`);
    expect(svg).not.toContain(`data-layer-id="${firstGroupMember.id}" opacity="0.35"`);
    expect(svg.indexOf('data-group-id="pair"')).toBeLessThan(
      svg.indexOf(`data-layer-id="${afterGroupLayer.id}"`),
    );

    const hiddenMember = applyProjectCommand(project, {
      type: 'set-layer-visibility', layerId: secondGroupMember.id, visible: false,
    });
    const hiddenSvg = renderCoatSceneSvg(hiddenMember, { width: 512, height: 512 });

    expect(hiddenSvg.match(/data-group-id="pair"/g)).toHaveLength(1);
    expect(hiddenSvg).toContain(`data-layer-id="${firstGroupMember.id}"`);
    expect(hiddenSvg).not.toContain(secondGroupMember.id);
  });

  it('is deterministic and assigns unique IDs to multiple shields and text paths', () => {
    let project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'round-shield' });
    for (const path of [
      { mode: 'motto', curve: 'upper' },
      { mode: 'ring', curve: 'counterclockwise' },
    ] as const) {
      project = applyProjectCommand(project, {
        type: 'add-text-layer', text: 'Arms', color: '#F5E6A1', fontSize: 10,
        alignment: 'center', path,
      });
    }

    const first = renderCoatSceneSvg(project, { width: 512, height: 512 });
    const second = renderCoatSceneSvg(project, { width: 512, height: 512 });

    expect(first).toBe(second);
    expect(first.match(/coat-shield-clip-\d+/g)).toEqual([
      'coat-shield-clip-1', 'coat-shield-clip-1', 'coat-shield-clip-2', 'coat-shield-clip-2',
    ]);
    expect(first.match(/coat-text-path-\d+/g)).toEqual([
      'coat-text-path-3', 'coat-text-path-4', 'coat-text-path-3', 'coat-text-path-4',
    ]);
  });

  it('rejects invalid scene options and non-finite project geometry', () => {
    const project = createDefaultProject('en');
    const invalidProject = {
      ...project,
      layers: project.layers.map((layer, index) => index === 1
        ? { ...layer, transform: { x: Number.NaN, y: 0, scale: 1, rotation: 0 } }
        : layer),
    };

    expect(() => renderCoatSceneSvg(project, { width: 0, height: 512 })).toThrow('width');
    expect(() => renderCoatSceneSvg(invalidProject, { width: 512, height: 512 })).toThrow('NaN');
  });
});
