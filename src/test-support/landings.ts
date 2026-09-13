export type Landing = [number, number];

export const landingsDuring = async (target: Window | Element, act: () => Promise<void>): Promise<Landing[]> => {
  const landings: Landing[] = [];
  const recorder = vi.spyOn(target, 'scrollTo').mockImplementation((...args: unknown[]) => {
    const [x, y] = args;
    if (typeof x === 'number' && typeof y === 'number') {
      landings.push([x, y]);
    }
  });
  try {
    await act();
  } finally {
    recorder.mockRestore();
  }
  return landings;
};
