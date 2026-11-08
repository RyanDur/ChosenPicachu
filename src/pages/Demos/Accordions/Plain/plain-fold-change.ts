type Assembled = {readonly type: 'assembled'; readonly foldMarkup: string};
type Loaded = {readonly type: 'loaded'; readonly body: HTMLElement};
type Grown = {readonly type: 'grown'; readonly height: number};

export type PlainFoldChange = Assembled | Loaded | Grown;

export const plainFoldChange = {
  assembled: (foldMarkup: string): Assembled => ({type: 'assembled', foldMarkup}),
  loaded: (body: HTMLElement): Loaded => ({type: 'loaded', body}),
  grown: (height: number): Grown => ({type: 'grown', height})
};
