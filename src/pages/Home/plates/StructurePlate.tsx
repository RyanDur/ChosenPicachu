import {FC} from 'react';
import {PropsWithClassName} from '@components';
import {Edge} from './Edge';
import {Plate} from './Plate';
import {MarkupLines} from './MarkupLines';

export const StructurePlate: FC<PropsWithClassName> = ({className}) =>
  <Plate className={className}>
    <Edge className="slab-line drawn"/>
    <MarkupLines/>
  </Plate>;
