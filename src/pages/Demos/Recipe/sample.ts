export type Sample = {
  text: string;
  path: string;
  url: string;
};

export type CodeFile = {
  path: string;
  url: string;
  owner?: string;
  text?: string;
};

export type Origin = {
  file: CodeFile;
  line: number;
  kind: 'linked' | 'exhibit';
};

export type Line = {
  text: string;
  dim?: boolean;
  from?: Origin;
};
