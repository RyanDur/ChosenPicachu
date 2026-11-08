import {FC} from 'react';
import {Codes, Snippet, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';

export const TheWholeBuild: FC<{world: World; tableSource: Sample; buildSrc: Sample}> =
  ({world, tableSource, buildSrc}) =>
    <Codes>
      {world === 'react'
        ? <Snippet label="TS" lines={carve.withoutImports(tableSource)}/>
        : <Snippet label="TS" lines={carve.withoutImports(buildSrc)}/>}
    </Codes>;
