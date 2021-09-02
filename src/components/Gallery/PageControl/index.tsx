import React, {FormEvent, useState} from 'react';
import {useGallery} from '../Context';
import {useQuery} from '../../hooks';
import {Source} from '../../../data/types';
import './PageControl.scss';
import './PageControl.layout.scss';

export const PageControl = () => {
    const {art} = useGallery();
    const {queryObj: {page, size, tab}, updateQueryString} = useQuery<{ page: number, size: number, tab: string }>();
    const [pageNumber, updatePageNumber] = useState(page);
    const [pageSize, updatePageSize] = useState(size);

    const firstPage = 1;
    const lastPage = art?.pagination?.totalPages ?? Number.MAX_VALUE;

    const gotoTopOfPage = () => window.scrollTo(0, 0);
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        gotoTopOfPage();
        event.currentTarget.reset();
        updateQueryString({page: pageNumber, size: pageSize});
    };

    return <form onSubmit={onSubmit} id="page-control">
        <label id="go-to-label" className="title" htmlFor="go-to">Page #</label>
        <input type="number"
               id="go-to"
               min={firstPage}
               max={lastPage}
               className="control input"
               data-testid="go-to"
               placeholder={String(page)}
               onWheel={e => e.currentTarget.blur()}
               onChange={event => updatePageNumber(+event.currentTarget.value)}/>
        <label id="per-page-label" className="title" htmlFor="per-page">Per Page</label>
        <input type="number"
               className="control input"
               data-testid="per-page"
               min={1}
               max={100}
               placeholder={String(size)}
               id="per-page"
               onInput={event => {
                   const number = +event.currentTarget.value;
                   if (number > 10 && tab === Source.RIJK) {
                       event.currentTarget.value = String(Math.round(number / 10) * 10);
                   }
               }}
               onChange={event => updatePageSize(+event.currentTarget.value)}/>
        <button type="submit" id="submit-page-number" className="control">Go</button>
    </form>;
};