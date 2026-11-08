import {HTTPError} from './HTTPError';

const phrases: Record<HTTPError, string> = {
  [HTTPError.NETWORK_ERROR]: 'could not be reached',
  [HTTPError.SERVER_ERROR]: 'is having trouble',
  [HTTPError.FORBIDDEN]: 'turned the request away',
  [HTTPError.NOT_FOUND]: 'has nothing at that address',
  [HTTPError.CANNOT_DECODE]: 'sent something unreadable',
  [HTTPError.JSON_BODY_ERROR]: 'sent something unreadable',
  [HTTPError.UNKNOWN]: 'failed'
};

type Trouble = {
  with: (subject: string) => (error: HTTPError) => string;
};

export const trouble: Trouble = {
  with: subject => error => `${subject} ${phrases[error]}`
};
