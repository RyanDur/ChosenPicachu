import {UserInformation} from '../index';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {fillOutForm, users} from '../../../__tests__/util';
import {initialState} from '../reducer';
import {nanoid} from 'nanoid';
import {Mock} from 'vitest';

vi.mock('../../../avatars', () => ({
  generateAvatar: () => 'some random url'
}));
vi.mock('nanoid');

describe('a user form', () => {
  const [userInfo] = users;
  userInfo.avatar = 'some random url';
  beforeEach(() => {
    (nanoid as Mock).mockReturnValue(userInfo.id);
  });

  describe('filled out', () => {
    it('should be resettable', async () => {
      const consumer = vi.fn();
      render(<UserInformation onAdd={consumer}/>);
      await fillOutForm(userInfo);

      await userEvent.type(screen.getByLabelText('Details'), userInfo.details!);
      await userEvent.click(screen.getByText('Reset'));
      fireEvent.submit(screen.getByText('Add'));

      expect(consumer).toHaveBeenCalledWith(initialState);
    });

    describe('when adding a user', () => {
      it('should submit all the data', async () => {
        const consumer = vi.fn();
        render(<UserInformation onAdd={consumer}/>);

        await fillOutForm(userInfo);
        await userEvent.type(screen.getByLabelText('Details'), userInfo.details!);
        fireEvent.submit(screen.getByText('Add'));

        await waitFor(() => expect(consumer).toHaveBeenCalledWith(userInfo));
      });

      it('should reset the form', async () => {
        const consumer = vi.fn();
        render(<UserInformation onAdd={consumer}/>);
        await fillOutForm(userInfo);

        fireEvent.submit(screen.getByText('Add'));
        fireEvent.submit(screen.getByText('Add'));

        expect(consumer).toHaveBeenCalledWith(initialState);
      });
    });

    describe('work address', () => {
      test('should allow the user to auto copy the home address', async () => {
        const consumer = vi.fn();
        render(<UserInformation onAdd={consumer}/>);

        await fillOutForm(userInfo);
        await userEvent.type(screen.getByLabelText('Details'), userInfo.details!);
        await userEvent.click(screen.getByLabelText('Same as Home'));
        fireEvent.submit(screen.getByText('Add'));

        expect(consumer).toHaveBeenCalledWith({
          ...userInfo,
          workAddress: userInfo.homeAddress
        });
      });
    });
  });

  describe('validity', () => {
    it('should have some required fields', () => {
      const consumer = vi.fn();
      render(<UserInformation onAdd={consumer}/>);

      expect(screen.getByLabelText('First Name')).not.toBeValid();
      expect(screen.getByLabelText('Last Name')).not.toBeValid();
      expect(screen.getByLabelText('Date Of Birth')).not.toBeValid();
      expect(screen.getByTestId('home-address-street')).not.toBeValid();
      expect(screen.getByTestId('home-address-city')).not.toBeValid();
      expect(screen.getByTestId('home-address-state')).not.toBeValid();
      expect(screen.getByTestId('home-address-zip')).not.toBeValid();
    });

    describe('for a zip code', () => {
      const testZip = (kind: string): void => {
        test('a non-numeric', async () => {
          render(<UserInformation onAdd={vi.fn()}/>);
          const element = screen.getByTestId(`${kind}-address-zip`);

          await userEvent.type(element, 'a');

          expect(element).toHaveDisplayValue('a');
          expect(element).not.toBeValid();
        });

        test('a partial numeric', async () => {
          render(<UserInformation onAdd={vi.fn()}/>);
          const element = screen.getByTestId(`${kind}-address-zip`);

          await userEvent.type(element, '1');

          expect(element).toHaveDisplayValue('1');
          expect(element).not.toBeValid();
        });

        test('partial zip', async () => {
          render(<UserInformation onAdd={vi.fn()}/>);
          const element = screen.getByTestId(`${kind}-address-zip`);

          await userEvent.type(element, '60012');

          expect(element).toHaveDisplayValue('60012');
          expect(element).toBeValid();
        });

        test('full zip', async () => {
          render(<UserInformation onAdd={vi.fn()}/>);
          const element = screen.getByTestId(`${kind}-address-zip`);

          await userEvent.type(element, '12345-1234');

          expect(element).toHaveDisplayValue('12345-1234');
          expect(element).toBeValid();
        });
      };

      describe('for home', () => {
        testZip('home');
      });

      describe('for work', () => {
        testZip('work');
      });
    });
  });
});
