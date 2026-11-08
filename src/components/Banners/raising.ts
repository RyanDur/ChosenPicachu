import {createContext, Dispatch} from 'react';

export type Banner = {
  readonly id: string;
  readonly message: string;
};

type BannerRaised = {readonly type: 'raised'; readonly banner: Banner};
type BannerLowered = {readonly type: 'lowered'; readonly id: string};

export type BannerChange = BannerRaised | BannerLowered;

export const bannerChange = {
  raised: (message: string): BannerRaised => ({type: 'raised', banner: {id: crypto.randomUUID(), message}}),
  lowered: (id: string): BannerLowered => ({type: 'lowered', id})
};

type BannerNews = {
  readonly initial: readonly Banner[];
  readonly reduce: (standing: readonly Banner[], change: BannerChange) => readonly Banner[];
};

export const bannerNews: BannerNews = {
  initial: [],
  reduce: (standing, change) => {
    switch (change.type) {
      case 'raised': return standing.some(({message}) => message === change.banner.message)
        ? standing
        : [...standing, change.banner];
      case 'lowered': return standing.filter(({id}) => id !== change.id);
    }
  }
};

export const Raised = createContext<readonly Banner[]>(bannerNews.initial);
export const Raising = createContext<Dispatch<BannerChange>>(() => undefined);
