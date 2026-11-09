import {Placement} from './placement';

export type Banner = {
  readonly id: string;
  readonly message: string;
  readonly leaving: boolean;
};

type BannerRaised = {readonly type: 'raised'; readonly banner: Banner};
type BannerDismissed = {readonly type: 'dismissed'; readonly id: string};
type BannerLowered = {readonly type: 'lowered'; readonly id: string};
type BannerWithdrawn = {readonly type: 'withdrawn'; readonly message: string};
type BannersPlaced = {readonly type: 'placed'; readonly placement: Placement};
type BannersUnplaced = {readonly type: 'unplaced'};

export type BannerChange =
  BannerRaised | BannerDismissed | BannerLowered | BannerWithdrawn | BannersPlaced | BannersUnplaced;

export const bannerChange = {
  raised: (message: string): BannerRaised =>
    ({type: 'raised', banner: {id: crypto.randomUUID(), message, leaving: false}}),
  dismissed: (id: string): BannerDismissed => ({type: 'dismissed', id}),
  lowered: (id: string): BannerLowered => ({type: 'lowered', id}),
  withdrawn: (message: string): BannerWithdrawn => ({type: 'withdrawn', message}),
  placed: (placement: Placement): BannersPlaced => ({type: 'placed', placement}),
  unplaced: (): BannersUnplaced => ({type: 'unplaced'})
};
