import {Link} from 'react-router-dom';
import React from 'react';
import {Paths} from '../../../App';
import {useQuery} from '../../hooks';
import {useArtGallery} from '../Context';
import './GalleryNav.scss';

export const GalleryNav = () => {
    const {art} = useArtGallery();
    const {page} = useQuery<{ page: number }>({page: 1});
    const firstPage = 1;
    const lastPage = art?.pagination?.totalPages ?? firstPage;
    const currentPage = +page;

    const hasNextPage = currentPage < lastPage;
    const nextPage = () => hasNextPage ? currentPage + 1 : currentPage;
    const hasPrevPage = currentPage > firstPage;
    const prevPage = () => hasPrevPage ? currentPage - 1 : currentPage;

    return <nav className="pagination" onClick={() => window.scrollTo(0, 0)}>
        {hasPrevPage && <Link to={`${Paths.artGallery}?page=${firstPage}`}
                              id="first" className="page" data-testid="first-page">
          FIRST
        </Link>}
        {hasPrevPage && <Link to={`${Paths.artGallery}?page=${prevPage()}`}
                              id="prev" className="page" data-testid="prev-page">
          PREV
        </Link>}
        {hasNextPage && <Link to={`${Paths.artGallery}?page=${nextPage()}`}
                              id="next" className="page" data-testid="next-page">
          NEXT
        </Link>}
        {hasNextPage && <Link to={`${Paths.artGallery}?page=${lastPage}`}
                              id="last" className="page" data-testid="last-page">
          LAST
        </Link>}
    </nav>;
};