import {FC} from 'react';
import {classNames, PropsWithClassName} from '@components';
import {Frame} from './Frame';
import {Plate} from './Plate';
import {Lettered} from './Lettered';
import {thePage} from './thePage';

export const PresentationPlate: FC<PropsWithClassName> = ({className}) =>
  <Plate className={className}>
    <Frame className="drawn-line drawn"/>
    {thePage.regions.map(({name, tint, footprint}) =>
      <rect key={name} className={classNames('drawn-line drawn', tint)} x={footprint.u} y={footprint.v} width={footprint.across}
        height={footprint.down}/>)}
    {thePage.regions.map(({name, namedFlatAt}) =>
      <Lettered key={name} className="ink-filled" x={namedFlatAt.u} y={namedFlatAt.v} fontSize={thePage.letterSize}
        textLength={thePage.widthOf(name, thePage.letterSize)} textAnchor="middle">{name}</Lettered>)}
  </Plate>;
