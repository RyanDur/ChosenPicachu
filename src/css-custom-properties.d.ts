import 'csstype';

declare module 'csstype' {
  // augmenting csstype only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Properties {
    '--along'?: string;
    '--stage-block-size'?: string;
    '--toward'?: string;
    '--share'?: string;
    '--drift-x'?: string;
    '--drift-y'?: string;
    '--seat-x'?: string;
    '--seat-y'?: string;
    '--settle-x'?: string;
    '--settle-y'?: string;
    '--settle-drift-x'?: string;
    '--settle-drift-y'?: string;
    '--shoved-by'?: string;
    '--explode-x'?: string;
    '--explode-y'?: string;
    '--turn'?: string;
    '--swing'?: string;
    '--term-anchor'?: string;
  }
}
