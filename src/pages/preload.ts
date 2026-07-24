export const pageChunks: ReadonlyArray<() => Promise<unknown>> = [
  () => import('@pages/Home/component'),
  () => import('@pages/Gallery/ArtGalleryPage'),
  () => import('@pages/Gallery/ArtGalleryPiecePage'),
  () => import('@pages/Games/GamesPage'),
  () => import('@pages/Games/ThreeInARow')
];

export const fakerHeavyPages: ReadonlyArray<string> = [
  '@pages/About/component',
  '@pages/Users/component'
];

export const preloadPagesWhenIdle = (): void => {
  const warm = (): void => pageChunks.forEach(chunk => void chunk().catch(() => undefined));
  if ('requestIdleCallback' in window) window.requestIdleCallback(() => warm());
  else setTimeout(warm, 200);
};
