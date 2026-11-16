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

export type Line = {
  text: string;
  dim?: boolean;
  from?: {file: CodeFile; line: number};
};
