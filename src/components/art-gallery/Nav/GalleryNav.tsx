import {Link, useLocation} from 'react-router';
import {gotoTopOfPage} from '@components/scroll';
import {FC} from 'react';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {useGallery} from '@components/art-gallery/Art/Context';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import './GalleryNav.css';

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
  const pagination = art?.pagination;
  const firstPage = 1;
  const currentPage = page ?? firstPage;
  const lastPage = pagination?.totalPages ?? currentPage;

  const hasNextPage = currentPage < lastPage;
  const nextPage = hasNextPage ? currentPage + 1 : currentPage;
  const hasPrevPage = currentPage > firstPage;
  const prevPage = hasPrevPage ? currentPage - 1 : currentPage;

  const totalRecords = pagination?.total;
  const pageSize = pagination?.limit ?? size ?? defaultRecordLimit;
  const firstRecord = 1 + pageSize * (currentPage - 1);
  const lastRecord = currentPage === lastPage ? totalRecords : pageSize * currentPage;

  return <nav className="pagination backdrop" aria-label="pagination" id={id}>
    {hasPrevPage && <>
      <Link to={`${path}${createSearchParams({page: firstPage})}`} onClick={gotoTopOfPage} className="page first field attentive bold">
        FIRST
      </Link>
      <Link to={`${path}${createSearchParams({page: prevPage})}`} onClick={gotoTopOfPage} className="page prev field attentive bold">
        PREV
      </Link>
    </>}
    <output className="info field">
      <span>{firstRecord} - {lastRecord}</span>
      <span>of</span>
      <span>{totalRecords || '—'}</span>
    </output>
    {hasNextPage && <>
      <Link to={`${path}${createSearchParams({page: nextPage})}`} onClick={gotoTopOfPage} className="page next field attentive bold">
        NEXT
      </Link>
      <Link to={`${path}${createSearchParams({page: lastPage})}`} onClick={gotoTopOfPage} className="page last field attentive bold">
        LAST
      </Link>
    </>}
  </nav>;
};
