import {has} from '@ryandur/sand';
import {env} from '@env';
import {Feed} from '@test-support/feed';
import type {Motion, Origin, Pace} from '../../../Controls';
import {startingTable} from '../starting';
import {boot} from '../boot';

type Stage = {
  readonly feed?: Feed;
  readonly pace?: Pace;
  readonly origin?: Origin;
  readonly motion?: Motion;
};

export const standFrame = ({feed, pace = 'eager', origin = 'hide', motion = 'animated'}: Stage = {}): void => {
  window.__env = {...env, tradeFeed: has(feed) ? feed.url : ''};
  window.__frame = {pace, origin, motion};
  document.body.innerHTML = startingTable({origin, motion});
  boot(document);
};
