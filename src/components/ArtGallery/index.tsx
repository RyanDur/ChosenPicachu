import {FC, useEffect, useState} from 'react';
import {Art} from '../../data/types';
import {data} from '../../data';
import {Link} from 'react-router-dom';
import {Paths} from '../../App';
import {useQuery} from '../hooks';
import {Loading} from '../Loading';
import {Image} from './Image';
import './ArtGallery.scss';

export const ArtGallery: FC = () => {
    const [art, updateArtWork] = useState<Partial<Art>>();
    const firstPage = 1;
    const {page} = useQuery<{ page: number }>({page: firstPage});
    const currentPage = +page;

    useEffect(() => {
        data.getAllArt(updateArtWork, currentPage);
    }, [currentPage]);

    const hasNextPage = currentPage < (art?.pagination?.totalPages ?? Number.MAX_VALUE);
    const nextPage = () => hasNextPage ? currentPage + 1 : currentPage;
    const hasPrevPage = currentPage > firstPage;
    const prevPage = () => hasPrevPage ? currentPage - 1 : currentPage;

    return <section id="art-gallery">
        {art?.pieces?.length ? art?.pieces.filter(piece => piece.imageId)
            .map(piece => <Link to={`${Paths.artGallery}/${piece.id}`} key={piece.id}>
                <figure className="card" tabIndex={0}>
                    <Image piece={piece} width={200}/>
                    <figcaption className="title">{piece.title}</figcaption>
                </figure>
            </Link>) : <Loading/>}
        <nav className="pagination" onClick={() => updateArtWork({pieces: []})}>
            {hasPrevPage && <Link to={`${Paths.artGallery}?page=1`}
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
            {hasNextPage && <Link to={`${Paths.artGallery}?page=${art?.pagination?.totalPages}`}
                                  id="last" className="page" data-testid="last-page">
              LAST
            </Link>}
        </nav>
    </section>;
};