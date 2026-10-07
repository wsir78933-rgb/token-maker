'use client';

import type { CSSProperties } from 'react';

import { requireFamilyTreeAvatar, type FamilyTreeAvatar } from '@/lib/family-tree/avatar';
import {
  FAMILY_TREE_AVATAR_HEIGHT,
  FAMILY_TREE_AVATAR_WIDTH,
  getFamilyTreeAvatarLayers,
} from '@/lib/family-tree/avatar-render';

import styles from './avatar.module.css';

type FamilyAvatarProps = {
  avatar: FamilyTreeAvatar;
  label?: string;
  className?: string;
};

function formatReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (
    value === undefined ||
    value === null ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'symbol' ||
    typeof value === 'function'
  ) {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? Object.prototype.toString.call(value) : serialized;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.length > 0) {
      return `${Object.prototype.toString.call(value)} (JSON serialization failed: ${error.message})`;
    }

    throw error;
  }
}

function requireOptionalLabel(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      `Family avatar label must be a non-empty string when provided. Received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireOptionalClassName(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Family avatar className must be a string when provided. Received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireLayerNumber(value: unknown, label: string, maximum: number): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > maximum
  ) {
    throw new Error(
      `${label} must be a finite number from 0 to ${maximum}. Received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireLayerOpacity(value: unknown, label: string): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 1
  ) {
    throw new Error(
      `${label} must be a finite number from 0 to 1. Received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireLayerSource(value: unknown, layerId: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      `Family avatar layer ${JSON.stringify(layerId)} src must be a non-empty string. Received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireLayerId(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      `Family avatar layer id must be a non-empty string. Received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

export function FamilyAvatar({
  avatar,
  label,
  className,
}: FamilyAvatarProps) {
  const validatedAvatar = requireFamilyTreeAvatar(avatar);
  const validatedLabel = requireOptionalLabel(label);
  const validatedClassName = requireOptionalClassName(className);
  const layers = getFamilyTreeAvatarLayers(validatedAvatar);
  const rootClassName = [styles.avatar, validatedClassName]
    .filter((value) => value !== undefined && value.length > 0)
    .join(' ');

  return (
    <span
      className={rootClassName}
      role={validatedLabel === undefined ? undefined : 'img'}
      aria-label={validatedLabel}
      aria-hidden={validatedLabel === undefined ? true : undefined}
      style={{
        aspectRatio: `${FAMILY_TREE_AVATAR_WIDTH} / ${FAMILY_TREE_AVATAR_HEIGHT}`,
      }}
    >
      {layers.map((layer, layerIndex) => {
        const layerId = requireLayerId(layer.id);
        const source = requireLayerSource(layer.src, layerId);
        const left = requireLayerNumber(
          layer.x,
          `Family avatar layer ${JSON.stringify(layerId)} x`,
          FAMILY_TREE_AVATAR_WIDTH,
        );
        const top = requireLayerNumber(
          layer.y,
          `Family avatar layer ${JSON.stringify(layerId)} y`,
          FAMILY_TREE_AVATAR_HEIGHT,
        );
        const width = requireLayerNumber(
          layer.width,
          `Family avatar layer ${JSON.stringify(layerId)} width`,
          FAMILY_TREE_AVATAR_WIDTH,
        );
        const height = requireLayerNumber(
          layer.height,
          `Family avatar layer ${JSON.stringify(layerId)} height`,
          FAMILY_TREE_AVATAR_HEIGHT,
        );
        const opacity = requireLayerOpacity(
          layer.opacity ?? 1,
          `Family avatar layer ${JSON.stringify(layerId)} opacity`,
        );

        const layerStyle: CSSProperties = {
          left: `${(left / FAMILY_TREE_AVATAR_WIDTH) * 100}%`,
          top: `${(top / FAMILY_TREE_AVATAR_HEIGHT) * 100}%`,
          width: `${(width / FAMILY_TREE_AVATAR_WIDTH) * 100}%`,
          height: `${(height / FAMILY_TREE_AVATAR_HEIGHT) * 100}%`,
          opacity,
          zIndex: layerIndex,
        };

        return (
          // eslint-disable-next-line @next/next/no-img-element -- avatar layers are local static assets and must stay independently composable.
          <img
            key={layerId}
            className={styles.avatarLayer}
            src={source}
            alt=""
            width={width}
            height={height}
            style={layerStyle}
            draggable={false}
          />
        );
      })}
    </span>
  );
}

export type { FamilyAvatarProps };
