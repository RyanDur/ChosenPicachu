import type {Motion, Origin, Pace} from '../../../Controls';
import eagerKeepAnimated from './EagerKeepAnimated.ts?raw';
import eagerKeepStatic from './EagerKeepStatic.ts?raw';
import eagerHideAnimated from './EagerHideAnimated.ts?raw';
import eagerHideStatic from './EagerHideStatic.ts?raw';
import lazyKeepAnimated from './LazyKeepAnimated.ts?raw';
import lazyKeepStatic from './LazyKeepStatic.ts?raw';
import lazyHideAnimated from './LazyHideAnimated.ts?raw';
import lazyHideStatic from './LazyHideStatic.ts?raw';

export const buildSources: Record<Pace, Record<Origin, Record<Motion, string>>> = {
  eager: {
    keep: {animated: eagerKeepAnimated, static: eagerKeepStatic},
    hide: {animated: eagerHideAnimated, static: eagerHideStatic}
  },
  lazy: {
    keep: {animated: lazyKeepAnimated, static: lazyKeepStatic},
    hide: {animated: lazyHideAnimated, static: lazyHideStatic}
  }
};
