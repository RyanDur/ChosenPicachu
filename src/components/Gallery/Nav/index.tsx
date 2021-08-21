import {Link, useHistory} from 'react-router-dom';
import React, {FC, FormEvent, useState} from 'react';
import {Paths} from '../../../App';
import {useQuery} from '../../hooks';
import {useGallery} from '../Context';
import {toQueryObj, toQueryString} from '../../../util/URL';
import './GalleryNav.scss';
import './GalleryNav.layout.scss';

interface Props {
    id?: string;
}

export const GalleryNav: FC<Props> = ({id}) => {
    const {art} = useGallery();
    const history = useHistory();
    const {page} = useQuery<{ page: string }>({page: '1'});
    const [pageNumber, updatePageNumber] = useState(page);

    const currentQuery = toQueryObj(history.location.search);
    const firstPage = 1;
    const lastPage = art?.pagination?.totalPages ?? Number.MAX_VALUE;
    const currentPage = +page;

    const hasNextPage = currentPage < lastPage;
    const nextPage = hasNextPage ? currentPage + 1 : currentPage;
    const hasPrevPage = currentPage > firstPage;
    const prevPage = hasPrevPage ? currentPage - 1 : currentPage;

    const gotoTopOfPage = () => window.scrollTo(0, 0);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        gotoTopOfPage();
        event.currentTarget.reset();
        history.push({search: toQueryString({...currentQuery, page: pageNumber})});
    };

    return <nav className="pagination" id={id}>
        {!hasPrevPage && <article className="fill-left"/> }
        {hasPrevPage && <Link to={`${Paths.artGallery}${toQueryString({...currentQuery, page: firstPage})}`}
                              onClick={gotoTopOfPage}
                              id="first" className="page" data-testid="first-page">
          FIRST
        </Link>}
        {hasPrevPage && <Link to={`${Paths.artGallery}${toQueryString({...currentQuery, page: prevPage})}`}
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
                   onChange={event => updatePageNumber(event.currentTarget.value)}/>
            <button type="submit" id="submit-page-number" className="control">Go</button>
        </form>
        {hasNextPage && <Link to={`${Paths.artGallery}${toQueryString({...currentQuery, page: nextPage})}`}
                              onClick={gotoTopOfPage}
                              id="next" className="page" data-testid="next-page">
          NEXT
        </Link>}
        {hasNextPage && <Link to={`${Paths.artGallery}${toQueryString({...currentQuery, page: lastPage})}`}
                              onClick={gotoTopOfPage}
                              id="last" className="page" data-testid="last-page">
          LAST
        </Link>}
        {!hasNextPage && <article className="fill-right"/> }
    </nav>;
};