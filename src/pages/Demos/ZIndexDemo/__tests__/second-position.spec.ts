import {secondPosition} from '../second-position';

const {measuredFrom} = secondPosition;

describe('what Second is measured from', () => {
  test('a static Second is measured from nowhere', () => {
    expect(measuredFrom('static', 'positioned')).toBe('nowhere');
  });

  test('a relative Second is measured from its own place', () => {
    expect(measuredFrom('relative', 'positioned')).toBe('own-place');
  });

  test('an absolute Second with a positioned parent is measured from the parent', () => {
    expect(measuredFrom('absolute', 'positioned')).toBe('parent');
  });

  test('an absolute Second with no positioned parent is measured from the little page', () => {
    expect(measuredFrom('absolute', 'not-positioned')).toBe('little-page');
  });

  test('a fixed Second is measured from the view', () => {
    expect(measuredFrom('fixed', 'positioned')).toBe('view');
  });

  test('a sticky Second is measured from the scroll edge', () => {
    expect(measuredFrom('sticky', 'positioned')).toBe('scroll-edge');
  });
});
