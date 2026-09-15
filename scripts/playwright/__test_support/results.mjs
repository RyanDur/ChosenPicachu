export const outcome = (projectName, status, message) =>
  ({projectName, status, results: [{status, error: message === undefined ? undefined : {message}}]});
