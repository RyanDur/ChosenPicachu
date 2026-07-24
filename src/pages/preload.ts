export const pageChunks: ReadonlyArray<() => Promise<unknown>> = [
  () => import('@pages/Home/component'),
  () => import('@pages/About/component'),
  () => import('@pages/Users/component'),
  () => import('@pages/Gallery/ArtGalleryPage'),
  () => import('@pages/Gallery/ArtGalleryPiecePage'),
  () => import('@components/art-gallery/Search'),
  () => import('@components/art-gallery/PageControl'),
  () => import('@components/art-gallery/Nav'),
  () => import('@pages/Games/ThreeInARow')
];

export const preloadPagesWhenIdle = (): void => {
  const warm = (): void => pageChunks.forEach(chunk => void chunk().catch(() => undefined));
  if ('requestIdleCallback' in window) window.requestIdleCallback(() => warm());
  else setTimeout(warm, 200);
};
