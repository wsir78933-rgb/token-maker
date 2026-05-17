import type { BlogPost, BlogPostHeading } from './types';

function decodeHeadingText(value: string) {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function createHeadingSlug(text: string) {
  const normalized = text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['']/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'section';
}

function isFaqHeadingText(text: string) {
  const normalized = text.toLowerCase();
  return normalized.includes('faq') || normalized.includes('常见问题');
}

function addHtmlClass(openingTag: string, className: string) {
  const classMatch = openingTag.match(/\sclass=(['"])(.*?)\1/i);

  if (!classMatch) {
    return openingTag.replace(/>$/, ` class="${className}">`);
  }

  const [fullMatch, quote, currentClasses] = classMatch;
  const classNames = currentClasses.split(/\s+/).filter(Boolean);

  if (classNames.includes(className)) {
    return openingTag;
  }

  return openingTag.replace(fullMatch, ` class=${quote}${className} ${currentClasses}${quote}`);
}
function enhanceBlogFaqHtml(html: string) {
  const htmlWithFaqCards = enhanceExistingFaqCards(html);
  const h2Matches = Array.from(htmlWithFaqCards.matchAll(/<h2\b[^>]*>[\s\S]*?<\/h2>/gi));

  if (h2Matches.length === 0) {
    return htmlWithFaqCards;
  }

  let enhancedHtml = '';
  let cursor = 0;

  h2Matches.forEach((headingMatch, index) => {
    const headingStartIndex = headingMatch.index ?? 0;
    const headingHtml = headingMatch[0];
    const headingEndIndex = headingStartIndex + headingHtml.length;
    const nextHeadingIndex = h2Matches[index + 1]?.index ?? htmlWithFaqCards.length;
    const sectionHtml = htmlWithFaqCards.slice(headingEndIndex, nextHeadingIndex);
    const headingText = decodeHeadingText(headingHtml);

    enhancedHtml += htmlWithFaqCards.slice(cursor, headingEndIndex);
    enhancedHtml += isFaqHeadingText(headingText) ? wrapFaqSegment(sectionHtml) : sectionHtml;
    cursor = nextHeadingIndex;
  });

  return enhancedHtml + htmlWithFaqCards.slice(cursor);
}

export function addHeadingAnchors(post: BlogPost): BlogPost {
  if (!post.bodyHtml) {
    return post;
  }

  const headingCounts = new Map<string, number>();
  const headings: BlogPostHeading[] = [];
  const bodyHtml = enhanceBlogFaqHtml(post.bodyHtml).replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, levelValue, attrs, innerHtml) => {
    const text = decodeHeadingText(innerHtml);

    if (!text) {
      return match;
    }

    const level = Number(levelValue) as BlogPostHeading['level'];
    const existingId = attrs.match(/\sid=(['"])(.*?)\1/i)?.[2];
    const baseId = existingId ?? createHeadingSlug(text);
    const nextCount = (headingCounts.get(baseId) ?? 0) + 1;
    const uniqueId = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;

    headingCounts.set(baseId, nextCount);
    headings.push({ id: uniqueId, text, level });

    if (existingId) {
      return `<h${level}${attrs.replace(/\sid=(['"])(.*?)\1/i, ` id="${uniqueId}"`)}>${innerHtml}</h${level}>`;
    }

    return `<h${level}${attrs} id="${uniqueId}">${innerHtml}</h${level}>`;
  });

  return {
    ...post,
    bodyHtml,
    headings,
  };
}

function addHtmlAttribute(openingTag: string, name: string, value: string) {
  const attrPattern = new RegExp(`\\s${name}=(['"]).*?\\1`, 'i');

  if (attrPattern.test(openingTag)) {
    return openingTag;
  }

  return openingTag.replace(/>$/, ` ${name}="${value}">`);
}

function enhanceExistingFaqCards(html: string) {
  return html.replace(
    /(<section\b(?=[^>]*\bid=["']faq["'])[^>]*>)([\s\S]*?)(<\/section>)/gi,
    (_match, openingTag: string, innerHtml: string, closingTag: string) => {
      const sectionTag = addHtmlClass(openingTag, 'blog-faq-section');
      const enhancedInnerHtml = innerHtml.replace(/<article\b[^>]*>/gi, (articleTag) =>
        addHtmlAttribute(addHtmlClass(articleTag, 'blog-faq-item'), 'tabindex', '0'),
      );

      return `${sectionTag}${enhancedInnerHtml}${closingTag}`;
    },
  );
}

function wrapFaqSegment(segmentHtml: string) {
  if (/<article\b/i.test(segmentHtml) || /\bblog-faq-list\b/i.test(segmentHtml)) {
    return segmentHtml;
  }

  const questionMatches = Array.from(segmentHtml.matchAll(/<h3\b[^>]*>[\s\S]*?<\/h3>/gi));

  if (questionMatches.length === 0) {
    return segmentHtml;
  }

  const firstQuestionIndex = questionMatches[0].index ?? 0;
  const leadInHtml = segmentHtml.slice(0, firstQuestionIndex);
  const faqItemsHtml = questionMatches
    .map((questionMatch, index) => {
      const questionHtml = questionMatch[0];
      const questionIndex = questionMatch.index ?? 0;
      const answerStartIndex = questionIndex + questionHtml.length;
      const nextQuestionIndex = questionMatches[index + 1]?.index ?? segmentHtml.length;
      const answerHtml = segmentHtml.slice(answerStartIndex, nextQuestionIndex).trim();

      return `<article class="blog-faq-item" tabindex="0">
${questionHtml}
<div class="blog-faq-answer">
${answerHtml}
</div>
</article>`;
    })
    .join('\n');

  return `${leadInHtml}<div class="blog-faq-list">
${faqItemsHtml}
</div>`;
}
