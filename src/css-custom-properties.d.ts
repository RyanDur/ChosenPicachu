import 'csstype';

declare module 'csstype' {
  // augmenting csstype only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Properties {
    '--carried'?: string;
    '--toward'?: string;
    '--drop'?: string;
    '--seat-height'?: string;
    '--share'?: string;
    '--flight-x'?: string;
    '--flight-y'?: string;
    '--flight-width'?: string;
    '--drift-x'?: string;
    '--drift-y'?: string;
    '--explode-x'?: string;
    '--explode-y'?: string;
  }
}
