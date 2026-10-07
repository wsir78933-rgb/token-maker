// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FamilyAvatarEditor } from '@/components/family-tree/FamilyAvatarEditor';
import { FamilyAvatar } from '@/components/family-tree/FamilyAvatar';
import {
  createInitialFamilyTreeAvatar,
  type FamilyTreeAvatar,
} from '@/lib/family-tree/avatar';
import {
  FAMILY_TREE_AVATAR_CATEGORIES,
  FAMILY_TREE_COLOR_PALETTES,
  getFamilyTreeCategoryChoices,
} from '@/lib/family-tree/catalog';
import { getFamilyTreeCopy } from '@/lib/family-tree/copy';
import type {
  FamilyTreeGenerationIndex,
  FamilyTreePersonDraft,
} from '@/lib/family-tree/scene';

const COPY = getFamilyTreeCopy('en');

const EXPECTED_CHOICE_COUNTS: Record<
  (typeof FAMILY_TREE_AVATAR_CATEGORIES)[number],
  number
> = {
  faces: 57,
  hair: 41,
  ears: 5,
  eyes: 40,
  eyebrows: 80,
  noses: 58,
  mouths: 80,
  extras: 52,
};

const EXPECTED_COLOR_KEYS: Partial<
  Record<(typeof FAMILY_TREE_AVATAR_CATEGORIES)[number], keyof typeof FAMILY_TREE_COLOR_PALETTES>
> = {
  faces: 'skinColor',
  hair: 'hairColor',
  eyes: 'eyeColor',
  eyebrows: 'eyebrowColor',
  noses: 'moustacheColor',
};

function createDraft(avatar: FamilyTreeAvatar = createInitialFamilyTreeAvatar()): FamilyTreePersonDraft {
  return {
    avatar,
    name: '',
    age: '',
    description: '',
  };
}

function renderEditor(
  draft = createDraft(),
  generation: FamilyTreeGenerationIndex = 1,
  callbacks: {
    onChange?: (nextDraft: FamilyTreePersonDraft) => void;
    onGenerationChange?: (nextGeneration: FamilyTreeGenerationIndex) => void;
    onRandomize?: () => void;
    onAdd?: () => void;
  } = {},
) {
  return render(
    <FamilyAvatarEditor
      copy={COPY}
      locale="en"
      draft={draft}
      generation={generation}
      onChange={callbacks.onChange ?? vi.fn()}
      onGenerationChange={callbacks.onGenerationChange ?? vi.fn()}
      onRandomize={callbacks.onRandomize ?? vi.fn()}
      onAdd={callbacks.onAdd ?? vi.fn()}
    />,
  );
}

describe('FamilyAvatarEditor', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders all eight tabs and every catalog choice count', () => {
    renderEditor();

    for (const category of FAMILY_TREE_AVATAR_CATEGORIES) {
      const tab = screen.getByRole('tab', {
        name: COPY.categoryNames[category],
      });
      fireEvent.click(tab);

      const panel = screen.getByRole('tabpanel');
      expect(panel.querySelectorAll('[data-family-tree-avatar-choice]')).toHaveLength(
        EXPECTED_CHOICE_COUNTS[category],
      );

      const colorKey = EXPECTED_COLOR_KEYS[category];
      const colorButtons = panel.querySelectorAll('[data-family-tree-avatar-color]');
      expect(colorButtons).toHaveLength(
        colorKey === undefined ? 0 : FAMILY_TREE_COLOR_PALETTES[colorKey].length,
      );

      expect(getFamilyTreeCategoryChoices(category)).toHaveLength(
        EXPECTED_CHOICE_COUNTS[category],
      );
    }
  });

  it('updates controlled text fields, placement, randomize, and add actions', () => {
    const onChange = vi.fn();
    const onGenerationChange = vi.fn();
    const onRandomize = vi.fn();
    const onAdd = vi.fn();
    renderEditor(createDraft(), 1, {
      onChange,
      onGenerationChange,
      onRandomize,
      onAdd,
    });

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Aster' },
    });
    expect(onChange).toHaveBeenLastCalledWith({
      ...createDraft(),
      name: 'Aster',
    });

    fireEvent.change(screen.getByLabelText('Age'), {
      target: { value: 'three centuries' },
    });
    expect(onChange).toHaveBeenLastCalledWith({
      ...createDraft(),
      age: 'three centuries',
    });

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Keeper of the eastern gate' },
    });
    expect(onChange).toHaveBeenLastCalledWith({
      ...createDraft(),
      description: 'Keeper of the eastern gate',
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } });
    expect(onGenerationChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: COPY.randomAvatar }));
    fireEvent.click(screen.getByRole('button', { name: COPY.addPerson }));
    expect(onRandomize).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('uses the source crop windows for compact facial feature choices', () => {
    renderEditor();
    const cropCases = [
      {
        category: 'eyes',
        choiceId: 'eyes1',
        backgroundSize: '237%',
        backgroundPosition: '68% 63%',
      },
      {
        category: 'eyebrows',
        choiceId: 'eb1',
        backgroundSize: '237%',
        backgroundPosition: '68% 50%',
      },
      {
        category: 'noses',
        choiceId: 'nose1',
        backgroundSize: '278%',
        backgroundPosition: '66% 86%',
      },
      {
        category: 'noses',
        choiceId: 'mstch1',
        backgroundSize: '278%',
        backgroundPosition: '66% 86%',
      },
      {
        category: 'mouths',
        choiceId: 'mouth1',
        backgroundSize: '464%',
        backgroundPosition: '60% 93%',
      },
    ] as const;

    for (const cropCase of cropCases) {
      fireEvent.click(screen.getByRole('tab', { name: COPY.categoryNames[cropCase.category] }));
      const choiceButton = document.querySelector(
        '[data-family-tree-avatar-choice="' + cropCase.choiceId + '"]',
      );
      expect(choiceButton).not.toBeNull();
      const thumbnail = choiceButton?.querySelector('span[aria-hidden="true"]');
      expect(thumbnail).not.toBeNull();
      expect((thumbnail as HTMLElement).style.backgroundSize).toBe(cropCase.backgroundSize);
      expect((thumbnail as HTMLElement).style.backgroundPosition).toBe(
        cropCase.backgroundPosition,
      );
    }
  });

  it('applies a choice and a palette index to the current draft', () => {
    const onChange = vi.fn();
    renderEditor(createDraft(), 1, { onChange });

    fireEvent.click(screen.getByRole('tab', { name: COPY.categoryNames.faces }));
    const panel = screen.getByRole('tabpanel');
    fireEvent.click(panel.querySelector('[data-family-tree-avatar-choice="beards1"]')!);
    const choiceSelection = onChange.mock.lastCall?.[0] as FamilyTreePersonDraft;
    expect(choiceSelection.avatar.faces).toBe('beards1');

    fireEvent.click(panel.querySelector('[data-family-tree-avatar-color="skinColor-24"]')!);
    const colorSelection = onChange.mock.lastCall?.[0] as FamilyTreePersonDraft;
    expect(colorSelection.avatar.skinColor).toBe(24);
  });

  it('toggles scars independently and reset wrinkles preserves scars', () => {
    const avatar: FamilyTreeAvatar = {
      ...createInitialFamilyTreeAvatar(),
      extras: {
        faceWrinkle: 'old1',
        eyeWrinkle: 'eyesp1',
        scars: ['scar1'],
      },
    };
    const onChange = vi.fn();
    renderEditor(createDraft(avatar), 1, { onChange });

    fireEvent.click(screen.getByRole('tab', { name: COPY.categoryNames.extras }));
    const panel = screen.getByRole('tabpanel');

    fireEvent.click(panel.querySelector('[data-family-tree-avatar-choice="scar2"]')!);
    const scarSelection = onChange.mock.lastCall?.[0] as FamilyTreePersonDraft;
    expect(scarSelection.avatar.extras.scars).toEqual(['scar1', 'scar2']);
    expect(scarSelection.avatar.extras.faceWrinkle).toBe('old1');
    expect(scarSelection.avatar.extras.eyeWrinkle).toBe('eyesp1');

    fireEvent.click(panel.querySelector('[data-family-tree-avatar-choice="reset-wrinkles"]')!);
    const resetSelection = onChange.mock.lastCall?.[0] as FamilyTreePersonDraft;
    expect(resetSelection.avatar.extras.faceWrinkle).toBeNull();
    expect(resetSelection.avatar.extras.eyeWrinkle).toBeNull();
    expect(resetSelection.avatar.extras.scars).toEqual(['scar1']);
  });

  it('marks the selected option and palette index with aria-pressed', () => {
    renderEditor();

    const facesPanel = screen.getByRole('tabpanel');
    expect(
      facesPanel.querySelector('[data-family-tree-avatar-choice="face1"]')?.getAttribute('aria-pressed'),
    ).toBe('true');

    const skin24 = facesPanel.querySelector(
      '[data-family-tree-avatar-color="skinColor-24"]',
    );
    expect(skin24?.getAttribute('aria-pressed')).toBe('false');
    const skin1 = facesPanel.querySelector(
      '[data-family-tree-avatar-color="skinColor-1"]',
    );
    expect(skin1?.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('tab', { name: COPY.categoryNames.hair }));
    const hairPanel = screen.getByRole('tabpanel');
    expect(
      hairPanel.querySelector('[data-family-tree-avatar-choice="hair1"]')?.getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('moves tab focus with arrow keys', () => {
    renderEditor();

    const facesTab = screen.getByRole('tab', { name: COPY.categoryNames.faces });
    const hairTab = screen.getByRole('tab', { name: COPY.categoryNames.hair });

    fireEvent.keyDown(facesTab, { key: 'ArrowRight' });

    expect(hairTab.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(hairTab);
  });

  it('supports Chinese copy and keeps all labels available', () => {
    const chineseCopy = getFamilyTreeCopy('zh');
    render(
      <FamilyAvatarEditor
        copy={chineseCopy}
        locale="zh"
        draft={createDraft()}
        generation={1}
        onChange={vi.fn()}
        onGenerationChange={vi.fn()}
        onRandomize={vi.fn()}
        onAdd={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: chineseCopy.personEditor })).toBeTruthy();
    expect(screen.getByLabelText(chineseCopy.name)).toBeTruthy();
    expect(screen.getByLabelText(chineseCopy.age)).toBeTruthy();
    expect(screen.getByLabelText(chineseCopy.description)).toBeTruthy();
    expect(
      screen.getByRole('tab', { name: chineseCopy.categoryNames.faces }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: chineseCopy.randomAvatar })).toBeTruthy();
  });

  it('renders source layers with the asset wrinkle opacity', () => {
    const avatar: FamilyTreeAvatar = {
      ...createInitialFamilyTreeAvatar(),
      extras: {
        faceWrinkle: 'old1',
        eyeWrinkle: 'eyesp1',
        scars: [],
      },
    };
    const { container } = render(<FamilyAvatar avatar={avatar} label="Preview" />);

    expect(screen.getByRole('img', { name: 'Preview' })).toBeTruthy();
    const opacities = [...container.querySelectorAll('img')].map(
      (image) => image.style.opacity,
    );
    expect(opacities).toContain('0.4');
  });

  it('uses the no-hair fallback and wrinkle thumbnail opacity', () => {
    renderEditor();
    fireEvent.click(screen.getByRole('tab', { name: COPY.categoryNames.hair }));
    const noHairButton = screen.getByRole('button', { name: 'No hair' });
    expect(noHairButton.querySelector('span[aria-hidden="true"]')?.textContent).toBe('∅');

    fireEvent.click(screen.getByRole('tab', { name: COPY.categoryNames.extras }));
    const faceWrinkleImage = document.querySelector(
      '[data-family-tree-avatar-choice="old1"] img',
    );
    const eyeWrinkleImage = document.querySelector(
      '[data-family-tree-avatar-choice="eyesp1"] img',
    );
    expect((faceWrinkleImage as HTMLImageElement | null)?.style.opacity).toBe('0.4');
    expect((eyeWrinkleImage as HTMLImageElement | null)?.style.opacity).toBe('0.4');
  });
});
