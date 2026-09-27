export type ArmyFormationIcon = {
  id: string;
  svgMarkup: string;
};

type ArmyNatoFrameKind = 'neutral-square' | 'unknown-quatrefoil';

type ArmyNatoContentBox = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
};

const ARMY_NATO_PART3_FIRST_SERIAL = 97;
const ARMY_NATO_PART3_LAST_SERIAL = 144;
const ARMY_NATO_PART3_ICON_COUNT = 48;
const ARMY_NATO_GLYPH_COUNT = 36;
const ARMY_NATO_STROKE_WIDTH = 1.6;

function armyNatoAxis(value: number, limit: number, axisName: string): string {
  if (!Number.isFinite(value)) {
    throw new Error(`NATO ${axisName} coordinate is not finite: ${value}`);
  }
  const rounded = Math.round(value * 10) / 10;
  if (rounded < 0 || rounded > limit) {
    throw new Error(`NATO ${axisName} coordinate ${rounded} is outside 0-${limit}`);
  }
  return String(rounded);
}

function armyNatoX(value: number): string {
  return armyNatoAxis(value, 50, 'x');
}

function armyNatoY(value: number): string {
  return armyNatoAxis(value, 30, 'y');
}

function armyNatoLength(value: number, label: string): string {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`NATO ${label} must be positive, got ${value}`);
  }
  return String(Math.round(value * 10) / 10);
}

function armyNatoStroke(pathD: string): string {
  if (!pathD.startsWith('M')) {
    throw new Error(`NATO stroke path must start with M, got ${pathD}`);
  }
  return `<path d="${pathD}" fill="none" stroke="currentColor" stroke-width="${ARMY_NATO_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function armyNatoFill(pathD: string): string {
  if (!pathD.startsWith('M')) {
    throw new Error(`NATO fill path must start with M, got ${pathD}`);
  }
  return `<path d="${pathD}" fill="currentColor" stroke="none"/>`;
}

function armyNatoLine(x1: number, y1: number, x2: number, y2: number): string {
  return armyNatoStroke(`M ${armyNatoX(x1)} ${armyNatoY(y1)} L ${armyNatoX(x2)} ${armyNatoY(y2)}`);
}

function armyNatoCircle(cx: number, cy: number, radius: number, filled: boolean): string {
  const fill = filled ? 'currentColor' : 'none';
  const stroke = filled ? 'none' : 'currentColor';
  const strokeWidth = filled ? '' : ` stroke-width="${ARMY_NATO_STROKE_WIDTH}"`;
  return `<circle cx="${armyNatoX(cx)}" cy="${armyNatoY(cy)}" r="${armyNatoLength(radius, 'circle radius')}" fill="${fill}" stroke="${stroke}"${strokeWidth}/>`;
}

function armyNatoEllipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  filled: boolean,
  rotationDegrees: number,
): string {
  const fill = filled ? 'currentColor' : 'none';
  const stroke = filled ? 'none' : 'currentColor';
  const strokeWidth = filled ? '' : ` stroke-width="${ARMY_NATO_STROKE_WIDTH}"`;
  const rotation =
    rotationDegrees === 0
      ? ''
      : ` transform="rotate(${armyNatoLength(Math.abs(rotationDegrees), 'ellipse rotation')} ${armyNatoX(cx)} ${armyNatoY(cy)})"`;
  const signedRotation = rotationDegrees < 0 ? rotation.replace('rotate(', 'rotate(-') : rotation;
  return `<ellipse cx="${armyNatoX(cx)}" cy="${armyNatoY(cy)}" rx="${armyNatoLength(rx, 'ellipse rx')}" ry="${armyNatoLength(ry, 'ellipse ry')}" fill="${fill}" stroke="${stroke}"${strokeWidth}${signedRotation}/>`;
}

function armyNatoContentBox(frame: ArmyNatoFrameKind): ArmyNatoContentBox {
  if (frame === 'neutral-square') {
    return { left: 15, right: 35, top: 5, bottom: 25, centerX: 25, centerY: 15 };
  }
  if (frame === 'unknown-quatrefoil') {
    return { left: 18, right: 32, top: 8, bottom: 22, centerX: 25, centerY: 15 };
  }
  throw new Error(`Unknown NATO frame kind ${frame}`);
}

function armyNatoNeutralSquareFrame(): string {
  return `<rect x="12" y="2" width="26" height="26" fill="none" stroke="currentColor" stroke-width="${ARMY_NATO_STROKE_WIDTH}"/>`;
}

function armyNatoUnknownQuatrefoilFrame(): string {
  const pathD = [
    `M ${armyNatoX(25)} ${armyNatoY(1.8)}`,
    `C ${armyNatoX(28)} ${armyNatoY(1.8)} ${armyNatoX(30.5)} ${armyNatoY(3.4)} ${armyNatoX(31.6)} ${armyNatoY(6.4)}`,
    `C ${armyNatoX(36)} ${armyNatoY(5.2)} ${armyNatoX(43)} ${armyNatoY(7.6)} ${armyNatoX(46.6)} ${armyNatoY(11.2)}`,
    `C ${armyNatoX(48.6)} ${armyNatoY(13.2)} ${armyNatoX(48.6)} ${armyNatoY(16.8)} ${armyNatoX(46.6)} ${armyNatoY(18.8)}`,
    `C ${armyNatoX(43)} ${armyNatoY(22.4)} ${armyNatoX(36)} ${armyNatoY(24.8)} ${armyNatoX(31.6)} ${armyNatoY(23.6)}`,
    `C ${armyNatoX(30.5)} ${armyNatoY(26.6)} ${armyNatoX(28)} ${armyNatoY(28.2)} ${armyNatoX(25)} ${armyNatoY(28.2)}`,
    `C ${armyNatoX(22)} ${armyNatoY(28.2)} ${armyNatoX(19.5)} ${armyNatoY(26.6)} ${armyNatoX(18.4)} ${armyNatoY(23.6)}`,
    `C ${armyNatoX(14)} ${armyNatoY(24.8)} ${armyNatoX(7)} ${armyNatoY(22.4)} ${armyNatoX(3.4)} ${armyNatoY(18.8)}`,
    `C ${armyNatoX(1.4)} ${armyNatoY(16.8)} ${armyNatoX(1.4)} ${armyNatoY(13.2)} ${armyNatoX(3.4)} ${armyNatoY(11.2)}`,
    `C ${armyNatoX(7)} ${armyNatoY(7.6)} ${armyNatoX(14)} ${armyNatoY(5.2)} ${armyNatoX(18.4)} ${armyNatoY(6.4)}`,
    `C ${armyNatoX(19.5)} ${armyNatoY(3.4)} ${armyNatoX(22)} ${armyNatoY(1.8)} ${armyNatoX(25)} ${armyNatoY(1.8)}`,
    'Z',
  ].join(' ');
  return armyNatoStroke(pathD);
}

function armyNatoChevronGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const height = box.bottom - box.top;
  const wingY = box.centerY - height * 0.12;
  const tipY = box.centerY + height * 0.28;
  const notchY = box.centerY + height * 0.02;
  return armyNatoFill(
    `M ${armyNatoX(box.left + 1)} ${armyNatoY(wingY)} L ${armyNatoX(box.centerX)} ${armyNatoY(tipY)} L ${armyNatoX(box.right - 1)} ${armyNatoY(wingY)} L ${armyNatoX(box.centerX)} ${armyNatoY(notchY)} Z`,
  );
}

function armyNatoWheelGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const radius = Math.min(box.right - box.left, box.bottom - box.top) * 0.38;
  const circle = armyNatoCircle(box.centerX, box.centerY, radius, false);
  const spokes = [0, 45, 90, 135]
    .map((degrees) => {
      const radians = (degrees * Math.PI) / 180;
      const dx = Math.cos(radians) * radius;
      const dy = Math.sin(radians) * radius;
      return armyNatoLine(box.centerX - dx, box.centerY - dy, box.centerX + dx, box.centerY + dy);
    })
    .join('');
  return circle + spokes;
}

function armyNatoTentGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const peakY = box.top + 0.5;
  const footY = box.bottom - 0.6;
  return armyNatoStroke(
    `M ${armyNatoX(box.left + 0.8)} ${armyNatoY(footY)} Q ${armyNatoX(box.left + 0.2)} ${armyNatoY(box.centerY + 1)} ${armyNatoX(box.centerX)} ${armyNatoY(peakY)} Q ${armyNatoX(box.right - 0.2)} ${armyNatoY(box.centerY + 1)} ${armyNatoX(box.right - 0.8)} ${armyNatoY(footY)}`,
  );
}

function armyNatoBottomBarGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  return armyNatoLine(box.left + 1, box.bottom - 1.4, box.right - 1, box.bottom - 1.4);
}

function armyNatoLetters(letters: string, frame: ArmyNatoFrameKind): string {
  if (!/^[A-Z]{2,3}$/.test(letters)) {
    throw new Error(`NATO letter glyph must be 2 or 3 capital letters, got ${letters}`);
  }
  const box = armyNatoContentBox(frame);
  const span = box.right - box.left;
  const fontSize = letters.length === 3 ? span / 3.2 : span / 2.5;
  return `<text x="${armyNatoX(box.centerX)}" y="${armyNatoY(box.centerY)}" text-anchor="middle" dominant-baseline="central" fill="currentColor" font-family="sans-serif" font-weight="700" font-size="${armyNatoLength(fontSize, `${letters} font size`)}">${letters}</text>`;
}

function armyNatoSofGlyph(frame: ArmyNatoFrameKind): string {
  return armyNatoLetters('SOF', frame);
}

function armyNatoSfGlyph(frame: ArmyNatoFrameKind): string {
  return armyNatoLetters('SF', frame);
}

function armyNatoRisingSlashGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  return armyNatoLine(box.left, box.bottom, box.right, box.top);
}

function armyNatoPlugGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const width = box.right - box.left;
  const height = box.bottom - box.top;
  const bodyLeft = box.left + width * 0.16;
  const bodyRight = box.left + width * 0.62;
  const bodyTop = box.centerY - height * 0.22;
  const bodyBottom = box.centerY + height * 0.22;
  const prongEnd = box.right - width * 0.08;
  const body = armyNatoStroke(
    `M ${armyNatoX(bodyLeft)} ${armyNatoY(bodyTop)} H ${armyNatoX(bodyRight)} V ${armyNatoY(bodyBottom)} H ${armyNatoX(bodyLeft)}`,
  );
  const prongs = [0.25, 0.5, 0.75]
    .map((fraction) => {
      const prongY = bodyTop + (bodyBottom - bodyTop) * fraction;
      return armyNatoLine(bodyRight, prongY, prongEnd, prongY);
    })
    .join('');
  return body + prongs;
}

function armyNatoLightningGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const width = box.right - box.left;
  const height = box.bottom - box.top;
  const xAt = (fraction: number) => box.left + width * fraction;
  const yAt = (fraction: number) => box.top + height * fraction;
  return armyNatoFill(
    `M ${armyNatoX(xAt(0.68))} ${armyNatoY(yAt(0.02))} L ${armyNatoX(xAt(0.18))} ${armyNatoY(yAt(0.46))} L ${armyNatoX(xAt(0.48))} ${armyNatoY(yAt(0.46))} L ${armyNatoX(xAt(0.16))} ${armyNatoY(yAt(0.98))} L ${armyNatoX(xAt(0.86))} ${armyNatoY(yAt(0.4))} L ${armyNatoX(xAt(0.5))} ${armyNatoY(yAt(0.46))} Z`,
  );
}

function armyNatoOvalGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  return armyNatoEllipse(
    box.centerX,
    box.centerY,
    (box.right - box.left) * 0.28,
    (box.bottom - box.top) * 0.2,
    false,
    0,
  );
}

function armyNatoCrossedPaddlesGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const rx = (box.right - box.left) * 0.72;
  const ry = (box.bottom - box.top) * 0.16;
  return (
    armyNatoEllipse(box.centerX, box.centerY, rx, ry, true, 34) +
    armyNatoEllipse(box.centerX, box.centerY, rx, ry, true, -34)
  );
}

function armyNatoAnchorGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const height = box.bottom - box.top;
  const width = box.right - box.left;
  const ringRadius = height * 0.1;
  const ringCenterY = box.top + ringRadius + 0.3;
  const shankTop = ringCenterY + ringRadius;
  const shankBottom = box.bottom - height * 0.16;
  const stockY = shankTop + height * 0.18;
  const flukeY = shankBottom - height * 0.22;
  const ring = armyNatoCircle(box.centerX, ringCenterY, ringRadius, false);
  const shank = armyNatoLine(box.centerX, shankTop, box.centerX, shankBottom);
  const stock = armyNatoLine(box.centerX - width * 0.2, stockY, box.centerX + width * 0.2, stockY);
  const flukes = armyNatoStroke(
    `M ${armyNatoX(box.centerX - width * 0.36)} ${armyNatoY(flukeY)} Q ${armyNatoX(box.centerX - width * 0.36)} ${armyNatoY(box.bottom - 0.4)} ${armyNatoX(box.centerX)} ${armyNatoY(shankBottom)} Q ${armyNatoX(box.centerX + width * 0.36)} ${armyNatoY(box.bottom - 0.4)} ${armyNatoX(box.centerX + width * 0.36)} ${armyNatoY(flukeY)}`,
  );
  return ring + shank + stock + flukes;
}

function armyNatoMpGlyph(frame: ArmyNatoFrameKind): string {
  return armyNatoLetters('MP', frame);
}

function armyNatoUpArrowGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const height = box.bottom - box.top;
  const circleRadius = height * 0.14;
  const circleY = box.bottom - circleRadius - 0.4;
  const headY = box.top + 0.6;
  const headHalf = (box.right - box.left) * 0.14;
  const shaftBottom = circleY - circleRadius - 0.3;
  const headBaseY = headY + height * 0.18;
  return (
    armyNatoCircle(box.centerX, circleY, circleRadius, false) +
    armyNatoLine(box.centerX, headBaseY, box.centerX, shaftBottom) +
    armyNatoStroke(
      `M ${armyNatoX(box.centerX - headHalf)} ${armyNatoY(headBaseY)} L ${armyNatoX(box.centerX)} ${armyNatoY(headY)} L ${armyNatoX(box.centerX + headHalf)} ${armyNatoY(headBaseY)}`,
    )
  );
}

function armyNatoNarrowArchGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const half = (box.right - box.left) * 0.14;
  const footY = box.bottom - 0.6;
  const peakY = box.top + (box.bottom - box.top) * 0.18;
  return armyNatoStroke(
    `M ${armyNatoX(box.centerX - half)} ${armyNatoY(footY)} L ${armyNatoX(box.centerX - half)} ${armyNatoY(peakY + half)} Q ${armyNatoX(box.centerX - half)} ${armyNatoY(peakY)} ${armyNatoX(box.centerX)} ${armyNatoY(peakY)} Q ${armyNatoX(box.centerX + half)} ${armyNatoY(peakY)} ${armyNatoX(box.centerX + half)} ${armyNatoY(peakY + half)} L ${armyNatoX(box.centerX + half)} ${armyNatoY(footY)}`,
  );
}

function armyNatoMetGlyph(frame: ArmyNatoFrameKind): string {
  return armyNatoLetters('MET', frame);
}

function armyNatoCrossGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  return (
    armyNatoLine(box.left, box.centerY, box.right, box.centerY) +
    armyNatoLine(box.centerX, box.top, box.centerX, box.bottom)
  );
}

function armyNatoCrescentBarGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const height = box.bottom - box.top;
  const width = box.right - box.left;
  const crescentTop = box.centerY - height * 0.34;
  const crescentBottom = box.centerY + height * 0.34;
  const leftTip = box.left + width * 0.04;
  const leftBelly = box.left + width * 0.3;
  const rightBelly = box.right - width * 0.3;
  const rightTip = box.right - width * 0.04;
  return armyNatoStroke(
    `M ${armyNatoX(leftTip)} ${armyNatoY(crescentTop)} Q ${armyNatoX(leftBelly)} ${armyNatoY(box.centerY)} ${armyNatoX(leftTip)} ${armyNatoY(crescentBottom)} M ${armyNatoX(leftBelly)} ${armyNatoY(box.centerY)} L ${armyNatoX(rightBelly)} ${armyNatoY(box.centerY)} M ${armyNatoX(rightTip)} ${armyNatoY(crescentTop)} Q ${armyNatoX(rightBelly)} ${armyNatoY(box.centerY)} ${armyNatoX(rightTip)} ${armyNatoY(crescentBottom)}`,
  );
}

function armyNatoSaltireGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  return (
    armyNatoLine(box.left, box.top, box.right, box.bottom) +
    armyNatoLine(box.right, box.top, box.left, box.bottom)
  );
}

function armyNatoTopBarGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  return armyNatoLine(box.left + 1, box.top + 1.4, box.right - 1, box.top + 1.4);
}

function armyNatoCrossTicksGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const width = box.right - box.left;
  const height = box.bottom - box.top;
  const tickTop = box.centerY - height * 0.22;
  const tickBottom = box.centerY + height * 0.22;
  return (
    armyNatoCrossGlyph(frame) +
    armyNatoLine(box.left + width * 0.28, tickTop, box.left + width * 0.28, tickBottom) +
    armyNatoLine(box.right - width * 0.28, tickTop, box.right - width * 0.28, tickBottom)
  );
}

function armyNatoFunnelGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const height = box.bottom - box.top;
  const half = (box.right - box.left) * 0.22;
  const mouthY = box.top + height * 0.12;
  const neckY = box.top + height * 0.46;
  return (
    armyNatoStroke(
      `M ${armyNatoX(box.centerX - half)} ${armyNatoY(mouthY)} L ${armyNatoX(box.centerX)} ${armyNatoY(neckY)} L ${armyNatoX(box.centerX + half)} ${armyNatoY(mouthY)}`,
    ) + armyNatoLine(box.centerX, neckY, box.centerX, box.bottom - 0.6)
  );
}

function armyNatoEodGlyph(frame: ArmyNatoFrameKind): string {
  return armyNatoLetters('EOD', frame);
}

function armyNatoEwGlyph(frame: ArmyNatoFrameKind): string {
  return armyNatoLetters('EW', frame);
}

function armyNatoGateGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const height = box.bottom - box.top;
  const barY = box.centerY - height * 0.16;
  const footY = box.centerY + height * 0.32;
  return (
    armyNatoLine(box.left + 1, barY, box.right - 1, barY) +
    armyNatoLine(box.left + 1, barY, box.left + 1, footY) +
    armyNatoLine(box.centerX, barY, box.centerX, footY) +
    armyNatoLine(box.right - 1, barY, box.right - 1, footY)
  );
}

function armyNatoBowedBarsGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const height = box.bottom - box.top;
  const topY = box.centerY - height * 0.22;
  const bottomY = box.centerY + height * 0.22;
  const sag = height * 0.16;
  return armyNatoStroke(
    `M ${armyNatoX(box.left + 0.6)} ${armyNatoY(topY)} Q ${armyNatoX(box.centerX)} ${armyNatoY(topY + sag)} ${armyNatoX(box.right - 0.6)} ${armyNatoY(topY)} M ${armyNatoX(box.left + 0.6)} ${armyNatoY(bottomY)} Q ${armyNatoX(box.centerX)} ${armyNatoY(bottomY - sag)} ${armyNatoX(box.right - 0.6)} ${armyNatoY(bottomY)}`,
  );
}

function armyNatoVerticalCurvesGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const width = box.right - box.left;
  const leftX = box.centerX - width * 0.12;
  const rightX = box.centerX + width * 0.12;
  const bulge = width * 0.1;
  return armyNatoStroke(
    `M ${armyNatoX(leftX)} ${armyNatoY(box.top + 0.6)} Q ${armyNatoX(leftX + bulge)} ${armyNatoY(box.centerY)} ${armyNatoX(leftX)} ${armyNatoY(box.bottom - 0.6)} M ${armyNatoX(rightX)} ${armyNatoY(box.top + 0.6)} Q ${armyNatoX(rightX - bulge)} ${armyNatoY(box.centerY)} ${armyNatoX(rightX)} ${armyNatoY(box.bottom - 0.6)}`,
  );
}

function armyNatoBowtieGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const height = box.bottom - box.top;
  const wingTop = box.centerY - height * 0.22;
  const wingBottom = box.centerY + height * 0.22;
  return (
    armyNatoFill(
      `M ${armyNatoX(box.left + 0.8)} ${armyNatoY(wingTop)} L ${armyNatoX(box.centerX)} ${armyNatoY(box.centerY)} L ${armyNatoX(box.left + 0.8)} ${armyNatoY(wingBottom)} Z`,
    ) +
    armyNatoFill(
      `M ${armyNatoX(box.right - 0.8)} ${armyNatoY(wingTop)} L ${armyNatoX(box.centerX)} ${armyNatoY(box.centerY)} L ${armyNatoX(box.right - 0.8)} ${armyNatoY(wingBottom)} Z`,
    )
  );
}

function armyNatoSplitTrianglesGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const height = box.bottom - box.top;
  const width = box.right - box.left;
  const wingTop = box.centerY - height * 0.2;
  const wingBottom = box.centerY + height * 0.2;
  const gap = width * 0.14;
  return (
    armyNatoFill(
      `M ${armyNatoX(box.left + 0.8)} ${armyNatoY(wingTop)} L ${armyNatoX(box.centerX - gap)} ${armyNatoY(box.centerY)} L ${armyNatoX(box.left + 0.8)} ${armyNatoY(wingBottom)} Z`,
    ) +
    armyNatoFill(
      `M ${armyNatoX(box.right - 0.8)} ${armyNatoY(wingTop)} L ${armyNatoX(box.centerX + gap)} ${armyNatoY(box.centerY)} L ${armyNatoX(box.right - 0.8)} ${armyNatoY(wingBottom)} Z`,
    )
  );
}

function armyNatoDotGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const radius = Math.min(box.right - box.left, box.bottom - box.top) * 0.22;
  return armyNatoCircle(box.centerX, box.centerY, radius, true);
}

function armyNatoWideOvalGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  return armyNatoEllipse(
    box.centerX,
    box.centerY,
    (box.right - box.left) * 0.46,
    (box.bottom - box.top) * 0.34,
    false,
    0,
  );
}

function armyNatoUpTriangleGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  return armyNatoStroke(
    `M ${armyNatoX(box.centerX)} ${armyNatoY(box.top + 0.4)} L ${armyNatoX(box.left + 0.4)} ${armyNatoY(box.bottom - 0.4)} L ${armyNatoX(box.right - 0.4)} ${armyNatoY(box.bottom - 0.4)} Z`,
  );
}

function armyNatoArchBaseGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const width = box.right - box.left;
  const height = box.bottom - box.top;
  const half = width * 0.14;
  const baseY = box.centerY + height * 0.22;
  const peakY = box.top + height * 0.16;
  const arch = armyNatoStroke(
    `M ${armyNatoX(box.centerX - half)} ${armyNatoY(baseY)} L ${armyNatoX(box.centerX - half)} ${armyNatoY(peakY + half)} Q ${armyNatoX(box.centerX - half)} ${armyNatoY(peakY)} ${armyNatoX(box.centerX)} ${armyNatoY(peakY)} Q ${armyNatoX(box.centerX + half)} ${armyNatoY(peakY)} ${armyNatoX(box.centerX + half)} ${armyNatoY(peakY + half)} L ${armyNatoX(box.centerX + half)} ${armyNatoY(baseY)}`,
  );
  const base = armyNatoLine(box.centerX - width * 0.32, baseY, box.centerX + width * 0.32, baseY);
  return arch + base;
}

function armyNatoHillArcGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  const baseY = box.bottom - 0.8;
  const crestY = box.bottom - (box.bottom - box.top) * 0.42;
  return armyNatoStroke(
    `M ${armyNatoX(box.left + 0.4)} ${armyNatoY(baseY)} Q ${armyNatoX(box.centerX)} ${armyNatoY(crestY)} ${armyNatoX(box.right - 0.4)} ${armyNatoY(baseY)}`,
  );
}

function armyNatoCssGlyph(frame: ArmyNatoFrameKind): string {
  return armyNatoLetters('CSS', frame);
}

function armyNatoFallingSlashGlyph(frame: ArmyNatoFrameKind): string {
  const box = armyNatoContentBox(frame);
  return armyNatoLine(box.left, box.top, box.right, box.bottom);
}

const armyNatoGlyphBySymbol: readonly ((frame: ArmyNatoFrameKind) => string)[] = [
  armyNatoChevronGlyph,
  armyNatoWheelGlyph,
  armyNatoTentGlyph,
  armyNatoBottomBarGlyph,
  armyNatoSofGlyph,
  armyNatoSfGlyph,
  armyNatoRisingSlashGlyph,
  armyNatoPlugGlyph,
  armyNatoLightningGlyph,
  armyNatoOvalGlyph,
  armyNatoCrossedPaddlesGlyph,
  armyNatoAnchorGlyph,
  armyNatoMpGlyph,
  armyNatoUpArrowGlyph,
  armyNatoNarrowArchGlyph,
  armyNatoMetGlyph,
  armyNatoCrossGlyph,
  armyNatoCrescentBarGlyph,
  armyNatoSaltireGlyph,
  armyNatoTopBarGlyph,
  armyNatoCrossTicksGlyph,
  armyNatoFunnelGlyph,
  armyNatoEodGlyph,
  armyNatoEwGlyph,
  armyNatoGateGlyph,
  armyNatoBowedBarsGlyph,
  armyNatoVerticalCurvesGlyph,
  armyNatoBowtieGlyph,
  armyNatoSplitTrianglesGlyph,
  armyNatoDotGlyph,
  armyNatoWideOvalGlyph,
  armyNatoUpTriangleGlyph,
  armyNatoArchBaseGlyph,
  armyNatoHillArcGlyph,
  armyNatoCssGlyph,
  armyNatoFallingSlashGlyph,
];

function armyNatoGlyphList(): readonly ((frame: ArmyNatoFrameKind) => string)[] {
  if (armyNatoGlyphBySymbol.length !== ARMY_NATO_GLYPH_COUNT) {
    throw new Error(`NATO glyph list length is ${armyNatoGlyphBySymbol.length}, expected ${ARMY_NATO_GLYPH_COUNT}`);
  }
  return armyNatoGlyphBySymbol;
}

function armyNatoFrameMarkup(frame: ArmyNatoFrameKind): string {
  if (frame === 'neutral-square') {
    return armyNatoNeutralSquareFrame();
  }
  if (frame === 'unknown-quatrefoil') {
    return armyNatoUnknownQuatrefoilFrame();
  }
  throw new Error(`Unknown NATO frame kind ${frame}`);
}

function formatArmyNatoIconId(serial: number): string {
  if (!Number.isInteger(serial) || serial < ARMY_NATO_PART3_FIRST_SERIAL || serial > ARMY_NATO_PART3_LAST_SERIAL) {
    throw new Error(`NATO icon serial ${serial} is outside ${ARMY_NATO_PART3_FIRST_SERIAL}-${ARMY_NATO_PART3_LAST_SERIAL}`);
  }
  return `nato-${String(serial).padStart(3, '0')}`;
}

function wrapArmyNatoSvg(iconId: string, body: string): string {
  if (body.includes('http') || body.includes('<image')) {
    throw new Error(`NATO icon ${iconId} body contains a forbidden reference: ${body}`);
  }
  if (!body.includes('currentColor')) {
    throw new Error(`NATO icon ${iconId} body is missing currentColor: ${body}`);
  }
  const svgMarkup = `<svg viewBox="0 0 50 30">${body}</svg>`;
  if (!svgMarkup.startsWith('<svg viewBox="0 0 50 30">') || !svgMarkup.endsWith('</svg>')) {
    throw new Error(`NATO icon ${iconId} svgMarkup is not a complete svg: ${svgMarkup}`);
  }
  return svgMarkup;
}

function armyNatoIconForSymbol(
  serial: number,
  frame: ArmyNatoFrameKind,
  symbolNumber: number,
): ArmyFormationIcon {
  const iconId = formatArmyNatoIconId(serial);
  const glyph = armyNatoGlyphList()[symbolNumber - 1];
  if (!glyph) {
    throw new Error(`NATO symbol ${symbolNumber} has no glyph for ${iconId}`);
  }
  const glyphMarkup = glyph(frame);
  if (!glyphMarkup.includes('currentColor')) {
    throw new Error(`NATO symbol ${symbolNumber} for ${iconId} glyph is missing currentColor`);
  }
  return {
    id: iconId,
    svgMarkup: wrapArmyNatoSvg(iconId, `${armyNatoFrameMarkup(frame)}${glyphMarkup}`),
  };
}

function listNeutralNatoIcons(): ArmyFormationIcon[] {
  const icons: ArmyFormationIcon[] = [];
  for (let serial = 97; serial <= 108; serial += 1) {
    const symbolNumber = serial - 72;
    if (symbolNumber < 25 || symbolNumber > 36) {
      throw new Error(`Neutral NATO serial ${serial} mapped to symbol ${symbolNumber}, expected 25-36`);
    }
    icons.push(armyNatoIconForSymbol(serial, 'neutral-square', symbolNumber));
  }
  return icons;
}

function listUnknownNatoIcons(): ArmyFormationIcon[] {
  const icons: ArmyFormationIcon[] = [];
  for (let serial = 109; serial <= 144; serial += 1) {
    const symbolNumber = serial - 108;
    if (symbolNumber < 1 || symbolNumber > 36) {
      throw new Error(`Unknown NATO serial ${serial} mapped to symbol ${symbolNumber}, expected 1-36`);
    }
    icons.push(armyNatoIconForSymbol(serial, 'unknown-quatrefoil', symbolNumber));
  }
  return icons;
}

function assertArmyNatoPart3Count(icons: readonly ArmyFormationIcon[]): void {
  if (icons.length !== ARMY_NATO_PART3_ICON_COUNT) {
    throw new Error(`NATO part 3 icon count is ${icons.length}, expected ${ARMY_NATO_PART3_ICON_COUNT}`);
  }
}

function assertArmyNatoPart3Ids(icons: readonly ArmyFormationIcon[]): void {
  for (let index = 0; index < icons.length; index += 1) {
    const icon = icons[index];
    if (!icon) {
      throw new Error(`NATO part 3 icon at index ${index} is missing`);
    }
    const expectedId = formatArmyNatoIconId(ARMY_NATO_PART3_FIRST_SERIAL + index);
    if (icon.id !== expectedId) {
      throw new Error(`NATO part 3 icon at index ${index} has id ${icon.id}, expected ${expectedId}`);
    }
  }
}

function assertArmyNatoPart3Markup(icons: readonly ArmyFormationIcon[]): void {
  const seenMarkup = new Set<string>();
  for (const icon of icons) {
    if (seenMarkup.has(icon.svgMarkup)) {
      throw new Error(`NATO icon ${icon.id} repeats another icon shape`);
    }
    seenMarkup.add(icon.svgMarkup);
    if (
      !icon.svgMarkup.includes('viewBox="0 0 50 30"') ||
      !icon.svgMarkup.includes('currentColor') ||
      icon.svgMarkup.includes('http') ||
      icon.svgMarkup.includes('<image')
    ) {
      throw new Error(`NATO icon ${icon.id} svgMarkup failed the local currentColor contract: ${icon.svgMarkup}`);
    }
  }
}

function assertArmyNatoPart3Icons(icons: readonly ArmyFormationIcon[]): void {
  assertArmyNatoPart3Count(icons);
  assertArmyNatoPart3Ids(icons);
  assertArmyNatoPart3Markup(icons);
}

export function listArmyNatoIconsPart3(): readonly ArmyFormationIcon[] {
  const icons = [...listNeutralNatoIcons(), ...listUnknownNatoIcons()];
  assertArmyNatoPart3Icons(icons);
  return icons;
}
