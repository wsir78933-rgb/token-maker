export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  publishedAt?: string;
  readTime: string;
  coverLabel: string;
  coverImage?: string;
  coverAlt?: string;
  bodyHtml?: string;
  headings?: BlogPostHeading[];
  relatedSlugs?: string[];
  faqItems?: BlogPostFaqItem[];
  seoTitle?: string;
  metaDescription?: string;
  featured?: boolean;
  placeholder?: boolean;
}

export interface BlogPostFaqItem {
  question: string;
  answer: string;
}

export interface BlogPostHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export type PlaceholderCopy = {
  featuredTitle: string;
  featuredExcerpt: string;
  coverLabel: string;
  detailTitle: string;
  detailBody: string;
  ctaTitle: string;
  ctaBody: string;
};
