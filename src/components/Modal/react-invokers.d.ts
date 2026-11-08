import 'react';

declare module 'react' {
  // the platform's invoker commands are not in React's types yet; augmenting only works through interface merging
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface ButtonHTMLAttributes<T> {
    command?: 'show-modal' | 'close' | 'request-close';
    commandfor?: string;
  }
}
