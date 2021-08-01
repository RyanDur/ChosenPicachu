import {fireEvent, render, screen} from '@testing-library/react';
import {Image} from '../index';
import * as faker from 'faker';
import {nanoid} from 'nanoid';
import {MemoryRouter} from 'react-router-dom';
import {Paths} from '../../../../App';

describe('the image', () => {
    const piece = {
        id: Math.random(),
        title: faker.lorem.words(),
        imageId: nanoid(),
        altText: faker.lorem.sentence(),
        artistInfo: faker.lorem.sentence()
    };
    const image = `piece-${piece.imageId}`;

    beforeEach(() => {
        render(<MemoryRouter initialEntries={[Paths.artGallery]}>
            <Image piece={piece}/>
        </MemoryRouter>);
    });

    it('should be loading', () => {
        expect(screen.queryByTestId('loading')).toBeInTheDocument();
    });

    it('should not be errored', () => {
        expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    });

    describe('on image load', () => {
        beforeEach(() => {
            fireEvent.load(screen.getByTestId(image));
        });

        it('should not be loading', () => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        it('should contain the image', () => {
            expect(screen.queryByTestId(image)).toBeInTheDocument();
        });

        it('should not be errored', () => {
            expect(screen.queryByTestId('error')).not.toBeInTheDocument();
        });
    });

    describe('on image load error', () => {
        beforeEach(() => {
            fireEvent.error(screen.getByTestId(image));
        });

        it('should not contain the piece', () => {
            expect(screen.queryByTestId(image)).not.toBeInTheDocument();
        });

        it('should be errored', () => {
            expect(screen.queryByTestId('error')).toBeInTheDocument();
        });

        it('should not be loading', () => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
    });
});