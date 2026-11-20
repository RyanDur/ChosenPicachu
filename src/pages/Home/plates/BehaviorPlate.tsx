import {FC, Fragment} from 'react';
import {PropsWithClassName} from '@components';
import {Frame} from './Frame';
import {Plate} from './Plate';
import {Lettered} from './Lettered';
import {Motion} from './Motion';
import {TurnHead} from './TurnHead';
import {Spot, thePage} from './thePage';

const sparkRadius = 1.2;
const besideTheSpark = sparkRadius * 4.4;
const lineUnder = thePage.letterSize * 1.3;
const eventNameSize = thePage.letterSize * 1.3;

const readsRightward = ({u}: Spot): boolean => u < thePage.plate.across / 2;

export const BehaviorPlate: FC<PropsWithClassName> = ({className}) =>
  <Plate className={className}>
    <Frame className="drawn-line drawn"/>
    <TurnHead/>
    {thePage.events.map(({word, call, spark, motion}) => {
      const rightward = readsRightward(spark);
      const wordsAcross = rightward ? spark.u + besideTheSpark : spark.u - besideTheSpark;
      const anchor = rightward ? 'start' : 'end';
      const nameLine = spark.v + sparkRadius;
      return <Fragment key={word}>
        <Motion kind={motion} cx={spark.u} cy={spark.v} radius={sparkRadius} ellipseRatio={1}/>
        <circle className="markup-attribute-filled" cx={spark.u} cy={spark.v} r={sparkRadius}/>
        <Lettered className="markup-attribute-filled" x={wordsAcross} y={nameLine} fontSize={eventNameSize}
          textLength={thePage.widthOf(word, eventNameSize)} textAnchor={anchor}>{word}</Lettered>
        <Lettered className="ink-filled" x={wordsAcross} y={nameLine + lineUnder} fontSize={thePage.letterSize}
          textLength={thePage.widthOf(call, thePage.letterSize)} textAnchor={anchor}>{call}</Lettered>
      </Fragment>;
    })}
  </Plate>;
