import {Link, useLocation} from 'react-router';
import {FC, useEffect, useRef} from 'react';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {useGallery} from '@components/art-gallery/Art/Context';
import {defaultRecordLimit} from '@components/art-gallery/museums/config';
import './GalleryNav.css';
import './GalleryNav.layout.css';

type Props = {
  id?: string;
}

const usePrevious = <T,>(value: T) => {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const GalleryNav: FC<Props> = ({id}) => {
  const {art} = useGallery();
  const {
    page, size,
    createSearchParams,
  } = useSearchParamsObject({page: numberParam, size: numberParam}, {page: 1});
  const location = useLocation();
  const path = location.pathname;
  const previous = usePrevious(art?.pagination.total);
  const firstPage = 1;
  const lastPage = art?.pagination?.totalPages ?? Number.MAX_VALUE;
  const currentPage = page ?? firstPage;

  const hasNextPage = currentPage < lastPage;
  const nextPage = hasNextPage ? currentPage + 1 : currentPage;
  const hasPrevPage = currentPage > firstPage;
  const prevPage = hasPrevPage ? currentPage - 1 : currentPage;

  const totalRecords = art?.pagination.total ?? previous;
  const pageSize = art?.pagination.limit ?? size ?? defaultRecordLimit;
  const firstRecord = 1 + pageSize * ((art?.pagination.currentPage ?? currentPage) - 1);
  const lastRecord = art?.pagination.totalPages === currentPage ? totalRecords : pageSize * currentPage;

  const gotoTopOfPage = () => window.scrollTo(0, 0);

  return <nav className="pagination" id={id}>
    {!hasPrevPage && <article className="fill-left"/>}
    {hasPrevPage && <Link to={`${path}${createSearchParams({page: firstPage})}`}
                          onClick={gotoTopOfPage}
                          id="first" className="page" data-testid="first-page">
        FIRST
    </Link>}
    {hasPrevPage && <Link to={`${path}${createSearchParams({page: prevPage})}`}
                          onClick={gotoTopOfPage}
                          id="prev" className="page" data-testid="prev-page">
        PREV
    </Link>}
    <article id="info" className="content" data-testid="info">
      <article>{firstRecord} - {lastRecord}</article>
      <article>of</article>
      <article>{totalRecords || '—'}</article>
    </article>
    {hasNextPage && <Link to={`${path}${createSearchParams({page: nextPage})}`}
                          onClick={gotoTopOfPage}
                          id="next" className="page" data-testid="next-page">
        NEXT
    </Link>}
    {hasNextPage && <Link to={`${path}${createSearchParams({page: lastPage})}`}
                          onClick={gotoTopOfPage}
                          id="last" className="page" data-testid="last-page">
        LAST
    </Link>}
    {!hasNextPage && <article className="fill-right"/>}
  </nav>;
};
