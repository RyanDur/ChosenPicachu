import {Link} from 'react-router-dom';
import React, {FC, FormEvent, useState} from 'react';
import {useURL} from '../../hooks';
import {useGallery} from '../Context';
import './GalleryNav.scss';
import './GalleryNav.layout.scss';

interface Props {
    id?: string;
}

export const GalleryNav: FC<Props> = ({id}) => {
    const {art} = useGallery();
    const {
        queryObj: {page, size},
        path,
        updateQueryString,
        nextQueryString
    } = useURL<{ page: number, size: number }>({page: 1, size: 12});
    const [pageNumber, updatePageNumber] = useState(page);
    const [pageSize, updatePageSize] = useState(size);

    const firstPage = 1;
    const lastPage = art?.pagination?.totalPages ?? Number.MAX_VALUE;
    const currentPage = +page;
    const totalRecords = art?.pagination?.total ?? Number.MAX_VALUE;

    const hasNextPage = currentPage < lastPage;
    const nextPage = hasNextPage ? currentPage + 1 : currentPage;
    const hasPrevPage = currentPage > firstPage;
    const prevPage = hasPrevPage ? currentPage - 1 : currentPage;

    const gotoTopOfPage = () => window.scrollTo(0, 0);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        gotoTopOfPage();
        event.currentTarget.reset();
        updateQueryString({page: pageNumber, size: pageSize});
    };

    return <nav className="pagination" id={id}>
        {!hasPrevPage && <article className="fill-left"/>}
        {hasPrevPage && <Link to={`${path}${nextQueryString({page: firstPage})}`}
                              onClick={gotoTopOfPage}
                              id="first" className="page" data-testid="first-page">
          FIRST
        </Link>}
        {hasPrevPage && <Link to={`${path}${nextQueryString({page: prevPage})}`}
                              onClick={gotoTopOfPage}
                              id="prev" className="page" data-testid="prev-page">
          PREV
        </Link>}
        <form onSubmit={onSubmit} id="go-to-page" className="page">
            <input type="number"
                   id="go-to"
                   min={firstPage}
                   max={lastPage}
                   className="control"
                   placeholder="page #"
                   data-testid="go-to"
                   onWheel={e => e.currentTarget.blur()}
                   onChange={event => updatePageNumber(+event.currentTarget.value)}/>
            <input type="number"
                   data-testid="per-page"
                   min={1}
                   max={totalRecords}
                   id="per-page"
                   placeholder="per page"
                   onChange={event => updatePageSize(+event.currentTarget.value)}/>
            <button type="submit" id="submit-page-number" className="control">Go</button>
        </form>
        {hasNextPage && <Link to={`${path}${nextQueryString({page: nextPage})}`}
                              onClick={gotoTopOfPage}
                              id="next" className="page" data-testid="next-page">
          NEXT
        </Link>}
        {hasNextPage && <Link to={`${path}${nextQueryString({page: lastPage})}`}
                              onClick={gotoTopOfPage}
                              id="last" className="page" data-testid="last-page">
          LAST
        </Link>}
        {!hasNextPage && <article className="fill-right"/>}
    </nav>;
};