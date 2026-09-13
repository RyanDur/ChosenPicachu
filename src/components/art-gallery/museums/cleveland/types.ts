import * as schema from 'schemawax';

const ClevelandImageDecoder = schema.object({
  required: {url: schema.string},
  optional: {width: schema.string, height: schema.string}
});

const ClevelandImagesDecoder = schema.object({
  optional: {
    web: schema.nullable(ClevelandImageDecoder),
    print: schema.nullable(ClevelandImageDecoder)
  }
});

const ClevelandCreatorDecoder = schema.object({
  optional: {description: schema.nullable(schema.string)}
});

const ClevelandRecordDecoder = schema.object({
  required: {id: schema.number, title: schema.string},
  optional: {
    creators: schema.array(ClevelandCreatorDecoder),
    tombstone: schema.nullable(schema.string),
    images: schema.nullable(ClevelandImagesDecoder)
  }
});

export const ClevelandAllArtSchema = schema.object({
  required: {
    info: schema.object({required: {total: schema.number}}),
    data: schema.array(ClevelandRecordDecoder)
  }
});

export const ClevelandArtSchema = schema.object({required: {data: ClevelandRecordDecoder}});

export const ClevelandSearchSchema = schema.object({
  required: {data: schema.array(schema.object({required: {title: schema.string}}))}
});

export type ClevelandImage = schema.Output<typeof ClevelandImageDecoder>;
export type ClevelandRecord = schema.Output<typeof ClevelandRecordDecoder>;
export type ClevelandAllArtResponse = schema.Output<typeof ClevelandAllArtSchema>;
export type ClevelandArtResponse = schema.Output<typeof ClevelandArtSchema>;
export type ClevelandSearchResponse = schema.Output<typeof ClevelandSearchSchema>;
