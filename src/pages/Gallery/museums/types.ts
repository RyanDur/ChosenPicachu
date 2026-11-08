export type Pagination = {
  total: number;
  limit: number;
  totalPages: number;
};

export type Picture = {
  src: string;
  srcSet?: string;
};

export type Art = {
  id: string;
  title: string;
  picture?: Picture;
  altText: string;
  artistInfo?: string;
};

export type AllArt = {
  pagination: Pagination;
  pieces: Art[];
};

export type SearchOptions = string[];
