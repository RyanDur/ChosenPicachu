type Assembled = {readonly type: 'assembled'; readonly document: string};
type Loaded = {readonly type: 'loaded'; readonly body: HTMLElement};
type Grown = {readonly type: 'grown'; readonly height: number};

export type PlainFoldChange = Assembled | Loaded | Grown;

export const plainFoldChange = {
  assembled: (document: string): Assembled => ({type: 'assembled', document}),
  loaded: (body: HTMLElement): Loaded => ({type: 'loaded', body}),
  grown: (height: number): Grown => ({type: 'grown', height})
};
