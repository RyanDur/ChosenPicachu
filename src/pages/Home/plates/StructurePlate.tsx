import {FC} from 'react';
import {PropsWithClassName} from '@components';
import {Frame} from './Frame';
import {Plate} from './Plate';
import {MarkupLines} from './MarkupLines';

export const StructurePlate: FC<PropsWithClassName> = ({className}) =>
  <Plate className={className}>
    <Frame className="slab-line drawn"/>
    <MarkupLines/>
  </Plate>;
