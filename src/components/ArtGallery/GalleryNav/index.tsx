import {Link, useHistory} from 'react-router-dom';
import React, {FormEvent, useState} from 'react';
import {Paths} from '../../../App';
import {useQuery} from '../../hooks';
import {useArtGallery} from '../Context';
import './GalleryNav.scss';

export const GalleryNav = () => {
    const {art} = useArtGallery();
    const history = useHistory();
    const {page} = useQuery<{ page: string }>({page: '1'});
    const [pageNumber, updatePageNumber] = useState(page);
    const firstPage = 1;
    const lastPage = art?.pagination?.totalPages ?? Number.MAX_VALUE;
    const currentPage = +page;

    const hasNextPage = currentPage < lastPage;
    const nextPage = () => hasNextPage ? currentPage + 1 : currentPage;
    const hasPrevPage = currentPage > firstPage;
    const prevPage = () => hasPrevPage ? currentPage - 1 : currentPage;

    const gotoTopOfPage = () => window.scrollTo(0, 0);

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        gotoTopOfPage();
        history.push({
            pathname: history.location.pathname,
            search: `?page=${pageNumber}`
        });
    };

    return <nav className="pagination">
        {hasPrevPage && <Link to={`${Paths.artGallery}?page=${firstPage}`}
                              onClick={gotoTopOfPage}
                              id="first" className="page" data-testid="first-page">
          FIRST
        </Link>}
        {hasPrevPage && <Link to={`${Paths.artGallery}?page=${prevPage()}`}
                              onClick={gotoTopOfPage}
                              id="prev" className="page" data-testid="prev-page">
          PREV
        </Link>}
        <form onSubmit={onSubmit} id="go-to-page">
            <input type="number"
                   id="go-to"
                   min={firstPage}
                   max={lastPage}
                   className="control"
                   placeholder="page #"
                   data-testid="go-to"
                   onChange={event => updatePageNumber(event.currentTarget.value)}/>
            <button type="submit" id="submit-page-number" className="control">Go</button>
        </form>
        {hasNextPage && <Link to={`${Paths.artGallery}?page=${nextPage()}`}
                              onClick={gotoTopOfPage}
                              id="next" className="page" data-testid="next-page">
          NEXT
        </Link>}
        {hasNextPage && <Link to={`${Paths.artGallery}?page=${lastPage}`}
                              onClick={gotoTopOfPage}
                              id="last" className="page" data-testid="last-page">
          LAST
        </Link>}
    </nav>;
};