export type MuseumReply<Answer> =
  | { reply: 'unasked' }
  | { reply: 'asked' }
  | { reply: 'answered'; answer: Answer }
  | { reply: 'refused' };
