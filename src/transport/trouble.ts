import {HTTPError} from './types';

const phrases: Record<HTTPError, string> = {
  [HTTPError.NETWORK_ERROR]: 'could not be reached',
  [HTTPError.SERVER_ERROR]: 'is having trouble',
  [HTTPError.FORBIDDEN]: 'turned the request away',
  [HTTPError.CANNOT_DECODE]: 'sent something unreadable',
  [HTTPError.JSON_BODY_ERROR]: 'sent something unreadable',
  [HTTPError.UNKNOWN]: 'failed'
};

export const troubleWith = (subject: string) => (error: HTTPError): string =>
  `${subject} ${phrases[error]}`;
