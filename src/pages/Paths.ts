export enum Paths {
  home = '/',
  demos = '/demos/',
  demoTab = '/demos/:topic/',
  users = '/users/',
  artGallery = '/gallery/',
  chartTutorial = '/demos/charts/:kind/',
  games = '/games/',
  record = '/record/',
  practice = '/practice/',
  practiceTab = '/practice/:concern/',
  development = '/development/',
  repo = 'https://github.com/RyanDur/ChosenPicachu'
}

export const fileInRepository = (path: string): string => `${Paths.repo}/blob/main/${path}`;
export const directoryInRepository = (path: string): string => `${Paths.repo}/tree/main/${path}`;
