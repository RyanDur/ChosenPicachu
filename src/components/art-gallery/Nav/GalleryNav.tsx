import {Link, useLocation} from 'react-router';
import {gotoTopOfPage} from '@components/scroll';
import {FC} from 'react';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {paginationOf, useGallery} from '@components/art-gallery/Art/Context';
import './GalleryNav.css';

type Props = {
  id?: string;
};

export const GalleryNav: FC<Props> = ({id}) => {
  const pagination = paginationOf(useGallery().wall);
  const {
    page,
    createSearchParams
  } = useSearchParamsObject({page: numberParam}, {page: 1});
  const location = useLocation();
  const path = location.pathname;
  const firstPage = 1;
  const currentPage = page;
  const lastPage = pagination.map(({totalPages}) => totalPages).orElse(currentPage);

  const hasNextPage = currentPage < lastPage;
  const nextPage = hasNextPage ? currentPage + 1 : currentPage;
  const hasPrevPage = currentPage > firstPage;
  const prevPage = hasPrevPage ? currentPage - 1 : currentPage;

  const counted = pagination.map(({total, limit}) => ({
    first: Math.min(1 + limit * (currentPage - 1), total),
    last: Math.min(limit * currentPage, total),
    total
  }));

  return <nav className="pagination backdrop" aria-label="pagination" id={id}>
    {hasPrevPage && <>
      <Link to={`${path}${createSearchParams({page: firstPage})}`} onClick={gotoTopOfPage}
        className="page first field attentive bold">
        FIRST
      </Link>
      <Link to={`${path}${createSearchParams({page: prevPage})}`} onClick={gotoTopOfPage}
        className="page prev field attentive bold">
        PREV
      </Link>
    </>}
    {counted.map(({first, last, total}) =>
      <output className="info field" key="count">
        <span>{first} - {last}</span>
        <span>of</span>
        <span>{total}</span>
      </output>).orNull()}
    {hasNextPage && <>
      <Link to={`${path}${createSearchParams({page: nextPage})}`} onClick={gotoTopOfPage}
        className="page next field attentive bold">
        NEXT
      </Link>
      <Link to={`${path}${createSearchParams({page: lastPage})}`} onClick={gotoTopOfPage}
        className="page last field attentive bold">
        LAST
      </Link>
    </>}
  </nav>;
};
