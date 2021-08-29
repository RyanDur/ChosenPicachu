import React, {FormEvent, useState} from 'react';
import {useGallery} from '../Context';
import {useQuery} from '../../hooks';
import './PageControl.scss';

export const PageControl = () => {
    const {art} = useGallery();
    const {queryObj: {page, size}, updateQueryString} = useQuery<{ page: number, size: number }>({page: 1, size: 12});
    const [pageNumber, updatePageNumber] = useState(page);
    const [pageSize, updatePageSize] = useState(size);

    const firstPage = 1;
    const lastPage = art?.pagination?.totalPages ?? Number.MAX_VALUE;
    const totalRecords = art?.pagination?.total ?? Number.MAX_VALUE;

    const gotoTopOfPage = () => window.scrollTo(0, 0);
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        gotoTopOfPage();
        event.currentTarget.reset();
        updateQueryString({page: pageNumber, size: pageSize});
    };

    return <form onSubmit={onSubmit} id="page-control">
        <input type="number"
               id="go-to"
               min={firstPage}
               max={lastPage}
               className="control input"
               placeholder="page #"
               data-testid="go-to"
               onWheel={e => e.currentTarget.blur()}
               onChange={event => updatePageNumber(+event.currentTarget.value)}/>
        <input type="number"
               className="control input"
               data-testid="per-page"
               min={1}
               max={totalRecords}
               id="per-page"
               placeholder="per page"
               onChange={event => updatePageSize(+event.currentTarget.value)}/>
        <button type="submit" id="submit-page-number" className="control">Go</button>
    </form>;
};