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

  test('should refuse to show an element that is not a popover', () => {
    const plain = document.createElement('section');
    document.body.append(plain);

    expect(() => plain.showPopover()).toThrow(expect.objectContaining({name: 'NotSupportedError'}));
  });

  test('should refuse to show a popover that is not in the page', () => {
    const popover = document.createElement('section');
    popover.setAttribute('popover', 'manual');

    expect(() => popover.showPopover()).toThrow(expect.objectContaining({name: 'InvalidStateError'}));
  });

  test('should refuse to hide an element that is not a popover', () => {
    const plain = document.createElement('section');
    document.body.append(plain);

    expect(() => plain.hidePopover()).toThrow(expect.objectContaining({name: 'NotSupportedError'}));
  });
});
