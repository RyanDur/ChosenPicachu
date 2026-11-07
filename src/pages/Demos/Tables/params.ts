import * as schema from 'schemawax';

export type Track = 'pointer' | 'keyboard';

export type World = 'react' | 'vanilla';

type TablesDials = {
  track: schema.Decoder<Track>;
  world: schema.Decoder<World>;
  defaults: {world: World; track: Track};
};

export const tablesDials = (): TablesDials => ({
  track: schema.literalUnion('pointer', 'keyboard'),
  world: schema.literalUnion('react', 'vanilla'),
  defaults: {world: 'react', track: 'pointer'}
});
