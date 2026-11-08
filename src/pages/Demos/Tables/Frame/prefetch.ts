type Prefetch = {
  assembly: () => void;
};

export const prefetch: Prefetch = {
  assembly: () => {
    void import('./assemble').catch(() => undefined);
  }
};
