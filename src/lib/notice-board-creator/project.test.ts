import { describe, expect, it } from 'vitest';

import {
  NoticeBoardValidationError,
  createBoardNotice,
  createEmptyNoticeBoardProject,
  parseNoticeBoardFile,
  requireNoticeBoardProject,
  serializeNoticeBoardFile,
} from '@/lib/notice-board-creator/project';
import { parseGoogleFontInputs } from '@/lib/notice-board-creator/fonts';

function createCompleteNoticeBoardProject() {
  const emptyProject = createEmptyNoticeBoardProject();
  const notice = createBoardNotice('paper-03', 'quest-notice-1', emptyProject.boardWidth);
  notice.text = 'The old road is unsafe after dusk.';
  notice.x = 34.5;
  notice.y = 62.25;
  notice.width = 187.5;
  notice.style = {
    ...notice.style,
    fontSize: 22,
    lineHeight: 30,
    color: '#5b2418',
    textAlign: 'center',
  };

  return {
    ...emptyProject,
    boardWidth: 1280,
    notices: [notice],
    customFonts: [
      parseGoogleFontInputs(
        'https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap',
        'font-family: "Uncial Antiqua", serif;',
      ),
    ],
  };
}

describe('notice board project', () => {
  it('starts with a versioned empty project at the default width', () => {
    expect(createEmptyNoticeBoardProject()).toEqual({
      version: 1,
      boardWidth: 960,
      notices: [],
      customFonts: [],
    });
  });

  it('creates a paper notice with the expected editable defaults', () => {
    const notice = createBoardNotice('paper-01', 'first-notice', 960);

    expect(notice).toEqual({
      id: 'first-notice',
      paperId: 'paper-01',
      text: '',
      x: 0,
      y: 0,
      width: 200,
      style: {
        fontFamily: "'Trebuchet MS', Helvetica, sans-serif",
        fontSize: 20,
        lineHeight: 20,
        color: '#1d0f03',
        textAlign: 'left',
        fontStyle: 'normal',
      },
    });
  });

  it('round trips the complete project including board width and custom fonts', () => {
    const project = createCompleteNoticeBoardProject();
    const restoredProject = parseNoticeBoardFile(serializeNoticeBoardFile(project));

    expect(restoredProject).toEqual(project);
    expect(restoredProject.boardWidth).toBe(1280);
    expect(restoredProject.customFonts).toEqual(project.customFonts);
  });

  it('returns a defensive copy of a valid project', () => {
    const project = createCompleteNoticeBoardProject();
    const checkedProject = requireNoticeBoardProject(project);
    const restoredNotice = checkedProject.notices[0];

    if (restoredNotice === undefined) {
      throw new Error('Expected the checked notice board project to contain one notice.');
    }

    restoredNotice.text = 'Changed after validation.';
    expect(project.notices[0]?.text).toBe('The old road is unsafe after dusk.');
  });

  it('rejects unsupported versions and unexpected keys at the project boundary', () => {
    const unsupportedVersion = { ...createCompleteNoticeBoardProject(), version: 2 };
    const unexpectedProjectKey = { ...createCompleteNoticeBoardProject(), scripts: ['alert(1)'] };

    expect(() => requireNoticeBoardProject(unsupportedVersion)).toThrow(NoticeBoardValidationError);
    expect(() => requireNoticeBoardProject(unsupportedVersion)).toThrow('2');
    expect(() => requireNoticeBoardProject(unexpectedProjectKey)).toThrow(NoticeBoardValidationError);
    expect(() => requireNoticeBoardProject(unexpectedProjectKey)).toThrow('scripts');
  });

  it('reports a safe JSON summary when a project field receives an object', () => {
    const projectWithObjectVersion = {
      ...createEmptyNoticeBoardProject(),
      version: { received: 'bad' },
    };

    expect(() => requireNoticeBoardProject(projectWithObjectVersion)).toThrow('{"received":"bad"}');
  });

  it('rejects unsafe HTML masquerading as a text project file', () => {
    const receivedText = '<img src=x onerror="alert(1)"><script>alert(1)</script>';

    expect(() => parseNoticeBoardFile(receivedText)).toThrow(NoticeBoardValidationError);
    expect(() => parseNoticeBoardFile(receivedText)).toThrow('img');
  });

  it('rejects a text project larger than one mebibyte', () => {
    const oversizedText = ' '.repeat(1024 * 1024 + 1);

    expect(() => parseNoticeBoardFile(oversizedText)).toThrow(NoticeBoardValidationError);
    expect(() => parseNoticeBoardFile(oversizedText)).toThrow('1048577');
  });
});
