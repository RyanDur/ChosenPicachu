import {Link, useLocation} from 'react-router';
import {gotoTopOfPage} from '@pages/scroll';
import {FC, useState} from 'react';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {useGallery} from '@components/art-gallery/Art/Context';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import './GalleryNav.css';
import './GalleryNav.layout.css';

type Props = {
  id?: string;
}

export const GalleryNav: FC<Props> = ({id}) => {
  const {art} = useGallery();
  const {
    page, size,
    createSearchParams,
  } = useSearchParamsObject({page: numberParam, size: numberParam}, {page: 1});
  const location = useLocation();
  const path = location.pathname;
  const [remembered, setRemembered] = useState<number>();
  const total = art?.pagination.total;
  if (total !== undefined && total !== remembered) {
    setRemembered(total);
  }
  const firstPage = 1;
  const lastPage = art?.pagination?.totalPages ?? Number.MAX_VALUE;
  const currentPage = page ?? firstPage;

  const hasNextPage = currentPage < lastPage;
  const nextPage = hasNextPage ? currentPage + 1 : currentPage;
  const hasPrevPage = currentPage > firstPage;
  const prevPage = hasPrevPage ? currentPage - 1 : currentPage;

  const totalRecords = total ?? remembered;
  const pageSize = art?.pagination.limit ?? size ?? defaultRecordLimit;
  const firstRecord = 1 + pageSize * ((art?.pagination.currentPage ?? currentPage) - 1);
  const lastRecord = art?.pagination.totalPages === currentPage ? totalRecords : pageSize * currentPage;


  return <nav className="gallery-nav pagination" aria-label="pagination" id={id}>
    {!hasPrevPage && <article className="fill-left"/>}
    {hasPrevPage && <Link to={`${path}${createSearchParams({page: firstPage})}`}
                          onClick={gotoTopOfPage}
                          id="first" className="page">
        FIRST
    </Link>}
    {hasPrevPage && <Link to={`${path}${createSearchParams({page: prevPage})}`}
                          onClick={gotoTopOfPage}
                          id="prev" className="page">
        PREV
    </Link>}
    <article id="info">
      <article>{firstRecord} - {lastRecord}</article>
      <article>of</article>
      <article>{totalRecords || '—'}</article>
    </article>
    {hasNextPage && <Link to={`${path}${createSearchParams({page: nextPage})}`}
                          onClick={gotoTopOfPage}
                          id="next" className="page">
        NEXT
    </Link>}
    {hasNextPage && <Link to={`${path}${createSearchParams({page: lastPage})}`}
                          onClick={gotoTopOfPage}
                          id="last" className="page">
        LAST
    </Link>}
    {!hasNextPage && <article className="fill-right"/>}
  </nav>;
};
