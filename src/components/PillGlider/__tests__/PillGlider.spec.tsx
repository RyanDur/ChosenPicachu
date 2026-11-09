import {render} from '@testing-library/react';
import {FC, useState} from 'react';
import {PillGlider} from '../index';
import {pillGlider} from '../__test_support/glider';

const styles = [
  {words: 'Eager', value: 'eager'},
  {words: 'Lazy', value: 'lazy'},
  {words: 'Hide Eager', value: 'hide-eager'},
  {words: 'Hide Lazy', value: 'hide-lazy'}
];

const Choosing: FC = () => {
  const [chosen, choose] = useState('eager');
  return <PillGlider label="drag style" name="drag-style" choices={styles} chosen={chosen} onChosen={choose}/>;
};

describe('the pill glider', () => {
  test('offers every style as a radio in a named group, the chosen one checked', () => {
    render(<PillGlider label="drag style" name="drag-style" choices={styles}
      chosen="eager" onChosen={() => undefined}/>);

    expect(pillGlider.group('drag style')).toBeVisible();
    expect(pillGlider.choices()).toEqual(['Eager', 'Lazy', 'Hide Eager', 'Hide Lazy']);
    expect(pillGlider.choice('Eager')).toBeChecked();
  });

  test('choosing a pill makes it the chosen one', async () => {
    render(<Choosing/>);

    await pillGlider.choose('Hide Lazy');

    expect(pillGlider.choice('Hide Lazy')).toBeChecked();
    expect(pillGlider.choice('Eager')).not.toBeChecked();
  });
});
