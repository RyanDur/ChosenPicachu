import 'csstype';

declare module 'csstype' {
  // augmenting csstype only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Properties {
    '--along'?: string;
    '--stage-block-size'?: string;
    '--toward'?: string;
    '--share'?: string;
    '--drift-x'?: `${number}px`;
    '--drift-y'?: `${number}px`;
    '--seat-x'?: `${number}px`;
    '--seat-y'?: `${number}px`;
    '--settle-x'?: `${number}px`;
    '--settle-y'?: `${number}px`;
    '--settle-drift-x'?: `${number}px`;
    '--settle-drift-y'?: `${number}px`;
    '--shoved-by'?: `${number}px`;
    '--explode-x'?: `${number}px`;
    '--explode-y'?: `${number}px`;
    '--turn'?: `${number}deg`;
    '--swing'?: `${number}deg`;
    '--term-anchor'?: string;
  }
}
