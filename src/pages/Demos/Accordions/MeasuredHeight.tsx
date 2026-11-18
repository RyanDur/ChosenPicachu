import {FC} from 'react';
import {classNames} from '@components';
import {DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {DialGroup, useControls} from '../Controls';
import {FoldType} from '../ReaderSettings';
import {carve, Line, lines, Sample, Snippet} from '../Recipe';
import {Fold} from './accordion-props';
import {ExclusiveMeasuredAccordion} from './ExclusiveMeasuredAccordion';
import {InclusiveMeasuredAccordion} from './InclusiveMeasuredAccordion';
import {FoldMotionDial} from './FoldMotionDial';
import {FoldTypeDial} from './FoldTypeDial';
import {foldInput} from './fold-input';
import {looks} from './looks';
import {PartLink} from './PartLink';
import {RemembersTheFoldLink} from './RemembersTheFoldLink';
import {TabPartLink} from './TabPartLink';
import {PlainFold} from './Plain';
import exclusiveMeasuredAccordionSource from './ExclusiveMeasuredAccordion.tsx?sample';
import inclusiveMeasuredAccordionSource from './InclusiveMeasuredAccordion.tsx?sample';
import openFoldsSource from './open-folds.ts?sample';
import panelSource from './MeasuredPanel.tsx?sample';
import foldSource from './Plain/fold.main.ts?sample';
import accordionsCss from './Accordions.css?sample';
import oldWayMotionCss from './OldWayMotion.css?sample';
import '../Runs.css';
import {Build} from './build';
import './PartDepth.css';

const sharedOpenFolds = (source: Sample): Line[] =>
  lines.fromTheExhibit(carve.elided(carve.between(source, 'const [open, dispatch] = useReducer(', '</OpenFolds.Provider>;'), '<article', '</OpenFolds.Provider>;', '{/* …the folds */}'));

const measuredBuilds: Record<FoldType, Build> = {
  inclusive: {Accordion: InclusiveMeasuredAccordion, sample: sharedOpenFolds(inclusiveMeasuredAccordionSource)},
  exclusive: {Accordion: ExclusiveMeasuredAccordion, sample: sharedOpenFolds(exclusiveMeasuredAccordionSource)}
};

type Props = {
  folds: Record<FoldType, Fold[]>;
};

export const MeasuredHeight: FC<Props> = ({folds}) => {
  const {foldType, foldMotion} = useControls();
  const exhibitMoving = classNames(looks.exhibit, foldMotion);
  const input = foldInput.of(foldType);
  const {Accordion: Measured, sample} = measuredBuilds[foldType];
  return <>
    <p className="paragraph">This part builds on two before it:
      “<PartLink part="a-box-remembers-the-fold"/>”, for the {input} and its label, and
      “<TabPartLink heading="max-height-guess-heading"/>”, which this part answers.</p>
    <DialGroup>
      <FoldTypeDial/>
      <FoldMotionDial/>
    </DialGroup>
    <figure className={looks.exhibit}>
      <PlainFold/>
      <figcaption className="caption">This fold is a separate page, placed inside this one, so the choices the address
        carries do not reach it. It is one fold, and its text is uncovered from the top down. Press the bar. With
        motion allowed, a script measures the text, and the style sheet slides the panel to that height. A second
        press slides it shut. With less motion asked for, it opens at once.</figcaption>
    </figure>
    <ol className={looks.runs}>
      <li className="run">
        <p className="paragraph">Most of us turned next to script. A transition can move a height to a number,
          so the script supplies the number. When a fold opens, the script measures the text’s real height and gives
          the panel that height, and the style sheet’s transition moves the panel from 0 to it. Every fold
          moves the same way, short or tall, because the target is the text’s own height. When the motion
          ends, the script takes the number away, and the panel is auto again. A number left in place goes
          stale: narrow the window, the text wraps onto more lines, and a fixed height cuts it off. The script
          beside this run is the whole script, with no library.</p>
        <Snippet label="TS" lines={lines.fromTheExhibit(carve.withoutImports(foldSource))}/>
      </li>
      <li className="run">
        <p className="paragraph">The script hands the height to the style sheet as a custom property
          named <code className="monospaced unbroken">--measured-height</code>. A custom property is a value the
          style sheet can read. The script also marks the panel with
          a <RemembersTheFoldLink>class</RemembersTheFoldLink>, a name a rule picks it out
          by: <code className="monospaced">sized</code>. While <code className="monospaced">sized</code> is on, a rule
          reads the number.</p>
        <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(accordionsCss, '.info-toggle ~ .info-measured.sized {'))}/>
      </li>
      <li className="run">
        <p className="paragraph">On a press that moves the panel, the script first pins where the slide starts. It
          writes the panel’s current height. It puts on a second
          class, <code className="monospaced">unmoving</code>, which turns off the
          height’s transition. It reads the panel’s height once and throws the number away; the read makes the
          browser apply the pinned start before it draws. Then it
          takes <code className="monospaced">unmoving</code> off and sets the end, and the
          style sheet slides between the two.</p>
        <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(oldWayMotionCss, '.info-toggle ~ .info-measured.unmoving {'))}/>
      </li>
      <li className="run">
        <p className="paragraph">The cost was script. The motion needs it, but whether a fold is open does not:
          the checkbox and the style sheet own that, so if the script fails, a fold still opens and closes, at
          once.</p>
        <Snippet label="CSS" lines={lines.fromTheExhibit([
          ...carve.unit(oldWayMotionCss, ':is(.reveal, .drawer) & .info-measured {'), lines.blank,
          ...carve.unit(accordionsCss, '.info-toggle:not(:checked) ~ .info-measured {')
        ])}/>
      </li>
      <li className="part-depth">
        <details aria-labelledby="measured-depth">
          <summary id="measured-depth" className="fold-bar bold">How this page builds it</summary>
          <p className="paragraph">This page builds the same fold in React for its exhibit, and the runs below say what React and
            state are as they come. What changes is the shape. The plain script listens for the press; the React
            build redraws the panel from its state, so the measuring runs in two steps React takes before the
            browser paints: the first pins where the motion starts, and the second sets where it ends.</p>
          <Measured className={exhibitMoving} folds={folds[foldType]}/>
          <ol className="runs">
            {foldType === 'exclusive' && <li className="run">
              <p className="paragraph">Opening one fold closes the others, and the short Close bar at the top closes
                whichever is open.</p>
            </li>}
            <li className="run">
              <p className="paragraph">React, the library this site’s script is written in, keeps which folds are
                open as the accordion’s state: a value React keeps between draws and draws the page from. The
                accordion hands that state to every panel inside through a context, and each panel reads from it
                whether its own fold is open. The <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> explains
                state and context in full.</p>
              <Snippet label="TS" lines={lines.fromTheExhibit([
                ...sample, lines.blank,
                ...carve.unit(openFoldsSource, 'export const openFolds')
              ])}/>
            </li>
            <li className="run">
              <p className="paragraph">A panel keeps state of its own too: whether it is shown and, while it moves,
                the height the motion starts from, the height it ends at, and whether it has started. It changes
                that state through a reducer, sending each change with <code className="monospaced">dispatch</code>,
                as the z-index tab shows.</p>
              <Snippet label="TS" lines={lines.fromTheExhibit([
                ...carve.unit(panelSource, 'type Motion ='), lines.blank,
                ...carve.unit(panelSource, 'type Panel ='), lines.blank,
                ...carve.unit(panelSource, 'type PanelChange ='), lines.blank,
                ...carve.between(panelSource, 'const open = useOpenFolds()', 'const [{shown, motion}, dispatch] = useReducer(')
              ])}/>
            </li>
            <li className="run">
              <p className="paragraph">A ref is a handle on the element itself. The script uses the panel’s one ref
                only to measure: the text’s height, the height the panel stands at, and whether the style sheet
                gives the height a transition at all.</p>
              <Snippet label="TS" lines={lines.fromTheExhibit([
                ...carve.between(panelSource, 'const panel = useRef<HTMLElement>(null);', 'const panel = useRef<HTMLElement>(null);'), lines.blank,
                ...carve.unit(panelSource, 'const textHeight'), lines.blank,
                ...carve.unit(panelSource, 'const standing'), lines.blank,
                ...carve.unit(panelSource, 'const moves')
              ])}/>
            </li>
            <li className="run">
              <p className="paragraph">The script makes the moves in two layout effects, code React runs after it
                has updated the elements and before the browser paints them. The first answers a press by pinning
                where the motion starts. The second, once that start is on the page, sets where it ends. The press,
                the pinned start and the settled end are
                actions, <code className="monospaced">pressed</code>, <code className="monospaced">pinned</code> and <code className="monospaced">settled</code>,
                and the reducer, <code className="monospaced">nextPanel</code>, makes the panel’s next state from
                each. So the script measures the panel and pins its start with no frame showing in between.</p>
              <Snippet label="TS" lines={lines.fromTheExhibit([
                ...carve.unit(panelSource, 'const motionOnPress'), lines.blank,
                ...carve.unit(panelSource, 'const panelChange = {'), lines.blank,
                ...carve.unit(panelSource, 'const nextPanel'), lines.blank,
                ...carve.between(panelSource, 'useLayoutEffect(() => {\n    const measured', '}, [motion, open]);'), lines.blank,
                ...carve.unit(panelSource, 'const settled')
              ])}/>
            </li>
            <li className="run">
              <p className="paragraph">The React build hands each height to the style sheet through the
                same <code className="monospaced unbroken">--measured-height</code>. The style sheet declares that
                property with <code className="monospaced">@property</code>, a rule that tells the browser what kind
                of value a custom property holds and what it is until something sets it: here a length or auto,
                starting as auto.</p>
              <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(accordionsCss, '@property --measured-height {'))}/>
            </li>
            <li className="run">
              <p className="paragraph">The React build marks the panel <code className="monospaced">sized</code> as
                the plain one does. While <code className="monospaced">sized</code> is on, the panel’s height
                reads <code className="monospaced unbroken">--measured-height</code>.</p>
              <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(accordionsCss, '.info-toggle ~ .info-measured.sized {'))}/>
            </li>
            <li className="run">
              <p className="paragraph">Closing runs the other way: the script sets the open height as the start and
                0 as the end, and the transition moves between them. The change event is the one the browser sends
                to the {input} a press has just {foldType === 'exclusive' ? 'checked' : 'checked or unchecked'}, and to
                no other. By the time it fires, Firefox and Safari have already applied the pressed box’s new style.
                So the script pins the start first, with <code className="monospaced">unmoving</code>, as the plain
                script does.</p>
              <Snippet label="TS" lines={lines.fromTheExhibit([
                ...carve.between(panelSource, "useLayoutEffect(() => {\n    const measured = panel.current;\n    if (motion.kind === 'pinned'", '}, [motion, open]);'), lines.blank,
                ...carve.unit(panelSource, 'return <section ref={panel}')
              ])}/>
              <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(oldWayMotionCss, '.info-toggle ~ .info-measured.unmoving {'))}/>
            </li>
            <li className="run">
              <p className="paragraph">A press while the panel moves
                keeps <code className="monospaced">sized</code> on and only sets a new end, so the
                panel turns around from where it is. If that end is where the panel already stands, no motion is
                left to run, and the script takes the number away at once.</p>
              <Snippet label="TS" lines={lines.fromTheExhibit([
                ...carve.unit(panelSource, 'const movingTo')
              ])}/>
            </li>
            {foldType === 'exclusive' && <li className="run">
              <p className="paragraph">A radio that loses its check gets no event at all. The change event the
                pressed radio gets rises from it through the elements around it, which is called bubbling. The list
                item around the radio handles it by dispatching <code className="monospaced">opened</code> with the bar
                that names its fold. The accordion’s reducer keeps that one fold open and closes the rest, and each
                panel reads from the context whether its fold is still the open one.</p>
              <Snippet label="TS" lines={lines.fromTheExhibit(carve.between(exclusiveMeasuredAccordionSource, '<li className="fold" key={heading} onChange={() => dispatch(', '<MeasuredPanel namedBy={barOf(id)}>'))}/>
            </li>}
          </ol>
        </details>
      </li>
    </ol>
  </>;
};
