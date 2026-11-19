import {Maybe} from '@ryandur/sand';
import {opening} from '@pages/Gallery/opening';
import {Pagination} from '@pages/Gallery/museums';

// a museum may serve fewer works than it counts (the V&A stops near 10,000), so the end is what its pages reach
const reachable = ({total, limit, totalPages}: Pagination): number => Math.min(total, totalPages * limit);

export const pages = {
  withinTheEnd: (page: number, size: number, pagination: Maybe<Pagination>): number =>
    pagination.map(reachable).map(works => Math.min(page, Math.max(Math.ceil(works / size), opening.page))).orElse(page)
};
