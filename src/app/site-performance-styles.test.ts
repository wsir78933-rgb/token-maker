import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesheet = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');

function removeCssComments(cssSource: string) {
  const commentFreeCss = cssSource.replace(
    /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\//g,
    (token) => (token.startsWith('/*') ? ' ' : token)
  );
  const unquotedCss = commentFreeCss.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '');
  if (unquotedCss.includes('/*')) {
    throw new Error('Unterminated CSS comment or string');
  }
  return commentFreeCss;
}

function getDirectCssRuleBodies(cssSource: string, selector: string) {
  const css = removeCssComments(cssSource);
  const normalizedSelector = selector.trim().replace(/\s+/g, ' ');
  const matchingBodies: string[] = [];
  let headerStart = 0;
  let bodyStart = -1;
  let braceDepth = 0;
  let quote: '"' | "'" | null = null;

  for (let index = 0; index < css.length; index += 1) {
    const character = css[index];

    if (quote) {
      if (character === '\\') {
        index += 1;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
    } else if (braceDepth === 0 && character === ';') {
      headerStart = index + 1;
    } else if (character === '{') {
      if (braceDepth === 0) {
        bodyStart = index + 1;
      }
      braceDepth += 1;
    } else if (character === '}') {
      if (braceDepth === 0) {
        throw new Error(`Unexpected closing CSS brace at offset ${index}`);
      }
      braceDepth -= 1;

      if (braceDepth === 0) {
        const header = css
          .slice(headerStart, bodyStart - 1)
          .trim()
          .replace(/\s+/g, ' ');
        if (header === normalizedSelector) {
          matchingBodies.push(css.slice(bodyStart, index));
        }
        headerStart = index + 1;
      }
    }
  }

  if (quote || braceDepth !== 0) {
    throw new Error('Unterminated CSS string or rule block');
  }

  return matchingBodies;
}

function getUniqueCssRuleBody(cssSource: string, selector: string) {
  const matchingBodies = getDirectCssRuleBodies(cssSource, selector);
  if (matchingBodies.length !== 1) {
    throw new Error(`Expected one direct CSS rule for ${selector}; found ${matchingBodies.length}`);
  }
  return matchingBodies[0];
}

function getCssDeclarationValues(ruleBody: string, property: string) {
  const commentFreeBody = removeCssComments(ruleBody);
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const declarationPattern = new RegExp(
    `(?:^|;)\\s*${escapedProperty}\\s*:\\s*([^;]+)`,
    'g'
  );
  return [...commentFreeBody.matchAll(declarationPattern)].map((match) =>
    match[1].trim()
  );
}

function getTransitionProperties(ruleBody: string) {
  const longhands = ['transition-property', 'transition-duration', 'transition-delay', 'transition-timing-function'];

  for (const longhand of longhands) {
    if (getCssDeclarationValues(ruleBody, longhand).length > 0) {
      throw new Error(`Transition longhand is not allowed: ${longhand}`);
    }
  }

  const shorthandValues = getCssDeclarationValues(ruleBody, 'transition');
  if (shorthandValues.length !== 1) {
    throw new Error(`Expected one transition declaration; found ${shorthandValues.length}`);
  }

  return shorthandValues[0]
    .split(/,(?![^()]*\))/)
    .map((transition) => transition.trim().split(/\s+/)[0]);
}

describe('CSS contract helpers', () => {
  it('finds declarations after comments without stripping comment markers in strings', () => {
    const ruleBody = `
      content: "/* keep this text */";
      color: red;
      /* declaration separator */
      backdrop-filter: blur(4px);
    `;

    expect(getCssDeclarationValues(ruleBody, 'backdrop-filter')).toEqual([
      'blur(4px)',
    ]);
  });

  it('rejects transition longhands even when the shorthand looks allowed', () => {
    const ruleBody = `
      transition: opacity 220ms ease;
      transition-property: opacity, max-height;
    `;

    expect(() => getTransitionProperties(ruleBody)).toThrow(
      'Transition longhand is not allowed: transition-property'
    );
  });

  it('matches complete direct rules and preserves nested media boundaries', () => {
    const cssSource = `
      /* .target { color: red; } */
      .target-prefix { color: blue; }
      .target { color: green; }
      @media (max-width: 767px) { .target { color: purple; } }
      @media (max-width: 767px) { .other { color: orange; } }
    `;
    const mediaBodies = getDirectCssRuleBodies(
      cssSource,
      '@media (max-width: 767px)'
    );

    expect(getUniqueCssRuleBody(cssSource, '.target')).toContain('color: green');
    expect(mediaBodies).toHaveLength(2);
    expect(getUniqueCssRuleBody(mediaBodies[0], '.target')).toContain(
      'color: purple'
    );
    expect(() =>
      getUniqueCssRuleBody('.target {} .target {}', '.target')
    ).toThrow('Expected one direct CSS rule for .target; found 2');
  });
});

describe('site content-page performance styles', () => {
  it('keeps surface-card effects compositor-friendly', () => {
    const surfaceRule = getUniqueCssRuleBody(
      stylesheet,
      '.site-surface-card,\n.site-surface-subcard'
    );
    const hoverRule = getUniqueCssRuleBody(
      stylesheet,
      '.site-surface-card:hover,\n.site-surface-subcard:hover'
    );

    expect(getCssDeclarationValues(surfaceRule, 'backdrop-filter')).toEqual([]);
    expect(getTransitionProperties(surfaceRule)).toEqual(['border-color', 'transform']);
    expect(getCssDeclarationValues(hoverRule, 'box-shadow')).toEqual([]);
  });

  it('keeps FAQ transitions off layout properties', () => {
    const blogFaqRule = getUniqueCssRuleBody(
      stylesheet,
      '.site-rich-text .blog-faq-answer,\n.site-rich-text .blog-faq-section .blog-faq-item > :not(h3)'
    );
    const templateFaqRule = getUniqueCssRuleBody(
      stylesheet,
      '.site-template-faq-answer'
    );

    expect(getTransitionProperties(blogFaqRule)).toEqual(['opacity']);
    expect(getTransitionProperties(templateFaqRule)).toEqual(['opacity', 'transform']);
  });

  it('uses reduced topbar blur and one mobile override across matching media blocks', () => {
    const topbarRule = getUniqueCssRuleBody(stylesheet, '.site-topbar');
    const mobileTopbarRules = getDirectCssRuleBodies(
      stylesheet,
      '@media (max-width: 767px)'
    ).flatMap((mediaBody) =>
      getDirectCssRuleBodies(mediaBody, '.site-topbar')
    );

    expect(mobileTopbarRules).toHaveLength(1);
    expect(getCssDeclarationValues(topbarRule, 'backdrop-filter')).toEqual(['blur(8px)']);
    expect(getCssDeclarationValues(mobileTopbarRules[0], 'backdrop-filter')).toEqual(['none']);
  });
});
