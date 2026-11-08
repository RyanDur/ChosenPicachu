type Assembled = {readonly type: 'assembled'; readonly frameMarkup: string};
type Loaded = {readonly type: 'loaded'; readonly frame: HTMLIFrameElement};
type Grown = {readonly type: 'grown'; readonly height: number};

export type TableFrameChange = Assembled | Loaded | Grown;

export const tableFrameChange = {
  assembled: (frameMarkup: string): Assembled => ({type: 'assembled', frameMarkup}),
  loaded: (frame: HTMLIFrameElement): Loaded => ({type: 'loaded', frame}),
  grown: (height: number): Grown => ({type: 'grown', height})
};
