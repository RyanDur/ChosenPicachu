import 'csstype';

declare module 'csstype' {
  // augmenting csstype only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Properties {
    '--lane'?: string;
    '--share'?: string;
  }
}
