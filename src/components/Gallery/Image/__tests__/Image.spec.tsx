import {act, fireEvent, screen} from '@testing-library/react';
import {Image} from '../index';
import * as faker from 'faker';
import {Paths} from '../../../../App';
import userEvent from '@testing-library/user-event';
import {Rendered, renderWithRouter} from '../../../../__tests__/util';
import {Art} from '../../../../data/artGallery/types/response';
import {Source} from '../../../../data/artGallery/types/resource';

describe('the image', () => {
    const piece: Art = {
        id: faker.lorem.word(),
        title: faker.lorem.words(),
        image: faker.image.imageUrl(),
        altText: faker.lorem.sentence(),
        artistInfo: faker.lorem.sentence()
    };
    const image = `piece-${piece.id}`;
    window.scrollTo = jest.fn();
    let rendered: () => Rendered;

    describe('with link enabled', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            rendered = renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});
        });

        afterEach(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        it('should be loading', () =>
            expect(screen.queryByTestId('loading')).toBeInTheDocument());

        it('should not be errored', () =>
            expect(screen.queryByTestId('error')).not.toBeInTheDocument());

        describe('on image load', () => {
            beforeEach(() => {
                act(() => {
                    fireEvent.load(screen.getByTestId(image));
                });
            });

            it('should not be loading', () =>
                expect(screen.queryByTestId('loading')).not.toBeInTheDocument());

            it('should contain the image', () =>
                expect(screen.queryByTestId(image)).toBeInTheDocument());

            it('should not be errored', () =>
                expect(screen.queryByTestId('error')).not.toBeInTheDocument());

            it('should change location when clicked', () => {
                userEvent.click(screen.getByTestId(image));
                expect(rendered().testLocation?.pathname).toEqual(`${Paths.artGallery}/${piece.id}`);
            });

            it('should scroll to the top of the page', () => {
                userEvent.click(screen.getByTestId(image));
                expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
            });
        });

        describe('on image load error', () => {
            beforeEach(() => {
                act(() => {
                    fireEvent.error(screen.getByTestId(image));
                });
            });

            it('should not contain the piece', () =>
                expect(screen.queryByTestId(image)).not.toBeInTheDocument());

            it('should be errored', () =>
                expect(screen.queryByTestId('error')).toBeInTheDocument());

            it('should not be loading', () =>
                expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
        });
    });

    describe('without an image', () => {
        beforeEach(() =>
            rendered = renderWithRouter(<Image piece={{...piece, image: undefined}}/>, {
                params: {page: 3, tab: Source.AIC}
            }));

        it('should be loading', () =>
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument());

        it('should contain the image', () =>
            expect(screen.queryByTestId(image)).not.toBeInTheDocument());

        it('should not be errored', () =>
            expect(screen.queryByTestId('error')).toBeInTheDocument());
    });

    describe('disabling the link', () => {
        beforeEach(() => rendered =
            renderWithRouter(<Image piece={piece} linkEnabled={false}/>,
                {path: Paths.artGallery}));

        it('should not change location when clicked', () => {
            userEvent.click(screen.getByTestId(image));
            expect(rendered().testLocation?.pathname).toEqual(Paths.artGallery);
        });

        it('should not scroll to the top of the page', () => {
            userEvent.click(screen.getByTestId(image));
            expect(window.scrollTo).not.toHaveBeenCalled();
        });
    });
});