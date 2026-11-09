import {FC} from 'react';
import {Codes, Snippet, carve, Sample} from '../../../Recipe';
import {useControls} from '../../../Controls';
import {elidedHeaders} from '../elidedHeaders';

export const TheWholeBuild: FC<{tableSource: Sample; buildSource: Sample}> =
  ({tableSource, buildSource}) => {
    const {world} = useControls();
    return <Codes>
      {world === 'react'
        ? <Snippet label="TS" lines={elidedHeaders(carve.withoutImports(tableSource))}/>
        : <Snippet label="TS" lines={carve.withoutImports(buildSource)}/>}
    </Codes>;
  };
