import {Link, useLocation} from 'react-router';
import {FC} from 'react';
import {nothing, some} from '@ryandur/sand';
import {useGallery} from '@pages/Gallery/Context';
import './GalleryNav.css';

type Props = {
  id?: string;
};

export const GalleryNav: FC<Props> = ({id}) => {
  const {pagination, page, searchFromShown} = useGallery();
  const location = useLocation();
  const path = location.pathname;
  const firstPage = 1;
  const currentPage = page;
  const lastPage = pagination.map(({totalPages}) => totalPages).orElse(currentPage);

  const hasNextPage = currentPage < lastPage;
  const nextPage = hasNextPage ? currentPage + 1 : currentPage;
  const hasPrevPage = currentPage > firstPage;
  const prevPage = hasPrevPage ? currentPage - 1 : currentPage;

  return <nav className="pagination backdrop field-before field-after" aria-label="pagination" id={id}>
    {hasPrevPage && <>
      <Link to={`${path}${searchFromShown({page: firstPage})}`}
        className="page first field attentive bold">
        <span className="way-words">first page</span>
      </Link> <Link to={`${path}${searchFromShown({page: prevPage})}`}
        className="page prev field attentive bold">
        <span className="way-words">previous page</span>
      </Link> </>}
    {pagination.mBind(({totalPages}) => totalPages > 0 ? some(totalPages) : nothing()).map(totalPages =>
      <output className="info field" key="count">
        Page {currentPage} of {totalPages.toLocaleString()}
      </output>).orNull()}
    {hasNextPage && <>
      {' '}<Link to={`${path}${searchFromShown({page: nextPage})}`}
        className="page next field attentive bold">
        <span className="way-words">next page</span>
      </Link> <Link to={`${path}${searchFromShown({page: lastPage})}`}
        className="page last field attentive bold">
        <span className="way-words">last page</span>
      </Link>
    </>}
  </nav>;
};
