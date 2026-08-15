import type {Motion, Origin, Pace} from '../../../Controls';
import {wire as eagerKeepAnimated} from './EagerKeepAnimated';
import {wire as eagerKeepStatic} from './EagerKeepStatic';
import {wire as eagerHideAnimated} from './EagerHideAnimated';
import {wire as eagerHideStatic} from './EagerHideStatic';
import {wire as lazyKeepAnimated} from './LazyKeepAnimated';
import {wire as lazyKeepStatic} from './LazyKeepStatic';
import {wire as lazyHideAnimated} from './LazyHideAnimated';
import {wire as lazyHideStatic} from './LazyHideStatic';

export const wires: Record<Pace, Record<Origin, Record<Motion, (document: Document) => void>>> = {
  eager: {
    keep: {animated: eagerKeepAnimated, static: eagerKeepStatic},
    hide: {animated: eagerHideAnimated, static: eagerHideStatic}
  },
  lazy: {
    keep: {animated: lazyKeepAnimated, static: lazyKeepStatic},
    hide: {animated: lazyHideAnimated, static: lazyHideStatic}
  }
};
