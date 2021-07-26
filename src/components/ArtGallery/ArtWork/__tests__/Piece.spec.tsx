import {render, screen} from '@testing-library/react';
import {Paths} from '../../../../App';
import {MemoryRouter} from 'react-router-dom';
import {ArtWork} from '../index';
import {data} from '../../../../data';
import {nanoid} from 'nanoid';
import * as faker from 'faker';

describe('viewing a piece', () => {
    const piece = {
        id: 1234,
        imageId: nanoid(),
        title: faker.lorem.words(),
        altText: faker.lorem.sentence()
    };

    beforeEach(() => {
        data.getPiece = (id, onSuccess) => {
            onSuccess(piece);
        };
        render(<MemoryRouter initialEntries={[`${Paths.artGallery}/1234`]}>
            <ArtWork/>
        </MemoryRouter>);
    });

    it('should display the data', () => {
        expect(screen.getByText(piece.title)).toBeInTheDocument();
    });
});