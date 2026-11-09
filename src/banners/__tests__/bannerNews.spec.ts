import {bannerChange} from '../bannerChange';
import {bannerNews} from '../bannerNews';

const raised = (message: string) => bannerNews.reduce(bannerNews.initial, bannerChange.raised(message));

describe('the banners’ news', () => {
  test('a dismissed banner stands, leaving, until it is lowered', () => {
    const news = raised('the feed is down');
    const [{id}] = news.banners;

    const dismissed = bannerNews.reduce(news, bannerChange.dismissed(id));

    expect(dismissed.banners).toEqual([{id, message: 'the feed is down', leaving: true}]);
  });

  test('a withdrawn message takes down the banner that says it, whoever raised it', () => {
    const news = bannerNews.reduce(raised('the feed is down'), bannerChange.raised('the chart is late'));

    const withdrawn = bannerNews.reduce(news, bannerChange.withdrawn('the feed is down'));

    expect(withdrawn.banners.map(({message}) => message)).toEqual(['the chart is late']);
  });

  test('a message can be raised again once its banner is lowered', () => {
    const news = raised('the feed is down');
    const [{id}] = news.banners;
    const lowered = bannerNews.reduce(bannerNews.reduce(news, bannerChange.dismissed(id)), bannerChange.lowered(id));

    const again = bannerNews.reduce(lowered, bannerChange.raised('the feed is down'));

    expect(again.banners.map(({message}) => message)).toEqual(['the feed is down']);
  });

  test('a message raised while its banner is still leaving stands only once', () => {
    const news = raised('the feed is down');
    const [{id}] = news.banners;

    const again = bannerNews.reduce(bannerNews.reduce(news, bannerChange.dismissed(id)), bannerChange.raised('the feed is down'));

    expect(again.banners).toHaveLength(1);
  });
});
