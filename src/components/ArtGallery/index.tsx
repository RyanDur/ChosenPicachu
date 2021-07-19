import {FC, useEffect, useState} from 'react';
import {Art} from '../../data/types';
import {data} from '../../data';
import {Link} from 'react-router-dom';
import {Paths} from '../../App';
import {useQuery} from '../hooks';
import './ArtGallery.scss';

export const ArtGallery: FC = () => {
    const [art, updateArtWork] = useState<Art>();
    const firstPage = 1;
    const {page} = useQuery<{ page: number }>({page: firstPage});
    const currentPage = +page;

    useEffect(() => {
        data.getAllArt(updateArtWork, currentPage);
    }, [currentPage]);

    const hasNextPage = currentPage < (art?.pagination.totalPages || Number.MAX_VALUE);
    const nextPage = () => hasNextPage ? currentPage + 1 : currentPage;
    const hasPrevPage = currentPage > firstPage;
    const prevPage = () => hasPrevPage ? currentPage - 1 : currentPage;

    return <section id="art-gallery">{art?.pieces
        .map(piece => <figure key={piece.imageId} className="card" tabIndex={0}>
            <img className="loading"
                 onLoad={event => event.currentTarget.classList.remove('loading')}
                 alt={piece.altText} loading="lazy" data-testid="piece"
                 title={piece.title}
                 src={`https://www.artic.edu/iiif/2/${piece.imageId}/full/200,/0/default.jpg`}/>
            <figcaption className="title">{piece.title}</figcaption>
        </figure>)}
        <nav className="pagination">
            {hasPrevPage && <Link to={`${Paths.artGallery}?page=1`}
                                  id="prev" className="page" data-testid="first-page">
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
            {hasNextPage && <Link to={`${Paths.artGallery}?page=${art?.pagination.totalPages}`}
                                  id="next" className="page" data-testid="last-page">
              LAST
            </Link>}
        </nav>
    </section>;
};