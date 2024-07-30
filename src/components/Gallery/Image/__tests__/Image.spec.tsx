import {fireEvent, screen} from '@testing-library/react';
import {Image} from '../index';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '../../../../__tests__/util';
import {Art} from '../../../../data/artGallery/types/response';
import {Source} from '../../../../data/artGallery/types/resource';
import {faker} from '@faker-js/faker';
import {Paths} from '../../../../routes/Paths.ts';

describe('the image', () => {
  const piece: Art = {
    id: faker.lorem.word(),
    title: faker.lorem.words(),
    image: faker.image.url(),
    altText: faker.lorem.sentence(),
    artistInfo: faker.lorem.sentence()
  };
  const image = `piece-${piece.id}`;

  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  describe('with link enabled', () => {
    it('should be loading', () => {
      renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

      expect(screen.queryByTestId('loading')).toBeInTheDocument();
    });

    it('should not be errored', () => {
      renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

      expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    });

    describe('on image load', () => {
      it('should not be loading', () => {
        renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

        fireEvent.load(screen.getByTestId(image));

        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      it('should contain the image', () => {
        renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

        fireEvent.load(screen.getByTestId(image));

        expect(screen.queryByTestId(image)).toBeInTheDocument();
      });

      it('should not be errored', () => {
        renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

        fireEvent.load(screen.getByTestId(image));

        expect(screen.queryByTestId('error')).not.toBeInTheDocument();
      });

      it('should change location when clicked', async () => {
        const rendered = renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

        fireEvent.load(screen.getByTestId(image));
        await userEvent.click(screen.getByTestId(image));

        expect(rendered().testLocation?.pathname).toEqual(`${Paths.artGallery}/${piece.id}`);
      });

      it('should scroll to the top of the page', async () => {
        renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

        fireEvent.load(screen.getByTestId(image));
        await userEvent.click(screen.getByTestId(image));

        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      });
    });

    describe('on image load error', () => {

      it('should not contain the piece', () => {
        renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

        fireEvent.error(screen.getByTestId(image));

        expect(screen.queryByTestId(image)).not.toBeInTheDocument();
      });

      it('should be errored', () => {
        renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

        fireEvent.error(screen.getByTestId(image));

        expect(screen.queryByTestId('error')).toBeInTheDocument();
      });

      it('should not be loading', () => {
        renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

        fireEvent.error(screen.getByTestId(image));

        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });
    });
  });

  describe('without an image', () => {
    it('should be loading', () => {
      renderWithRouter(<Image piece={{...piece, image: undefined}}/>, {
        params: {page: 3, tab: Source.AIC}
      });

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    it('should contain the image', () => {
      renderWithRouter(<Image piece={{...piece, image: undefined}}/>, {
        params: {page: 3, tab: Source.AIC}
      });

      expect(screen.queryByTestId(image)).not.toBeInTheDocument();
    });

    it('should not be errored', () => {
      renderWithRouter(<Image piece={{...piece, image: undefined}}/>, {
        params: {page: 3, tab: Source.AIC}
      });

      expect(screen.queryByTestId('error')).toBeInTheDocument();
    });
  });

  describe('disabling the link', () => {
    it('should not change location when clicked', async () => {
      const rendered = renderWithRouter(<Image piece={piece} linkEnabled={false}/>,
        {path: Paths.artGallery});

      await userEvent.click(screen.getByTestId(image));

      expect(rendered().testLocation?.pathname).toEqual(Paths.artGallery);
    });

    it('should not scroll to the top of the page', async () => {
      renderWithRouter(<Image piece={piece} linkEnabled={false}/>,
        {path: Paths.artGallery});

      await userEvent.click(screen.getByTestId(image));

      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
