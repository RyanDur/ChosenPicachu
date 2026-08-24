import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {EagerKeepStaticTable} from '@components/DragSortableTable';

describe('resizable columns', () => {
  const sized = [
    {display: 'name', column: 'name'},
    {display: 'age', column: 'age'}
  ];
  const people = [{name: {display: 'Ada'}, age: {display: '36'}}];

  const nameHeader = () => screen.getByRole('columnheader', {name: /^name/});
  const ageHeader = () => screen.getByRole('columnheader', {name: /^age/});
  const surveyed = () => {
    const table = screen.getByRole('table');
    table.getBoundingClientRect = () => ({
      width: 1000, height: 0, x: 0, y: 0, top: 0, left: 0, right: 1000, bottom: 0, toJSON: () => ({})
    });
    const widths = [625, 375];
    screen.getAllByRole('columnheader').forEach((header, at) => {
      header.getBoundingClientRect = () => ({
        width: widths[at], height: 0, x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, toJSON: () => ({})
      });
    });
  };

  test('the css owns the widths until a hand arrives', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} resizableColumns/>);

    expect(screen.getByRole('table').classList).toContain('apportioned');
    expect(nameHeader().style.width).toBe('');
    expect(ageHeader().style.width).toBe('');
    expect(screen.getByRole('button', {name: 'resize name'})).toBeVisible();
  });

  test('the first touch surveys the headers into the ledger', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} resizableColumns/>);
    surveyed();

    fireEvent.focus(screen.getByRole('button', {name: 'resize name'}));

    expect(screen.getByRole('button', {name: 'resize name, 63%'})).toBeVisible();
    expect(nameHeader().style.getPropertyValue('--share')).toBe('62.5%');
    expect(ageHeader().style.getPropertyValue('--share')).toBe('37.5%');
  });

  test('the keyboard moves the boundary and the total holds', async () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} resizableColumns/>);
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize name'});
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(nameHeader().style.getPropertyValue('--share')).toBe('64.5%');
    expect(ageHeader().style.getPropertyValue('--share')).toBe('35.5%');
    expect(screen.getByRole('button', {name: 'resize name, 65%'})).toBeVisible();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(nameHeader().style.getPropertyValue('--share')).toBe('60.5%');
    expect(ageHeader().style.getPropertyValue('--share')).toBe('39.5%');
  });

  test('dragging the handle trades share between neighbors', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} resizableColumns/>);
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize name'});
    fireEvent.pointerDown(handle, {clientX: 300, pointerId: 1});
    fireEvent.pointerMove(handle, {clientX: 340, pointerId: 1});
    fireEvent.pointerUp(handle, {pointerId: 1});

    expect(nameHeader().style.getPropertyValue('--share')).toBe('66.5%');
    expect(ageHeader().style.getPropertyValue('--share')).toBe('33.5%');
  });

  test('a resize says the new share', async () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} resizableColumns/>);
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize name'});
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('status')).toHaveTextContent('name resized to 65%');
  });

  test('a boundary can never starve a column', async () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} resizableColumns/>);
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize age'});
    handle.focus();
    await userEvent.keyboard('{ArrowRight}'.repeat(30));
    expect(ageHeader().style.getPropertyValue('--share')).toBe('95%');
    expect(nameHeader().style.getPropertyValue('--share')).toBe('5%');
  });

  test('resizable columns truncate their values and clip their titles', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} resizableColumns/>);

    expect(nameHeader().classList).toContain('clipped');
    within(screen.getAllByRole('rowgroup')[1]).getAllByRole('cell')
      .forEach(cell => expect(cell.classList).toContain('ellipsis'));
  });

  test('without the opt-in the columns stay plain', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people}/>);

    expect(screen.queryAllByRole('button', {name: /^resize/})).toHaveLength(0);
    screen.getAllByRole('cell').forEach(cell => expect(cell.classList).not.toContain('ellipsis'));
  });
});
