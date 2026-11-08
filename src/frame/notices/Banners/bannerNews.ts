import {Banner, BannerChange} from './bannerChange';
import {Placement} from './placement';

export type News = {
  readonly banners: readonly Banner[];
  readonly placement: Placement;
};

const unplaced: Placement = {side: 'top', align: 'center', enter: 'above', stack: 'down'};

const initial: News = {banners: [], placement: unplaced};

const reduce = (news: News, change: BannerChange): News => {
  switch (change.type) {
    case 'raised': return news.banners.some(({message}) => message === change.banner.message)
      ? news
      : {...news, banners: [...news.banners, change.banner]};
    case 'dismissed': return {
      ...news,
      banners: news.banners.map(banner => banner.id === change.id ? {...banner, leaving: true} : banner)
    };
    case 'lowered': return {...news, banners: news.banners.filter(({id}) => id !== change.id)};
    case 'placed': return {...news, placement: change.placement};
    case 'unplaced': return {...news, placement: unplaced};
  }
};

export const bannerNews = {initial, reduce};
