import {Link} from 'react-router-dom';
import {FC, useEffect, useRef} from 'react';
import {useQuery} from '../../hooks';
import {useGallery} from '../Context';
import './GalleryNav.css';
import './GalleryNav.layout.css';

interface Props {
    id?: string;
}

const usePrevious = <T = number | unknown>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

export const GalleryNav: FC<Props> = ({id}) => {
    const {art} = useGallery();
    const {
        queryObj: {page, size},
        path,
        nextQueryString
    } = useQuery<{ page: number, size: number }>({page: 1, size: 0});
    const previous = usePrevious(art?.pagination.total);
    const firstPage = 1;
    const lastPage = art?.pagination?.totalPages ?? Number.MAX_VALUE;
    const currentPage = +page;

    const hasNextPage = currentPage < lastPage;
    const nextPage = hasNextPage ? currentPage + 1 : currentPage;
    const hasPrevPage = currentPage > firstPage;
    const prevPage = hasPrevPage ? currentPage - 1 : currentPage;

    const totalRecords = art?.pagination.total ?? previous;
    const firstRecord = 1 + ((art?.pagination.limit || size) * ((art?.pagination.currentPage || page) - 1));
    const lastRecord = art?.pagination.totalPages === page ? totalRecords : (art?.pagination.limit || size) * page;

    const gotoTopOfPage = () => window.scrollTo(0, 0);

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
        <article id="info" className="content" data-testid="info">
            <article>{firstRecord} - {lastRecord}</article>
            <article>of</article>
            <article>{totalRecords || '—'}</article>
        </article>
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
