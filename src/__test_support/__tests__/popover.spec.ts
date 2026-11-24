const aPopover = (): HTMLElement => {
  const popover = document.createElement('section');
  popover.setAttribute('popover', 'manual');
  document.body.append(popover);
  return popover;
};

describe('a popover in the test page', () => {
  afterEach(() => document.body.replaceChildren());

  test('should match popover-open once shown', () => {
    const popover = aPopover();

    popover.showPopover();

    expect(popover.matches(':popover-open')).toBe(true);
  });

  test('should not match popover-open once hidden', () => {
    const popover = aPopover();
    popover.showPopover();

    popover.hidePopover();

    expect(popover.matches(':popover-open')).toBe(false);
  });
});
