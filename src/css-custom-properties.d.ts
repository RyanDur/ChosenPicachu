import 'csstype';

declare module 'csstype' {
  // augmenting csstype only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Properties {
    '--carried'?: string;
    '--along'?: string;
    '--glider-x'?: string;
    '--glider-width'?: string;
    '--stage-block-size'?: string;
    '--toward'?: string;
    '--drop'?: string;
    '--share'?: string;
    '--drift-x'?: string;
    '--drift-y'?: string;
    '--carried-by'?: string;
    '--settling-from'?: string;
    '--shoved-by'?: string;
    '--explode-x'?: string;
    '--explode-y'?: string;
    '--turn'?: string;
    '--swing'?: string;
    '--term-anchor'?: string;
  }
}
