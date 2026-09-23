export type Pagination = {
  total: number;
  limit: number;
  totalPages: number;
};

export type Art = {
  id: string;
  title: string;
  image?: string;
  srcSet?: string;
  altText: string;
  artistInfo: string;
};

export type AllArt = {
  pagination: Pagination;
  pieces: Art[];
};

export type SearchOptions = string[];
