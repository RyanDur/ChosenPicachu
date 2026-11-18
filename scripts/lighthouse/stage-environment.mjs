/** @param {number} port */
export const stageEnvironment = port => ({
  tradeFeed: `ws://localhost:${port}/ws-feed`,
  tradeProduct: 'BTC-USD',
  tradeHistory: '/trade-history',
  aicDomain: '/aic',
  aicPictures: '/aic-image',
  harvardDomain: '/harvard',
  harvardAPIKey: 'recorded',
  vamDomain: '/vam',
  vamPictures: '/vam-image',
  clevelandDomain: '/cleveland',
  usersDomain: '/api/users',
  feedbackToken: 'recorded',
  feedbackEndpoint: '/feedback-graphql'
});
