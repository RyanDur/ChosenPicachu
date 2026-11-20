import {FC, Fragment, useId} from 'react';
import {PropsWithClassName} from '@components';
import {Edge} from './Edge';
import {Plate} from './Plate';
import {Lettered} from './Lettered';
import {motions} from './motions';
import {TurnHead} from './TurnHead';
import {Spot, thePage} from './thePage';

const sparkRadius = 1.2;
const besideTheSpark = sparkRadius * 4.4;
const turnHeadWidth = sparkRadius * 1.3;
const lineUnder = thePage.letterSize * 1.3;
const eventNameSize = thePage.letterSize * 1.3;

const readsRightward = ({u}: Spot): boolean => u < thePage.plate.across / 2;

export const BehaviorPlate: FC<PropsWithClassName> = ({className}) => {
  const turnHead = useId();
  return <Plate className={className}>
    <Edge className="drawn-line drawn"/>
    <TurnHead id={turnHead} markerWidth={turnHeadWidth}/>
    {thePage.events.map(({word, call, spark, motion}) => {
      const rightward = readsRightward(spark);
      const wordsAcross = rightward ? spark.u + besideTheSpark : spark.u - besideTheSpark;
      const anchor = rightward ? 'start' : 'end';
      const nameLine = spark.v + sparkRadius;
      const Moving = motions[motion];
      return <Fragment key={word}>
        <Moving cx={spark.u} cy={spark.v} rx={sparkRadius} ry={sparkRadius} markerEnd={`url(#${turnHead})`}/>
        <circle className="markup-attribute-filled" cx={spark.u} cy={spark.v} r={sparkRadius}/>
        <Lettered className="markup-attribute-filled" x={wordsAcross} y={nameLine} fontSize={eventNameSize}
          textLength={thePage.widthOf(word, eventNameSize)} textAnchor={anchor}>{word}</Lettered>
        <Lettered className="ink-filled" x={wordsAcross} y={nameLine + lineUnder} fontSize={thePage.letterSize}
          textLength={thePage.widthOf(call, thePage.letterSize)} textAnchor={anchor}>{call}</Lettered>
      </Fragment>;
    })}
  </Plate>;
};
