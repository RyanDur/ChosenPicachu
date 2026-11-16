import {FC} from 'react';
import {OriginDial} from '../../../Controls';
import {carve, Codes, DialStep, lines, Mdn, Sample, Says, Snippet, StepHeading, Want, Words} from '../../../Recipe';
import {sources} from './sources';

export const FadeOrigin: FC<{itemSource: Sample}> = ({itemSource}) =>
  <DialStep>
    <StepHeading title="Fade the lifted card almost away"><OriginDial name="native-origin"/></StepHeading>
    <Words>
      <Want>With the drag image under the pointer, the card it came from reads as a duplicate, but removing it can end
        the drag: some engines stop the drag when its source disappears.</Want>
      <Says>So the card does not disappear; it fades almost away. This is the hide list, so its Item reads which item is
        held from the list’s state and wears the class while it is the held one. The CSS behind the class is
        an <Mdn path="Web/CSS/opacity">opacity</Mdn> of nearly nothing: the node stays in the page, the drag keeps its
        source, and the reader sees one card moving with the pointer.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.between(itemSource, 'const {held, gripped} = useDragSort();', 'const {held, gripped} = useDragSort();'), lines.blank,
        ...carve.between(itemSource, "className={classNames('draggable'", "held.map(lifted => lifted.item === item).orElse(false) && 'hide', className)}")
      ]}/>
      <Snippet label="CSS" lines={[
        ...carve.unit(sources.hideItemCss, '.draggable.hide {'),
        lines.aside('/* opacity, not visibility: a card hidden by visibility is out of view, and so is the drag’s source */')
      ]}/>
    </Codes>
  </DialStep>;
