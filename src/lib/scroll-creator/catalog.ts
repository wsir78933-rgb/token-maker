export type ScrollPaper = {
  id: string;
  src: string;
};

export type ScrollFontOption = {
  name: string;
  family: string;
};

export const SCROLL_PAPERS = [
  { id: 'paper01', src: '/scroll-creator/scroll-1.png' },
  { id: 'paper02', src: '/scroll-creator/scroll-2.png' },
  { id: 'paper03', src: '/scroll-creator/scroll-3.png' },
  { id: 'paper04', src: '/scroll-creator/scroll-4.png' },
  { id: 'paper05', src: '/scroll-creator/scroll-5.png' },
  { id: 'paper06', src: '/scroll-creator/scroll-6.png' },
  { id: 'paper07', src: '/scroll-creator/scroll-7.png' },
  { id: 'paper08', src: '/scroll-creator/scroll-8.png' },
  { id: 'paper09', src: '/scroll-creator/scroll-9.png' },
  { id: 'paper10', src: '/scroll-creator/scroll-10.png' },
  { id: 'paper11', src: '/scroll-creator/scroll-11.png' },
  { id: 'paper12', src: '/scroll-creator/scroll-12.png' },
  { id: 'paper13', src: '/scroll-creator/scroll-13.png' },
  { id: 'paper14', src: '/scroll-creator/scroll-14.png' },
  { id: 'paper15', src: '/scroll-creator/scroll-15.png' },
] as const satisfies readonly ScrollPaper[];

export const SCROLL_FONT_OPTIONS = [
  { name: 'Trebuchet MS', family: 'Trebuchet MS' },
  { name: 'Verdana', family: 'Verdana' },
  { name: 'Courier New', family: 'Courier New' },
  { name: 'Lucida Console', family: 'Lucida Console' },
  { name: 'Impact', family: 'Impact' },
  { name: 'Comic Sans MS', family: 'Comic Sans MS' },
  { name: 'Arial Black', family: 'Arial Black' },
  { name: 'Times New Roman', family: 'Times New Roman' },
] as const satisfies readonly ScrollFontOption[];

function describeReceivedValue(value: unknown): string {
  return typeof value === 'string' ? JSON.stringify(value) : String(value);
}

export function getScrollPaper(id: unknown): ScrollPaper {
  if (typeof id === 'string') {
    const paper = SCROLL_PAPERS.find((candidate) => candidate.id === id);

    if (paper !== undefined) {
      return paper;
    }
  }

  throw new Error(`Unknown scroll paper id. Received ${describeReceivedValue(id)}.`);
}
